import { doc, updateDoc, increment, runTransaction, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Types pour les stats
 */
interface OfferStats {
  activeSubscribers: number;
  totalSold: number;
  sitesSold: number;
  sitesOffered: number;
  monthlyRevenue: number;
  totalRevenue: number;
  churnCount: number;
}

interface MarketplaceStats {
  totalSales: number;
  totalRevenue: number;
  averagePrice: number;
  thisMonthSales: number;
}

interface MonthlyMetrics {
  newSubscriptions: number;
  churnedSubscriptions: number;
  netGrowth: number;
  mrrGrowth: number;
  marketplaceSales: number;
  marketplaceRevenue: number;
}

/**
 * Ajouter une vente d'abonnement
 */
export async function recordSubscriptionSale(
  monthlyPrice: number,
  saleType: "site" | "subscription" = "subscription",
  isOffered: boolean = false
): Promise<boolean> {
  try {
    return await runTransaction(db, async (transaction) => {
      const statsRef = doc(db, "stats", "global");
      const statsDoc = await transaction.get(statsRef);
      
      if (!statsDoc.exists()) {
        // Initialiser les stats si elles n'existent pas
        const initialStats = {
          totalArtisans: 0,
          activeSubscribers: 0,
          mrr: 0,
          arr: 0,
          totalUpsellRevenue: 0,
          leadsThisMonth: 0,
          searchesToday: 0,
          demandsLast30d: 0,
          offerBreakdown: {},
          monthlyMetrics: {
            currentMonth: {
              newSubscriptions: 0,
              churnedSubscriptions: 0,
              netGrowth: 0,
              mrrGrowth: 0,
              marketplaceSales: 0,
              marketplaceRevenue: 0
            },
            lastMonth: {
              newSubscriptions: 0,
              churnedSubscriptions: 0,
              netGrowth: 0,
              mrrGrowth: 0,
              marketplaceSales: 0,
              marketplaceRevenue: 0
            }
          },
          updatedAt: serverTimestamp()
        };
        transaction.set(statsRef, initialStats);
      }

      const currentStats = statsDoc.data() || {};
      const offerKey = `offer${monthlyPrice}`;
      
      // Préparer les mises à jour
      const updates: any = {
        updatedAt: serverTimestamp()
      };

      // Mise à jour des métriques globales
      if (!isOffered) {
        updates.activeSubscribers = increment(1);
        updates.mrr = increment(monthlyPrice);
        updates.arr = increment(monthlyPrice * 12);
        
        // Métriques mensuelles
        updates[`monthlyMetrics.currentMonth.newSubscriptions`] = increment(1);
        updates[`monthlyMetrics.currentMonth.netGrowth`] = increment(1);
        updates[`monthlyMetrics.currentMonth.mrrGrowth`] = increment(monthlyPrice);
      }

      // Mise à jour des stats par offre
      const currentOffer = currentStats.offerBreakdown?.[offerKey] || {
        activeSubscribers: 0,
        totalSold: 0,
        sitesSold: 0,
        sitesOffered: 0,
        monthlyRevenue: 0,
        totalRevenue: 0,
        churnCount: 0
      };

      if (!isOffered) {
        updates[`offerBreakdown.${offerKey}.activeSubscribers`] = increment(1);
        updates[`offerBreakdown.${offerKey}.monthlyRevenue`] = increment(monthlyPrice);
      }

      updates[`offerBreakdown.${offerKey}.totalSold`] = increment(1);
      
      if (saleType === "site") {
        if (isOffered) {
          updates[`offerBreakdown.${offerKey}.sitesOffered`] = increment(1);
        } else {
          updates[`offerBreakdown.${offerKey}.sitesSold`] = increment(1);
          updates[`offerBreakdown.${offerKey}.totalRevenue`] = increment(monthlyPrice);
        }
      } else {
        updates[`offerBreakdown.${offerKey}.totalRevenue`] = increment(monthlyPrice);
      }

      transaction.update(statsRef, updates);
      return true;
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la vente:", error);
    return false;
  }
}

/**
 * Enregistrer un désabonnement
 */
export async function recordSubscriptionCancellation(
  monthlyPrice: number,
  cancelReason?: string
): Promise<boolean> {
  try {
    return await runTransaction(db, async (transaction) => {
      const statsRef = doc(db, "stats", "global");
      const statsDoc = await transaction.get(statsRef);
      
      if (!statsDoc.exists()) {
        return false;
      }

      const offerKey = `offer${monthlyPrice}`;
      
      const updates: any = {
        // Métriques globales
        activeSubscribers: increment(-1),
        mrr: increment(-monthlyPrice),
        arr: increment(-monthlyPrice * 12),
        
        // Métriques par offre
        [`offerBreakdown.${offerKey}.activeSubscribers`]: increment(-1),
        [`offerBreakdown.${offerKey}.monthlyRevenue`]: increment(-monthlyPrice),
        [`offerBreakdown.${offerKey}.churnCount`]: increment(1),
        
        // Métriques mensuelles
        [`monthlyMetrics.currentMonth.churnedSubscriptions`]: increment(1),
        [`monthlyMetrics.currentMonth.netGrowth`]: increment(-1),
        [`monthlyMetrics.currentMonth.mrrGrowth`]: increment(-monthlyPrice),
        
        updatedAt: serverTimestamp()
      };

      transaction.update(statsRef, updates);
      return true;
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du désabonnement:", error);
    return false;
  }
}

/**
 * Enregistrer une vente marketplace
 */
export async function recordMarketplaceSale(
  salePrice: number
): Promise<boolean> {
  try {
    return await runTransaction(db, async (transaction) => {
      const statsRef = doc(db, "stats", "global");
      const statsDoc = await transaction.get(statsRef);
      
      const currentStats = statsDoc.exists() ? statsDoc.data() : {};
      const currentMarketplace = currentStats?.offerBreakdown?.marketplace || {
        totalSales: 0,
        totalRevenue: 0,
        averagePrice: 0,
        thisMonthSales: 0
      };

      // Calculer le nouveau prix moyen
      const newTotalSales = currentMarketplace.totalSales + 1;
      const newTotalRevenue = currentMarketplace.totalRevenue + salePrice;
      const newAveragePrice = newTotalRevenue / newTotalSales;

      const updates: any = {
        // Métriques marketplace
        [`offerBreakdown.marketplace.totalSales`]: increment(1),
        [`offerBreakdown.marketplace.totalRevenue`]: increment(salePrice),
        [`offerBreakdown.marketplace.averagePrice`]: newAveragePrice,
        [`offerBreakdown.marketplace.thisMonthSales`]: increment(1),
        
        // Métriques mensuelles
        [`monthlyMetrics.currentMonth.marketplaceSales`]: increment(1),
        [`monthlyMetrics.currentMonth.marketplaceRevenue`]: increment(salePrice),
        
        updatedAt: serverTimestamp()
      };

      transaction.update(statsRef, updates);
      return true;
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la vente marketplace:", error);
    return false;
  }
}

/**
 * Réinitialiser les métriques mensuelles (à appeler au début de chaque mois)
 */
export async function resetMonthlyMetrics(): Promise<boolean> {
  try {
    const statsRef = doc(db, "stats", "global");
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      return false;
    }

    const currentStats = statsDoc.data();
    const currentMonth = currentStats?.monthlyMetrics?.currentMonth || {};

    const updates = {
      // Sauvegarder le mois actuel comme mois précédent
      [`monthlyMetrics.lastMonth`]: currentMonth,
      
      // Réinitialiser le mois actuel
      [`monthlyMetrics.currentMonth`]: {
        newSubscriptions: 0,
        churnedSubscriptions: 0,
        netGrowth: 0,
        mrrGrowth: 0,
        marketplaceSales: 0,
        marketplaceRevenue: 0
      },
      
      // Réinitialiser les ventes marketplace du mois
      [`offerBreakdown.marketplace.thisMonthSales`]: 0,
      
      updatedAt: serverTimestamp()
    };

    await updateDoc(statsRef, updates);
    return true;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des métriques mensuelles:", error);
    return false;
  }
}

/**
 * Obtenir les stats complètes
 */
export async function getStats(): Promise<any> {
  try {
    const statsRef = doc(db, "stats", "global");
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      return null;
    }

    return statsDoc.data();
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    return null;
  }
}

/**
 * Calculer les métriques dérivées (taux de churn, croissance, etc.)
 */
export function calculateDerivedMetrics(stats: any) {
  if (!stats) return {};

  const currentMonth = stats.monthlyMetrics?.currentMonth || {};
  const lastMonth = stats.monthlyMetrics?.lastMonth || {};
  
  // Taux de churn mensuel
  const churnRate = stats.activeSubscribers > 0 
    ? (currentMonth.churnedSubscriptions / stats.activeSubscribers) * 100 
    : 0;

  // Croissance MRR en pourcentage
  const mrrGrowthRate = lastMonth.mrrGrowth !== 0 
    ? ((currentMonth.mrrGrowth - lastMonth.mrrGrowth) / Math.abs(lastMonth.mrrGrowth)) * 100 
    : 0;

  // LTV approximative (basée sur 1/churn rate)
  const averageLTV = churnRate > 0 ? stats.mrr / (churnRate / 100) : 0;

  return {
    churnRate: Math.round(churnRate * 100) / 100,
    mrrGrowthRate: Math.round(mrrGrowthRate * 100) / 100,
    averageLTV: Math.round(averageLTV),
    netGrowthRate: currentMonth.netGrowth,
    marketplaceConversionRate: stats.offerBreakdown?.marketplace?.totalSales || 0
  };
}
