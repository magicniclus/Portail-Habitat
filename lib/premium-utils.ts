import { Timestamp } from 'firebase/firestore';

// Types pour le système premium
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

export type PremiumBenefit = 
  | 'multiple_banners' 
  | 'video_banner' 
  | 'top_badge' 
  | 'priority_listing';

export interface ArtisanWithPremium {
  id: string;
  premiumFeatures?: PremiumFeatures;
  [key: string]: any;
}

// Vérifier si un artisan a un statut premium actif
export function isPremiumActive(artisan: ArtisanWithPremium): boolean {
  if (!artisan.premiumFeatures?.isPremium) {
    return false;
  }

  // Si c'est un abonnement à vie, toujours actif
  if (artisan.premiumFeatures.premiumType === 'lifetime') {
    return true;
  }

  // Si pas de date d'expiration, considérer comme actif (nouveau comportement)
  if (!artisan.premiumFeatures.premiumEndDate) {
    return true;
  }

  const now = new Date();
  const endDate = artisan.premiumFeatures.premiumEndDate.toDate();
  
  return now < endDate;
}

// Vérifier si un artisan a accès à une fonctionnalité premium spécifique
export function hasPremiumFeature(
  artisan: ArtisanWithPremium, 
  feature: PremiumBenefit
): boolean {
  if (!isPremiumActive(artisan)) {
    return false;
  }

  return artisan.premiumFeatures?.premiumBenefits?.includes(feature) || false;
}

// Obtenir les fonctionnalités premium par défaut
export function getDefaultPremiumFeatures(): PremiumFeatures {
  return {
    isPremium: false,
    bannerPhotos: [],
    showTopArtisanBadge: false,
    premiumBenefits: []
  };
}

// Obtenir toutes les fonctionnalités premium disponibles
export function getAllPremiumBenefits(): PremiumBenefit[] {
  return ['multiple_banners', 'video_banner', 'top_badge', 'priority_listing'];
}

// Activer le premium pour un artisan
export function activatePremium(
  currentFeatures: PremiumFeatures | undefined,
  premiumType: 'monthly' | 'yearly' | 'lifetime',
  startDate: Date,
  endDate?: Date
): PremiumFeatures {
  const features = currentFeatures || getDefaultPremiumFeatures();
  
  return {
    ...features,
    isPremium: true,
    premiumStartDate: Timestamp.fromDate(startDate),
    premiumEndDate: endDate ? Timestamp.fromDate(endDate) : undefined,
    premiumType,
    premiumBenefits: getAllPremiumBenefits() // Activer toutes les fonctionnalités
  };
}

// Désactiver le premium pour un artisan
export function deactivatePremium(
  currentFeatures: PremiumFeatures | undefined
): PremiumFeatures {
  const features = currentFeatures || getDefaultPremiumFeatures();
  
  return {
    ...features,
    isPremium: false,
    premiumEndDate: Timestamp.fromDate(new Date()), // Marquer comme expiré
    premiumBenefits: [] // Supprimer tous les avantages
  };
}

// Calculer les jours restants pour un abonnement premium
export function getDaysRemaining(artisan: ArtisanWithPremium): number | null {
  if (!isPremiumActive(artisan)) {
    return null;
  }

  if (artisan.premiumFeatures?.premiumType === 'lifetime') {
    return -1; // -1 indique "à vie"
  }

  if (!artisan.premiumFeatures?.premiumEndDate) {
    return null;
  }

  const now = new Date();
  const endDate = artisan.premiumFeatures.premiumEndDate.toDate();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}

// Obtenir le statut premium formaté pour l'affichage
export function getPremiumStatusDisplay(artisan: ArtisanWithPremium): {
  status: 'active' | 'expired' | 'none';
  label: string;
  daysRemaining?: number;
} {
  if (!artisan.premiumFeatures?.isPremium) {
    return {
      status: 'none',
      label: 'Standard'
    };
  }

  if (!isPremiumActive(artisan)) {
    return {
      status: 'expired',
      label: 'Premium expiré'
    };
  }

  const daysRemaining = getDaysRemaining(artisan);
  
  if (daysRemaining === -1) {
    return {
      status: 'active',
      label: 'Premium à vie',
      daysRemaining: -1
    };
  }

  return {
    status: 'active',
    label: `Premium actif`,
    daysRemaining: daysRemaining || 0
  };
}

// Trier les artisans en mettant les premium en premier
export function sortArtisansByPremium<T extends ArtisanWithPremium>(
  artisans: T[]
): T[] {
  return [...artisans].sort((a, b) => {
    const aIsPremium = isPremiumActive(a);
    const bIsPremium = isPremiumActive(b);

    // Premium en premier
    if (aIsPremium && !bIsPremium) return -1;
    if (!aIsPremium && bIsPremium) return 1;

    // Si même statut premium, garder l'ordre original
    return 0;
  });
}

// Valider les données premium avant sauvegarde
export function validatePremiumFeatures(features: Partial<PremiumFeatures>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Vérifier le nombre de photos de bannière
  if (features.bannerPhotos && features.bannerPhotos.length > 5) {
    errors.push('Maximum 5 photos de bannière autorisées');
  }

  // Vérifier que les URLs sont valides
  if (features.bannerPhotos) {
    features.bannerPhotos.forEach((url, index) => {
      if (!url || typeof url !== 'string') {
        errors.push(`Photo de bannière ${index + 1} : URL invalide`);
      }
    });
  }

  // Vérifier l'URL de la vidéo
  if (features.bannerVideo && typeof features.bannerVideo !== 'string') {
    errors.push('URL de vidéo de bannière invalide');
  }

  // Vérifier les dates
  if (features.premiumStartDate && features.premiumEndDate) {
    const startDate = features.premiumStartDate.toDate();
    const endDate = features.premiumEndDate.toDate();
    
    if (startDate >= endDate) {
      errors.push('La date de fin doit être postérieure à la date de début');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
