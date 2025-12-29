"use client";

import { Star } from "lucide-react";
import Image from "next/image";

export default function TrustSection() {
  const platforms = [
    {
      name: "Trustpilot",
      rating: 4.3,
      logo: "/logo/logo_trustpilot.png",
      color: "text-yellow-400"
    },
    {
      name: "Google",
      rating: 4.5,
      logo: "/logo/logo_google.jpeg",
      color: "text-yellow-400"
    },
    {
      name: "Sitejabber",
      rating: 4.8,
      logo: "/logo/logo_sitejabber.png",
      color: "text-yellow-400"
    }
  ];

  const renderStars = (rating: number, color: string) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center space-x-1">
        {/* Étoiles pleines */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`h-5 w-5 ${color} fill-current`} />
        ))}
        
        {/* Demi-étoile */}
        {hasHalfStar && (
          <div key="half" className="relative">
            <Star className="h-5 w-5 text-gray-300 fill-current" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={`h-5 w-5 ${color} fill-current`} />
            </div>
          </div>
        )}
        
        {/* Étoiles vides */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 fill-current" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title + Subtitle */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Plus de 3 200 artisans nous font déjà confiance
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Ils développent leur activité grâce à des demandes locales qualifiées
          </p>
        </div>

        {/* Note globale + Cards plateformes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Chiffre clé central */}
          <div className="md:col-span-3 text-center mb-4">
            <div className="inline-flex items-baseline space-x-3 mb-2">
              <span className="text-6xl md:text-7xl font-bold text-orange-600">4,8</span>
              <span className="text-2xl md:text-3xl text-gray-600">/5</span>
            </div>
            <p className="text-base md:text-lg text-gray-600 font-medium">
              basé sur <span className="font-bold text-gray-900">+2 000 avis clients</span>
            </p>
          </div>

          {/* Cards plateformes */}
          {platforms.map((platform, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Logo */}
              <div className="w-20 h-12 mx-auto mb-4 flex items-center justify-center">
                <Image
                  src={platform.logo}
                  alt={`Logo ${platform.name}`}
                  width={80}
                  height={48}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Stars */}
              <div className="flex justify-center mb-3">
                {renderStars(platform.rating, platform.color)}
              </div>
              
              {/* Rating */}
              <div className="flex items-center justify-center space-x-1 mb-2">
                <span className="text-2xl font-bold text-orange-600">
                  {platform.rating}
                </span>
                <span className="text-base text-gray-600">/5</span>
              </div>
              
              {/* Nombre d'avis */}
              <div className="text-sm text-gray-500">
                {platform.name === "Trustpilot" && "850 avis"}
                {platform.name === "Google" && "1 200 avis"}
                {platform.name === "Sitejabber" && "450 avis"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
