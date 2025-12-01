"use client";

import { Star, MapPin, Camera, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtisanPageFeatures() {
  const scrollToForm = () => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Star,
      title: "Système de notation",
      description: "Collectez et affichez les avis clients pour renforcer votre crédibilité"
    },
    {
      icon: MapPin,
      title: "Visibilité par secteur",
      description: "Apparaissez en priorité dans votre zone d'intervention géographique"
    },
    {
      icon: Camera,
      title: "Portfolio de chantiers",
      description: "Présentez vos réalisations avec photos avant/après"
    },
    {
      icon: TrendingUp,
      title: "4 à 6 demandes/mois",
      description: "En moyenne, nos artisans reçoivent entre 4 et 6 demandes qualifiées"
    },
    {
      icon: Users,
      title: "Profil personnalisable",
      description: "Mettez en avant vos spécialités, certifications et expérience"
    },
    {
      icon: Award,
      title: "Badge de qualité",
      description: "Obtenez des certifications qui rassurent vos futurs clients"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          
          {/* Contenu gauche */}
          <div>
            <div className="mb-8">
              {/* Badge "SOYEZ VISIBLE" aligné à gauche */}
              <div className="inline-block bg-blue-600/20 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm mb-7">
                SOYEZ VISIBLE
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Intégré le plus grand annuaire d'artisan
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Une vitrine digitale complète pour développer votre activité et rassurer vos clients
              </p>
              <div className="w-20 h-1 bg-green-600 rounded"></div>
            </div>

            {/* Grille des fonctionnalités */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton CTA */}
            <div className="mt-8">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold"
                style={{backgroundColor: '#16a34a'}} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                onClick={scrollToForm}
              >
                Je m'inscris
              </Button>
            </div>
          </div>

          {/* Vidéo démo à droite */}
          <div className="xl:pl-8">
            <div className="relative">
              <video 
                className="w-full h-96 object-cover rounded-xl shadow-lg"
                autoPlay 
                muted 
                loop
                playsInline
                preload="auto"
                controls={false}
                poster="/images/video-placeholder.jpg"
              >
                <source src="/video/ecran.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
              {/* Overlay avec titre */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                <h3 className="text-white font-semibold text-lg mb-1">
                  Aperçu de votre espace artisan
                </h3>
                <p className="text-gray-300 text-sm">
                  Interface intuitive et professionnelle
                </p>
              </div>

              {/* Badge "DEMO" */}
              <div className="absolute top-4 right-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  DÉMO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
