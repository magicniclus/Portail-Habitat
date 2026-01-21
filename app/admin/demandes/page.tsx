"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, where, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, ADMIN_ROLES, logAdminAction } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  TrendingUp,
  Loader2,
  Eye,
  UserPlus,
  Filter,
  Trash2,
  AlertTriangle
} from "lucide-react";

interface Prospect {
  id: string;
  sessionId: string;
  funnelStep: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  department?: string;
  propertyType?: string;
  prestationType?: string;
  surface?: number;
  searchesLast24h?: number;
  demandsLast30d?: number;
  selectedZoneRadius?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  createdAt: any;
  updatedAt?: any;
}

const FUNNEL_STEPS = [
  { value: 'step1', label: 'Étape 1 - Informations' },
  { value: 'step2', label: 'Étape 2 - Localisation' },
  { value: 'step3', label: 'Étape 3 - Contact' },
  { value: 'abandoned', label: 'Abandonné' },
  { value: 'completed', label: 'Terminé' },
  { value: 'contacted', label: 'Contacté' }
];

export default function DemandesPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStep, setSelectedStep] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    checkPermissions();
    loadProspects();
  }, []);

  const checkPermissions = async () => {
    try {
      const admin = await getCurrentAdmin();
      const canDeleteProspects = admin ? (admin.adminRole === ADMIN_ROLES.SUPER_ADMIN || admin.adminRole === ADMIN_ROLES.CONTENT_ADMIN) : false;
      setCanDelete(canDeleteProspects);
    } catch (error) {
      console.error('Erreur vérification permissions:', error);
    }
  };

  useEffect(() => {
    filterProspects();
  }, [prospects, searchTerm, selectedStep, selectedSource]);

  const loadProspects = async () => {
    try {
      setLoading(true);
      const prospectsQuery = query(
        collection(db, "prospects"),
        orderBy("createdAt", "desc")
      );
      
      const prospectsSnapshot = await getDocs(prospectsQuery);
      const prospectsData = prospectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prospect[];
      
      setProspects(prospectsData);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProspects = () => {
    let filtered = prospects;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(prospect => 
        prospect.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.prestationType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par étape
    if (selectedStep !== "all") {
      filtered = filtered.filter(prospect => prospect.funnelStep === selectedStep);
    }

    // Filtre par source
    if (selectedSource !== "all") {
      filtered = filtered.filter(prospect => prospect.utm_source === selectedSource);
    }

    setFilteredProspects(filtered);
  };

  const toggleSelectProspect = (prospectId: string) => {
    setSelectedProspects(prev => 
      prev.includes(prospectId)
        ? prev.filter(id => id !== prospectId)
        : [...prev, prospectId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProspects.length === filteredProspects.length) {
      setSelectedProspects([]);
    } else {
      setSelectedProspects(filteredProspects.map(p => p.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProspects.length === 0 || !canDelete) return;

    setIsDeleting(true);
    try {
      // Supprimer chaque prospect sélectionné
      for (const prospectId of selectedProspects) {
        const prospect = prospects.find(p => p.id === prospectId);
        if (prospect) {
          // Logger l'action
          await logAdminAction(
            'delete_prospect',
            {
              prospectId: prospect.id,
              firstName: prospect.firstName || 'Non renseigné',
              lastName: prospect.lastName || 'Non renseigné',
              email: prospect.email || 'Non renseigné',
              funnelStep: prospect.funnelStep || 'unknown',
              city: prospect.city || 'Non renseigné'
            }
          );

          // Supprimer le prospect
          await deleteDoc(doc(db, "prospects", prospectId));
        }
      }
      
      // Mettre à jour l'état local
      setProspects(prospects.filter(p => !selectedProspects.includes(p.id)));
      setSelectedProspects([]);
      
      // Fermer la modal
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression des prospects. Veuillez réessayer.');
    } finally {
      setIsDeleting(false);
    }
  };


  const getFunnelBadge = (step: string) => {
    const stepConfig = {
      step1: { label: "Étape 1", className: "bg-blue-100 text-blue-800" },
      step2: { label: "Étape 2", className: "bg-yellow-100 text-yellow-800" },
      step3: { label: "Étape 3", className: "bg-orange-100 text-orange-800" },
      abandoned: { label: "Abandonné", className: "bg-red-100 text-red-800" },
      completed: { label: "Terminé", className: "bg-green-100 text-green-800" },
      contacted: { label: "Contacté", className: "bg-purple-100 text-purple-800" }
    };
    
    const config = stepConfig[step as keyof typeof stepConfig] || 
                   { label: step, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getUniqueValues = (field: keyof Prospect) => {
    const values = prospects
      .map(p => p[field])
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return values as string[];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes CRM</h1>
          <p className="text-gray-600">Gestion des prospects et demandes clients</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedProspects.length > 0 ? (
            <>
              <Badge variant="secondary" className="text-sm">
                {selectedProspects.length} sélectionné{selectedProspects.length > 1 ? 's' : ''}
              </Badge>
              {canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer ({selectedProspects.length})
                </Button>
              )}
            </>
          ) : (
            <Badge variant="outline" className="text-sm">
              {filteredProspects.length} / {prospects.length} demandes
            </Badge>
          )}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{prospects.length}</div>
                <div className="text-sm text-gray-600">Total prospects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {prospects.filter(p => p.funnelStep === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Terminés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {prospects.filter(p => ['step1', 'step2', 'step3'].includes(p.funnelStep)).length}
                </div>
                <div className="text-sm text-gray-600">En cours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Filter className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {prospects.filter(p => p.funnelStep === 'abandoned').length}
                </div>
                <div className="text-sm text-gray-600">Abandonnés</div>
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
            
            <Select value={selectedStep} onValueChange={setSelectedStep}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Étape du tunnel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les étapes</SelectItem>
                {FUNNEL_STEPS.map((step) => (
                  <SelectItem key={step.value} value={step.value}>
                    {step.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes sources</SelectItem>
                {getUniqueValues('utm_source').map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des prospects */}
      <div className="space-y-4">
        {/* Checkbox Tout sélectionner */}
        {filteredProspects.length > 0 && canDelete && (
          <Card className="bg-gray-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={selectedProspects.length === filteredProspects.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Tout sélectionner ({filteredProspects.length})
                  </label>
                </div>
                {selectedProspects.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer ({selectedProspects.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredProspects.map((prospect) => (
          <Card key={prospect.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Checkbox de sélection */}
                  {canDelete && (
                    <Checkbox
                      checked={selectedProspects.includes(prospect.id)}
                      onCheckedChange={() => toggleSelectProspect(prospect.id)}
                    />
                  )}
                  
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        {prospect.firstName} {prospect.lastName}
                      </h3>
                      {getFunnelBadge(prospect.funnelStep)}
                    </div>
                  
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{prospect.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {prospect.phone ? (
                          <a 
                            href={`tel:${prospect.phone}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {prospect.phone}
                          </a>
                        ) : (
                          <span>Non renseigné</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{prospect.city} ({prospect.postalCode})</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right text-xs text-gray-500">
                    <div>
                      {prospect.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')} • {prospect.createdAt?.toDate?.()?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/demandes/${prospect.id}?returnTo=/admin/demandes`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Voir ce prospect
                    </Link>
                  </Button>
                  
                  {canDelete && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setSelectedProspects([prospect.id]);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProspects.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
          <p className="text-gray-600">Aucun prospect ne correspond à vos critères de recherche.</p>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-4">
                <p className="text-base font-medium text-gray-900">
                  Êtes-vous sûr de vouloir supprimer {selectedProspects.length === 1 ? 'ce prospect' : `ces ${selectedProspects.length} prospects`} ?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Cette action est irréversible
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Toutes les données {selectedProspects.length === 1 ? 'du prospect seront supprimées' : 'des prospects seront supprimées'}</li>
                    <li>L'historique des interactions sera perdu</li>
                    <li>Cette action sera enregistrée dans les logs admin</li>
                  </ul>
                </div>
                {selectedProspects.length === 1 && (
                  (() => {
                    const prospect = prospects.find(p => p.id === selectedProspects[0]);
                    return prospect ? (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Prospect :</span>{' '}
                          {prospect.firstName} {prospect.lastName}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Email :</span> {prospect.email || 'Non renseigné'}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Étape :</span>{' '}
                          {FUNNEL_STEPS.find(s => s.value === prospect.funnelStep)?.label || prospect.funnelStep}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Ville :</span>{' '}
                          {prospect.city || 'Non renseigné'}
                        </p>
                      </div>
                    ) : null;
                  })()
                )}
                {selectedProspects.length > 1 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium">
                      {selectedProspects.length} prospects sélectionnés
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedProspects([]);
              }}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Suppression en cours...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer définitivement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
