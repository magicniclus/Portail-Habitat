#!/usr/bin/env node

/**
 * Script simple pour générer des artisans demo avec OpenAI
 * Usage: node scripts/generate-openai-artisans.js [count]
 */

const { FieldValue } = require('firebase-admin/firestore');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env' });

// Configuration Firebase Admin - utilise la configuration existante
const { adminDb } = require('../lib/firebase-admin.ts');

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Villes françaises avec coordonnées
const FRENCH_CITIES = [
  { name: 'Paris', postalCode: '75001', coordinates: { lat: 48.8566, lng: 2.3522 } },
  { name: 'Lyon', postalCode: '69001', coordinates: { lat: 45.7640, lng: 4.8357 } },
  { name: 'Marseille', postalCode: '13001', coordinates: { lat: 43.2965, lng: 5.3698 } },
  { name: 'Toulouse', postalCode: '31000', coordinates: { lat: 43.6047, lng: 1.4442 } },
  { name: 'Nice', postalCode: '06000', coordinates: { lat: 43.7102, lng: 7.2620 } },
  { name: 'Nantes', postalCode: '44000', coordinates: { lat: 47.2184, lng: -1.5536 } },
  { name: 'Montpellier', postalCode: '34000', coordinates: { lat: 43.6110, lng: 3.8767 } },
  { name: 'Strasbourg', postalCode: '67000', coordinates: { lat: 48.5734, lng: 7.7521 } },
  { name: 'Bordeaux', postalCode: '33000', coordinates: { lat: 44.8378, lng: -0.5792 } },
  { name: 'Lille', postalCode: '59000', coordinates: { lat: 50.6292, lng: 3.0573 } },
  { name: 'Rennes', postalCode: '35000', coordinates: { lat: 48.1173, lng: -1.6778 } },
  { name: 'Reims', postalCode: '51100', coordinates: { lat: 49.2583, lng: 4.0317 } },
  { name: 'Saint-Étienne', postalCode: '42000', coordinates: { lat: 45.4397, lng: 4.3872 } },
  { name: 'Toulon', postalCode: '83000', coordinates: { lat: 43.1242, lng: 5.9280 } },
  { name: 'Grenoble', postalCode: '38000', coordinates: { lat: 45.1885, lng: 5.7245 } },
  { name: 'Dijon', postalCode: '21000', coordinates: { lat: 47.3220, lng: 5.0415 } },
  { name: 'Angers', postalCode: '49000', coordinates: { lat: 47.4784, lng: -0.5632 } },
  { name: 'Nîmes', postalCode: '30000', coordinates: { lat: 43.8367, lng: 4.3601 } },
  { name: 'Clermont-Ferrand', postalCode: '63000', coordinates: { lat: 45.7797, lng: 3.0863 } },
  { name: 'Le Mans', postalCode: '72000', coordinates: { lat: 48.0061, lng: 0.1996 } }
];

// Prestations réelles du système (copiées depuis renovation-suggestions.ts)
const PROFESSIONS = [
  'Rénovation complète de cuisine',
  'Pose cuisine complète', 
  'Rénovation cuisine moderne',
  'Pose carrelage sol',
  'Pose parquet flottant',
  'Peinture intérieure',
  'Installation chauffage',
  'Isolation combles',
  'Ravalement façade',
  'Rénovation complète salle de bain',
  'Installation douche italienne',
  'Pose parquet massif',
  'Rénovation toiture',
  'Charpente traditionnelle',
  'Couverture tuiles',
  'Zinguerie complète',
  'Remplacement gouttières',
  'Création charpente neuve',
  'Réparation charpente',
  'Pose faîtage'
];

function generateSlug(firstName, lastName, city) {
  const base = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${city.toLowerCase()}`;
  return base.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

async function generateArtisanWithOpenAI(city, profession) {
  const prompt = `Génère un artisan ultra-réaliste pour la ville de ${city.name} spécialisé en ${profession}.

DIVERSITÉ OBLIGATOIRE DES NOMS:
- Mélange de noms français traditionnels (Martin, Dubois, Moreau, Leroy, Roux)
- Noms d'origine maghrébine (Benali, Hamdi, Boucher, Amara, Khelifi, Meziane)
- Noms d'origine européenne (Silva, Rossi, Müller, Kowalski, Popovic)
- Noms moins courants mais français (Beaumont, Delacroix, Fontaine, Mercier)
- ÉVITE absolument la répétition des mêmes noms (Lefèvre, Dubois répétés)

NOMS D'ENTREPRISE ULTRA-VARIÉS (pas seulement prénom+nom):
- Noms créatifs: "Bâti-Pro", "Rénov'Expert", "Artisan Plus", "Pro-Habitat"
- Noms géographiques: "${profession} ${city.name}ais", "Entreprise ${city.name}"
- Noms avec SARL/SAS: "Martin SARL", "Silva & Associés", "Groupe Benali"
- Noms descriptifs: "L'Atelier du Bois", "Maison & Rénovation", "Éco-Bâtiment"
- Noms modernes: "Urban ${profession}", "Neo-Habitat", "Smart Building"

CONTRAINTES STRICTES:
- Prénom et nom TRÈS VARIÉS et authentiques
- Nom d'entreprise CRÉATIF et original (éviter prénom+nom systématique)
- Description professionnelle de 2-3 phrases avec années d'expérience (5-20 ans)
- SIRET français valide (format: 14 chiffres)
- Adresse GÉNÉRIQUE: juste "${city.name}" (pas de numéro/rue spécifique)
- 2-3 certifications authentiques du BTP français
- 3-4 services détaillés pour le métier

EXEMPLES D'ENTREPRISES VARIÉES:
- "Rénov'Expert", "Bâti-Pro Lyon", "L'Atelier Plomberie", "Éco-Habitat SARL"
- "Urban Électricité", "Silva & Fils", "Maison Plus", "Pro-Rénovation"

Réponds UNIQUEMENT en JSON valide:
{
  "firstName": "string",
  "lastName": "string", 
  "companyName": "string",
  "description": "string",
  "siret": "string",
  "fullAddress": "string (juste la ville)",
  "certifications": ["string"],
  "services": ["string"]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 800
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Pas de réponse OpenAI');

    return JSON.parse(content);
  } catch (error) {
    console.error('Erreur OpenAI:', error.message);
    // Fallback avec diversité complète
    const fallbackNames = [
      { firstName: "Ahmed", lastName: "Benali" },
      { firstName: "Sofia", lastName: "Silva" },
      { firstName: "Marco", lastName: "Rossi" },
      { firstName: "Karim", lastName: "Hamdi" },
      { firstName: "Marie", lastName: "Fontaine" },
      { firstName: "Jean-Luc", lastName: "Mercier" },
      { firstName: "Fatima", lastName: "Meziane" },
      { firstName: "Thomas", lastName: "Beaumont" },
      { firstName: "Nadia", lastName: "Amara" },
      { firstName: "David", lastName: "Delacroix" }
    ];
    
    const fallbackCompanies = [
      "Bâti-Pro", "Rénov'Expert", "Artisan Plus", "Pro-Habitat",
      "L'Atelier du Bois", "Maison & Rénovation", "Éco-Bâtiment",
      "Urban Habitat", "Neo-Rénovation", "Smart Building",
      `${profession} ${city.name}ais`, `Entreprise ${city.name}`,
      "Habitat Moderne", "Pro-Services", "Réno-Plus"
    ];
    
    const randomName = fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
    const randomCompany = fallbackCompanies[Math.floor(Math.random() * fallbackCompanies.length)];
    
    return {
      firstName: randomName.firstName,
      lastName: randomName.lastName, 
      companyName: randomCompany,
      description: `Artisan ${profession.toLowerCase()} expérimenté à ${city.name}. Plus de ${5 + Math.floor(Math.random() * 15)} ans d'expérience dans le secteur.`,
      siret: Math.floor(Math.random() * 90000000000000) + 10000000000000,
      fullAddress: city.name,
      certifications: ["RGE", "Garantie décennale"],
      services: [profession, "Dépannage", "Rénovation"]
    };
  }
}

async function generateDemoArtisan(index) {
  const city = FRENCH_CITIES[Math.floor(Math.random() * FRENCH_CITIES.length)];
  const profession = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
  
  console.log(`🔄 Génération artisan ${index + 1} - ${profession} à ${city.name}...`);
  
  // Génération avec OpenAI
  const aiData = await generateArtisanWithOpenAI(city, profession);
  
  const slug = generateSlug(aiData.firstName, aiData.lastName, city.name);
  const isPremium = Math.random() < 0.3; // 30% des artisans sont premium (Top Artisan)
  const hasImages = Math.random() < 0.6; // 60% avec images
  
  const demoArtisan = {
    // Identification
    userId: `demo_${Date.now()}_${index}`,
    accountType: 'demo',
    
    // Informations personnelles (OpenAI)
    firstName: aiData.firstName,
    lastName: aiData.lastName,
    companyName: aiData.companyName,
    slug,
    siret: aiData.siret,
    
    // Contact (masqué pour les demos)
    phone: '01 XX XX XX XX',
    email: `demo.${slug}@portail-habitat.fr`,
    
    // Localisation
    city: city.name,
    postalCode: city.postalCode,
    coordinates: city.coordinates,
    fullAddress: aiData.fullAddress,
    
    // Métier
    profession: profession,
    professions: [profession],
    description: aiData.description,
    services: aiData.services || [profession, "Dépannage", "Rénovation"],
    
    // Certifications
    certifications: aiData.certifications,
    
    // Tarification
    averageQuoteMin: Math.round(500 + Math.random() * 1000),
    averageQuoteMax: Math.round(1500 + Math.random() * 2000),
    
    // Évaluations (simulées)
    averageRating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 45) + 5,
    
    // Statut premium
    hasPremiumSite: isPremium,
    monthlySubscriptionPrice: isPremium ? 69 : 0,
    sitePricePaid: isPremium ? 69 : 0,
    subscriptionStatus: isPremium ? 'active' : 'canceled',
    
    // Fonctionnalités premium
    premiumFeatures: isPremium ? {
      isPremium: true,
      premiumStartDate: FieldValue.serverTimestamp(),
      premiumType: 'monthly',
      bannerPhotos: [],
      showTopArtisanBadge: isPremium, // Badge Top Artisan seulement pour les premium
      premiumBenefits: ['multiple_banners', 'top_badge', 'priority_listing']
    } : null,
    
    // Images (pas de photos automatiques)
    logoUrl: null,
    coverUrl: null,
    photos: [],
    
    // Métriques avec avis réalistes
    leadCountThisMonth: Math.floor(Math.random() * 10),
    totalLeads: Math.floor(Math.random() * 50) + 10,
    averageRating: Math.random() * 1.5 + 3.5, // Entre 3.5 et 5.0
    reviewCount: Math.floor(Math.random() * 4) + 1, // Entre 1 et 4 avis
    hasSocialFeed: Math.random() > 0.7,
    publishedPostsCount: Math.floor(Math.random() * 20),
    
    // Notifications et confidentialité
    notifications: {
      emailLeads: true,
      emailReviews: true,
      emailMarketing: Math.random() > 0.5,
      pushNotifications: true
    },
    privacy: {
      profileVisible: true,
      showPhone: true,
      showEmail: false,
      allowDirectContact: true
    },
    
    // Analytics
    analytics: {
      totalViews: Math.floor(Math.random() * 500) + 50,
      totalPhoneClicks: Math.floor(Math.random() * 100) + 10,
      totalFormSubmissions: Math.floor(Math.random() * 50) + 5,
      viewsThisMonth: Math.floor(Math.random() * 100) + 10,
      phoneClicksThisMonth: Math.floor(Math.random() * 20) + 2,
      formSubmissionsThisMonth: Math.floor(Math.random() * 10) + 1,
      lastViewedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    },
    
    // Configuration demo
    demoConfig: {
      isContactable: Math.random() > 0.3, // 70% contactables
      showRealPhone: false,
      redirectToContact: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // +1 an
    },
    
    // Assignations et leads
    assignedLeads: [],
    
    // Posts/chantiers (pour certains artisans demo)
    publishedPostsCount: Math.floor(Math.random() * 8) + 2, // 2-10 posts
    
    // Priorité et dates
    isPriority: isPremium,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };
  
  // Sauvegarder l'artisan dans Firebase
  const artisanRef = adminDb.collection('artisans').doc();
  await artisanRef.set(demoArtisan);
  
  // Générer et sauvegarder les avis dans la sous-collection
  const reviews = await generateReviews(artisanRef.id, demoArtisan.reviewCount, profession, aiData.companyName);
  
  for (const review of reviews) {
    await artisanRef.collection('reviews').add(review);
  }
  
  return artisanRef.id;
}

// Fonction pour générer des avis réalistes
async function generateReviews(artisanId, reviewCount, profession, companyName) {
  const reviews = [];
  
  const reviewTemplates = [
    "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
    "Très satisfait du résultat, artisan sérieux et compétent.",
    "Travail de qualité, respect des délais. Parfait !",
    "Prestation impeccable, je ferai de nouveau appel à ses services.",
    "Artisan à l'écoute, travail soigné et prix correct.",
    "Très bon contact, travail rapide et efficace.",
    "Je recommande, professionnel et de confiance.",
    "Excellent service, très content du résultat final."
  ];
  
  const clientNames = [
    "Marie D.", "Pierre M.", "Sophie L.", "Jean-Luc B.", "Isabelle R.",
    "Thomas G.", "Catherine P.", "Michel C.", "Nathalie F.", "Philippe T.",
    "Sandrine H.", "Laurent V.", "Céline M.", "Frédéric L.", "Valérie S."
  ];
  
  for (let i = 0; i < reviewCount; i++) {
    const rating = Math.floor(Math.random() * 2) + 4; // 4 ou 5 étoiles
    const comment = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
    const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];
    
    // Date aléatoire dans les 6 derniers mois
    const randomDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    
    const review = {
      rating: rating,
      comment: comment,
      clientName: clientName,
      createdAt: randomDate,
      displayed: true
    };
    
    reviews.push(review);
  }
  
  return reviews;
}

async function generateDemoArtisans(count = 50) {
  console.log(`🎭 GÉNÉRATION DE ${count} ARTISANS DEMO AVEC OPENAI`);
  console.log('🤖 Utilisation d\'OpenAI GPT-4 pour des données ultra-réalistes...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY manquante dans les variables d\'environnement');
    process.exit(1);
  }
  
  try {
    let generatedCount = 0;
    
    for (let i = 0; i < count; i++) {
      try {
        const demoArtisanId = await generateDemoArtisan(i);
        if (demoArtisanId) {
          generatedCount++;
          console.log(`✅ Artisan ${generatedCount}/${count} sauvegardé dans Firebase`);
        }
      } catch (error) {
        console.error(`❌ Erreur génération artisan ${i + 1}:`, error.message);
        // Continuer malgré l'erreur
      }
      
      // Délai pour éviter les limites de rate OpenAI
      if (i % 3 === 0 && i > 0) {
        console.log('⏳ Pause pour respecter les limites OpenAI...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log(`🎉 ${generatedCount} ARTISANS DEMO GÉNÉRÉS AVEC SUCCÈS !`);
    console.log('✨ Données ultra-réalistes créées avec OpenAI GPT-4');
    console.log('🔍 Parfaitement invisibles et indiscernables des vrais artisans');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    throw error;
  }
}

async function cleanupDemoArtisans() {
  console.log('🧹 Suppression des artisans demo...');
  
  try {
    const demoArtisans = await adminDb.collection('artisans')
      .where('accountType', '==', 'demo')
      .get();
    
    if (demoArtisans.empty) {
      console.log('✅ Aucun artisan demo à supprimer');
      return;
    }
    
    const batch = adminDb.batch();
    demoArtisans.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ ${demoArtisans.size} artisans demo supprimés`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    throw error;
  }
}

// Script principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const count = parseInt(args[1]) || 50;
  
  if (command === 'cleanup') {
    await cleanupDemoArtisans();
  } else {
    await generateDemoArtisans(count);
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}
