/**
 * Script d'initialisation des prix Premium dans Stripe
 * À exécuter une seule fois pour créer les prix dans le dashboard Stripe
 */

const Stripe = require('stripe');
require('dotenv').config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createPremiumPrices() {
  try {
    console.log('🚀 Création des prix Premium dans Stripe...');

    // 1. Créer le produit Premium si il n'existe pas
    let premiumProduct;
    try {
      const products = await stripe.products.list({ limit: 100 });
      premiumProduct = products.data.find(p => p.name === 'Abonnement Premium Portail Habitat');
      
      if (!premiumProduct) {
        premiumProduct = await stripe.products.create({
          name: 'Abonnement Premium Portail Habitat',
          description: 'Fonctionnalités premium pour artisans : badge Top Artisan, photos multiples, vidéo de présentation, priorité d\'affichage',
          metadata: {
            type: 'premium_subscription',
            features: 'multiple_banners,video_banner,top_badge,priority_listing'
          }
        });
        console.log('✅ Produit Premium créé:', premiumProduct.id);
      } else {
        console.log('✅ Produit Premium existant:', premiumProduct.id);
      }
    } catch (error) {
      console.error('❌ Erreur création produit:', error.message);
      return;
    }

    // 2. Créer les prix Premium
    const prices = [
      {
        id: 'price_basic_69',
        name: 'Basic - 69€/mois',
        amount: 6900, // 69€ en centimes
        interval: 'month',
        description: 'Abonnement de base'
      },
      {
        id: 'price_premium_129',
        name: 'Premium - 129€/mois', 
        amount: 12900, // 129€ en centimes
        interval: 'month',
        description: 'Abonnement premium avec fonctionnalités avancées'
      },
      {
        id: 'price_premium_199',
        name: 'Premium Plus - 199€/mois',
        amount: 19900, // 199€ en centimes  
        interval: 'month',
        description: 'Abonnement premium plus avec toutes les fonctionnalités'
      }
    ];

    const createdPrices = {};

    for (const priceConfig of prices) {
      try {
        // Vérifier si le prix existe déjà
        const existingPrices = await stripe.prices.list({
          product: premiumProduct.id,
          limit: 100
        });

        const existingPrice = existingPrices.data.find(p => 
          p.unit_amount === priceConfig.amount && 
          p.recurring?.interval === priceConfig.interval
        );

        if (existingPrice) {
          console.log(`✅ Prix ${priceConfig.name} existant:`, existingPrice.id);
          createdPrices[priceConfig.id] = existingPrice.id;
        } else {
          const newPrice = await stripe.prices.create({
            currency: 'eur',
            unit_amount: priceConfig.amount,
            recurring: {
              interval: priceConfig.interval
            },
            product: premiumProduct.id,
            nickname: priceConfig.name,
            metadata: {
              plan_type: priceConfig.id.includes('basic') ? 'basic' : 'premium',
              monthly_amount: priceConfig.amount / 100
            }
          });

          console.log(`✅ Prix ${priceConfig.name} créé:`, newPrice.id);
          createdPrices[priceConfig.id] = newPrice.id;
        }
      } catch (error) {
        console.error(`❌ Erreur création prix ${priceConfig.name}:`, error.message);
      }
    }

    // 3. Afficher le résumé
    console.log('\n📋 RÉSUMÉ DES PRIX CRÉÉS:');
    console.log('================================');
    Object.entries(createdPrices).forEach(([key, priceId]) => {
      console.log(`${key}: ${priceId}`);
    });

    console.log('\n🔧 CONFIGURATION REQUISE:');
    console.log('================================');
    console.log('Mettez à jour les constantes dans votre code:');
    console.log('');
    console.log('const PLAN_PRICES = {');
    Object.entries(createdPrices).forEach(([key, priceId]) => {
      const planName = key.replace('price_', '').replace('_', ' ');
      console.log(`  '${key.replace('price_', '').replace('_', '')}': '${priceId}', // ${planName}`);
    });
    console.log('};');

    console.log('\n✅ Initialisation terminée avec succès!');
    console.log('🔗 Vérifiez dans votre dashboard Stripe: https://dashboard.stripe.com/products');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  createPremiumPrices()
    .then(() => {
      console.log('\n🎉 Script terminé!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { createPremiumPrices };
