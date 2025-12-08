"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function SimulateDevisSection() {
  // Fonction pour scroller vers le formulaire en haut
  const scrollToForm = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          {/* Titre */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Vous souhaitez simuler votre devis ?
          </h2>
          
          {/* Bouton */}
          <Button 
            onClick={scrollToForm}
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Simulez mon devis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
