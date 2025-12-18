import { useEffect, useCallback, useRef } from 'react';
import { 
  trackArtisanView, 
  trackPhoneClick, 
  trackFormSubmission,
  InteractionType 
} from '@/lib/artisan-analytics';

interface UseArtisanTrackingProps {
  artisanId: string;
  autoTrackView?: boolean; // Tracker automatiquement la vue au montage du composant
  isDemo?: boolean; // Désactiver le tracking pour les artisans demo
}

interface FormSubmissionData {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  projectType?: string;
}

export function useArtisanTracking({ 
  artisanId, 
  autoTrackView = true,
  isDemo = false 
}: UseArtisanTrackingProps) {
  
  // Référence pour éviter le double tracking
  const hasTrackedView = useRef(false);
  const lastTrackedArtisanId = useRef<string | null>(null);
  
  // Tracker automatiquement la vue au montage du composant
  useEffect(() => {
    // Désactiver complètement le tracking pour les artisans demo
    if (isDemo) {
      console.log('🚫 Tracking désactivé pour artisan demo:', artisanId);
      return;
    }

    // Seulement si autoTrackView est true ET qu'on a un artisanId valide
    if (!autoTrackView || !artisanId) {
      console.log('🚫 Tracking désactivé:', { autoTrackView, artisanId });
      return;
    }

    // Vérifier si on a déjà tracké pour cet artisan dans cette session
    if (hasTrackedView.current && lastTrackedArtisanId.current === artisanId) {
      console.log('⚠️ Vue déjà trackée pour cet artisan, skip:', artisanId);
      return;
    }

    console.log('🎯 Tracking vue pour artisan:', artisanId);
    trackArtisanView(artisanId);
    hasTrackedView.current = true;
    lastTrackedArtisanId.current = artisanId;
  }, [artisanId, autoTrackView]);

  // Fonction pour tracker un clic sur le téléphone
  const handlePhoneClick = useCallback(async () => {
    if (!artisanId || isDemo) return;
    
    try {
      await trackPhoneClick(artisanId);
    } catch (error) {
      console.error('Erreur lors du tracking du clic téléphone:', error);
    }
  }, [artisanId, isDemo]);

  // Fonction pour tracker un envoi de formulaire
  const handleFormSubmission = useCallback(async (formData: FormSubmissionData) => {
    if (!artisanId || isDemo) return;
    
    try {
      await trackFormSubmission(artisanId, formData);
    } catch (error) {
      console.error('Erreur lors du tracking du formulaire:', error);
    }
  }, [artisanId, isDemo]);

  // Fonction générique pour tracker une vue manuelle
  const handleViewTracking = useCallback(async () => {
    if (!artisanId || isDemo) return;
    
    try {
      await trackArtisanView(artisanId);
    } catch (error) {
      console.error('Erreur lors du tracking de la vue:', error);
    }
  }, [artisanId, isDemo]);

  return {
    trackPhoneClick: handlePhoneClick,
    trackFormSubmission: handleFormSubmission,
    trackView: handleViewTracking
  };
}

// Hook spécialisé pour les boutons téléphone
export function usePhoneTracking(artisanId: string) {
  const { trackPhoneClick } = useArtisanTracking({ 
    artisanId, 
    autoTrackView: false 
  });

  const handlePhoneClick = useCallback((phoneNumber: string) => {
    // Tracker l'interaction
    trackPhoneClick();
    
    // Ouvrir l'application téléphone
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${phoneNumber}`;
    }
  }, [trackPhoneClick]);

  return { handlePhoneClick };
}

// Hook spécialisé pour les formulaires de contact
export function useContactFormTracking(artisanId: string) {
  const { trackFormSubmission } = useArtisanTracking({ 
    artisanId, 
    autoTrackView: false 
  });

  const handleFormSubmit = useCallback(async (formData: FormSubmissionData) => {
    // Tracker l'envoi du formulaire
    await trackFormSubmission(formData);
    
    // Retourner true pour indiquer que le tracking a été effectué
    return true;
  }, [trackFormSubmission]);

  return { handleFormSubmit };
}
