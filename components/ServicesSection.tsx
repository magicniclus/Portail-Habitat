"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ServicesSection() {
  const services = [
    {
      title: "Estimation de devis en ligne",
      buttonText: "Estimer mon projet",
      buttonLink: "/simulateur-devis",
      backgroundImage: "/services/estimation.jpg"
    },
    {
      title: "Trouver un artisan près de chez moi",
      buttonText: "Trouver un artisan",
      buttonLink: "/trouver-pro",
      backgroundImage: "/services/artisan.jpg"
    },
    {
      title: "Obtenir des conseils d'un professionnel",
      buttonText: "Demander conseil",
      buttonLink: "/conseils",
      backgroundImage: "/services/conseils.jpg"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* En-tête de section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ce que propose Portail Habitat
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos services pour vous accompagner dans tous vos projets de rénovation et construction
          </p>
        </div>

        {/* Grille des cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-80">
              <div className="relative h-full">
                {/* Image de fond */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${service.backgroundImage}')` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                
                {/* Contenu */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  {/* Titre */}
                  <h3 className="text-xl lg:text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                  
                  {/* Bouton en bas */}
                  <Button 
                    asChild 
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                    size="lg"
                  >
                    <Link href={service.buttonLink}>
                      {service.buttonText}
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* CTA section */}
        <div className="text-center mt-12 lg:mt-16">
          <p className="text-gray-600 mb-6">
            Une question ? Besoin d'aide pour votre projet ?
          </p>
          <Button asChild variant="outline" size="lg" className="border-2">
            <Link href="/contact">
              Nous contacter
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
