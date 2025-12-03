import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Calendar,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Avis - Dashboard Pro - Portail Habitat",
  description: "Gérez vos avis clients et votre réputation en ligne.",
  robots: {
    index: false,
    follow: false,
  },
};

const avisData = [
  {
    id: 1,
    client: "Marie Dubois",
    note: 5,
    titre: "Excellent travail de rénovation",
    commentaire: "Très satisfaite du travail réalisé. L'artisan est ponctuel, professionnel et le résultat est parfait. Je recommande vivement !",
    date: "2024-11-28",
    projet: "Rénovation salle de bain",
    repondu: true,
    reponse: "Merci beaucoup Marie pour ce retour positif ! C'était un plaisir de travailler sur votre projet.",
    verifie: true,
  },
  {
    id: 2,
    client: "Pierre Martin",
    note: 4,
    titre: "Bon travail dans l'ensemble",
    commentaire: "Travail de qualité, quelques petits détails à revoir mais globalement très satisfait. Bon rapport qualité-prix.",
    date: "2024-11-25",
    projet: "Installation électrique",
    repondu: false,
    reponse: "",
    verifie: true,
  },
  {
    id: 3,
    client: "Sophie Laurent",
    note: 5,
    titre: "Parfait !",
    commentaire: "Travail impeccable, délais respectés, très bon contact. Je ferai de nouveau appel à cet artisan sans hésiter.",
    date: "2024-11-20",
    projet: "Peinture appartement",
    repondu: true,
    reponse: "Merci Sophie ! Au plaisir de travailler à nouveau ensemble.",
    verifie: true,
  },
  {
    id: 4,
    client: "Jean Moreau",
    note: 3,
    titre: "Correct mais peut mieux faire",
    commentaire: "Le travail est correct mais j'ai eu quelques problèmes de communication. Le résultat final est satisfaisant.",
    date: "2024-11-15",
    projet: "Plomberie cuisine",
    repondu: false,
    reponse: "",
    verifie: true,
  },
];

const statistiquesAvis = {
  noteGlobale: 4.3,
  totalAvis: avisData.length,
  repartition: {
    5: 2,
    4: 1,
    3: 1,
    2: 0,
    1: 0,
  },
  tauxReponse: Math.round((avisData.filter(a => a.repondu).length / avisData.length) * 100),
  avisRecents: avisData.filter(a => new Date(a.date) > new Date('2024-11-20')).length,
};

const getStarRating = (note: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
      }`}
    />
  ));
};

const getNoteBadge = (note: number) => {
  if (note >= 4) return <Badge className="bg-green-100 text-green-800">Positif</Badge>;
  if (note >= 3) return <Badge className="bg-orange-100 text-orange-800">Neutre</Badge>;
  return <Badge className="bg-red-100 text-red-800">Négatif</Badge>;
};

export default function AvisPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avis clients</h1>
          <p className="text-muted-foreground">
            Gérez vos avis clients et votre réputation en ligne
          </p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Demander un avis
        </Button>
      </div>

      {/* Statistiques des avis */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note globale</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiquesAvis.noteGlobale}/5</div>
            <div className="flex items-center space-x-1 mt-1">
              {getStarRating(Math.round(statistiquesAvis.noteGlobale))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total avis</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiquesAvis.totalAvis}</div>
            <p className="text-xs text-muted-foreground">
              {statistiquesAvis.avisRecents} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réponse</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiquesAvis.tauxReponse}%</div>
            <p className="text-xs text-muted-foreground">
              Avis avec réponse
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avis positifs</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(((statistiquesAvis.repartition[4] + statistiquesAvis.repartition[5]) / statistiquesAvis.totalAvis) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              4-5 étoiles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des notes</CardTitle>
          <CardDescription>
            Distribution de vos avis par nombre d'étoiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((note) => (
              <div key={note} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{note}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${(statistiquesAvis.repartition[note as keyof typeof statistiquesAvis.repartition] / statistiquesAvis.totalAvis) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {statistiquesAvis.repartition[note as keyof typeof statistiquesAvis.repartition]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans les avis..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les notes</SelectItem>
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4 étoiles</SelectItem>
                <SelectItem value="3">3 étoiles</SelectItem>
                <SelectItem value="2">2 étoiles</SelectItem>
                <SelectItem value="1">1 étoile</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les avis</SelectItem>
                <SelectItem value="repondu">Avec réponse</SelectItem>
                <SelectItem value="non_repondu">Sans réponse</SelectItem>
                <SelectItem value="recent">Récents</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des avis */}
      <Card>
        <CardHeader>
          <CardTitle>Tous les avis ({avisData.length})</CardTitle>
          <CardDescription>
            Gérez vos avis clients et répondez-y
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {avisData.map((avis) => (
              <div key={avis.id} className="border rounded-lg p-4 space-y-4">
                {/* En-tête de l'avis */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{avis.client}</span>
                      </div>
                      {getNoteBadge(avis.note)}
                      {avis.verifie && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        {getStarRating(avis.note)}
                      </div>
                      <span>•</span>
                      <span>{avis.projet}</span>
                      <span>•</span>
                      <span>{avis.date}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu de l'avis */}
                <div className="space-y-2">
                  <h4 className="font-medium">{avis.titre}</h4>
                  <p className="text-sm text-muted-foreground">{avis.commentaire}</p>
                </div>

                {/* Réponse */}
                {avis.repondu ? (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Votre réponse :</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Répondu
                      </Badge>
                    </div>
                    <p className="text-sm">{avis.reponse}</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Aucune réponse</span>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Répondre
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
