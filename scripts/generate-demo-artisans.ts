import { adminDb } from '../lib/firebase-admin';
import { renovationPrestations } from '../lib/renovation-suggestions';
import { FieldValue } from 'firebase-admin/firestore';
import OpenAI from 'openai';

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Données réalistes pour la génération
const FRENCH_CITIES = [
  // Grandes métropoles
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
  
  // Villes moyennes
  { name: 'Rennes', postalCode: '35000', coordinates: { lat: 48.1173, lng: -1.6778 }, region: 'Bretagne' },
  { name: 'Reims', postalCode: '51100', coordinates: { lat: 49.2583, lng: 4.0317 }, region: 'Grand Est' },
  { name: 'Saint-Étienne', postalCode: '42000', coordinates: { lat: 45.4397, lng: 4.3872 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Le Havre', postalCode: '76600', coordinates: { lat: 49.4944, lng: 0.1079 }, region: 'Normandie' },
  { name: 'Toulon', postalCode: '83000', coordinates: { lat: 43.1242, lng: 5.9280 }, region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Grenoble', postalCode: '38000', coordinates: { lat: 45.1885, lng: 5.7245 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Dijon', postalCode: '21000', coordinates: { lat: 47.3220, lng: 5.0415 }, region: 'Bourgogne-Franche-Comté' },
  { name: 'Angers', postalCode: '49000', coordinates: { lat: 47.4784, lng: -0.5632 }, region: 'Pays de la Loire' },
  { name: 'Nîmes', postalCode: '30000', coordinates: { lat: 43.8367, lng: 4.3601 }, region: 'Occitanie' },
  { name: 'Villeurbanne', postalCode: '69100', coordinates: { lat: 45.7667, lng: 4.8833 }, region: 'Auvergne-Rhône-Alpes' },
  
  // Villes plus petites mais importantes
  { name: 'Clermont-Ferrand', postalCode: '63000', coordinates: { lat: 45.7797, lng: 3.0863 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Aix-en-Provence', postalCode: '13100', coordinates: { lat: 43.5297, lng: 5.4474 }, region: 'Provence-Alpes-Côte d\'Azur' },
  { name: 'Brest', postalCode: '29200', coordinates: { lat: 48.3904, lng: -4.4861 }, region: 'Bretagne' },
  { name: 'Tours', postalCode: '37000', coordinates: { lat: 47.3941, lng: 0.6848 }, region: 'Centre-Val de Loire' },
  { name: 'Amiens', postalCode: '80000', coordinates: { lat: 49.8941, lng: 2.2958 }, region: 'Hauts-de-France' },
  { name: 'Limoges', postalCode: '87000', coordinates: { lat: 45.8336, lng: 1.2611 }, region: 'Nouvelle-Aquitaine' },
  { name: 'Annecy', postalCode: '74000', coordinates: { lat: 45.8992, lng: 6.1294 }, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Perpignan', postalCode: '66000', coordinates: { lat: 42.6886, lng: 2.8946 }, region: 'Occitanie' },
  { name: 'Besançon', postalCode: '25000', coordinates: { lat: 47.2378, lng: 6.0241 }, region: 'Bourgogne-Franche-Comté' },
  { name: 'Orléans', postalCode: '45000', coordinates: { lat: 47.9029, lng: 1.9093 }, region: 'Centre-Val de Loire' }
];

const FIRST_NAMES = [
  'Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'Alain', 'Bernard', 'Christian', 'Daniel', 'François',
  'Jacques', 'Laurent', 'Nicolas', 'Patrick', 'Paul', 'Stéphane', 'Thierry', 'Vincent', 'Yves', 'Julien',
  'David', 'Christophe', 'Olivier', 'Sébastien', 'Frédéric', 'Éric', 'Fabrice', 'Cédric', 'Ludovic', 'Bruno',
  'Marie', 'Nathalie', 'Isabelle', 'Sylvie', 'Catherine', 'Françoise', 'Monique', 'Chantal', 'Christine', 'Martine',
  'Sandrine', 'Valérie', 'Corinne', 'Véronique', 'Brigitte', 'Pascale', 'Céline', 'Sophie', 'Karine', 'Laurence'
];

const LAST_NAMES = [
  'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
  'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard',
  'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Lefevre', 'Faure', 'Andre',
  'Mercier', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'Francois', 'Legrand', 'Gauthier', 'Garcia',
  'Perrin', 'Robin', 'Clement', 'Morin', 'Nicolas', 'Henry', 'Roussel', 'Mathieu', 'Gautier', 'Masson'
];

const COMPANY_SUFFIXES = [
  'SARL', 'SAS', 'EURL', 'Bâtiment', 'Construction', 'Rénovation', 
  'Travaux', 'Services', 'Entreprise', 'Artisanat', 'et Fils',
  'Frères', 'et Associés', 'Pro', 'Expert', 'Spécialisé', 'Métier', 'Craft'
];

const CERTIFICATIONS = [
  'RGE', 'Qualibat', 'Garantie décennale', 'Assurance responsabilité civile',
  'Certification Qualité', 'Label Artisan', 'Maître Artisan', 'Compagnon du Devoir'
];

// Extraire les prestations du simulateur
const AVAILABLE_PRESTATIONS = renovationPrestations
  .filter(prestation => prestation.questionnaire)
  .map(prestation => prestation.nom);

interface DemoArtisanConfig {
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

function getCityAdjective(cityName: string): string {
  const cityAdjectives: Record<string, string> = {
    'Paris': 'Parisienne',
    'Lyon': 'Lyonnaise', 
    'Marseille': 'Marseillaise',
    'Toulouse': 'Toulousaine',
    'Nice': 'Niçoise',
    'Nantes': 'Nantaise',
    'Strasbourg': 'Strasbourgeoise',
    'Montpellier': 'Montpelliéraine',
    'Bordeaux': 'Bordelaise',
    'Lille': 'Lilloise',
    'Rennes': 'Rennaise',
    'Reims': 'Rémoise',
    'Le Havre': 'Havraise',
    'Saint-Étienne': 'Stéphanoise',
    'Toulon': 'Toulonnaise',
    'Grenoble': 'Grenobloise',
    'Dijon': 'Dijonnaise',
    'Angers': 'Angevine',
    'Nîmes': 'Nîmoise',
    'Villeurbanne': 'Villeurbannaise'
  };
  
  return cityAdjectives[cityName] || `de ${cityName}`;
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomRating(): number {
  // Génère une note entre 4.0 et 5.0 pour avoir de bonnes notes
  return Math.round((4.0 + Math.random() * 1.0) * 10) / 10;
}

function generateRandomReviewCount(): number {
  // Entre 5 et 50 avis pour paraître crédible
  return Math.floor(Math.random() * 45) + 5;
}

function generateQuoteRange(prestations: string[]): { min: number; max: number } {
  // Calcul basé sur les prestations sélectionnées
  const baseMin = 500;
  const baseMax = 2000;
  const multiplier = prestations.length * 0.5 + 1;
  
  return {
    min: Math.round(baseMin * multiplier),
    max: Math.round(baseMax * multiplier)
  };
}

function shouldBePremium(): boolean {
  // 30% des artisans demo seront premium
  return Math.random() < 0.3;
}

function shouldHaveImages(): boolean {
  // 60% des artisans demo auront des images
  return Math.random() < 0.6;
}

function generateDescription(firstName: string, prestations: string[], city: string, companyName: string): string {
  const profession = prestations[0].toLowerCase();
  const experience = Math.floor(Math.random() * 15) + 5; // 5-20 ans d'expérience
  const teamSize = Math.random() > 0.7 ? 'et son équipe' : '';
  
  const templates = [
    `${companyName} intervient depuis ${experience} ans dans le domaine de ${profession} à ${city} et ses environs. ${firstName} ${teamSize} vous garantit un travail soigné, dans le respect des délais et des normes en vigueur.`,
    
    `Artisan ${profession} établi à ${city}, ${firstName} cumule ${experience} années d'expérience dans le secteur. Notre entreprise ${companyName} privilégie la qualité et la satisfaction client sur chaque chantier.`,
    
    `${firstName} dirige ${companyName}, entreprise spécialisée en ${profession} basée à ${city}. Fort de ${experience} ans d'expérience, nous réalisons vos projets avec expertise et professionnalisme.`,
    
    `Depuis ${experience} ans, ${companyName} accompagne les particuliers et professionnels de ${city} dans leurs travaux de ${profession}. ${firstName} ${teamSize} met un point d'honneur à respecter vos exigences.`,
    
    `${firstName}, gérant de ${companyName}, exerce le métier de ${profession} à ${city} depuis ${experience} ans. Notre savoir-faire reconnu nous permet de vous proposer des prestations de qualité.`,
    
    `Basée à ${city}, l'entreprise ${companyName} est spécialisée dans ${profession}. Avec ${experience} années d'expérience, ${firstName} ${teamSize} vous assure un service personnalisé et des finitions impeccables.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

async function generateDemoArtisan(index: number): Promise<any> {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const city = FRENCH_CITIES[Math.floor(Math.random() * FRENCH_CITIES.length)];
  
  // Sélection intelligente des prestations (1 à 4 prestations par artisan)
  const prestationCount = Math.floor(Math.random() * 4) + 1;
  const selectedPrestations = getRandomElements(AVAILABLE_PRESTATIONS, prestationCount);
  const mainProfession = selectedPrestations[0];
  
  const slug = generateSlug(firstName, lastName, city.name);
  // Génération plus réaliste des noms d'entreprise
  const companyType = Math.random();
  let companyName: string;
  
  if (companyType < 0.4) {
    // 40% : Nom + Prénom (ex: "Martin Pierre")
    companyName = `${lastName} ${firstName}`;
  } else if (companyType < 0.7) {
    // 30% : Nom + Suffixe (ex: "Martin SARL", "Dubois Bâtiment")
    companyName = `${lastName} ${COMPANY_SUFFIXES[Math.floor(Math.random() * COMPANY_SUFFIXES.length)]}`;
  } else {
    // 30% : Nom métier + Ville (ex: "Plomberie Parisienne", "Électricité Lyonnaise")
    const professionBase = selectedPrestations[0].split(' ')[0]; // Premier mot de la prestation
    const cityAdjective = getCityAdjective(city.name);
    companyName = `${professionBase} ${cityAdjective}`;
  }
  
  const isPremium = shouldBePremium();
  const hasImages = shouldHaveImages();
  const quoteRange = generateQuoteRange(selectedPrestations);
  
  // Certifications aléatoires (1 à 3)
  const certificationCount = Math.floor(Math.random() * 3) + 1;
  const selectedCertifications = getRandomElements(CERTIFICATIONS, certificationCount);
  
  const demoArtisan = {
    // Identification
    userId: `demo_${Date.now()}_${index}`,
    accountType: 'demo' as const,
    
    // Informations personnelles
    firstName,
    lastName,
    companyName,
    slug,
    
    // Contact (masqué pour les demos)
    phone: '01 XX XX XX XX', // Numéro masqué
    email: `demo.${slug}@portail-habitat.fr`,
    
    // Localisation
    city: city.name,
    postalCode: city.postalCode,
    coordinates: city.coordinates,
    fullAddress: `${Math.floor(Math.random() * 200) + 1} rue de la ${['République', 'Paix', 'Liberté', 'Mairie', 'Église'][Math.floor(Math.random() * 5)]}`,
    
    // Métier
    profession: mainProfession,
    professions: selectedPrestations,
    description: generateDescription(firstName, selectedPrestations, city.name, companyName),
    
    // Certifications et qualifications
    certifications: selectedCertifications,
    
    // Tarification
    averageQuoteMin: quoteRange.min,
    averageQuoteMax: quoteRange.max,
    
    // Évaluations (simulées)
    averageRating: generateRandomRating(),
    reviewCount: generateRandomReviewCount(),
    
    // Images (conditionnelles)
    logoUrl: hasImages ? `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=200&h=200&fit=crop&crop=face` : '',
    coverUrl: hasImages ? `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=400&fit=crop` : '',
    photos: hasImages ? [
      `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=600&h=400&fit=crop`,
      `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=600&h=400&fit=crop`
    ] : [],
    
    // Premium (conditionnel)
    ...(isPremium && {
      premiumFeatures: {
        isPremium: true,
        premiumType: 'demo' as const,
        premiumStartDate: new Date(),
        showTopArtisanBadge: true,
        bannerPhotos: hasImages ? [
          `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=1200&h=400&fit=crop`,
          `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=1200&h=400&fit=crop`
        ] : [],
        premiumBenefits: ["multiple_banners", "video_banner", "top_badge", "priority_listing"]
      }
    }),
    
    // Configuration demo
    demoConfig: {
      isContactable: false, // Pas de contact direct
      showRealPhone: false, // Numéro masqué
      redirectToContact: true, // Redirection vers formulaire général
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Expire dans 1 an
    },
    
    // Statistiques
    leadCountThisMonth: Math.floor(Math.random() * 10),
    totalLeads: Math.floor(Math.random() * 50) + 10,
    publishedPostsCount: Math.floor(Math.random() * 8),
    
    // Statuts
    subscriptionStatus: 'demo',
    hasPremiumSite: isPremium,
    hasSocialFeed: Math.random() > 0.5,
    isPriority: isPremium,
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return demoArtisan;
}

export async function generateDemoArtisans(count: number = 100): Promise<void> {
  console.log(`🚀 Génération de ${count} artisans demo...`);
  
  const batch = adminDb.batch();
  const artisans: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const artisan = await generateDemoArtisan(i);
    artisans.push(artisan);
    
    const artisanRef = adminDb.collection('artisans').doc(artisan.userId);
    batch.set(artisanRef, artisan);
    
    if (i % 10 === 0) {
      console.log(`📝 Généré ${i + 1}/${count} artisans...`);
    }
  }
  
  // Commit par batch de 500 (limite Firestore)
  const batchSize = 500;
  for (let i = 0; i < artisans.length; i += batchSize) {
    const currentBatch = adminDb.batch();
    const currentArtisans = artisans.slice(i, i + batchSize);
    
    currentArtisans.forEach((artisan: any) => {
      const artisanRef = adminDb.collection('artisans').doc(artisan.userId);
      currentBatch.set(artisanRef, artisan);
    });
    
    await currentBatch.commit();
    console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} committé (${currentArtisans.length} artisans)`);
  }
  
  console.log(`🎉 ${count} artisans demo générés avec succès !`);
  
  // Statistiques de génération
  const premiumCount = artisans.filter(a => a.premiumFeatures?.isPremium).length;
  const withImagesCount = artisans.filter(a => a.logoUrl || a.coverUrl).length;
  const prestationsStats = artisans.reduce((acc, artisan) => {
    artisan.professions.forEach((prof: string) => {
      acc[prof] = (acc[prof] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`📊 Statistiques :`);
  console.log(`   - Artisans premium : ${premiumCount}/${count} (${Math.round(premiumCount/count*100)}%)`);
  console.log(`   - Avec images : ${withImagesCount}/${count} (${Math.round(withImagesCount/count*100)}%)`);
  console.log(`   - Répartition géographique : ${FRENCH_CITIES.length} villes`);
  console.log(`   - Prestations les plus représentées :`);
  
  Object.entries(prestationsStats)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .forEach(([prestation, count]) => {
      console.log(`     • ${prestation} : ${count} artisans`);
    });
}

// Fonction pour nettoyer les artisans demo
export async function cleanupDemoArtisans(): Promise<void> {
  console.log('🧹 Nettoyage des artisans demo...');
  
  const demoArtisans = await adminDb.collection('artisans')
    .where('accountType', '==', 'demo')
    .get();
  
  const batch = adminDb.batch();
  demoArtisans.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`✅ ${demoArtisans.size} artisans demo supprimés`);
}

// Script principal
if (require.main === module) {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 100;
  
  generateDemoArtisans(count)
    .then(() => {
      console.log('✨ Génération terminée !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur lors de la génération :', error);
      process.exit(1);
    });
}
