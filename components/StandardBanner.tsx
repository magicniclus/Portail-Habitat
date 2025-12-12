"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Building } from "lucide-react";

interface StandardBannerProps {
  coverUrl?: string;
  companyName: string;
  className?: string;
}

export default function StandardBanner({ 
  coverUrl, 
  companyName, 
  className = "" 
}: StandardBannerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Si pas d'image de couverture ou erreur de chargement
  if (!coverUrl || hasError) {
    return (
      <div className={`relative w-full bg-gradient-to-r from-blue-100 to-green-100 overflow-hidden rounded-lg ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Photo de couverture</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
      <div className="relative w-full h-96 overflow-hidden">
        {/* Skeleton pendant le chargement */}
        {isLoading && (
          <Skeleton className="w-full h-full" />
        )}

        {/* Image de couverture */}
        <img
          src={coverUrl}
          alt={`Couverture ${companyName}`}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ 
            display: isLoading ? 'none' : 'block',
            objectPosition: 'center center'
          }}
        />
      </div>
    </div>
  );
}
