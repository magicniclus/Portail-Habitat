"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Euro, 
  Calendar,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Eye
} from "lucide-react";
import { 
  getBoughtLeads, 
  updateLeadStatus, 
  formatLeadStatus, 
  formatLeadSource,
  type ArtisanLead 
} from "@/lib/artisan-leads";

interface PurchasedLeadsBoardProps {
  artisanId: string;
}

export default function PurchasedLeadsBoard({ artisanId }: PurchasedLeadsBoardProps) {
  const [leads, setLeads] = useState<ArtisanLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadPurchasedLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const purchasedLeads = await getBoughtLeads(artisanId);
      setLeads(purchasedLeads);
    } catch (err) {
      console.error("Erreur lors du chargement des leads achetés:", err);
      setError("Impossible de charger vos leads achetés");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: "new" | "contacted" | "converted" | "lost") => {
    setUpdatingStatus(leadId);
    
    try {
      const success = await updateLeadStatus(artisanId, leadId, newStatus);
      
      if (success) {
        // Mettre à jour l'état local
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId 
              ? { ...lead, status: newStatus }
              : lead
          )
        );
      } else {
        throw new Error("Échec de la mise à jour");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
      // Vous pourriez ajouter une notification d'erreur ici
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    if (artisanId) {
      loadPurchasedLeads();
    }
  }, [artisanId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (leads.length === 0) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-8 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun lead acheté
          </h3>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore acheté de leads sur la marketplace.
          </p>
          <Button asChild>
            <a href="/dashboard/marketplace">
              <Eye className="h-4 w-4 mr-2" />
              Voir la bourse au travail
            </a>
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
          <h2 className="text-2xl font-bold text-gray-900">
            Leads achetés ({leads.length})
          </h2>
          <p className="text-gray-600">
            Gérez vos leads achetés sur la marketplace
          </p>
        </div>
        <Button onClick={loadPurchasedLeads} variant="outline">
          Actualiser
        </Button>
      </div>

      {/* Grille des leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => {
          const statusInfo = formatLeadStatus(lead.status);
          const sourceInfo = formatLeadSource(lead.source);
          
          return (
            <Card key={lead.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {lead.clientName || 'Client anonyme'}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{lead.city}</span>
                    </div>
                  </div>
                  <Badge className={statusInfo.color}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informations du projet */}
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Projet :</span>
                    <span className="ml-2 text-gray-700">{lead.projectType}</span>
                  </div>
                  
                  {lead.budget > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">Budget :</span>
                      <span className="ml-2 text-gray-700">{lead.budget}€</span>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm">Coordonnées client</h4>
                  
                  {lead.clientPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <a 
                        href={`tel:${lead.clientPhone}`}
                        className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                      >
                        {lead.clientPhone}
                      </a>
                    </div>
                  )}
                  
                  {lead.clientEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <a 
                        href={`mailto:${lead.clientEmail}`}
                        className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                      >
                        {lead.clientEmail}
                      </a>
                    </div>
                  )}
                </div>

                {/* Informations marketplace */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700">
                      {lead.marketplacePrice}€
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {lead.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
                    </span>
                  </div>
                </div>

                {/* Actions de statut */}
                <div className="flex gap-2 pt-2 border-t">
                  {lead.status === 'new' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(lead.id, 'contacted')}
                      disabled={updatingStatus === lead.id}
                      className="flex-1"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Contacté
                    </Button>
                  )}
                  
                  {lead.status === 'contacted' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(lead.id, 'converted')}
                        disabled={updatingStatus === lead.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Converti
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(lead.id, 'lost')}
                        disabled={updatingStatus === lead.id}
                        className="flex-1"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Perdu
                      </Button>
                    </>
                  )}
                  
                  {(lead.status === 'converted' || lead.status === 'lost') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(lead.id, 'new')}
                      disabled={updatingStatus === lead.id}
                      className="flex-1"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Réinitialiser
                    </Button>
                  )}
                </div>

                {/* Notes */}
                {lead.notes && (
                  <div className="text-xs text-gray-500 italic">
                    {lead.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
