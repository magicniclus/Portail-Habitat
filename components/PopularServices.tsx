"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Link from "next/link";

export default function PopularServices() {
  const popularServices = [
    {
      title: "Plomberie",
      image: "/photos/accueil/popularServices/plomberie.png"
    },
    {
      title: "Électricité",
      image: "/photos/accueil/popularServices/electricite.png"
    },  
    {
      title: "Peinture",
      image: "/photos/accueil/popularServices/peinture.png"
    },
    {
      title: "Carrelage",
      image: "/photos/accueil/popularServices/carrelage.png"
    },
    {
      title: "Chauffage",
      image: "/photos/accueil/popularServices/chauffage.png"
    },
    {
      title: "Menuiserie",
      image: "/photos/accueil/popularServices/menuiserie.png"
    },
    {
      title: "Couverture",
      image: "/photos/accueil/popularServices/couverture.png"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* En-tête de section */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-left">
            Services les plus demandés
          </h2>
        </div>

        {/* Grille des cartes - 3-4 cartes par ligne */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-24">
          {/* 7 services populaires */}
          {popularServices.map((service, index) => (
            <div key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-white h-36 lg:h-44 flex flex-col">
              <div className="relative flex-1">
                {/* Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
              </div>
              
              {/* Titre aligné à gauche */}
              <div className="p-2 lg:p-3 flex-shrink-0">
                <h3 className="text-xs lg:text-sm font-semibold text-gray-900 text-left">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}

          {/* Carte spéciale simulation de devis */}
          <div className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg h-36 lg:h-44 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <Calculator className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            
            <div className="p-2 lg:p-3 text-center flex-shrink-0">
              <h3 className="text-xs lg:text-sm font-semibold text-white mb-1 lg:mb-2">
                Simulation de devis
              </h3>
              <Button 
                asChild 
                size="sm"
                className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold text-xs"
              >
                <Link href="/simulateur-devis">
                  Simuler
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Section Inspirations */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-left">
            Nos inspirations du moment
          </h2>
        </div>

        {/* Grille des inspirations - 4 cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Cuisine moderne",
              image: "/photos/accueil/PopularServices/cuisine.png"
            },
            {
              title: "Salle de bain zen",
              image: "/photos/accueil/PopularServices/salle-de-bain.png"
            },
            {
              title: "Salon cosy",
              image: "/photos/accueil/PopularServices/salon.png"
            },
            {
              title: "Chambre parentale",
              image: "/photos/accueil/PopularServices/chambre.png"
            }
          ].map((inspiration, index) => (
            <div key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg bg-white h-56 lg:h-64 flex flex-col">
              <div className="relative flex-1">
                {/* Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${inspiration.image}')` }}
                />
              </div>
              
              {/* Titre aligné à gauche */}
              <div className="p-4 flex-shrink-0">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 text-left">
                  {inspiration.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
