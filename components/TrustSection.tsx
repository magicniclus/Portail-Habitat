"use client";

import { Star } from "lucide-react";
import Image from "next/image";

export default function TrustSection() {
  const platforms = [
    {
      name: "Trustpilot",
      rating: 5.0,
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
      rating: 5.0,
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
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout principal : texte à gauche, cards à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Contenu gauche */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nos clients nous font confiance
            </h2>
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-6xl font-bold text-gray-900">4,8</span>
              <span className="text-2xl text-gray-600">/5</span>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Notre moyenne basée sur plus de <span className="font-bold">1 000 avis clients</span>
            </p>
            <p className="text-gray-600">
              Rejoignez des milliers d'artisans satisfaits qui développent leur activité 
              grâce à notre plateforme de mise en relation avec des particuliers.
            </p>
          </div>

          {/* Cards plateformes à droite */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4">
                  {/* Logo de la plateforme */}
                  <div className="w-20 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Image
                      src={platform.logo}
                      alt={`Logo ${platform.name}`}
                      width={80}
                      height={48}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    {renderStars(platform.rating, platform.color)}
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {platform.rating}
                    </span>
                    <span className="text-gray-600">/5</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {platform.name === "Trustpilot" && "850 avis"}
                  {platform.name === "Google" && "1 200 avis"}
                  {platform.name === "Sitejabber" && "450 avis"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
