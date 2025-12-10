"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Briefcase, Mail, IdCard, Globe, Star, HelpCircle } from "lucide-react";

export default function TestDashboardNavPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Navigation Dashboard
          </h1>
          <p className="text-gray-600">
            Vérification de la navigation du dashboard artisan avec la bourse au chantier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bourse au chantier */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Bourse au chantier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Accédez aux demandes de clients et achetez des leads qualifiés
              </p>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                /dashboard/marketplace
              </Badge>
            </CardContent>
          </Card>

          {/* Mes projets */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Mes projets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Gérez vos projets achetés et contactez vos clients
              </p>
              <Badge variant="outline" className="text-green-600 border-green-600">
                /dashboard/projets
              </Badge>
            </CardContent>
          </Card>

          {/* Mes demandes */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-600" />
                Mes demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Consultez et gérez vos demandes de devis
              </p>
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                /dashboard/demandes
              </Badge>
            </CardContent>
          </Card>

          {/* Ma fiche */}
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5 text-orange-600" />
                Ma fiche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Modifiez votre profil et vos informations
              </p>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                /dashboard/fiche
              </Badge>
            </CardContent>
          </Card>

          {/* Mon site */}
          <Card className="border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                Mon site
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Gérez votre présence en ligne et vos statistiques
              </p>
              <Badge variant="outline" className="text-indigo-600 border-indigo-600">
                /dashboard/site
              </Badge>
            </CardContent>
          </Card>

          {/* Avis */}
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Avis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Consultez et gérez vos avis clients
              </p>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                /dashboard/avis
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShoppingCart className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Navigation mise à jour !
                </h3>
                <p className="text-blue-800 text-sm">
                  La <strong>Bourse au chantier</strong> et <strong>Mes projets</strong> sont maintenant 
                  disponibles dans la navigation de gauche du dashboard artisan. Vous pouvez :
                </p>
                <ul className="list-disc list-inside text-blue-700 text-sm mt-2 space-y-1">
                  <li>Parcourir les demandes de clients disponibles</li>
                  <li>Acheter des leads qualifiés via paiement sécurisé</li>
                  <li>Gérer vos projets achetés avec coordonnées complètes</li>
                  <li>Contacter directement vos clients</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
