import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Eye, 
  Users, 
  TrendingUp, 
  Edit, 
  Settings, 
  Image as ImageIcon,
  FileText,
  Star,
  MapPin
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mon site - Dashboard Pro - Portail Habitat",
  description: "Gérez votre présence en ligne et votre profil artisan.",
  robots: {
    index: false,
    follow: false,
  },
};

const siteStats = [
  {
    title: "Vues ce mois",
    value: "1,247",
    change: "+23%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Leads générés",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Taux de conversion",
    value: "1.9%",
    change: "+0.3%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Note moyenne",
    value: "4.8/5",
    change: "12 avis",
    trend: "stable",
    icon: Star,
  },
];

const completionItems = [
  { label: "Informations de base", completed: true, points: 20 },
  { label: "Photos de réalisations", completed: true, points: 25 },
  { label: "Description des services", completed: false, points: 15 },
  { label: "Certifications", completed: false, points: 10 },
  { label: "Zone d'intervention", completed: true, points: 15 },
  { label: "Tarifs indicatifs", completed: false, points: 15 },
];

const completedPoints = completionItems.filter(item => item.completed).reduce((sum, item) => sum + item.points, 0);
const totalPoints = completionItems.reduce((sum, item) => sum + item.points, 0);
const completionPercentage = Math.round((completedPoints / totalPoints) * 100);

export default function MonSitePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon site</h1>
          <p className="text-muted-foreground">
            Gérez votre présence en ligne et optimisez votre visibilité
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            Voir mon profil
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        {siteStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Complétude du profil */}
        <Card>
          <CardHeader>
            <CardTitle>Complétude du profil</CardTitle>
            <CardDescription>
              Optimisez votre profil pour attirer plus de clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progression</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="space-y-3">
              {completionItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">+{item.points}pts</span>
                    {!item.completed && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Gérez votre présence en ligne
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <ImageIcon className="h-4 w-4 mr-2" />
              Ajouter des photos
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Mettre à jour les services
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Modifier la zone d'intervention
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Gérer les avis clients
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres avancés
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu du profil */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu de votre profil public</CardTitle>
          <CardDescription>
            Voici comment les clients voient votre profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-muted/20">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary">PH</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">Professionnel Habitat</h3>
                  <Badge className="bg-green-100 text-green-800">Vérifié</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Spécialiste en rénovation et travaux d'intérieur
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (12 avis)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Paris et région parisienne</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
