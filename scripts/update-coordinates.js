/**
 * Script pour tester et exécuter la mise à jour des coordonnées des artisans
 * Usage: node scripts/update-coordinates.js [--dry-run] [--limit=N]
 */

const API_BASE_URL = 'http://localhost:3000'; // Ajuster selon votre environnement

async function updateCoordinates(options = {}) {
  const { dryRun = true, limit = 10 } = options;
  
  console.log('🚀 Lancement du script de mise à jour des coordonnées...');
  console.log(`   Mode: ${dryRun ? 'DRY RUN (test)' : 'PRODUCTION (vraie mise à jour)'}`);
  console.log(`   Limite: ${limit} artisans`);
  console.log('');

  try {
    const response = await fetch(`${API_BASE_URL}/api/update-artisan-coordinates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dryRun,
        limit
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Script exécuté avec succès !');
      console.log('');
      console.log('📊 Résultats:');
      console.log(`   - Total artisans à traiter: ${result.results.total}`);
      console.log(`   - Artisans traités: ${result.results.processed}`);
      console.log(`   - Succès: ${result.results.updated}`);
      console.log(`   - Échecs: ${result.results.failed}`);
      
      if (result.results.errors.length > 0) {
        console.log('');
        console.log('❌ Erreurs rencontrées:');
        result.results.errors.forEach(error => {
          console.log(`   - ${error}`);
        });
      }
      
      if (dryRun) {
        console.log('');
        console.log('💡 Pour exécuter réellement les mises à jour:');
        console.log('   node scripts/update-coordinates.js --production --limit=50');
      }
    } else {
      console.error('❌ Erreur lors de l\'exécution:', result.error);
      if (result.details) {
        console.error('   Détails:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

// Parsing des arguments de ligne de commande
const args = process.argv.slice(2);
const options = {
  dryRun: !args.includes('--production'),
  limit: 10
};

// Récupérer la limite si spécifiée
const limitArg = args.find(arg => arg.startsWith('--limit='));
if (limitArg) {
  options.limit = parseInt(limitArg.split('=')[1]) || 10;
}

// Exécuter le script
updateCoordinates(options);
