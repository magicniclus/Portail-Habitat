"use client";

import PremiumBanner from "./PremiumBanner";
import StandardBanner from "./StandardBanner";
import { isPremiumActive } from "@/lib/premium-utils";

interface ArtisanBannerProps {
  entreprise: {
    id: string;
    nom: string;
    banniere?: string;
    premiumFeatures?: any;
  };
  className?: string;
}

export default function ArtisanBanner({ entreprise, className = "" }: ArtisanBannerProps) {
  // Vérifier si l'artisan est premium et a des photos de bannière
  const isArtisanPremium = entreprise.premiumFeatures && 
    isPremiumActive({ id: entreprise.id, premiumFeatures: entreprise.premiumFeatures });
  
  const hasPremiumBanners = isArtisanPremium && 
    entreprise.premiumFeatures?.bannerPhotos && 
    entreprise.premiumFeatures.bannerPhotos.length > 0;

  // Si premium avec des photos de bannière, utiliser PremiumBanner
  if (hasPremiumBanners) {
    return (
      <PremiumBanner
        bannerPhotos={entreprise.premiumFeatures.bannerPhotos}
        bannerVideo={entreprise.premiumFeatures.bannerVideo}
        companyName={entreprise.nom}
        className={className}
      />
    );
  }

  // Sinon, utiliser StandardBanner
  return (
    <StandardBanner
      coverUrl={entreprise.banniere}
      companyName={entreprise.nom}
      className={className}
    />
  );
}
