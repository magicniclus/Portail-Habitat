import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface MarketplaceLead {
  id: string;
  city: string;
  department: string;
  location?: {
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  projectType: string;
  prestationType: string;
  propertyType: string;
  surface?: number;
  prestationLevel: string;
  timeline: string;
  estimationLow: number;
  estimationMedium: number;
  estimationHigh: number;
  marketplacePrice: number;
  maxSales: number;
  marketplaceSales: number;
  marketplaceViews: number;
  marketplaceStatus: string;
  marketplacePurchases?: any[];
  publishedAt: Date;
  createdAt: Date;
  confidenceScore: number;
  priceFactors: string[];
  isPublished: boolean;
}

export interface PurchasedLead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  city: string;
  department: string;
  projectType: string;
  prestationType: string;
  propertyType: string;
  surface?: number;
  prestationLevel: string;
  timeline: string;
  estimationLow: number;
  estimationMedium: number;
  estimationHigh: number;
  purchasedAt: Date;
  price: number;
  specificAnswers: any;
  existingState: string;
}

/**
 * Récupérer les demandes disponibles sur la marketplace
 */
export async function getMarketplaceLeads(
  artisanProfessions: string[] = [],
  limitCount: number = 20,
  artisanId?: string
): Promise<MarketplaceLead[]> {
  try {
    // Approche alternative : récupérer toutes les estimations récentes
    // puis filtrer côté client pour éviter TOUS les problèmes d'index
    const leadsQuery = query(
      collection(db, "estimations"),
      orderBy("createdAt", "desc"),
      limit(limitCount * 5) // Prendre beaucoup plus pour filtrer
    );
    
    const snapshot = await getDocs(leadsQuery);
    
    const allLeads = snapshot.docs.map(doc => {
      const data = doc.data();
      
      return {
        id: doc.id,
        city: data.location?.city || 'Ville non renseignée',
        department: data.location?.department || '',
        location: data.location ? {
          coordinates: data.location.coordinates
        } : undefined,
        projectType: data.project?.prestationType || 'Projet non défini',
        prestationType: data.project?.prestationType || '',
        propertyType: data.project?.propertyType || '',
        surface: data.project?.surface,
        prestationLevel: data.project?.prestationLevel || 'standard',
        timeline: data.project?.timeline || 'later',
        estimationLow: data.pricing?.estimationLow || 0,
        estimationMedium: data.pricing?.estimationMedium || 0,
        estimationHigh: data.pricing?.estimationHigh || 0,
        marketplacePrice: data.marketplacePrice || 35,
        maxSales: data.maxSales || 3,
        marketplaceSales: data.marketplaceSales || 0,
        marketplaceViews: data.marketplaceViews || 0,
        marketplaceStatus: data.marketplaceStatus || 'active',
        marketplacePurchases: data.marketplacePurchases || [],
        publishedAt: data.publishedAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        confidenceScore: data.pricing?.confidenceScore || 0,
        priceFactors: data.pricing?.priceFactors || [],
        isPublished: data.isPublished || false
      };
    });

    // Filtrer côté client : publiés ET actifs
    let publishedAndActiveLeads = allLeads.filter(lead => 
      lead.isPublished === true && lead.marketplaceStatus === 'active'
    );

    // Exclure les leads déjà achetés par cet artisan
    if (artisanId) {
      publishedAndActiveLeads = publishedAndActiveLeads.filter(lead => {
        // Vérifier si l'artisan a déjà acheté ce lead
        const alreadyPurchased = lead.marketplacePurchases?.some(
          (purchase: any) => purchase.artisanId === artisanId
        );
        return !alreadyPurchased;
      });
    }

    // Filtrer par professions si spécifiées
    let filteredLeads = publishedAndActiveLeads;
    if (artisanProfessions.length > 0) {
      filteredLeads = publishedAndActiveLeads.filter(lead => 
        artisanProfessions.some(profession => 
          lead.prestationType.toLowerCase().includes(profession.toLowerCase()) ||
          lead.projectType.toLowerCase().includes(profession.toLowerCase())
        )
      );
    }

    // Trier par date de publication (ou création si pas de publishedAt)
    filteredLeads.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });

    // Retourner seulement le nombre demandé
    return filteredLeads.slice(0, limitCount);
  } catch (error) {
    console.error("Erreur lors de la récupération des leads marketplace:", error);
    return [];
  }
}

/**
 * Récupérer les détails complets d'un lead pour un artisan qui l'a acheté
 */
export async function getPurchasedLeadDetails(
  leadId: string, 
  artisanId: string
): Promise<PurchasedLead | null> {
  try {
    const leadDoc = await getDoc(doc(db, "estimations", leadId));
    
    if (!leadDoc.exists()) {
      return null;
    }

    const data = leadDoc.data();
    
    // Vérifier que l'artisan a bien acheté ce lead
    const hasPurchased = data.marketplacePurchases?.some(
      (purchase: any) => purchase.artisanId === artisanId
    );

    if (!hasPurchased) {
      throw new Error("Artisan non autorisé à voir ce lead");
    }

    const purchase = data.marketplacePurchases.find(
      (p: any) => p.artisanId === artisanId
    );

    return {
      id: leadDoc.id,
      clientName: `${data.clientInfo?.firstName || ''} ${data.clientInfo?.lastName || ''}`.trim(),
      clientPhone: data.clientInfo?.phone || '',
      clientEmail: data.clientInfo?.email || '',
      city: data.location?.city || '',
      department: data.location?.department || '',
      projectType: data.project?.prestationType || '',
      prestationType: data.project?.prestationType || '',
      propertyType: data.project?.propertyType || '',
      surface: data.project?.surface,
      prestationLevel: data.project?.prestationLevel || '',
      timeline: data.project?.timeline || '',
      estimationLow: data.pricing?.estimationLow || 0,
      estimationMedium: data.pricing?.estimationMedium || 0,
      estimationHigh: data.pricing?.estimationHigh || 0,
      purchasedAt: purchase?.purchasedAt?.toDate() || new Date(),
      price: purchase?.price || 0,
      specificAnswers: data.project?.specificAnswers || {},
      existingState: data.project?.existingState || ''
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du lead acheté:", error);
    return null;
  }
}

/**
 * Récupérer tous les leads achetés par un artisan
 */
export async function getArtisanPurchasedLeads(artisanId: string): Promise<PurchasedLead[]> {
  try {
    // Récupérer toutes les estimations qui ont des achats marketplace
    // puis filtrer côté client pour éviter les problèmes de requête complexe
    const leadsQuery = query(
      collection(db, "estimations"),
      where("marketplaceSales", ">", 0),
      orderBy("marketplaceSales", "desc"),
      limit(100) // Limiter pour les performances
    );
    
    const snapshot = await getDocs(leadsQuery);
    
    const purchasedLeads: PurchasedLead[] = [];

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Vérifier que l'artisan a bien acheté ce lead
      const purchase = data.marketplacePurchases?.find(
        (p: any) => p.artisanId === artisanId
      );

      if (purchase) {
        purchasedLeads.push({
          id: docSnapshot.id,
          clientName: `${data.clientInfo?.firstName || ''} ${data.clientInfo?.lastName || ''}`.trim(),
          clientPhone: data.clientInfo?.phone || '',
          clientEmail: data.clientInfo?.email || '',
          city: data.location?.city || '',
          department: data.location?.department || '',
          projectType: data.project?.prestationType || '',
          prestationType: data.project?.prestationType || '',
          propertyType: data.project?.propertyType || '',
          surface: data.project?.surface,
          prestationLevel: data.project?.prestationLevel || '',
          timeline: data.project?.timeline || '',
          estimationLow: data.pricing?.estimationLow || 0,
          estimationMedium: data.pricing?.estimationMedium || 0,
          estimationHigh: data.pricing?.estimationHigh || 0,
          purchasedAt: purchase.purchasedAt?.toDate() || new Date(),
          price: purchase.price || 0,
          specificAnswers: data.project?.specificAnswers || {},
          existingState: data.project?.existingState || ''
        });
      }
    }

    // Trier par date d'achat décroissante
    return purchasedLeads.sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime());
  } catch (error) {
    console.error("Erreur lors de la récupération des leads achetés:", error);
    return [];
  }
}

/**
 * Enregistrer l'achat d'un lead par un artisan
 */
export async function recordLeadPurchase(
  leadId: string,
  artisanId: string,
  artisanName: string,
  paymentId: string,
  price: number
): Promise<boolean> {
  try {
    const leadRef = doc(db, "estimations", leadId);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      throw new Error("Lead introuvable");
    }

    const data = leadDoc.data();
    
    // Vérifier que le lead est encore disponible
    if (data.marketplaceStatus !== 'active') {
      throw new Error("Lead non disponible");
    }

    if (data.marketplaceSales >= data.maxSales) {
      throw new Error("Limite de ventes atteinte");
    }

    // Vérifier que l'artisan n'a pas déjà acheté ce lead
    const alreadyPurchased = data.marketplacePurchases?.some(
      (purchase: any) => purchase.artisanId === artisanId
    );

    if (alreadyPurchased) {
      throw new Error("Lead déjà acheté par cet artisan");
    }

    const newSales = (data.marketplaceSales || 0) + 1;
    const newStatus = newSales >= (data.maxSales || 3) ? 'completed' : 'active';

    const updateData: any = {
      marketplacePurchases: arrayUnion({
        artisanId,
        artisanName,
        purchasedAt: new Date(),
        price,
        paymentId
      }),
      marketplaceSales: newSales,
      marketplaceStatus: newStatus,
      updatedAt: serverTimestamp()
    };

    if (newStatus === 'completed') {
      updateData.marketplaceCompletedAt = serverTimestamp();
    }

    await updateDoc(leadRef, updateData);

    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'achat:", error);
    throw error;
  }
}

/**
 * Incrémenter le nombre de vues d'un lead
 */
export async function incrementLeadViews(leadId: string): Promise<void> {
  try {
    const leadRef = doc(db, "estimations", leadId);
    await updateDoc(leadRef, {
      marketplaceViews: increment(1),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
  }
}

/**
 * Formater le niveau de prestation
 */
export function formatPrestationLevel(level: string): string {
  switch (level) {
    case 'low': return 'Économique';
    case 'mid': return 'Standard';
    case 'high': return 'Premium';
    default: return 'Standard';
  }
}

/**
 * Formater l'urgence du projet
 */
export function formatTimeline(timeline: string): string {
  switch (timeline) {
    case 'urgent': return 'Urgent (< 1 mois)';
    case 'soon': return 'Prochainement (1-3 mois)';
    case 'later': return 'Plus tard (> 3 mois)';
    default: return 'À définir';
  }
}

/**
 * Obtenir la couleur pour l'urgence
 */
export function getTimelineColor(timeline: string): string {
  switch (timeline) {
    case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
    case 'soon': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'later': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Formater le prix en euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}
