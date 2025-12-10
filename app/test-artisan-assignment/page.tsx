"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  User,
  ShoppingCart,
  Package,
  ArrowRight
} from "lucide-react";

export default function TestArtisanAssignmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👥 Test Artisans Assignés + Acheteurs
          </h1>
          <p className="text-gray-600">
            Vérification de l'affichage unifié des artisans assignés manuellement ET des acheteurs d'appels d'offres
          </p>
        </div>

        {/* Fonctionnalité implémentée */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Affichage unifié implémenté ✅
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Vue complète :</strong> Artisans assignés + Acheteurs marketplace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Distinction visuelle :</strong> Badges et couleurs différentes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Compteur total :</strong> Nombre combiné dans le titre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Informations complètes :</strong> Prix, dates, IDs de paiement</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparaison avant/après */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">❌ AVANT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-red-800 text-sm">
                <p><strong>Séparation des vues :</strong></p>
                <div className="ml-4 space-y-1 text-red-700">
                  <p>• Artisans assignés : Section "Artisans assignés"</p>
                  <p>• Acheteurs : Cachés dans les stats marketplace</p>
                  <p>• Pas de vue d'ensemble</p>
                  <p>• Information fragmentée</p>
                </div>
                
                <p className="mt-3"><strong>Problèmes :</strong></p>
                <div className="ml-4 space-y-1 text-red-700">
                  <p>• Vue incomplète des artisans impliqués</p>
                  <p>• Difficile de voir qui travaille sur le projet</p>
                  <p>• Gestion dispersée</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">✅ APRÈS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-green-800 text-sm">
                <p><strong>Vue unifiée :</strong></p>
                <div className="ml-4 space-y-1 text-green-700">
                  <p>• Tous les artisans dans une seule section</p>
                  <p>• Distinction claire : Assigné vs Acheté</p>
                  <p>• Compteur total dans le titre</p>
                  <p>• Informations complètes pour chaque type</p>
                </div>
                
                <p className="mt-3"><strong>Avantages :</strong></p>
                <div className="ml-4 space-y-1 text-green-700">
                  <p>• Vue d'ensemble complète du projet</p>
                  <p>• Gestion centralisée</p>
                  <p>• Suivi des revenus (assignations + ventes)</p>
                  <p>• Interface cohérente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exemple d'affichage */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Exemple d'affichage unifié
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Titre du composant :</h4>
              
              <div className="bg-white border border-blue-200 rounded p-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Artisans assignés (5)</span>
                  <span className="text-sm text-gray-600">• 2 assignés, 3 achetés</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cartes artisans :</h4>
              
              <div className="space-y-3">
                {/* Artisan assigné */}
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Jean Dupont</span>
                    <Badge className="bg-blue-100 text-blue-800">Assigné</Badge>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Dupont Plomberie</div>
                  <div className="text-xs text-gray-500 mt-1">📅 Assigné le 10/12/2025</div>
                  <div className="text-sm font-medium text-green-600 mt-1">💰 Prix: 1200€</div>
                </div>

                {/* Artisan acheteur */}
                <div className="bg-green-50 border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Marie Martin</span>
                    <Badge className="bg-green-100 text-green-800">Acheté</Badge>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">🛒 Acheté le 09/12/2025</div>
                  <div className="text-sm font-medium text-green-600 mt-1">💰 Prix payé: 35€</div>
                  <div className="text-xs text-gray-400 mt-1">ID Paiement: pi_abc123</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modifications techniques */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle>Modifications techniques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">1. Interface étendue :</h4>
              
              <div className="bg-white border border-gray-200 rounded p-3 font-mono text-sm">
                <p className="text-blue-600">// Nouvelle interface</p>
                <p>interface MarketplacePurchase {`{`}</p>
                <p className="ml-4">artisanId: string;</p>
                <p className="ml-4">artisanName: string;</p>
                <p className="ml-4">purchasedAt: any;</p>
                <p className="ml-4">price: number;</p>
                <p className="ml-4">paymentId: string;</p>
                <p>{`}`}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">2. Props du composant :</h4>
              
              <div className="bg-white border border-gray-200 rounded p-3 font-mono text-sm">
                <p className="text-blue-600">// Props mises à jour</p>
                <p>currentAssignments: Assignment[];</p>
                <p className="text-green-600">+ marketplacePurchases?: MarketplacePurchase[];</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">3. Affichage unifié :</h4>
              
              <div className="bg-white border border-gray-200 rounded p-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Artisans assignés : fond gris, badge bleu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span>Artisans acheteurs : fond vert, badge vert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📊</span>
                    <span>Compteur total : assignés + achetés</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Utilisation */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisation dans l'admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Page projet admin :</h4>
              
              <div className="bg-white border border-gray-200 rounded p-3 font-mono text-sm">
                <p className="text-blue-600">// Passage des données</p>
                <p>&lt;ArtisanAssignment</p>
                <p className="ml-4">estimationId={`{estimation.id}`}</p>
                <p className="ml-4">currentAssignments={`{estimation.assignments || []}`}</p>
                <p className="ml-4 text-green-600">marketplacePurchases={`{estimation.marketplacePurchases || []}`}</p>
                <p className="ml-4">onAssignmentsUpdate={`{handleAssignmentsUpdate}`}</p>
                <p className="ml-4">onMarketplaceUpdate={`{handleMarketplaceUpdate}`}</p>
                <p className="ml-4">disabled={`{!canEdit}`}</p>
                <p>/&gt;</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Données Firestore utilisées :</h4>
              
              <div className="bg-white border border-gray-200 rounded p-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span><strong>assignments[]</strong> : Artisans assignés manuellement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-green-600" />
                    <span><strong>marketplacePurchases[]</strong> : Artisans ayant acheté</span>
                  </div>
                </div>
              </div>
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
                  Vue unifiée des artisans implémentée
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <p>
                    La section "Artisans assignés" affiche maintenant tous les artisans impliqués dans un projet :
                  </p>
                  
                  <div className="ml-4 space-y-1 text-gray-700">
                    <p>• <strong>Artisans assignés manuellement</strong> avec prix modifiable</p>
                    <p>• <strong>Artisans ayant acheté l'appel d'offres</strong> avec détails de paiement</p>
                    <p>• <strong>Distinction visuelle claire</strong> avec badges et couleurs</p>
                    <p>• <strong>Compteur total</strong> dans le titre du composant</p>
                    <p>• <strong>Informations complètes</strong> pour chaque type d'artisan</p>
                  </div>
                  
                  <p className="mt-3">
                    L'admin a maintenant une vue d'ensemble complète de tous les artisans 
                    travaillant sur un projet, qu'ils soient assignés ou acheteurs.
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
