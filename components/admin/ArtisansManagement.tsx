"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MapPin,
  Phone,
  Mail,
  Star,
  Users,
  Loader2,
  Crown
} from "lucide-react";
import PremiumSwitch from "./PremiumSwitch";
import { isPremiumActive } from "@/lib/premium-utils";
import Link from "next/link";

interface Artisan {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  profession: string;
  city: string;
  email: string;
  phone: string;
  averageRating: number;
  reviewCount: number;
  createdAt: any;
  premiumFeatures?: any;
  isActive?: boolean;
}

export default function ArtisansManagement() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "premium" | "standard">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Charger les artisans
  const loadArtisans = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, "artisans"),
        orderBy("createdAt", "desc"),
        limit(itemsPerPage)
      );

      // Filtrer par statut premium si nécessaire
      if (filterStatus === "premium") {
        q = query(
          collection(db, "artisans"),
          where("premiumFeatures.isPremium", "==", true),
          orderBy("createdAt", "desc"),
          limit(itemsPerPage)
        );
      }

      const snapshot = await getDocs(q);
      const artisansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artisan[];

      setArtisans(artisansData);
    } catch (error) {
      console.error("Erreur lors du chargement des artisans:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les artisans selon le terme de recherche
  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = 
      artisan.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "premium" && isPremiumActive(artisan)) ||
      (filterStatus === "standard" && !isPremiumActive(artisan));

    return matchesSearch && matchesFilter;
  });

  // Charger les données au montage
  useEffect(() => {
    loadArtisans();
  }, [filterStatus]);

  // Fonction de mise à jour après modification premium
  const handleArtisanUpdate = () => {
    loadArtisans();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des artisans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Artisans</h1>
          <p className="text-gray-600">
            {filteredArtisans.length} artisan{filteredArtisans.length > 1 ? 's' : ''} trouvé{filteredArtisans.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom, email, ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtre statut */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                Tous
              </Button>
              <Button
                variant={filterStatus === "premium" ? "default" : "outline"}
                onClick={() => setFilterStatus("premium")}
                size="sm"
              >
                <Crown className="h-4 w-4 mr-1" />
                Premium
              </Button>
              <Button
                variant={filterStatus === "standard" ? "default" : "outline"}
                onClick={() => setFilterStatus("standard")}
                size="sm"
              >
                Standard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des artisans */}
      <div className="grid gap-4">
        {filteredArtisans.map((artisan) => (
          <Card key={artisan.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">
                      {artisan.companyName || `${artisan.firstName} ${artisan.lastName}`}
                    </h3>
                    
                    {/* Badge Premium */}
                    {isPremiumActive(artisan) && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    
                    {/* Badge Profession */}
                    <Badge variant="outline">
                      {artisan.profession}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{artisan.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{artisan.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{artisan.phone}</span>
                    </div>
                  </div>

                  {/* Statistiques */}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    {artisan.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{artisan.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                    {artisan.reviewCount && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{artisan.reviewCount} avis</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {/* Switch Premium */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500">Premium</span>
                    <PremiumSwitch
                      artisanId={artisan.id}
                      premiumFeatures={artisan.premiumFeatures}
                      onUpdate={handleArtisanUpdate}
                    />
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <Link href={`/artisan/${artisan.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/artisan/${artisan.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredArtisans.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Aucun artisan trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination (à implémenter si nécessaire) */}
      {filteredArtisans.length >= itemsPerPage && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={loadArtisans}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Charger plus
          </Button>
        </div>
      )}
    </div>
  );
}
