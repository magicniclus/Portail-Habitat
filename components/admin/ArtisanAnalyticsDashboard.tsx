"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Phone, 
  Send, 
  TrendingUp,
  Calendar,
  RefreshCw,
  BarChart3
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

interface ArtisanAnalyticsDashboardProps {
  artisanId: string;
  artisanName: string;
}

export default function ArtisanAnalyticsDashboard({ 
  artisanId, 
  artisanName 
}: ArtisanAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<ArtisanAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/artisan/${artisanId}/analytics`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du chargement');
      }
      
      setAnalytics(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [artisanId]);

  // Calculer les taux de conversion
  const getConversionRates = () => {
    if (!analytics || analytics.totalViews === 0) return { phoneRate: 0, formRate: 0 };
    
    return {
      phoneRate: ((analytics.totalPhoneClicks / analytics.totalViews) * 100).toFixed(1),
      formRate: ((analytics.totalFormSubmissions / analytics.totalViews) * 100).toFixed(1)
    };
  };

  const { phoneRate, formRate } = getConversionRates();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Chargement des analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Erreur: {error}</p>
            <Button onClick={loadAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune donnée disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Analytics - {artisanName}
          </h3>
          <p className="text-sm text-gray-600">
            Statistiques d'interaction avec la fiche artisan
          </p>
        </div>
        <Button onClick={loadAnalytics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vues totales */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Vues totales</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalViews}</p>
                <p className="text-xs text-gray-500">
                  {analytics.viewsThisMonth} ce mois
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clics téléphone */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Appels</p>
                <p className="text-2xl font-bold text-green-600">{analytics.totalPhoneClicks}</p>
                <p className="text-xs text-gray-500">
                  {analytics.phoneClicksThisMonth} ce mois
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaires envoyés */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.totalFormSubmissions}</p>
                <p className="text-xs text-gray-500">
                  {analytics.formSubmissionsThisMonth} ce mois
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Taux de conversion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Taux de conversion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Vues → Appels</span>
                <Badge variant="outline" className="text-green-600">
                  {phoneRate}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(phoneRate.toString()), 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.totalPhoneClicks} appels sur {analytics.totalViews} vues
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Vues → Messages</span>
                <Badge variant="outline" className="text-purple-600">
                  {formRate}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(formRate.toString()), 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.totalFormSubmissions} messages sur {analytics.totalViews} vues
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {analytics.lastViewedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Dernière vue :</span>
                <span className="font-medium">
                  {analytics.lastViewedAt.toDate?.()?.toLocaleString('fr-FR') || 
                   new Date(analytics.lastViewedAt).toLocaleString('fr-FR')}
                </span>
              </div>
            )}
            
            {analytics.updatedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Dernière mise à jour :</span>
                <span className="font-medium">
                  {analytics.updatedAt.toDate?.()?.toLocaleString('fr-FR') || 
                   new Date(analytics.updatedAt).toLocaleString('fr-FR')}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Taux d'engagement global :</span>
              <span className="font-medium">
                {analytics.totalViews > 0 
                  ? (((analytics.totalPhoneClicks + analytics.totalFormSubmissions) / analytics.totalViews) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
