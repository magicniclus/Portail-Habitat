import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Download, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Devis - Dashboard Pro - Portail Habitat",
  description: "Gérez vos devis et propositions commerciales.",
  robots: {
    index: false,
    follow: false,
  },
};

const devis = [
  {
    id: "DEV-2024-001",
    client: "Marie Dubois",
    project: "Rénovation salle de bain",
    amount: "9 500€",
    status: "envoye",
    date: "2024-12-01",
    validUntil: "2024-12-31",
  },
  {
    id: "DEV-2024-002",
    client: "Pierre Martin",
    project: "Installation électrique",
    amount: "4 200€",
    status: "brouillon",
    date: "2024-11-28",
    validUntil: "2024-12-28",
  },
  {
    id: "DEV-2024-003",
    client: "Sophie Laurent",
    project: "Peinture appartement",
    amount: "3 100€",
    status: "accepte",
    date: "2024-11-25",
    validUntil: "2024-12-25",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    brouillon: { label: "Brouillon", className: "bg-gray-100 text-gray-800" },
    envoye: { label: "Envoyé", className: "bg-blue-100 text-blue-800" },
    accepte: { label: "Accepté", className: "bg-green-100 text-green-800" },
    refuse: { label: "Refusé", className: "bg-red-100 text-red-800" },
    expire: { label: "Expiré", className: "bg-orange-100 text-orange-800" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function DevisPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devis</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos propositions commerciales
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau devis
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total devis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devis.length}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {devis.filter(d => d.status === 'envoye').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Réponse attendue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {devis.filter(d => d.status === 'accepte').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Taux: {Math.round((devis.filter(d => d.status === 'accepte').length / devis.length) * 100)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA potentiel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16 800€</div>
            <p className="text-xs text-muted-foreground">
              Devis en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des devis */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les devis</CardTitle>
          <CardDescription>
            Gérez vos propositions commerciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devis.map((devis) => (
              <div key={devis.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{devis.id}</h3>
                      {getStatusBadge(devis.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{devis.client} - {devis.project}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Montant: {devis.amount}</span>
                      <span>•</span>
                      <span>Créé le: {devis.date}</span>
                      <span>•</span>
                      <span>Valide jusqu'au: {devis.validUntil}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  {devis.status === 'brouillon' && (
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
