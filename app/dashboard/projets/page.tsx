"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Phone,
  Mail,
  MapPin,
  Home,
  TrendingUp,
  Calendar,
  Euro,
  FileText,
  AlertCircle,
  ShoppingCart,
  Eye
} from "lucide-react";
import { 
  getArtisanPurchasedLeads,
  formatPrestationLevel,
  formatTimeline,
  formatPrice,
  type PurchasedLead
} from "@/lib/marketplace-data";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

export default function ArtisanProjectsPage() {
  const { user, artisan, isLoading: authLoading } = useAuth();
  
  const [purchasedLeads, setPurchasedLeads] = useState<PurchasedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPurchasedLeads = async () => {
      if (!artisan) {
        setIsLoading(false);
        return;
      }

      try {
        const leads = await getArtisanPurchasedLeads(artisan.id);
        setPurchasedLeads(leads);
      } catch (err) {
        console.error("Erreur lors du chargement des projets:", err);
        setError("Impossible de charger vos projets");
      } finally {
        setIsLoading(false);
      }
    };

    if (artisan) {
      loadPurchasedLeads();
    }
  }, [artisan]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || !artisan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Vous devez être connecté en tant qu'artisan pour voir vos projets.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
            <p className="text-gray-600">
              {purchasedLeads.length} projet{purchasedLeads.length > 1 ? 's' : ''} acheté{purchasedLeads.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/marketplace">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Bourse au travail
            </Link>
          </Button>
        </div>

        {/* Empty state */}
        {purchasedLeads.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun projet acheté
              </h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore acheté de leads sur la bourse au travail.
              </p>
              <Button asChild>
                <Link href="/dashboard/marketplace">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Découvrir la bourse
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Projects grid */}
        {purchasedLeads.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {purchasedLeads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
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
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Acheté
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Coordonnées client */}
                  <div className="bg-green-50 rounded-lg p-3 space-y-2">
                    <div className="font-medium text-gray-900">{lead.clientName}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-green-600" />
                      <a 
                        href={`tel:${lead.clientPhone}`}
                        className="font-medium text-green-600 hover:text-green-700"
                      >
                        {lead.clientPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <a 
                        href={`mailto:${lead.clientEmail}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {lead.clientEmail}
                      </a>
                    </div>
                  </div>

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

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Délai : {formatTimeline(lead.timeline)}
                      </span>
                    </div>
                  </div>

                  {/* Budget estimé */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Budget estimé du client</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(lead.estimationLow)} - {formatPrice(lead.estimationHigh)}
                    </div>
                  </div>

                  {/* Infos d'achat */}
                  <div className="flex items-center justify-between pt-2 border-t text-sm">
                    <div className="text-gray-600">
                      Acheté le {lead.purchasedAt.toLocaleDateString('fr-FR')}
                    </div>
                    <div className="font-medium text-green-600">
                      {formatPrice(lead.price)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      asChild
                    >
                      <a href={`tel:${lead.clientPhone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </a>
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <a href={`mailto:${lead.clientEmail}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </a>
                    </Button>

                    <Button 
                      size="sm" 
                      variant="outline"
                      asChild
                    >
                      <Link href={`/dashboard/marketplace/success/${lead.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info footer */}
        {purchasedLeads.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Conseils pour maximiser vos chances</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Contactez rapidement le client après l'achat</li>
                    <li>• Préparez un devis personnalisé basé sur ses besoins</li>
                    <li>• Mettez en avant votre expertise et vos références</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
