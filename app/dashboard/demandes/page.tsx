"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, MessageSquare, Phone, Mail, Loader2 } from "lucide-react";
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';

// Interface pour les leads
interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectType: string;
  city: string;
  budget: string;
  source: string;
  status: string;
  createdAt: any;
  notes: string;
}

// Fonction pour mapper les statuts Firestore vers les statuts de l'interface
const mapFirestoreStatus = (firestoreStatus: string) => {
  const statusMap: { [key: string]: string } = {
    'new': 'nouveau',
    'contacted': 'en_cours',
    'converted': 'repondu',
    'lost': 'ferme'
  };
  return statusMap[firestoreStatus] || 'nouveau';
};

// Fonction pour déterminer le type basé sur les données
const determineType = (lead: Lead) => {
  const notes = lead.notes?.toLowerCase() || '';
  const projectType = lead.projectType?.toLowerCase() || '';
  
  if (notes.includes('urgent') || projectType.includes('urgent')) {
    return 'urgence';
  }
  if (notes.includes('devis') || projectType.includes('devis')) {
    return 'devis';
  }
  if (notes.includes('information') || notes.includes('question')) {
    return 'information';
  }
  return 'devis'; // Par défaut
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    nouveau: { label: "Nouveau", className: "bg-blue-100 text-blue-800" },
    en_cours: { label: "En cours", className: "bg-yellow-100 text-yellow-800" },
    repondu: { label: "Répondu", className: "bg-green-100 text-green-800" },
    ferme: { label: "Fermé", className: "bg-gray-100 text-gray-800" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: string) => {
  const typeConfig = {
    devis: { label: "Devis", className: "bg-purple-100 text-purple-800" },
    information: { label: "Information", className: "bg-blue-100 text-blue-800" },
    urgence: { label: "Urgence", className: "bg-red-100 text-red-800" },
    suivi: { label: "Suivi", className: "bg-orange-100 text-orange-800" },
  };
  
  const config = typeConfig[type as keyof typeof typeConfig];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function DemandesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [artisanId, setArtisanId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Récupérer l'ID de l'artisan connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Récupérer l'artisan correspondant à cet utilisateur
          const artisansRef = collection(db, 'artisans');
          const q = query(artisansRef, where('userId', '==', user.uid));
          
          const unsubscribeArtisan = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
              const artisanDoc = querySnapshot.docs[0];
              setArtisanId(artisanDoc.id);
            }
          });

          return () => unsubscribeArtisan();
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'artisan:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Récupérer les leads de l'artisan
  useEffect(() => {
    if (!artisanId) return;

    const leadsRef = collection(db, 'artisans', artisanId, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsData: Lead[] = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({
          id: doc.id,
          ...doc.data()
        } as Lead);
      });
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [artisanId]);

  // Filtrer les leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === "" || 
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const mappedStatus = mapFirestoreStatus(lead.status);
    const matchesStatus = statusFilter === "all" || mappedStatus === statusFilter;
    
    const leadType = determineType(lead);
    const matchesType = typeFilter === "all" || leadType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (date: any) => {
    if (!date) return 'Date inconnue';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de vos demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes demandes</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos demandes et communications clients
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total demandes</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouvelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((lead: Lead) => mapFirestoreStatus(lead.status) === 'nouveau').length}
            </div>
            <p className="text-xs text-muted-foreground">
              À traiter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((lead: Lead) => mapFirestoreStatus(lead.status) === 'en_cours').length}
            </div>
            <p className="text-xs text-muted-foreground">
              En traitement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter((lead: Lead) => determineType(lead) === 'urgence').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Priorité haute
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par client, sujet ou message..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="devis">Devis</SelectItem>
                <SelectItem value="information">Information</SelectItem>
                <SelectItem value="urgence">Urgence</SelectItem>
                <SelectItem value="suivi">Suivi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="repondu">Répondu</SelectItem>
                <SelectItem value="ferme">Fermé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les demandes</CardTitle>
          <CardDescription>
            Liste de toutes vos demandes et communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune demande trouvée.</p>
              </div>
            ) : (
              filteredLeads.map((lead: Lead) => {
                const mappedStatus = mapFirestoreStatus(lead.status);
                const leadType = determineType(lead);
                
                return (
                  <div key={lead.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{lead.clientName}</h3>
                          {getTypeBadge(leadType)}
                          {getStatusBadge(mappedStatus)}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{lead.projectType}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{lead.notes || 'Aucune description fournie'}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{lead.clientEmail}</span>
                          <span>•</span>
                          <span>{lead.clientPhone}</span>
                          <span>•</span>
                          <span>{formatDate(lead.createdAt)}</span>
                          {lead.city && (
                            <>
                              <span>•</span>
                              <span>{lead.city}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" title="Voir les détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Envoyer un message">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Appeler le client"
                        onClick={() => window.open(`tel:${lead.clientPhone}`, '_self')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
