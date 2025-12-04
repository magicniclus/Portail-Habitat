// Script de migration pour ajouter les préférences notifications et privacy aux artisans existants
// À exécuter une seule fois pour mettre à jour la base de données

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Configuration Firebase - utilise la même config que l'app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Remplacez par votre vraie clé
  authDomain: "portail-habitat-2ac32.firebaseapp.com",
  databaseURL: "https://portail-habitat-2ac32-default-rtdb.firebaseio.com",
  projectId: "portail-habitat-2ac32",
  storageBucket: "portail-habitat-2ac32.firebasestorage.app",
  messagingSenderId: "184081016935",
  appId: "1:184081016935:web:931ffaf87cb894e8048cc2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    const artisansRef = collection(db, 'artisans');
    const snapshot = await getDocs(artisansRef);
    
    console.log(`📊 ${snapshot.size} artisans trouvés`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Traiter chaque artisan
    for (const artisanDoc of snapshot.docs) {
      const artisanData = artisanDoc.data();
      const artisanId = artisanDoc.id;
      
      // Vérifier si les champs existent déjà
      const needsNotifications = !artisanData.notifications;
      const needsPrivacy = !artisanData.privacy;
      
      if (needsNotifications || needsPrivacy) {
        const updateData = {
          updatedAt: new Date()
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
        const artisanRef = doc(db, 'artisans', artisanId);
        await updateDoc(artisanRef, updateData);
        
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
  }
}

// Fonction pour ajouter les préférences à un nouvel artisan
function getDefaultArtisanPreferences() {
  return {
    notifications: defaultNotifications,
    privacy: defaultPrivacy
  };
}

// Exporter les fonctions
module.exports = {
  migrateArtisanPreferences,
  getDefaultArtisanPreferences,
  defaultNotifications,
  defaultPrivacy
};

// Exécuter la migration si ce script est appelé directement
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
