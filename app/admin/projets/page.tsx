"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, where, updateDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  FileText, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Euro,
  Loader2,
  Eye,
  Send,
  Download,
  Building2,
  ShoppingCart
} from "lucide-react";

interface Estimation {
  id: string;
  sessionId: string;
  status: string;
  clientInfo: {
    firstName: string;
    phone: string;
    email: string;
    acceptsCGV: boolean;
  };
  location: {
    postalCode: string;
    city: string;
    department: string;
    coordinates?: { lat: number; lng: number };
  };
  project: {
    propertyType: string;
    prestationType: string;
    prestationSlug: string;
    surface?: number;
    responses?: Record<string, any>;
  };
  pricing?: {
    estimatedPrice: number;
    priceRange: { min: number; max: number };
    artisanCount: number;
  };
  // Champs marketplace
  isPublished?: boolean;
  marketplaceStatus?: string;
  marketplaceSales?: number;
  maxSales?: number;
  marketplacePrice?: number;
  createdAt: any;
  updatedAt?: any;
  sentAt?: any;
}

const ESTIMATION_STATUS = [
  { value: 'draft', label: 'Brouillon', className: 'bg-gray-100 text-gray-800' },
  { value: 'completed', label: 'Terminé', className: 'bg-blue-100 text-blue-800' },
  { value: 'sent', label: 'Envoyé', className: 'bg-green-100 text-green-800' },
  { value: 'expired', label: 'Expiré', className: 'bg-red-100 text-red-800' }
];

export default function ProjetsPage() {
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [filteredEstimations, setFilteredEstimations] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    loadEstimations();
  }, []);

  useEffect(() => {
    filterEstimations();
  }, [estimations, searchTerm, selectedStatus, selectedType]);

  const loadEstimations = async () => {
    try {
      setLoading(true);
      const estimationsQuery = query(
        collection(db, "estimations"),
        orderBy("createdAt", "desc")
      );
      
      const estimationsSnapshot = await getDocs(estimationsQuery);
      const estimationsData = estimationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Estimation[];
      
      setEstimations(estimationsData);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEstimations = () => {
    let filtered = estimations;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(estimation => 
        estimation.clientInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimation.clientInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimation.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estimation.project?.prestationType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (selectedStatus !== "all") {
      filtered = filtered.filter(estimation => estimation.status === selectedStatus);
    }

    // Filtre par type de prestation
    if (selectedType !== "all") {
      filtered = filtered.filter(estimation => estimation.project?.prestationType === selectedType);
    }

    setFilteredEstimations(filtered);
  };

  const updateEstimationStatus = async (estimationId: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date()
      };

      if (newStatus === 'sent') {
        updateData.sentAt = new Date();
      }

      await updateDoc(doc(db, "estimations", estimationId), updateData);
      
      // Mettre à jour l'état local
      setEstimations(estimations.map(e => 
        e.id === estimationId ? { ...e, status: newStatus, ...updateData } : e
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = ESTIMATION_STATUS.find(s => s.value === status) || 
                   { label: status, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getUniqueValues = (field: string) => {
    const values = estimations
      .map(e => {
        if (field === 'prestationType') return e.project?.prestationType;
        if (field === 'propertyType') return e.project?.propertyType;
        return null;
      })
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return values as string[];
  };

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return 'Non calculé';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets CRM</h1>
          <p className="text-gray-600">Gestion des estimations et devis clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredEstimations.length} / {estimations.length} projets
          </Badge>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{estimations.length}</div>
                <div className="text-sm text-gray-600">Total estimations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {estimations.filter(e => e.status === 'sent').length}
                </div>
                <div className="text-sm text-gray-600">Envoyées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Building2 className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {estimations.filter(e => e.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Terminées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Euro className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatPrice(
                    estimations
                      .filter(e => e.pricing?.estimatedPrice)
                      .reduce((sum, e) => sum + (e.pricing?.estimatedPrice || 0), 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">Valeur totale</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {estimations.filter(e => e.isPublished).length}
                </div>
                <div className="text-sm text-gray-600">Sur la bourse</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                {ESTIMATION_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type de prestation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes prestations</SelectItem>
                {getUniqueValues('prestationType').map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des estimations */}
      <div className="space-y-4">
        {filteredEstimations.map((estimation) => (
          <Card key={estimation.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {estimation.clientInfo?.firstName}
                    </h3>
                    {getStatusBadge(estimation.status)}
                    {/* Indicateur bourse au travail */}
                    {estimation.isPublished && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        Bourse ({estimation.marketplaceSales || 0}/{estimation.maxSales || 3})
                      </Badge>
                    )}
                    {estimation.pricing?.estimatedPrice && (
                      <Badge variant="outline" className="text-green-600">
                        {formatPrice(estimation.pricing.estimatedPrice)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{estimation.clientInfo?.email || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{estimation.clientInfo?.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{estimation.location?.city} ({estimation.location?.postalCode})</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    <div>Projet: {estimation.project?.prestationType} - {estimation.project?.propertyType}</div>
                    <div>
                      Surface: {estimation.project?.surface}m² 
                      {estimation.pricing?.artisanCount && (
                        <span> • {estimation.pricing.artisanCount} artisans disponibles</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-gray-500">
                    <div>{estimation.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}</div>
                    <div>Session: {estimation.sessionId?.slice(-8)}</div>
                    {estimation.sentAt && (
                      <div>Envoyé: {estimation.sentAt?.toDate?.()?.toLocaleDateString('fr-FR')}</div>
                    )}
                  </div>
                  
                  <Select 
                    value={estimation.status} 
                    onValueChange={(value) => updateEstimationStatus(estimation.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTIMATION_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/projets/${estimation.id}?returnTo=/admin/projets`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir ce projet
                      </Link>
                    </Button>
                    
                    {estimation.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <Send className="h-4 w-4 mr-1" />
                        Envoyer
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEstimations.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-600">Aucune estimation ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
}
