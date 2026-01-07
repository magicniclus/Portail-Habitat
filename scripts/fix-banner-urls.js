// Script pour régénérer les URLs de bannière depuis Storage vers Firestore
// Usage: node scripts/fix-banner-urls.js <artisanId>

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'portail-habitat-2ac32.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function fixBannerUrls(artisanId) {
  try {
    console.log(`\n🔍 Vérification des bannières pour l'artisan: ${artisanId}`);
    
    const artisanDoc = await db.collection('artisans').doc(artisanId).get();
    
    if (!artisanDoc.exists) {
      console.error('❌ Artisan non trouvé');
      return;
    }

    const data = artisanDoc.data();
    console.log('✅ Artisan trouvé:', data.companyName);

    // Vérifier les fichiers dans Storage
    const bannerPhotosPath = `artisans/${artisanId}/premium/banner_photos/`;
    const [files] = await bucket.getFiles({ prefix: bannerPhotosPath });
    
    console.log(`\n📁 Fichiers trouvés dans Storage: ${files.length}`);
    
    const bannerUrls = [];
    
    // Trier les fichiers par nom (banner_001, banner_002, etc.)
    const sortedFiles = files
      .filter(file => file.name.endsWith('.jpg'))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    for (const file of sortedFiles) {
      console.log(`\n📸 Traitement: ${file.name}`);
      
      try {
        // Générer une URL signée valide pour 50 ans
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: '01-01-2099'
        });
        
        bannerUrls.push(url);
        console.log(`✅ URL générée`);
      } catch (error) {
        console.error(`❌ Erreur pour ${file.name}:`, error.message);
      }
    }

    if (bannerUrls.length === 0) {
      console.log('\n⚠️  Aucune URL de bannière générée');
      return;
    }

    console.log(`\n💾 Sauvegarde de ${bannerUrls.length} URL(s) dans Firestore...`);
    
    // Mettre à jour Firestore
    await db.collection('artisans').doc(artisanId).update({
      'premiumFeatures.bannerPhotos': bannerUrls,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ URLs sauvegardées avec succès!');
    console.log('\n📋 URLs générées:');
    bannerUrls.forEach((url, index) => {
      console.log(`[${index + 1}] ${url.substring(0, 100)}...`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

const artisanId = process.argv[2];
if (!artisanId) {
  console.error('Usage: node fix-banner-urls.js <artisanId>');
  process.exit(1);
}

fixBannerUrls(artisanId).then(() => {
  console.log('\n✅ Terminé!');
  process.exit(0);
});
