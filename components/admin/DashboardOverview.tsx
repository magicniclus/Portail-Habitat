"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Euro, 
  ShoppingCart
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { getStats, calculateDerivedMetrics } from "@/lib/stats-utils";
// Imports admin-data supprimés car maintenant dans OverviewDashboard
import Link from "next/link";

interface StatsData {
  totalArtisans: number;
  activeSubscribers: number;
  mrr: number;
  arr: number;
  totalUpsellRevenue?: number;
  offerBreakdown: {
    [key: string]: {
      activeSubscribers: number;
      totalSold: number;
      sitesSold: number;
      sitesOffered: number;
      monthlyRevenue: number;
      totalRevenue: number;
      churnCount: number;
    } | {
      totalSales: number;
      totalRevenue: number;
      averagePrice: number;
      thisMonthSales: number;
    };
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

// Supprimé car maintenant défini dans admin-data.ts

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardOverview() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [derivedMetrics, setDerivedMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await getStats();
      if (data) {
        setStats(data);
        setDerivedMetrics(calculateDerivedMetrics(data));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadStats();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Préparer les données pour les graphiques
  const prepareChartData = () => {
    if (!stats) return { offerData: [], trendData: [], revenueData: [] };

    // Données par offre pour le graphique en secteurs
    const offerData = Object.entries(stats.offerBreakdown)
      .filter(([key]) => key !== 'marketplace')
      .map(([key, data], index) => ({
        name: `Offre ${key.replace('offer', '')}€`,
        value: (data as any).activeSubscribers || 0,
        revenue: (data as any).monthlyRevenue || 0,
        color: COLORS[index % COLORS.length]
      }));

    // Données de tendance (simulées pour l'exemple)
    const trendData = [
      { month: 'Août', abonnes: 85, mrr: 7565, marketplace: 12 },
      { month: 'Sept', abonnes: 92, mrr: 8188, marketplace: 18 },
      { month: 'Oct', abonnes: 98, mrr: 8722, marketplace: 25 },
      { month: 'Nov', abonnes: 105, mrr: 9345, marketplace: 31 },
      { month: 'Déc', abonnes: stats.activeSubscribers, mrr: stats.mrr, marketplace: stats.monthlyMetrics.currentMonth.marketplaceSales },
    ];

    // Données de revenus par type
    const revenueData = [
      { type: 'Abonnements', montant: stats.mrr, pourcentage: 85 },
      { type: 'Marketplace', montant: stats.monthlyMetrics.currentMonth.marketplaceRevenue, pourcentage: 10 },
      { type: 'Upsells', montant: stats.totalUpsellRevenue || 0, pourcentage: 5 },
    ];

    return { offerData, trendData, revenueData };
  };

  const { offerData, trendData, revenueData } = prepareChartData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Métriques principales skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Graphiques skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Aucune statistique disponible</p>
          <Button className="mt-4" onClick={loadStats}>
            Recharger
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <Euro className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.mrr)}</div>
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
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnés actifs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              Croissance: {stats.monthlyMetrics.currentMonth.netGrowth > 0 ? '+' : ''}{stats.monthlyMetrics.currentMonth.netGrowth}
            </p>
            {derivedMetrics.churnRate > 0 && (
              <p className="text-xs text-red-500 mt-1">
                Taux de churn: {derivedMetrics.churnRate}%
              </p>
            )}
          </CardContent>
        </Card>

        {/* Marketplace */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.monthlyMetrics.currentMonth.marketplaceSales}
            </div>
            <p className="text-xs text-muted-foreground">
              Ventes ce mois ({formatCurrency(stats.monthlyMetrics.currentMonth.marketplaceRevenue)})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total: {(stats.offerBreakdown.marketplace as any)?.totalSales || 0} ventes
            </p>
          </CardContent>
        </Card>

        {/* Artisans */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artisans</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalArtisans}</div>
            <p className="text-xs text-muted-foreground">
              Inscrits sur la plateforme
            </p>
            <p className="text-xs text-green-600 mt-1">
              {((stats.activeSubscribers / stats.totalArtisans) * 100).toFixed(1)}% d'abonnés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des abonnés et MRR */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution des métriques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'mrr' ? formatCurrency(value as number) : value,
                    name === 'abonnes' ? 'Abonnés' : name === 'mrr' ? 'MRR' : 'Marketplace'
                  ]}
                />
                <Line yAxisId="left" type="monotone" dataKey="abonnes" stroke="#3b82f6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="marketplace" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des abonnés par offre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Répartition par offre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={offerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {offerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} abonnés`, 'Nombre']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenus par type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Revenus par type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="montant" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
