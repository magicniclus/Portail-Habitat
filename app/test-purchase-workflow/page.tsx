"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  FileText,
  Eye,
  Package,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function TestPurchaseWorkflowPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🛒 Test Workflow d'Achat d'Appels d'Offres
          </h1>
          <p className="text-gray-600">
            Vérification du parcours complet : Achat → Succès → Redirection vers onglet "Appels d'offres"
          </p>
        </div>

        {/* Workflow modifié */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Workflow d'achat simplifié ✅
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Page de succès épurée :</strong> Un seul bouton d'action</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Redirection directe :</strong> Vers l'onglet "Appels d'offres"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Navigation cohérente :</strong> URL avec paramètre ?tab=bought</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Expérience fluide :</strong> De l'achat à la gestion en 1 clic</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étapes du workflow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full mx-auto mb-3">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-1">1. Achat</h3>
              <p className="text-xs text-blue-700">Artisan achète un appel d'offres</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-900 mb-1">2. Succès</h3>
              <p className="text-xs text-green-700">Page de confirmation avec coordonnées</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full mx-auto mb-3">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-purple-900 mb-1">3. Voir</h3>
              <p className="text-xs text-purple-700">Clic sur "Voir l'appel d'offres"</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-600 rounded-full mx-auto mb-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-orange-900 mb-1">4. Gestion</h3>
              <p className="text-xs text-orange-700">Onglet "Appels d'offres" ouvert</p>
            </CardContent>
          </Card>
        </div>

        {/* Comparaison avant/après */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">❌ AVANT (supprimé)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-red-800 text-sm">
                <p><strong>Page de succès encombrée :</strong></p>
                <div className="ml-4 space-y-1 text-red-700">
                  <p>• 3 boutons différents</p>
                  <p>• "Retour à la bourse"</p>
                  <p>• "Voir mes projets"</p>
                  <p>• "Appeler maintenant"</p>
                </div>
                
                <p className="mt-3"><strong>Problèmes :</strong></p>
                <div className="ml-4 space-y-1 text-red-700">
                  <p>• Choix multiples confus</p>
                  <p>• Pas de lien direct vers l'appel d'offres</p>
                  <p>• Navigation dispersée</p>
                  <p>• Workflow interrompu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">✅ APRÈS (actuel)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-green-800 text-sm">
                <p><strong>Page de succès épurée :</strong></p>
                <div className="ml-4 space-y-1 text-green-700">
                  <p>• 1 seul bouton d'action</p>
                  <p>• "Voir l'appel d'offres"</p>
                  <p>• Redirection directe</p>
                  <p>• URL : /demandes?tab=bought</p>
                </div>
                
                <p className="mt-3"><strong>Avantages :</strong></p>
                <div className="ml-4 space-y-1 text-green-700">
                  <p>• Action claire et évidente</p>
                  <p>• Workflow fluide et logique</p>
                  <p>• Navigation directe vers la gestion</p>
                  <p>• Expérience utilisateur optimisée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Détails techniques */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Modifications techniques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Page de succès modifiée :</h4>
              
              <div className="bg-white border border-blue-200 rounded p-3 font-mono text-sm">
                <p className="text-blue-600">// SUPPRIMÉ : 3 boutons</p>
                <p className="line-through text-red-600">- Retour à la bourse</p>
                <p className="line-through text-red-600">- Voir mes projets</p>
                <p className="line-through text-red-600">- Appeler maintenant</p>
                
                <p className="text-blue-600 mt-3">// AJOUTÉ : 1 bouton unique</p>
                <p className="text-green-600">+ Voir l'appel d'offres</p>
                <p className="text-green-600">+ href="/dashboard/demandes?tab=bought"</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Redirection intelligente :</h4>
              
              <div className="bg-white border border-blue-200 rounded p-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">URL</Badge>
                    <span>/dashboard/demandes?tab=bought</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Résultat</Badge>
                    <span>Onglet "Appels d'offres" automatiquement sélectionné</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800">Avantage</Badge>
                    <span>L'appel d'offres acheté est immédiatement visible</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test du workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Tester le workflow complet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Étapes de test :</h4>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm">Aller sur la bourse au travail</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm">Acheter un appel d'offres</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm">Vérifier la page de succès (1 seul bouton)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span className="text-sm">Cliquer "Voir l'appel d'offres"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                  <span className="text-sm">Vérifier l'ouverture sur l'onglet "Appels d'offres"</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild>
                <Link href="/dashboard/marketplace">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tester l'achat
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/dashboard/demandes?tab=bought">
                  <Package className="h-4 w-4 mr-2" />
                  Voir les appels d'offres
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultat final */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Workflow d'achat optimisé
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <p>
                    Le parcours d'achat d'appels d'offres est maintenant simplifié et direct :
                  </p>
                  
                  <div className="ml-4 space-y-1 text-gray-700">
                    <p>• <strong>Page de succès épurée</strong> avec un seul bouton d'action</p>
                    <p>• <strong>Redirection intelligente</strong> vers l'onglet "Appels d'offres"</p>
                    <p>• <strong>Navigation cohérente</strong> avec URL persistante</p>
                    <p>• <strong>Workflow fluide</strong> de l'achat à la gestion</p>
                  </div>
                  
                  <p className="mt-3">
                    L'artisan peut maintenant passer de l'achat à la gestion de son appel d'offres 
                    en un seul clic, avec une expérience utilisateur optimisée.
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
