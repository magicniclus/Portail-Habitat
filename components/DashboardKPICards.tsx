import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, FileText, Star, Euro } from "lucide-react";

interface DashboardKPICardsProps {
  artisanData?: any;
  dashboardData?: any;
}

export default function DashboardKPICards({ artisanData, dashboardData }: DashboardKPICardsProps) {
  // Utiliser les vraies données ou des valeurs par défaut
  const stats = dashboardData?.stats || {};
  
  const kpiData = [
    {
      title: "Leads ce mois",
      value: stats.leadCountThisMonth || 0,
      change: stats.leadCountThisMonth > 0 ? "+100%" : "0%",
      trend: stats.leadCountThisMonth > 0 ? "up" : "neutral",
      description: "Nouvelles demandes",
      icon: Users,
    },
    {
      title: "Total leads",
      value: stats.totalLeads || 0,
      change: stats.newLeads > 0 ? `+${stats.newLeads}` : "0",
      trend: stats.newLeads > 0 ? "up" : "neutral",
      description: "Demandes totales",
      icon: FileText,
    },
    {
      title: "Note moyenne",
      value: stats.averageRating ? `${stats.averageRating.toFixed(1)}/5` : "0/5",
      change: `${stats.reviewCount || 0} avis`,
      trend: stats.averageRating >= 4 ? "up" : stats.averageRating >= 3 ? "neutral" : "down",
      description: "Satisfaction clients",
      icon: Star,
    },
    {
      title: "Taux conversion",
      value: `${stats.conversionRate || 0}%`,
      change: stats.convertedLeads > 0 ? `${stats.convertedLeads} convertis` : "0 converti",
      trend: stats.conversionRate >= 20 ? "up" : stats.conversionRate >= 10 ? "neutral" : "down",
      description: "Leads → Clients",
      icon: Euro,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge
                variant={kpi.trend === "up" ? "default" : "secondary"}
                className={`flex items-center space-x-1 ${
                  kpi.trend === "up" 
                    ? "bg-green-100 text-green-800 hover:bg-green-100" 
                    : kpi.trend === "down"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : kpi.trend === "down" ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <span className="h-3 w-3 rounded-full bg-gray-400" />
                )}
                <span>{kpi.change}</span>
              </Badge>
              <span>{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
