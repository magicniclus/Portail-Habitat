require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Configuration Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function deleteDemoArtisans() {
  console.log('🗑️  SUPPRESSION DE TOUS LES ARTISANS DEMO');
  
  try {
    // Récupérer tous les artisans demo
    const artisansRef = db.collection('artisans');
    const demoQuery = artisansRef.where('accountType', '==', 'demo');
    const snapshot = await demoQuery.get();
    
    if (snapshot.empty) {
      console.log('✅ Aucun artisan demo trouvé à supprimer');
      return;
    }
    
    console.log(`📊 ${snapshot.size} artisans demo trouvés`);
    
    let deletedCount = 0;
    
    // Supprimer chaque artisan et ses sous-collections
    for (const doc of snapshot.docs) {
      const artisanId = doc.id;
      const artisanData = doc.data();
      
      console.log(`🗑️  Suppression: ${artisanData.companyName || artisanData.firstName + ' ' + artisanData.lastName}`);
      
      // Supprimer la sous-collection reviews
      const reviewsRef = doc.ref.collection('reviews');
      const reviewsSnapshot = await reviewsRef.get();
      
      for (const reviewDoc of reviewsSnapshot.docs) {
        await reviewDoc.ref.delete();
      }
      
      // Supprimer la sous-collection leads si elle existe
      const leadsRef = doc.ref.collection('leads');
      const leadsSnapshot = await leadsRef.get();
      
      for (const leadDoc of leadsSnapshot.docs) {
        await leadDoc.ref.delete();
      }
      
      // Supprimer la sous-collection posts si elle existe
      const postsRef = doc.ref.collection('posts');
      const postsSnapshot = await postsRef.get();
      
      for (const postDoc of postsSnapshot.docs) {
        await postDoc.ref.delete();
      }
      
      // Supprimer le document artisan
      await doc.ref.delete();
      
      deletedCount++;
      
      if (deletedCount % 10 === 0) {
        console.log(`✅ ${deletedCount} artisans supprimés...`);
      }
    }
    
    console.log(`🎉 SUPPRESSION TERMINÉE: ${deletedCount} artisans demo supprimés`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    process.exit(1);
  }
}

// Exécuter la suppression
deleteDemoArtisans()
  .then(() => {
    console.log('✅ Script de suppression terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
