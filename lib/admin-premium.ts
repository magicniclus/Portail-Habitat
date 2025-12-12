import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  activatePremium, 
  deactivatePremium, 
  PremiumFeatures, 
  getDefaultPremiumFeatures 
} from "@/lib/premium-utils";

/**
 * Active le premium pour un artisan depuis l'admin
 */
export async function activateArtisanPremium(
  artisanId: string,
  premiumType: 'monthly' | 'yearly' | 'lifetime' = 'monthly',
  durationMonths?: number
): Promise<void> {
  try {
    const startDate = new Date();
    let endDate: Date | undefined;

    // Calculer la date de fin selon le type
    if (premiumType === 'monthly') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (durationMonths || 1));
    } else if (premiumType === 'yearly') {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    // Pour 'lifetime', pas de date de fin

    // Créer les fonctionnalités premium
    const premiumFeatures = activatePremium(
      getDefaultPremiumFeatures(),
      premiumType,
      startDate,
      endDate
    );

    // Mettre à jour dans Firestore
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      premiumFeatures,
      updatedAt: Timestamp.now()
    });

    console.log(`✅ Premium activé pour l'artisan ${artisanId}:`, {
      type: premiumType,
      startDate,
      endDate: endDate || 'À vie'
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'activation du premium:', error);
    throw new Error('Impossible d\'activer le premium');
  }
}

/**
 * Désactive le premium pour un artisan depuis l'admin
 */
export async function deactivateArtisanPremium(artisanId: string): Promise<void> {
  try {
    // Désactiver les fonctionnalités premium
    const premiumFeatures = deactivatePremium(getDefaultPremiumFeatures());

    // Mettre à jour dans Firestore
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      premiumFeatures,
      updatedAt: Timestamp.now()
    });

    console.log(`✅ Premium désactivé pour l'artisan ${artisanId}`);

  } catch (error) {
    console.error('❌ Erreur lors de la désactivation du premium:', error);
    throw new Error('Impossible de désactiver le premium');
  }
}

/**
 * Met à jour la durée du premium pour un artisan
 */
export async function updatePremiumDuration(
  artisanId: string,
  newEndDate: Date
): Promise<void> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      'premiumFeatures.premiumEndDate': Timestamp.fromDate(newEndDate),
      updatedAt: Timestamp.now()
    });

    console.log(`✅ Durée premium mise à jour pour l'artisan ${artisanId}:`, newEndDate);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la durée:', error);
    throw new Error('Impossible de mettre à jour la durée');
  }
}

/**
 * Active/désactive une fonctionnalité premium spécifique
 */
export async function togglePremiumFeature(
  artisanId: string,
  feature: 'showTopArtisanBadge',
  enabled: boolean
): Promise<void> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      [`premiumFeatures.${feature}`]: enabled,
      updatedAt: Timestamp.now()
    });

    console.log(`✅ Fonctionnalité ${feature} ${enabled ? 'activée' : 'désactivée'} pour l'artisan ${artisanId}`);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de la fonctionnalité:', error);
    throw new Error('Impossible de mettre à jour la fonctionnalité');
  }
}
