"use client";

import { TrendingUp, Calculator, Euro, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RevenueSection() {
  const revenueData = [
    {
      metier: "Plombier",
      demandes: "8 à 12",
      panier: "250€ – 800€",
      potentiel: "2 000€ à 6 000€"
    },
    {
      metier: "Électricien", 
      demandes: "6 à 10",
      panier: "150€ – 600€",
      potentiel: "1 000€ à 4 000€"
    },
    {
      metier: "Peintre",
      demandes: "5 à 8", 
      panier: "800€ – 2 500€",
      potentiel: "4 000€ à 12 000€"
    },
    {
      metier: "Menuisier",
      demandes: "4 à 7",
      panier: "600€ – 3 000€", 
      potentiel: "3 000€ à 10 000€"
    },
    {
      metier: "Chauffage",
      demandes: "4 à 6",
      panier: "1 500€ – 8 000€",
      potentiel: "6 000€ à 20 000€"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Contenu gauche */}
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                POTENTIEL DE REVENUS
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Votre potentiel de revenus dans votre secteur
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Chaque artisan inscrit sur Portail Habitat reçoit entre <strong>4 et 12 demandes par mois</strong>, 
                selon la spécialité et la zone. Voici ce que cela représente pour vous :
              </p>
            </div>

            {/* Tableau des revenus */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Métier
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Demandes/mois
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Panier moyen
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Potentiel mensuel
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {revenueData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row.metier}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {row.demandes}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {row.panier}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {row.potentiel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-700 mb-8">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-lg">
                <strong>Chez nous, un seul client signé peut transformer votre activité durablement.</strong>
              </span>
            </div>

            {/* CTA section avec trait vert */}
            <div className="text-left flex items-stretch gap-4">
              {/* Barre verticale verte */}
              <div className="w-1 bg-green-600 rounded-full flex-shrink-0"></div>
              
              {/* Contenu */}
              <div className="flex-1">
                <p className="text-gray-600 mb-6">
                  Transformez votre activité et multipliez vos revenus dès maintenant !
                </p>
                <Button 
                  className="w-full sm:w-auto text-lg py-3 px-8 font-semibold"
                  style={{backgroundColor: '#16a34a'}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                  onClick={() => {
                    const formulaire = document.querySelector('form');
                    if (formulaire) {
                      formulaire.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                >
                  Commencer maintenant
                </Button>
              </div>
            </div>
          </div>

          {/* Encart droite */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-100" />
                  <h3 className="text-2xl font-bold mb-2">
                    Rentabilité immédiate
                  </h3>
                  <p className="text-blue-100">
                    Un seul client peut transformer votre activité
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <Euro className="w-8 h-8 mx-auto mb-2 text-blue-100" />
                      <span className="text-sm text-blue-100">Chiffre d'affaires par client</span>
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold">600€ à 2 000€</span>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <h4 className="font-semibold mb-3">Exemple concret :</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-100">• 1 rénovation de salle de bain = <span className="font-bold text-white">1 500€</span></p>
                      <p className="text-blue-100">• 1 installation électrique = <span className="font-bold text-white">800€</span></p>
                      <p className="text-blue-100">• 1 projet de peinture = <span className="font-bold text-white">1 200€</span></p>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Rentabilité dès le premier contrat signé
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
