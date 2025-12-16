import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Mapping des plans vers les prix Stripe
const PLAN_PRICES = {
  'basic': 'price_basic_69', // 69€
  'premium': 'price_premium_129', // 129€
  'premium_plus': 'price_premium_199' // 199€
};

const PLAN_AMOUNTS = {
  'basic': 69,
  'premium': 129,
  'premium_plus': 199
};

export async function POST(request: NextRequest) {
  try {
    // ✅ SÉCURITÉ : Récupérer l'utilisateur depuis le token Firebase
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // ✅ Body minimal et sécurisé
    const { plan, prorata = true } = await request.json();
    
    if (!PLAN_PRICES[plan as keyof typeof PLAN_PRICES]) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    // Récupérer l'artisan depuis la session utilisateur
    const artisanQuery = await adminDb.collection('artisans')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (artisanQuery.empty) {
      return NextResponse.json({ error: 'Artisan non trouvé' }, { status: 404 });
    }

    const artisanDoc = artisanQuery.docs[0];
    const artisanData = artisanDoc.data();
    
    if (!artisanData.stripeSubscriptionId) {
      return NextResponse.json({ error: 'Aucun abonnement Stripe trouvé' }, { status: 400 });
    }

    // Récupérer la subscription Stripe actuelle
    const subscription = await stripe.subscriptions.retrieve(artisanData.stripeSubscriptionId);
    
    if (subscription.status !== 'active') {
      return NextResponse.json({ error: 'Abonnement non actif' }, { status: 400 });
    }

    // Vérifier si c'est vraiment un upgrade (pas un downgrade)
    const currentAmount = subscription.items.data[0].price?.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0;
    const newAmount = PLAN_AMOUNTS[plan as keyof typeof PLAN_AMOUNTS];
    
    if (newAmount <= currentAmount) {
      return NextResponse.json({ error: 'Seuls les upgrades sont autorisés' }, { status: 400 });
    }

    // 1. Upgrade de la subscription
    const updatedSubscription = await stripe.subscriptions.update(
      artisanData.stripeSubscriptionId,
      {
        items: [{
          id: subscription.items.data[0].id,
          price: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
        }],
        proration_behavior: prorata ? 'create_prorations' : 'none',
      }
    );

    // 2. ✅ FACTURATION IMMÉDIATE si prorata activé
    let invoice = null;
    if (prorata) {
      invoice = await stripe.invoices.create({
        customer: artisanData.stripeCustomerId,
        subscription: artisanData.stripeSubscriptionId,
        auto_advance: true, // Finalise automatiquement
      });
      
      // Finaliser l'invoice pour encaissement immédiat
      await stripe.invoices.finalizeInvoice(invoice.id);
    }

    // 3. Mettre à jour Firestore immédiatement (sera confirmé par webhook)
    const updateData: any = {
      currentPlan: plan,
      stripePriceId: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
      monthlySubscriptionPrice: newAmount,
      subscriptionStatus: updatedSubscription.status,
      currentPeriodEnd: new Date((updatedSubscription as any).current_period_end * 1000),
      updatedAt: new Date()
    };

    // Activer premium si plan premium
    if (plan !== 'basic') {
      updateData['premiumFeatures.isPremium'] = true;
      updateData['premiumFeatures.premiumType'] = 'monthly';
      if (!artisanData.premiumFeatures?.premiumStartDate) {
        updateData['premiumFeatures.premiumStartDate'] = new Date();
      }
    }

    await artisanDoc.ref.update(updateData);

    // 4. Mettre à jour la collection subscriptions
    await adminDb.collection('subscriptions').doc(updatedSubscription.id).update({
      monthlyPrice: newAmount,
      status: updatedSubscription.status,
      stripePriceId: PLAN_PRICES[plan as keyof typeof PLAN_PRICES],
      currentPeriodStart: new Date((updatedSubscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((updatedSubscription as any).current_period_end * 1000),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Upgrade réussi',
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        plan: plan,
        amount: newAmount,
        prorata: prorata,
        invoiceId: invoice?.id
      }
    });

  } catch (error: any) {
    console.error('Erreur upgrade subscription:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upgrade',
      details: error.message 
    }, { status: 500 });
  }
}
