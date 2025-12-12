import { filterArtisansByDistance } from "@/lib/geo-utils";

interface Artisan {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  profession: string;
  professions: string[];
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  averageRating: number;
  reviewCount: number;
  slug: string;
  privacy: {
    profileVisible: boolean;
    showPhone: boolean;
    showEmail: boolean;
    allowDirectContact: boolean;
  };
  premiumFeatures?: {
    isPremium: boolean;
    premiumStartDate?: any;
    premiumEndDate?: any;
  };
  isPromo?: boolean;
  distance?: number;
}

interface FilterCriteria {
  secteurSearch: string;
  prestationSearch: string;
  selectedSecteur: {name: string, lat: number, lng: number, type?: string} | null;
  selectedPrestation: string;
}

interface FilterResult {
  artisans: Artisan[];
  totalCount: number;
  hasRandomPremium: boolean;
}

/**
 * Algorithme complexe de filtrage et tri des artisans
 * 
 * Règles :
 * 1. Maximum 10 artisans par page
 * 2. Si aucune ville : tri par prestation (si filtrée) ou aléatoire
 * 3. Toujours 2 artisans premium aléatoires en positions 1 et 2
 * 4. Filtrage selon les critères sélectionnés
 */
export function filterAndSortArtisans(
  allArtisans: Artisan[],
  criteria: FilterCriteria,
  page: number = 1,
  itemsPerPage: number = 10
): FilterResult {
  
  // Étape 1: Filtrage de base selon les critères
  let filteredArtisans = applyBasicFilters(allArtisans, criteria);
  
  // Étape 2: Séparation premium/standard
  const { premiumArtisans, standardArtisans } = separatePremiumArtisans(filteredArtisans);
  
  // Étape 3: Sélection de 2 artisans premium aléatoires
  const randomPremiumArtisans = selectRandomPremiumArtisans(premiumArtisans, 2);
  
  // Étape 4: Tri des artisans restants selon les critères
  const sortedStandardArtisans = sortArtisans(standardArtisans, criteria);
  const sortedRemainingPremium = sortArtisans(
    premiumArtisans.filter(a => !randomPremiumArtisans.includes(a)), 
    criteria
  );
  
  // Calculer le nombre total d'artisans filtrés (pour la pagination)
  const totalFilteredCount = premiumArtisans.length + standardArtisans.length;
  
  // Étape 5: Construction de la liste finale (limitée par page)
  const finalList = buildFinalArtisanList(
    randomPremiumArtisans,
    sortedRemainingPremium,
    sortedStandardArtisans,
    itemsPerPage
  );
  
  // Étape 6: Pagination
  const paginatedResult = paginateResults(finalList, page, itemsPerPage);
  
  return {
    artisans: paginatedResult,
    totalCount: totalFilteredCount, // Nombre total d'artisans filtrés, pas seulement ceux affichés
    hasRandomPremium: randomPremiumArtisans.length > 0
  };
}

/**
 * Applique les filtres de base (ville, prestation)
 */
function applyBasicFilters(artisans: Artisan[], criteria: FilterCriteria): Artisan[] {
  let filtered = artisans.filter(artisan => artisan.privacy?.profileVisible !== false);
  
  // Filtre par secteur/ville
  if (criteria.secteurSearch.trim() || criteria.selectedSecteur) {
    const searchTerm = criteria.secteurSearch.trim().toLowerCase();
    
    if (criteria.selectedSecteur) {
      // Filtrage géographique avec distance
      filtered = filterArtisansByDistance(
        filtered,
        criteria.selectedSecteur.lat,
        criteria.selectedSecteur.lng,
        50 // 50km de rayon
      );
    } else if (searchTerm) {
      // Filtrage par nom de ville
      filtered = filtered.filter(artisan =>
        artisan.city?.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  // Filtre par prestation
  if (criteria.prestationSearch.trim() || criteria.selectedPrestation) {
    const prestationTerm = (criteria.selectedPrestation || criteria.prestationSearch).toLowerCase();
    
    filtered = filtered.filter(artisan => {
      const professionMatch = artisan.profession?.toLowerCase().includes(prestationTerm);
      const professionsMatch = artisan.professions?.some(p => 
        p.toLowerCase().includes(prestationTerm)
      );
      const descriptionMatch = artisan.description?.toLowerCase().includes(prestationTerm);
      
      return professionMatch || professionsMatch || descriptionMatch;
    });
  }
  
  return filtered;
}

/**
 * Sépare les artisans premium des standard
 */
function separatePremiumArtisans(artisans: Artisan[]): {
  premiumArtisans: Artisan[];
  standardArtisans: Artisan[];
} {
  const premiumArtisans: Artisan[] = [];
  const standardArtisans: Artisan[] = [];
  
  artisans.forEach(artisan => {
    if (isPremiumActive(artisan)) {
      premiumArtisans.push(artisan);
    } else {
      standardArtisans.push(artisan);
    }
  });
  
  return { premiumArtisans, standardArtisans };
}

/**
 * Vérifie si un artisan a un statut premium actif
 */
function isPremiumActive(artisan: Artisan): boolean {
  if (!artisan.premiumFeatures?.isPremium) return false;
  
  if (!artisan.premiumFeatures.premiumEndDate) return true; // Premium à vie
  
  const endDate = artisan.premiumFeatures.premiumEndDate.toDate?.() || 
                  new Date(artisan.premiumFeatures.premiumEndDate);
  
  return new Date() < endDate;
}

/**
 * Sélectionne N artisans premium de manière aléatoire
 */
function selectRandomPremiumArtisans(premiumArtisans: Artisan[], count: number): Artisan[] {
  if (premiumArtisans.length <= count) {
    return [...premiumArtisans];
  }
  
  const shuffled = [...premiumArtisans];
  
  // Algorithme de Fisher-Yates pour mélange aléatoire
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}

/**
 * Trie les artisans selon les critères
 */
function sortArtisans(artisans: Artisan[], criteria: FilterCriteria): Artisan[] {
  const sorted = [...artisans];
  
  // Si aucune ville sélectionnée
  if (!criteria.secteurSearch.trim() && !criteria.selectedSecteur) {
    
    // Si prestation filtrée : tri par pertinence de prestation
    if (criteria.prestationSearch.trim() || criteria.selectedPrestation) {
      return sortByPrestationRelevance(sorted, criteria.selectedPrestation || criteria.prestationSearch);
    }
    
    // Sinon : tri aléatoire
    return shuffleArray(sorted);
  }
  
  // Si ville sélectionnée : tri par distance puis rating
  if (criteria.selectedSecteur) {
    return sorted.sort((a, b) => {
      // Tri par distance d'abord
      if (a.distance !== undefined && b.distance !== undefined) {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
      }
      
      // Puis par rating
      return (b.averageRating || 0) - (a.averageRating || 0);
    });
  }
  
  // Tri par défaut : rating puis nombre d'avis
  return sorted.sort((a, b) => {
    const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
    if (ratingDiff !== 0) return ratingDiff;
    
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });
}

/**
 * Trie par pertinence de prestation
 */
function sortByPrestationRelevance(artisans: Artisan[], prestationTerm: string): Artisan[] {
  const term = prestationTerm.toLowerCase();
  
  return artisans.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Score pour profession principale
    if (a.profession?.toLowerCase().includes(term)) scoreA += 10;
    if (b.profession?.toLowerCase().includes(term)) scoreB += 10;
    
    // Score pour professions secondaires
    const aSecondaryMatch = a.professions?.some(p => p.toLowerCase().includes(term));
    const bSecondaryMatch = b.professions?.some(p => p.toLowerCase().includes(term));
    if (aSecondaryMatch) scoreA += 5;
    if (bSecondaryMatch) scoreB += 5;
    
    // Score pour description
    if (a.description?.toLowerCase().includes(term)) scoreA += 2;
    if (b.description?.toLowerCase().includes(term)) scoreB += 2;
    
    // Score pour rating
    scoreA += (a.averageRating || 0);
    scoreB += (b.averageRating || 0);
    
    return scoreB - scoreA;
  });
}

/**
 * Mélange aléatoire d'un tableau (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Construit la liste finale avec premium en tête
 */
function buildFinalArtisanList(
  randomPremium: Artisan[],
  remainingPremium: Artisan[],
  standardArtisans: Artisan[],
  maxItems: number
): Artisan[] {
  const finalList: Artisan[] = [];
  
  // Ajouter les 2 premium aléatoires en premier
  finalList.push(...randomPremium);
  
  // Calculer combien d'artisans on peut encore ajouter
  const remainingSlots = maxItems - finalList.length;
  
  if (remainingSlots <= 0) {
    return finalList.slice(0, maxItems);
  }
  
  // Mélanger premium restants et standard
  const remainingArtisans = [...remainingPremium, ...standardArtisans];
  
  // Ajouter jusqu'à atteindre la limite
  finalList.push(...remainingArtisans.slice(0, remainingSlots));
  
  return finalList;
}

/**
 * Applique la pagination
 */
function paginateResults(artisans: Artisan[], page: number, itemsPerPage: number): Artisan[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return artisans.slice(startIndex, endIndex);
}

/**
 * Fonction utilitaire pour obtenir des statistiques sur le filtrage
 */
export function getFilteringStats(
  allArtisans: Artisan[],
  criteria: FilterCriteria
): {
  totalArtisans: number;
  filteredCount: number;
  premiumCount: number;
  standardCount: number;
} {
  const filtered = applyBasicFilters(allArtisans, criteria);
  const { premiumArtisans, standardArtisans } = separatePremiumArtisans(filtered);
  
  return {
    totalArtisans: allArtisans.length,
    filteredCount: filtered.length,
    premiumCount: premiumArtisans.length,
    standardCount: standardArtisans.length
  };
}
