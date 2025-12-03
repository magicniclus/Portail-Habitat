import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, FileText, Calendar, Euro } from "lucide-react";

const kpiData = [
  {
    title: "Leads ce mois",
    value: "24",
    change: "+12%",
    trend: "up",
    description: "Par rapport au mois dernier",
    icon: Users,
  },
  {
    title: "Devis en attente",
    value: "8",
    change: "-3%",
    trend: "down",
    description: "Nécessitent une action",
    icon: FileText,
  },
  {
    title: "Chantiers actifs",
    value: "5",
    change: "+25%",
    trend: "up",
    description: "En cours d'exécution",
    icon: Calendar,
  },
  {
    title: "CA ce mois",
    value: "12 450€",
    change: "+18%",
    trend: "up",
    description: "Chiffre d'affaires",
    icon: Euro,
  },
];

export default function DashboardKPICards() {
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
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }`}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
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
