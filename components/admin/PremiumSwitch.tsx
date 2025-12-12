"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Crown, Calendar, Loader2, Settings } from "lucide-react";
import { 
  isPremiumActive, 
  getPremiumStatusDisplay,
  PremiumFeatures,
  getDefaultPremiumFeatures
} from "@/lib/premium-utils";
import { 
  activateArtisanPremium, 
  deactivateArtisanPremium,
  updatePremiumDuration,
  togglePremiumFeature
} from "@/lib/admin-premium";

interface PremiumSwitchProps {
  artisanId: string;
  premiumFeatures?: PremiumFeatures;
  onUpdate: () => void;
  disabled?: boolean;
}

export default function PremiumSwitch({
  artisanId,
  premiumFeatures = getDefaultPremiumFeatures(),
  onUpdate,
  disabled = false
}: PremiumSwitchProps) {
  const [loading, setLoading] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [premiumType, setPremiumType] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [durationMonths, setDurationMonths] = useState(1);

  const isActive = isPremiumActive({ id: artisanId, premiumFeatures });
  const statusDisplay = getPremiumStatusDisplay({ id: artisanId, premiumFeatures });

  // Toggle du statut premium
  const handleTogglePremium = async (enabled: boolean) => {
    if (disabled) return;

    setLoading(true);
    try {
      if (enabled) {
        // Ouvrir la configuration pour l'activation
        setConfigOpen(true);
      } else {
        // Désactiver directement
        await deactivateArtisanPremium(artisanId);
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors du toggle premium:', error);
      alert('Erreur lors de la modification du statut premium');
    } finally {
      setLoading(false);
    }
  };

  // Activation avec configuration
  const handleActivatePremium = async () => {
    setLoading(true);
    try {
      await activateArtisanPremium(artisanId, premiumType, durationMonths);
      setConfigOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de l\'activation:', error);
      alert('Erreur lors de l\'activation du premium');
    } finally {
      setLoading(false);
    }
  };

  // Toggle du badge Top Artisan
  const handleToggleTopBadge = async (enabled: boolean) => {
    if (disabled || !isActive) return;

    setLoading(true);
    try {
      await togglePremiumFeature(artisanId, 'showTopArtisanBadge', enabled);
      onUpdate();
    } catch (error) {
      console.error('Erreur lors du toggle badge:', error);
      alert('Erreur lors de la modification du badge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Statut Premium
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Switch principal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <Label className="text-base font-medium">Premium actif</Label>
              <p className="text-sm text-gray-600">
                Fonctionnalités avancées pour l'artisan
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {statusDisplay.label}
            </Badge>
            <Switch
              checked={isActive}
              onCheckedChange={handleTogglePremium}
              disabled={disabled || loading}
            />
          </div>
        </div>

        {/* Informations premium si actif */}
        {isActive && (
          <div className="space-y-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-yellow-800">
                Type d'abonnement
              </span>
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                {premiumFeatures.premiumType === 'lifetime' ? 'À vie' : 
                 premiumFeatures.premiumType === 'yearly' ? 'Annuel' : 'Mensuel'}
              </Badge>
            </div>

            {statusDisplay.daysRemaining !== undefined && statusDisplay.daysRemaining >= 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">
                  Jours restants
                </span>
                <span className="text-sm text-yellow-700">
                  {statusDisplay.daysRemaining === -1 ? '∞' : statusDisplay.daysRemaining}
                </span>
              </div>
            )}

            {/* Dates */}
            {premiumFeatures.premiumStartDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">
                  Date de début
                </span>
                <span className="text-sm text-yellow-700">
                  {premiumFeatures.premiumStartDate.toDate().toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}

            {premiumFeatures.premiumEndDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">
                  Date de fin
                </span>
                <span className="text-sm text-yellow-700">
                  {premiumFeatures.premiumEndDate.toDate().toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}

            {/* Badge Top Artisan */}
            <div className="flex items-center justify-between pt-2 border-t border-yellow-300">
              <div>
                <Label className="text-sm font-medium text-yellow-800">
                  Badge "Top Artisan"
                </Label>
                <p className="text-xs text-yellow-700">
                  Affiche un badge doré sur la fiche
                </p>
              </div>
              <Switch
                checked={premiumFeatures.showTopArtisanBadge}
                onCheckedChange={handleToggleTopBadge}
                disabled={disabled || loading}
              />
            </div>
          </div>
        )}

        {/* Dialog de configuration */}
        <Dialog open={configOpen} onOpenChange={setConfigOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Activer le Premium
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Type d'abonnement</Label>
                <Select value={premiumType} onValueChange={(value: any) => setPremiumType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                    <SelectItem value="lifetime">À vie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {premiumType === 'monthly' && (
                <div>
                  <Label>Durée (mois)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Fonctionnalités incluses :</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Jusqu'à 5 photos de bannière</li>
                  <li>• Vidéo de présentation</li>
                  <li>• Badge "Top Artisan"</li>
                  <li>• Priorité d'affichage</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleActivatePremium} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Activation...
                  </>
                ) : (
                  'Activer Premium'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {loading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Mise à jour en cours...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
