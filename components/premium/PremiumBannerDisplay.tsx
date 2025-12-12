"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumBannerDisplayProps {
  photos: string[];
  video?: string;
  className?: string;
  height?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export default function PremiumBannerDisplay({
  photos,
  video,
  className = "",
  height = "h-64 md:h-80",
  autoPlay = true,
  showControls = true
}: PremiumBannerDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Si on a une vidéo, l'afficher en premier
  const hasVideo = !!video;
  const hasPhotos = photos.length > 0;
  const totalItems = (hasVideo ? 1 : 0) + photos.length;

  // Auto-play du carrousel (photos seulement)
  useEffect(() => {
    if (autoPlay && !showVideo && photos.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 5000); // Change toutes les 5 secondes

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoPlay, showVideo, photos.length]);

  // Gestion de la vidéo
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  // Navigation
  const goToPrevious = () => {
    if (showVideo && hasPhotos) {
      setShowVideo(false);
      setCurrentIndex(photos.length - 1);
    } else if (!showVideo && photos.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    } else if (!showVideo && hasVideo) {
      setShowVideo(true);
    }
  };

  const goToNext = () => {
    if (showVideo && hasPhotos) {
      setShowVideo(false);
      setCurrentIndex(0);
    } else if (!showVideo && photos.length > 1) {
      const nextIndex = (currentIndex + 1) % photos.length;
      if (nextIndex === 0 && hasVideo) {
        setShowVideo(true);
      } else {
        setCurrentIndex(nextIndex);
      }
    } else if (!showVideo && hasVideo) {
      setShowVideo(true);
    }
  };

  // Si pas de contenu premium, ne rien afficher
  if (!hasVideo && !hasPhotos) {
    return null;
  }

  return (
    <div className={`relative ${height} ${className}`}>
      {/* Contenu principal */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {showVideo && video ? (
          // Affichage vidéo
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={video}
              className="w-full h-full object-cover"
              muted
              loop
              onEnded={handleVideoEnded}
              onClick={toggleVideo}
            />
            
            {/* Overlay de contrôle vidéo */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white bg-opacity-90 hover:bg-opacity-100"
                onClick={toggleVideo}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Affichage photo
          hasPhotos && (
            <img
              src={photos[currentIndex]}
              alt={`Bannière ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
          )
        )}

        {/* Contrôles de navigation */}
        {showControls && totalItems > 1 && (
          <>
            <Button
              size="sm"
              variant="secondary"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Indicateurs */}
        {showControls && totalItems > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {hasVideo && (
              <button
                className={`w-2 h-2 rounded-full transition-colors ${
                  showVideo ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                onClick={() => setShowVideo(true)}
              />
            )}
            {photos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  !showVideo && currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                onClick={() => {
                  setShowVideo(false);
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Badge vidéo */}
        {showVideo && (
          <div className="absolute top-4 left-4">
            <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
              Vidéo de présentation
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
