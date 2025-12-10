"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Home,
  TrendingUp,
  Calendar,
  Euro,
  FileText,
  ArrowLeft
} from "lucide-react";
import { 
  getPurchasedLeadDetails,
  formatPrestationLevel,
  formatTimeline,
  formatPrice,
  type PurchasedLead
} from "@/lib/marketplace-data";
import Link from "next/link";
import { useAuth } from "../../../../../hooks/useAuth";

export default function PurchaseSuccessPage() {
  const params = useParams();
  const { user, artisan } = useAuth();
  
  const [lead, setLead] = useState<PurchasedLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leadId = params.leadId as string;

  useEffect(() => {
    const loadPurchasedLead = async (retryCount = 0) => {
      if (!leadId || !artisan) {
        setError("Paramètres manquants");
        setIsLoading(false);
        return;
      }

      try {
        const purchasedLead = await getPurchasedLeadDetails(leadId, artisan.id);
        
        if (!purchasedLead) {
          setError("Lead introuvable ou non acheté");
          setIsLoading(false);
        } else {
          setLead(purchasedLead);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement du lead acheté:", err);
        
        // Si l'artisan n'est pas autorisé et qu'on n'a pas encore réessayé 3 fois
        if (err.message?.includes("non autorisé") && retryCount < 3) {
          console.log(`Tentative ${retryCount + 1}/3 - Attente de la confirmation de l'achat...`);
          // Attendre 2 secondes puis réessayer
          setTimeout(() => {
            loadPurchasedLead(retryCount + 1);
          }, 2000);
          return;
        }
        
        setError("Impossible de charger les détails du lead");
        setIsLoading(false);
      }
    };

    if (artisan) {
      loadPurchasedLead();
    }
  }, [leadId, artisan]);

  if (!user || !artisan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-yellow-200 bg-yellow-50">
          <CheckCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Connexion requise pour voir cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
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

  if (error || !lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <CheckCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error || "Lead introuvable"}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/dashboard/marketplace">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la bourse
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header de succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Achat confirmé !
          </h1>
          <p className="text-gray-600">
            Vous avez maintenant accès aux coordonnées complètes du client
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coordonnées du client */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Phone className="h-5 w-5" />
                Coordonnées du client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Nom du client</div>
                    <div className="font-semibold text-gray-900">{lead.clientName}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <a 
                      href={`tel:${lead.clientPhone}`}
                      className="font-medium text-green-600 hover:text-green-700"
                    >
                      {lead.clientPhone}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a 
                      href={`mailto:${lead.clientEmail}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {lead.clientEmail}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700">
                      {lead.city}
                      {lead.department && ` (${lead.department})`}
                    </span>
                  </div>
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Conseil :</strong> Contactez le client rapidement pour maximiser 
                  vos chances de décrocher le projet.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Détails du projet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails du projet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Type de projet</div>
                <div className="font-semibold text-gray-900">{lead.projectType}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span>
                    {lead.propertyType}
                    {lead.surface && ` • ${lead.surface}m²`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span>Niveau : {formatPrestationLevel(lead.prestationLevel)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Délai : {formatTimeline(lead.timeline)}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Budget estimé</div>
                <div className="text-xl font-bold text-blue-600">
                  {formatPrice(lead.estimationLow)} - {formatPrice(lead.estimationHigh)}
                </div>
              </div>

              {lead.existingState && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">État existant</div>
                  <Badge variant="outline" className="capitalize">
                    {lead.existingState.replace('_', ' ')}
                  </Badge>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Acheté le :</span>
                  <span className="font-medium">
                    {lead.purchasedAt.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Prix payé :</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(lead.price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            size="lg"
            asChild
          >
            <Link href="/dashboard/demandes?tab=bought">
              <FileText className="h-5 w-5 mr-2" />
              Voir l'appel d'offres
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
