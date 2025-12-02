import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  let artisanId = '';
  try {
    const requestData = await request.json();
    console.log('🔥 Données reçues par l\'API Firebase:', requestData);
    
    artisanId = requestData.artisanId;
    const { sitePricePaid, hasPremiumSite, paymentData } = requestData;

    if (!artisanId) {
      console.log('❌ Pas d\'artisanId dans les données:', requestData);
      return NextResponse.json({ error: 'ID artisan manquant' }, { status: 400 });
    }

    console.log('✅ ArtisanId trouvé:', artisanId);

    // Référence directe du document artisan
    const artisanRef = db.collection('artisans').doc(artisanId);

    // Données à mettre à jour selon le schéma Firestore
    const updateData = {
      // Upsell site premium
      hasPremiumSite: hasPremiumSite || true,
      sitePricePaid: sitePricePaid || 69,
      
      // Informations de paiement (optionnel, pour audit)
      lastPaymentDate: new Date(),
      lastPaymentAmount: sitePricePaid,
      
      // Mise à jour timestamp
      updatedAt: new Date(),
      
      // Statut pour suivi
      upsellCompleted: true,
      upsellCompletedAt: new Date()
    };

    console.log('📝 Données à mettre à jour:', updateData);

    // Mettre à jour le document (même structure que create-artisan)
    await artisanRef.update(updateData);

    console.log(`Artisan ${artisanId} mis à jour avec upsell site premium`);

    return NextResponse.json({ 
      success: true, 
      message: 'Artisan mis à jour avec succès',
      data: {
        artisanId,
        sitePricePaid,
        hasPremiumSite
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'artisan:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la mise à jour de l\'artisan',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        artisanId: artisanId || 'non fourni'
      },
      { status: 500 }
    );
  }
}
