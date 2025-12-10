"use client";

import { useState } from "react";
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
  AlertTriangle
} from "lucide-react";

export default function TestNoDefaultZeroPage() {
  const [marketplacePrice, setMarketplacePrice] = useState(0);
  const [maxSales, setMaxSales] = useState(0);
  const [isPublished, setIsPublished] = useState(false);

  const resetFields = () => {
    setMarketplacePrice(0);
    setMaxSales(0);
    setIsPublished(false);
  };

  const setValidValues = () => {
    setMarketplacePrice(35);
    setMaxSales(3);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Champs Sans Zéro Par Défaut
          </h1>
          <p className="text-gray-600">
            Vérification que les champs restent vides quand la valeur est 0
          </p>
        </div>

        {/* Boutons de test */}
        <div className="flex gap-4">
          <Button onClick={resetFields} variant="outline">
            Remettre à zéro (champs vides)
          </Button>
          <Button onClick={setValidValues} variant="default">
            Définir valeurs valides
          </Button>
        </div>

        {/* État actuel */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="text-sm space-y-1">
              <p><strong>État interne :</strong></p>
              <p>• marketplacePrice = {marketplacePrice}</p>
              <p>• maxSales = {maxSales}</p>
              <p>• isPublished = {isPublished.toString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Simulation de l'interface */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Bourse au chantier
              </CardTitle>
              <Badge variant={isPublished ? "default" : "outline"}>
                {isPublished ? "Publié" : "Non publié"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration de la bourse */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration de la bourse
              </h4>
              
              {/* Prix et limite */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Prix du lead (€)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    max="200"
                    value={marketplacePrice === 0 ? "" : marketplacePrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setMarketplacePrice(0);
                      } else {
                        setMarketplacePrice(parseInt(value) || 0);
                      }
                    }}
                    className="font-medium"
                    placeholder="Prix en €"
                  />
                  <p className="text-xs text-gray-500">
                    {marketplacePrice === 0 
                      ? "Champ vide = valeur 0 en interne" 
                      : `Valeur: ${marketplacePrice}€`
                    }
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
                    value={maxSales === 0 ? "" : maxSales}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setMaxSales(0);
                      } else {
                        setMaxSales(parseInt(value) || 0);
                      }
                    }}
                    className="font-medium"
                    placeholder="Nombre max"
                  />
                  <p className="text-xs text-gray-500">
                    {maxSales === 0 
                      ? "Champ vide = valeur 0 en interne" 
                      : `Valeur: ${maxSales} artisans max`
                    }
                  </p>
                </div>
              </div>

              {/* Aperçu de la configuration */}
              <div className={`border rounded-lg p-4 ${
                marketplacePrice === 0 || maxSales === 0
                  ? "bg-orange-50 border-orange-200" 
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className={`h-4 w-4 ${
                    marketplacePrice === 0 || maxSales === 0 ? "text-orange-600" : "text-blue-600"
                  }`} />
                  <span className={`font-medium ${
                    marketplacePrice === 0 || maxSales === 0 ? "text-orange-900" : "text-blue-900"
                  }`}>
                    {marketplacePrice === 0 || maxSales === 0 ? "⚠️ Configuration invalide" : "Aperçu de la publication"}
                  </span>
                </div>
                <div className={`text-sm space-y-1 ${
                  marketplacePrice === 0 || maxSales === 0 ? "text-orange-800" : "text-blue-800"
                }`}>
                  {marketplacePrice === 0 || maxSales === 0 ? (
                    <>
                      {marketplacePrice === 0 && <p>• <span className="font-semibold">Prix non défini</span></p>}
                      {maxSales === 0 && <p>• <span className="font-semibold">Limite de ventes non définie</span></p>}
                      <p>• Le projet sera automatiquement <span className="font-semibold">dépublié</span> de la bourse</p>
                      <p>• Définissez un prix et une limite pour pouvoir publier</p>
                    </>
                  ) : (
                    <>
                      <p>• Prix par artisan : <span className="font-semibold">{marketplacePrice}€</span></p>
                      <p>• Maximum {maxSales} artisan{maxSales > 1 ? 's' : ''} pourr{maxSales > 1 ? 'ont' : 'a'} acheter ce lead</p>
                      <p>• Revenus potentiels : <span className="font-semibold">{marketplacePrice * maxSales}€</span></p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Switch de publication */}
            <div className={`flex items-center justify-between p-4 rounded-lg border-2 border-dashed ${
              marketplacePrice === 0 || maxSales === 0
                ? "bg-red-50 border-red-300" 
                : "bg-gray-50 border-gray-300"
            }`}>
              <div className="flex-1">
                <Label className="text-base font-medium">
                  Publier sur la bourse au chantier
                </Label>
                <p className={`text-sm mt-1 ${
                  marketplacePrice === 0 || maxSales === 0 ? "text-red-600" : "text-gray-600"
                }`}>
                  {marketplacePrice === 0 || maxSales === 0
                    ? "Configuration incomplète - impossible de publier"
                    : "Rendre ce projet visible et achetable par les artisans"
                  }
                </p>
              </div>
              <Switch
                checked={isPublished && marketplacePrice > 0 && maxSales > 0}
                onCheckedChange={setIsPublished}
                disabled={marketplacePrice === 0 || maxSales === 0}
              />
            </div>
          </CardContent>
        </Card>

        {/* Explication du comportement */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Nouveau comportement
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <p><strong>Champs vides :</strong> Quand la valeur interne est 0, le champ d'input reste vide (pas de "0" affiché)</p>
                  <p><strong>Placeholder :</strong> Texte d'aide visible dans les champs vides</p>
                  <p><strong>Logique interne :</strong> Champ vide = valeur 0 en interne pour la logique de validation</p>
                  <p><strong>Validation :</strong> Prix = 0 OU Limite = 0 → Configuration invalide → Dépublication automatique</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test des cas */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Cas de test
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>1. Champs vides :</strong> Les inputs montrent des placeholders, pas de "0"</p>
                  <p><strong>2. Saisie vide :</strong> Effacer le contenu d'un champ le remet à 0 en interne</p>
                  <p><strong>3. Validation :</strong> Impossible de publier tant qu'un champ est vide/0</p>
                  <p><strong>4. Valeurs valides :</strong> Saisir des valeurs supérieures à 0 active la possibilité de publier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
