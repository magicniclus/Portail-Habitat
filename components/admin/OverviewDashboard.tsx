"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  FileText, 
  Briefcase, 
  Eye,
  ArrowRight,
  UserCheck,
  TrendingUp,
  Euro,
  ShoppingCart,
  BarChart3
} from "lucide-react";
import { 
  getRecentArtisans, 
  getRecentProjects, 
  getRecentDemands,
  getQuickStats,
  formatRelativeDate,
  getStatusLabel,
  type RecentArtisan,
  type RecentProject,
  type RecentDemand
} from "@/lib/admin-data";
import { getStats } from "@/lib/stats-utils";
import Link from "next/link";

export default function OverviewDashboard() {
  const [recentArtisans, setRecentArtisans] = useState<RecentArtisan[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentDemands, setRecentDemands] = useState<RecentDemand[]>([]);
  const [quickStats, setQuickStats] = useState<any>({});
  const [mainStats, setMainStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [artisans, projects, demands, stats, mainStatsData] = await Promise.all([
        getRecentArtisans(4),
        getRecentProjects(4),
        getRecentDemands(4),
        getQuickStats(),
        getStats()
      ]);
      
      setRecentArtisans(artisans);
      setRecentProjects(projects);
      setRecentDemands(demands);
      setQuickStats(stats);
      setMainStats(mainStatsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* KPI Cards skeleton */}
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
        
        {/* Recent data skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec lien vers statistiques détaillées */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600">Aperçu rapide de l'activité de la plateforme</p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard">
            <BarChart3 className="w-4 h-4 mr-2" />
            Statistiques détaillées
          </Link>
        </Button>
      </div>

      {/* KPI principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <Euro className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mainStats ? formatCurrency(mainStats.mrr || 0) : '0€'}
            </div>
            <p className="text-xs text-muted-foreground">
              {mainStats ? `${mainStats.activeSubscribers || 0} abonnés actifs` : 'Chargement...'}
            </p>
          </CardContent>
        </Card>

        {/* Total Artisans */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artisans</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{quickStats.totalArtisans || 0}</div>
            <p className="text-xs text-muted-foreground">
              {quickStats.activeArtisans || 0} actifs
            </p>
          </CardContent>
        </Card>

        {/* Total Projets */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{quickStats.totalProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              {quickStats.pendingDemands || 0} en attente
            </p>
          </CardContent>
        </Card>

        {/* Marketplace */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
            <ShoppingCart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mainStats?.monthlyMetrics?.currentMonth?.marketplaceSales || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ventes ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/admin/utilisateurs">
                <UserCheck className="h-6 w-6" />
                Gérer artisans
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/admin/projets">
                <Briefcase className="h-6 w-6" />
                Voir projets
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/admin/demandes">
                <FileText className="h-6 w-6" />
                Voir demandes
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link href="/admin/dashboard">
                <BarChart3 className="h-6 w-6" />
                Statistiques
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Données récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artisans récents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5" />
              Artisans récents
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/utilisateurs">
                Voir tous <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentArtisans.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun artisan récent</p>
            ) : (
              recentArtisans.map((artisan) => (
                <div key={artisan.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{artisan.name}</p>
                    <p className="text-sm text-gray-500">{artisan.profession}</p>
                    <p className="text-xs text-gray-400">{formatRelativeDate(artisan.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={artisan.status === 'active' ? 'default' : 'secondary'}>
                      {getStatusLabel(artisan.status)}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/artisans/${artisan.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Projets récents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5" />
              Projets récents
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/projets">
                Voir tous <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun projet récent</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{project.clientName}</p>
                    <p className="text-sm text-gray-500">{project.projectType}</p>
                    <p className="text-xs text-gray-400">{formatRelativeDate(project.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(project.estimatedBudget || 0)}</p>
                      <Badge variant={project.status === 'active' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/projets/${project.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Demandes récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Demandes récentes
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/demandes">
                Voir toutes <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDemands.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune demande récente</p>
            ) : (
              recentDemands.map((demand) => (
                <div key={demand.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{demand.clientName}</p>
                    <p className="text-sm text-gray-500">{demand.projectType}</p>
                    <p className="text-xs text-gray-400">{formatRelativeDate(demand.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={demand.status === 'draft' ? 'destructive' : demand.status === 'assigned' ? 'default' : 'secondary'}>
                      {getStatusLabel(demand.status)}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/demandes/${demand.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
