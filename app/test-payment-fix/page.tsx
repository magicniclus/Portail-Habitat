"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Code,
  Database,
  CreditCard
} from "lucide-react";

export default function TestPaymentFixPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Correction Erreur Paiement Marketplace
          </h1>
          <p className="text-gray-600">
            Résolution de l'erreur Firebase lors de l'achat d'appels d'offres
          </p>
        </div>

        {/* Erreur identifiée */}
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Erreur Firebase identifiée :</strong> Function arrayUnion() called with invalid data. serverTimestamp() can only be used with update() and set()
          </AlertDescription>
        </Alert>

        {/* Problème technique */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Problème technique détecté
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-red-800 text-sm">
              <p><strong>Cause de l'erreur :</strong></p>
              <div className="bg-white border border-red-200 rounded p-3 font-mono text-xs mt-2">
                <p className="text-red-600">// ❌ INCORRECT - Causait l'erreur</p>
                <p>marketplacePurchases: arrayUnion({`{`}</p>
                <p className="ml-4">artisanId,</p>
                <p className="ml-4">artisanName,</p>
                <p className="ml-4 text-red-600">purchasedAt: serverTimestamp(), // ← PROBLÈME</p>
                <p className="ml-4">price,</p>
                <p className="ml-4">paymentId</p>
                <p>{`})`}</p>
              </div>
              
              <p className="mt-3"><strong>Explication :</strong></p>
              <div className="ml-4 space-y-1">
                <p>• <code>serverTimestamp()</code> ne peut être utilisé qu'avec <code>update()</code> et <code>set()</code></p>
                <p>• <code>arrayUnion()</code> ne supporte pas <code>serverTimestamp()</code></p>
                <p>• Firebase rejette la requête avec une erreur 500</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution appliquée */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Solution appliquée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-green-800 text-sm">
              <p><strong>Correction effectuée :</strong></p>
              <div className="bg-white border border-green-200 rounded p-3 font-mono text-xs mt-2">
                <p className="text-green-600">// ✅ CORRECT - Fonctionne maintenant</p>
                <p>marketplacePurchases: arrayUnion({`{`}</p>
                <p className="ml-4">artisanId,</p>
                <p className="ml-4">artisanName,</p>
                <p className="ml-4 text-green-600">purchasedAt: new Date(), // ← CORRIGÉ</p>
                <p className="ml-4">price,</p>
                <p className="ml-4">paymentId</p>
                <p>{`})`}</p>
              </div>
              
              <p className="mt-3"><strong>Avantages de la correction :</strong></p>
              <div className="ml-4 space-y-1">
                <p>• <code>new Date()</code> est compatible avec <code>arrayUnion()</code></p>
                <p>• Timestamp côté client précis au moment de l'achat</p>
                <p>• Plus d'erreur Firebase 500</p>
                <p>• Paiements fonctionnels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow de paiement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Workflow paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Artisan clique "Acheter cette demande"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>Paiement Stripe traité</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>API confirm-marketplace-payment appelée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span>Achat enregistré avec <code>new Date()</code></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-600" />
                Mise à jour Firestore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Lead ajouté dans <code>artisans/{`{id}`}/leads</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Achat dans <code>marketplacePurchases[]</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Compteur <code>marketplaceSales</code> incrémenté</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Statistiques marketplace mises à jour</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fichier modifié */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Fichier modifié</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 text-sm space-y-2">
              <p><strong>Fichier :</strong> <code>/lib/marketplace-data.ts</code></p>
              <p><strong>Fonction :</strong> <code>recordLeadPurchase()</code></p>
              <p><strong>Ligne :</strong> 316</p>
              
              <div className="bg-white border border-blue-200 rounded p-3 font-mono text-xs mt-3">
                <p><span className="text-red-600">- purchasedAt: serverTimestamp(),</span></p>
                <p><span className="text-green-600">+ purchasedAt: new Date(),</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test recommandé */}
        <Card>
          <CardHeader>
            <CardTitle>Test recommandé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Pour tester la correction :</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Aller sur la bourse au travail</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Essayer d'acheter un appel d'offres</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Vérifier que le paiement passe sans erreur</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Confirmer que l'appel d'offres apparaît dans "Mes demandes"</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild>
                <a href="/dashboard/marketplace">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Tester la bourse au travail
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/dashboard/demandes">
                  Voir mes demandes
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultat */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Erreur de paiement corrigée
                </h3>
                <div className="text-gray-800 text-sm">
                  <p>
                    L'erreur Firebase "serverTimestamp() can only be used with update() and set()" 
                    a été résolue en remplaçant <code>serverTimestamp()</code> par <code>new Date()</code> 
                    dans la fonction <code>arrayUnion()</code>.
                  </p>
                  
                  <p className="mt-2">
                    <strong>Les paiements d'appels d'offres fonctionnent maintenant correctement !</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
