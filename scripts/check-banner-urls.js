// Script pour vérifier les URLs de bannière dans Firestore
// Usage: node scripts/check-banner-urls.js <artisanId>

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkBannerUrls(artisanId) {
  try {
    const artisanDoc = await db.collection('artisans').doc(artisanId).get();
    
    if (!artisanDoc.exists) {
      console.error('❌ Artisan non trouvé');
      return;
    }

    const data = artisanDoc.data();
    console.log('\n📋 Données artisan:');
    console.log('- ID:', artisanId);
    console.log('- Nom:', data.companyName);
    console.log('- Premium:', data.premiumFeatures?.isPremium);
    console.log('\n🖼️  URLs de bannière:');
    
    if (data.premiumFeatures?.bannerPhotos) {
      console.log('Nombre de photos:', data.premiumFeatures.bannerPhotos.length);
      data.premiumFeatures.bannerPhotos.forEach((url, index) => {
        console.log(`\n[${index + 1}] ${url}`);
      });
    } else {
      console.log('❌ Aucune bannerPhotos dans premiumFeatures');
    }

    if (data.coverUrl) {
      console.log('\n📸 Cover URL:', data.coverUrl);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

const artisanId = process.argv[2];
if (!artisanId) {
  console.error('Usage: node check-banner-urls.js <artisanId>');
  process.exit(1);
}

checkBannerUrls(artisanId).then(() => process.exit(0));
