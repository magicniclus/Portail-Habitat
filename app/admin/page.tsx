import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  Star, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Mail
} from "lucide-react";

export const metadata: Metadata = {
  title: "Administration - Portail Habitat",
  description: "Interface d'administration de Portail Habitat",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboard() {
  const stats = [
    {
      title: "Artisans inscrits",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Demandes actives",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: Mail,
      color: "text-green-600"
    },
    {
      title: "Articles publiés",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Avis en attente",
      value: "23",
      change: "-15%",
      trend: "down",
      icon: Star,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      message: "Nouvel artisan inscrit : Jean Dupont (Plomberie)",
      time: "Il y a 2 min",
      status: "success"
    },
    {
      id: 2,
      type: "review",
      message: "Avis signalé pour modération",
      time: "Il y a 15 min",
      status: "warning"
    },
    {
      id: 3,
      type: "article",
      message: "Article publié : Guide rénovation cuisine",
      time: "Il y a 1h",
      status: "success"
    },
    {
      id: 4,
      type: "system",
      message: "Maintenance programmée ce soir à 22h",
      time: "Il y a 2h",
      status: "info"
    }
  ];

  const pendingActions = [
    {
      id: 1,
      title: "Modérer 5 nouveaux avis",
      description: "Avis en attente de validation",
      priority: "high",
      url: "/admin/avis"
    },
    {
      id: 2,
      title: "Valider 3 fiches artisans",
      description: "Nouvelles inscriptions à vérifier",
      priority: "medium",
      url: "/admin/artisans"
    },
    {
      id: 3,
      title: "Répondre aux signalements",
      description: "2 signalements utilisateurs",
      priority: "high",
      url: "/admin/moderation"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme Portail Habitat</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          Système opérationnel
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-600">
                <TrendingUp className={`h-3 w-3 mr-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`} />
                {stat.change} par rapport au mois dernier
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Actions en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                      <Badge 
                        variant={action.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {action.priority === 'high' ? 'Urgent' : 'Normal'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={action.url}>Traiter</a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/admin/artisans">
                <Users className="h-6 w-6" />
                Gérer artisans
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/admin/articles">
                <FileText className="h-6 w-6" />
                Créer article
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/admin/avis">
                <Star className="h-6 w-6" />
                Modérer avis
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/admin/stats">
                <TrendingUp className="h-6 w-6" />
                Voir stats
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
