"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  funnelStep: string;
  createdAt: any;
  searchesLast24h: number;
  demandsLast30d: number;
}

export default function AdminUtilisateurs() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("artisans");

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

      // Charger les prospects
      const prospectsQuery = query(
        collection(db, "prospects"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const prospectsSnapshot = await getDocs(prospectsQuery);
      const prospectsData = prospectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prospect[];

      setArtisans(artisansData);
      setProspects(prospectsData);
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

  const getFunnelBadge = (step: string) => {
    const stepConfig = {
      step1: { label: "Étape 1", className: "bg-blue-100 text-blue-800" },
      step2: { label: "Étape 2", className: "bg-yellow-100 text-yellow-800" },
      step3: { label: "Étape 3", className: "bg-orange-100 text-orange-800" },
      abandoned: { label: "Abandonné", className: "bg-red-100 text-red-800" },
      paid: { label: "Payé", className: "bg-green-100 text-green-800" }
    };
    
    const config = stepConfig[step as keyof typeof stepConfig] || 
                   { label: step, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredArtisans = artisans.filter(artisan =>
    artisan.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProspects = prospects.filter(prospect =>
    prospect.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.city?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600">Gestion des artisans et prospects</p>
        </div>
        <Button onClick={loadData}>
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Artisans</p>
                <p className="text-2xl font-bold">{artisans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Prospects</p>
                <p className="text-2xl font-bold">{prospects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 text-purple-600" />
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
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold">
                  {prospects.filter(p => p.funnelStep === 'paid').length}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="artisans">
            Artisans ({filteredArtisans.length})
          </TabsTrigger>
          <TabsTrigger value="prospects">
            Prospects ({filteredProspects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artisans" className="space-y-4">
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
                  <div className="text-right space-y-2">
                    {getStatusBadge(artisan.subscriptionStatus)}
                    <div className="text-xs text-gray-500">
                      ⭐ {artisan.averageRating || 0} ({artisan.reviewCount || 0} avis)
                    </div>
                    <div className="text-xs text-gray-500">
                      {artisan.totalLeads || 0} leads
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/utilisateurs/${artisan.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="prospects" className="space-y-4">
          {filteredProspects.map((prospect) => (
            <Card key={prospect.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {prospect.firstName} {prospect.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{prospect.profession}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {prospect.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {prospect.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {prospect.city}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {getFunnelBadge(prospect.funnelStep)}
                    <div className="text-xs text-gray-500">
                      {prospect.searchesLast24h || 0} recherches 24h
                    </div>
                    <div className="text-xs text-gray-500">
                      {prospect.demandsLast30d || 0} demandes 30j
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/utilisateurs/${prospect.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
