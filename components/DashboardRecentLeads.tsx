import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Eye, MessageSquare, Phone } from "lucide-react";

const recentLeads = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "06 12 34 56 78",
    project: "Rénovation salle de bain",
    budget: "8 000€ - 12 000€",
    status: "nouveau",
    location: "Paris 15ème",
    date: "Il y a 2h",
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
    date: "Il y a 4h",
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
    date: "Il y a 1j",
  },
  {
    id: 4,
    name: "Jean Moreau",
    email: "j.moreau@email.com",
    phone: "06 55 66 77 88",
    project: "Plomberie cuisine",
    budget: "1 500€ - 3 000€",
    status: "nouveau",
    location: "Levallois-Perret",
    date: "Il y a 1j",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    nouveau: { label: "Nouveau", variant: "default" as const, className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    contacte: { label: "Contacté", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    devis_envoye: { label: "Devis envoyé", variant: "outline" as const, className: "bg-green-100 text-green-800 hover:bg-green-100" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function DashboardRecentLeads() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leads récents</CardTitle>
            <CardDescription>
              Vos dernières demandes de devis
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Voir tous
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium leading-none">{lead.name}</p>
                    {getStatusBadge(lead.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.project}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{lead.location}</span>
                    <span>•</span>
                    <span>{lead.budget}</span>
                    <span>•</span>
                    <span>{lead.date}</span>
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
  );
}
