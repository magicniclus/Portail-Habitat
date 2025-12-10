"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Globe,
  Eye,
  Euro,
  Users,
  Settings,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function TestAdminMarketplaceUIPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Interface Admin - Bourse au Chantier
          </h1>
          <p className="text-gray-600">
            Aperçu de la nouvelle interface pour la publication sur la bourse au chantier
          </p>
        </div>

        {/* Simulation de l'interface améliorée */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Bourse au chantier
              </CardTitle>
              <Badge variant="outline" className="text-gray-600">
                Non publié
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration de la bourse - TOUJOURS VISIBLE */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration de la bourse
              </h4>
              
              {/* Prix et limite - Toujours visibles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Prix du lead (€)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    max="200"
                    value="35"
                    className="font-medium"
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Prix que paieront les artisans pour ce projet
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSales" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Limite de ventes
                  </Label>
                  <Input
                    id="maxSales"
                    type="number"
                    min="1"
                    max="10"
                    value="3"
                    className="font-medium"
                    readOnly
                  />
                  <p className="text-xs text-gray-500">
                    Nombre max d'artisans pouvant acheter
                  </p>
                </div>
              </div>

              {/* Aperçu de la configuration */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Aperçu de la publication</span>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Prix par artisan : <span className="font-semibold">35€</span></p>
                  <p>• Maximum 3 artisans pourront acheter ce lead</p>
                  <p>• Revenus potentiels : <span className="font-semibold">105€</span></p>
                </div>
              </div>
            </div>

            {/* Switch de publication */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex-1">
                <Label className="text-base font-medium">
                  Publier sur la bourse au chantier
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Rendre ce projet visible et achetable par les artisans
                </p>
              </div>
              <Switch
                checked={false}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Avantages de la nouvelle interface */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Améliorations apportées
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Prix et limite visibles</strong> avant publication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Aperçu des revenus</strong> calculé automatiquement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Configuration obligatoire</strong> avant publication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Interface claire</strong> avec switch de publication séparé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Nom corrigé</strong> : "Bourse au chantier" partout</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow utilisateur */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Settings className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Nouveau workflow admin
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>1. Configuration :</strong> L'admin voit et configure le prix du lead et la limite de ventes</p>
                  <p><strong>2. Aperçu :</strong> L'admin voit immédiatement les revenus potentiels</p>
                  <p><strong>3. Publication :</strong> L'admin active le switch pour publier sur la bourse</p>
                  <p><strong>4. Visibilité :</strong> Le projet devient visible pour tous les artisans connectés</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact sur les artisans */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">
                  Impact côté artisans
                </h3>
                <div className="text-orange-800 text-sm space-y-2">
                  <p><strong>Navigation :</strong> "Bourse au chantier" dans le menu de gauche</p>
                  <p><strong>Accès :</strong> Tous les projets publiés sont visibles (isPublished = true)</p>
                  <p><strong>Filtrage :</strong> Automatique par professions de l'artisan</p>
                  <p><strong>Achat :</strong> Prix et limite clairement affichés</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
