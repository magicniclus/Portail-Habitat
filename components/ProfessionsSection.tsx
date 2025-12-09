"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Paintbrush, Hammer, Drill, Flame, Home, Pickaxe, MoreHorizontal } from "lucide-react";

export default function ProfessionsSection() {
  const scrollToForm = () => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Layout inversé : cards à gauche, texte à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Cards métiers à gauche */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {professions.map((profession, index) => {
              const IconComponent = profession.icon;
              return (
                <Card key={index} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
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
              <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-bold text-sm mb-6">
                VOTRE MÉTIER
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Nous accompagnons tous les professionnels du bâtiment
              </h3>
              <p className="text-xl text-gray-600 mb-8">
                Que vous soyez plombier, électricien, peintre ou dans tout autre métier du BTP, 
                notre plateforme est conçue pour vous aider à développer votre activité.
              </p>
            </div>

            {/* Liste des avantages par métier */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Demandes ciblées par spécialité
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Recevez uniquement les projets qui correspondent à votre expertise
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Tarifs adaptés à votre secteur
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Des prix d'abonnement ajustés selon la demande de votre métier
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Outils métier spécialisés
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Modèles de devis, planning et outils adaptés à votre profession
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Réseau professionnel
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Connectez-vous avec d'autres artisans pour des projets collaboratifs
                  </p>
                </div>
              </div>
            </div>

            {/* Statistiques par métier */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-4">
                Demandes moyennes par mois et par métier
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plomberie</span>
                  <span className="font-semibold text-gray-900">8-12 demandes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Électricité</span>
                  <span className="font-semibold text-gray-900">6-10 demandes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peinture</span>
                  <span className="font-semibold text-gray-900">5-8 demandes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chauffage</span>
                  <span className="font-semibold text-gray-900">4-7 demandes</span>
                </div>
              </div>
            </div>

            {/* CTA section avec trait vert */}
            <div className="text-left mt-8 flex items-stretch gap-4">
              {/* Barre verticale verte */}
              <div className="w-1 bg-orange-600 rounded-full flex-shrink-0"></div>
              
              {/* Contenu */}
              <div className="flex-1">
                <p className="text-gray-600 mb-6">
                  Développez votre activité dès aujourd'hui, quel que soit votre métier !
                </p>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-orange-600 hover:bg-orange-700"
                  onClick={scrollToForm}
                >
                  Je m'inscris
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
