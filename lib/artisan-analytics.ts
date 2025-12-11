import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc,
  collection, 
  addDoc, 
  serverTimestamp, 
  runTransaction,
  increment 
} from 'firebase/firestore';
import { db } from "@/lib/firebase";

// Types pour les interactions
export type InteractionType = "view" | "phone_click" | "form_submission";

export interface VisitorInteraction {
  type: InteractionType;
  timestamp: any;
  visitorId: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  deviceType?: "mobile" | "tablet" | "desktop";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  formData?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    projectType?: string;
  };
}

// Générer un ID visiteur unique basé sur la session
export function generateVisitorId(): string {
  // Utiliser sessionStorage pour persister pendant la session
  let visitorId = sessionStorage.getItem('visitor_id');
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('visitor_id', visitorId);
  }
  
  return visitorId;
}

// Détecter le type d'appareil
export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === 'undefined') return "desktop";
  
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

// Extraire les paramètres UTM de l'URL
export function getUTMParams() {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
  };
}

// Initialiser les analytics d'un artisan si elles n'existent pas
export async function initializeArtisanAnalytics(artisanId: string) {
  try {
    const artisanRef = doc(db, "artisans", artisanId);
    const artisanDoc = await getDoc(artisanRef);
    
    console.log(`🔍 Vérification artisan: ${artisanId}`, { exists: artisanDoc.exists() });
    
    if (artisanDoc.exists()) {
      const data = artisanDoc.data();
      if (!data.analytics) {
        console.log(`📊 Initialisation des analytics pour: ${artisanId}`);
        await updateDoc(artisanRef, {
          analytics: {
            totalViews: 0,
            totalPhoneClicks: 0,
            totalFormSubmissions: 0,
            viewsThisMonth: 0,
            phoneClicksThisMonth: 0,
            formSubmissionsThisMonth: 0,
            lastViewedAt: null,
            updatedAt: serverTimestamp()
          }
        });
        console.log(`✅ Analytics initialisées pour: ${artisanId}`);
      } else {
        console.log(`✅ Analytics déjà présentes pour: ${artisanId}`);
      }
    } else {
      console.log(`❌ Artisan non trouvé pour initialisation: ${artisanId}`);
      // Créer un document artisan minimal avec analytics si nécessaire
      await setDoc(artisanRef, {
        analytics: {
          totalViews: 0,
          totalPhoneClicks: 0,
          totalFormSubmissions: 0,
          viewsThisMonth: 0,
          phoneClicksThisMonth: 0,
          formSubmissionsThisMonth: 0,
          lastViewedAt: null,
          updatedAt: serverTimestamp()
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log(`🆕 Document artisan créé avec analytics: ${artisanId}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation des analytics:", error);
  }
}

// Tracker une interaction
export async function trackArtisanInteraction(
  artisanId: string, 
  type: InteractionType,
  formData?: VisitorInteraction['formData']
) {
  try {
    console.log(`🎯 Début tracking ${type} pour artisan:`, artisanId);
    
    // Générer un ID visiteur simple
    const visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Détecter le type d'appareil simple
    const deviceType = typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop';
    
    // Préparer les données d'interaction simplifiées
    const interactionData: VisitorInteraction = {
      type,
      timestamp: serverTimestamp(),
      visitorId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      deviceType,
      ...(formData && { formData })
    };

    console.log(`📝 Données d'interaction:`, interactionData);

    // Ajouter l'interaction à la sous-collection
    const interactionsRef = collection(db, "artisans", artisanId, "visitor_interactions");
    await addDoc(interactionsRef, interactionData);
    console.log(`✅ Interaction ajoutée à la sous-collection`);

    // Mettre à jour les compteurs dans le document principal
    const artisanRef = doc(db, "artisans", artisanId);
    
    // Préparer les mises à jour des compteurs
    const updates: any = {
      [`analytics.updatedAt`]: serverTimestamp()
    };

    switch (type) {
      case "view":
        updates[`analytics.totalViews`] = increment(1);
        updates[`analytics.viewsThisMonth`] = increment(1);
        updates[`analytics.lastViewedAt`] = serverTimestamp();
        break;
      case "phone_click":
        updates[`analytics.totalPhoneClicks`] = increment(1);
        updates[`analytics.phoneClicksThisMonth`] = increment(1);
        break;
      case "form_submission":
        updates[`analytics.totalFormSubmissions`] = increment(1);
        updates[`analytics.formSubmissionsThisMonth`] = increment(1);
        break;
    }

    // Initialiser les analytics si elles n'existent pas AVANT de mettre à jour
    await initializeArtisanAnalytics(artisanId);
    
    // Appliquer les mises à jour
    await updateDoc(artisanRef, updates);

    console.log(`✅ Interaction ${type} trackée pour l'artisan ${artisanId}`);
    
  } catch (error) {
    console.error("Erreur lors du tracking de l'interaction:", error);
  }
}

// Tracker une vue de fiche artisan
export async function trackArtisanView(artisanId: string) {
  return trackArtisanInteraction(artisanId, "view");
}

// Tracker un clic sur le téléphone
export async function trackPhoneClick(artisanId: string) {
  return trackArtisanInteraction(artisanId, "phone_click");
}

// Tracker un envoi de formulaire
export async function trackFormSubmission(
  artisanId: string, 
  formData: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    projectType?: string;
  }
) {
  return trackArtisanInteraction(artisanId, "form_submission", formData);
}

// Réinitialiser les compteurs mensuels (à appeler chaque début de mois)
export async function resetMonthlyCounters(artisanId: string) {
  try {
    const artisanRef = doc(db, "artisans", artisanId);
    await updateDoc(artisanRef, {
      "analytics.viewsThisMonth": 0,
      "analytics.phoneClicksThisMonth": 0,
      "analytics.formSubmissionsThisMonth": 0,
      "analytics.updatedAt": serverTimestamp()
    });
    
    console.log(`✅ Compteurs mensuels réinitialisés pour l'artisan ${artisanId}`);
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des compteurs:", error);
  }
}

// Obtenir les analytics d'un artisan
export async function getArtisanAnalytics(artisanId: string) {
  try {
    const artisanRef = doc(db, "artisans", artisanId);
    const artisanDoc = await getDoc(artisanRef);
    
    if (artisanDoc.exists()) {
      const data = artisanDoc.data();
      console.log(`✅ Artisan trouvé: ${artisanId}`, data);
      
      return data.analytics || {
        totalViews: 0,
        totalPhoneClicks: 0,
        totalFormSubmissions: 0,
        viewsThisMonth: 0,
        phoneClicksThisMonth: 0,
        formSubmissionsThisMonth: 0,
        lastViewedAt: null,
        updatedAt: null
      };
    } else {
      console.log(`❌ Artisan non trouvé: ${artisanId}`);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des analytics:", error);
    return null;
  }
}
