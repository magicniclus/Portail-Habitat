import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface NotificationData {
  artisanId: string;
  type: 'lead' | 'review';
  data: any;
}

// Fonction pour vérifier les préférences de notification d'un artisan
export async function checkArtisanNotificationPreferences(artisanId: string, notificationType: 'emailLeads' | 'emailReviews'): Promise<boolean> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    const artisanDoc = await getDoc(artisanRef);
    
    if (!artisanDoc.exists()) {
      console.log(`Artisan ${artisanId} non trouvé`);
      return false;
    }
    
    const artisanData = artisanDoc.data();
    const notifications = artisanData.notifications;
    
    // Si pas de préférences définies, utiliser les valeurs par défaut
    if (!notifications) {
      console.log(`Pas de préférences pour ${artisanId}, utilisation des valeurs par défaut`);
      return notificationType === 'emailLeads' || notificationType === 'emailReviews'; // true par défaut
    }
    
    const shouldNotify = notifications[notificationType] === true;
    console.log(`Préférence ${notificationType} pour ${artisanId}: ${shouldNotify}`);
    
    return shouldNotify;
    
  } catch (error) {
    console.error('Erreur lors de la vérification des préférences:', error);
    // En cas d'erreur, on envoie quand même (sécurité)
    return true;
  }
}

// Fonction pour envoyer une notification de lead si autorisée
export async function sendLeadNotificationIfAllowed(artisanId: string, leadData: {
  artisanEmail: string;
  artisanName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientPostalCode: string;
  projectDescription?: string;
}): Promise<boolean> {
  try {
    // Vérifier les préférences
    const shouldNotify = await checkArtisanNotificationPreferences(artisanId, 'emailLeads');
    
    if (!shouldNotify) {
      console.log(`Notification lead désactivée pour l'artisan ${artisanId}`);
      return false;
    }
    
    // Envoyer la notification
    const response = await fetch('/api/send-lead-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    console.log(`Notification lead envoyée pour l'artisan ${artisanId}`);
    return true;
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification lead:', error);
    return false;
  }
}

// Fonction pour envoyer une notification d'avis si autorisée
export async function sendReviewNotificationIfAllowed(artisanId: string, reviewData: {
  artisanEmail: string;
  artisanName: string;
  clientName: string;
  rating: number;
  comment?: string;
  reviewUrl?: string;
}): Promise<boolean> {
  try {
    // Vérifier les préférences
    const shouldNotify = await checkArtisanNotificationPreferences(artisanId, 'emailReviews');
    
    if (!shouldNotify) {
      console.log(`Notification avis désactivée pour l'artisan ${artisanId}`);
      return false;
    }
    
    // Envoyer la notification
    const response = await fetch('/api/send-review-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    console.log(`Notification avis envoyée pour l'artisan ${artisanId}`);
    return true;
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification avis:', error);
    return false;
  }
}

// Fonction générique pour envoyer des notifications
export async function sendNotificationIfAllowed(notificationData: NotificationData): Promise<boolean> {
  const { artisanId, type, data } = notificationData;
  
  switch (type) {
    case 'lead':
      return await sendLeadNotificationIfAllowed(artisanId, data);
    case 'review':
      return await sendReviewNotificationIfAllowed(artisanId, data);
    default:
      console.error(`Type de notification non supporté: ${type}`);
      return false;
  }
}
