"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import FicheEntreprisePublic from "@/components/FicheEntreprisePublic";
import { doc, getDoc, query, where, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  ExternalLink,
  Share2,
  Loader2,
  ArrowLeft,
  Star,
  Users,
  Briefcase
} from "lucide-react";
import { XIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ArtisanPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [entreprise, setEntreprise] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isArtisan, setIsArtisan] = useState(false);


  // Composant bannière partenaire en bas de page (design gris simple)
  const PromoBannerBottom = () => (
    <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mt-12">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Vous êtes artisan ?
        </h3>
        <p className="text-gray-600 mb-4">
          Rejoignez Portail Habitat et développez votre activité.
        </p>
        <Link href="/devenir-pro">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Devenir partenaire
          </Button>
        </Link>
      </div>
    </div>
  );

  // Vérifier l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Vérifier si l'utilisateur est un artisan
        try {
          const artisansRef = collection(db, 'artisans');
          const q = query(artisansRef, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          setIsArtisan(!querySnapshot.empty);
        } catch (error) {
          console.error('Erreur lors de la vérification artisan:', error);
          setIsArtisan(false);
        }
      } else {
        setIsArtisan(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Récupérer l'artisan par son slug
  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        
        // Chercher l'artisan par slug
        const artisansRef = collection(db, 'artisans');
        const q = query(artisansRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const artisanDoc = querySnapshot.docs[0];
          const artisanData = artisanDoc.data();
          
          // Vérifier que le profil est visible
          if (!artisanData.privacy?.profileVisible) {
            setNotFound(true);
            return;
          }
          
          // Transformer les données Firestore en format attendu par le composant
          setEntreprise({
            id: artisanDoc.id,
            nom: artisanData.companyName || "Nom de l'entreprise",
            logo: artisanData.logoUrl || undefined,
            banniere: artisanData.coverUrl || undefined,
            specialites: artisanData.professions || [],
            description: artisanData.description || "Description de l'entreprise",
            telephone: artisanData.phone || "",
            email: artisanData.email || "",
            adresse: artisanData.fullAddress || "",
            ville: artisanData.city || "",
            note: artisanData.averageRating || 0,
            nombreAvis: artisanData.reviewCount || 0,
            certifications: artisanData.certifications || [],
            zoneIntervention: artisanData.city ? [artisanData.city] : [],
            averageQuoteMin: artisanData.averageQuoteMin || undefined,
            averageQuoteMax: artisanData.averageQuoteMax || undefined,
            slug: artisanData.slug,
            firstName: artisanData.firstName || "",
            lastName: artisanData.lastName || "",
            siret: artisanData.siret || "",
            profession: artisanData.profession || "",
            premiumFeatures: artisanData.premiumFeatures || null
          });

          // Charger les projets publics de l'artisan
          const projectsRef = collection(db, 'artisans', artisanDoc.id, 'posts');
          const projectsQuery = query(projectsRef, where('isPubliclyVisible', '==', true));
          const projectsSnapshot = await getDocs(projectsQuery);
          
          const projectsData: any[] = [];
          projectsSnapshot.forEach((doc) => {
            projectsData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          // Trier par date de création (plus récent en premier)
          projectsData.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          
          setProjects(projectsData);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données artisan:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArtisan();
    }
  }, [slug]);

  // Écouter les avis en temps réel
  useEffect(() => {
    if (!entreprise?.id) return;

    const reviewsRef = collection(db, 'artisans', entreprise.id, 'reviews');
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const reviewsData: any[] = [];
      snapshot.forEach((doc) => {
        const reviewData = doc.data();
        if (reviewData.displayed !== false) {
          reviewsData.push({
            id: doc.id,
            ...reviewData
          });
        }
      });
      
      // Trier par date de création (plus récent en premier)
      reviewsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setReviews(reviewsData);

      // Calculer et mettre à jour les statistiques
      if (reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviewsData.length;
        
        setEntreprise((prev: any) => ({
          ...prev,
          note: Math.round(averageRating * 10) / 10,
          nombreAvis: reviewsData.length
        }));
      } else {
        setEntreprise((prev: any) => ({
          ...prev,
          note: 0,
          nombreAvis: 0
        }));
      }
    });

    return () => unsubscribe();
  }, [entreprise?.id]);

  // Fonction pour partager la fiche
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${entreprise?.nom} - Artisan`,
          text: `Découvrez la fiche de ${entreprise?.nom}`,
          url: url
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier dans le presse-papier
      try {
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papier !');
      } catch (error) {
        console.error('Erreur lors de la copie:', error);
      }
    }
  };

  // Fonction pour partager sur Facebook
  const handleShareFacebook = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // Fonction pour partager sur X (Twitter)
  const handleShareX = () => {
    const url = window.location.href;
    const text = `Découvrez la fiche de ${entreprise?.nom} - Artisan professionnel`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank', 'width=600,height=400');
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Chargement de la fiche artisan...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Artisan non trouvé
  if (notFound || !entreprise) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Artisan non trouvé</h1>
              <p className="text-gray-600 mb-8">
                Cet artisan n'existe pas ou son profil n'est pas public.
              </p>
              <Link href="/artisans">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux artisans
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-[780px]:px-2 max-[780px]:py-4">
          <div className="space-y-6 max-[780px]:space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-4">
              <Link href="/artisans">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
            </div>

            {/* Fiche entreprise */}
            <div className="w-full h-full">
              <FicheEntreprisePublic 
                entreprise={entreprise} 
                showContactForm={true}
                isPreview={false}
                canEdit={false}
                projects={projects}
                reviews={reviews}
                showPromoBanner={!user || !isArtisan}
                showBottomBanner={!user || !isArtisan}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
