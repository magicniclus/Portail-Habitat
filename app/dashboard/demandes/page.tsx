import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, MessageSquare, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Mes demandes - Dashboard Pro - Portail Habitat",
  description: "Gérez toutes vos demandes et communications clients.",
  robots: {
    index: false,
    follow: false,
  },
};

const demandes = [
  {
    id: 1,
    type: "devis",
    client: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "06 12 34 56 78",
    sujet: "Demande de devis - Rénovation salle de bain",
    message: "Bonjour, je souhaiterais obtenir un devis pour la rénovation complète de ma salle de bain...",
    status: "nouveau",
    date: "2024-12-03",
    priority: "high",
  },
  {
    id: 2,
    type: "information",
    client: "Pierre Martin",
    email: "p.martin@email.com",
    phone: "06 98 76 54 32",
    sujet: "Question sur vos services électricité",
    message: "Bonjour, j'aimerais savoir si vous intervenez dans le 92 pour des installations électriques...",
    status: "repondu",
    date: "2024-12-02",
    priority: "medium",
  },
  {
    id: 3,
    type: "urgence",
    client: "Sophie Laurent",
    email: "sophie.l@email.com",
    phone: "06 11 22 33 44",
    sujet: "Urgence plomberie - Fuite d'eau",
    message: "Bonjour, j'ai une fuite d'eau importante dans ma cuisine, pouvez-vous intervenir rapidement ?",
    status: "en_cours",
    date: "2024-12-01",
    priority: "high",
  },
];

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
            <div className="text-2xl font-bold">{demandes.length}</div>
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
              {demandes.filter(d => d.status === 'nouveau').length}
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
              {demandes.filter(d => d.status === 'en_cours').length}
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
              {demandes.filter(d => d.type === 'urgence').length}
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
                />
              </div>
            </div>
            <Select>
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
            <Select>
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
            {demandes.map((demande) => (
              <div key={demande.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{demande.client}</h3>
                      {getTypeBadge(demande.type)}
                      {getStatusBadge(demande.status)}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{demande.sujet}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{demande.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{demande.email}</span>
                      <span>•</span>
                      <span>{demande.phone}</span>
                      <span>•</span>
                      <span>{demande.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
