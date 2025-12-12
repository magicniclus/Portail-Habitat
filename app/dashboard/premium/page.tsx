"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  Star, 
  Image as ImageIcon, 
  Video, 
  TrendingUp,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  isPremiumActive, 
  hasPremiumFeature, 
  getPremiumStatusDisplay,
  PremiumFeatures,
  getDefaultPremiumFeatures
} from "@/lib/premium-utils";
import PremiumBannerUpload from "@/components/premium/PremiumBannerUpload";
import PremiumBannerDisplay from "@/components/premium/PremiumBannerDisplay";
import TopArtisanBadge from "@/components/TopArtisanBadge";

export default function PremiumPage() {
  const [user, setUser] = useState<User | null>(null);
  const [artisanId, setArtisanId] = useState<string>("");
  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeatures>(getDefaultPremiumFeatures());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Écouter l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadArtisanData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Charger les données de l'artisan
  const loadArtisanData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Récupérer l'artisan par userId
      const artisansRef = collection(db, 'artisans');
      const q = query(artisansRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const artisanDoc = querySnapshot.docs[0];
        const artisanData = artisanDoc.data();
        
        setArtisanId(artisanDoc.id);
        setPremiumFeatures(artisanData.premiumFeatures || getDefaultPremiumFeatures());
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données artisan:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les modifications
  const savePremiumFeatures = async (newFeatures: PremiumFeatures) => {
    if (!artisanId) return;

    try {
      setSaving(true);
      
      const artisanRef = doc(db, 'artisans', artisanId);
      await updateDoc(artisanRef, {
        premiumFeatures: newFeatures,
        updatedAt: new Date()
      });

      setPremiumFeatures(newFeatures);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Mettre à jour les photos de bannière
  const handlePhotosChange = (photos: string[]) => {
    const newFeatures = {
      ...premiumFeatures,
      bannerPhotos: photos
    };
    savePremiumFeatures(newFeatures);
  };

  // Mettre à jour la vidéo de bannière
  const handleVideoChange = (video?: string) => {
    const newFeatures = {
      ...premiumFeatures,
      bannerVideo: video
    };
    savePremiumFeatures(newFeatures);
  };

  // Toggle du badge Top Artisan
  const toggleTopArtisanBadge = () => {
    const newFeatures = {
      ...premiumFeatures,
      showTopArtisanBadge: !premiumFeatures.showTopArtisanBadge
    };
    savePremiumFeatures(newFeatures);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !artisanId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  const isActive = isPremiumActive({ id: artisanId, premiumFeatures });
  const statusDisplay = getPremiumStatusDisplay({ id: artisanId, premiumFeatures });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fonctionnalités Premium
          </h1>
          <p className="text-gray-600">
            Améliorez votre visibilité avec nos options premium
          </p>
        </div>

        {/* Statut Premium */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Statut Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isActive ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold">{statusDisplay.label}</p>
                  {statusDisplay.daysRemaining !== undefined && statusDisplay.daysRemaining > 0 && (
                    <p className="text-sm text-gray-600">
                      {statusDisplay.daysRemaining} jours restants
                    </p>
                  )}
                </div>
              </div>
              
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Actif" : "Inactif"}
              </Badge>
            </div>

            {!isActive && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Souscrivez à notre offre premium pour débloquer toutes les fonctionnalités avancées.
                </p>
                <Button className="mt-2" size="sm">
                  Découvrir Premium
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fonctionnalités Premium */}
        {isActive && (
          <>
            {/* Badge Top Artisan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Badge "Top Artisan"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TopArtisanBadge />
                    <div>
                      <p className="font-medium">Afficher le badge "Top Artisan"</p>
                      <p className="text-sm text-gray-600">
                        Met en valeur votre expertise sur votre fiche
                      </p>
                    </div>
                  </div>
                  
                  <Switch
                    checked={premiumFeatures.showTopArtisanBadge}
                    onCheckedChange={toggleTopArtisanBadge}
                    disabled={saving}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bannières Premium */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Bannières Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Aperçu */}
                {(premiumFeatures.bannerPhotos.length > 0 || premiumFeatures.bannerVideo) && (
                  <div>
                    <h3 className="font-medium mb-3">Aperçu</h3>
                    <PremiumBannerDisplay
                      photos={premiumFeatures.bannerPhotos}
                      video={premiumFeatures.bannerVideo}
                      height="h-48"
                    />
                  </div>
                )}

                <Separator />

                {/* Gestion des uploads */}
                <PremiumBannerUpload
                  artisanId={artisanId}
                  currentPhotos={premiumFeatures.bannerPhotos}
                  currentVideo={premiumFeatures.bannerVideo}
                  onPhotosChange={handlePhotosChange}
                  onVideoChange={handleVideoChange}
                />
              </CardContent>
            </Card>

            {/* Avantages Premium */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vos avantages Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Bannières multiples</p>
                      <p className="text-sm text-gray-600">Jusqu'à 5 photos en carrousel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Vidéo de présentation</p>
                      <p className="text-sm text-gray-600">Présentez votre savoir-faire</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Badge "Top Artisan"</p>
                      <p className="text-sm text-gray-600">Marque de qualité visible</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Priorité d'affichage</p>
                      <p className="text-sm text-gray-600">Apparaissez en premier</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
