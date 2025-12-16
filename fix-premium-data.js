// Script pour corriger les données premium manquantes
const admin = require('firebase-admin');

// Initialiser Firebase Admin avec les variables d'environnement
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID || 'portail-habitat'
});

const db = admin.firestore();

async function fixPremiumData() {
  try {
    // Récupérer l'artisan avec userId spécifique
    const artisansRef = db.collection('artisans');
    const querySnapshot = await artisansRef.where('userId', '==', 'sE3u1ueTdyc2csC9hFnvdoxTZtN2').get();
    
    if (querySnapshot.empty) {
      console.log('Aucun artisan trouvé');
      return;
    }

    const artisanDoc = querySnapshot.docs[0];
    const artisanData = artisanDoc.data();
    
    console.log('Données actuelles:', artisanData.premiumFeatures);
    console.log('hasPremiumSite actuel:', artisanData.hasPremiumSite);
    
    // Mettre à jour avec les données manquantes
    const updateData = {
      'premiumFeatures.showTopArtisanBadge': true,
      'hasPremiumSite': true,
      'subscriptionStatus': 'active',
      'updatedAt': admin.firestore.FieldValue.serverTimestamp()
    };
    
    await artisanDoc.ref.update(updateData);
    
    console.log('✅ Données premium corrigées !');
    console.log('Nouvelles données:', updateData);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  
  process.exit(0);
}

fixPremiumData();
