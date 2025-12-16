"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Crown } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Building } from "lucide-react";

interface StandardBannerManagerProps {
  entreprise: {
    id: string;
    nom: string;
    banniere?: string;
    premiumFeatures?: {
      isPremium: boolean;
    };
  };
  className?: string;
  canEdit?: boolean;
  onUpdate?: (updatedEntreprise: any) => void;
  onCoverChange?: (file: File) => Promise<void>;
}

export default function StandardBannerManager({ 
  entreprise, 
  className = "", 
  canEdit = false,
  onUpdate,
  onCoverChange
}: StandardBannerManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleCoverClick = () => {
    if (canEdit && coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onCoverChange) return;

    // Vérifications du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }

    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux. Taille maximale : 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      await onCoverChange(file);
    } catch (error) {
      console.error('Erreur lors du changement de couverture:', error);
      alert('Erreur lors du changement de couverture. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
      // Reset input pour permettre de sélectionner le même fichier
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }
    }
  };

  // Si pas d'image de couverture ou erreur de chargement
  if (!entreprise.banniere || hasError) {
    return (
      <div className={`relative w-full bg-gradient-to-r from-blue-100 to-green-100 overflow-hidden rounded-lg ${className}`}>
        {/* Input file caché */}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleCoverFileChange}
          className="hidden"
        />

        <div className="relative w-full h-96 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm mb-4">Photo de couverture</p>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCoverClick}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? 'Upload...' : 'Ajouter une photo'}
                </Button>
              )}
            </div>
          </div>

          {/* Bouton "+ de photo" pour non-premium en haut à droite */}
          {canEdit && !entreprise.premiumFeatures?.isPremium && (
            <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium shadow-lg border-0"
                asChild
              >
                <a href="/dashboard/premium">
                  <Crown className="h-4 w-4 mr-2" />
                  + de photo
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Indicateur de chargement global */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
            <div className="bg-white rounded-xl p-6 text-center shadow-xl transform scale-100 animate-in fade-in duration-300">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium">
                Upload en cours...
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      {/* Input file caché */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleCoverFileChange}
        className="hidden"
      />

      <div className="relative w-full h-96 overflow-hidden">
        {/* Skeleton pendant le chargement */}
        {isLoading && (
          <Skeleton className="w-full h-full" />
        )}

        {/* Image de couverture */}
        <div 
          className={`relative w-full h-full ${canEdit ? 'cursor-pointer group' : ''}`}
          onClick={handleCoverClick}
        >
          <img
            src={entreprise.banniere}
            alt={`Couverture ${entreprise.nom}`}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              display: isLoading ? 'none' : 'block',
              objectPosition: 'center center'
            }}
          />
          
          {/* Overlay avec effet hover */}
          {canEdit && !isUploading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 ease-out flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-white/90 rounded-full p-3 transform scale-90 group-hover:scale-100">
                <Camera className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          )}

          {/* Bouton "+ de photo" pour non-premium en haut à droite quand il y a une image */}
          {canEdit && !entreprise.premiumFeatures?.isPremium && (
            <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium shadow-lg border-0"
                asChild
              >
                <a href="/dashboard/premium">
                  <Crown className="h-4 w-4 mr-2" />
                  + de photo
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Indicateur de chargement global */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
          <div className="bg-white rounded-xl p-6 text-center shadow-xl transform scale-100 animate-in fade-in duration-300">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium">
              Upload en cours...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
