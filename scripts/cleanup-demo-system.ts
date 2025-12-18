import { adminDb } from '../lib/firebase-admin.js';

/**
 * Script de nettoyage complet du système d'artisans demo
 * ATTENTION: Ce script supprime DÉFINITIVEMENT tous les artisans demo
 */

export async function removeAllDemoArtisans(): Promise<void> {
  console.log('🧹 SUPPRESSION COMPLÈTE DES ARTISANS DEMO');
  console.log('⚠️  ATTENTION: Cette action est IRRÉVERSIBLE');
  
  try {
    // 1. Supprimer tous les artisans demo
    const demoArtisans = await adminDb.collection('artisans')
      .where('accountType', '==', 'demo')
      .get();
    
    console.log(`📊 ${demoArtisans.size} artisans demo trouvés`);
    
    if (demoArtisans.size === 0) {
      console.log('✅ Aucun artisan demo à supprimer');
      return;
    }
    
    // Suppression par batch de 500 (limite Firestore)
    const batchSize = 500;
    let deletedCount = 0;
    
    for (let i = 0; i < demoArtisans.docs.length; i += batchSize) {
      const batch = adminDb.batch();
      const currentDocs = demoArtisans.docs.slice(i, i + batchSize);
      
      currentDocs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      deletedCount += currentDocs.length;
      
      console.log(`🗑️  Supprimé ${deletedCount}/${demoArtisans.size} artisans demo`);
    }
    
    console.log('✅ TOUS LES ARTISANS DEMO ONT ÉTÉ SUPPRIMÉS');
    console.log('📈 Le site ne contient plus que des vrais artisans');
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    throw error;
  }
}

export async function verifyCleanup(): Promise<void> {
  console.log('🔍 Vérification du nettoyage...');
  
  try {
    const remainingDemo = await adminDb.collection('artisans')
      .where('accountType', '==', 'demo')
      .get();
    
    if (remainingDemo.size === 0) {
      console.log('✅ Nettoyage confirmé : 0 artisan demo restant');
    } else {
      console.log(`⚠️  ${remainingDemo.size} artisans demo encore présents`);
    }
    
    const totalArtisans = await adminDb.collection('artisans').get();
    console.log(`📊 Total artisans restants : ${totalArtisans.size} (tous réels)`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

export async function getSystemStats(): Promise<void> {
  console.log('📊 STATISTIQUES DU SYSTÈME');
  
  try {
    const allArtisans = await adminDb.collection('artisans').get();
    const demoArtisans = await adminDb.collection('artisans')
      .where('accountType', '==', 'demo')
      .get();
    
    const realArtisans = allArtisans.size - demoArtisans.size;
    const demoPercentage = allArtisans.size > 0 
      ? Math.round((demoArtisans.size / allArtisans.size) * 100) 
      : 0;
    
    console.log(`📈 Total artisans : ${allArtisans.size}`);
    console.log(`👥 Vrais artisans : ${realArtisans}`);
    console.log(`🎭 Artisans demo : ${demoArtisans.size} (${demoPercentage}%)`);
    
    if (demoArtisans.size > 0) {
      console.log('💡 Pour supprimer tous les demos : npm run cleanup-demo-system');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du calcul des stats:', error);
  }
}

// Script principal
if (require.main === module) {
  const action = process.argv[2];
  
  switch (action) {
    case 'remove':
      removeAllDemoArtisans()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'verify':
      verifyCleanup()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
      
    case 'stats':
    default:
      getSystemStats()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
      break;
  }
}
