"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { RefreshCw } from "lucide-react";

export default function TestAdminDataPage() {
  const [artisans, setArtisans] = useState<RecentArtisan[]>([]);
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [demands, setDemands] = useState<RecentDemand[]>([]);
  const [quickStats, setQuickStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [artisansData, projectsData, demandsData, statsData] = await Promise.all([
        getRecentArtisans(3),
        getRecentProjects(3),
        getRecentDemands(3),
        getQuickStats()
      ]);
      
      setArtisans(artisansData);
      setProjects(projectsData);
      setDemands(demandsData);
      setQuickStats(statsData);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Admin Data
          </h1>
          <p className="text-gray-600">
            Test des fonctions de récupération des données admin
          </p>
        </div>
        <Button onClick={loadData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Artisans</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{quickStats.totalArtisans || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Artisans Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{quickStats.activeArtisans || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Projets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{quickStats.totalProjects || 0}</div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Demandes en attente</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-orange-600">{quickStats.pendingDemands || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Artisans récents */}
        <Card>
          <CardHeader>
            <CardTitle>Artisans récents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : artisans.length === 0 ? (
              <p className="text-gray-500">Aucun artisan récent</p>
            ) : (
              <div className="space-y-3">
                {artisans.map((artisan) => (
                  <div key={artisan.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{artisan.name}</p>
                      <Badge variant={artisan.status === 'active' ? 'default' : 'secondary'}>
                        {getStatusLabel(artisan.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{artisan.profession}</p>
                    <p className="text-sm text-gray-600">{artisan.company}</p>
                    <p className="text-xs text-gray-400">{formatRelativeDate(artisan.createdAt)}</p>
                    {artisan.city && (
                      <p className="text-xs text-gray-400">{artisan.city}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projets récents */}
        <Card>
          <CardHeader>
            <CardTitle>Projets récents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="text-gray-500">Aucun projet récent</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{project.clientName}</p>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{project.projectType}</p>
                    {project.estimatedBudget && (
                      <p className="text-sm font-medium text-green-600">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(project.estimatedBudget)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">{formatRelativeDate(project.createdAt)}</p>
                    {project.city && (
                      <p className="text-xs text-gray-400">{project.city}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demandes récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : demands.length === 0 ? (
              <p className="text-gray-500">Aucune demande récente</p>
            ) : (
              <div className="space-y-3">
                {demands.map((demand) => (
                  <div key={demand.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{demand.clientName}</p>
                      <Badge variant={demand.status === 'draft' ? 'destructive' : 'secondary'}>
                        {getStatusLabel(demand.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{demand.projectType}</p>
                    <p className="text-xs text-gray-400">{formatRelativeDate(demand.createdAt)}</p>
                    {demand.city && (
                      <p className="text-xs text-gray-400">{demand.city}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Debug info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ 
              artisansCount: artisans.length,
              projectsCount: projects.length,
              demandsCount: demands.length,
              quickStats 
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
