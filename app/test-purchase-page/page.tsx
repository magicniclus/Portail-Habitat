"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  CreditCard,
  AlertCircle,
  ShoppingCart,
  Eye,
  X
} from "lucide-react";

export default function TestPurchasePagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Page d'Achat Marketplace
          </h1>
          <p className="text-gray-600">
            Vérification des améliorations sur /dashboard/marketplace/purchase/[leadId]
          </p>
        </div>

        {/* Améliorations apportées */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Améliorations apportées ✅
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Stripe Elements :</strong> Composants séparés sur 2 lignes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>CGV obligatoires :</strong> Checkbox avec validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Suppression :</strong> Plus d'affichage "X/Y vendus"</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails des modifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Formulaire Stripe</h3>
              </div>
              <div className="text-blue-800 text-sm space-y-2">
                <p><strong>AVANT :</strong></p>
                <div className="ml-2 space-y-1 text-blue-700">
                  <p>• CardElement tout-en-un</p>
                  <p>• Pas de labels séparés</p>
                  <p>• Interface basique</p>
                </div>
                
                <p className="mt-3"><strong>APRÈS :</strong></p>
                <div className="ml-2 space-y-1 text-blue-700">
                  <p>• CardNumberElement (ligne 1)</p>
                  <p>• CardExpiryElement + CardCvcElement (ligne 2)</p>
                  <p>• Labels explicites pour chaque champ</p>
                  <p>• Interface professionnelle</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">CGV Obligatoires</h3>
              </div>
              <div className="text-orange-800 text-sm space-y-2">
                <p><strong>Fonctionnalités :</strong></p>
                <div className="ml-2 space-y-1 text-orange-700">
                  <p>• Checkbox obligatoire</p>
                  <p>• Texte avec prix dynamique</p>
                  <p>• Bouton désactivé si non coché</p>
                  <p>• Style cohérent (orange)</p>
                </div>
                
                <div className="bg-white border border-orange-200 rounded p-3 mt-3">
                  <p className="text-xs">
                    "J'accepte les CGV et confirme vouloir accéder aux coordonnées 
                    de ce client pour le montant de 35€."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppression affichage ventes */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <X className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  Suppression de l'affichage des ventes
                </h3>
                <div className="text-red-800 text-sm space-y-2">
                  <p><strong>Problème identifié :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• "1/3 artisans ont déjà acheté" affiché sur la page d'achat</p>
                    <p>• Information non pertinente pour l'acheteur</p>
                    <p>• Peut décourager l'achat (effet de rareté négatif)</p>
                  </div>
                  
                  <p className="mt-3"><strong>Solution :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Suppression complète de cette ligne</p>
                    <p>• Focus sur le prix et la valeur du lead</p>
                    <p>• Interface plus propre et ciblée</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure technique */}
        <Card>
          <CardHeader>
            <CardTitle>Structure technique mise à jour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Imports Stripe :</h4>
              <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                <p>import {`{`}</p>
                <p className="ml-4">Elements,</p>
                <p className="ml-4">CardNumberElement,</p>
                <p className="ml-4">CardExpiryElement,</p>
                <p className="ml-4">CardCvcElement,</p>
                <p className="ml-4">useStripe,</p>
                <p className="ml-4">useElements</p>
                <p>{`}`} from "@stripe/react-stripe-js";</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">État CGV :</h4>
              <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                <p>const [acceptCGV, setAcceptCGV] = useState(false);</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Validation :</h4>
              <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                <p>if (!stripe || !elements || !clientSecret || !acceptCGV) {`{`}</p>
                <p className="ml-4">return;</p>
                <p>{`}`}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tests à effectuer */}
        <Card>
          <CardHeader>
            <CardTitle>Tests à effectuer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Interface :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Numéro de carte sur ligne séparée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Expiration + CVV sur même ligne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Labels clairs pour chaque champ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>CGV obligatoires visibles</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Fonctionnalités :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Bouton désactivé si CGV non cochées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Prix dynamique dans le texte CGV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Plus d'affichage "X/Y vendus"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Icônes cartes Stripe automatiques</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild>
                <a href="/dashboard/marketplace">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir la bourse
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/test-stripe-elements">
                  Tester Stripe Elements
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workflow utilisateur */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Workflow utilisateur amélioré
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <div className="space-y-1">
                    <p><strong>1. Arrivée sur la page :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Détails du lead (sans compteur de ventes)</p>
                      <p>• Prix clairement affiché</p>
                      <p>• Formulaire Stripe professionnel</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>2. Saisie paiement :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Numéro de carte avec icône automatique</p>
                      <p>• Expiration et CVV séparés</p>
                      <p>• Validation temps réel</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>3. Validation :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Cocher CGV obligatoire</p>
                      <p>• Bouton "Payer XX€" activé</p>
                      <p>• Confirmation et redirection</p>
                    </div>
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
