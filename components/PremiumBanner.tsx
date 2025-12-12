"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, Building } from "lucide-react";

interface PremiumBannerProps {
  bannerPhotos: string[];
  bannerVideo?: string;
  companyName: string;
  className?: string;
}

export default function PremiumBanner({ 
  bannerPhotos, 
  bannerVideo, 
  companyName, 
  className = "" 
}: PremiumBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  // Combiner vidéo et photos si vidéo existe
  const allMedia = bannerVideo ? [bannerVideo, ...bannerPhotos] : bannerPhotos;

  const handleImageLoad = (url: string) => {
    setLoadingStates(prev => ({ ...prev, [url]: false }));
  };

  const handleImageError = (url: string) => {
    setLoadingStates(prev => ({ ...prev, [url]: false }));
  };

  // Initialiser l'état de chargement pour chaque média
  const initializeLoading = (url: string) => {
    if (!(url in loadingStates)) {
      setLoadingStates(prev => ({ ...prev, [url]: true }));
    }
  };

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

  if (!allMedia || allMedia.length === 0) {
    return (
      <div className={`relative w-full bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden rounded-lg ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Aucune photo de bannière</p>
          </div>
        </div>
      </div>
    );
  }

  // Si une seule image/vidéo, pas besoin de carousel
  if (allMedia.length === 1) {
    const media = allMedia[0];
    const isVideo = media.includes('banner_video') || media.endsWith('.mp4');
    initializeLoading(media);

    return (
      <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
        <div className="relative w-full h-96 overflow-hidden">
          {/* Skeleton pendant le chargement */}
          {loadingStates[media] && (
            <Skeleton className="w-full h-full" />
          )}

          {/* Média unique */}
          {isVideo ? (
            <video
              src={media}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              onLoadStart={() => setLoadingStates(prev => ({ ...prev, [media]: false }))}
              style={{ 
                display: loadingStates[media] ? 'none' : 'block',
                objectPosition: 'center center'
              }}
            />
          ) : (
            <img
              src={media}
              alt={`${companyName} - Image premium`}
              className="w-full h-full object-cover"
              onLoad={() => setLoadingStates(prev => ({ ...prev, [media]: false }))}
              onError={() => setLoadingStates(prev => ({ ...prev, [media]: false }))}
              style={{ 
                display: loadingStates[media] ? 'none' : 'block',
                objectPosition: 'center center'
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // Plusieurs médias : utiliser le carousel
  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      {/* Indicateur de position */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {allMedia.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      <Carousel 
        className="w-full h-full"
        setApi={setCarouselApi}
      >
        <CarouselContent className="h-full">
          {allMedia.map((media, index) => {
            const isVideo = media.includes('banner_video') || media.endsWith('.mp4');
            initializeLoading(media);

            return (
              <CarouselItem key={index} className="relative w-full h-full">
                <div className="relative w-full h-96 overflow-hidden">
                  {/* Skeleton pendant le chargement */}
                  {loadingStates[media] && (
                    <Skeleton className="w-full h-full" />
                  )}

                  {/* Contenu du slide */}
                  {isVideo ? (
                    <video
                      src={media}
                      className="w-full h-full object-cover"
                      autoPlay={currentIndex === index}
                      muted
                      loop
                      onLoadStart={() => setLoadingStates(prev => ({ ...prev, [media]: false }))}
                      style={{ 
                        display: loadingStates[media] ? 'none' : 'block',
                        objectPosition: 'center center'
                      }}
                    />
                  ) : (
                    <img
                      src={media}
                      alt={`${companyName} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onLoad={() => setLoadingStates(prev => ({ ...prev, [media]: false }))}
                      onError={() => setLoadingStates(prev => ({ ...prev, [media]: false }))}
                      style={{ 
                        display: loadingStates[media] ? 'none' : 'block',
                        objectPosition: 'center center'
                      }}
                    />
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Boutons de navigation */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 z-10" />
      </Carousel>
    </div>
  );
}
