"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  X, 
  MapPin, 
  Calendar
} from "lucide-react";

interface ProjectLightboxProps {
  project: {
    id: string;
    title: string;
    description: string;
    city: string;
    projectType: string;
    photos: string[];
    createdAt: Date;
    likesCount: number;
    commentsCount: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectLightbox({ project, isOpen, onClose }: ProjectLightboxProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselApiRef = useRef<any>(null);
  
  if (!project) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex(0);
    onClose();
  };

  const goToImage = (index: number) => {
    if (carouselApiRef.current) {
      carouselApiRef.current.scrollTo(index);
    }
    setCurrentImageIndex(index);
  };

  // Gérer l'événement Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Empêcher le scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black"
      style={{ 
        width: '100vw', 
        height: '100vh',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed'
      }}
    >
      {/* Titre caché pour l'accessibilité */}
      <div className="sr-only">
        {project.title}
      </div>
    
      {/* Bouton fermer en haut à droite */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 h-10 w-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Zone d'image principale - centrée sur tout l'écran */}
      <div className="absolute inset-0">
        <Carousel className="w-full h-full" setApi={(api) => {
          if (api) {
            carouselApiRef.current = api;
            api.on('select', () => {
              setCurrentImageIndex(api.selectedScrollSnap());
            });
          }
        }}>
          <CarouselContent className="h-full">
            {project.photos.map((photo, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="w-full flex items-center justify-center" style={{ height: '100vh' }}>
                  <img
                    src={photo}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                    style={{
                      maxHeight: '100vh',
                      maxWidth: '100vw',
                      height: 'auto',
                      width: 'auto'
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {project.photos.length > 1 && (
            <>
              <CarouselPrevious className="left-4 z-40 bg-black/50 hover:bg-black/70 border-white/20 text-white hover:text-white" />
              <CarouselNext className="right-4 z-40 bg-black/50 hover:bg-black/70 border-white/20 text-white hover:text-white" />
            </>
          )}
        </Carousel>
      </div>

      {/* Gradient noir en bas avec informations à gauche et miniatures à droite */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          {/* Informations à gauche */}
          <div className="flex-1 text-white space-y-3 max-w-2xl">
            {/* Titre principal */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {project.title}
              </h2>
              {project.projectType && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {project.projectType}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-200 leading-relaxed">
              {project.description}
            </p>

            {/* Métadonnées */}
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              {project.city && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.city}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(project.createdAt)}
              </div>
            </div>
          </div>

          {/* Miniatures à droite sur desktop, en bas sur mobile */}
          {project.photos.length > 1 && (
            <div className="flex flex-col space-y-2 lg:ml-6">
              <div className="flex space-x-2 overflow-x-auto">
                {project.photos.slice(0, 6).map((photo, index) => (
                  <div
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      index === currentImageIndex 
                        ? 'border-white ring-2 ring-white/50' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Miniature ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {project.photos.length > 6 && (
                <div className="text-center text-xs text-gray-300">
                  +{project.photos.length - 6} photos
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
