"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrestationsModal from "@/components/admin/PrestationsModal";
import { getMarketplaceStats, initializeMarketplaceStructure, syncAssignmentsToMarketplace } from "@/lib/marketplace-utils";
import { generateLeadPurchaseLink } from "@/lib/lead-links";
import { 
  Globe,
  Eye,
  EyeOff,
  Euro,
  Users,
  Settings,
  Plus,
  Save,
  Loader2,
  CheckCircle,
  Pause,
  Play,
  Link,
  Copy
} from "lucide-react";

interface ProjectMarketplaceCardProps {
  estimation: any;
  onUpdate: (updatedEstimation: any) => void;
  disabled?: boolean;
}

export default function ProjectMarketplaceCard({ 
  estimation, 
  onUpdate, 
  disabled = false 
}: ProjectMarketplaceCardProps) {
  const [isPublished, setIsPublished] = useState(estimation.isPublished || false);
  const [marketplacePrice, setMarketplacePrice] = useState(estimation.marketplacePrice || 35);
  const [maxSales, setMaxSales] = useState(estimation.maxSales || 3);
  const [marketplaceDescription, setMarketplaceDescription] = useState(
    estimation.marketplaceDescription || ""
  );
  
  // Pré-remplir avec la prestation du projet si pas encore configuré
  const getInitialPrestations = (currentEstimation = estimation) => {
    if (currentEstimation.marketplacePrestations && currentEstimation.marketplacePrestations.length > 0) {
      return currentEstimation.marketplacePrestations;
    }
    // Utiliser la prestation du projet comme valeur par défaut
    if (currentEstimation.project?.prestationType) {
      return [currentEstimation.project.prestationType];
    }
    return [];
  };
  
  const [selectedPrestations, setSelectedPrestations] = useState(getInitialPrestations());
  const [isPrestationsModalOpen, setIsPrestationsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Initialiser la structure marketplace et synchroniser les compteurs au chargement
  useEffect(() => {
    const initializeAndSync = async () => {
      if (estimation.id) {
        await initializeMarketplaceStructure(estimation.id);
        await syncAssignmentsToMarketplace(estimation.id);
        // IMPORTANT: Synchronise les compteurs SANS toucher à isPublished
      }
    };
    
    initializeAndSync();
  }, [estimation.id]);

  // Mettre à jour les états locaux quand l'estimation change
  useEffect(() => {
    setIsPublished(estimation.isPublished || false);
    setMarketplacePrice(estimation.marketplacePrice || 35);
    setMaxSales(estimation.maxSales || 3);
    setMarketplaceDescription(estimation.marketplaceDescription || "");
    setSelectedPrestations(getInitialPrestations(estimation));
  }, [estimation]);

  // Détecter les changements
  useEffect(() => {
    const hasChanged = 
      isPublished !== (estimation.isPublished || false) ||
      marketplacePrice !== (estimation.marketplacePrice || 35) ||
      maxSales !== (estimation.maxSales || 3) ||
      marketplaceDescription !== (estimation.marketplaceDescription || "") ||
      JSON.stringify(selectedPrestations) !== JSON.stringify(estimation.marketplacePrestations || []);
    
    setHasChanges(hasChanged);
  }, [isPublished, marketplacePrice, maxSales, marketplaceDescription, selectedPrestations, estimation]);

  const handleSave = async () => {
    if (!hasChanges || disabled) return;

    setIsSaving(true);
    try {
      // Si le prix est à 0 ou la limite à 0, forcer la dépublication
      const finalIsPublished = (marketplacePrice === 0 || maxSales === 0) ? false : isPublished;
      
      const updateData: any = {
        isPublished: finalIsPublished,
        marketplacePrice,
        maxSales,
        marketplaceDescription,
        marketplacePrestations: selectedPrestations,
        updatedAt: serverTimestamp()
      };

      // Si on publie pour la première fois, ajouter publishedAt
      if (finalIsPublished && !estimation.isPublished) {
        updateData.publishedAt = serverTimestamp();
      }

      // Si on dépublie (manuellement ou automatiquement via prix = 0), supprimer publishedAt
      if (!finalIsPublished && estimation.isPublished) {
        updateData.publishedAt = null;
      }

      // Mettre à jour Firestore
      await updateDoc(doc(db, "estimations", estimation.id), updateData);

      // Si on active la bourse, synchroniser les assignations existantes
      if (isPublished && !estimation.isPublished) {
        try {
          await syncAssignmentsToMarketplace(estimation.id);
          console.log("Assignations synchronisées avec la marketplace");
        } catch (syncError) {
          console.log("Erreur synchronisation assignations:", syncError);
        }
      }

      // Mettre à jour l'état local via le callback parent
      onUpdate({
        ...estimation,
        ...updateData,
        updatedAt: new Date()
      });

      // Mettre à jour l'état local du composant
      setIsPublished(finalIsPublished);

      setHasChanges(false);

      console.log("Paramètres de bourse mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrestationsUpdate = async (prestations: string[]) => {
    setSelectedPrestations(prestations);
    setIsPrestationsModalOpen(false);
  };

  const copyLeadLink = async () => {
    const link = generateLeadPurchaseLink(estimation.id);
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
      // Fallback pour les navigateurs qui ne supportent pas clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const getStatusBadge = () => {
    const stats = getMarketplaceStats(estimation);
    
    if (!isPublished) {
      return (
        <Badge variant="outline" className="text-gray-600">
          <EyeOff className="h-3 w-3 mr-1" />
          Non publié
        </Badge>
      );
    }

    if (stats.isCompleted) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Complet ({stats.currentSales}/{stats.maxSales})
        </Badge>
      );
    }

    if (stats.status === "paused") {
      return (
        <Badge className="bg-orange-100 text-orange-800">
          <Pause className="h-3 w-3 mr-1" />
          En pause
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800">
        <Globe className="h-3 w-3 mr-1" />
        Actif ({stats.currentSales}/{stats.maxSales})
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Appels d'offres
            </CardTitle>
            {getStatusBadge()}
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
                  value={marketplacePrice === 0 ? "" : marketplacePrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setMarketplacePrice(0);
                    } else {
                      setMarketplacePrice(parseInt(value) || 0);
                    }
                  }}
                  disabled={disabled}
                  className="font-medium"
                  placeholder="Prix en €"
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
                  value={maxSales === 0 ? "" : maxSales}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setMaxSales(0);
                    } else {
                      setMaxSales(parseInt(value) || 0);
                    }
                  }}
                  disabled={disabled}
                  className="font-medium"
                  placeholder="Nombre max"
                />
                <p className="text-xs text-gray-500">
                  Nombre max d'artisans pouvant acheter
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
                Publier sur les appels d'offres
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
              disabled={disabled || marketplacePrice === 0 || maxSales === 0}
            />
          </div>

          {/* Configuration avancée - Visible seulement si publié */}
          {isPublished && (
            <div className="space-y-4 border-t pt-4">

              {/* Description pour la bourse */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description pour la bourse (optionnel)
                </Label>
                <Input
                  id="description"
                  placeholder="Ajoutez des détails spécifiques pour attirer les artisans..."
                  value={marketplaceDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMarketplaceDescription(e.target.value)}
                  disabled={disabled}
                />
                <p className="text-xs text-gray-500">
                  Cette description s'ajoutera aux informations du projet
                </p>
              </div>

              {/* Prestations spécifiques */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Prestations ciblées
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPrestationsModalOpen(true)}
                    disabled={disabled}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {selectedPrestations.length > 0 
                      ? `${selectedPrestations.length} prestation(s) sélectionnée(s)`
                      : "Ajouter des prestations"
                    }
                  </Button>
                </div>
                {selectedPrestations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPrestations.map((prestation: any, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {prestation.name}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Prestations spécifiques pour cibler les bons artisans
                </p>
              </div>

              {/* Lien de paiement direct */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Lien de paiement direct
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={generateLeadPurchaseLink(estimation.id)}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyLeadLink}
                    className="flex items-center gap-2 min-w-[100px]"
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Lien direct pour que les artisans puissent acheter ce lead. Vérifie automatiquement l'authentification et l'abonnement.
                </p>
              </div>

              {/* Statistiques si publié */}
              {estimation.isPublished && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Statistiques et historique</h4>
                  
                  {/* Statistiques principales */}
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-blue-700">Vues :</span>
                      <span className="font-medium ml-1">
                        {estimation.marketplaceViews || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Ventes :</span>
                      <span className="font-medium ml-1">
                        {estimation.marketplaceSales || 0} / {estimation.maxSales || 3}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Statut :</span>
                      <span className="font-medium ml-1">
                        {getMarketplaceStats(estimation).status === "completed" ? "Complet" : 
                         getMarketplaceStats(estimation).status === "paused" ? "En pause" : "Actif"}
                      </span>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-blue-700 mb-1">
                      <span>Progression des ventes</span>
                      <span>{getMarketplaceStats(estimation).completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getMarketplaceStats(estimation).completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Historique des achats */}
                  {estimation.marketplacePurchases && estimation.marketplacePurchases.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-blue-800 mb-2">Derniers achats :</h5>
                      <div className="space-y-1">
                        {estimation.marketplacePurchases.slice(-3).map((purchase: any, index: number) => (
                          <div key={index} className="text-xs text-blue-700 flex justify-between">
                            <span>{purchase.artisanName}</span>
                            <span>{purchase.purchasedAt?.toDate?.()?.toLocaleDateString('fr-FR')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates importantes */}
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    {estimation.publishedAt && (
                      <p className="text-xs text-blue-600">
                        Publié le {estimation.publishedAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {estimation.marketplaceCompletedAt && (
                      <p className="text-xs text-blue-600">
                        Complété le {estimation.marketplaceCompletedAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bouton de sauvegarde */}
          {hasChanges && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving || disabled}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal des prestations */}
      <PrestationsModal
        isOpen={isPrestationsModalOpen}
        onClose={() => setIsPrestationsModalOpen(false)}
        currentProfessions={selectedPrestations}
        onSave={handlePrestationsUpdate}
      />
    </>
  );
}
