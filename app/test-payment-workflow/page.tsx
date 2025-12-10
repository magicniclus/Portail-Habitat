"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  CreditCard,
  AlertCircle,
  Clock,
  Zap,
  Database
} from "lucide-react";

export default function TestPaymentWorkflowPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Workflow Paiement Marketplace
          </h1>
          <p className="text-gray-600">
            Vérification du workflow complet : Paiement → Confirmation → Accès aux données
          </p>
        </div>

        {/* Problème résolu */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Problème "Artisan non autorisé" résolu
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Cause :</strong> L'achat n'était pas encore confirmé dans Firestore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Solution :</strong> Confirmation automatique après paiement Stripe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Sécurité :</strong> Système de retry sur la page de succès</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow corrigé */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Nouveau workflow de paiement
                </h3>
                <div className="text-blue-800 text-sm space-y-3">
                  <div className="space-y-2">
                    <p><strong>1. Paiement Stripe :</strong></p>
                    <div className="ml-4 space-y-1">
                      <p>• Utilisateur remplit formulaire + CGV</p>
                      <p>• API create-marketplace-payment → PaymentIntent</p>
                      <p>• Stripe confirme le paiement</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p><strong>2. Confirmation automatique :</strong></p>
                    <div className="ml-4 space-y-1">
                      <p>• API confirm-marketplace-payment appelée</p>
                      <p>• recordLeadPurchase() met à jour Firestore</p>
                      <p>• Ajout dans marketplacePurchases[]</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p><strong>3. Redirection sécurisée :</strong></p>
                    <div className="ml-4 space-y-1">
                      <p>• Redirection vers page de succès</p>
                      <p>• Système de retry si achat pas encore visible</p>
                      <p>• Accès aux coordonnées client</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* APIs créées/modifiées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900">API Paiement</h3>
              </div>
              <div className="text-purple-800 text-sm space-y-2">
                <p><strong>/api/create-marketplace-payment</strong></p>
                <div className="ml-2 space-y-1">
                  <p>• Vérifie disponibilité du lead</p>
                  <p>• Crée PaymentIntent Stripe</p>
                  <p>• Retourne clientSecret</p>
                </div>
                
                <p className="mt-3"><strong>Paramètres requis :</strong></p>
                <div className="ml-2 space-y-1 text-purple-700">
                  <p>• leadId, artisanId</p>
                  <p>• artisanName, artisanEmail</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-6 w-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">API Confirmation</h3>
              </div>
              <div className="text-orange-800 text-sm space-y-2">
                <p><strong>/api/confirm-marketplace-payment</strong></p>
                <div className="ml-2 space-y-1">
                  <p>• Vérifie paiement Stripe réussi</p>
                  <p>• Enregistre achat dans Firestore</p>
                  <p>• Met à jour statistiques</p>
                </div>
                
                <p className="mt-3"><strong>Paramètres requis :</strong></p>
                <div className="ml-2 space-y-1 text-orange-700">
                  <p>• paymentIntentId</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Système de retry */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Système de retry intelligent
                </h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p><strong>Page de succès améliorée :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Si "Artisan non autorisé" → Retry automatique</p>
                    <p>• Maximum 3 tentatives avec délai de 2 secondes</p>
                    <p>• Logs console pour debug</p>
                    <p>• Gestion gracieuse des erreurs</p>
                  </div>
                  
                  <div className="bg-white border border-yellow-200 rounded p-3 mt-3">
                    <p className="text-xs font-mono">
                      console.log("Tentative 1/3 - Attente de la confirmation de l'achat...")
                    </p>
                  </div>
                </div>
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
                <h4 className="font-medium text-gray-900">Workflow complet :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Aller sur /buy-lead/[leadId]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Remplir formulaire Stripe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Cocher CGV et payer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Vérifier redirection succès</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Vérifications :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Pas d'erreur "non autorisé"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Coordonnées client visibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Achat enregistré dans Firestore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 w-4 text-green-500" />
                    <span>Statistiques mises à jour</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild>
                <a href="/test-stripe-elements">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Tester Stripe Elements
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/dashboard/marketplace">
                  Aller à la bourse
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cartes de test */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Cartes de test Stripe
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <div className="bg-white border rounded p-3 font-mono text-xs space-y-1">
                    <p><strong>Visa :</strong> 4242 4242 4242 4242</p>
                    <p><strong>Mastercard :</strong> 5555 5555 5555 4444</p>
                    <p><strong>Expiration :</strong> 12/25 (ou toute date future)</p>
                    <p><strong>CVV :</strong> 123 (ou tout 3 chiffres)</p>
                  </div>
                  
                  <p className="mt-2"><strong>Configuration requise :</strong></p>
                  <div className="ml-4 text-gray-700">
                    <p>• NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans .env.local</p>
                    <p>• STRIPE_SECRET_KEY dans .env.local</p>
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
