"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Package,
  AlertCircle,
  Database,
  Eye,
  X
} from "lucide-react";

export default function TestLeadsSystemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Système de Leads Achetés
          </h1>
          <p className="text-gray-600">
            Vérification complète du workflow d'achat et de gestion des leads
          </p>
        </div>

        {/* Système implémenté */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Système de leads achetés implémenté ✅
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Collection artisan/leads :</strong> Leads achetés ajoutés automatiquement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Filtrage marketplace :</strong> Leads déjà achetés exclus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Dashboard artisan :</strong> Page dédiée aux leads achetés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Gestion statuts :</strong> Nouveau → Contacté → Converti/Perdu</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow complet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Achat de Lead</h3>
              </div>
              <div className="text-blue-800 text-sm space-y-2">
                <p><strong>Workflow d'achat :</strong></p>
                <div className="ml-2 space-y-1 text-blue-700">
                  <p>1. Artisan voit lead sur marketplace</p>
                  <p>2. Clique "Acheter cette demande"</p>
                  <p>3. Paiement Stripe avec CGV</p>
                  <p>4. Confirmation automatique</p>
                  <p>5. Lead ajouté à sa collection</p>
                </div>
                
                <p className="mt-3"><strong>API utilisées :</strong></p>
                <div className="ml-2 space-y-1 text-blue-700">
                  <p>• create-marketplace-payment</p>
                  <p>• confirm-marketplace-payment</p>
                  <p>• Ajout dans artisans/{`{artisanId}`}/leads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Package className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Gestion des Leads</h3>
              </div>
              <div className="text-purple-800 text-sm space-y-2">
                <p><strong>Interface artisan :</strong></p>
                <div className="ml-2 space-y-1 text-purple-700">
                  <p>• Page /dashboard/leads-achetes</p>
                  <p>• Coordonnées client complètes</p>
                  <p>• Boutons d'action (tel, email)</p>
                  <p>• Gestion des statuts</p>
                </div>
                
                <p className="mt-3"><strong>Statuts disponibles :</strong></p>
                <div className="ml-2 space-y-1 text-purple-700">
                  <p>• Nouveau (bleu)</p>
                  <p>• Contacté (jaune)</p>
                  <p>• Converti (vert)</p>
                  <p>• Perdu (rouge)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Structure Firestore */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Database className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">
                  Structure Firestore mise à jour
                </h3>
                <div className="text-orange-800 text-sm space-y-2">
                  <p><strong>Collection artisans/{`{artisanId}`}/leads :</strong></p>
                  <div className="bg-white border border-orange-200 rounded p-3 font-mono text-xs space-y-1">
                    <p>{`{`}</p>
                    <p className="ml-4">clientName: "Jean Dupont",</p>
                    <p className="ml-4">clientPhone: "06 12 34 56 78",</p>
                    <p className="ml-4">clientEmail: "jean@example.com",</p>
                    <p className="ml-4">projectType: "Rénovation cuisine",</p>
                    <p className="ml-4">city: "Paris",</p>
                    <p className="ml-4">budget: 15000,</p>
                    <p className="ml-4">source: "bought",</p>
                    <p className="ml-4">status: "new",</p>
                    <p className="ml-4">marketplacePrice: 35,</p>
                    <p className="ml-4">originalEstimationId: "est123",</p>
                    <p className="ml-4">createdAt: timestamp,</p>
                    <p className="ml-4">notes: "Lead acheté sur marketplace"</p>
                    <p>{`}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtrage marketplace */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <X className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  Filtrage intelligent de la marketplace
                </h3>
                <div className="text-red-800 text-sm space-y-2">
                  <p><strong>Problème résolu :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Artisan voyait les leads déjà achetés</p>
                    <p>• Possibilité d'acheter plusieurs fois le même lead</p>
                    <p>• Confusion dans l'interface</p>
                  </div>
                  
                  <p className="mt-3"><strong>Solution implémentée :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• getMarketplaceLeads() accepte artisanId</p>
                    <p>• Filtrage par marketplacePurchases[]</p>
                    <p>• Leads déjà achetés exclus automatiquement</p>
                    <p>• Interface propre et cohérente</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fonctions utilitaires */}
        <Card>
          <CardHeader>
            <CardTitle>Fonctions utilitaires créées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">lib/artisan-leads.ts :</h4>
              <div className="bg-gray-100 rounded p-3 font-mono text-sm space-y-1">
                <p>• getArtisanLeads(artisanId) - Tous les leads</p>
                <p>• getBoughtLeads(artisanId) - Seulement les achetés</p>
                <p>• updateLeadStatus(artisanId, leadId, status)</p>
                <p>• hasArtisanBoughtLead(artisanId, estimationId)</p>
                <p>• formatLeadStatus() / formatLeadSource()</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Composants créés :</h4>
              <div className="bg-gray-100 rounded p-3 font-mono text-sm space-y-1">
                <p>• PurchasedLeadsBoard.tsx - Interface de gestion</p>
                <p>• /dashboard/leads-achetes/page.tsx - Page dédiée</p>
                <p>• Navigation mise à jour avec icône Package</p>
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
                    <span>Acheter un lead sur marketplace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Vérifier ajout dans /leads-achetes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Tester gestion des statuts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Vérifier filtrage marketplace</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Vérifications :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Lead visible dans dashboard artisan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Coordonnées client accessibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Lead n'apparaît plus sur marketplace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Statuts modifiables</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild>
                <a href="/dashboard/marketplace">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tester la marketplace
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/dashboard/leads-achetes">
                  <Package className="h-4 w-4 mr-2" />
                  Voir leads achetés
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Avantages du système */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Avantages du système implémenté
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <div className="space-y-1">
                    <p><strong>1. Expérience utilisateur optimale :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Leads achetés immédiatement visibles</p>
                      <p>• Coordonnées client complètes</p>
                      <p>• Interface de gestion intuitive</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>2. Prévention des doublons :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Filtrage automatique des leads achetés</p>
                      <p>• Pas de double achat possible</p>
                      <p>• Marketplace toujours à jour</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>3. Suivi commercial :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Gestion des statuts de conversion</p>
                      <p>• Historique des actions</p>
                      <p>• ROI des leads achetés</p>
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
