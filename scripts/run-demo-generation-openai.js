#!/usr/bin/env node

/**
 * Script d'exécution pour la génération d'artisans demo avec OpenAI
 * Usage: node scripts/run-demo-generation-openai.js [count] [cleanup]
 */

const { spawn } = require('child_process');
const path = require('path');

function showHelp() {
  console.log(`
🎭 GÉNÉRATEUR D'ARTISANS DEMO AVEC OPENAI

Usage:
  node scripts/run-demo-generation-openai.js [count]     # Générer [count] artisans (défaut: 50)
  node scripts/run-demo-generation-openai.js cleanup    # Supprimer tous les artisans demo
  node scripts/run-demo-generation-openai.js help       # Afficher cette aide

Exemples:
  node scripts/run-demo-generation-openai.js           # Générer 50 artisans
  node scripts/run-demo-generation-openai.js 100       # Générer 100 artisans
  node scripts/run-demo-generation-openai.js cleanup   # Nettoyer tous les demos

⚠️  IMPORTANT: 
- Nécessite OPENAI_API_KEY dans les variables d'environnement
- Génération ultra-réaliste avec OpenAI GPT-4
- Données parfaitement invisibles et indiscernables
- Respecte le schéma Firestore complet

🔧 Configuration:
- Ajoutez OPENAI_API_KEY=your_key dans votre .env
- Les artisans demo expirent automatiquement après 1 an
- 70% des artisans sont contactables (redirection formulaire)
- 30% sont premium avec fonctionnalités avancées
`);
}

function runTypeScriptScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Exécution: npx ts-node ${scriptPath} ${args.join(' ')}`);
    
    const child = spawn('npx', ['ts-node', scriptPath, ...args], {
      stdio: 'inherit',
      cwd: path.dirname(__dirname)
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script terminé avec le code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  // Vérifier la clé OpenAI
  if (!process.env.OPENAI_API_KEY) {
    console.error(`
❌ ERREUR: Variable d'environnement OPENAI_API_KEY manquante

Pour configurer:
1. Créez un fichier .env à la racine du projet
2. Ajoutez: OPENAI_API_KEY=your_openai_api_key_here
3. Relancez le script

Ou exportez temporairement:
export OPENAI_API_KEY=your_key_here
`);
    process.exit(1);
  }

  const scriptPath = path.join(__dirname, 'generate-demo-artisans-openai.ts');
  
  try {
    if (args[0] === 'cleanup') {
      console.log('🧹 NETTOYAGE DES ARTISANS DEMO...');
      await runTypeScriptScript(scriptPath, ['cleanup']);
      console.log('✅ Nettoyage terminé avec succès !');
      
    } else {
      const count = parseInt(args[0]) || 50;
      
      if (count < 1 || count > 500) {
        console.error('❌ Le nombre d\'artisans doit être entre 1 et 500');
        process.exit(1);
      }
      
      console.log(`🎭 GÉNÉRATION DE ${count} ARTISANS DEMO AVEC OPENAI...`);
      console.log('🤖 Utilisation d\'OpenAI GPT-4 pour des données ultra-réalistes');
      console.log('⏳ Cette opération peut prendre plusieurs minutes...');
      
      await runTypeScriptScript(scriptPath, [count.toString()]);
      
      console.log(`
🎉 GÉNÉRATION TERMINÉE AVEC SUCCÈS !

📊 Résumé:
- ${count} artisans demo créés avec OpenAI
- Données ultra-réalistes et indiscernables
- Parfaitement invisibles pour les visiteurs
- Respectent le schéma Firestore complet

🔧 Gestion:
- Interface admin: /admin/artisans-demo
- Statistiques: npm run demo-stats
- Suppression: npm run cleanup-demo-system

✨ Les artisans demo sont maintenant actifs sur votre plateforme !
`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
