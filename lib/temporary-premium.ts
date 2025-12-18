import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  writeBatch,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TemporaryPremium } from "./premium-utils";

/**
 * Active un premium temporaire pour un artisan
 */
export async function activateTemporaryPremium(
  artisanId: string,
  adminId: string,
  durationDays: number = 30,
  adminNotes?: string
): Promise<string> {
  try {
    const now = Timestamp.now();
    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
    );

    // Vérifier s'il y a déjà un premium temporaire actif
    const existingQuery = query(
      collection(db, 'temporaryPremiums'),
      where('artisanId', '==', artisanId),
      where('status', '==', 'active')
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    if (!existingSnapshot.empty) {
      throw new Error('Un premium temporaire est déjà actif pour cet artisan');
    }

    // Créer le document premium temporaire
    const temporaryPremium: Omit<TemporaryPremium, 'id'> = {
      artisanId,
      activatedBy: adminId,
      activatedAt: now,
      expiresAt,
      status: 'active',
      grantedFeatures: {
        showTopArtisanBadge: true,
        bannerPhotos: true,
        bannerVideo: true,
        priorityListing: true
      },
      createdAt: now,
      updatedAt: now,
      adminNotes
    };

    const docRef = await addDoc(collection(db, 'temporaryPremiums'), temporaryPremium);

    // Mettre à jour l'artisan pour indiquer qu'il a un premium temporaire
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      'premiumFeatures.premiumType': 'temporary',
      'premiumFeatures.isPremium': true,
      'premiumFeatures.premiumStartDate': now,
      'premiumFeatures.premiumEndDate': expiresAt,
      updatedAt: now
    });

    console.log(`✅ Premium temporaire activé pour l'artisan ${artisanId}:`, {
      id: docRef.id,
      expiresAt: expiresAt.toDate(),
      durationDays
    });

    return docRef.id;

  } catch (error) {
    console.error('❌ Erreur lors de l\'activation du premium temporaire:', error);
    throw new Error('Impossible d\'activer le premium temporaire');
  }
}

/**
 * Prolonge un premium temporaire existant
 */
export async function extendTemporaryPremium(
  temporaryPremiumId: string,
  additionalDays: number,
  adminId: string
): Promise<void> {
  try {
    const tempPremiumRef = doc(db, 'temporaryPremiums', temporaryPremiumId);
    const tempPremiumDoc = await getDoc(tempPremiumRef);
    
    if (!tempPremiumDoc.exists()) {
      throw new Error('Premium temporaire introuvable');
    }

    const data = tempPremiumDoc.data() as TemporaryPremium;
    if (data.status !== 'active') {
      throw new Error('Le premium temporaire n\'est pas actif');
    }

    // Calculer la nouvelle date d'expiration
    const currentExpiresAt = data.expiresAt.toDate();
    const newExpiresAt = new Date(currentExpiresAt.getTime() + additionalDays * 24 * 60 * 60 * 1000);

    // Mettre à jour le premium temporaire
    await updateDoc(tempPremiumRef, {
      expiresAt: Timestamp.fromDate(newExpiresAt),
      updatedAt: Timestamp.now()
    });

    // Mettre à jour l'artisan
    const artisanRef = doc(db, 'artisans', data.artisanId);
    await updateDoc(artisanRef, {
      'premiumFeatures.premiumEndDate': Timestamp.fromDate(newExpiresAt),
      updatedAt: Timestamp.now()
    });

    console.log(`✅ Premium temporaire prolongé de ${additionalDays} jours:`, {
      id: temporaryPremiumId,
      newExpiresAt
    });

  } catch (error) {
    console.error('❌ Erreur lors de la prolongation du premium temporaire:', error);
    throw new Error('Impossible de prolonger le premium temporaire');
  }
}

/**
 * Annule un premium temporaire
 */
export async function cancelTemporaryPremium(
  temporaryPremiumId: string,
  adminId: string
): Promise<void> {
  try {
    const tempPremiumRef = doc(db, 'temporaryPremiums', temporaryPremiumId);
    const tempPremiumDoc = await getDoc(tempPremiumRef);
    
    if (!tempPremiumDoc.exists()) {
      throw new Error('Premium temporaire introuvable');
    }

    const data = tempPremiumDoc.data() as TemporaryPremium;
    
    // Mettre à jour le statut du premium temporaire
    await updateDoc(tempPremiumRef, {
      status: 'cancelled',
      cancelledAt: Timestamp.now(),
      cancelledBy: adminId,
      updatedAt: Timestamp.now()
    });

    // Désactiver le premium sur l'artisan
    const artisanRef = doc(db, 'artisans', data.artisanId);
    await updateDoc(artisanRef, {
      'premiumFeatures.isPremium': false,
      'premiumFeatures.premiumType': null,
      'premiumFeatures.premiumEndDate': Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    console.log(`✅ Premium temporaire annulé:`, {
      id: temporaryPremiumId,
      artisanId: data.artisanId
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'annulation du premium temporaire:', error);
    throw new Error('Impossible d\'annuler le premium temporaire');
  }
}

/**
 * Vérifie si un artisan a un premium temporaire actif
 */
export async function hasActiveTemporaryPremium(artisanId: string): Promise<boolean> {
  try {
    const activeQuery = query(
      collection(db, 'temporaryPremiums'),
      where('artisanId', '==', artisanId),
      where('status', '==', 'active'),
      where('expiresAt', '>', Timestamp.now())
    );
    
    const snapshot = await getDocs(activeQuery);
    return !snapshot.empty;

  } catch (error) {
    console.error('❌ Erreur lors de la vérification du premium temporaire:', error);
    return false;
  }
}

/**
 * Récupère le premium temporaire actif d'un artisan
 */
export async function getActiveTemporaryPremium(artisanId: string): Promise<TemporaryPremium | null> {
  try {
    const activeQuery = query(
      collection(db, 'temporaryPremiums'),
      where('artisanId', '==', artisanId),
      where('status', '==', 'active'),
      where('expiresAt', '>', Timestamp.now())
    );
    
    const snapshot = await getDocs(activeQuery);
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as TemporaryPremium;

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du premium temporaire:', error);
    return null;
  }
}

/**
 * Expire automatiquement les premiums temporaires (pour Cloud Function)
 */
export async function expireTemporaryPremiums(): Promise<number> {
  try {
    const expiredQuery = query(
      collection(db, 'temporaryPremiums'),
      where('status', '==', 'active'),
      where('expiresAt', '<=', Timestamp.now())
    );
    
    const snapshot = await getDocs(expiredQuery);
    if (snapshot.empty) {
      return 0;
    }

    const batch = writeBatch(db);
    const expiredArtisanIds: string[] = [];

    // Marquer les premiums temporaires comme expirés
    snapshot.forEach(doc => {
      const data = doc.data() as TemporaryPremium;
      expiredArtisanIds.push(data.artisanId);
      
      batch.update(doc.ref, {
        status: 'expired',
        updatedAt: Timestamp.now()
      });
    });

    // Désactiver le premium sur les artisans concernés
    for (const artisanId of expiredArtisanIds) {
      const artisanRef = doc(db, 'artisans', artisanId);
      batch.update(artisanRef, {
        'premiumFeatures.isPremium': false,
        'premiumFeatures.premiumType': null,
        updatedAt: Timestamp.now()
      });
    }

    await batch.commit();

    console.log(`✅ ${snapshot.size} premiums temporaires expirés automatiquement`);
    return snapshot.size;

  } catch (error) {
    console.error('❌ Erreur lors de l\'expiration automatique:', error);
    throw new Error('Impossible d\'expirer les premiums temporaires');
  }
}

/**
 * Récupère tous les premiums temporaires avec filtres
 */
export async function getTemporaryPremiums(
  status?: 'active' | 'expired' | 'cancelled',
  artisanId?: string
): Promise<TemporaryPremium[]> {
  try {
    const baseCollection = collection(db, 'temporaryPremiums');
    const constraints = [];

    if (status) {
      constraints.push(where('status', '==', status));
    }
    if (artisanId) {
      constraints.push(where('artisanId', '==', artisanId));
    }

    const q = constraints.length > 0 ? query(baseCollection, ...constraints) : baseCollection;

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TemporaryPremium));

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des premiums temporaires:', error);
    return [];
  }
}

/**
 * Convertit un premium temporaire en premium permanent
 */
export async function convertTemporaryToPermanent(
  temporaryPremiumId: string,
  premiumType: 'monthly' | 'yearly' | 'lifetime',
  adminId: string
): Promise<void> {
  try {
    const tempPremiumRef = doc(db, 'temporaryPremiums', temporaryPremiumId);
    const tempPremiumDoc = await getDoc(tempPremiumRef);
    
    if (!tempPremiumDoc.exists()) {
      throw new Error('Premium temporaire introuvable');
    }

    const data = tempPremiumDoc.data() as TemporaryPremium;
    
    // Calculer les dates pour le premium permanent
    const startDate = new Date();
    let endDate: Date | undefined;

    if (premiumType === 'monthly') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (premiumType === 'yearly') {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    // Pour 'lifetime', pas de date de fin

    const batch = writeBatch(db);

    // Marquer le premium temporaire comme annulé
    batch.update(tempPremiumRef, {
      status: 'cancelled',
      cancelledAt: Timestamp.now(),
      cancelledBy: adminId,
      updatedAt: Timestamp.now(),
      adminNotes: (data.adminNotes || '') + ' [Converti en premium permanent]'
    });

    // Activer le premium permanent sur l'artisan
    const artisanRef = doc(db, 'artisans', data.artisanId);
    batch.update(artisanRef, {
      'premiumFeatures.isPremium': true,
      'premiumFeatures.premiumType': premiumType,
      'premiumFeatures.premiumStartDate': Timestamp.fromDate(startDate),
      'premiumFeatures.premiumEndDate': endDate ? Timestamp.fromDate(endDate) : null,
      'premiumFeatures.premiumBenefits': ['multiple_banners', 'video_banner', 'top_badge', 'priority_listing'],
      updatedAt: Timestamp.now()
    });

    await batch.commit();

    console.log(`✅ Premium temporaire converti en permanent:`, {
      temporaryPremiumId,
      artisanId: data.artisanId,
      newType: premiumType,
      endDate: endDate || 'À vie'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la conversion:', error);
    throw new Error('Impossible de convertir le premium temporaire');
  }
}
