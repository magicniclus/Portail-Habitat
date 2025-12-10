import { doc, updateDoc, serverTimestamp, runTransaction, getDoc } from "firebase/firestore";
import { recordMarketplaceSale } from "./stats-utils";
import { db } from "@/lib/firebase";

export interface MarketplacePurchase {
  artisanId: string;
  artisanName: string;
  purchasedAt: any; // Timestamp
  price: number;
  paymentId?: string;
}

/**
 * Enregistre un achat de lead et met à jour les compteurs
 * Met automatiquement le statut à "completed" si la limite est atteinte
 * Initialise la structure marketplace si elle n'existe pas
 */
export async function recordMarketplacePurchase(
  estimationId: string,
  purchase: MarketplacePurchase
): Promise<{ success: boolean; isCompleted: boolean; currentSales: number }> {
  try {
    const result = await runTransaction(db, async (transaction) => {
      const estimationRef = doc(db, "estimations", estimationId);
      const estimationDoc = await transaction.get(estimationRef);
      
      if (!estimationDoc.exists()) {
        throw new Error("Estimation non trouvée");
      }

      const estimationData = estimationDoc.data();
      
      // Initialiser la structure marketplace si elle n'existe pas
      const currentPurchases = estimationData.marketplacePurchases || [];
      const currentSales = estimationData.marketplaceSales || 0;
      const maxSales = estimationData.maxSales || 3;
      const marketplacePrice = estimationData.marketplacePrice || 35;
      const marketplaceStatus = estimationData.marketplaceStatus || "active";

      // Vérifier si l'artisan n'a pas déjà acheté ce lead
      const alreadyPurchased = currentPurchases.some(
        (p: MarketplacePurchase) => p.artisanId === purchase.artisanId
      );

      if (alreadyPurchased) {
        console.log("Artisan déjà assigné, mise à jour du prix existant");
        // Ne pas bloquer, juste mettre à jour le prix si nécessaire
        return {
          success: true,
          isCompleted: currentSales >= maxSales,
          currentSales
        };
      }

      // Vérifier si la limite n'est pas déjà atteinte
      if (currentSales >= maxSales) {
        throw new Error("Limite de ventes déjà atteinte");
      }

      // Ajouter l'achat avec timestamp
      const newPurchase = {
        ...purchase,
        purchasedAt: serverTimestamp()
      };

      const newSales = currentSales + 1;
      const isCompleted = newSales >= maxSales;

      // Préparer les données de mise à jour (toujours initialiser la structure complète)
      // IMPORTANT: Met à jour TOUS les compteurs SAUF isPublished (contrôle admin exclusif)
      const updateData: any = {
        marketplacePurchases: [...currentPurchases, newPurchase],
        marketplaceSales: newSales,
        marketplacePrice,
        maxSales,
        marketplaceViews: estimationData.marketplaceViews || 0,
        updatedAt: serverTimestamp()
        // isPublished N'EST JAMAIS INCLUS - contrôle admin exclusif
      };

      // Si la limite est atteinte, marquer comme complété
      if (isCompleted) {
        updateData.marketplaceStatus = "completed";
        updateData.marketplaceCompletedAt = serverTimestamp();
        // IMPORTANT: Ne JAMAIS modifier isPublished - même si complété
      } else {
        // S'assurer que le statut est "active" si pas encore complété
        updateData.marketplaceStatus = "active";
      }

      // Mettre à jour l'estimation
      transaction.update(estimationRef, updateData);

      return {
        success: true,
        isCompleted,
        currentSales: newSales
      };
    });

    // Enregistrer la vente dans les stats si le prix > 0
    if (result.success && purchase.price > 0) {
      try {
        await recordMarketplaceSale(purchase.price);
        console.log(`Vente marketplace enregistrée dans les stats: ${purchase.price}€`);
      } catch (statsError) {
        console.error("Erreur lors de l'enregistrement des stats:", statsError);
        // Ne pas faire échouer la transaction principale
      }
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'achat:", error);
    return {
      success: false,
      isCompleted: false,
      currentSales: 0
    };
  }
}

/**
 * Retire un achat de la marketplace et met à jour les compteurs
 */
export async function removeMarketplacePurchase(
  estimationId: string,
  artisanId: string
): Promise<{ success: boolean; currentSales: number }> {
  try {
    const result = await runTransaction(db, async (transaction) => {
      const estimationRef = doc(db, "estimations", estimationId);
      const estimationDoc = await transaction.get(estimationRef);
      
      if (!estimationDoc.exists()) {
        throw new Error("Estimation non trouvée");
      }

      const estimationData = estimationDoc.data();
      const currentPurchases = estimationData.marketplacePurchases || [];
      const currentSales = estimationData.marketplaceSales || 0;
      const maxSales = estimationData.maxSales || 3;

      // Trouver et retirer l'achat de cet artisan
      const updatedPurchases = currentPurchases.filter(
        (p: MarketplacePurchase) => p.artisanId !== artisanId
      );

      const newSales = Math.max(0, currentSales - 1);
      const wasCompleted = estimationData.marketplaceStatus === "completed";

      // Préparer les données de mise à jour
      // IMPORTANT: Met à jour TOUS les compteurs SAUF isPublished (contrôle admin exclusif)
      const updateData: any = {
        marketplacePurchases: updatedPurchases,
        marketplaceSales: newSales,
        updatedAt: serverTimestamp()
        // isPublished N'EST JAMAIS INCLUS - contrôle admin exclusif
      };

      // Si c'était complété et qu'on retire un achat, repasser en actif
      if (wasCompleted && newSales < maxSales) {
        updateData.marketplaceStatus = "active";
        // Retirer la date de complétion si on repasse en actif
        updateData.marketplaceCompletedAt = null;
        // IMPORTANT: Ne JAMAIS modifier isPublished - même lors du retour en actif
      }

      // Mettre à jour l'estimation
      transaction.update(estimationRef, updateData);

      return {
        success: true,
        currentSales: newSales
      };
    });

    return result;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'achat:", error);
    return {
      success: false,
      currentSales: 0
    };
  }
}

/**
 * Met à jour le statut de la bourse (active, paused, completed)
 */
export async function updateMarketplaceStatus(
  estimationId: string,
  status: "active" | "paused" | "completed"
): Promise<boolean> {
  try {
    const estimationRef = doc(db, "estimations", estimationId);
    const updateData: any = {
      marketplaceStatus: status,
      updatedAt: serverTimestamp()
    };

    if (status === "completed") {
      updateData.marketplaceCompletedAt = serverTimestamp();
      updateData.isPublished = false; // Dépublier si complété manuellement
    }

    await updateDoc(estimationRef, updateData);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return false;
  }
}

/**
 * Vérifie si un artisan peut acheter un lead
 */
export function canPurchaseLead(
  estimation: any,
  artisanId: string
): { canPurchase: boolean; reason?: string } {
  // Vérifier si publié
  if (!estimation.isPublished) {
    return { canPurchase: false, reason: "Lead non publié" };
  }

  // Vérifier le statut
  if (estimation.marketplaceStatus === "completed") {
    return { canPurchase: false, reason: "Limite de ventes atteinte" };
  }

  if (estimation.marketplaceStatus === "paused") {
    return { canPurchase: false, reason: "Ventes temporairement suspendues" };
  }

  // Vérifier si déjà acheté
  const purchases = estimation.marketplacePurchases || [];
  const alreadyPurchased = purchases.some(
    (p: MarketplacePurchase) => p.artisanId === artisanId
  );

  if (alreadyPurchased) {
    return { canPurchase: false, reason: "Déjà acheté" };
  }

  // Vérifier la limite
  const currentSales = estimation.marketplaceSales || 0;
  const maxSales = estimation.maxSales || 3;

  if (currentSales >= maxSales) {
    return { canPurchase: false, reason: "Limite de ventes atteinte" };
  }

  return { canPurchase: true };
}

/**
 * Synchronise les assignations existantes avec la marketplace
 */
export async function syncAssignmentsToMarketplace(estimationId: string): Promise<boolean> {
  try {
    const estimationRef = doc(db, "estimations", estimationId);
    const estimationDoc = await getDoc(estimationRef);
    
    if (!estimationDoc.exists()) {
      return false;
    }

    const estimationData = estimationDoc.data();
    const assignments = estimationData.assignments || [];
    const currentPurchases = estimationData.marketplacePurchases || [];
    
    // Créer les achats pour toutes les assignations qui ne sont pas encore dans marketplacePurchases
    const newPurchases = [];
    let salesCount = currentPurchases.length;
    
    for (const assignment of assignments) {
      const alreadyInMarketplace = currentPurchases.some(
        (p: MarketplacePurchase) => p.artisanId === assignment.artisanId
      );
      
      if (!alreadyInMarketplace) {
        newPurchases.push({
          artisanId: assignment.artisanId,
          artisanName: assignment.artisanName,
          purchasedAt: assignment.assignedAt || serverTimestamp(),
          price: assignment.price || 0,
          paymentId: `sync-assignment-${assignment.artisanId}`
        });
        salesCount++;
      }
    }
    
    if (newPurchases.length > 0) {
      const maxSales = estimationData.maxSales || 3;
      const isCompleted = salesCount >= maxSales;
      
      const updateData: any = {
        marketplacePurchases: [...currentPurchases, ...newPurchases],
        marketplaceSales: salesCount,
        updatedAt: serverTimestamp()
      };
      
      if (isCompleted) {
        updateData.marketplaceStatus = "completed";
        updateData.marketplaceCompletedAt = serverTimestamp();
      }
      
      await updateDoc(estimationRef, updateData);
      console.log(`${newPurchases.length} assignations synchronisées avec la marketplace`);
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
    return false;
  }
}

/**
 * Initialise la structure marketplace pour une estimation si elle n'existe pas
 */
export async function initializeMarketplaceStructure(estimationId: string): Promise<boolean> {
  try {
    const estimationRef = doc(db, "estimations", estimationId);
    const estimationDoc = await getDoc(estimationRef);
    
    if (!estimationDoc.exists()) {
      return false;
    }

    const estimationData = estimationDoc.data();
    
    // Vérifier si la structure marketplace existe déjà
    const hasMarketplaceStructure = 
      estimationData.marketplaceSales !== undefined ||
      estimationData.marketplacePurchases !== undefined ||
      estimationData.marketplaceStatus !== undefined;

    if (hasMarketplaceStructure) {
      return true; // Déjà initialisée
    }

    // Initialiser la structure marketplace avec les valeurs par défaut
    // IMPORTANT: Ne pas toucher à isPublished, laisser sur false par défaut
    const marketplaceData = {
      marketplaceSales: 0,
      marketplacePurchases: [],
      marketplaceViews: 0,
      marketplacePrice: 35,
      maxSales: 3,
      marketplaceStatus: "active",
      marketplaceDescription: "",
      marketplacePrestations: estimationData.project?.prestationType ? [estimationData.project.prestationType] : [],
      updatedAt: serverTimestamp()
      // isPublished reste inchangé (false par défaut)
    };

    await updateDoc(estimationRef, marketplaceData);
    console.log(`Structure marketplace initialisée pour l'estimation ${estimationId}`);
    return true;

  } catch (error) {
    console.error("Erreur lors de l'initialisation de la structure marketplace:", error);
    return false;
  }
}

/**
 * Obtient les statistiques de la bourse pour une estimation
 */
export function getMarketplaceStats(estimation: any) {
  const currentSales = estimation.marketplaceSales || 0;
  const maxSales = estimation.maxSales || 3;
  const views = estimation.marketplaceViews || 0;
  const status = estimation.marketplaceStatus || "active";
  const purchases = estimation.marketplacePurchases || [];

  return {
    currentSales,
    maxSales,
    views,
    status,
    purchases,
    isCompleted: status === "completed" || currentSales >= maxSales,
    remainingSlots: Math.max(0, maxSales - currentSales),
    completionPercentage: Math.round((currentSales / maxSales) * 100)
  };
}
