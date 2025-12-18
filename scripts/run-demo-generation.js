#!/usr/bin/env node

/**
 * Script d'exécution pour générer les artisans demo
 * Usage: node scripts/run-demo-generation.js [nombre]
 * 
 * Exemple:
 * node scripts/run-demo-generation.js 100
 * node scripts/run-demo-generation.js cleanup
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const SCRIPT_PATH = path.join(__dirname, 'generate-demo-artisans.ts');
const DEFAULT_COUNT = 100;

function showUsage() {
  console.log(`
🎯 Générateur d'artisans temporaires - Portail Habitat

Usage:
  node scripts/run-demo-generation.js [nombre]     Générer des artisans demo
  node scripts/run-demo-generation.js cleanup     Supprimer tous les artisans demo
  node scripts/run-demo-generation.js help        Afficher cette aide

Exemples:
  node scripts/run-demo-generation.js 50          Générer 50 artisans
  node scripts/run-demo-generation.js 200         Générer 200 artisans
  node scripts/run-demo-generation.js cleanup     Nettoyer tous les demos

Options par défaut:
  - Nombre d'artisans: ${DEFAULT_COUNT}
  - Répartition géographique: 30 villes françaises
  - 30% d'artisans premium
  - 60% avec images
  - Prestations basées sur le simulateur de devis
`);
}

function runScript(args = []) {
  console.log('🚀 Lancement du générateur d\'artisans demo...\n');
  
  // Utiliser ts-node pour exécuter le script TypeScript
  const child = spawn('npx', ['ts-node', SCRIPT_PATH, ...args], {
    stdio: 'inherit',
    cwd: path.dirname(__dirname)
  });

  child.on('error', (error) => {
    console.error('❌ Erreur lors du lancement du script:', error.message);
    
    if (error.code === 'ENOENT') {
      console.log('\n💡 Solutions possibles:');
      console.log('   1. Installer ts-node: npm install -g ts-node');
      console.log('   2. Ou utiliser: npx ts-node scripts/generate-demo-artisans.ts');
    }
    
    process.exit(1);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Script terminé avec succès !');
    } else {
      console.log(`\n❌ Script terminé avec le code d'erreur: ${code}`);
    }
    process.exit(code);
  });
}

// Traitement des arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'help':
  case '--help':
  case '-h':
    showUsage();
    break;
    
  case 'cleanup':
    console.log('🧹 Nettoyage des artisans demo...');
    runScript(['cleanup']);
    break;
    
  case undefined:
    console.log(`📝 Génération de ${DEFAULT_COUNT} artisans demo (par défaut)...`);
    runScript([DEFAULT_COUNT.toString()]);
    break;
    
  default:
    const count = parseInt(command);
    if (isNaN(count) || count <= 0) {
      console.error(`❌ Nombre invalide: "${command}"`);
      console.log('💡 Utilisez un nombre entier positif ou "cleanup"');
      showUsage();
      process.exit(1);
    }
    
    if (count > 500) {
      console.log('⚠️  Attention: Génération de plus de 500 artisans détectée');
      console.log('   Cela peut prendre plusieurs minutes et consommer des ressources Firestore');
      console.log('   Continuez ? (Ctrl+C pour annuler)\n');
    }
    
    console.log(`📝 Génération de ${count} artisans demo...`);
    runScript([count.toString()]);
    break;
}
