import { adminDb } from '../lib/firebase-admin.js';
import { renovationPrestations } from '../lib/renovation-suggestions';
import { FieldValue } from 'firebase-admin/firestore';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env
dotenv.config({ path: '.env' });

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Villes françaises réelles avec coordonnées GPS
const FRENCH_CITIES = [
  { name: 'Paris', postalCode: '75001', coordinates: { lat: 48.8566, lng: 2.3522 }, region: 'Île-de-France' },
  { name: 'Lyon', postalCode: '69001', coordinates: { lat: 45.7640, lng: 4.8357 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Marseille', postalCode: '13001', coordinates: { lat: 43.2965, lng: 5.3698 }, region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Toulouse', postalCode: '31000', coordinates: { lat: 43.6047, lng: 1.4442 }, region: 'Occitanie' },
  { name: 'Nice', postalCode: '06000', coordinates: { lat: 43.7102, lng: 7.2620 }, region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Nantes', postalCode: '44000', coordinates: { lat: 47.2184, lng: -1.5536 }, region: 'Pays de la Loire' },
  { name: 'Montpellier', postalCode: '34000', coordinates: { lat: 43.6110, lng: 3.8767 }, region: 'Occitanie' },
  { name: 'Strasbourg', postalCode: '67000', coordinates: { lat: 48.5734, lng: 7.7521 }, region: 'Grand Est' },
  { name: 'Bordeaux', postalCode: '33000', coordinates: { lat: 44.8378, lng: -0.5792 }, region: 'Nouvelle-Aquitaine' },
  { name: 'Lille', postalCode: '59000', coordinates: { lat: 50.6292, lng: 3.0573 }, region: 'Hauts-de-France' },
  { name: 'Rennes', postalCode: '35000', coordinates: { lat: 48.1173, lng: -1.6778 }, region: 'Bretagne' },
  { name: 'Reims', postalCode: '51100', coordinates: { lat: 49.2583, lng: 4.0317 }, region: 'Grand Est' },
  { name: 'Le Havre', postalCode: '76600', coordinates: { lat: 49.4944, lng: 0.1079 }, region: 'Normandie' },
  { name: 'Saint-Étienne', postalCode: '42000', coordinates: { lat: 45.4397, lng: 4.3872 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Toulon', postalCode: '83000', coordinates: { lat: 43.1242, lng: 5.9280 }, region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Grenoble', postalCode: '38000', coordinates: { lat: 45.1885, lng: 5.7245 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Dijon', postalCode: '21000', coordinates: { lat: 47.3220, lng: 5.0415 }, region: 'Bourgogne-Franche-Comté' },
  { name: 'Angers', postalCode: '49000', coordinates: { lat: 47.4784, lng: -0.5632 }, region: 'Pays de la Loire' },
  { name: 'Nîmes', postalCode: '30000', coordinates: { lat: 43.8367, lng: 4.3601 }, region: 'Occitanie' },
  { name: 'Villeurbanne', postalCode: '69100', coordinates: { lat: 45.7667, lng: 4.8833 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Clermont-Ferrand', postalCode: '63000', coordinates: { lat: 45.7797, lng: 3.0863 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Le Mans', postalCode: '72000', coordinates: { lat: 48.0061, lng: 0.1996 }, region: 'Pays de la Loire' },
  { name: 'Aix-en-Provence', postalCode: '13100', coordinates: { lat: 43.5297, lng: 5.4474 }, region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Brest', postalCode: '29200', coordinates: { lat: 48.3905, lng: -4.4860 }, region: 'Bretagne' },
  { name: 'Tours', postalCode: '37000', coordinates: { lat: 47.3941, lng: 0.6848 }, region: 'Centre-Val de Loire' },
  { name: 'Limoges', postalCode: '87000', coordinates: { lat: 45.8336, lng: 1.2611 }, region: 'Nouvelle-Aquitaine' },
  { name: 'Amiens', postalCode: '80000', coordinates: { lat: 49.8941, lng: 2.2958 }, region: 'Hauts-de-France' },
  { name: 'Annecy', postalCode: '74000', coordinates: { lat: 45.8992, lng: 6.1294 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Perpignan', postalCode: '66000', coordinates: { lat: 42.6886, lng: 2.8946 }, region: 'Occitanie' },
  { name: 'Besançon', postalCode: '25000', coordinates: { lat: 47.2380, lng: 6.0243 }, region: 'Bourgogne-Franche-Comté' }
];

// Extraire les prestations disponibles
const AVAILABLE_PRESTATIONS = renovationPrestations
  .filter(prestation => prestation.questionnaire)
  .map(prestation => prestation.nom);

// Interface pour les artisans demo
interface DemoArtisanData {
  accountType: 'demo';
  demoConfig: {
    isContactable: boolean;
    showRealPhone: boolean;
    redirectToContact: boolean;
    expiresAt?: Date;
  };
}

function generateSlug(firstName: string, lastName: string, city: string): string {
  const base = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${city.toLowerCase()}`;
  return base.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomRating(): number {
  return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
}

function generateRandomReviewCount(): number {
  return Math.floor(Math.random() * 45) + 5;
}

function generateQuoteRange(prestations: string[]): { min: number; max: number } {
  const baseMin = 500;
  const baseMax = 2000;
  const multiplier = prestations.length * 0.5 + 1;
  
  return {
    min: Math.round(baseMin * multiplier),
    max: Math.round(baseMax * multiplier)
  };
}

function shouldBePremium(): boolean {
  return Math.random() < 0.3;
}

function shouldHaveImages(): boolean {
  return Math.random() < 0.6;
}

// Génération avec OpenAI
async function generateArtisanWithOpenAI(city: any, prestations: string[]): Promise<any> {
  const prompt = `Génère un artisan français ultra-réaliste pour la ville de ${city.name} (${city.region}) spécialisé dans: ${prestations.join(', ')}.

CONTRAINTES STRICTES:
- Prénom et nom français authentiques et courants
- Nom d'entreprise crédible (40% Nom+Prénom, 30% Nom+SARL/SAS/Bâtiment, 30% Métier+Ville comme "Plomberie ${city.name.split(' ')[0]}aise")
- Description professionnelle de 2-3 phrases avec années d'expérience (5-20 ans)
- SIRET français valide (format: 14 chiffres)
- Adresse réelle dans ${city.name} avec numéro et nom de rue existants
- Certifications authentiques du BTP français
- Services détaillés et réalistes pour le métier

Réponds UNIQUEMENT en JSON valide:
{
  "firstName": "string",
  "lastName": "string", 
  "companyName": "string",
  "description": "string",
  "siret": "string",
  "fullAddress": "string",
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
    console.error('Erreur OpenAI:', error);
    // Fallback simple si OpenAI échoue
    return {
      firstName: "Pierre",
      lastName: "Martin", 
      companyName: "Martin Bâtiment",
      description: `Artisan expérimenté spécialisé dans ${prestations[0].toLowerCase()} à ${city.name}. Plus de 10 ans d'expérience dans le secteur.`,
      siret: "12345678901234",
      fullAddress: `15 rue de la République, ${city.postalCode} ${city.name}`,
      certifications: ["RGE", "Garantie décennale"],
      services: prestations.slice(0, 3)
    };
  }
}

async function generateDemoArtisan(index: number): Promise<any> {
  const city = FRENCH_CITIES[Math.floor(Math.random() * FRENCH_CITIES.length)];
  
  // Sélection intelligente des prestations (1 à 4 prestations par artisan)
  const prestationCount = Math.floor(Math.random() * 4) + 1;
  const selectedPrestations = getRandomElements(AVAILABLE_PRESTATIONS, prestationCount);
  const mainProfession = selectedPrestations[0];
  
  // Génération avec OpenAI
  const aiData = await generateArtisanWithOpenAI(city, selectedPrestations);
  
  const slug = generateSlug(aiData.firstName, aiData.lastName, city.name);
  const isPremium = shouldBePremium();
  const hasImages = shouldHaveImages();
  const quoteRange = generateQuoteRange(selectedPrestations);
  
  // Certifications (mix AI + prédéfinies)
  const baseCertifications = ["RGE", "Qualibat", "Garantie décennale", "Assurance responsabilité civile"];
  const finalCertifications = [...new Set([...aiData.certifications, ...getRandomElements(baseCertifications, 2)])];
  
  const demoArtisan = {
    // Identification
    userId: `demo_${Date.now()}_${index}`,
    accountType: 'demo' as const,
    
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
    profession: mainProfession,
    professions: selectedPrestations,
    description: aiData.description,
    services: aiData.services || selectedPrestations.slice(0, 3),
    
    // Certifications et qualifications
    certifications: finalCertifications,
    
    // Tarification
    averageQuoteMin: quoteRange.min,
    averageQuoteMax: quoteRange.max,
    
    // Évaluations (simulées)
    averageRating: generateRandomRating(),
    reviewCount: generateRandomReviewCount(),
    
    // Statut premium
    hasPremiumSite: isPremium,
    monthlySubscriptionPrice: isPremium ? (Math.random() > 0.5 ? 89 : 129) : 0,
    sitePricePaid: isPremium ? (Math.random() > 0.5 ? 69 : 299) : 0,
    subscriptionStatus: isPremium ? 'active' : 'canceled',
    
    // Fonctionnalités premium
    premiumFeatures: isPremium ? {
      isPremium: true,
      premiumStartDate: FieldValue.serverTimestamp(),
      premiumType: 'monthly',
      bannerPhotos: hasImages ? [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800'
      ] : [],
      showTopArtisanBadge: Math.random() > 0.5,
      premiumBenefits: ['multiple_banners', 'top_badge', 'priority_listing']
    } : null,
    
    // Images
    logoUrl: hasImages ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' : null,
    coverUrl: hasImages ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200' : null,
    photos: hasImages ? [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600'
    ] : [],
    
    // Métriques
    leadCountThisMonth: Math.floor(Math.random() * 10),
    totalLeads: Math.floor(Math.random() * 50) + 10,
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
    
    // Priorité et dates
    isPriority: isPremium,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };
  
  return demoArtisan;
}

export async function generateDemoArtisans(count: number = 50): Promise<void> {
  console.log(`🎭 GÉNÉRATION DE ${count} ARTISANS DEMO AVEC OPENAI`);
  console.log('🤖 Utilisation d\'OpenAI pour des données ultra-réalistes...');
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('❌ OPENAI_API_KEY manquante dans les variables d\'environnement');
  }
  
  try {
    const batch = adminDb.batch();
    let generatedCount = 0;
    
    for (let i = 0; i < count; i++) {
      console.log(`🔄 Génération artisan ${i + 1}/${count}...`);
      
      const demoArtisan = await generateDemoArtisan(i);
      const docRef = adminDb.collection('artisans').doc();
      
      batch.set(docRef, demoArtisan);
      generatedCount++;
      
      // Commit par batch de 500 (limite Firestore)
      if (generatedCount % 500 === 0) {
        await batch.commit();
        console.log(`✅ Batch de 500 artisans sauvegardé (${generatedCount}/${count})`);
      }
      
      // Délai pour éviter les limites de rate OpenAI
      if (i % 10 === 0 && i > 0) {
        console.log('⏳ Pause pour respecter les limites OpenAI...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Commit final
    if (generatedCount % 500 !== 0) {
      await batch.commit();
    }
    
    console.log(`🎉 ${generatedCount} ARTISANS DEMO GÉNÉRÉS AVEC SUCCÈS !`);
    console.log('✨ Données ultra-réalistes créées avec OpenAI');
    console.log('🔍 Parfaitement invisibles et indiscernables des vrais artisans');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    throw error;
  }
}

export async function cleanupDemoArtisans(): Promise<void> {
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
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const count = parseInt(args[1]) || 50;
  
  if (command === 'cleanup') {
    cleanupDemoArtisans()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    generateDemoArtisans(count)
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}
