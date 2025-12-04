import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Eye, MessageSquare, Phone, Users } from "lucide-react";
import Link from "next/link";

interface DashboardRecentLeadsProps {
  recentLeads?: any[];
  artisanId?: string;
}

// Fonction pour formater la date
const formatDate = (date: any) => {
  if (!date) return "Date inconnue";
  
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Il y a moins d'1h";
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Il y a 1j";
  if (diffInDays < 7) return `Il y a ${diffInDays}j`;
  
  return dateObj.toLocaleDateString('fr-FR');
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    new: { label: "Nouveau", variant: "default" as const, className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    contacted: { label: "Contacté", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    converted: { label: "Converti", variant: "outline" as const, className: "bg-green-100 text-green-800 hover:bg-green-100" },
    lost: { label: "Perdu", variant: "outline" as const, className: "bg-red-100 text-red-800 hover:bg-red-100" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function DashboardRecentLeads({ recentLeads = [], artisanId }: DashboardRecentLeadsProps) {
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
          <Link href="/dashboard/demandes">
            <Button variant="outline" size="sm">
              Voir tous
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recentLeads.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Aucun lead récent</p>
            <p className="text-sm text-gray-400">
              Vos nouvelles demandes apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentLeads.map((lead: any) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {lead.clientName ? lead.clientName.split(' ').map((n: string) => n[0]).join('') : '?'}
                    </span>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium leading-none">{lead.clientName || 'Client anonyme'}</p>
                      {getStatusBadge(lead.status || 'new')}
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.projectType || 'Projet non spécifié'}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{lead.city || 'Ville non spécifiée'}</span>
                      <span>•</span>
                      <span>{lead.budget || 'Budget non spécifié'}</span>
                      <span>•</span>
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/demandes`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  {lead.clientPhone && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`tel:${lead.clientPhone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
