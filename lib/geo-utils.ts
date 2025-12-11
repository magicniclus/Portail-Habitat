// Fonction pour calculer la distance entre deux points géographiques (formule de Haversine)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Arrondir à 1 décimale
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Fonction pour filtrer les artisans par distance
export function filterArtisansByDistance(
  artisans: any[],
  centerLat: number,
  centerLng: number,
  maxDistance: number = 100 // Distance max en km
): any[] {
  return artisans
    .map(artisan => {
      if (!artisan.coordinates?.lat || !artisan.coordinates?.lng) {
        return { ...artisan, distance: null };
      }
      
      const distance = calculateDistance(
        centerLat,
        centerLng,
        artisan.coordinates.lat,
        artisan.coordinates.lng
      );
      
      return { ...artisan, distance };
    })
    .filter(artisan => artisan.distance === null || artisan.distance <= maxDistance)
    .sort((a, b) => {
      // Trier par distance (les plus proches en premier)
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
}

// Interface pour les coordonnées
export interface Coordinates {
  lat: number;
  lng: number;
}

// Interface pour la réponse de l'API Géo
interface GeoApiResponse {
  nom: string;
  centre: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Fonction pour récupérer les coordonnées d'un code postal avec Mapbox UNIQUEMENT
export async function getCoordinatesFromPostalCode(postalCode: string): Promise<{
  city: string;
  coordinates: Coordinates;
} | null> {
  try {
    console.log(`🌍 Récupération coordonnées Mapbox DYNAMIQUE pour: ${postalCode}`);
    
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFnaWNuaWNsdXMiLCJhIjoiY2x6cWJhZGFvMGNxMjJqcGU4cGZqZGNsZCJ9.VYLgXgPKELUYXwJJgNKGFQ';
    
    // STRATÉGIE 1: Recherche par code postal exact
    console.log(`📍 Étape 1: Recherche Mapbox type=postcode`);
    let response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${postalCode}.json?country=FR&types=postcode&access_token=${mapboxToken}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return extractMapboxResult(data.features[0], 'postcode');
      }
      console.log(`🔄 Aucun résultat avec type=postcode`);
    }
    
    // STRATÉGIE 2: Recherche élargie place + address
    console.log(`📍 Étape 2: Recherche Mapbox type=place,address`);
    response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${postalCode}.json?country=FR&types=place,address&access_token=${mapboxToken}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return extractMapboxResult(data.features[0], 'place/address');
      }
      console.log(`🔄 Aucun résultat avec type=place,address`);
    }
    
    // STRATÉGIE 3: Recherche très large sans restriction
    console.log(`📍 Étape 3: Recherche Mapbox sans restriction de type`);
    response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${postalCode}.json?country=FR&access_token=${mapboxToken}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return extractMapboxResult(data.features[0], 'général');
      }
    }
    
    // STRATÉGIE 4: Recherche avec le code postal comme nom de ville
    console.log(`📍 Étape 4: Recherche Mapbox par nom de ville potentiel`);
    
    // Essayer de deviner le nom de ville à partir du code postal
    const possibleCityNames = generatePossibleCityNames(postalCode);
    
    for (const cityName of possibleCityNames) {
      console.log(`🔍 Tentative avec nom de ville: ${cityName}`);
      response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?country=FR&types=place&access_token=${mapboxToken}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          // Vérifier si le code postal correspond
          const feature = data.features[0];
          if (feature.context) {
            const postcodeContext = feature.context.find((ctx: any) => 
              ctx.id.startsWith('postcode.') && ctx.text === postalCode
            );
            if (postcodeContext) {
              return extractMapboxResult(feature, 'ville devinée');
            }
          }
        }
      }
    }
    
    console.log(`❌ Aucun résultat Mapbox trouvé pour ${postalCode} avec toutes les stratégies`);
    
    // STRATÉGIE 5: Recherche directe par nom de ville pour codes génériques
    if (postalCode === '75000') {
      console.log(`📍 Étape 5: Code générique 75000 → Recherche directe "Paris"`);
      const parisResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/Paris.json?country=FR&types=place&access_token=${mapboxToken}`
      );
      if (parisResponse.ok) {
        const parisData = await parisResponse.json();
        if (parisData.features && parisData.features.length > 0) {
          return extractMapboxResult(parisData.features[0], 'code générique → Paris');
        }
      }
    }
    
    if (postalCode === '69000') {
      console.log(`📍 Étape 5: Code générique 69000 → Recherche directe "Lyon"`);
      const lyonResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/Lyon.json?country=FR&types=place&access_token=${mapboxToken}`
      );
      if (lyonResponse.ok) {
        const lyonData = await lyonResponse.json();
        if (lyonData.features && lyonData.features.length > 0) {
          return extractMapboxResult(lyonData.features[0], 'code générique → Lyon');
        }
      }
    }
    
    if (postalCode === '13000') {
      console.log(`📍 Étape 5: Code générique 13000 → Recherche directe "Marseille"`);
      const marseilleResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/Marseille.json?country=FR&types=place&access_token=${mapboxToken}`
      );
      if (marseilleResponse.ok) {
        const marseilleData = await marseilleResponse.json();
        if (marseilleData.features && marseilleData.features.length > 0) {
          return extractMapboxResult(marseilleData.features[0], 'code générique → Marseille');
        }
      }
    }
    
    // Vérification finale : est-ce un code postal français valide ?
    if (!/^[0-9]{5}$/.test(postalCode)) {
      console.log(`❌ Format de code postal invalide: ${postalCode}`);
      return null;
    }
    
    // Vérifier si c'est un département français valide
    const department = postalCode.substring(0, 2);
    const validDepartments = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '2A', '2B', '21', '22', '23', 
      '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', 
      '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', 
      '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', 
      '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', 
      '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', 
      '94', '95'];
    
    if (!validDepartments.includes(department)) {
      console.log(`❌ Département non valide: ${department} pour le code postal ${postalCode}`);
      return null;
    }
    
    console.log(`⚠️ Code postal ${postalCode} semble valide (département ${department}) mais non trouvé par Mapbox`);
    return null;
    
  } catch (error) {
    console.error(`❌ Erreur complète Mapbox pour ${postalCode}:`, error);
    return null;
  }
}

// Fonction pour extraire et formater le résultat Mapbox
function extractMapboxResult(feature: any, source: string): {
  city: string;
  coordinates: Coordinates;
} {
  const coordinates: Coordinates = {
    lat: feature.center[1], // latitude
    lng: feature.center[0]  // longitude
  };
  
  // Extraire le nom de la ville de façon intelligente
  let cityName = feature.text || feature.place_name.split(',')[0];
  
  // Chercher dans le contexte pour une ville plus précise
  if (feature.context) {
    const cityContext = feature.context.find((ctx: any) => 
      ctx.id.startsWith('place.') || ctx.id.startsWith('locality.')
    );
    if (cityContext) {
      cityName = cityContext.text;
    }
  }
  
  console.log(`✅ Coordonnées Mapbox trouvées via ${source}:`, {
    city: cityName,
    coordinates,
    fullAddress: feature.place_name
  });
  
  return {
    city: cityName,
    coordinates
  };
}

// Fonction pour générer des noms de villes possibles à partir du code postal
function generatePossibleCityNames(postalCode: string): string[] {
  // Mapping des départements vers leurs préfectures principales
  const departmentCities: { [key: string]: string[] } = {
    '01': ['Bourg-en-Bresse'],
    '02': ['Laon'],
    '03': ['Moulins'],
    '04': ['Digne-les-Bains'],
    '05': ['Gap'],
    '06': ['Nice'],
    '07': ['Privas'],
    '08': ['Charleville-Mézières'],
    '09': ['Foix'],
    '10': ['Troyes'],
    '11': ['Carcassonne'],
    '12': ['Rodez'],
    '13': ['Marseille'],
    '14': ['Caen'],
    '15': ['Aurillac'],
    '16': ['Angoulême'],
    '17': ['La Rochelle'],
    '18': ['Bourges'],
    '19': ['Tulle'],
    '20': ['Ajaccio'],
    '21': ['Dijon'],
    '22': ['Saint-Brieuc'],
    '23': ['Guéret'],
    '24': ['Périgueux'],
    '25': ['Besançon'],
    '26': ['Valence'],
    '27': ['Évreux'],
    '28': ['Chartres'],
    '29': ['Quimper'],
    '30': ['Nîmes'],
    '31': ['Toulouse'],
    '32': ['Auch'],
    '33': ['Bordeaux'],
    '34': ['Montpellier'],
    '35': ['Rennes'],
    '36': ['Châteauroux'],
    '37': ['Tours'],
    '38': ['Grenoble'],
    '39': ['Lons-le-Saunier'],
    '40': ['Mont-de-Marsan'],
    '41': ['Blois'],
    '42': ['Saint-Étienne'],
    '43': ['Le Puy-en-Velay'],
    '44': ['Nantes'],
    '45': ['Orléans'],
    '46': ['Cahors'],
    '47': ['Agen'],
    '48': ['Mende'],
    '49': ['Angers'],
    '50': ['Saint-Lô'],
    '51': ['Châlons-en-Champagne'],
    '52': ['Chaumont'],
    '53': ['Laval'],
    '54': ['Nancy'],
    '55': ['Bar-le-Duc'],
    '56': ['Vannes'],
    '57': ['Metz'],
    '58': ['Nevers'],
    '59': ['Lille'],
    '60': ['Beauvais'],
    '61': ['Alençon'],
    '62': ['Arras'],
    '63': ['Clermont-Ferrand'],
    '64': ['Pau'],
    '65': ['Tarbes'],
    '66': ['Perpignan'],
    '67': ['Strasbourg'],
    '68': ['Colmar'],
    '69': ['Lyon'],
    '70': ['Vesoul'],
    '71': ['Mâcon'],
    '72': ['Le Mans'],
    '73': ['Chambéry'],
    '74': ['Annecy'],
    '75': ['Paris'],
    '76': ['Rouen'],
    '77': ['Melun'],
    '78': ['Versailles'],
    '79': ['Niort'],
    '80': ['Amiens'],
    '81': ['Albi'],
    '82': ['Montauban'],
    '83': ['Toulon'],
    '84': ['Avignon'],
    '85': ['La Roche-sur-Yon'],
    '86': ['Poitiers'],
    '87': ['Limoges'],
    '88': ['Épinal'],
    '89': ['Auxerre'],
    '90': ['Belfort'],
    '91': ['Évry'],
    '92': ['Nanterre'],
    '93': ['Bobigny'],
    '94': ['Créteil'],
    '95': ['Cergy']
  };
  
  const department = postalCode.substring(0, 2);
  return departmentCities[department] || [];
}


// Fonction générale pour géolocaliser avec Mapbox (ville, adresse, code postal)
export async function getCoordinatesFromLocation(location: string): Promise<{
  city: string;
  coordinates: Coordinates;
  fullAddress?: string;
} | null> {
  try {
    console.log(`🌍 Géolocalisation Mapbox pour: ${location}`);
    
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFnaWNuaWNsdXMiLCJhIjoiY2x6cWJhZGFvMGNxMjJqcGU4cGZqZGNsZCJ9.VYLgXgPKELUYXwJJgNKGFQ';
    
    // Recherche générale avec Mapbox
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?country=FR&access_token=${mapboxToken}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur Mapbox API: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const coordinates: Coordinates = {
        lat: feature.center[1], // latitude
        lng: feature.center[0]  // longitude
      };
      
      // Extraire le nom de la ville
      let cityName = feature.text || feature.place_name.split(',')[0];
      
      // Chercher la ville dans le contexte
      if (feature.context) {
        const cityContext = feature.context.find((ctx: any) => 
          ctx.id.startsWith('place.') || ctx.id.startsWith('locality.')
        );
        if (cityContext) {
          cityName = cityContext.text;
        }
      }
      
      console.log(`✅ Géolocalisation Mapbox réussie:`, {
        city: cityName,
        coordinates,
        fullAddress: feature.place_name
      });
      
      return {
        city: cityName,
        coordinates,
        fullAddress: feature.place_name
      };
    }
    
    console.log(`❌ Aucun résultat Mapbox pour: ${location}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Erreur géolocalisation Mapbox:`, error);
    return null;
  }
}

// Fonction pour calculer la distance entre deux points avec Mapbox (optionnel)
export async function getDistanceWithMapbox(
  origin: Coordinates, 
  destination: Coordinates
): Promise<{ distance: number; duration: number } | null> {
  try {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFnaWNuaWNsdXMiLCJhIjoiY2x6cWJhZGFvMGNxMjJqcGU4cGZqZGNsZCJ9.VYLgXgPKELUYXwJJgNKGFQ';
    
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?access_token=${mapboxToken}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur Mapbox Directions API: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: Math.round(route.distance / 1000), // en km
        duration: Math.round(route.duration / 60)    // en minutes
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Erreur calcul distance Mapbox:`, error);
    return null;
  }
}

// Fonction pour calculer la distance à vol d'oiseau entre deux coordonnées (formule de Haversine)
export function calculateDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Arrondi à 1 décimale
}

// Fonction pour filtrer les projets par distance
export function filterProjectsByDistance(
  projects: any[],
  artisanCoordinates: Coordinates,
  maxDistanceKm: number
): Array<any & { distance: number }> {
  return projects
    .map(project => {
      // Vérifier que le projet a des coordonnées
      if (!project.location?.coordinates?.lat || !project.location?.coordinates?.lng) {
        return null;
      }
      
      const distance = calculateDistanceKm(
        artisanCoordinates,
        {
          lat: project.location.coordinates.lat,
          lng: project.location.coordinates.lng
        }
      );
      
      return {
        ...project,
        distance
      };
    })
    .filter((project): project is any & { distance: number } => 
      project !== null && project.distance <= maxDistanceKm
    )
    .sort((a, b) => a.distance - b.distance); // Trier par distance croissante
}
