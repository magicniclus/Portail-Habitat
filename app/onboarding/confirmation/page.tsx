import { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Mail, Calendar, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Inscription confirmée - Portail Habitat",
  description: "Votre inscription sur Portail Habitat a été confirmée avec succès. Vous allez bientôt recevoir vos premières demandes de travaux.",
  robots: {
    index: false,
    follow: false,
  },
};

function ConfirmationContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Portail Habitat"
              width={150}
              height={60}
              className="h-12 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="shadow-xl">
            <CardContent className="p-8 text-center">
              {/* Icône de succès */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              {/* Titre principal */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Félicitations ! 🎉
              </h1>
              
              <h2 className="text-xl text-gray-700 mb-8">
                Votre inscription sur Portail Habitat est confirmée
              </h2>

              {/* Message de confirmation */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <p className="text-green-800 font-semibold mb-2">
                  Votre abonnement est maintenant actif !
                </p>
                <p className="text-green-700 text-sm">
                  Vous allez commencer à recevoir des demandes de travaux qualifiées 
                  dans les prochaines 24 à 48 heures.
                </p>
              </div>

              {/* Prochaines étapes */}
              <div className="text-left mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prochaines étapes :
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Email de bienvenue</p>
                      <p className="text-sm text-gray-600">
                        Vous recevrez un email avec vos identifiants de connexion dans les prochaines minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Activation de votre profil</p>
                      <p className="text-sm text-gray-600">
                        Votre page artisan sera en ligne sous 24h et optimisée pour le référencement Google
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Appel de bienvenue (optionnel)</p>
                      <p className="text-sm text-gray-600">
                        Notre équipe peut vous appeler pour vous accompagner dans vos premiers pas
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rappel de la garantie */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-blue-800 text-sm">
                  <strong>Rappel :</strong> Si vous ne recevez pas au moins 1 demande qualifiée 
                  ce premier mois, le mois suivant sera offert selon notre garantie.
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-4">
                <Button 
                  asChild
                  className="w-full text-lg py-3 font-semibold bg-green-600 hover:bg-green-700 text-white"
                >
                  <Link href="/dashboard">
                    Accéder à mon tableau de bord
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">
                    Retour à l'accueil
                  </Link>
                </Button>
              </div>

              {/* Support */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-600">
                  Une question ? Contactez-nous au{" "}
                  <a href="tel:0123456789" className="font-semibold text-orange-600 hover:text-orange-700">
                    01 23 45 67 89
                  </a>
                  {" "}ou par email à{" "}
                  <a href="mailto:support@portail-habitat.fr" className="font-semibold text-orange-600 hover:text-orange-700">
                    support@portail-habitat.fr
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            © 2024 Portail Habitat. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
