import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  User,
  Clock
} from "lucide-react";

export const metadata: Metadata = {
  title: "Gestion Articles - Admin Portail Habitat",
  description: "Interface de gestion des articles de blog",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminArticles() {
  const articles = [
    {
      id: 1,
      title: "Comment bien choisir son artisan pour sa rénovation",
      slug: "choisir-artisan-renovation",
      category: "conseils",
      author: "Julia",
      status: "published",
      publishedAt: "2024-12-09",
      readingTime: 5,
      views: 1247,
      featured: true
    },
    {
      id: 2,
      title: "Les 5 erreurs à éviter en plomberie",
      slug: "erreurs-plomberie",
      category: "conseils",
      author: "Julia",
      status: "published",
      publishedAt: "2024-12-09",
      readingTime: 3,
      views: 892,
      featured: false
    },
    {
      id: 3,
      title: "Budget rénovation : comment bien l'estimer",
      slug: "budget-renovation",
      category: "budget",
      author: "Julia",
      status: "published",
      publishedAt: "2024-12-09",
      readingTime: 4,
      views: 1156,
      featured: false
    },
    {
      id: 4,
      title: "Rénovation salle de bain : les tendances 2024",
      slug: "renovation-salle-bain-tendances-2024",
      category: "renovation",
      author: "Julia",
      status: "published",
      publishedAt: "2024-12-01",
      readingTime: 8,
      views: 2341,
      featured: true
    },
    {
      id: 5,
      title: "Guide isolation thermique maison",
      slug: "guide-isolation-thermique",
      category: "isolation",
      author: "Julia",
      status: "draft",
      publishedAt: null,
      readingTime: 6,
      views: 0,
      featured: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Publié</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Programmé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'conseils': 'bg-purple-100 text-purple-800',
      'budget': 'bg-orange-100 text-orange-800',
      'renovation': 'bg-blue-100 text-blue-800',
      'isolation': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Articles</h1>
          <p className="text-gray-600">Créez et gérez le contenu du blog</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Rechercher par titre, catégorie, auteur..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-gray-600">Total articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">142</div>
            <p className="text-sm text-gray-600">Publiés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">14</div>
            <p className="text-sm text-gray-600">Brouillons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">45,231</div>
            <p className="text-sm text-gray-600">Vues totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {article.title}
                      </h3>
                      {article.featured && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          À la une
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.author}
                      </span>
                      {article.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readingTime} min
                      </span>
                      <span>{article.views} vues</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(article.category)}
                      {getStatusBadge(article.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/blog/${article.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
