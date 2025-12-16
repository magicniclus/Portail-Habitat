import { NextRequest, NextResponse } from 'next/server';
import { auth, adminDb } from '@/lib/firebase-admin';

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
    
    console.log('Correction des données premium pour artisan:', {
      id: artisanDoc.id,
      userId: userId,
      currentPremiumFeatures: artisanData.premiumFeatures,
      currentHasPremiumSite: artisanData.hasPremiumSite
    });

    // Mettre à jour avec les données premium manquantes
    const updateData: any = {
      'premiumFeatures.showTopArtisanBadge': true,
      'hasPremiumSite': true,
      'subscriptionStatus': 'active',
      'updatedAt': new Date()
    };

    // S'assurer que isPremium est bien à true
    if (!artisanData.premiumFeatures?.isPremium) {
      updateData['premiumFeatures.isPremium'] = true;
      updateData['premiumFeatures.premiumType'] = 'monthly';
      updateData['premiumFeatures.premiumStartDate'] = new Date();
      updateData['premiumFeatures.bannerPhotos'] = [];
      updateData['premiumFeatures.premiumBenefits'] = ["multiple_banners", "video_banner", "top_badge", "priority_listing"];
    }

    await artisanDoc.ref.update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Données premium corrigées avec succès',
      updatedFields: updateData
    });

  } catch (error: any) {
    console.error('Erreur correction premium:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la correction',
      details: error.message 
    }, { status: 500 });
  }
}
