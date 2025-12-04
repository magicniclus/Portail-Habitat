// Script de migration simplifié pour ajouter les préférences aux artisans existants
// Utilise Firebase Admin SDK (plus adapté pour les scripts)

const admin = require('firebase-admin');

// Initialiser Firebase Admin avec les credentials par défaut
// Assurez-vous d'avoir configuré GOOGLE_APPLICATION_CREDENTIALS ou d'être connecté avec gcloud
try {
  admin.initializeApp({
    projectId: 'portail-habitat-2ac32'
  });
} catch (error) {
  console.log('Firebase Admin déjà initialisé ou erreur:', error.message);
}

const db = admin.firestore();

// Valeurs par défaut pour les préférences
const defaultNotifications = {
  emailLeads: true,
  emailReviews: true,
  emailMarketing: false,
  pushNotifications: true
};

const defaultPrivacy = {
  profileVisible: true,
  showPhone: true,
  showEmail: false,
  allowDirectContact: true
};

async function migrateArtisanPreferences() {
  try {
    console.log('🚀 Début de la migration des préférences artisans...');
    
    // Récupérer tous les artisans
    const artisansRef = db.collection('artisans');
    const snapshot = await artisansRef.get();
    
    console.log(`📊 ${snapshot.size} artisans trouvés`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Traiter chaque artisan
    for (const doc of snapshot.docs) {
      const artisanData = doc.data();
      const artisanId = doc.id;
      
      // Vérifier si les champs existent déjà
      const needsNotifications = !artisanData.notifications;
      const needsPrivacy = !artisanData.privacy;
      
      if (needsNotifications || needsPrivacy) {
        const updateData = {
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        
        if (needsNotifications) {
          updateData.notifications = defaultNotifications;
          console.log(`📧 Ajout des préférences notifications pour ${artisanData.companyName || artisanId}`);
        }
        
        if (needsPrivacy) {
          updateData.privacy = defaultPrivacy;
          console.log(`🔒 Ajout des paramètres de confidentialité pour ${artisanData.companyName || artisanId}`);
        }
        
        // Mettre à jour le document
        await doc.ref.update(updateData);
        
        updatedCount++;
        console.log(`✅ Artisan ${artisanId} mis à jour`);
      } else {
        skippedCount++;
        console.log(`⏭️  Artisan ${artisanId} déjà à jour`);
      }
    }
    
    console.log('\n🎉 Migration terminée !');
    console.log(`📈 Statistiques :`);
    console.log(`   - Artisans mis à jour : ${updatedCount}`);
    console.log(`   - Artisans déjà à jour : ${skippedCount}`);
    console.log(`   - Total traité : ${updatedCount + skippedCount}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration :', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔑 Conseil : Assurez-vous d\'avoir les bonnes permissions Firestore');
    } else if (error.message.includes('Could not load the default credentials')) {
      console.log('\n🔑 Conseil : Configurez vos credentials Firebase Admin :');
      console.log('   1. Téléchargez le fichier de clé de service depuis Firebase Console');
      console.log('   2. Définissez GOOGLE_APPLICATION_CREDENTIALS vers ce fichier');
      console.log('   3. Ou utilisez : gcloud auth application-default login');
    }
  }
}

// Exécuter la migration
if (require.main === module) {
  migrateArtisanPreferences()
    .then(() => {
      console.log('✨ Migration terminée avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale :', error);
      process.exit(1);
    });
}

module.exports = { migrateArtisanPreferences, defaultNotifications, defaultPrivacy };
