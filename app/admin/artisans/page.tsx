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
  CheckCircle, 
  XCircle,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export const metadata: Metadata = {
  title: "Gestion Artisans - Admin Portail Habitat",
  description: "Interface de gestion des artisans",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminArtisans() {
  const artisans = [
    {
      id: 1,
      name: "Jean Dupont",
      company: "Plomberie Dupont",
      metier: "Plomberie",
      ville: "Paris",
      email: "jean.dupont@email.com",
      phone: "01 23 45 67 89",
      status: "active",
      rating: 4.8,
      reviewsCount: 127,
      joinedAt: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      name: "Marie Martin",
      company: "Électricité Pro",
      metier: "Électricité",
      ville: "Lyon",
      email: "marie.martin@email.com",
      phone: "04 56 78 90 12",
      status: "pending",
      rating: 0,
      reviewsCount: 0,
      joinedAt: "2024-12-08",
      verified: false
    },
    {
      id: 3,
      name: "Pierre Dubois",
      company: "Rénovation Plus",
      metier: "Maçonnerie",
      ville: "Marseille",
      email: "pierre.dubois@email.com",
      phone: "04 91 23 45 67",
      status: "suspended",
      rating: 3.2,
      reviewsCount: 45,
      joinedAt: "2023-08-22",
      verified: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Artisans</h1>
          <p className="text-gray-600">Gérez les comptes artisans de la plateforme</p>
        </div>
        <Button>
          Ajouter un artisan
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
                  placeholder="Rechercher par nom, entreprise, email..." 
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
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-sm text-gray-600">Total artisans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">1,198</div>
            <p className="text-sm text-gray-600">Actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">26</div>
            <p className="text-sm text-gray-600">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-sm text-gray-600">Suspendus</p>
          </CardContent>
        </Card>
      </div>

      {/* Artisans List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des artisans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {artisans.map((artisan) => (
              <div key={artisan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-lg">
                        {artisan.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{artisan.name}</h3>
                        {artisan.verified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{artisan.company}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {artisan.ville}
                        </span>
                        <span className="text-xs text-gray-500">{artisan.metier}</span>
                        {artisan.rating > 0 && (
                          <span className="text-xs text-gray-500">
                            ⭐ {artisan.rating} ({artisan.reviewsCount} avis)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(artisan.status)}
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
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
                
                <div className="mt-3 pt-3 border-t flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {artisan.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {artisan.phone}
                  </span>
                  <span>Inscrit le {new Date(artisan.joinedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
