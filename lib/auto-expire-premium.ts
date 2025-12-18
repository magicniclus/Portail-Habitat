import { 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch, 
  doc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TemporaryPremium } from "./premium-utils";

/**
 * Expire automatiquement les premiums temporaires côté Next.js
 * À appeler régulièrement (ex: à chaque connexion admin)
 */
export async function autoExpireTemporaryPremiums(): Promise<{
  success: boolean;
  expiredCount: number;
  expiredArtisanIds: string[];
  error?: string;
}> {
  try {
    console.log('🔄 Vérification des premiums temporaires expirés...');
    
    const now = Timestamp.now();
    
    // Récupérer tous les premiums temporaires actifs expirés
    const expiredQuery = query(
      collection(db, 'temporaryPremiums'),
      where('status', '==', 'active'),
      where('expiresAt', '<=', now)
    );
    
    const snapshot = await getDocs(expiredQuery);
    
    if (snapshot.empty) {
      console.log('✅ Aucun premium temporaire à expirer');
      return {
        success: true,
        expiredCount: 0,
        expiredArtisanIds: []
      };
    }

    console.log(`📋 ${snapshot.size} premiums temporaires à expirer`);
    
    const batch = writeBatch(db);
    const expiredArtisanIds: string[] = [];

    // Traiter chaque premium temporaire expiré
    snapshot.forEach(docSnapshot => {
      const data = docSnapshot.data() as TemporaryPremium;
      expiredArtisanIds.push(data.artisanId);
      
      // Marquer le premium temporaire comme expiré
      batch.update(docSnapshot.ref, {
        status: 'expired',
        updatedAt: now
      });
      
      console.log(`⏰ Premium temporaire expiré pour l'artisan ${data.artisanId}`);
    });

    // Désactiver le premium sur les artisans concernés
    for (const artisanId of expiredArtisanIds) {
      const artisanRef = doc(db, 'artisans', artisanId);
      
      batch.update(artisanRef, {
        'premiumFeatures.isPremium': false,
        'premiumFeatures.premiumType': null,
        'premiumFeatures.premiumEndDate': now,
        updatedAt: now
      });
    }

    // Exécuter toutes les mises à jour
    await batch.commit();

    console.log(`✅ ${snapshot.size} premiums temporaires expirés avec succès`);
    
    return {
      success: true,
      expiredCount: snapshot.size,
      expiredArtisanIds
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'expiration automatique:', error);
    
    return {
      success: false,
      expiredCount: 0,
      expiredArtisanIds: [],
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Vérifie si des premiums temporaires vont expirer bientôt
 */
export async function getExpiringTemporaryPremiums(daysAhead: number = 7): Promise<{
  count: number;
  premiums: Array<{
    id: string;
    artisanId: string;
    expiresAt: Date;
    daysRemaining: number;
  }>;
}> {
  try {
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    
    const expiringQuery = query(
      collection(db, 'temporaryPremiums'),
      where('status', '==', 'active'),
      where('expiresAt', '>', Timestamp.now()),
      where('expiresAt', '<=', Timestamp.fromDate(futureDate))
    );
    
    const snapshot = await getDocs(expiringQuery);
    
    const premiums = snapshot.docs.map(doc => {
      const data = doc.data() as TemporaryPremium;
      const expiresAt = data.expiresAt.toDate();
      const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: doc.id,
        artisanId: data.artisanId,
        expiresAt,
        daysRemaining: Math.max(0, daysRemaining)
      };
    });

    return {
      count: premiums.length,
      premiums
    };

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des premiums expirants:', error);
    return {
      count: 0,
      premiums: []
    };
  }
}

/**
 * Hook pour vérifier automatiquement les expirations
 * À utiliser dans les composants admin
 */
export function useAutoExpirePremiums() {
  const checkAndExpire = async () => {
    const result = await autoExpireTemporaryPremiums();
    
    if (result.success && result.expiredCount > 0) {
      // Optionnel : Afficher une notification
      console.log(`🔔 ${result.expiredCount} premium(s) temporaire(s) ont expiré automatiquement`);
    }
    
    return result;
  };

  return { checkAndExpire };
}
