"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function WhyPortailHabitat() {
  // Fonction pour scroller vers le formulaire en haut
  const scrollToForm = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenu textuel à gauche */}
          <div className="space-y-6">
            {/* Titre principal */}
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Pourquoi choisir Portail Habitat pour vos travaux ?
            </h2>
            
            {/* Sous-titre */}
            <h3 className="text-xl sm:text-2xl text-gray-600 font-medium leading-relaxed">
              La solution complète pour vos projets de rénovation
            </h3>
            
            {/* Contenu textuel enrichi */}
            <div className="space-y-8">
              {/* Section 1 */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</span>
                  Des estimations précises powered by IA
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Notre intelligence artificielle analyse plus de 500 000 données du marché pour vous fournir 
                  des estimations ultra-précises. Nous prenons en compte votre localisation, la complexité 
                  de vos travaux et les prix régionaux pour une fourchette fiable à 95%.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">2</span>
                  Un réseau d'artisans triés sur le volet
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Chaque artisan est rigoureusement sélectionné : qualifications vérifiées, assurances à jour, 
                  avis clients authentiques. Nous travaillons avec les 10% meilleurs artisans de chaque région 
                  pour garantir la réussite de votre projet.
                </p>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <span className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">3</span>
                  Un processus simplifié et transparent
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  En quelques clics, obtenez une estimation détaillée et découvrez les artisans disponibles 
                  près de chez vous. Notre plateforme vous accompagne de A à Z, de l'estimation initiale 
                  jusqu'à la réception de vos travaux.
                </p>
              </div>
            </div>
            
            {/* Bouton avec barre verticale */}
            <div className="flex items-center space-x-4 pt-4">
              {/* Barre verticale fine */}
              <div className="w-1 h-16 bg-orange-500"></div>
              
              {/* Bouton et sous-texte */}
              <div className="space-y-2">
                <Button 
                  onClick={scrollToForm}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                >
                  Commencer mon estimation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-sm text-gray-500">
                  Gratuit et sans engagement
                </p>
              </div>
            </div>
          </div>
          
          {/* Image à droite */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/photos/simulateur-devis/WhyPortailHabitat/artisan.jpg"
                alt="Artisan professionnel Portail Habitat"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay léger pour améliorer la lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Badge de confiance */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">+60 000</p>
                  <p className="text-sm text-gray-600">Estimations par mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
