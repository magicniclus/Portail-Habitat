"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Shield, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PolitiqueAvisPage() {
  return (
    <div className="bg-gray-50">
      <Header />
      
      <main className="min-h-screen container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Politique des Avis Client
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chez Portail Habitat, nous valorisons la transparence et l'authenticité des avis clients. 
              Cette politique garantit la fiabilité de notre plateforme.
            </p>
          </div>

          {/* Principes généraux */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Nos Principes Fondamentaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Les avis publiés sur Portail Habitat constituent un contenu utilisateur précieux qui aide 
                notre communauté à prendre des décisions éclairées. En publiant un avis, vous contribuez 
                à la transparence du secteur de l'artisanat et de la rénovation.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Authenticité</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Transparence</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Communauté</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditions d'éligibilité */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conditions d'Éligibilité pour Publier un Avis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                Pour maintenir la qualité et l'authenticité de notre plateforme, vous devez respecter 
                les conditions suivantes lors de la publication d'un avis :
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Indépendance et Objectivité</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Vous n'êtes ni employé, dirigeant, associé ou membre de l'entreprise évaluée</li>
                    <li>• Vous n'avez aucun lien professionnel avec un concurrent de l'artisan</li>
                    <li>• Vous n'avez aucun lien familial (sang, adoption, mariage) avec le professionnel</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2. Expérience Authentique</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Votre avis se base sur une expérience réelle en tant que client</li>
                    <li>• Vous avez effectivement bénéficié des services de l'artisan</li>
                    <li>• L'évaluation porte sur un projet concret et terminé</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">3. Exactitude et Honnêteté</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Votre témoignage est véridique, précis et complet</li>
                    <li>• Les faits rapportés correspondent à la réalité de votre expérience</li>
                    <li>• Vous ne déformez pas les circonstances du projet</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenu interdit */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Contenu Interdit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Les avis ne doivent pas contenir de contenu inapproprié. Sont notamment interdits :
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Badge variant="destructive" className="mb-2">Contenu Offensant</Badge>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Propos diffamatoires ou calomnieux</li>
                    <li>• Contenu menaçant ou intimidant</li>
                    <li>• Langage haineux ou discriminatoire</li>
                    <li>• Atteinte à la vie privée</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Badge variant="destructive" className="mb-2">Contenu Commercial</Badge>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Promotion d'autres entreprises</li>
                    <li>• Liens externes ou publicité</li>
                    <li>• Références à des concurrents</li>
                    <li>• Sollicitation commerciale</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transparence financière */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Transparence et Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Déclaration Obligatoire</h3>
                <p className="text-gray-700">
                  Si vous avez reçu une compensation financière, un avantage ou toute forme d'incitation 
                  pour rédiger cet avis, vous devez l'indiquer clairement et visiblement dans votre commentaire, 
                  quelle que soit la valeur de cette compensation.
                </p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Pratiques Interdites</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Utiliser les avis comme moyen de chantage ou d'extorsion</li>
                  <li>• Publier de faux avis pour votre propre entreprise</li>
                  <li>• Créer plusieurs comptes pour multiplier les avis</li>
                  <li>• Faire rédiger des avis par des tiers</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Règles spécifiques */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Règles Spécifiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Un avis par projet</h4>
                    <p className="text-gray-600 text-sm">
                      Une seule personne par foyer ou entreprise peut publier un avis pour un projet donné.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Projet spécifique</h4>
                    <p className="text-gray-600 text-sm">
                      L'avis doit porter exclusivement sur le professionnel évalué et le projet réalisé.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Contenu original</h4>
                    <p className="text-gray-600 text-sm">
                      Votre avis ne doit faire référence à aucun autre commentaire ou avis existant.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modération */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Modération et Contrôle Qualité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Portail Habitat se réserve le droit de modérer, modifier ou supprimer tout avis qui ne respecte 
                pas cette politique. Nous nous engageons à maintenir un environnement de confiance pour tous nos utilisateurs.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Notre Engagement</h3>
                <p className="text-gray-700">
                  Nous examinons régulièrement les avis publiés pour garantir leur conformité avec nos standards 
                  de qualité et d'authenticité. Les avis suspects font l'objet d'une vérification approfondie.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer de la politique */}
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">
                En publiant un avis sur Portail Habitat, vous acceptez de respecter cette politique dans son intégralité.
              </p>
              <p className="text-sm text-gray-500">
                Dernière mise à jour : Décembre 2024
              </p>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
