"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import PremiumBanner from "./PremiumBanner";
import StandardBanner from "./StandardBanner";
import { addPremiumBannerPhoto, removePremiumBannerPhoto } from "@/lib/storage";

interface PremiumBannerManagerProps {
  entreprise: {
    id: string;
    nom: string;
    banniere?: string;
    premiumFeatures?: any;
  };
  className?: string;
  canEdit?: boolean;
  onUpdate?: (updatedEntreprise: any) => void;
}

export default function PremiumBannerManager({ 
  entreprise, 
  className = "", 
  canEdit = false,
  onUpdate 
}: PremiumBannerManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const bannerPhotos = entreprise.premiumFeatures?.bannerPhotos || [];
  const hasMultiplePhotos = bannerPhotos.length > 1;

  // Fonction pour ajouter une photo
  const handleAddPhoto = async (file: File) => {
    if (bannerPhotos.length >= 5) {
      alert('Maximum 5 photos de bannière autorisées');
      return;
    }

    try {
      setIsUploading(true);
      setUploadingIndex(bannerPhotos.length);
      
      const updatedPhotos = await addPremiumBannerPhoto(entreprise.id, file);
      
      // Mettre à jour l'entreprise
      const updatedEntreprise = {
        ...entreprise,
        premiumFeatures: {
          ...entreprise.premiumFeatures,
          bannerPhotos: updatedPhotos
        }
      };

      if (onUpdate) {
        onUpdate(updatedEntreprise);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo:', error);
      alert('Erreur lors de l\'ajout de la photo. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
      setUploadingIndex(null);
    }
  };

  // Fonction pour supprimer une photo
  const handleRemovePhoto = async (photoIndex: number) => {
    try {
      setIsUploading(true);
      
      const updatedPhotos = await removePremiumBannerPhoto(entreprise.id, photoIndex);
      
      // Mettre à jour l'entreprise
      const updatedEntreprise = {
        ...entreprise,
        premiumFeatures: {
          ...entreprise.premiumFeatures,
          bannerPhotos: updatedPhotos
        }
      };

      if (onUpdate) {
        onUpdate(updatedEntreprise);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      alert('Erreur lors de la suppression de la photo. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour déclencher l'input file
  const triggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleAddPhoto(file);
      }
    };
    input.click();
  };

  // Si pas de photos de bannière, afficher la bannière standard avec bouton d'ajout
  if (bannerPhotos.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <StandardBanner
          coverUrl={entreprise.banniere}
          companyName={entreprise.nom}
          className="h-96"
        />
        
        {canEdit && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Ajouter une image premium
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Si une seule photo, afficher avec bouton d'ajout
  if (bannerPhotos.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <PremiumBanner
          bannerPhotos={bannerPhotos}
          bannerVideo={entreprise.premiumFeatures?.bannerVideo}
          companyName={entreprise.nom}
          className="h-96"
        />
        
        {canEdit && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              onClick={() => handleRemovePhoto(0)}
              disabled={isUploading}
              variant="destructive"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              onClick={triggerFileInput}
              disabled={isUploading || bannerPhotos.length >= 5}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Ajouter une étape
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Si plusieurs photos, afficher le slider complet avec gestion
  return (
    <div className={`relative ${className}`}>
      <PremiumBanner
        bannerPhotos={bannerPhotos}
        bannerVideo={entreprise.premiumFeatures?.bannerVideo}
        companyName={entreprise.nom}
        className="h-96"
      />
      
      {canEdit && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {/* Bouton supprimer la dernière photo */}
          <Button
            onClick={() => handleRemovePhoto(bannerPhotos.length - 1)}
            disabled={isUploading}
            variant="destructive"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Bouton ajouter une photo (max 5) */}
          {bannerPhotos.length < 5 && (
            <Button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Ajouter une étape ({bannerPhotos.length}/5)
            </Button>
          )}
        </div>
      )}

      {/* Indicateur de chargement pour une photo spécifique */}
      {isUploading && uploadingIndex !== null && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/90 rounded-lg p-4 text-center">
            <Loader2 className="h-8 w-8 text-gray-700 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-700">
              Ajout de l'image {uploadingIndex + 1}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
