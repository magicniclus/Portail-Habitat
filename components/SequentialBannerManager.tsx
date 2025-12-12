"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { addPremiumBannerPhoto, replacePremiumBannerPhoto, removePremiumBannerPhoto } from "@/lib/storage";
import { X } from "lucide-react";
import { toast } from "@/hooks/useToast";

interface SequentialBannerManagerProps {
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

export default function SequentialBannerManager({ 
  entreprise, 
  className = "", 
  canEdit = false,
  onUpdate 
}: SequentialBannerManagerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const [bannerPhotos, setBannerPhotos] = useState(entreprise.premiumFeatures?.bannerPhotos || []);
  const maxSteps = 5;

  // Créer un tableau limité aux photos existantes + 1 slot vide (max 5)
  const availableSlots = Math.min(bannerPhotos.length + 1, maxSteps);
  const allSlots = Array.from({ length: availableSlots }, (_, index) => bannerPhotos[index] || null);
  

  // Synchroniser avec les props quand l'entreprise change
  useEffect(() => {
    let initialPhotos = entreprise.premiumFeatures?.bannerPhotos || [];
    
    // Migration automatique : si pas de bannerPhotos mais qu'il y a une banniere
    if (initialPhotos.length === 0 && entreprise.banniere) {
      console.log('Migration automatique de banniere vers bannerPhotos:', entreprise.banniere);
      initialPhotos = [entreprise.banniere];
      
      // Sauvegarder automatiquement la migration
      const updatedEntreprise = {
        ...entreprise,
        premiumFeatures: {
          ...entreprise.premiumFeatures,
          bannerPhotos: initialPhotos
        }
      };
      
      if (onUpdate) {
        console.log('Sauvegarde de la migration automatique');
        onUpdate(updatedEntreprise);
      }
    }
    
    setBannerPhotos(initialPhotos);
  }, [entreprise.premiumFeatures?.bannerPhotos, entreprise.banniere, onUpdate]);

  // Synchroniser avec l'API du carousel
  const onCarouselSelect = useCallback(() => {
    if (!carouselApi) return;
    setCurrentIndex(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  // Écouter les changements du carousel
  useEffect(() => {
    if (!carouselApi) return;
    
    carouselApi.on("select", onCarouselSelect);
    onCarouselSelect(); // Initialiser l'index
    
    return () => {
      carouselApi.off("select", onCarouselSelect);
    };
  }, [carouselApi, onCarouselSelect]);

  // Fonction pour aller à un slide spécifique
  const goToSlide = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
    }
  };

  // Fonction pour ajouter une image
  const handleAddMedia = async (file: File) => {
    
    if (bannerPhotos.length >= 5) {
      toast({
        title: "Limite atteinte",
        description: "Maximum 5 images autorisées pour la bannière premium.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const updatedPhotos = await addPremiumBannerPhoto(entreprise.id, file);
      
      // Mettre à jour l'état local immédiatement
      setBannerPhotos(updatedPhotos);
      
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

      // Toast de succès
      toast({
        title: "Image ajoutée",
        description: "L'image a été ajoutée avec succès à votre bannière premium.",
        variant: "success"
      });

      // Ne plus passer automatiquement à l'étape suivante
      // L'utilisateur reste sur l'image qu'il vient d'ajouter
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image:', error);
      
      // Afficher l'erreur spécifique avec un toast
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      toast({
        title: "Erreur d'upload",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour remplacer une image existante
  const handleReplaceMedia = async (index: number, file: File) => {
    try {
      setIsUploading(true);
      
      const updatedPhotos = await replacePremiumBannerPhoto(entreprise.id, index, file);
      
      // Mettre à jour l'état local immédiatement
      setBannerPhotos(updatedPhotos);
      
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
      console.error('Erreur lors du remplacement de l\'image:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur de remplacement",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour supprimer une image avec réorganisation
  const handleRemoveImage = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le clic sur l'image
    
    if (!canEdit || !bannerPhotos[index]) return;

    try {
      setIsUploading(true);
      
      const updatedPhotos = await removePremiumBannerPhoto(entreprise.id, index);
      
      // Mettre à jour l'état local immédiatement
      setBannerPhotos(updatedPhotos);
      
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

      // Si on supprime l'image actuelle et qu'on est au-delà du nombre de slots disponibles
      const newAvailableSlots = Math.min(updatedPhotos.length + 1, maxSteps);
      if (currentIndex >= newAvailableSlots) {
        goToSlide(Math.max(0, newAvailableSlots - 1));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur de suppression",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Fonction pour déclencher l'input file
  const triggerFileInput = (replaceIndex?: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (replaceIndex !== undefined) {
          handleReplaceMedia(replaceIndex, file);
        } else {
          handleAddMedia(file);
        }
      }
    };
    input.click();
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      {/* Carousel avec 5 slides */}
      <Carousel 
        className="w-full h-full"
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className="h-full">
          {allSlots.map((media, index) => (
            <CarouselItem key={index} className="relative w-full h-full">
              <div className="relative w-full h-96 overflow-hidden rounded-lg bg-gradient-to-r from-gray-100 to-gray-200">
                {media ? (
                  // Slide avec média existant
                  <div 
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => triggerFileInput(index)}
                  >
                    <img
                      src={media}
                      alt={`${entreprise.nom} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center center' }}
                    />
                    
                    {/* Overlay avec effet hover */}
                    {canEdit && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 ease-out flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-white/90 rounded-full p-3 transform scale-90 group-hover:scale-100">
                          <Camera className="h-6 w-6 text-gray-700" />
                        </div>
                      </div>
                    )}
                    
                    {/* Croix de suppression */}
                    {canEdit && (
                      <button
                        onClick={(e) => handleRemoveImage(index, e)}
                        className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10 hover:scale-110 shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  // Slide vide avec icône d'ajout (seulement si on peut encore ajouter des images)
                  index === bannerPhotos.length && bannerPhotos.length < maxSteps ? (
                    <div 
                      className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-white/90 transition-all duration-300 ease-out"
                      onClick={() => triggerFileInput()}
                    >
                      <div className="text-center">
                        <div className="bg-gray-200 rounded-full p-4 mx-auto w-fit">
                          <Camera className="h-8 w-8 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Slide non accessible ou maximum atteint
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                          <span className="text-gray-400 text-2xl font-light">•</span>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Indicateur d'étape */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {index + 1} / {maxSteps}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Flèches de navigation du carousel */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 z-10" />
      </Carousel>

      {/* Dots de navigation en bas */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {Array.from({ length: availableSlots }, (_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToSlide(index)}
              disabled={index > bannerPhotos.length}
            />
          ))}
        </div>
      </div>

      {/* Indicateur de chargement global */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
          <div className="bg-white rounded-xl p-6 text-center shadow-xl transform scale-100 animate-in fade-in duration-300">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600 font-medium">
              Ajout en cours...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
