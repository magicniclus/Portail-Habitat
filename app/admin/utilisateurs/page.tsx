"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Users, 
  UserCheck, 
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  TrendingUp,
  Loader2,
  Eye
} from "lucide-react";
import Link from "next/link";

interface Artisan {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  subscriptionStatus: string;
  averageRating: number;
  reviewCount: number;
  createdAt: any;
  totalLeads: number;
}

export default function AdminUtilisateurs() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger les artisans
      const artisansQuery = query(
        collection(db, "artisans"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const artisansSnapshot = await getDocs(artisansQuery);
      const artisansData = artisansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artisan[];

      setArtisans(artisansData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", className: "bg-green-100 text-green-800" },
      canceled: { label: "Annulé", className: "bg-red-100 text-red-800" },
      past_due: { label: "Impayé", className: "bg-yellow-100 text-yellow-800" },
      trialing: { label: "Essai", className: "bg-blue-100 text-blue-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredArtisans = artisans.filter(artisan =>
    artisan.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artisans</h1>
          <p className="text-gray-600">Gestion des artisans inscrits</p>
        </div>
        <Button onClick={loadData}>
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Artisans</p>
                <p className="text-2xl font-bold">{artisans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold">
                  {artisans.filter(a => a.subscriptionStatus === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">
                  {artisans.reduce((total, a) => total + (a.totalLeads || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Rechercher par nom, email, ville..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Artisans List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Artisans ({filteredArtisans.length})
          </h2>
        </div>
        
        {filteredArtisans.map((artisan) => (
          <Card key={artisan.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {artisan.companyName || `${artisan.firstName} ${artisan.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-600">{artisan.profession}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {artisan.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {artisan.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {artisan.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(artisan.subscriptionStatus)}
                    <div className="text-sm font-medium">{artisan.totalLeads || 0} leads</div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/utilisateurs/${artisan.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredArtisans.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun artisan trouvé</h3>
                <p className="text-gray-600">
                  {searchTerm ? "Essayez de modifier votre recherche" : "Aucun artisan inscrit pour le moment"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
