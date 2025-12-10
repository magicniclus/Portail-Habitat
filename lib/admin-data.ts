import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "./firebase";

export interface RecentArtisan {
  id: string;
  name: string;
  email: string;
  company: string;
  profession: string;
  status: string;
  createdAt: Date;
  city?: string;
  phone?: string;
}

export interface RecentProject {
  id: string;
  clientName: string;
  projectType: string;
  status: string;
  estimatedBudget?: number;
  createdAt: Date;
  assignedArtisans?: number;
  city?: string;
}

export interface RecentDemand {
  id: string;
  clientName: string;
  projectType: string;
  status: string;
  createdAt: Date;
  city?: string;
  urgency?: string;
}

/**
 * Récupérer les artisans récents
 */
export async function getRecentArtisans(limitCount: number = 5): Promise<RecentArtisan[]> {
  try {
    const artisansQuery = query(
      collection(db, "artisans"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(artisansQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email || 'Nom non renseigné',
        email: data.email || '',
        company: data.company || 'Entreprise non renseignée',
        profession: data.profession || 'Profession non renseignée',
        status: data.status || 'pending',
        createdAt: data.createdAt?.toDate() || new Date(),
        city: data.city || data.address?.city,
        phone: data.phone
      };
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des artisans récents:", error);
    return [];
  }
}

/**
 * Récupérer les projets récents
 */
export async function getRecentProjects(limitCount: number = 5): Promise<RecentProject[]> {
  try {
    const projectsQuery = query(
      collection(db, "estimations"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(projectsQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const clientInfo = data.clientInfo || {};
      
      return {
        id: doc.id,
        clientName: `${clientInfo.firstName || ''} ${clientInfo.lastName || ''}`.trim() || 'Client non renseigné',
        projectType: data.project?.prestationType || 'Type non défini',
        status: data.status || 'draft',
        estimatedBudget: data.project?.estimatedBudget,
        createdAt: data.createdAt?.toDate() || new Date(),
        assignedArtisans: data.assignments?.length || 0,
        city: data.project?.location?.city || clientInfo.city
      };
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets récents:", error);
    return [];
  }
}

/**
 * Récupérer les demandes récentes
 */
export async function getRecentDemands(limitCount: number = 5): Promise<RecentDemand[]> {
  try {
    // Récupérer toutes les estimations récentes puis filtrer côté client
    // pour éviter l'index composite Firestore
    const demandsQuery = query(
      collection(db, "estimations"),
      orderBy("createdAt", "desc"),
      limit(limitCount * 3) // Prendre plus pour filtrer ensuite
    );
    
    const snapshot = await getDocs(demandsQuery);
    
    const allDemands = snapshot.docs.map(doc => {
      const data = doc.data();
      const clientInfo = data.clientInfo || {};
      
      return {
        id: doc.id,
        clientName: `${clientInfo.firstName || ''} ${clientInfo.lastName || ''}`.trim() || 'Client non renseigné',
        projectType: data.project?.prestationType || 'Type non défini',
        status: data.status || 'draft',
        createdAt: data.createdAt?.toDate() || new Date(),
        city: data.project?.location?.city || clientInfo.city,
        urgency: data.project?.urgency || 'normal'
      };
    });

    // Filtrer côté client les statuts qui nous intéressent
    const filteredDemands = allDemands.filter(demand => 
      ['draft', 'new', 'pending'].includes(demand.status)
    );

    // Retourner seulement le nombre demandé
    return filteredDemands.slice(0, limitCount);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes récentes:", error);
    return [];
  }
}

/**
 * Récupérer les statistiques rapides
 */
export async function getQuickStats() {
  try {
    const [artisansSnapshot, projectsSnapshot] = await Promise.all([
      getDocs(collection(db, "artisans")),
      getDocs(collection(db, "estimations"))
    ]);

    // Compter les artisans actifs
    const activeArtisans = artisansSnapshot.docs.filter(doc => 
      doc.data().status === 'active'
    ).length;

    // Compter les projets par statut et les demandes en attente
    let pendingDemands = 0;
    const projectsByStatus = projectsSnapshot.docs.reduce((acc, doc) => {
      const status = doc.data().status || 'draft';
      acc[status] = (acc[status] || 0) + 1;
      
      // Compter les demandes en attente
      if (status === 'draft') {
        pendingDemands++;
      }
      
      return acc;
    }, {} as Record<string, number>);

    return {
      totalArtisans: artisansSnapshot.size,
      activeArtisans,
      totalProjects: projectsSnapshot.size,
      pendingDemands,
      projectsByStatus
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des stats rapides:", error);
    return {
      totalArtisans: 0,
      activeArtisans: 0,
      totalProjects: 0,
      pendingDemands: 0,
      projectsByStatus: {}
    };
  }
}

/**
 * Formater la date relative
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "À l'instant";
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Il y a ${diffInDays}j`;
  
  return date.toLocaleDateString('fr-FR');
}

/**
 * Obtenir la couleur du statut
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'pending':
    case 'draft':
      return 'text-yellow-600 bg-yellow-100';
    case 'cancelled':
    case 'rejected':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Obtenir le libellé du statut
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'active': return 'Actif';
    case 'pending': return 'En attente';
    case 'completed': return 'Terminé';
    case 'draft': return 'Brouillon';
    case 'sent': return 'Envoyé';
    case 'cancelled': return 'Annulé';
    case 'rejected': return 'Rejeté';
    default: return status;
  }
}
