"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Paintbrush, Hammer, Drill, Flame, Home, Pickaxe, MoreHorizontal } from "lucide-react";

export default function SimulatorProfessionsSection() {
  const scrollToForm = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const professions = [
    {
      icon: Wrench,
      title: "Plomberie",
      color: "#3b82f6"
    },
    {
      icon: Zap,
      title: "Électricité",
      color: "#eab308"
    },
    {
      icon: Paintbrush,
      title: "Peinture",
      color: "#ef4444"
    },
    {
      icon: Hammer,
      title: "Maçonnerie",
      color: "#6b7280"
    },
    {
      icon: Drill,
      title: "Menuiserie",
      color: "#a3a3a3"
    },
    {
      icon: Flame,
      title: "Chauffage",
      color: "#f97316"
    },
    {
      icon: Home,
      title: "Couverture",
      color: "#8b5cf6"
    },
    {
      icon: Pickaxe,
      title: "Terrassement",
      color: "#92400e"
    },
    {
      icon: MoreHorizontal,
      title: "Autre",
      color: "#10b981"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout inversé : cards à gauche, texte à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Cards métiers à gauche */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {professions.map((profession, index) => {
              const IconComponent = profession.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 text-center cursor-pointer"
                  onClick={scrollToForm}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-center mb-2">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${profession.color}20` }}
                      >
                        <IconComponent 
                          size={24} 
                          style={{ color: profession.color }}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {profession.title}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contenu texte à droite */}
          <div>
            <div className="mb-6">
              <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold text-sm mb-6">
                VOTRE PROJET
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Estimez vos travaux selon votre spécialité
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Que ce soit pour la plomberie, l'électricité, la peinture ou tout autre métier du BTP, 
                notre simulateur s'adapte à votre projet pour vous donner une estimation précise.
              </p>
            </div>

            {/* Liste des avantages par métier */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Estimations par spécialité
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Des calculs adaptés aux spécificités de chaque métier du bâtiment
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Prix du marché actualisés
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Tarifs basés sur les données réelles du marché français par région
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Artisans qualifiés disponibles
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Accès direct aux professionnels de votre secteur après estimation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Devis détaillés
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Estimation complète avec détail des matériaux et main d'œuvre
                  </p>
                </div>
              </div>
            </div>

            {/* Statistiques par métier */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-4">
                Fourchettes de prix moyennes par m²
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col items-center text-center">
                  <span className="text-gray-600 mb-1">Peinture</span>
                  <span className="font-semibold text-gray-900">25-45€/m²</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-gray-600 mb-1">Carrelage</span>
                  <span className="font-semibold text-gray-900">40-80€/m²</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-gray-600 mb-1">Parquet</span>
                  <span className="font-semibold text-gray-900">50-120€/m²</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-gray-600 mb-1">Isolation</span>
                  <span className="font-semibold text-gray-900">20-50€/m²</span>
                </div>
              </div>
            </div>

            {/* CTA section avec trait orange */}
            <div className="text-left mt-8 flex items-stretch gap-4">
              {/* Barre verticale orange */}
              <div className="w-1 bg-orange-500 rounded-full flex-shrink-0"></div>
              
              {/* Contenu */}
              <div className="flex-1">
                <p className="text-gray-600 mb-6">
                  Commencez votre estimation dès maintenant, quel que soit votre projet !
                </p>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-orange-600 hover:bg-orange-700"
                  onClick={scrollToForm}
                >
                  Estimer mon projet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
