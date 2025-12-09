import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Eye,
  Calendar,
  Download
} from "lucide-react";

export const metadata: Metadata = {
  title: "Statistiques - Admin Portail Habitat",
  description: "Statistiques et analytics de la plateforme",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminStats() {
  const monthlyStats = [
    { month: "Nov 2024", users: 1156, articles: 142, views: 45231, conversions: 89 },
    { month: "Déc 2024", users: 1247, articles: 156, views: 52341, conversions: 102 },
  ];

  const topArticles = [
    {
      title: "Rénovation salle de bain : les tendances 2024",
      views: 2341,
      conversions: 23,
      conversionRate: 0.98
    },
    {
      title: "Comment bien choisir son artisan",
      views: 1247,
      conversions: 18,
      conversionRate: 1.44
    },
    {
      title: "Budget rénovation : guide complet",
      views: 1156,
      conversions: 15,
      conversionRate: 1.30
    }
  ];

  const topCities = [
    { city: "Paris", users: 312, percentage: 25.0 },
    { city: "Lyon", users: 187, percentage: 15.0 },
    { city: "Marseille", users: 156, percentage: 12.5 },
    { city: "Toulouse", users: 124, percentage: 9.9 },
    { city: "Nice", users: 98, percentage: 7.9 }
  ];

  const currentMonth = monthlyStats[1];
  const previousMonth = monthlyStats[0];

  const calculateGrowth = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(growth).toFixed(1),
      isPositive: growth > 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600">Analytics et métriques de performance</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Utilisateurs totaux",
            current: currentMonth.users,
            previous: previousMonth.users,
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Articles publiés",
            current: currentMonth.articles,
            previous: previousMonth.articles,
            icon: FileText,
            color: "text-purple-600"
          },
          {
            title: "Pages vues",
            current: currentMonth.views,
            previous: previousMonth.views,
            icon: Eye,
            color: "text-green-600"
          },
          {
            title: "Conversions",
            current: currentMonth.conversions,
            previous: previousMonth.conversions,
            icon: TrendingUp,
            color: "text-orange-600"
          }
        ].map((stat, index) => {
          const growth = calculateGrowth(stat.current, stat.previous);
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.current.toLocaleString('fr-FR')}
                </div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  {growth.isPositive ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  <span className={growth.isPositive ? 'text-green-600' : 'text-red-600'}>
                    {growth.value}%
                  </span>
                  <span className="ml-1">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Articles les plus populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span>{article.views} vues</span>
                      <span>{article.conversions} conversions</span>
                      <Badge variant="outline" className="text-xs">
                        {article.conversionRate}% taux
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Villes les plus actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{city.city}</h4>
                      <p className="text-xs text-gray-600">{city.users} utilisateurs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{city.percentage}%</div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className="h-full bg-orange-600 rounded-full"
                        style={{ width: `${city.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Evolution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Évolution mensuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monthlyStats.map((month, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">{month.month}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                    <p className="text-xl font-bold text-blue-600">{month.users.toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Articles</p>
                    <p className="text-xl font-bold text-purple-600">{month.articles}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vues</p>
                    <p className="text-xl font-bold text-green-600">{month.views.toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="text-xl font-bold text-orange-600">{month.conversions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
