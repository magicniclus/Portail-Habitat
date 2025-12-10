"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Clock, 
  Euro, 
  Eye, 
  ShoppingCart,
  Home,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { 
  getMarketplaceLeads,
  incrementLeadViews,
  formatPrestationLevel,
  formatTimeline,
  getTimelineColor,
  formatPrice,
  type MarketplaceLead
} from "@/lib/marketplace-data";
import Link from "next/link";

interface MarketplaceBoardProps {
  artisanProfessions?: string[];
  artisanId?: string;
  showAllLeads?: boolean;
}

export default function MarketplaceBoard({ 
  artisanProfessions = [], 
  artisanId,
  showAllLeads = false
}: MarketplaceBoardProps) {
  const [leads, setLeads] = useState<MarketplaceLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Si showAllLeads est true, on passe un tableau vide pour récupérer toutes les demandes
      const professionsFilter = showAllLeads ? [] : artisanProfessions;
      const marketplaceLeads = await getMarketplaceLeads(professionsFilter, 20, artisanId);
      setLeads(marketplaceLeads);
    } catch (err) {
      console.error("Erreur lors du chargement des leads:", err);
      setError("Impossible de charger les demandes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [artisanProfessions]);

  const handleViewLead = async (leadId: string) => {
    try {
      await incrementLeadViews(leadId);
      // Mettre à jour le compteur local
      setLeads(prev => prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, marketplaceViews: lead.marketplaceViews + 1 }
          : lead
      ));
    } catch (error) {
      console.error("Erreur lors de l'incrémentation des vues:", error);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };


  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadLeads} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bourse au chantier</h2>
          <p className="text-gray-600">
            {leads.length} demande{leads.length > 1 ? 's' : ''} disponible{leads.length > 1 ? 's' : ''}
            {showAllLeads ? (
              <span className="ml-2 text-sm">
                • Toutes les demandes publiées
              </span>
            ) : artisanProfessions.length > 0 && (
              <span className="ml-2 text-sm">
                • Filtrées pour : {artisanProfessions.join(', ')}
              </span>
            )}
          </p>
        </div>
        <Button onClick={loadLeads} variant="outline" disabled={isLoading}>
          {isLoading ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && leads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune demande disponible
            </h3>
            <p className="text-gray-500 mb-6">
              {artisanProfessions.length > 0 
                ? "Aucune demande ne correspond à vos spécialités pour le moment."
                : "Aucune demande n'est actuellement publiée sur la bourse au chantier."
              }
            </p>
            <Button onClick={loadLeads} variant="outline">
              Actualiser
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Leads grid */}
      {!isLoading && leads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => {
            return (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {lead.projectType}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{lead.city}</span>
                        {lead.department && (
                          <span className="text-gray-400">({lead.department})</span>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getTimelineColor(lead.timeline)} text-xs`}>
                      {formatTimeline(lead.timeline)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Détails du projet */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {lead.propertyType}
                        {lead.surface && ` • ${lead.surface}m²`}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Niveau : {formatPrestationLevel(lead.prestationLevel)}
                      </span>
                    </div>
                  </div>

                  {/* Estimation de prix */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Estimation du projet</div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(lead.estimationLow)} - {formatPrice(lead.estimationHigh)}
                      </span>
                      <Badge className={`${getConfidenceColor(lead.confidenceScore)} text-xs`}>
                        {lead.confidenceScore}% fiable
                      </Badge>
                    </div>
                  </div>

                  {/* Prix du lead et disponibilité */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatPrice(lead.marketplacePrice)}
                      </span>
                    </div>
                    
                  </div>

                  {/* Stats et actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{lead.marketplaceViews}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Intl.RelativeTimeFormat('fr').format(
                            Math.floor((lead.publishedAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                            'day'
                          )}
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleViewLead(lead.id)}
                      asChild
                    >
                      <Link href={`/dashboard/marketplace/purchase/${lead.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Répondre
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info footer */}
      {!isLoading && leads.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Comment ça marche ?</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Cliquez sur "Répondre" pour voir plus de détails et acheter le contact</li>
                  <li>• Une fois acheté, vous recevrez les coordonnées complètes du client</li>
                  <li>• Chaque demande est limitée à {leads[0]?.maxSales || 3} artisans maximum</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
