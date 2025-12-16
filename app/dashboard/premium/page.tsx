"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Star, 
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Camera,
  Video,
  Award,
  ArrowRight,
  Play
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UpgradeButton from "@/components/UpgradeButton";

export default function PremiumPage() {
  const { user, artisan, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!user || !artisan) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  // Si déjà premium, rediriger vers la fiche
  if (artisan.premiumFeatures?.isPremium) {
    return (
      <div className="text-center py-12">
        <Crown className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vous êtes déjà Premium !</h2>
        <p className="text-gray-600 mb-6">Gérez vos fonctionnalités premium depuis votre fiche artisan.</p>
        <Button asChild>
          <a href="/dashboard/fiche">Aller à ma fiche</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-12 w-12 text-yellow-600" />
            <h1 className="text-4xl font-bold text-gray-900">Devenir Top Artisan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Démarquez-vous de la concurrence et attirez plus de clients avec nos fonctionnalités Top Artisan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Colonne gauche - Vidéo et avantages */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vidéo de présentation */}
            <Card className="overflow-hidden">
              <div className="relative bg-gradient-to-r from-yellow-600 to-orange-600 aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Découvrez les avantages Top Artisan</h3>
                  <p className="text-yellow-100">Vidéo de présentation des fonctionnalités</p>
                </div>
              </div>
            </Card>

            {/* Avantages détaillés */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Badge "Top Artisan"</h3>
                    <p className="text-gray-600">Affichez votre expertise avec un badge de qualité visible sur votre profil</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Camera className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Photos multiples</h3>
                    <p className="text-gray-600">Jusqu'à 5 photos de bannière pour présenter vos réalisations</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Vidéo de présentation</h3>
                    <p className="text-gray-600">Présentez votre savoir-faire avec une vidéo personnalisée</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Priorité d'affichage</h3>
                    <p className="text-gray-600">Apparaissez en premier dans les résultats de recherche</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Statistiques */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-bold mb-4 text-center">Les Top Artisans obtiennent :</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">+150%</div>
                  <div className="text-sm text-gray-600">de visibilité</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">+85%</div>
                  <div className="text-sm text-gray-600">de contacts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">+200%</div>
                  <div className="text-sm text-gray-600">de conversions</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Colonne droite - Panneau de paiement */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6 shadow-xl border-2 border-yellow-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-800 text-sm font-medium mb-4">
                    <Zap className="h-4 w-4" />
                    Offre limitée
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">99€</div>
                  <div className="text-gray-600">par mois</div>
                  <div className="text-sm text-gray-500 line-through">129€</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Badge "Top Artisan"</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">5 photos de bannière</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Vidéo de présentation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Priorité d'affichage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Support prioritaire</span>
                  </div>
                </div>

                <UpgradeButton 
                  currentPlan="basic"
                  monthlyPrice={artisan.monthlySubscriptionPrice || 69}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
                />

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Paiement sécurisé • Annulation à tout moment</span>
                  </div>
                </div>
              </Card>

              {/* Témoignage */}
              <Card className="p-4 mt-6 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    JM
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 italic mb-2">
                      "Depuis que je suis passé Premium, j'ai triplé mes demandes de devis !"
                    </p>
                    <p className="text-xs text-gray-500">Jean-Michel, Plombier à Lyon</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
