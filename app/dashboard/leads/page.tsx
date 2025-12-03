import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, MessageSquare, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Leads - Dashboard Pro - Portail Habitat",
  description: "Gérez tous vos leads et demandes de devis.",
  robots: {
    index: false,
    follow: false,
  },
};

const leads = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "06 12 34 56 78",
    project: "Rénovation salle de bain",
    budget: "8 000€ - 12 000€",
    status: "nouveau",
    location: "Paris 15ème",
    date: "2024-12-03",
    priority: "high",
  },
  {
    id: 2,
    name: "Pierre Martin",
    email: "p.martin@email.com",
    phone: "06 98 76 54 32",
    project: "Installation électrique",
    budget: "3 000€ - 5 000€",
    status: "contacte",
    location: "Boulogne-Billancourt",
    date: "2024-12-02",
    priority: "medium",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.l@email.com",
    phone: "06 11 22 33 44",
    project: "Peinture appartement",
    budget: "2 000€ - 4 000€",
    status: "devis_envoye",
    location: "Neuilly-sur-Seine",
    date: "2024-12-01",
    priority: "low",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    nouveau: { label: "Nouveau", className: "bg-blue-100 text-blue-800" },
    contacte: { label: "Contacté", className: "bg-yellow-100 text-yellow-800" },
    devis_envoye: { label: "Devis envoyé", className: "bg-green-100 text-green-800" },
    refuse: { label: "Refusé", className: "bg-red-100 text-red-800" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  const priorityConfig = {
    high: { label: "Haute", className: "bg-red-100 text-red-800" },
    medium: { label: "Moyenne", className: "bg-orange-100 text-orange-800" },
    low: { label: "Basse", className: "bg-gray-100 text-gray-800" },
  };
  
  const config = priorityConfig[priority as keyof typeof priorityConfig];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            Gérez vos demandes de devis et prospects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau lead
        </Button>
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
                  placeholder="Rechercher par nom, email ou projet..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="nouveau">Nouveau</SelectItem>
                <SelectItem value="contacte">Contacté</SelectItem>
                <SelectItem value="devis_envoye">Devis envoyé</SelectItem>
                <SelectItem value="refuse">Refusé</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des leads */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les leads ({leads.length})</CardTitle>
          <CardDescription>
            Liste de tous vos prospects et demandes de devis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{lead.name}</h3>
                      {getStatusBadge(lead.status)}
                      {getPriorityBadge(lead.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.project}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{lead.email}</span>
                      <span>•</span>
                      <span>{lead.phone}</span>
                      <span>•</span>
                      <span>{lead.location}</span>
                      <span>•</span>
                      <span>{lead.budget}</span>
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
