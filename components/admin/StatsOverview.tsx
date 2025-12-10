"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Euro, 
  ShoppingCart, 
  UserMinus,
  Calendar,
  RefreshCw
} from "lucide-react";
import { getStats, calculateDerivedMetrics, resetMonthlyMetrics } from "@/lib/stats-utils";

interface OfferData {
  activeSubscribers: number;
  totalSold: number;
  sitesSold: number;
  sitesOffered: number;
  monthlyRevenue: number;
  totalRevenue: number;
  churnCount: number;
}

interface MarketplaceData {
  totalSales: number;
  totalRevenue: number;
  averagePrice: number;
  thisMonthSales: number;
}

interface StatsData {
  totalArtisans: number;
  activeSubscribers: number;
  mrr: number;
  arr: number;
  offerBreakdown: {
    [key: string]: OfferData | MarketplaceData;
  };
  monthlyMetrics: {
    currentMonth: {
      newSubscriptions: number;
      churnedSubscriptions: number;
      netGrowth: number;
      mrrGrowth: number;
      marketplaceSales: number;
      marketplaceRevenue: number;
    };
    lastMonth: {
      newSubscriptions: number;
      churnedSubscriptions: number;
      netGrowth: number;
      mrrGrowth: number;
      marketplaceSales: number;
      marketplaceRevenue: number;
    };
  };
}

export default function StatsOverview() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [derivedMetrics, setDerivedMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await getStats();
      if (data) {
        setStats(data);
        setDerivedMetrics(calculateDerivedMetrics(data));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetMonthlyMetrics = async () => {
    setIsResetting(true);
    try {
      await resetMonthlyMetrics();
      await loadStats(); // Recharger les stats
      console.log("Métriques mensuelles réinitialisées");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Aucune statistique disponible</p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.mrr)}</div>
            <p className="text-xs text-muted-foreground">
              ARR: {formatCurrency(stats.arr)}
            </p>
            {stats.monthlyMetrics.currentMonth.mrrGrowth !== 0 && (
              <div className="flex items-center text-xs mt-1">
                {stats.monthlyMetrics.currentMonth.mrrGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stats.monthlyMetrics.currentMonth.mrrGrowth > 0 ? "text-green-500" : "text-red-500"}>
                  {formatCurrency(Math.abs(stats.monthlyMetrics.currentMonth.mrrGrowth))} ce mois
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abonnés actifs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnés actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              Croissance nette: {stats.monthlyMetrics.currentMonth.netGrowth > 0 ? '+' : ''}{stats.monthlyMetrics.currentMonth.netGrowth}
            </p>
            {derivedMetrics.churnRate > 0 && (
              <p className="text-xs text-red-500 mt-1">
                Taux de churn: {derivedMetrics.churnRate}%
              </p>
            )}
          </CardContent>
        </Card>

        {/* Ventes marketplace */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.offerBreakdown.marketplace as MarketplaceData)?.thisMonthSales || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ventes ce mois ({formatCurrency(stats.monthlyMetrics.currentMonth.marketplaceRevenue)})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {(stats.offerBreakdown.marketplace as MarketplaceData)?.totalSales || 0} ventes
            </p>
          </CardContent>
        </Card>

        {/* Nouveaux abonnements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats.monthlyMetrics.currentMonth.newSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">
              Nouveaux abonnements
            </p>
            {stats.monthlyMetrics.currentMonth.churnedSubscriptions > 0 && (
              <p className="text-xs text-red-500 mt-1">
                -{stats.monthlyMetrics.currentMonth.churnedSubscriptions} désabonnements
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Détail par offre */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détail par offre</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetMonthlyMetrics}
            disabled={isResetting}
          >
            {isResetting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4 mr-2" />
            )}
            Nouveau mois
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.offerBreakdown).map(([offerKey, offerData]) => {
              if (offerKey === 'marketplace') return null;
              
              // Type guard pour s'assurer qu'on a une OfferData
              const offer = offerData as OfferData;
              const price = offerKey.replace('offer', '');
              
              return (
                <Card key={offerKey} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      Offre {price}€
                      <Badge variant="secondary">
                        {offer.activeSubscribers} actifs
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>MRR:</span>
                      <span className="font-medium">{formatCurrency(offer.monthlyRevenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total vendu:</span>
                      <span className="font-medium">{offer.totalSold}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sites vendus:</span>
                      <span className="font-medium text-green-600">{offer.sitesSold}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sites offerts:</span>
                      <span className="font-medium text-blue-600">{offer.sitesOffered}</span>
                    </div>
                    {offer.churnCount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Désabonnements:</span>
                        <span className="font-medium text-red-600">{offer.churnCount}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Revenus totaux:</span>
                        <span>{formatCurrency(offer.totalRevenue)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Marketplace */}
            {stats.offerBreakdown.marketplace && (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    Marketplace
                    <Badge variant="secondary">
                      {(stats.offerBreakdown.marketplace as MarketplaceData).totalSales} ventes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Prix moyen:</span>
                    <span className="font-medium">{formatCurrency((stats.offerBreakdown.marketplace as MarketplaceData).averagePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ce mois:</span>
                    <span className="font-medium text-green-600">{(stats.offerBreakdown.marketplace as MarketplaceData).thisMonthSales} ventes</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Revenus totaux:</span>
                      <span>{formatCurrency((stats.offerBreakdown.marketplace as MarketplaceData).totalRevenue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparaison mensuelle */}
      {stats.monthlyMetrics.lastMonth && (
        <Card>
          <CardHeader>
            <CardTitle>Comparaison mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.monthlyMetrics.currentMonth.newSubscriptions}
                </div>
                <div className="text-xs text-muted-foreground">Nouveaux</div>
                <div className="text-xs text-gray-500">
                  vs {stats.monthlyMetrics.lastMonth.newSubscriptions} le mois dernier
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.monthlyMetrics.currentMonth.churnedSubscriptions}
                </div>
                <div className="text-xs text-muted-foreground">Désabonnements</div>
                <div className="text-xs text-gray-500">
                  vs {stats.monthlyMetrics.lastMonth.churnedSubscriptions} le mois dernier
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.monthlyMetrics.currentMonth.marketplaceRevenue)}
                </div>
                <div className="text-xs text-muted-foreground">Marketplace</div>
                <div className="text-xs text-gray-500">
                  vs {formatCurrency(stats.monthlyMetrics.lastMonth.marketplaceRevenue)} le mois dernier
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(stats.monthlyMetrics.currentMonth.mrrGrowth)}
                </div>
                <div className="text-xs text-muted-foreground">Croissance MRR</div>
                <div className="text-xs text-gray-500">
                  vs {formatCurrency(stats.monthlyMetrics.lastMonth.mrrGrowth)} le mois dernier
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
