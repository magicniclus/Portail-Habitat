import { NextRequest, NextResponse } from 'next/server';
import { auth, adminDb } from '@/lib/firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

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
    
    console.log('🔄 RESET PREMIUM pour artisan:', {
      id: artisanDoc.id,
      userId: userId,
      currentStatus: artisanData.subscriptionStatus,
      currentPremium: artisanData.premiumFeatures?.isPremium
    });

    // 1. ANNULER L'ABONNEMENT STRIPE (si il existe)
    if (artisanData.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(artisanData.stripeSubscriptionId);
        if (subscription.status !== 'canceled') {
          await stripe.subscriptions.cancel(artisanData.stripeSubscriptionId);
          console.log('✅ Abonnement Stripe annulé:', artisanData.stripeSubscriptionId);
        }
      } catch (error) {
        console.log('⚠️ Erreur annulation Stripe (peut-être déjà annulé):', error);
      }
    }

    // 2. RESET COMPLET DES DONNÉES FIRESTORE
    const resetData: any = {
      // Abonnement de base
      subscriptionStatus: 'active',
      monthlySubscriptionPrice: 69,
      currentPlan: 'basic',
      hasPremiumSite: true, // Garde le site premium de base
      
      // Supprimer toutes les données premium
      premiumFeatures: {
        isPremium: false,
        premiumType: null,
        premiumStartDate: null,
        premiumEndDate: null,
        showTopArtisanBadge: false,
        bannerPhotos: [],
        bannerVideo: null,
        premiumBenefits: []
      },
      
      // Supprimer les flags d'annulation
      cancelAtPeriodEnd: false,
      canceledAt: null,
      pendingDowngrade: false,
      pendingPlan: null,
      pendingPrice: null,
      downgradedAt: null,
      downgradeEffectiveDate: null,
      
      // Timestamp de mise à jour
      updatedAt: new Date()
    };

    await artisanDoc.ref.update(resetData);

    // 3. NETTOYER LA COLLECTION SUBSCRIPTIONS (si elle existe)
    try {
      if (artisanData.stripeSubscriptionId) {
        await adminDb.collection('subscriptions').doc(artisanData.stripeSubscriptionId).delete();
        console.log('✅ Document subscription supprimé');
      }
    } catch (error) {
      console.log('⚠️ Pas de document subscription à supprimer');
    }

    console.log('🎉 RESET PREMIUM TERMINÉ - Artisan remis en état Basic');

    return NextResponse.json({
      success: true,
      message: 'Reset premium terminé ! Artisan remis en état Basic (69€/mois)',
      resetData: {
        subscriptionStatus: 'active',
        monthlyPrice: 69,
        isPremium: false,
        showTopArtisanBadge: false,
        cancelAtPeriodEnd: false
      }
    });

  } catch (error: any) {
    console.error('❌ Erreur reset premium:', error);
    return NextResponse.json({ 
      error: 'Erreur lors du reset premium',
      details: error.message 
    }, { status: 500 });
  }
}
