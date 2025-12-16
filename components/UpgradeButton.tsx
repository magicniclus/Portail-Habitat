'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Crown, Loader2, Check, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState as useStateHook } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
// Note: Remplacer par votre système de toast préféré
// import { toast } from 'sonner';

interface UpgradeButtonProps {
  currentPlan?: 'basic' | 'premium' | 'premium_plus';
  monthlyPrice?: number;
  className?: string;
}

const PLANS = {
  basic: {
    name: 'Basic',
    price: 69,
    color: 'bg-gray-100 text-gray-800',
    features: ['Profil artisan', 'Gestion des demandes', 'Support standard']
  },
  premium: {
    name: 'Top Artisan',
    price: 99,
    color: 'bg-yellow-100 text-yellow-800',
    features: ['Tout Basic +', 'Badge Top Artisan', 'Jusqu\'à 5 photos bannière', 'Priorité d\'affichage']
  },
  premium_plus: {
    name: 'Top Artisan Plus',
    price: 199,
    color: 'bg-purple-100 text-purple-800',
    features: ['Tout Top Artisan +', 'Vidéo de présentation', 'Support prioritaire', 'Analytics avancées']
  }
};

export default function UpgradeButton({ 
  currentPlan = 'basic', 
  monthlyPrice = 89,
  className = '' 
}: UpgradeButtonProps) {
  const { user, artisan } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'premium_plus'>('premium');
  const [prorata, setProrata] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(monthlyPrice);

  // Récupérer le prix actuel depuis les données de l'artisan
  useEffect(() => {
    if (artisan?.monthlySubscriptionPrice) {
      setCurrentPrice(artisan.monthlySubscriptionPrice);
    }
  }, [artisan]);

  // Déterminer les plans disponibles pour upgrade - seulement Top Artisan
  const availablePlans = Object.entries(PLANS).filter(([key, plan]) => {
    return key === 'premium' && plan.price > currentPrice;
  });

  // Si déjà au plan le plus élevé, ne pas afficher le bouton
  if (availablePlans.length === 0) {
    return (
      <Badge className="bg-green-100 text-green-800">
        <Crown className="h-3 w-3 mr-1" />
        Plan Maximum
      </Badge>
    );
  }

  const handleUpgrade = async () => {
    if (!user) {
      console.error('Vous devez être connecté');
      return;
    }

    setIsLoading(true);

    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/upgrade-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: 'premium',
          prorata
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upgrade');
      }

      // Succès - rediriger vers Ma fiche
      console.log(
        prorata 
          ? `Upgrade réussi ! Facturation immédiate de ${PLANS[selectedPlan].price - monthlyPrice}€`
          : `Upgrade programmé ! Changement effectif au prochain cycle.`
      );

      setIsDialogOpen(false);
      router.push('/dashboard/fiche'); // Rediriger vers la fiche données

    } catch (error: any) {
      console.error('Erreur upgrade:', error);
      console.error(error.message || 'Erreur lors de l\'upgrade');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Crown className="h-4 w-4 mr-2" />
          Devenir Top Artisan
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Devenir Top Artisan
          </DialogTitle>
          <DialogDescription>
            Débloquez des fonctionnalités avancées pour votre profil artisan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aperçu du plan Top Artisan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{PLANS.premium.name}</span>
                <Badge className={PLANS.premium.color}>
                  {PLANS.premium.price}€/mois
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {PLANS.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Options de facturation */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Options de facturation</Label>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Facturation immédiate</span>
                </div>
                <p className="text-sm text-gray-600">
                  {prorata 
                    ? `Vous payez ${PLANS[selectedPlan].price - monthlyPrice}€ maintenant pour la période restante`
                    : 'Le changement prendra effet au prochain cycle de facturation'
                  }
                </p>
              </div>
              <Switch
                checked={prorata}
                onCheckedChange={setProrata}
              />
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Plan actuel:</span>
              <span>Basic - {currentPrice}€/mois</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Nouveau plan:</span>
              <span>{PLANS.premium.name} - {PLANS.premium.price}€/mois</span>
            </div>
            {prorata && (
              <div className="flex justify-between text-sm font-medium border-t pt-2">
                <span>À payer maintenant:</span>
                <span className="text-green-600">
                  {PLANS.premium.price - currentPrice}€
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Activation en cours...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Devenir Top Artisan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
