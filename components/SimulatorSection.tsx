"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Brain, Calculator, Clock } from "lucide-react";
import Link from "next/link";

export default function SimulatorSection() {
  const advantages = [
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Notre IA analyse vos données pour un calcul précis et personnalisé"
    },
    {
      icon: Clock,
      title: "Résultat instantané",
      description: "Obtenez votre estimation en quelques secondes seulement"
    },
    {
      icon: Calculator,
      title: "Calcul détaillé",
      description: "Estimation complète avec détail des coûts par poste de travail"
    },
    {
      icon: CheckCircle,
      title: "100% gratuit",
      description: "Aucun frais, aucun engagement, juste une estimation fiable"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Contenu à gauche */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-left">
              Notre simulateur de devis
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 text-left">
              Découvrez notre simulateur intelligent qui utilise l'intelligence artificielle 
              pour calculer le coût de vos travaux en temps réel. Rentrez vos données, 
              notre IA s'occupe du reste.
            </p>

            {/* Liste des avantages */}
            <div className="space-y-6 mb-8">
              {advantages.map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600">
                        {advantage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA section avec trait orange */}
            <div className="flex items-stretch gap-4 mt-8">
              {/* Barre verticale orange */}
              <div className="w-1 bg-orange-600 rounded-full flex-shrink-0"></div>
              
              {/* Contenu */}
              <div className="flex-1">
                <p className="text-gray-600 mb-4">
                  Prêt à estimer vos travaux ?
                </p>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                >
                  <Link href="/simulateur-devis">
                    Essayer le simulateur IA
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Vidéo à droite */}
          <div>
            <Card className="overflow-hidden shadow-xl">
              <div className="relative aspect-video">
                {/* Placeholder pour la vidéo YouTube */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Simulateur de devis IA - Démonstration"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
            
            {/* Texte sous la vidéo */}
            <p className="text-sm text-gray-500 mt-4 text-center">
              Découvrez comment fonctionne notre simulateur IA en 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
