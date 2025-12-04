"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Link from "next/link";

export default function PopularServices() {
  const popularServices = [
    {
      title: "Plomberie",
      image: "/popular/plomberie.jpg"
    },
    {
      title: "Électricité",
      image: "/popular/electricite.jpg"
    },
    {
      title: "Peinture",
      image: "/popular/peinture.jpg"
    },
    {
      title: "Carrelage",
      image: "/popular/carrelage.jpg"
    },
    {
      title: "Chauffage",
      image: "/popular/chauffage.jpg"
    },
    {
      title: "Menuiserie",
      image: "/popular/menuiserie.jpg"
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
          {/* 6 services populaires */}
          {popularServices.map((service, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-24 lg:h-32">
                {/* Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
              </div>
              
              {/* Titre aligné à gauche */}
              <div className="p-2 lg:p-3">
                <h3 className="text-xs lg:text-sm font-semibold text-gray-900 text-left">
                  {service.title}
                </h3>
              </div>
            </Card>
          ))}

          {/* Carte spéciale simulation de devis */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-orange-500 to-orange-600">
            <div className="h-24 lg:h-32 flex items-center justify-center">
              <Calculator className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            
            <div className="p-2 lg:p-3 text-center">
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
          </Card>
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
              image: "/inspirations/cuisine.jpg"
            },
            {
              title: "Salle de bain zen",
              image: "/inspirations/salle-bain.jpg"
            },
            {
              title: "Salon cosy",
              image: "/inspirations/salon.jpg"
            },
            {
              title: "Chambre parentale",
              image: "/inspirations/chambre.jpg"
            }
          ].map((inspiration, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 lg:h-56">
                {/* Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${inspiration.image}')` }}
                />
              </div>
              
              {/* Titre aligné à gauche */}
              <div className="p-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 text-left">
                  {inspiration.title}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
