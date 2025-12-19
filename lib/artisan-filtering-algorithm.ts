import { filterArtisansByDistance } from "@/lib/geo-utils";

interface Artisan {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  coordinates?: { lat: number; lng: number };
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
  hasPremiumSite?: boolean;
  subscriptionStatus?: string;
  isPromo?: boolean;
  distance?: number;
  accountType?: string;
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
 * 1. Maximum 11 artisans par page
 * 2. Si aucune ville : tri par prestation (si filtrée) ou aléatoire
 * 3. Toujours 3 artisans Top Artisan en positions 1, 2 et 3
 * 4. Filtrage selon les critères sélectionnés
 */
export function filterAndSortArtisans(
  allArtisans: Artisan[],
  criteria: FilterCriteria,
  page: number = 1,
  itemsPerPage: number = 10
): FilterResult {
  
  // 1. APPLIQUER LES FILTRES D'ABORD
  const filteredArtisans = applyBasicFilters(allArtisans, criteria);
  
  // 2. Séparer VRAIS artisans et DEMO artisans
  // Un artisan est VRAI si accountType n'est pas défini OU différent de 'demo'
  const realArtisans = filteredArtisans.filter(a => !a.accountType || a.accountType !== 'demo');
  const demoArtisans = filteredArtisans.filter(a => a.accountType === 'demo');
  
  // 3. Séparer Top Artisans et Standard pour les VRAIS artisans
  const realTopArtisans = realArtisans.filter(a => 
    a.premiumFeatures?.isPremium === true && 
    (a.premiumFeatures as any)?.showTopArtisanBadge === true
  );
  
  const realStandardArtisans = realArtisans.filter(a => 
    !(a.premiumFeatures?.isPremium === true && 
      (a.premiumFeatures as any)?.showTopArtisanBadge === true)
  );
  
  // 4. Séparer Top Artisans et Standard pour les DEMO artisans
  const demoTopArtisans = demoArtisans.filter(a => 
    a.premiumFeatures?.isPremium === true && 
    (a.premiumFeatures as any)?.showTopArtisanBadge === true
  );
  
  const demoStandardArtisans = demoArtisans.filter(a => 
    !(a.premiumFeatures?.isPremium === true && 
      (a.premiumFeatures as any)?.showTopArtisanBadge === true)
  );
  
  // 5. Trier chaque groupe
  const sortedRealTopArtisans = sortArtisans(realTopArtisans, criteria);
  const sortedDemoTopArtisans = sortArtisans(demoTopArtisans, criteria);
  const sortedRealStandardArtisans = sortArtisans(realStandardArtisans, criteria);
  const sortedDemoStandardArtisans = sortArtisans(demoStandardArtisans, criteria);
  
  // 6. DISTRIBUTION INTELLIGENTE : 3 Top Artisans minimum par page
  // IMPORTANT: on ne remonte JAMAIS un artisan demo avant un artisan réel.
  const topArtisansPerPage = 3;
  const topArtisansForThisPage: Artisan[] = [];

  // On prend jusqu'à 3 Top artisans RÉELS (triés), sans compléter avec des demos.
  const realTopToTake = Math.min(sortedRealTopArtisans.length, topArtisansPerPage);
  for (let i = 0; i < realTopToTake; i++) {
    topArtisansForThisPage.push(sortedRealTopArtisans[i]);
  }
  
  // 7. Remplir la page avec le RESTE des artisans (Top ou non), sans doublons.
  // Sinon, si (presque) tout le monde est Top Artisan, la liste "standard" est vide et on n'affiche que 3 cartes.
  const remainingSlots = Math.max(itemsPerPage - topArtisansForThisPage.length, 0);
  const remainingStartIndex = (page - 1) * remainingSlots;
  const selectedIds = new Set(topArtisansForThisPage.map(a => a.id));

  // Reste des artisans : priorité aux vrais, puis demos. On réutilise le tri existant par groupe.
  const remainingReal = [...sortedRealTopArtisans, ...sortedRealStandardArtisans].filter(a => !selectedIds.has(a.id));
  // IMPORTANT: après la première ligne, on ne veut pas remonter les Top Artisans DEMO.
  // Donc on place les DEMO non-top avant les DEMO top.
  const remainingDemo = [...sortedDemoStandardArtisans, ...sortedDemoTopArtisans].filter(a => !selectedIds.has(a.id));
  const remainingArtisans = [...remainingReal, ...remainingDemo];

  const paginatedRemaining = remainingArtisans.slice(remainingStartIndex, remainingStartIndex + remainingSlots);

  // 8. Combiner : 3 Top Artisans EN PREMIER, puis le reste
  const paginatedArtisans = [...topArtisansForThisPage, ...paginatedRemaining];

  return {
    artisans: paginatedArtisans,
    totalCount: filteredArtisans.length,
    hasRandomPremium: realTopArtisans.length > 0 || demoTopArtisans.length > 0
  };
}

/**
 * Applique les filtres de base (ville, prestation)
 */
function applyBasicFilters(artisans: Artisan[], criteria: FilterCriteria): Artisan[] {
  let filtered = [...artisans];
  
  // Filtrage par prestation
  if (criteria.prestationSearch.trim() || criteria.selectedPrestation) {
    const prestationTerm = (criteria.selectedPrestation || criteria.prestationSearch).toLowerCase();
    
    filtered = filtered.filter(artisan => {
      // Vérifier profession principale
      if (artisan.profession?.toLowerCase().includes(prestationTerm)) return true;
      
      // Vérifier professions secondaires
      if (artisan.professions?.some(p => p.toLowerCase().includes(prestationTerm))) return true;
      
      // Vérifier description
      if (artisan.description?.toLowerCase().includes(prestationTerm)) return true;
      
      return false;
    });
  }
  
  // Filtrage par ville/secteur
  // IMPORTANT: on ne filtre PAS sur la simple saisie texte (secteurSearch).
  // Le filtrage ne s'applique que lorsque l'utilisateur a sélectionné une suggestion (selectedSecteur).
  if (criteria.selectedSecteur) {
    const villeTerm = criteria.secteurSearch.toLowerCase();

    if (criteria.selectedSecteur?.lat != null && criteria.selectedSecteur?.lng != null) {
      const selectedCityLower = (criteria.selectedSecteur?.name || '').toLowerCase();
      const withinRadius = filterArtisansByDistance(
        filtered,
        criteria.selectedSecteur.lat,
        criteria.selectedSecteur.lng,
        75
      ) as Artisan[];

      filtered = withinRadius.filter((artisan: any) => {
        if (artisan.distance == null) {
          if (!selectedCityLower) return false;
          const cityLower = (artisan.city || '').toLowerCase();
          const normalizedCity = cityLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const normalizedSelected = selectedCityLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          // Fallback permissif: certains profils n'ont pas coordinates mais ont une ville exploitable.
          // On accepte correspondance exacte OU partielle (avec/sans accents).
          return (
            cityLower === selectedCityLower ||
            normalizedCity === normalizedSelected ||
            cityLower.includes(selectedCityLower) ||
            selectedCityLower.includes(cityLower) ||
            normalizedCity.includes(normalizedSelected) ||
            normalizedSelected.includes(normalizedCity)
          );
        }
        return artisan.distance <= 75;
      });
    } else {
      filtered = filtered.filter(artisan => {
        if (!artisan.city) return false;
        
        const cityLower = artisan.city.toLowerCase();
        
        // Si on a une ville sélectionnée avec un nom, on l'utilise pour la correspondance exacte
        if (criteria.selectedSecteur?.name) {
          const selectedCityLower = criteria.selectedSecteur.name.toLowerCase();
          // Correspondance exacte avec la ville sélectionnée
          if (cityLower === selectedCityLower) return true;
          // Correspondance partielle avec la ville sélectionnée
          if (cityLower.includes(selectedCityLower)) return true;
          // Normalisation des accents
          const normalizedCity = cityLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const normalizedSelected = selectedCityLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          if (normalizedCity.includes(normalizedSelected)) return true;
        }
        
        // Sinon, recherche partielle sur le texte saisi
        // Correspondance exacte
        if (cityLower === villeTerm) return true;
        
        // Correspondance partielle
        if (cityLower.includes(villeTerm)) return true;
        
        // Correspondance sans accents
        const normalizedCity = cityLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normalizedTerm = villeTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (normalizedCity.includes(normalizedTerm)) return true;
        
        return false;
      });
    }
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
    
    // Sinon : tri déterministe (rating puis nombre d'avis)
    return sorted.sort((a, b) => {
      const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });
  }
  
  // Si ville sélectionnée : tri par correspondance exacte d'abord, puis distance/rating
  if (criteria.selectedSecteur || criteria.secteurSearch.trim()) {
    const villeTerm = criteria.secteurSearch.toLowerCase();
    const selectedCityName = criteria.selectedSecteur?.name?.toLowerCase() || villeTerm;
    
    return sorted.sort((a, b) => {
      const aCityLower = a.city?.toLowerCase() || '';
      const bCityLower = b.city?.toLowerCase() || '';
      
      // Priorité 1 : Correspondance exacte avec la ville sélectionnée ou recherchée
      const aExactMatch = aCityLower === selectedCityName;
      const bExactMatch = bCityLower === selectedCityName;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // Priorité 2 : Correspondance partielle
      const aPartialMatch = aCityLower.includes(selectedCityName);
      const bPartialMatch = bCityLower.includes(selectedCityName);
      
      if (aPartialMatch && !bPartialMatch) return -1;
      if (!aPartialMatch && bPartialMatch) return 1;
      
      // Priorité 3 : Distance (si disponible)
      if (a.distance !== undefined && b.distance !== undefined) {
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
      }
      
      // Priorité 4 : Rating
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
 * Construit la liste finale complète (tous les artisans filtrés)
 */
function buildFinalArtisanList(
  randomPremium: Artisan[],
  remainingPremium: Artisan[],
  standardArtisans: Artisan[],
  maxItems: number
): Artisan[] {
  // Retourner tous les artisans filtrés (pas de limite ici)
  // La pagination se fera après
  return [...remainingPremium, ...standardArtisans];
}

/**
 * Applique la pagination avec Top Artisans prioritaires
 */
function paginateResults(artisans: Artisan[], page: number, itemsPerPage: number): Artisan[] {
  // Séparer les artisans premium et standard
  const topArtisans = artisans.filter(a => 
    a.premiumFeatures?.isPremium === true || 
    a.hasPremiumSite === true ||
    a.subscriptionStatus === 'active'
  );
  const standardArtisans = artisans.filter(a => 
    !(a.premiumFeatures?.isPremium === true || 
      a.hasPremiumSite === true ||
      a.subscriptionStatus === 'active')
  );
  
  console.log(`🔍 SÉPARATION PREMIUM/STANDARD:`);
  artisans.forEach((artisan, index) => {
    const isTop = artisan.premiumFeatures?.isPremium === true || 
                  artisan.hasPremiumSite === true ||
                  artisan.subscriptionStatus === 'active';
    console.log(`${index + 1}. ${artisan.companyName || `${artisan.firstName} ${artisan.lastName}`} - TOP: ${isTop ? '✅' : '❌'}`);
    console.log(`   isPremium: ${artisan.premiumFeatures?.isPremium}, hasPremiumSite: ${artisan.hasPremiumSite}, subscription: ${artisan.subscriptionStatus}`);
  });
  
  
  // LOGIQUE INTELLIGENTE : Top Artisans prioritaires mais pas obligatoires
  let pageTopArtisans: Artisan[] = [];
  
  if (topArtisans.length >= 3) {
    // Cas idéal : 3+ Top Artisans disponibles
    const shuffledTop = [...topArtisans].sort(() => 0.5 - Math.random());
    pageTopArtisans = shuffledTop.slice(0, 3);
  } else if (topArtisans.length > 0) {
    // Cas partiel : Moins de 3 Top Artisans, prendre tous ceux disponibles
    pageTopArtisans = [...topArtisans];
  } else {
    // Cas aucun : Pas de Top Artisans, fonctionnement normal
  }
  
  // Calculer combien d'artisans standard on a besoin pour compléter la page
  const neededStandard = itemsPerPage - pageTopArtisans.length;
  
  // Pour la pagination des artisans standard, on doit tenir compte des Top Artisans déjà pris
  let standardStartIndex = 0;
  if (pageTopArtisans.length < 3) {
    // Si on n'a pas 3 Top Artisans, on prend les standard normalement pour cette page
    standardStartIndex = (page - 1) * neededStandard;
  } else {
    // Si on a 3 Top Artisans, on ajuste l'index pour les standard
    standardStartIndex = (page - 1) * (itemsPerPage - 3);
  }
  
  const pageStandardArtisans = standardArtisans.slice(standardStartIndex, standardStartIndex + neededStandard);
  
  // TOUJOURS commencer par les Top Artisans
  const result = [...pageTopArtisans, ...pageStandardArtisans];
  
  console.log(`🔍 DEBUG ALGORITHME - Page ${page}:`);
  console.log(`- Artisans reçus: ${artisans.length}`);
  console.log(`- Top Artisans trouvés: ${topArtisans.length}`);
  console.log(`- Standard Artisans: ${standardArtisans.length}`);
  console.log(`- Page Top sélectionnés: ${pageTopArtisans.length}`);
  console.log(`- Page Standard ajoutés: ${pageStandardArtisans.length}`);
  console.log(`- Résultat final: ${result.length}`);
  console.log(`- Artisans dans le résultat:`, result.map(a => a.companyName || `${a.firstName} ${a.lastName}`));
  
  return result.slice(0, itemsPerPage);
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
