"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FicheEntreprise from "@/components/FicheEntreprise";
import { uploadCoverPhoto, uploadLogoPhoto, updateArtisanDescription, updateArtisanPrestations, updateArtisanQuoteRange, updateArtisanCertifications, addArtisanProject, getArtisanProjects, updateProjectVisibility, deleteArtisanProject, updateArtisanProject, addPremiumBannerPhoto, uploadPremiumBannerPhotos } from "@/lib/storage";
import UpgradeButton from "@/components/UpgradeButton";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, query, where, collection, getDocs, onSnapshot, updateDoc, serverTimestamp } from "firebase/firestore";
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
import type { User } from "firebase/auth";
import type { DocumentData } from "firebase/firestore";

interface Entreprise {
  id: string;
  slug?: string;
  siret?: string;
  nom: string;
  logo?: string;
  banniere?: string;
  specialites: string[];
  description: string;
  telephone: string;
  email: string;
  adresse: string;
  ville: string;
  note: number;
  nombreAvis: number;
  certifications: string[];
  zoneIntervention: string[];
  averageQuoteMin?: number;
  averageQuoteMax?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  premiumFeatures: any;
  hasPremiumSite: boolean;
}

interface Project {
  id: string;
  title?: string;
  description?: string;
  photos?: string[];
  isPubliclyVisible?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
  [key: string]: unknown;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
  [key: string]: unknown;
}

export default function MaFichePage() {
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUploadingBannerPhotos, setIsUploadingBannerPhotos] = useState(false);
  // SIRET
  const [siretInput, setSiretInput] = useState("");
  const [siretLoading, setSiretLoading] = useState(false);
  const [siretError, setSiretError] = useState<string | null>(null);
  const [siretSuccess, setSiretSuccess] = useState(false);
  const [siretSuggestions, setSiretSuggestions] = useState<Array<{siret:string;nom:string;adresse:string;ville:string;actif:boolean}>>([]);
  const [siretSearchLoading, setSiretSearchLoading] = useState(false);
  const [siretSelected, setSiretSelected] = useState<{siret:string;nom:string} | null>(null);
  const siretDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Vérifier si l'artisan est premium et a le badge activé
  const shouldShowTopBadge = entreprise?.premiumFeatures && 
    isPremiumActive({ id: entreprise.id, premiumFeatures: entreprise.premiumFeatures }) && 
    entreprise.premiumFeatures.showTopArtisanBadge;

  // Vérifie les critères de complétion et met ficheComplete = true en base si atteints
  const checkAndMarkFicheComplete = async (artisanId: string, artisanData: DocumentData, projectsData: Project[]) => {
    const hasDescription = artisanData.description && artisanData.description.trim().length > 10;
    const hasProfession = artisanData.professions && artisanData.professions.length > 0;
    const hasPhoto = (artisanData.photos && artisanData.photos.length > 0) ||
      (artisanData.coverUrl && artisanData.coverUrl.length > 0) ||
      projectsData.length > 0;

    const isComplete = hasDescription && hasProfession && hasPhoto;

    if (isComplete && !artisanData.ficheComplete) {
      try {
        await updateDoc(doc(db, "artisans", artisanId), {
          ficheComplete: true,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error("Erreur mise à jour ficheComplete:", err);
      }
    }
  };


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
            
            // CORRECTION AUTOMATIQUE DES DONNÉES PREMIUM MANQUANTES
            if (artisanData.premiumFeatures?.isPremium && !artisanData.premiumFeatures?.showTopArtisanBadge) {
              console.log('🔧 Correction automatique des données premium...');
              
              try {
                const token = await user.getIdToken();
                const response = await fetch('/api/fix-premium', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                const result = await response.json();
                console.log('✅ Correction premium:', result);
                
                if (result.success) {
                  // Recharger la page pour voir les changements
                  window.location.reload();
                }
              } catch (error) {
                console.error('❌ Erreur correction premium:', error);
              }
            }
            
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
              premiumFeatures: artisanData.premiumFeatures || null,
              hasPremiumSite: artisanData.hasPremiumSite || false,
              siret: artisanData.siret || undefined,
            });

            // Charger les projets de l'artisan
            const artisanProjects = await getArtisanProjects(artisanDoc.id);
            setProjects(artisanProjects);

            // Vérifier la complétion de la fiche
            await checkAndMarkFicheComplete(artisanDoc.id, artisanData, artisanProjects);

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

  // Recherche SIRET avec debounce
  const handleSiretSearch = (value: string) => {
    setSiretInput(value);
    setSiretSelected(null);
    setSiretError(null);
    if (siretDebounceRef.current) clearTimeout(siretDebounceRef.current);
    if (value.trim().length < 3) { setSiretSuggestions([]); return; }
    setSiretSearchLoading(true);
    siretDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-siret?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSiretSuggestions(data.suggestions || []);
      } catch { setSiretSuggestions([]); }
      finally { setSiretSearchLoading(false); }
    }, 350);
  };

  const handleSiretSelect = (s: {siret:string;nom:string}) => {
    setSiretSelected(s);
    setSiretInput(s.siret);
    setSiretSuggestions([]);
  };

  // Validation SIRET
  const handleSiretSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entreprise?.id || !siretSelected) return;
    setSiretLoading(true);
    setSiretError(null);
    setSiretSuccess(false);
    try {
      const res = await fetch("/api/verify-siret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siret: siretSelected.siret,
          companyName: entreprise.nom,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSiretError(data.error || "Erreur de vérification");
        return;
      }
      // Sauvegarder le SIRET + activer la visibilité publique
      const siretToSave = siretSelected.siret;
      const slug = entreprise.slug || `${entreprise.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")}-${entreprise.id.slice(-6)}`;
      await updateDoc(doc(db, "artisans", entreprise.id), {
        siret: siretToSave,
        "privacy.profileVisible": true,
        slug,
        updatedAt: serverTimestamp(),
      });
      setEntreprise((prev) => prev ? { ...prev, siret: siretToSave, slug } : prev);
      setSiretSuccess(true);
    } catch {
      setSiretError("Impossible de vérifier le SIRET. Vérifiez votre connexion.");
    } finally {
      setSiretLoading(false);
    }
  };

  // Écouter les avis en temps réel et mettre à jour les statistiques
  useEffect(() => {
    if (!entreprise?.id) return;

    const reviewsRef = collection(db, 'artisans', entreprise.id, 'reviews');
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const reviewsData: Review[] = [];
      snapshot.forEach((doc) => {
        reviewsData.push({
          id: doc.id,
          rating: (doc.data().rating as number) || 0,
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
        
        setEntreprise((prev) => prev ? ({
          ...prev,
          note: Math.round(averageRating * 10) / 10,
          nombreAvis: reviewsData.length
        }) : prev);
      } else {
        setEntreprise((prev) => prev ? ({
          ...prev,
          note: 0,
          nombreAvis: 0
        }) : prev);
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
      setEntreprise((prev) => prev ? ({ ...prev, banniere: newCoverUrl }) : prev);
      
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
      setEntreprise((prev) => prev ? ({ ...prev, logo: newLogoUrl }) : prev);
      
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
      await updateArtisanDescription(entreprise.id, description);
      const updatedEntreprise = { ...entreprise, description };
      setEntreprise(updatedEntreprise);
      await checkAndMarkFicheComplete(entreprise.id, { ...entreprise, description } as DocumentData, projects);
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
      await updateArtisanPrestations(entreprise.id, prestations);
      setEntreprise((prev) => prev ? ({ ...prev, specialites: prestations }) : prev);
      await checkAndMarkFicheComplete(entreprise.id, { ...entreprise, professions: prestations } as DocumentData, projects);
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
      setEntreprise((prev) => prev ? ({ ...prev, averageQuoteMin: min, averageQuoteMax: max }) : prev);
      
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
      setEntreprise((prev) => prev ? ({ ...prev, certifications }) : prev);
      
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
      const updatedProjects = await getArtisanProjects(entreprise.id);
      setProjects(updatedProjects);
      await checkAndMarkFicheComplete(entreprise.id, entreprise, updatedProjects);
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


      {/* Bannière SIRET — visible si SIRET non renseigné */}
      {!entreprise?.siret && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ExternalLink className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-orange-800 text-sm">Fiche non visible publiquement</p>
              <p className="text-orange-700 text-sm mt-0.5">
                Ajoutez votre numéro SIRET pour activer votre fiche et apparaître dans les résultats de recherche.
              </p>
            </div>
          </div>
          <form onSubmit={handleSiretSubmit}>
            <div className="relative flex gap-2">
              {/* Input OU sélection — même hauteur, même ligne */}
              {siretSelected ? (
                <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-white border border-green-300 rounded-lg text-sm min-w-0">
                  <span className="text-green-600 flex-shrink-0">✓</span>
                  <span className="font-medium text-gray-800 truncate">{siretSelected.nom}</span>
                  <span className="text-gray-400 font-mono text-xs flex-shrink-0 hidden sm:block">{siretSelected.siret}</span>
                  <button
                    type="button"
                    onClick={() => { setSiretSelected(null); setSiretInput(""); setSiretSuggestions([]); }}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-auto leading-none"
                    aria-label="Annuler la sélection"
                  >✕</button>
                </div>
              ) : (
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Recherchez par nom d'entreprise ou SIRET…"
                    value={siretInput}
                    onChange={(e) => handleSiretSearch(e.target.value)}
                    autoComplete="off"
                    className="w-full rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-8"
                  />
                  {siretSearchLoading && (
                    <Loader2 className="h-4 w-4 animate-spin absolute right-2 top-2.5 text-orange-400" />
                  )}
                  {/* Dropdown */}
                  {siretSuggestions.length > 0 && (
                    <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {siretSuggestions.map((s) => (
                        <li key={s.siret}>
                          <button
                            type="button"
                            onClick={() => handleSiretSelect(s)}
                            className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <span className={`text-sm font-medium ${s.actif ? "text-gray-900" : "text-gray-400 line-through"}`}>
                                  {s.nom}
                                </span>
                                {!s.actif && <span className="ml-2 text-xs text-red-500">Radiée</span>}
                                <div className="text-xs text-gray-500 mt-0.5 truncate">
                                  {s.adresse && `${s.adresse} · `}{s.ville}
                                </div>
                              </div>
                              <span className="text-xs text-gray-400 font-mono flex-shrink-0">{s.siret}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={siretLoading || !siretSelected}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm whitespace-nowrap flex-shrink-0"
              >
                {siretLoading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Vérification…</>
                  : "Vérifier et activer"}
              </Button>
            </div>
          </form>
          {siretError && (
            <p className="mt-2 text-sm text-red-600">{siretError}</p>
          )}
        </div>
      )}

      {/* Confirmation SIRET validé */}
      {siretSuccess && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <ExternalLink className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">SIRET validé — Fiche activée !</p>
            <p className="text-xs text-green-700">Votre fiche est maintenant visible publiquement.</p>
          </div>
        </div>
      )}

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
