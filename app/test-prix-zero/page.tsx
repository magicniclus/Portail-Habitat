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
  AlertTriangle,
  ArrowRight
} from "lucide-react";

export default function TestPrixZeroPage() {
  const [marketplacePrice, setMarketplacePrice] = useState(35);
  const [maxSales, setMaxSales] = useState(3);
  const [isPublished, setIsPublished] = useState(false);

  const handlePriceChange = (value: number) => {
    setMarketplacePrice(value);
    // Si le prix passe à 0, forcer la dépublication
    if (value === 0 && isPublished) {
      setIsPublished(false);
    }
  };

  const resetToZero = () => {
    handlePriceChange(0);
  };

  const setNormalPrice = () => {
    handlePriceChange(35);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Prix à Zéro - Dépublication Automatique
          </h1>
          <p className="text-gray-600">
            Vérification du comportement quand le prix du lead est mis à 0€
          </p>
        </div>

        {/* Boutons de test */}
        <div className="flex gap-4">
          <Button onClick={resetToZero} variant="destructive">
            Mettre le prix à 0€
          </Button>
          <Button onClick={setNormalPrice} variant="default">
            Remettre à 35€
          </Button>
        </div>

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
                    min="0"
                    max="200"
                    value={marketplacePrice}
                    onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0)}
                    className="font-medium"
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
                    value={maxSales}
                    onChange={(e) => setMaxSales(parseInt(e.target.value) || 3)}
                    className="font-medium"
                  />
                  <p className="text-xs text-gray-500">
                    Nombre max d'artisans pouvant acheter
                  </p>
                </div>
              </div>

              {/* Aperçu de la configuration */}
              <div className={`border rounded-lg p-4 ${
                marketplacePrice === 0 
                  ? "bg-orange-50 border-orange-200" 
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className={`h-4 w-4 ${
                    marketplacePrice === 0 ? "text-orange-600" : "text-blue-600"
                  }`} />
                  <span className={`font-medium ${
                    marketplacePrice === 0 ? "text-orange-900" : "text-blue-900"
                  }`}>
                    {marketplacePrice === 0 ? "⚠️ Configuration invalide" : "Aperçu de la publication"}
                  </span>
                </div>
                <div className={`text-sm space-y-1 ${
                  marketplacePrice === 0 ? "text-orange-800" : "text-blue-800"
                }`}>
                  {marketplacePrice === 0 ? (
                    <>
                      <p>• <span className="font-semibold">Prix à 0€ détecté</span></p>
                      <p>• Le projet sera automatiquement <span className="font-semibold">dépublié</span> de la bourse</p>
                      <p>• Définissez un prix supérieur à 0€ pour pouvoir publier</p>
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
              marketplacePrice === 0 
                ? "bg-red-50 border-red-300" 
                : "bg-gray-50 border-gray-300"
            }`}>
              <div className="flex-1">
                <Label className="text-base font-medium">
                  Publier sur la bourse au chantier
                </Label>
                <p className={`text-sm mt-1 ${
                  marketplacePrice === 0 ? "text-red-600" : "text-gray-600"
                }`}>
                  {marketplacePrice === 0 
                    ? "Impossible de publier avec un prix à 0€"
                    : "Rendre ce projet visible et achetable par les artisans"
                  }
                </p>
              </div>
              <Switch
                checked={isPublished && marketplacePrice > 0}
                onCheckedChange={setIsPublished}
                disabled={marketplacePrice === 0}
              />
            </div>
          </CardContent>
        </Card>

        {/* Explication du comportement */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Comportement implémenté
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Prix modifiable à 0€</strong> : L'admin peut mettre le prix à zéro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Dépublication automatique</strong> : Si prix = 0€, le projet est automatiquement dépublié</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Switch désactivé</strong> : Impossible d'activer la publication avec prix = 0€</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Aperçu adaptatif</strong> : Interface change de couleur et message d'avertissement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Sauvegarde intelligente</strong> : La logique de sauvegarde force isPublished = false si prix = 0€</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cas d'usage */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Cas d'usage
                </h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p><strong>Retrait temporaire :</strong> L'admin peut mettre le prix à 0€ pour retirer temporairement un projet de la bourse</p>
                  <p><strong>Désactivation rapide :</strong> Plus besoin de décocher le switch, il suffit de mettre le prix à 0€</p>
                  <p><strong>Prévention d'erreurs :</strong> Impossible de publier accidentellement un lead gratuit</p>
                  <p><strong>Remise en service :</strong> Il suffit de remettre un prix supérieur à 0€ pour pouvoir republier</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
