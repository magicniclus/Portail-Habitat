"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { 
  Eye, 
  Phone, 
  Send, 
  TrendingUp,
  Calendar,
  RefreshCw,
  BarChart3,
  Users,
  Target,
  Activity
} from "lucide-react";

interface ArtisanAnalytics {
  totalViews: number;
  totalPhoneClicks: number;
  totalFormSubmissions: number;
  viewsThisMonth: number;
  phoneClicksThisMonth: number;
  formSubmissionsThisMonth: number;
  lastViewedAt: any;
  updatedAt: any;
}

export default function AnalyticsPage() {
  const { user, artisan } = useAuth();
  const [analytics, setAnalytics] = useState<ArtisanAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artisanId, setArtisanId] = useState<string | null>(null);

  // Fonction pour trouver l'artisan par email si l'ID direct ne fonctionne pas
  const findArtisanId = async () => {
    if (!user?.uid) return null;

    try {
      console.log("🔍 Recherche artisan pour user:", { uid: user.uid, email: user.email });
      
      // D'abord essayer avec l'ID de l'artisan du hook useAuth
      if (artisan?.id) {
        console.log("✅ Artisan trouvé via hook useAuth:", artisan.id);
        return artisan.id;
      }

      // Sinon chercher par email
      if (user.email) {
        console.log("🔎 Recherche par email:", user.email);
        const artisansQuery = query(
          collection(db, "artisans"),
          where("email", "==", user.email)
        );
        
        const querySnapshot = await getDocs(artisansQuery);
        
        if (!querySnapshot.empty) {
          const artisanDoc = querySnapshot.docs[0];
          console.log("✅ Artisan trouvé par email:", artisanDoc.id);
          return artisanDoc.id;
        }
      }

      // Dernier recours : utiliser l'UID Firebase directement
      console.log("🔄 Utilisation UID Firebase comme fallback:", user.uid);
      return user.uid;
    } catch (error) {
      console.error("Erreur lors de la recherche de l'artisan:", error);
      // En cas d'erreur, utiliser l'UID Firebase
      return user.uid;
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🚀 Début chargement analytics");
      console.log("👤 User:", { uid: user?.uid, email: user?.email });
      console.log("🏢 Artisan (useAuth):", artisan);
      
      // Trouver l'ID de l'artisan
      const foundArtisanId = await findArtisanId();
      
      if (!foundArtisanId) {
        console.log("❌ Aucun ID artisan trouvé, utilisation d'analytics par défaut");
        setAnalytics({
          totalViews: 0,
          totalPhoneClicks: 0,
          totalFormSubmissions: 0,
          viewsThisMonth: 0,
          phoneClicksThisMonth: 0,
          formSubmissionsThisMonth: 0,
          lastViewedAt: null,
          updatedAt: null
        });
        return;
      }

      console.log("📊 Chargement analytics pour artisan:", foundArtisanId);
      setArtisanId(foundArtisanId);
      
      // Test direct Firestore d'abord
      console.log("🔍 Test direct Firestore...");
      const { doc, getDoc } = await import('firebase/firestore');
      const artisanRef = doc(db, 'artisans', foundArtisanId);
      const artisanDoc = await getDoc(artisanRef);
      
      if (artisanDoc.exists()) {
        const data = artisanDoc.data();
        console.log("📄 Document artisan trouvé:", data);
        console.log("📊 Analytics dans Firestore:", data.analytics);
        
        if (data.analytics) {
          console.log("✅ Analytics trouvées, utilisation directe");
          setAnalytics(data.analytics);
          return;
        }
      }
      
      // Si pas d'analytics directes, essayer l'API
      console.log("🔗 Test API analytics...");
      const response = await fetch(`/api/artisan/${foundArtisanId}/analytics`);
      const result = await response.json();
      
      console.log("📈 Réponse API analytics:", result);
      
      if (!response.ok) {
        console.log("⚠️ Erreur API, utilisation d'analytics par défaut");
        setAnalytics({
          totalViews: 0,
          totalPhoneClicks: 0,
          totalFormSubmissions: 0,
          viewsThisMonth: 0,
          phoneClicksThisMonth: 0,
          formSubmissionsThisMonth: 0,
          lastViewedAt: null,
          updatedAt: null
        });
        return;
      }
      
      setAnalytics(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, artisan]);

  // Calculer les taux de conversion
  const getConversionRates = () => {
    if (!analytics || analytics.totalViews === 0) return { phoneRate: 0, formRate: 0, totalRate: 0 };
    
    return {
      phoneRate: ((analytics.totalPhoneClicks / analytics.totalViews) * 100).toFixed(1),
      formRate: ((analytics.totalFormSubmissions / analytics.totalViews) * 100).toFixed(1),
      totalRate: (((analytics.totalPhoneClicks + analytics.totalFormSubmissions) / analytics.totalViews) * 100).toFixed(1)
    };
  };

  const { phoneRate, formRate, totalRate } = getConversionRates();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Statistiques de performance de votre fiche artisan</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Chargement des analytics...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Statistiques de performance de votre fiche artisan</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Erreur: {error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={loadAnalytics} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
                <Button 
                  onClick={() => window.open('/dashboard/debug-auth', '_blank')} 
                  variant="outline"
                >
                  Debug
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Statistiques de performance de votre fiche artisan</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée disponible</h3>
              <p className="text-gray-600">
                Les statistiques apparaîtront une fois que des visiteurs auront consulté votre fiche.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Statistiques de performance de votre fiche artisan
          </p>
        </div>
        <Button onClick={loadAnalytics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Vue d'ensemble */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Vue d'ensemble
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {analytics.totalViews}
              </div>
              <div className="text-sm text-blue-700 font-medium">Vues totales</div>
              <div className="text-xs text-blue-600 mt-1">
                {analytics.viewsThisMonth} ce mois
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {analytics.totalPhoneClicks}
              </div>
              <div className="text-sm text-green-700 font-medium">Appels</div>
              <div className="text-xs text-green-600 mt-1">
                {analytics.phoneClicksThisMonth} ce mois
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {analytics.totalFormSubmissions}
              </div>
              <div className="text-sm text-purple-700 font-medium">Messages</div>
              <div className="text-xs text-purple-600 mt-1">
                {analytics.formSubmissionsThisMonth} ce mois
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {totalRate}%
              </div>
              <div className="text-sm text-orange-700 font-medium">Taux d'engagement</div>
              <div className="text-xs text-orange-600 mt-1">
                Vues → Actions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vues */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Vues de votre fiche</h3>
                <p className="text-sm text-gray-600">
                  Nombre de visiteurs ayant consulté votre profil
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">{analytics.totalViews}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ce mois</span>
                <span className="font-semibold text-blue-600">{analytics.viewsThisMonth}</span>
              </div>
              {analytics.lastViewedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dernière vue</span>
                  <span className="text-xs text-gray-500">
                    {analytics.lastViewedAt.toDate?.()?.toLocaleDateString('fr-FR') || 
                     new Date(analytics.lastViewedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appels */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Appels téléphoniques</h3>
                <p className="text-sm text-gray-600">
                  Clics sur votre numéro de téléphone
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">{analytics.totalPhoneClicks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ce mois</span>
                <span className="font-semibold text-green-600">{analytics.phoneClicksThisMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de conversion</span>
                <Badge variant="outline" className="text-green-600">
                  {phoneRate}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Messages reçus</h3>
                <p className="text-sm text-gray-600">
                  Formulaires de contact envoyés
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">{analytics.totalFormSubmissions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ce mois</span>
                <span className="font-semibold text-purple-600">{analytics.formSubmissionsThisMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taux de conversion</span>
                <Badge variant="outline" className="text-purple-600">
                  {formRate}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taux de conversion détaillés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance de conversion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Vues → Appels téléphoniques</span>
                <span className="text-sm font-semibold text-green-600">{phoneRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(phoneRate.toString()), 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.totalPhoneClicks} appels sur {analytics.totalViews} vues
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Vues → Messages de contact</span>
                <span className="text-sm font-semibold text-purple-600">{formRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(formRate.toString()), 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.totalFormSubmissions} messages sur {analytics.totalViews} vues
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Engagement total (appels + messages)</span>
                <span className="text-sm font-semibold text-orange-600">{totalRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(totalRate.toString()), 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.totalPhoneClicks + analytics.totalFormSubmissions} actions sur {analytics.totalViews} vues
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
