"use client";

import { Star, MapPin, TrendingUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtisanPageFeatures() {
  const scrollToForm = () => {
    const onboardingSection = document.getElementById('onboarding');
    if (onboardingSection) {
      onboardingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: MapPin,
      title: "Demandes clients GRATUITES depuis votre fiche",
      description: "Les particuliers vous contactent directement, sans aucun frais"
    },
    {
      icon: Users,
      title: "Vous êtes libre d'accepter ou refuser chaque demande",
      description: "Vous choisissez uniquement les chantiers qui vous intéressent"
    },
    {
      icon: TrendingUp,
      title: "Visibilité prioritaire par métier et par ville",
      description: "Vous apparaissez en premier dans votre zone"
    },
    {
      icon: Award,
      title: "Sans engagement",
      description: "Aucun contrat, résiliable à tout moment"
    },
    {
      icon: Star,
      title: "Activation immédiate",
      description: "Votre fiche est visible dès l'inscription"
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
                Votre visibilité locale, sans démarchage
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Vous apparaissez dans votre zone auprès de particuliers qui recherchent activement un artisan. Ce sont eux qui vous contactent.
              </p>
              <div className="w-20 h-1 bg-orange-600 rounded"></div>
            </div>

            {/* Grille des fonctionnalités */}
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-orange-600" />
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

            {/* CTA section avec trait vert */}
            <div className="text-left mt-8 flex items-stretch gap-4">
              {/* Barre verticale verte */}
              <div className="w-1 bg-orange-600 rounded-full flex-shrink-0"></div>
              
              {/* Contenu */}
              <div className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-orange-600 hover:bg-orange-700 mb-3"
                  onClick={scrollToForm}
                >
                  <span className="hidden sm:inline">Voir les demandes gratuites dans ma zone</span>
                  <span className="sm:hidden">Voir les demandes</span>
                </Button>
                <p className="text-sm text-gray-500">
                  Les demandes reçues depuis votre fiche sont gratuites
                </p>
              </div>
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
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
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
