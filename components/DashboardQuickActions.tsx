import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar, MessageSquare, Settings, Users } from "lucide-react";

const quickActions = [
  {
    title: "Nouveau devis",
    description: "Créer un devis pour un client",
    icon: FileText,
    action: "create-quote",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Planifier chantier",
    description: "Ajouter un nouveau chantier",
    icon: Calendar,
    action: "schedule-project",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Contacter lead",
    description: "Répondre à une demande",
    icon: MessageSquare,
    action: "contact-lead",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Gérer profil",
    description: "Mettre à jour vos infos",
    icon: Settings,
    action: "manage-profile",
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

export default function DashboardQuickActions() {
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
              <Button
                key={action.action}
                variant="outline"
                className="h-auto p-4 justify-start"
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
              <span className="font-medium">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-green-500" />
                <span className="text-sm">Devis envoyés</span>
              </div>
              <span className="font-medium">8</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Chantiers démarrés</span>
              </div>
              <span className="font-medium">3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
