"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, query, where, collection, getDocs, orderBy, limit } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Loader2, AlertCircle } from "lucide-react";
import DashboardKPICards from "@/components/DashboardKPICards";
import DashboardRecentLeads from "@/components/DashboardRecentLeads";
import DashboardQuickActions from "@/components/DashboardQuickActions";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [artisanData, setArtisanData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'utilisateur connecté et ses données
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          // Chercher l'artisan correspondant à cet utilisateur
          const artisansRef = collection(db, 'artisans');
          const q = query(artisansRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const artisanDoc = querySnapshot.docs[0];
            const artisan = { id: artisanDoc.id, ...artisanDoc.data() } as any;
            setArtisanData(artisan);
            
            // Récupérer les données du dashboard
            await loadDashboardData(artisan.id);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données artisan:', error);
        }
      } else {
        setCurrentUser(null);
        setArtisanData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadDashboardData = async (artisanId: string) => {
    try {
      // Récupérer les leads récents
      const leadsRef = collection(db, 'artisans', artisanId, 'leads');
      const leadsQuery = query(leadsRef, orderBy('createdAt', 'desc'), limit(5));
      const leadsSnapshot = await getDocs(leadsQuery);
      const recentLeads = leadsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Récupérer les avis récents
      const reviewsRef = collection(db, 'artisans', artisanId, 'reviews');
      const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'), limit(5));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const recentReviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Calculer les statistiques
      const totalLeads = leadsSnapshot.size;
      const totalReviews = reviewsSnapshot.size;
      
      // Calculer la note moyenne
      let averageRating = 0;
      if (recentReviews.length > 0) {
        const totalRating = recentReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        averageRating = totalRating / recentReviews.length;
      }

      // Compter les leads par statut
      const newLeads = recentLeads.filter(lead => lead.status === 'new').length;
      const convertedLeads = recentLeads.filter(lead => lead.status === 'converted').length;

      setDashboardData({
        recentLeads,
        recentReviews,
        stats: {
          totalLeads: artisanData?.totalLeads || totalLeads,
          leadCountThisMonth: artisanData?.leadCountThisMonth || newLeads,
          averageRating: averageRating || artisanData?.averageRating || 0,
          reviewCount: artisanData?.reviewCount || totalReviews,
          newLeads,
          convertedLeads,
          conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données dashboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !artisanData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Vous devez être connecté pour accéder au dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de bienvenue */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bonjour {artisanData.firstName || artisanData.companyName} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre activité sur Portail Habitat
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardKPICards 
        artisanData={artisanData}
        dashboardData={dashboardData}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRecentLeads 
            recentLeads={dashboardData?.recentLeads || []}
            artisanId={artisanData.id}
          />
        </div>
        <div>
          <DashboardQuickActions 
            artisanData={artisanData}
          />
        </div>
      </div>
    </div>
  );
}
