"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  CreditCard,
  Shield,
  Zap,
  Eye
} from "lucide-react";
import StripePaymentForm from "@/components/StripePaymentForm";
import { useState } from "react";

export default function TestStripeElementsPage() {
  const [acceptCGV, setAcceptCGV] = useState(false);

  const handlePaymentSuccess = () => {
    alert("Paiement réussi ! (Test)");
  };

  const handlePaymentError = (error: string) => {
    alert(`Erreur de paiement : ${error}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Stripe Elements Officiel
          </h1>
          <p className="text-gray-600">
            Vérification de l'intégration des vrais composants Stripe avec icônes de cartes
          </p>
        </div>

        {/* Améliorations Stripe */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Stripe Elements Officiel Intégré
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>CardElement :</strong> Composant officiel Stripe avec validation automatique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Icônes de cartes :</strong> Détection automatique Visa, Mastercard, Amex</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Validation temps réel :</strong> Format, CVV, expiration vérifiés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Sécurité PCI :</strong> Aucune donnée de carte ne transite par notre serveur</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Détection Automatique</h3>
              </div>
              <div className="text-blue-800 text-sm space-y-1">
                <p>• Icônes de cartes dynamiques</p>
                <p>• Validation du format en temps réel</p>
                <p>• Messages d'erreur contextuels</p>
                <p>• Support international</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Sécurité PCI</h3>
              </div>
              <div className="text-purple-800 text-sm space-y-1">
                <p>• Conformité PCI DSS</p>
                <p>• Chiffrement bout en bout</p>
                <p>• Tokenisation sécurisée</p>
                <p>• Pas de stockage local</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Performance</h3>
              </div>
              <div className="text-orange-800 text-sm space-y-1">
                <p>• Chargement optimisé</p>
                <p>• Validation instantanée</p>
                <p>• UX fluide</p>
                <p>• Mobile responsive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test du composant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations */}
          <Card>
            <CardHeader>
              <CardTitle>Projet Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="pb-3 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Type de prestation :</h3>
                  <p className="font-semibold text-sm">Rénovation cuisine complète</p>
                </div>
                
                <div className="pb-3 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Localisation :</h3>
                  <p className="font-semibold text-sm">Paris, 75001</p>
                </div>
                
                <div className="pb-3 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Budget estimé :</h3>
                  <p className="font-semibold text-orange-600 text-sm">15 000€ - 25 000€</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-3">Après l'achat, vous recevrez :</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-green-800">Nom et prénom du client</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-green-800">Numéro de téléphone</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-green-800">Adresse email</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-green-800">Détails complets du projet</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire Stripe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                Paiement Stripe Officiel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* CGV Test */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border mb-6">
                <input
                  type="checkbox"
                  id="cgv-test"
                  checked={acceptCGV}
                  onChange={(e) => setAcceptCGV(e.target.checked)}
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="cgv-test" className="text-sm text-gray-700">
                  J'accepte les{" "}
                  <span className="text-orange-600 underline">Conditions Générales de Vente</span>{" "}
                  et confirme vouloir accéder aux coordonnées de ce client.
                </label>
              </div>

              {/* Composant Stripe */}
              <StripePaymentForm
                amount={35}
                leadId="test-lead-123"
                artisanId="test-artisan-456"
                artisanName="Test Artisan"
                artisanEmail="test@example.com"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                disabled={false}
                acceptCGV={acceptCGV}
                onCGVChange={setAcceptCGV}
              />
            </CardContent>
          </Card>
        </div>

        {/* Instructions de test */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Eye className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Instructions de test
                </h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p><strong>Cartes de test Stripe :</strong></p>
                  <div className="bg-white border border-yellow-200 rounded p-3 font-mono text-xs space-y-1">
                    <p><strong>Visa :</strong> 4242 4242 4242 4242</p>
                    <p><strong>Mastercard :</strong> 5555 5555 5555 4444</p>
                    <p><strong>Amex :</strong> 3782 822463 10005</p>
                    <p><strong>Expiration :</strong> N'importe quelle date future (ex: 12/25)</p>
                    <p><strong>CVV :</strong> N'importe quel 3 chiffres (ex: 123)</p>
                  </div>
                  
                  <div className="mt-3">
                    <p><strong>À observer :</strong></p>
                    <div className="ml-4 space-y-1">
                      <p>• Icônes de cartes qui apparaissent automatiquement</p>
                      <p>• Validation en temps réel du format</p>
                      <p>• Messages d'erreur contextuels</p>
                      <p>• Design Stripe officiel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avantages */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Avantages de Stripe Elements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                  <div>
                    <p className="font-medium mb-1">UX/UI :</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Design professionnel</li>
                      <li>• Icônes de cartes automatiques</li>
                      <li>• Validation temps réel</li>
                      <li>• Messages d'erreur clairs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-1">Sécurité :</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Conformité PCI DSS</li>
                      <li>• Chiffrement bout en bout</li>
                      <li>• Pas de données sensibles côté client</li>
                      <li>• Protection contre la fraude</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
