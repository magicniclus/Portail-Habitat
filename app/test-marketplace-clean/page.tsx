"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  AlertCircle,
  Eye,
  X,
  Euro,
  MapPin
} from "lucide-react";

export default function TestMarketplaceCleanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Marketplace Nettoyée
          </h1>
          <p className="text-gray-600">
            Vérification de la suppression de l'affichage "X/Y vendus" et de la barre de progression
          </p>
        </div>

        {/* Modifications apportées */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Affichage des ventes supprimé ✅
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Texte supprimé :</strong> "1/3 vendus" n'apparaît plus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Barre supprimée :</strong> Plus de barre de progression des ventes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Code nettoyé :</strong> Fonction getSalesProgress supprimée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Interface épurée :</strong> Focus sur le prix et les actions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparaison avant/après */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <X className="h-6 w-6 text-red-600" />
                <h3 className="font-semibold text-red-900">AVANT (supprimé)</h3>
              </div>
              <div className="text-red-800 text-sm space-y-3">
                <p><strong>Éléments supprimés :</strong></p>
                
                {/* Simulation de l'ancien affichage */}
                <div className="bg-white border border-red-200 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">35€</span>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1 line-through">
                        1/3 vendus
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-2 space-y-1 text-red-700">
                  <p>• Texte "X/Y vendus" visible</p>
                  <p>• Barre de progression colorée</p>
                  <p>• Information distrayante</p>
                  <p>• Peut décourager l'achat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-900">APRÈS (actuel)</h3>
              </div>
              <div className="text-green-800 text-sm space-y-3">
                <p><strong>Interface épurée :</strong></p>
                
                {/* Simulation du nouvel affichage */}
                <div className="bg-white border border-green-200 rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">35€</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>12</span>
                      </div>
                    </div>
                    <Button size="sm">
                      Acheter cette demande
                    </Button>
                  </div>
                </div>
                
                <div className="ml-2 space-y-1 text-green-700">
                  <p>• Prix mis en évidence</p>
                  <p>• Vues seulement (information utile)</p>
                  <p>• Bouton d'action clair</p>
                  <p>• Interface propre et focalisée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modifications techniques */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Modifications techniques apportées
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>1. Suppression du code d'affichage :</strong></p>
                  <div className="bg-white border border-blue-200 rounded p-3 font-mono text-xs">
                    <p className="line-through text-red-600">{`<div className="text-xs text-gray-500 mb-1">`}</p>
                    <p className="line-through text-red-600 ml-4">{`{lead.marketplaceSales}/{lead.maxSales} vendus`}</p>
                    <p className="line-through text-red-600">{`&lt;/div&gt;`}</p>
                    <p className="line-through text-red-600">{`&lt;div className="w-16 h-2 bg-gray-200 rounded-full"&gt;`}</p>
                    <p className="line-through text-red-600 ml-4">{`&lt;div className="h-full bg-color" /&gt;`}</p>
                    <p className="line-through text-red-600">{`&lt;/div&gt;`}</p>
                  </div>
                  
                  <p className="mt-3"><strong>2. Suppression de la fonction :</strong></p>
                  <div className="bg-white border border-blue-200 rounded p-3 font-mono text-xs">
                    <p className="line-through text-red-600">const getSalesProgress = (sales, maxSales) =&gt; {`{`}</p>
                    <p className="line-through text-red-600 ml-4">// Calcul pourcentage et couleur</p>
                    <p className="line-through text-red-600">{`}`};</p>
                  </div>
                  
                  <p className="mt-3"><strong>3. Suppression de la variable :</strong></p>
                  <div className="bg-white border border-blue-200 rounded p-3 font-mono text-xs">
                    <p className="line-through text-red-600">const salesProgress = getSalesProgress(...);</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avantages de la suppression */}
        <Card>
          <CardHeader>
            <CardTitle>Avantages de la suppression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Expérience utilisateur :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Interface plus propre et épurée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Focus sur le prix et la valeur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Pas d'effet de rareté négatif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Encourage l'achat plutôt que de décourager</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Code et maintenance :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Code plus simple et maintenable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Moins de calculs côté client</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Suppression de logique inutile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Interface cohérente avec demande utilisateur</span>
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
                <a href="/dashboard/demandes">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir mes demandes
                </a>
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
                  Résultat final
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <p>
                    L'affichage "1/3 vendus" et la barre de progression ont été complètement supprimés 
                    de la marketplace. L'interface est maintenant plus propre et focalisée sur l'essentiel :
                  </p>
                  
                  <div className="ml-4 space-y-1 text-gray-700">
                    <p>• <strong>Prix du lead</strong> mis en évidence</p>
                    <p>• <strong>Nombre de vues</strong> comme seule statistique</p>
                    <p>• <strong>Bouton d'achat</strong> clairement visible</p>
                    <p>• <strong>Interface épurée</strong> sans distraction</p>
                  </div>
                  
                  <p className="mt-3">
                    Cette modification améliore l'expérience d'achat en évitant de montrer des informations 
                    qui pourraient décourager les artisans d'acheter des leads.
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
