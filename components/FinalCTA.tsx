"use client";

import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  const scrollToForm = () => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          PRÊT À VOUS LANCER ?
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Créez votre espace.
        </p>
        
        <Button 
          size="lg" 
          className="px-12 py-4 text-lg font-semibold md:flex hidden mx-auto"
          style={{backgroundColor: '#16a34a'}} 
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'} 
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          onClick={scrollToForm}
        >
          Commencer maintenant
        </Button>
        <Button 
          size="lg" 
          className="px-12 py-4 text-lg font-semibold md:hidden flex mx-auto"
          style={{backgroundColor: '#16a34a'}} 
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'} 
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
          onClick={scrollToForm}
        >
          Commencer 
        </Button>
        
        <p className="text-sm text-gray-400 mt-4">
          +3200 artisans • Une demande garantie chaque mois
        </p>
      </div>
    </section>
  );
}
