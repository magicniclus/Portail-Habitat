# 🏢 Logique Métier - Portail Habitat

Documentation complète de la logique métier et des algorithmes du projet.

## 📋 Table des matières

- [👑 Système Premium](#-système-premium)
- [🎯 Algorithme de filtrage des artisans](#-algorithme-de-filtrage-des-artisans)
- [💰 Bourse au travail](#-bourse-au-travail)
- [📊 Système de tracking](#-système-de-tracking)
- [🔍 Recherche géographique](#-recherche-géographique)
- [⭐ Système d'avis](#-système-davis)
- [📧 Notifications](#-notifications)

## 👑 Système Premium

### Logique d'activation premium

```typescript
// lib/premium-utils.ts

export interface PremiumFeatures {
  isPremium: boolean;
  premiumStartDate?: Timestamp;
  premiumEndDate?: Timestamp;
  premiumType?: 'monthly' | 'yearly' | 'lifetime';
  bannerPhotos: string[];
  bannerVideo?: string;
  showTopArtisanBadge: boolean;
  premiumBenefits: PremiumBenefit[];
}

/**
 * Vérifie si un artisan a un statut premium actif
 * 
 * Règles métier :
 * - isPremium doit être true
 * - Si premiumType = 'lifetime', toujours actif
 * - Sinon, vérifier que premiumEndDate > maintenant
 * 
 * @param artisan - Données de l'artisan avec premiumFeatures
 * @returns boolean - true si premium actif
 */
export function isPremiumActive(artisan: ArtisanWithPremium): boolean {
  // Vérification de base
  if (!artisan.premiumFeatures?.isPremium) {
    return false;
  }
  
  // Lifetime = toujours actif
  if (artisan.premiumFeatures.premiumType === 'lifetime') {
    return true;
  }
  
  // Vérifier date d'expiration
  if (!artisan.premiumFeatures.premiumEndDate) {
    return false;
  }
  
  const now = new Date();
  const endDate = artisan.premiumFeatures.premiumEndDate.toDate();
  
  return now < endDate;
}

/**
 * Calcule les jours restants avant expiration premium
 */
export function getDaysUntilExpiration(artisan: ArtisanWithPremium): number | null {
  if (!isPremiumActive(artisan)) return null;
  if (artisan.premiumFeatures?.premiumType === 'lifetime') return null;
  
  const endDate = artisan.premiumFeatures?.premiumEndDate?.toDate();
  if (!endDate) return null;
  
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Vérifie si une fonctionnalité premium est disponible
 */
export function hasPremiumFeature(
  artisan: ArtisanWithPremium, 
  feature: keyof PremiumFeatures
): boolean {
  if (!isPremiumActive(artisan)) return false;
  
  return Boolean(artisan.premiumFeatures?.[feature]);
}
```

### Fonctionnalités premium disponibles

```typescript
// Types de fonctionnalités premium
export const PREMIUM_FEATURES = {
  // Visibilité
  TOP_ARTISAN_BADGE: 'showTopArtisanBadge',
  PRIORITY_LISTING: 'priorityListing',
  
  // Médias
  BANNER_PHOTOS: 'bannerPhotos',
  BANNER_VIDEO: 'bannerVideo',
  UNLIMITED_GALLERY: 'unlimitedGallery',
  
  // Marketing
  FEATURED_PLACEMENT: 'featuredPlacement',
  SOCIAL_MEDIA_BOOST: 'socialMediaBoost',
  
  // Analytics
  ADVANCED_STATS: 'advancedStats',
  LEAD_ANALYTICS: 'leadAnalytics',
  
  // Communication
  PRIORITY_SUPPORT: 'prioritySupport',
  CUSTOM_MESSAGING: 'customMessaging'
} as const;

/**
 * Configuration des avantages par type d'abonnement
 */
export const PREMIUM_PLANS = {
  monthly: {
    price: 29.99,
    features: [
      PREMIUM_FEATURES.TOP_ARTISAN_BADGE,
      PREMIUM_FEATURES.BANNER_PHOTOS,
      PREMIUM_FEATURES.PRIORITY_LISTING
    ],
    maxBannerPhotos: 5,
    maxGalleryPhotos: 20
  },
  
  yearly: {
    price: 299.99, // 2 mois gratuits
    features: [
      PREMIUM_FEATURES.TOP_ARTISAN_BADGE,
      PREMIUM_FEATURES.BANNER_PHOTOS,
      PREMIUM_FEATURES.BANNER_VIDEO,
      PREMIUM_FEATURES.PRIORITY_LISTING,
      PREMIUM_FEATURES.ADVANCED_STATS
    ],
    maxBannerPhotos: 10,
    maxGalleryPhotos: 50
  },
  
  lifetime: {
    price: 999.99,
    features: Object.values(PREMIUM_FEATURES),
    maxBannerPhotos: 20,
    maxGalleryPhotos: 100
  }
} as const;
```

## 🎯 Algorithme de filtrage des artisans

### Algorithme principal

```typescript
// lib/artisan-filtering-algorithm.ts

interface FilterCriteria {
  secteurSearch: string;
  prestationSearch: string;
  selectedSecteur?: { lat: number; lng: number };
  selectedPrestation?: string;
  priceRange?: [number, number];
  rating?: number;
  premium?: boolean;
}

interface FilterResult {
  artisans: Artisan[];
  totalCount: number;
  hasRandomPremium: boolean;
  appliedFilters: string[];
}

/**
 * Algorithme de filtrage et tri des artisans
 * 
 * RÈGLES MÉTIER COMPLEXES :
 * 
 * 1. PAGINATION : Maximum 10 artisans par page
 * 
 * 2. PREMIUM PRIORITY : 
 *    - Toujours afficher 2 artisans premium aléatoires en positions 1 et 2
 *    - Seulement si ils correspondent aux filtres sélectionnés
 * 
 * 3. GÉOLOCALISATION :
 *    - Si ville sélectionnée : rayon de 50km
 *    - Sinon : recherche textuelle sur le nom de ville
 * 
 * 4. TRI :
 *    - Si prestation filtrée : tri par pertinence
 *    - Sinon : tri aléatoire pour équité
 * 
 * 5. FILTRES :
 *    - Cumul des filtres (ET logique)
 *    - Respect strict des critères
 */
export function filterAndSortArtisans(
  artisans: Artisan[],
  criteria: FilterCriteria,
  page: number = 1,
  itemsPerPage: number = 10
): FilterResult {
  
  let filteredArtisans = [...artisans];
  const appliedFilters: string[] = [];
  
  // ÉTAPE 1: Filtrage géographique
  if (criteria.selectedSecteur) {
    filteredArtisans = filterArtisansByDistance(
      filteredArtisans,
      criteria.selectedSecteur.lat,
      criteria.selectedSecteur.lng,
      50 // 50km de rayon
    );
    appliedFilters.push(`Rayon 50km autour de ${criteria.secteurSearch}`);
    
  } else if (criteria.secteurSearch.trim()) {
    filteredArtisans = filteredArtisans.filter(artisan =>
      artisan.city?.toLowerCase().includes(criteria.secteurSearch.toLowerCase()) ||
      artisan.fullAddress?.toLowerCase().includes(criteria.secteurSearch.toLowerCase())
    );
    appliedFilters.push(`Ville: ${criteria.secteurSearch}`);
  }
  
  // ÉTAPE 2: Filtrage par prestation/métier
  if (criteria.prestationSearch.trim()) {
    filteredArtisans = filteredArtisans.filter(artisan =>
      artisan.profession?.toLowerCase().includes(criteria.prestationSearch.toLowerCase()) ||
      artisan.professions?.some(prof => 
        prof.toLowerCase().includes(criteria.prestationSearch.toLowerCase())
      ) ||
      artisan.services?.some(service =>
        service.toLowerCase().includes(criteria.prestationSearch.toLowerCase())
      )
    );
    appliedFilters.push(`Métier: ${criteria.prestationSearch}`);
  }
  
  // ÉTAPE 3: Filtrage par note minimale
  if (criteria.rating && criteria.rating > 0) {
    filteredArtisans = filteredArtisans.filter(artisan =>
      artisan.averageRating >= criteria.rating!
    );
    appliedFilters.push(`Note minimum: ${criteria.rating}⭐`);
  }
  
  // ÉTAPE 4: Filtrage premium uniquement
  if (criteria.premium) {
    filteredArtisans = filteredArtisans.filter(artisan =>
      isPremiumActive(artisan) && artisan.premiumFeatures?.showTopArtisanBadge
    );
    appliedFilters.push('Artisans premium uniquement');
  }
  
  // ÉTAPE 5: Séparation premium/standard
  const premiumArtisans = filteredArtisans.filter(artisan => 
    isPremiumActive(artisan) && 
    artisan.premiumFeatures?.showTopArtisanBadge
  );
  
  const standardArtisans = filteredArtisans.filter(artisan => 
    !isPremiumActive(artisan) || 
    !artisan.premiumFeatures?.showTopArtisanBadge
  );
  
  // ÉTAPE 6: Sélection de 2 premium aléatoires pour les positions 1 et 2
  const randomPremiumArtisans = shuffleArray([...premiumArtisans]).slice(0, 2);
  const remainingPremium = premiumArtisans.filter(artisan => 
    !randomPremiumArtisans.includes(artisan)
  );
  
  // ÉTAPE 7: Tri des artisans restants
  let sortedRemaining: Artisan[];
  
  if (criteria.prestationSearch.trim()) {
    // Tri par pertinence si prestation recherchée
    sortedRemaining = [...remainingPremium, ...standardArtisans].sort((a, b) => {
      const scoreA = calculateRelevanceScore(a, criteria.prestationSearch);
      const scoreB = calculateRelevanceScore(b, criteria.prestationSearch);
      return scoreB - scoreA; // Tri décroissant
    });
  } else {
    // Tri aléatoire pour équité
    sortedRemaining = shuffleArray([...remainingPremium, ...standardArtisans]);
  }
  
  // ÉTAPE 8: Construction de la liste finale
  const finalList = [
    ...randomPremiumArtisans, // Positions 1 et 2 : premium aléatoires
    ...sortedRemaining        // Positions 3+ : autres artisans
  ];
  
  // ÉTAPE 9: Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedResult = finalList.slice(startIndex, startIndex + itemsPerPage);
  
  return {
    artisans: paginatedResult,
    totalCount: filteredArtisans.length,
    hasRandomPremium: randomPremiumArtisans.length > 0,
    appliedFilters
  };
}

/**
 * Calcule un score de pertinence pour le tri par prestation
 */
function calculateRelevanceScore(artisan: Artisan, searchTerm: string): number {
  let score = 0;
  const term = searchTerm.toLowerCase();
  
  // Correspondance exacte dans profession principale (+10 points)
  if (artisan.profession?.toLowerCase() === term) {
    score += 10;
  }
  
  // Correspondance partielle dans profession principale (+5 points)
  if (artisan.profession?.toLowerCase().includes(term)) {
    score += 5;
  }
  
  // Correspondance dans les professions secondaires (+3 points chacune)
  artisan.professions?.forEach(prof => {
    if (prof.toLowerCase().includes(term)) {
      score += 3;
    }
  });
  
  // Correspondance dans les services (+2 points chacun)
  artisan.services?.forEach(service => {
    if (service.toLowerCase().includes(term)) {
      score += 2;
    }
  });
  
  // Bonus pour les artisans premium (+1 point)
  if (isPremiumActive(artisan)) {
    score += 1;
  }
  
  // Bonus pour les notes élevées
  score += artisan.averageRating * 0.5;
  
  return score;
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
```

## 💰 Bourse au travail

### Logique de publication et achat

```typescript
// lib/marketplace-logic.ts

interface MarketplaceSettings {
  defaultPrice: number;        // Prix par défaut d'un lead (35€)
  maxSales: number;           // Limite de ventes par lead (3)
  commissionRate: number;     // Commission plateforme (15%)
  minLeadValue: number;       // Valeur minimale d'un lead (100€)
}

const MARKETPLACE_CONFIG: MarketplaceSettings = {
  defaultPrice: 35,
  maxSales: 3,
  commissionRate: 0.15,
  minLeadValue: 100
};

/**
 * Détermine si un lead peut être publié sur la bourse
 * 
 * RÈGLES MÉTIER :
 * - Lead validé et complet
 * - Budget estimé >= minLeadValue
 * - Pas déjà publié
 * - Admin a activé la publication
 */
export function canPublishToMarketplace(lead: Lead): boolean {
  // Lead doit être validé
  if (lead.status !== 'validated') return false;
  
  // Budget minimum requis
  const budgetValue = parseBudgetRange(lead.budget);
  if (budgetValue < MARKETPLACE_CONFIG.minLeadValue) return false;
  
  // Pas déjà publié
  if (lead.isPublished) return false;
  
  // Informations complètes
  if (!lead.description || !lead.contactInfo.phone || !lead.contactInfo.email) {
    return false;
  }
  
  return true;
}

/**
 * Calcule le prix d'un lead basé sur sa valeur estimée
 */
export function calculateLeadPrice(lead: Lead): number {
  const budgetValue = parseBudgetRange(lead.budget);
  
  // Prix basé sur un pourcentage du budget (3.5% par défaut)
  const calculatedPrice = Math.round(budgetValue * 0.035);
  
  // Prix minimum et maximum
  const minPrice = 25;
  const maxPrice = 100;
  
  return Math.max(minPrice, Math.min(maxPrice, calculatedPrice));
}

/**
 * Vérifie si un artisan peut acheter un lead
 */
export function canPurchaseLead(
  lead: MarketplaceLead, 
  artisan: Artisan
): { canPurchase: boolean; reason?: string } {
  
  // Lead doit être publié et actif
  if (!lead.isPublished || lead.marketplaceStatus !== 'active') {
    return { canPurchase: false, reason: 'Lead non disponible' };
  }
  
  // Limite de ventes pas atteinte
  if (lead.marketplaceSales >= lead.maxSales) {
    return { canPurchase: false, reason: 'Limite de ventes atteinte' };
  }
  
  // Artisan n'a pas déjà acheté ce lead
  const alreadyPurchased = lead.marketplacePurchases?.some(
    purchase => purchase.artisanId === artisan.id
  );
  
  if (alreadyPurchased) {
    return { canPurchase: false, reason: 'Déjà acheté' };
  }
  
  // Artisan a un abonnement actif
  if (!isPremiumActive(artisan)) {
    return { canPurchase: false, reason: 'Abonnement premium requis' };
  }
  
  // Métier de l'artisan correspond au lead
  const professionMatch = artisan.professions?.some(profession =>
    lead.projectType.toLowerCase().includes(profession.toLowerCase()) ||
    profession.toLowerCase().includes(lead.projectType.toLowerCase())
  );
  
  if (!professionMatch) {
    return { canPurchase: false, reason: 'Métier non compatible' };
  }
  
  return { canPurchase: true };
}

/**
 * Enregistre l'achat d'un lead et met à jour les statistiques
 */
export async function recordLeadPurchase(
  leadId: string,
  artisan: Artisan,
  paymentId: string
): Promise<void> {
  const leadRef = doc(db, 'estimations', leadId);
  const leadDoc = await getDoc(leadRef);
  
  if (!leadDoc.exists()) {
    throw new Error('Lead introuvable');
  }
  
  const leadData = leadDoc.data() as MarketplaceLead;
  
  // Vérifications finales
  const { canPurchase, reason } = canPurchaseLead(leadData, artisan);
  if (!canPurchase) {
    throw new Error(reason);
  }
  
  // Nouvel achat
  const newPurchase: MarketplacePurchase = {
    artisanId: artisan.id,
    artisanName: artisan.companyName || `${artisan.firstName} ${artisan.lastName}`,
    purchasedAt: serverTimestamp(),
    price: leadData.marketplacePrice,
    paymentId
  };
  
  // Mise à jour des statistiques
  const newSales = leadData.marketplaceSales + 1;
  const isCompleted = newSales >= leadData.maxSales;
  
  const updateData = {
    marketplacePurchases: [...(leadData.marketplacePurchases || []), newPurchase],
    marketplaceSales: newSales,
    updatedAt: serverTimestamp()
  };
  
  // Si limite atteinte, marquer comme terminé
  if (isCompleted) {
    updateData.marketplaceStatus = 'completed';
    updateData.marketplaceCompletedAt = serverTimestamp();
  }
  
  await updateDoc(leadRef, updateData);
  
  // Mettre à jour les statistiques globales
  await updateGlobalMarketplaceStats(leadData.marketplacePrice);
}

/**
 * Parse une tranche de budget en valeur numérique
 */
function parseBudgetRange(budget: string): number {
  const ranges = {
    '0-5000': 2500,
    '5000-15000': 10000,
    '15000-30000': 22500,
    '30000+': 50000
  };
  
  return ranges[budget as keyof typeof ranges] || 0;
}
```

## 📊 Système de tracking

### Tracking des interactions artisan

```typescript
// lib/artisan-tracking.ts

interface TrackingEvent {
  type: 'view' | 'phone_click' | 'email_click' | 'form_submit' | 'gallery_view';
  artisanId: string;
  userId?: string;
  sessionId: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

/**
 * Hook pour le tracking automatique des interactions
 */
export function useArtisanTracking(options: {
  artisanId: string;
  autoTrackView?: boolean;
  excludeOwner?: boolean;
}) {
  const { artisanId, autoTrackView = true, excludeOwner = true } = options;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Écoute de l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  
  // Tracking automatique des vues
  useEffect(() => {
    if (!autoTrackView) return;
    
    // Exclure le propriétaire si demandé
    const isOwner = excludeOwner && currentUser?.uid === artisanId;
    if (isOwner) return;
    
    // Tracker la vue
    trackEvent({
      type: 'view',
      artisanId,
      userId: currentUser?.uid,
      sessionId: getSessionId(),
      timestamp: serverTimestamp()
    });
    
  }, [artisanId, autoTrackView, excludeOwner, currentUser]);
  
  // Fonctions de tracking manuel
  const trackPhoneClick = () => trackEvent({
    type: 'phone_click',
    artisanId,
    userId: currentUser?.uid,
    sessionId: getSessionId(),
    timestamp: serverTimestamp()
  });
  
  const trackEmailClick = () => trackEvent({
    type: 'email_click',
    artisanId,
    userId: currentUser?.uid,
    sessionId: getSessionId(),
    timestamp: serverTimestamp()
  });
  
  const trackFormSubmit = (formData: any) => trackEvent({
    type: 'form_submit',
    artisanId,
    userId: currentUser?.uid,
    sessionId: getSessionId(),
    timestamp: serverTimestamp(),
    metadata: { projectType: formData.projectType, budget: formData.budget }
  });
  
  return {
    trackPhoneClick,
    trackEmailClick,
    trackFormSubmit
  };
}

/**
 * Enregistre un événement de tracking
 */
async function trackEvent(event: TrackingEvent): Promise<void> {
  try {
    // Enregistrer l'événement
    await addDoc(collection(db, 'tracking_events'), event);
    
    // Mettre à jour les compteurs de l'artisan
    const artisanRef = doc(db, 'artisans', event.artisanId);
    
    switch (event.type) {
      case 'view':
        await updateDoc(artisanRef, {
          viewCount: increment(1),
          lastViewedAt: event.timestamp
        });
        break;
        
      case 'phone_click':
        await updateDoc(artisanRef, {
          phoneClickCount: increment(1)
        });
        break;
        
      case 'email_click':
        await updateDoc(artisanRef, {
          emailClickCount: increment(1)
        });
        break;
        
      case 'form_submit':
        await updateDoc(artisanRef, {
          leadCount: increment(1)
        });
        break;
    }
    
  } catch (error) {
    console.error('Erreur tracking:', error);
    // Ne pas faire échouer l'expérience utilisateur
  }
}

/**
 * Génère ou récupère un ID de session
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  
  return sessionId;
}
```

---

*Documentation de la logique métier - Partie 1/2*
