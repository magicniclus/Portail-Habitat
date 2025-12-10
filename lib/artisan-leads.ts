import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface ArtisanLead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectType: string;
  city: string;
  budget: number;
  source: "main-form" | "mini-site" | "bought" | "priority";
  status: "new" | "contacted" | "converted" | "lost";
  marketplacePrice?: number;
  originalEstimationId?: string;
  createdAt: any;
  notes?: string;
}

/**
 * Récupérer tous les leads d'un artisan (générés + achetés)
 */
export async function getArtisanLeads(artisanId: string): Promise<ArtisanLead[]> {
  try {
    const leadsRef = collection(db, "artisans", artisanId, "leads");
    const q = query(leadsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ArtisanLead[];
  } catch (error) {
    console.error("Erreur lors de la récupération des leads artisan:", error);
    return [];
  }
}

/**
 * Récupérer seulement les appels d'offres via la marketplace
 */
export async function getBoughtLeads(artisanId: string): Promise<ArtisanLead[]> {
  try {
    const leadsRef = collection(db, "artisans", artisanId, "leads");
    
    // Solution temporaire : récupérer tous les leads puis filtrer côté client
    // pour éviter l'erreur d'index en attendant sa création
    const q = query(leadsRef, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    
    const allLeads = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ArtisanLead[];
    
    // Filtrer côté client pour les leads achetés
    return allLeads.filter(lead => lead.source === "bought");
  } catch (error) {
    console.error("Erreur lors de la récupération des appels d'offres:", error);
    
    // Si même la requête simple échoue, essayer sans orderBy
    try {
      const leadsRef = collection(db, "artisans", artisanId, "leads");
      const querySnapshot = await getDocs(leadsRef);
      
      const allLeads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArtisanLead[];
      
      // Filtrer et trier côté client
      return allLeads
        .filter(lead => lead.source === "bought")
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
    } catch (fallbackError) {
      console.error("Erreur de fallback:", fallbackError);
      return [];
    }
  }
}

/**
 * Mettre à jour le statut d'un lead
 */
export async function updateLeadStatus(
  artisanId: string, 
  leadId: string, 
  status: "new" | "contacted" | "converted" | "lost",
  notes?: string
): Promise<boolean> {
  try {
    const leadRef = doc(db, "artisans", artisanId, "leads", leadId);
    
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    await updateDoc(leadRef, updateData);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du lead:", error);
    return false;
  }
}

/**
 * Vérifier si un artisan a déjà acheté un lead spécifique
 */
export async function hasArtisanBoughtLead(artisanId: string, estimationId: string): Promise<boolean> {
  try {
    const leadsRef = collection(db, "artisans", artisanId, "leads");
    const q = query(
      leadsRef, 
      where("originalEstimationId", "==", estimationId),
      where("source", "==", "bought")
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Erreur lors de la vérification d'achat:", error);
    return false;
  }
}

/**
 * Formater le statut pour l'affichage
 */
export function formatLeadStatus(status: string): { label: string; color: string } {
  switch (status) {
    case "new":
      return { label: "Nouveau", color: "bg-blue-100 text-blue-800" };
    case "contacted":
      return { label: "Contacté", color: "bg-yellow-100 text-yellow-800" };
    case "converted":
      return { label: "Converti", color: "bg-green-100 text-green-800" };
    case "lost":
      return { label: "Perdu", color: "bg-red-100 text-red-800" };
    default:
      return { label: "Inconnu", color: "bg-gray-100 text-gray-800" };
  }
}

/**
 * Formater la source pour l'affichage
 */
export function formatLeadSource(source: string): { label: string; color: string } {
  switch (source) {
    case "main-form":
      return { label: "Formulaire principal", color: "bg-purple-100 text-purple-800" };
    case "mini-site":
      return { label: "Mini-site", color: "bg-indigo-100 text-indigo-800" };
    case "bought":
      return { label: "Acheté", color: "bg-orange-100 text-orange-800" };
    case "priority":
      return { label: "Prioritaire", color: "bg-red-100 text-red-800" };
    default:
      return { label: "Autre", color: "bg-gray-100 text-gray-800" };
  }
}
