"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calculator, UserCheck, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Collecte de vos données",
      description: "Nous récupérons toutes les informations sur votre projet : type de travaux, surface, état existant, localisation et vos préférences.",
      icon: FileText
    },
    {
      number: "02", 
      title: "Calcul intelligent du montant",
      description: "Notre IA analyse votre projet avec notre base de données de prix du marché pour estimer le montant moyen de vos travaux.",
      icon: Calculator
    },
    {
      number: "03",
      title: "Sélection d'un artisan",
      description: "Vous choisissez parmi nos artisans partenaires qualifiés près de chez vous pour concrétiser votre projet.",
      icon: UserCheck
    }
  ];

  // Fonction pour scroller vers le formulaire en haut
  const scrollToForm = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comment fonctionne notre simulateur ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un processus simple et transparent en 3 étapes pour estimer le coût de vos travaux
          </p>
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="relative">
                <Card className="h-full border border-gray-200 hover:shadow-lg transition-shadow duration-300 bg-white">
                  <CardContent className="p-6">
                    {/* Numéro d'étape */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold text-lg mb-4">
                      {step.number}
                    </div>
                    
                    {/* Icône */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                      <IconComponent className="w-8 h-8 text-orange-600" />
                    </div>
                    
                    {/* Contenu */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Flèche entre les étapes (sauf pour la dernière) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-2 shadow-md">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={scrollToForm}
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Estimer mes travaux
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Gratuit • Sans engagement • Résultat immédiat
          </p>
        </div>
      </div>
    </section>
  );
}
