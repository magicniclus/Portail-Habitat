"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar, Loader2, Clock, X } from "lucide-react";
import { activateTemporaryPremium, cancelTemporaryPremium, extendTemporaryPremium, getActiveTemporaryPremium } from "@/lib/temporary-premium";
import { toast } from "@/hooks/useToast";
import { useEffect } from "react";
import { TemporaryPremium } from "@/lib/premium-utils";

interface TemporaryPremiumFormProps {
  artisanId: string;
  onUpdate: () => void;
  disabled?: boolean;
}

export default function TemporaryPremiumForm({
  artisanId,
  onUpdate,
  disabled = false
}: TemporaryPremiumFormProps) {
  const [loading, setLoading] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [currentTemporaryPremium, setCurrentTemporaryPremium] = useState<TemporaryPremium | null>(null);

  // Charger le premium temporaire existant
  useEffect(() => {
    loadCurrentTemporaryPremium();
  }, [artisanId]);

  const loadCurrentTemporaryPremium = async () => {
    try {
      const tempPremium = await getActiveTemporaryPremium(artisanId);
      setCurrentTemporaryPremium(tempPremium);
      
      if (tempPremium) {
        // Pré-remplir la date d'expiration actuelle
        const currentEndDate = tempPremium.expiresAt.toDate();
        setEndDate(currentEndDate.toISOString().split('T')[0]);
        setAdminNotes(tempPremium.adminNotes || '');
      } else {
        // Date par défaut : 30 jours à partir d'aujourd'hui
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 30);
        setEndDate(defaultDate.toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du premium temporaire:', error);
    }
  };

  const handleActivate = async () => {
    if (!endDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date de fin",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const selectedDate = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        toast({
          title: "Date invalide",
          description: "La date de fin doit être dans le futur",
          variant: "destructive"
        });
        return;
      }

      // Calculer le nombre de jours
      const diffTime = selectedDate.getTime() - today.getTime();
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      await activateTemporaryPremium(
        artisanId,
        'admin-user', // TODO: Remplacer par l'ID de l'admin connecté
        durationDays,
        adminNotes
      );

      onUpdate();
      toast({
        title: "Premium temporaire activé",
        description: `Premium temporaire activé jusqu'au ${selectedDate.toLocaleDateString('fr-FR')}`,
        variant: "success"
      });

      // Recharger les données
      await loadCurrentTemporaryPremium();

    } catch (error) {
      console.error('Erreur lors de l\'activation:', error);
      toast({
        title: "Erreur d'activation",
        description: error instanceof Error ? error.message : "Erreur lors de l'activation du premium temporaire",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async () => {
    if (!currentTemporaryPremium || !endDate) return;

    setLoading(true);
    try {
      const newEndDate = new Date(endDate);
      const currentEndDate = currentTemporaryPremium.expiresAt.toDate();

      if (newEndDate <= currentEndDate) {
        toast({
          title: "Date invalide",
          description: "La nouvelle date doit être postérieure à la date actuelle",
          variant: "destructive"
        });
        return;
      }

      // Calculer les jours supplémentaires
      const diffTime = newEndDate.getTime() - currentEndDate.getTime();
      const additionalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      await extendTemporaryPremium(
        currentTemporaryPremium.id,
        additionalDays,
        'admin-user' // TODO: Remplacer par l'ID de l'admin connecté
      );

      onUpdate();
      toast({
        title: "Premium prolongé",
        description: `Premium prolongé de ${additionalDays} jour(s)`,
        variant: "success"
      });

      // Recharger les données
      await loadCurrentTemporaryPremium();

    } catch (error) {
      console.error('Erreur lors de la prolongation:', error);
      toast({
        title: "Erreur de prolongation",
        description: error instanceof Error ? error.message : "Erreur lors de la prolongation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!currentTemporaryPremium) return;

    setLoading(true);
    try {
      await cancelTemporaryPremium(
        currentTemporaryPremium.id,
        'admin-user' // TODO: Remplacer par l'ID de l'admin connecté
      );

      onUpdate();
      toast({
        title: "Premium annulé",
        description: "Le premium temporaire a été annulé",
        variant: "success"
      });

      // Réinitialiser le formulaire
      setCurrentTemporaryPremium(null);
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setEndDate(defaultDate.toISOString().split('T')[0]);
      setAdminNotes('');

    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast({
        title: "Erreur d'annulation",
        description: error instanceof Error ? error.message : "Erreur lors de l'annulation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!currentTemporaryPremium) return 0;
    const now = new Date();
    const endDate = currentTemporaryPremium.expiresAt.toDate();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6">
      {/* Statut actuel */}
      {currentTemporaryPremium && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Premium temporaire actif</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Expire le :</span>
              <span className="font-medium text-blue-900">
                {formatDate(currentTemporaryPremium.expiresAt.toDate())}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Jours restants :</span>
              <span className="font-medium text-blue-900">
                {getDaysRemaining()} jour(s)
              </span>
            </div>
            {currentTemporaryPremium.adminNotes && (
              <div className="pt-2 border-t border-blue-200">
                <span className="text-blue-700">Notes :</span>
                <p className="text-blue-900 mt-1">{currentTemporaryPremium.adminNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formulaire */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="endDate">Date de fin du premium temporaire</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={disabled || loading}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Le premium sera automatiquement désactivé à cette date
          </p>
        </div>

        <div>
          <Label htmlFor="adminNotes">Notes admin (optionnel)</Label>
          <Textarea
            id="adminNotes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            disabled={disabled || loading}
            placeholder="Raison de l'activation, contexte..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>

      {/* Actions */}
      <DialogFooter className="flex gap-2">
        {currentTemporaryPremium ? (
          <>
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              disabled={disabled || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Annulation...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </>
              )}
            </Button>
            <Button 
              onClick={handleExtend}
              disabled={disabled || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Prolongation...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Prolonger
                </>
              )}
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleActivate}
            disabled={disabled || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Activation...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Activer Premium Temporaire
              </>
            )}
          </Button>
        )}
      </DialogFooter>
    </div>
  );
}
