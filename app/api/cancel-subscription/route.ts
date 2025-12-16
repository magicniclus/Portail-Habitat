import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Fonction pour créer ou récupérer un prix Stripe dynamiquement
async function getOrCreateStripePrice(planType: string, amount: number) {
  try {
    // 1. Chercher un produit existant ou le créer
    const products = await stripe.products.list({ limit: 100 });
    let product = products.data.find(p => p.name === 'Abonnement Portail Habitat');
    
    if (!product) {
      product = await stripe.products.create({
        name: 'Abonnement Portail Habitat',
        description: 'Abonnement pour artisans sur Portail Habitat',
        metadata: { type: 'subscription' }
      });
    }

    // 2. Chercher un prix existant pour ce montant
    const prices = await stripe.prices.list({
      product: product.id,
      currency: 'eur',
      type: 'recurring',
      limit: 100
    });

    const existingPrice = prices.data.find(p => 
      p.unit_amount === amount * 100 && 
      p.recurring?.interval === 'month'
    );

    if (existingPrice) {
      console.log(`Prix existant trouvé pour ${amount}€:`, existingPrice.id);
      return existingPrice.id;
    }

    // 3. Créer un nouveau prix
    const newPrice = await stripe.prices.create({
      currency: 'eur',
      unit_amount: amount * 100, // Convertir en centimes
      recurring: { interval: 'month' },
      product: product.id,
      nickname: `${planType} - ${amount}€/mois`,
      metadata: {
        plan_type: planType,
        monthly_amount: amount
      }
    });

    console.log(`Nouveau prix créé pour ${amount}€:`, newPrice.id);
    return newPrice.id;

  } catch (error) {
    console.error('Erreur création prix Stripe:', error);
    throw new Error(`Impossible de créer le prix pour ${amount}€`);
  }
}

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
    
    console.log('Annulation abonnement pour artisan:', {
      id: artisanDoc.id,
      stripeSubscriptionId: artisanData.stripeSubscriptionId,
      subscriptionStatus: artisanData.subscriptionStatus
    });

    if (!artisanData.stripeSubscriptionId) {
      return NextResponse.json({ error: 'Aucun abonnement à annuler' }, { status: 400 });
    }

    // Récupérer l'abonnement Stripe
    const subscription = await stripe.subscriptions.retrieve(artisanData.stripeSubscriptionId);
    
    if (subscription.status === 'canceled') {
      return NextResponse.json({ error: 'Abonnement déjà annulé' }, { status: 400 });
    }

    // Annuler l'abonnement à la fin de la période (plus simple et fiable)
    const canceledSubscription = await stripe.subscriptions.update(
      artisanData.stripeSubscriptionId,
      {
        cancel_at_period_end: true
      }
    );

    // Mettre à jour Firestore - marquer l'annulation programmée
    const updateData: any = {
      subscriptionStatus: 'canceled',
      canceledAt: new Date(),
      cancelAtPeriodEnd: true,
      updatedAt: new Date()
    };

    // Programmer la désactivation des fonctionnalités premium à la fin de la période
    if (artisanData.premiumFeatures?.isPremium) {
      const periodEnd = (subscription as any).current_period_end;
      if (periodEnd && typeof periodEnd === 'number') {
        updateData['premiumFeatures.premiumEndDate'] = new Date(periodEnd * 1000);
      }
    }

    await artisanDoc.ref.update(updateData);

    // Mettre à jour la collection subscriptions si elle existe
    try {
      const canceledPeriodEnd = (canceledSubscription as any).current_period_end;
      const subscriptionUpdateData: any = {
        status: 'canceled',
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
        updatedAt: new Date()
      };
      
      // Ajouter currentPeriodEnd seulement si valide
      if (canceledPeriodEnd && typeof canceledPeriodEnd === 'number') {
        subscriptionUpdateData.currentPeriodEnd = new Date(canceledPeriodEnd * 1000);
      }
      
      await adminDb.collection('subscriptions').doc(canceledSubscription.id).update(subscriptionUpdateData);
    } catch (error) {
      console.log('Collection subscriptions non trouvée ou erreur:', error);
    }

    // Préparer la réponse avec validation des timestamps
    const responseData: any = {
      success: true,
      message: 'Abonnement annulé avec succès. Il restera actif jusqu\'à la fin de la période en cours.',
      subscription: {
        id: canceledSubscription.id,
        status: canceledSubscription.status,
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end
      }
    };

    // Ajouter currentPeriodEnd seulement si valide
    const responsePeriodEnd = (canceledSubscription as any).current_period_end;
    if (responsePeriodEnd && typeof responsePeriodEnd === 'number') {
      responseData.subscription.currentPeriodEnd = new Date(responsePeriodEnd * 1000);
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Erreur annulation subscription:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'annulation',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
