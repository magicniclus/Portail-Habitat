import { useEffect, useCallback } from 'react';
import { 
  trackArtisanView, 
  trackPhoneClick, 
  trackFormSubmission,
  InteractionType 
} from '@/lib/artisan-analytics';

interface UseArtisanTrackingProps {
  artisanId: string;
  autoTrackView?: boolean; // Tracker automatiquement la vue au montage du composant
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
  autoTrackView = true 
}: UseArtisanTrackingProps) {
  
  // Tracker automatiquement la vue au montage du composant
  useEffect(() => {
    if (autoTrackView && artisanId) {
      trackArtisanView(artisanId);
    }
  }, [artisanId, autoTrackView]);

  // Fonction pour tracker un clic sur le téléphone
  const handlePhoneClick = useCallback(async () => {
    if (!artisanId) return;
    
    try {
      await trackPhoneClick(artisanId);
    } catch (error) {
      console.error('Erreur lors du tracking du clic téléphone:', error);
    }
  }, [artisanId]);

  // Fonction pour tracker un envoi de formulaire
  const handleFormSubmission = useCallback(async (formData: FormSubmissionData) => {
    if (!artisanId) return;
    
    try {
      await trackFormSubmission(artisanId, formData);
    } catch (error) {
      console.error('Erreur lors du tracking du formulaire:', error);
    }
  }, [artisanId]);

  // Fonction générique pour tracker une vue manuelle
  const handleViewTracking = useCallback(async () => {
    if (!artisanId) return;
    
    try {
      await trackArtisanView(artisanId);
    } catch (error) {
      console.error('Erreur lors du tracking de la vue:', error);
    }
  }, [artisanId]);

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
