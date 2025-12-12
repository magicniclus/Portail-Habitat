"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FicheEntreprise from "@/components/FicheEntreprise";
import { uploadCoverPhoto, uploadLogoPhoto, updateArtisanDescription, updateArtisanPrestations, updateArtisanQuoteRange, updateArtisanCertifications, addArtisanProject, getArtisanProjects, updateProjectVisibility, deleteArtisanProject, updateArtisanProject, addPremiumBannerPhoto, uploadPremiumBannerPhotos } from "@/lib/storage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, query, where, collection, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { 
  ExternalLink,
  Share2,
  Loader2
} from "lucide-react";
import { XIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import TopArtisanBadge from "@/components/TopArtisanBadge";
import { isPremiumActive } from "@/lib/premium-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

export default function MaFichePage() {
  const [entreprise, setEntreprise] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUploadingBannerPhotos, setIsUploadingBannerPhotos] = useState(false);
  
  // Vérifier si l'artisan est premium et a le badge activé
  const shouldShowTopBadge = entreprise?.premiumFeatures && 
    isPremiumActive({ id: entreprise.id, premiumFeatures: entreprise.premiumFeatures }) && 
    entreprise.premiumFeatures.showTopArtisanBadge;

  // Récupérer l'utilisateur connecté et ses données artisan
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
            const artisanData = artisanDoc.data();
            
            // Transformer les données Firestore en format attendu par le composant
            setEntreprise({
              id: artisanDoc.id, // L'ID réel du document artisan
              slug: artisanData.slug || undefined, // Ajouter le slug
              nom: artisanData.companyName || "Nom de l'entreprise",
              logo: artisanData.logoUrl || undefined,
              banniere: artisanData.coverUrl || undefined,
              specialites: artisanData.professions || [],
              description: artisanData.description || "Description de l'entreprise",
              telephone: artisanData.phone || "",
              email: artisanData.email || user.email,
              adresse: artisanData.fullAddress || "",
              ville: artisanData.city || "",
              note: artisanData.averageRating || 0,
              nombreAvis: artisanData.reviewCount || 0,
              certifications: artisanData.certifications || [],
              zoneIntervention: artisanData.city ? [artisanData.city] : [],
              averageQuoteMin: artisanData.averageQuoteMin || undefined,
              averageQuoteMax: artisanData.averageQuoteMax || undefined,
              premiumFeatures: artisanData.premiumFeatures || null
            });

            // Charger les projets de l'artisan
            const artisanProjects = await getArtisanProjects(artisanDoc.id);
            setProjects(artisanProjects);
          } else {
            console.error('Aucun artisan trouvé pour cet utilisateur');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données artisan:', error);
        }
      } else {
        setCurrentUser(null);
        setEntreprise(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Écouter les avis en temps réel et mettre à jour les statistiques
  useEffect(() => {
    if (!entreprise?.id) return;

    const reviewsRef = collection(db, 'artisans', entreprise.id, 'reviews');
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const reviewsData: any[] = [];
      snapshot.forEach((doc) => {
        reviewsData.push({
          id: doc.id,
          ...doc.data()
        });
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

  // Fonction pour gérer le changement de photo de couverture
  const handleCoverChange = async (file: File) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      // Upload vers Firebase Storage avec le vrai ID de l'artisan
      const newCoverUrl = await uploadCoverPhoto(entreprise.id, file);
      
      // Mettre à jour l'état local
      setEntreprise((prev: any) => ({
        ...prev,
        banniere: newCoverUrl
      }));
      
      console.log('Photo de couverture mise à jour:', newCoverUrl);
    } catch (error) {
      console.error('Erreur lors du changement de couverture:', error);
      throw error;
    }
  };

  // Fonction pour gérer le changement de logo
  const handleLogoChange = async (file: File) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      // Upload vers Firebase Storage avec le vrai ID de l'artisan
      const newLogoUrl = await uploadLogoPhoto(entreprise.id, file);
      
      // Mettre à jour l'état local
      setEntreprise((prev: any) => ({
        ...prev,
        logo: newLogoUrl
      }));
      
      console.log('Logo mis à jour:', newLogoUrl);
    } catch (error) {
      console.error('Erreur lors du changement de logo:', error);
      throw error;
    }
  };

  // Fonction pour gérer le changement de description
  const handleDescriptionChange = async (description: string) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      // Mettre à jour dans Firestore avec le vrai ID de l'artisan
      await updateArtisanDescription(entreprise.id, description);
      
      // Mettre à jour l'état local
      setEntreprise((prev: any) => ({
        ...prev,
        description: description
      }));
      
      console.log('Description mise à jour:', description);
    } catch (error) {
      console.error('Erreur lors du changement de description:', error);
      throw error;
    }
  };

  // Fonction pour gérer le changement des prestations
  const handlePrestationsChange = async (prestations: string[]) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      // Mettre à jour dans Firestore avec le vrai ID de l'artisan
      await updateArtisanPrestations(entreprise.id, prestations);
      
      // Mettre à jour l'état local
      setEntreprise((prev: any) => ({
        ...prev,
        specialites: prestations
      }));
      
      console.log('Prestations mises à jour:', prestations);
    } catch (error) {
      console.error('Erreur lors du changement des prestations:', error);
      throw error;
    }
  };

  // Fonction pour gérer le changement des prix
  const handleQuoteRangeChange = async (min: number, max: number) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      // Mettre à jour dans Firestore avec le vrai ID de l'artisan
      await updateArtisanQuoteRange(entreprise.id, min, max);
      
      // Mettre à jour l'état local
      setEntreprise((prev: any) => ({
        ...prev,
        averageQuoteMin: min,
        averageQuoteMax: max
      }));
      
      console.log('Prix mis à jour:', { min, max });
    } catch (error) {
      console.error('Erreur lors du changement des prix:', error);
      throw error;
    }
  };

  // Fonction pour gérer le changement des certifications
  const handleCertificationsChange = async (certifications: string[]) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      // Mettre à jour dans Firestore avec le vrai ID de l'artisan
      await updateArtisanCertifications(entreprise.id, certifications);
      
      // Mettre à jour l'état local
      setEntreprise((prev: any) => ({
        ...prev,
        certifications: certifications
      }));
      
      console.log('Certifications mises à jour:', certifications);
    } catch (error) {
      console.error('Erreur lors du changement des certifications:', error);
      throw error;
    }
  };

  // Fonction pour ajouter un projet
  const handleAddProject = async (projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    photos: File[];
  }) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      const projectId = await addArtisanProject(entreprise.id, projectData);
      
      // Recharger les projets
      const updatedProjects = await getArtisanProjects(entreprise.id);
      setProjects(updatedProjects);
      
      console.log('Projet ajouté:', projectId);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du projet:', error);
      throw error;
    }
  };

  // Fonction pour changer la visibilité d'un projet
  const handleProjectVisibilityToggle = async (projectId: string, isVisible: boolean) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      await updateProjectVisibility(entreprise.id, projectId, isVisible);
      
      // Mettre à jour l'état local
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, isPubliclyVisible: isVisible }
          : project
      ));
      
      console.log('Visibilité du projet mise à jour:', { projectId, isVisible });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
      throw error;
    }
  };

  // Fonction pour modifier un projet
  const handleEditProject = async (projectId: string, projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    newPhotos: File[];
    existingPhotos: string[];
  }) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      await updateArtisanProject(entreprise.id, projectId, projectData);
      
      // Recharger les projets
      const updatedProjects = await getArtisanProjects(entreprise.id);
      setProjects(updatedProjects);
      
      console.log('Projet modifié:', projectId);
    } catch (error) {
      console.error('Erreur lors de la modification du projet:', error);
      throw error;
    }
  };

  // Fonction pour supprimer un projet
  const handleDeleteProject = async (projectId: string) => {
    if (!entreprise?.id) {
      throw new Error('ID artisan non trouvé');
    }

    try {
      await deleteArtisanProject(entreprise.id, projectId);
      
      // Mettre à jour l'état local
      setProjects(prev => prev.filter(project => project.id !== projectId));
      
      console.log('Projet supprimé:', projectId);
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw error;
    }
  };

  // Fonction pour partager la fiche
  const handleShare = async () => {
    const url = `${window.location.origin}/artisans/${entreprise?.slug || entreprise?.id}`;
    
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
    const url = `${window.location.origin}/artisans/${entreprise?.slug || entreprise?.id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // Fonction pour partager sur X (Twitter)
  const handleShareX = () => {
    const url = `${window.location.origin}/artisans/${entreprise?.slug || entreprise?.id}`;
    const text = `Découvrez la fiche de ${entreprise?.nom} - Artisan professionnel`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank', 'width=600,height=400');
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  // Utilisateur non connecté
  if (!currentUser || !entreprise) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vous devez être connecté pour voir votre fiche.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ma fiche</h1>
          <p className="text-muted-foreground">
            Prévisualisez et gérez votre fiche entreprise
          </p>
        </div>
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareFacebook} className="text-blue-600 hover:bg-blue-50">
              <FacebookIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareX} className="text-black hover:bg-gray-50">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="w-fit" asChild>
            <Link href={`/artisans/${entreprise?.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Voir ma fiche publique</span>
              <span className="sm:hidden">Voir fiche</span>
            </Link>
          </Button>
        </div>
      </div>


      {/* Fiche entreprise */}
      <div className="w-full h-full">
        <FicheEntreprise 
          entreprise={entreprise} 
          showContactForm={true}
          isPreview={false}
          canEdit={true}
          onCoverChange={handleCoverChange}
          onLogoChange={handleLogoChange}
          onDescriptionChange={handleDescriptionChange}
          onPrestationsChange={handlePrestationsChange}
          onQuoteRangeChange={handleQuoteRangeChange}
          onCertificationsChange={handleCertificationsChange}
          projects={projects}
          reviews={reviews}
          onAddProject={handleAddProject}
          onProjectVisibilityToggle={handleProjectVisibilityToggle}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </div>
    </div>
  );
}
