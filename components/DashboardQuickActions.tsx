import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, MessageSquare, Settings, Users, Star, IdCard } from "lucide-react";
import Link from "next/link";

interface DashboardQuickActionsProps {
  artisanData?: any;
}

export default function DashboardQuickActions({ artisanData }: DashboardQuickActionsProps) {
  const quickActions = [
    {
      title: "Gérer mes demandes",
      description: "Voir toutes mes demandes",
      icon: MessageSquare,
      href: "/dashboard/demandes",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Ma fiche entreprise",
      description: "Modifier mon profil",
      icon: IdCard,
      href: "/dashboard/fiche",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Mes avis clients",
      description: "Gérer les avis",
      icon: Star,
      href: "/dashboard/avis",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Paramètres",
      description: "Configurer mon compte",
      icon: Settings,
      href: "/dashboard/parametres",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

const recentActivities = [
  {
    id: 1,
    action: "Devis envoyé",
    client: "Marie Dubois",
    time: "Il y a 30 min",
    status: "success",
  },
  {
    id: 2,
    action: "Lead reçu",
    client: "Pierre Martin",
    time: "Il y a 1h",
    status: "info",
  },
  {
    id: 3,
    action: "Chantier terminé",
    client: "Sophie Laurent",
    time: "Il y a 2h",
    status: "success",
  },
  {
    id: 4,
    action: "Appel manqué",
    client: "Jean Moreau",
    time: "Il y a 3h",
    status: "warning",
  },
];

const getActivityStatusColor = (status: string) => {
  const colors = {
    success: "text-green-600",
    info: "text-blue-600",
    warning: "text-orange-600",
    error: "text-red-600",
  };
  return colors[status as keyof typeof colors] || "text-gray-600";
};

  return (
    <div className="space-y-6">
      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Raccourcis vers vos tâches les plus fréquentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start w-full"
                >
                  <div className={`p-2 rounded-md ${action.color} mr-3`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Vos dernières actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'info' ? 'bg-blue-500' :
                  activity.status === 'warning' ? 'bg-orange-500' :
                  'bg-red-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className={`font-medium ${getActivityStatusColor(activity.status)}`}>
                    {activity.action}
                  </p>
                  <p className="text-muted-foreground">
                    {activity.client}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Cette semaine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Nouveaux leads</span>
              </div>
              <span className="font-medium">{artisanData?.leadCountThisMonth || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-green-500" />
                <span className="text-sm">Avis reçus</span>
              </div>
              <span className="font-medium">{artisanData?.reviewCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Total leads</span>
              </div>
              <span className="font-medium">{artisanData?.totalLeads || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
