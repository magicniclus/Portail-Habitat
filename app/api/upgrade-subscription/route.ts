import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth, adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_AMOUNTS = {
  'basic': 69,
  'premium': 99,
  'premium_plus': 199
};

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

    // ✅ Body minimal et sécurisé
    const { plan, prorata = true } = await request.json();
    
    if (!PLAN_AMOUNTS[plan as keyof typeof PLAN_AMOUNTS]) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    const planAmount = PLAN_AMOUNTS[plan as keyof typeof PLAN_AMOUNTS];

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
    
    console.log('Données artisan:', {
      id: artisanDoc.id,
      stripeSubscriptionId: artisanData.stripeSubscriptionId,
      stripeCustomerId: artisanData.stripeCustomerId,
      subscriptionStatus: artisanData.subscriptionStatus,
      monthlySubscriptionPrice: artisanData.monthlySubscriptionPrice
    });

    // Vérifier et créer le customer Stripe si nécessaire
    let customerId = artisanData.stripeCustomerId;
    if (!customerId) {
      console.log('Création d\'un nouveau customer Stripe pour l\'artisan');
      const customer = await stripe.customers.create({
        email: artisanData.email,
        name: artisanData.companyName || `${artisanData.firstName} ${artisanData.lastName}`,
        metadata: {
          artisanId: artisanDoc.id,
          userId: userId
        }
      });
      customerId = customer.id;
      
      // Mettre à jour Firestore avec le customer ID
      await artisanDoc.ref.update({
        stripeCustomerId: customerId,
        updatedAt: new Date()
      });
      
      console.log('Customer Stripe créé:', customerId);
    }
    
    // Gérer les artisans sans abonnement Stripe (création d'un nouvel abonnement)
    if (!artisanData.stripeSubscriptionId) {
      // Créer ou récupérer le prix Stripe dynamiquement
      const priceId = await getOrCreateStripePrice(plan, planAmount);
      
      // Créer un nouvel abonnement pour cet artisan
      const newSubscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Mettre à jour Firestore avec le nouvel abonnement
      const updateData: any = {
        stripeSubscriptionId: newSubscription.id,
        currentPlan: plan,
        stripePriceId: priceId,
        monthlySubscriptionPrice: planAmount,
        subscriptionStatus: newSubscription.status,
        updatedAt: new Date()
      };

      // Ajouter currentPeriodEnd seulement si valide
      if ((newSubscription as any).current_period_end && typeof (newSubscription as any).current_period_end === 'number') {
        updateData.currentPeriodEnd = new Date((newSubscription as any).current_period_end * 1000);
      }

      // Activer premium si plan premium
      if (plan !== 'basic') {
        updateData['premiumFeatures.isPremium'] = true;
        updateData['premiumFeatures.premiumType'] = 'monthly';
        updateData['premiumFeatures.premiumStartDate'] = new Date();
        updateData['premiumFeatures.showTopArtisanBadge'] = true;
        updateData['premiumFeatures.bannerPhotos'] = [];
        updateData['premiumFeatures.premiumBenefits'] = ["multiple_banners", "video_banner", "top_badge", "priority_listing"];
        updateData['hasPremiumSite'] = true;
        updateData['subscriptionStatus'] = 'active';
      }

      await artisanDoc.ref.update(updateData);

      return NextResponse.json({
        success: true,
        message: 'Nouvel abonnement créé',
        subscription: {
          id: newSubscription.id,
          status: newSubscription.status,
          plan: plan,
          amount: PLAN_AMOUNTS[plan as keyof typeof PLAN_AMOUNTS],
          client_secret: (newSubscription.latest_invoice as any)?.payment_intent?.client_secret
        }
      });
    }

    // Récupérer la subscription Stripe actuelle
    const subscription = await stripe.subscriptions.retrieve(artisanData.stripeSubscriptionId);
    
    // Gérer les abonnements inactifs en les réactivant ou créant un nouveau
    if (subscription.status !== 'active') {
      console.log(`Abonnement ${subscription.id} avec statut: ${subscription.status}`);
      
      // Si l'abonnement est annulé, expiré ou incomplete, en créer un nouveau
      if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired' || subscription.status === 'incomplete') {
        // Créer ou récupérer le prix Stripe dynamiquement
        const priceId = await getOrCreateStripePrice(plan, planAmount);
        
        const newSubscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{
            price: priceId,
          }],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        });

        // Mettre à jour Firestore avec le nouvel abonnement
        const updateData: any = {
          stripeSubscriptionId: newSubscription.id,
          currentPlan: plan,
          stripePriceId: priceId,
          monthlySubscriptionPrice: planAmount,
          subscriptionStatus: newSubscription.status,
          updatedAt: new Date()
        };

        // Ajouter currentPeriodEnd seulement si valide
        if ((newSubscription as any).current_period_end && typeof (newSubscription as any).current_period_end === 'number') {
          updateData.currentPeriodEnd = new Date((newSubscription as any).current_period_end * 1000);
        }

        // Activer premium si plan premium
        if (plan !== 'basic') {
          updateData['premiumFeatures.isPremium'] = true;
          updateData['premiumFeatures.premiumType'] = 'monthly';
          updateData['premiumFeatures.premiumStartDate'] = new Date();
          updateData['premiumFeatures.showTopArtisanBadge'] = true;
          updateData['premiumFeatures.bannerPhotos'] = [];
          updateData['premiumFeatures.premiumBenefits'] = ["multiple_banners", "video_banner", "top_badge", "priority_listing"];
          updateData['hasPremiumSite'] = true;
          updateData['subscriptionStatus'] = 'active';
          updateData['cancelAtPeriodEnd'] = false; // Réactiver l'abonnement
          
          // Supprimer la date de fin premium si elle existe (réactivation)
          if (artisanData.premiumFeatures?.premiumEndDate) {
            updateData['premiumFeatures.premiumEndDate'] = null;
          }
        }

        await artisanDoc.ref.update(updateData);

        return NextResponse.json({
          success: true,
          message: 'Nouvel abonnement créé pour remplacer l\'ancien',
          subscription: {
            id: newSubscription.id,
            status: newSubscription.status,
            plan: plan,
            amount: PLAN_AMOUNTS[plan as keyof typeof PLAN_AMOUNTS],
            client_secret: (newSubscription.latest_invoice as any)?.payment_intent?.client_secret
          }
        });
      }
      
      // Pour les autres statuts (past_due, incomplete, etc.), retourner l'erreur
      return NextResponse.json({ 
        error: `Abonnement ${subscription.status}. Veuillez contacter le support.`,
        status: subscription.status 
      }, { status: 400 });
    }

    // Vérifier si c'est vraiment un upgrade (pas un downgrade)
    const currentAmount = subscription.items.data[0].price?.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0;
    const newAmount = planAmount;
    
    if (newAmount <= currentAmount) {
      return NextResponse.json({ error: 'Seuls les upgrades sont autorisés' }, { status: 400 });
    }

    // Créer ou récupérer le prix Stripe dynamiquement
    const priceId = await getOrCreateStripePrice(plan, planAmount);

    // 1. Upgrade de la subscription
    const updatedSubscription = await stripe.subscriptions.update(
      artisanData.stripeSubscriptionId,
      {
        items: [{
          id: subscription.items.data[0].id,
          price: priceId,
        }],
        proration_behavior: prorata ? 'create_prorations' : 'none',
      }
    );

    // 2. ✅ FACTURATION IMMÉDIATE si prorata activé
    let invoice = null;
    if (prorata) {
      invoice = await stripe.invoices.create({
        customer: customerId,
        subscription: artisanData.stripeSubscriptionId,
        auto_advance: true, // Finalise automatiquement
      });
      
      // Finaliser l'invoice pour encaissement immédiat
      await stripe.invoices.finalizeInvoice(invoice.id);
    }

    // 3. Mettre à jour Firestore immédiatement (sera confirmé par webhook)
    const updateData: any = {
      currentPlan: plan,
      stripePriceId: priceId,
      monthlySubscriptionPrice: newAmount,
      subscriptionStatus: updatedSubscription.status,
      updatedAt: new Date()
    };

    // Ajouter currentPeriodEnd seulement si valide
    if ((updatedSubscription as any).current_period_end && typeof (updatedSubscription as any).current_period_end === 'number') {
      updateData.currentPeriodEnd = new Date((updatedSubscription as any).current_period_end * 1000);
    }

    // Activer premium si plan premium
    if (plan !== 'basic') {
      updateData['premiumFeatures.isPremium'] = true;
      updateData['premiumFeatures.premiumType'] = 'monthly';
      updateData['premiumFeatures.showTopArtisanBadge'] = true;
      updateData['premiumFeatures.bannerPhotos'] = [];
      updateData['premiumFeatures.premiumBenefits'] = ["multiple_banners", "video_banner", "top_badge", "priority_listing"];
      updateData['hasPremiumSite'] = true;
      updateData['subscriptionStatus'] = 'active';
      if (!artisanData.premiumFeatures?.premiumStartDate) {
        updateData['premiumFeatures.premiumStartDate'] = new Date();
      }
    }

    await artisanDoc.ref.update(updateData);

    // 4. Mettre à jour la collection subscriptions
    const subscriptionUpdateData: any = {
      monthlyPrice: newAmount,
      status: updatedSubscription.status,
      stripePriceId: priceId,
      updatedAt: new Date()
    };

    // Ajouter les dates seulement si valides
    if ((updatedSubscription as any).current_period_start && typeof (updatedSubscription as any).current_period_start === 'number') {
      subscriptionUpdateData.currentPeriodStart = new Date((updatedSubscription as any).current_period_start * 1000);
    }
    if ((updatedSubscription as any).current_period_end && typeof (updatedSubscription as any).current_period_end === 'number') {
      subscriptionUpdateData.currentPeriodEnd = new Date((updatedSubscription as any).current_period_end * 1000);
    }

    await adminDb.collection('subscriptions').doc(updatedSubscription.id).update(subscriptionUpdateData);

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
