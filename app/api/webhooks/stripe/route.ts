import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log('Webhook reçu:', event.type);

  try {
    switch (event.type) {
      // ✅ WEBHOOK OBLIGATOIRE 1
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      // ✅ WEBHOOK OBLIGATOIRE 2  
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // ✅ WEBHOOK OBLIGATOIRE 3
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      // ✅ WEBHOOK OBLIGATOIRE 4
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Webhook non géré: ${event.type}`);
    }

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    console.error('Erreur traitement webhook:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
}

// ✅ Synchronisation mise à jour subscription
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Synchronisation subscription updated:', subscription.id);

  const artisanQuery = await adminDb.collection('artisans')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (artisanQuery.empty) {
    console.log('Artisan non trouvé pour subscription:', subscription.id);
    return;
  }

  const artisanDoc = artisanQuery.docs[0];
  const artisanData = artisanDoc.data();

  // Déterminer le plan actuel
  const currentPrice = subscription.items.data[0]?.price;
  const monthlyAmount = currentPrice && currentPrice.unit_amount ? currentPrice.unit_amount / 100 : 69;
  
  let currentPlan = 'basic';
  if (monthlyAmount >= 199) currentPlan = 'premium_plus';
  else if (monthlyAmount >= 129) currentPlan = 'premium';

  // ✅ Synchroniser selon le schéma Firestore
  const updateData: any = {
    currentPlan,
    stripePriceId: currentPrice?.id || '',
    subscriptionStatus: subscription.status,
    monthlySubscriptionPrice: monthlyAmount,
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    updatedAt: new Date()
  };

  // Gestion des annulations
  if (subscription.cancel_at_period_end) {
    updateData.cancelAtPeriodEnd = true;
  } else {
    updateData.cancelAtPeriodEnd = false;
  }

  // Gestion du statut premium
  if (currentPlan !== 'basic') {
    updateData['premiumFeatures.isPremium'] = true;
    updateData['premiumFeatures.premiumType'] = 'monthly';
    
    // Si c'est la première fois premium, définir la date de début
    if (!artisanData.premiumFeatures?.premiumStartDate) {
      updateData['premiumFeatures.premiumStartDate'] = new Date();
    }
  } else {
    // Si retour au basic, désactiver premium
    updateData['premiumFeatures.isPremium'] = false;
    if (subscription.status === 'canceled') {
      updateData['premiumFeatures.premiumEndDate'] = new Date();
    }
  }

  await artisanDoc.ref.update(updateData);

  // ✅ Mettre à jour la collection subscriptions
  const subscriptionDocRef = adminDb.collection('subscriptions').doc(subscription.id);
  const subscriptionDoc = await subscriptionDocRef.get();

  if (subscriptionDoc.exists) {
    await subscriptionDocRef.update({
      status: subscription.status,
      monthlyPrice: monthlyAmount,
      stripePriceId: currentPrice?.id || '',
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      updatedAt: new Date()
    });
  }

  console.log('Subscription synchronisée:', subscription.id, 'Plan:', currentPlan);
}

// ✅ Gestion suppression subscription
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription supprimée:', subscription.id);

  const artisanQuery = await adminDb.collection('artisans')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (artisanQuery.empty) {
    console.log('Artisan non trouvé pour subscription supprimée:', subscription.id);
    return;
  }

  const artisanDoc = artisanQuery.docs[0];

  // Marquer comme annulé et désactiver premium
  await artisanDoc.ref.update({
    subscriptionStatus: 'canceled',
    cancelAtPeriodEnd: false,
    'premiumFeatures.isPremium': false,
    'premiumFeatures.premiumEndDate': new Date(),
    updatedAt: new Date()
  });

  // Mettre à jour la collection subscriptions
  await adminDb.collection('subscriptions').doc(subscription.id).update({
    status: 'canceled',
    canceledAt: new Date(),
    cancelAtPeriodEnd: false,
    updatedAt: new Date()
  });

  console.log('Subscription supprimée synchronisée:', subscription.id);
}

// ✅ Gestion paiement réussi
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Paiement réussi pour invoice:', invoice.id);

  if (!(invoice as any).subscription) {
    console.log('Invoice sans subscription, ignorée');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
  
  const artisanQuery = await adminDb.collection('artisans')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (artisanQuery.empty) {
    console.log('Artisan non trouvé pour paiement réussi:', subscription.id);
    return;
  }

  const artisanDoc = artisanQuery.docs[0];

  // S'assurer que le statut est actif après paiement réussi
  await artisanDoc.ref.update({
    subscriptionStatus: 'active',
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    updatedAt: new Date()
  });

  // Mettre à jour la collection subscriptions
  await adminDb.collection('subscriptions').doc(subscription.id).update({
    status: 'active',
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    updatedAt: new Date()
  });

  console.log('Paiement réussi synchronisé pour subscription:', subscription.id);
}

// ✅ Gestion échec de paiement
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Échec paiement pour invoice:', invoice.id);

  if (!(invoice as any).subscription) {
    console.log('Invoice sans subscription, ignorée');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
  
  const artisanQuery = await adminDb.collection('artisans')
    .where('stripeSubscriptionId', '==', subscription.id)
    .limit(1)
    .get();

  if (artisanQuery.empty) {
    console.log('Artisan non trouvé pour échec paiement:', subscription.id);
    return;
  }

  const artisanDoc = artisanQuery.docs[0];

  // Marquer comme past_due et désactiver premium temporairement
  await artisanDoc.ref.update({
    subscriptionStatus: 'past_due',
    'premiumFeatures.isPremium': false, // ✅ Désactiver premium en cas d'échec
    updatedAt: new Date()
  });

  // Mettre à jour la collection subscriptions
  await adminDb.collection('subscriptions').doc(subscription.id).update({
    status: 'past_due',
    updatedAt: new Date()
  });

  console.log('Échec paiement synchronisé pour subscription:', subscription.id);
}
