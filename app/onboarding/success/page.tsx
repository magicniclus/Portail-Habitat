'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Mail, Globe } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  // Vérifier si c'est un upsell via les paramètres URL
  const searchParams = useSearchParams();
  const hasUpsell = searchParams.get('upsell') === 'true';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header identique à Step 4 */}
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
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          {/* Icône de succès */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          {/* Titre principal */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Bienvenue dans votre espace artisan
          </h1>
          
          {/* Sous-titre */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-12">
            Votre inscription est confirmée. Accédez dès maintenant à votre espace professionnel.
          </p>

          {/* Card avec les prochaines étapes */}
          <Card className="bg-white shadow-lg border-0 max-w-2xl mx-auto mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Prochaines étapes
              </h2>
              
              <div className="space-y-6 text-left">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Consultez vos emails</h3>
                    <p className="text-gray-600">
                      Vous avez reçu vos <strong>identifiants de connexion</strong> par email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Accédez à votre espace</h3>
                    <p className="text-gray-600">Connectez-vous pour gérer votre profil et vos demandes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complétez votre profil</h3>
                    <p className="text-gray-600">Ajoutez vos informations, photos et services</p>
                  </div>
                </div>

                {hasUpsell && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Suivi de votre commande</h3>
                      <p className="text-gray-600">Notre équipe vous recontactera sous 48h (jours ouvrés)</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bouton vers la connexion */}
          <Button asChild>
            <Link href="/connexion-pro">
              Accéder à mon espace pro
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer simple */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 Portail Habitat - Tous droits réservés</p>
            <p className="mt-2">
              Une question ? Contactez-nous à{" "}
              <a href="mailto:support@portail-habitat.fr" className="text-green-600 hover:underline">
                support@portail-habitat.fr
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function OnboardingSuccess() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
