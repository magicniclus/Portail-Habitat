/**
 * Script pour nettoyer les notes des leads achetés qui contiennent 
 * "Lead acheté sur la marketplace pour X€"
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

// Configuration Firebase (remplacez par votre config)
const firebaseConfig = {
  // Votre configuration Firebase ici
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanBoughtLeadsNotes() {
  try {
    console.log('🧹 Début du nettoyage des notes des leads achetés...');
    
    // Récupérer tous les artisans
    const artisansSnapshot = await getDocs(collection(db, 'artisans'));
    let totalCleaned = 0;
    
    for (const artisanDoc of artisansSnapshot.docs) {
      const artisanId = artisanDoc.id;
      console.log(`\n👤 Traitement de l'artisan: ${artisanId}`);
      
      // Récupérer les leads de cet artisan
      const leadsRef = collection(db, 'artisans', artisanId, 'leads');
      const leadsSnapshot = await getDocs(leadsRef);
      
      let cleanedForArtisan = 0;
      
      for (const leadDoc of leadsSnapshot.docs) {
        const leadData = leadDoc.data();
        
        // Vérifier si c'est un lead acheté avec une note à nettoyer
        if (leadData.source === 'bought' && 
            leadData.notes && 
            leadData.notes.includes('Lead acheté sur la marketplace pour')) {
          
          console.log(`  🔧 Nettoyage du lead: ${leadDoc.id}`);
          console.log(`     Ancienne note: "${leadData.notes}"`);
          
          // Mettre à jour avec une note vide
          await updateDoc(doc(db, 'artisans', artisanId, 'leads', leadDoc.id), {
            notes: '',
            updatedAt: new Date()
          });
          
          console.log(`     ✅ Note nettoyée`);
          cleanedForArtisan++;
          totalCleaned++;
        }
      }
      
      if (cleanedForArtisan > 0) {
        console.log(`  📊 ${cleanedForArtisan} lead(s) nettoyé(s) pour cet artisan`);
      } else {
        console.log(`  ✨ Aucun lead à nettoyer pour cet artisan`);
      }
    }
    
    console.log(`\n🎉 Nettoyage terminé !`);
    console.log(`📊 Total des leads nettoyés: ${totalCleaned}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le script
cleanBoughtLeadsNotes().then(() => {
  console.log('✅ Script terminé');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
