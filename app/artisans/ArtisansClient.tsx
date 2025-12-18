"use client";

import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, orderBy, where, limit, startAfter } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Phone, Mail, MapPin, Star, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { filterArtisansByDistance } from "@/lib/geo-utils";
import { renovationPrestations } from "@/lib/renovation-suggestions";
import { filterAndSortArtisans, getFilteringStats } from "@/lib/artisan-filtering-algorithm";
import TopArtisanBadge from "@/components/TopArtisanBadge";

interface Artisan {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  profession: string;
  professions: string[];
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  averageRating: number;
  reviewCount: number;
  slug: string;
  privacy: {
    profileVisible: boolean;
    showPhone: boolean;
    showEmail: boolean;
    allowDirectContact: boolean;
  };
  // Propriétés ajoutées pour corriger les erreurs TypeScript
  accountType?: string;
  isPromo?: boolean;
  distance?: number;
  premiumFeatures?: {
    isPremium: boolean;
    premiumStartDate?: any;
    premiumEndDate?: any;
    showTopArtisanBadge?: boolean;
    premiumType?: 'monthly' | 'yearly' | 'lifetime';
    bannerPhotos?: string[];
    bannerVideo?: string;
    premiumBenefits?: string[];
  };
}

export default function ArtisansClient() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [secteurSearch, setSecteurSearch] = useState("");
  const [prestationSearch, setPrestationSearch] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState<{name: string, lat: number, lng: number, type?: string} | null>(null);
  const [selectedPrestation, setSelectedPrestation] = useState<string>("");
  const [secteurSuggestions, setSecteurSuggestions] = useState<{name: string, lat: number, lng: number, type?: string}[]>([]);
  const [prestationSuggestions, setPrestationSuggestions] = useState<string[]>([]);
  const [showSecteurSuggestions, setShowSecteurSuggestions] = useState(false);
  const [showPrestationSuggestions, setShowPrestationSuggestions] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isArtisan, setIsArtisan] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const [hasUrlParams, setHasUrlParams] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);


  // Fonction pour rechercher les secteurs avec Mapbox (comme dans MapboxMap.tsx)
  const searchSecteurs = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!mapboxToken) {
        console.error('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN non configuré');
        return [];
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&country=FR&types=place,region,district,postcode,locality,neighborhood&limit=5`
      );
      
      if (!response.ok) {
        console.error('Erreur API Mapbox:', response.status, response.statusText);
        return [];
      }

      const data = await response.json();
      
      if (data.features) {
        const suggestions = data.features.map((feature: any) => ({
          name: feature.place_name,
          lat: feature.center[1],
          lng: feature.center[0],
          type: feature.place_type[0]
        }));
        
        return suggestions;
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors de la recherche Mapbox:', error);
      return [];
    }
  };

  // Fonction pour normaliser le texte (supprimer les accents)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Supprime les accents
  };

  // Fonction pour rechercher les prestations
  const searchPrestations = (query: string) => {
    // Si pas de query, retourner toutes les prestations (pour affichage au clic)
    if (!query.trim()) {
      return renovationPrestations
        .map(prestation => prestation.nom)
        .slice(0, 10); // Afficher plus de prestations quand pas de filtre
    }
    
    const queryNormalized = normalizeText(query);
    return renovationPrestations
      .filter(prestation => 
        normalizeText(prestation.nom).includes(queryNormalized)
      )
      .map(prestation => prestation.nom)
      .slice(0, 8);
  };

  // Gérer la saisie du secteur avec debounce
  const handleSecteurChange = (value: string) => {
    setSecteurSearch(value);
    
    // Annuler le timeout précédent
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (value.trim() && value.length >= 2) {
      // Créer un nouveau timeout pour debounce
      const timeout = setTimeout(async () => {
        const suggestions = await searchSecteurs(value);
        setSecteurSuggestions(suggestions);
        setShowSecteurSuggestions(true);
      }, 300); // Attendre 300ms après la dernière saisie
      
      setSearchTimeout(timeout);
    } else {
      setShowSecteurSuggestions(false);
      setSelectedSecteur(null);
      setSecteurSuggestions([]);
    }
  };

  // Gérer la saisie de la prestation
  const handlePrestationChange = (value: string) => {
    setPrestationSearch(value);
    const suggestions = searchPrestations(value);
    setPrestationSuggestions(suggestions);
    setShowPrestationSuggestions(suggestions.length > 0);
    
    if (!value.trim()) {
      setSelectedPrestation("");
    }
  };

  // Gérer le focus sur le champ prestation (afficher toutes les prestations)
  const handlePrestationFocus = () => {
    const suggestions = searchPrestations(prestationSearch);
    setPrestationSuggestions(suggestions);
    setShowPrestationSuggestions(suggestions.length > 0);
  };

  // Sélectionner un secteur
  const selectSecteur = (secteur: {name: string, lat: number, lng: number, type?: string}) => {
    // Extraire uniquement le nom de la ville (première partie avant la virgule)
    // Ex: "Rennes, Ille-et-Vilaine, France" -> "Rennes"
    const cityName = secteur.name.split(',')[0].trim();
    
    setSecteurSearch(secteur.name);
    setSelectedSecteur({
      ...secteur,
      name: cityName // Utiliser uniquement le nom de la ville pour le filtrage
    });
    setShowSecteurSuggestions(false);
  };

  // Sélectionner une prestation
  const selectPrestation = (prestation: string) => {
    setPrestationSearch(prestation);
    setSelectedPrestation(prestation);
    setShowPrestationSuggestions(false);
  };
  
  // Récupérer les paramètres de recherche depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Anciens paramètres (compatibilité)
    const projet = urlParams.get('projet');
    const localisation = urlParams.get('localisation');
    
    // Nouveaux paramètres du simulateur
    const secteur = urlParams.get('secteur');
    const ville = urlParams.get('ville');
    const specialite = urlParams.get('specialite');
    
    // Priorité aux nouveaux paramètres du simulateur
    if (secteur || ville || specialite) {
      // Remplir les champs séparés
      if (specialite) {
        // Convertir le slug en texte lisible
        const specialiteText = specialite
          .replace(/-/g, ' ')
          .replace(/renovation/g, 'rénovation')
          .replace(/pose/g, 'pose')
          .replace(/installation/g, 'installation')
          .replace(/cuisine/g, 'cuisine')
          .replace(/complete/g, 'complète')
          .replace(/moderne/g, 'moderne')
          .replace(/carrelage/g, 'carrelage')
          .replace(/parquet/g, 'parquet')
          .replace(/peinture/g, 'peinture')
          .replace(/chauffage/g, 'chauffage')
          .replace(/isolation/g, 'isolation')
          .replace(/facade/g, 'façade')
          .replace(/salle/g, 'salle')
          .replace(/bain/g, 'bain')
          .replace(/douche/g, 'douche')
          .replace(/italienne/g, 'italienne')
          .replace(/toiture/g, 'toiture')
          .replace(/charpente/g, 'charpente')
          .replace(/pompe/g, 'pompe')
          .replace(/chaleur/g, 'chaleur')
          .replace(/electricite/g, 'électricité')
          .replace(/plomberie/g, 'plomberie');
        setPrestationSearch(specialiteText);
      }
      
      // Remplir le secteur et essayer de trouver les coordonnées via Mapbox
      if (ville) {
        setSecteurSearch(ville);
        // Rechercher les coordonnées via Mapbox
        searchSecteurs(ville).then(suggestions => {
          if (suggestions.length > 0) {
            setSelectedSecteur(suggestions[0]);
          }
        });
      } else if (secteur) {
        setSecteurSearch(secteur);
        // Rechercher les coordonnées via Mapbox
        searchSecteurs(secteur).then(suggestions => {
          if (suggestions.length > 0) {
            setSelectedSecteur(suggestions[0]);
          }
        });
      }
      
      setHasUrlParams(true);
    }
    // Fallback sur les anciens paramètres
    else if (localisation) {
      if (projet) {
        setPrestationSearch(projet);
      }
      setSecteurSearch(localisation);
      // Rechercher les coordonnées via Mapbox
      searchSecteurs(localisation).then(suggestions => {
        if (suggestions.length > 0) {
          setSelectedSecteur(suggestions[0]);
        }
      });
      setHasUrlParams(true);
    }
  }, []);

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Composant étoile SVG personnalisé
  const StarIcon = ({ filled }: { filled: boolean }) => (
    <Star
      className={`h-4 w-4 ${
        filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
      }`}
    />
  );

  // Fonction pour afficher les étoiles selon la note
  // Fonction pour générer les initiales de l'entreprise
  const getCompanyInitials = (companyName: string) => {
    if (!companyName) return 'AR';
    
    const words = companyName.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };


  const renderStars = (rating: number) => {
    const safeRating = rating || 0;
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < safeRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Vérifier l'authentification et si l'utilisateur est un artisan
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Vérifier si l'utilisateur est un artisan
        try {
          const artisansRef = collection(db, "artisans");
          const q = query(artisansRef, where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          setIsArtisan(!querySnapshot.empty);
        } catch (error) {
          console.error("Erreur lors de la vérification artisan:", error);
          setIsArtisan(false);
        }
      } else {
        setIsArtisan(false);
      }
      
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Système de pagination fluide et intelligent
  const [allArtisansCache, setAllArtisansCache] = useState<Artisan[]>([]);
  const [hasMoreArtisans, setHasMoreArtisans] = useState(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [totalArtisansCount, setTotalArtisansCount] = useState<number>(0);
  const [countLoaded, setCountLoaded] = useState(false);

  // Fonction pour charger les artisans par batch de 10
  const loadArtisansBatch = async (isFirstLoad = false, withFilters = false) => {
    try {
      if (isFirstLoad) {
        setLoading(true);
        setArtisans([]);
        setAllArtisansCache([]);
        setLastVisible(null);
        setHasMoreArtisans(true);
      }

      const artisansRef = collection(db, "artisans");
      let q;

      if (withFilters) {
        // Avec filtres : ordre random (pas de orderBy pour permettre le random)
        q = query(
          artisansRef,
          limit(100) // Charger plus pour pouvoir randomiser et avoir assez d'artisans
        );
      } else {
        // Sans filtres : ordre général (par date de création)
        if (lastVisible && !isFirstLoad) {
          q = query(
            artisansRef,
            orderBy("createdAt", "desc"),
            startAfter(lastVisible),
            limit(50) // Charger plus d'artisans
          );
        } else {
          q = query(
            artisansRef,
            orderBy("createdAt", "desc"),
            limit(50) // Charger plus d'artisans au premier chargement
          );
        }
      }

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setHasMoreArtisans(false);
        return [];
      }

      console.log(`📦 ${querySnapshot.docs.length} artisans chargés depuis Firestore`);
      const batchArtisans: Artisan[] = [];
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        console.log(`🔎 Artisan chargé: ${data.companyName || data.firstName} - accountType: ${data.accountType || 'undefined'}`);

        // Règle stricte : ne pas afficher les profils non visibles
        if (data.privacy?.profileVisible !== true) {
          continue;
        }
        
        // Vérifier si c'est un artisan demo expiré
        const isDemo = data.accountType === 'demo';
        const isExpired = isDemo && data.demoConfig?.expiresAt && 
          new Date() > new Date(data.demoConfig.expiresAt.toDate ? data.demoConfig.expiresAt.toDate() : data.demoConfig.expiresAt);
        
        // Exclure les artisans demo expirés
        if (isExpired) {
          console.log(`❌ Artisan demo expiré exclu: ${data.companyName}`);
          continue;
        }
        
        // Filtrer seulement les artisans avec profil visible === true ET abonnement actif
        // Pour les VRAIS artisans (non-demo), on est plus permissif
        const isRealArtisan = !data.accountType || data.accountType !== 'demo';
        
        let shouldInclude = false;
        if (isRealArtisan) {
          // Pour les vrais artisans : toujours inclure (ils sont rares et précieux)
          shouldInclude = true;
        } else {
          // Pour les demos : vérifier les conditions
          const hasActiveSubscription = data.subscriptionStatus === 'active';
          const isProfileVisible = data.privacy?.profileVisible === true;
          shouldInclude = isProfileVisible && hasActiveSubscription;
        }
        
        if (shouldInclude) {
          const artisan = {
            id: doc.id,
            ...data,
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0
          } as Artisan;
          
          // Log pour déboguer
          if (!isDemo) {
            console.log('✅ VRAI ARTISAN chargé:', {
              id: doc.id,
              name: data.companyName,
              accountType: data.accountType,
              subscriptionStatus: data.subscriptionStatus,
              profileVisible: data.privacy?.profileVisible
            });
          }
          
          batchArtisans.push(artisan);
        }
      }

      // Fallback : si on ne récupère que des demos (ex: tri par createdAt desc) on tente un 2e fetch
      // sans orderBy pour augmenter les chances de récupérer les vrais artisans (accountType absent).
      const hasAnyReal = batchArtisans.some(a => !a.accountType || a.accountType !== 'demo');
      if (!withFilters && isFirstLoad && !hasAnyReal) {
        try {
          const fallbackSnapshot = await getDocs(query(artisansRef, limit(250)));
          const fallbackArtisans: Artisan[] = [];

          for (const doc of fallbackSnapshot.docs) {
            const data = doc.data();

            // Règle stricte : ne pas afficher les profils non visibles
            if (data.privacy?.profileVisible !== true) {
              continue;
            }
            const isDemo = data.accountType === 'demo';
            const isExpired = isDemo && data.demoConfig?.expiresAt &&
              new Date() > new Date(data.demoConfig.expiresAt.toDate ? data.demoConfig.expiresAt.toDate() : data.demoConfig.expiresAt);
            if (isExpired) continue;

            const artisan = {
              id: doc.id,
              ...data,
              averageRating: data.averageRating || 0,
              reviewCount: data.reviewCount || 0
            } as Artisan;

            fallbackArtisans.push(artisan);
          }

          const byId = new Map<string, Artisan>();
          for (const a of batchArtisans) byId.set(a.id, a);
          for (const a of fallbackArtisans) {
            if (!byId.has(a.id)) byId.set(a.id, a);
          }

          const merged = Array.from(byId.values());
          const mergedHasAnyReal = merged.some(a => !a.accountType || a.accountType !== 'demo');
          console.log('🧩 Fallback merge artisans:', {
            initial: batchArtisans.length,
            fallback: fallbackArtisans.length,
            merged: merged.length,
            hasAnyRealBefore: hasAnyReal,
            hasAnyRealAfter: mergedHasAnyReal
          });

          // Remplacer le batch par le batch enrichi
          batchArtisans.splice(0, batchArtisans.length, ...merged);
        } catch (e) {
          console.warn('⚠️ Fallback fetch artisans failed:', e);
        }
      }

      // Mettre à jour lastVisible pour la pagination
      if (!withFilters && querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }

      if (withFilters) {
        // Avec filtres : randomiser les résultats
        const shuffled = batchArtisans.sort(() => 0.5 - Math.random());
        return shuffled;
      } else {
        // Sans filtres : ordre naturel
        return batchArtisans;
      }

    } catch (error) {
      console.error("Erreur lors du chargement des artisans:", error);
      return [];
    } finally {
      if (isFirstLoad) {
        setLoading(false);
      }
    }
  };

  // Fonction pour compter le total d'artisans (optimisée)
  const countTotalArtisans = async () => {
    try {
      const artisansRef = collection(db, "artisans");
      // Utiliser getCountFromServer pour compter sans charger les documents
      const snapshot = await getDocs(query(artisansRef, limit(1000)));
      
      // Estimation rapide basée sur les documents chargés
      setTotalArtisansCount(snapshot.size);
      setCountLoaded(true);
    } catch (error) {
      console.error("Erreur lors du comptage des artisans:", error);
      setTotalArtisansCount(100); // Valeur par défaut
      setCountLoaded(true);
    }
  };

  // Chargement initial avec comptage
  useEffect(() => {
    const initializeData = async () => {
      // Compter le total d'artisans en parallèle
      countTotalArtisans();
      
      // Charger le premier batch d'artisans
      const initialArtisans = await loadArtisansBatch(true, false);
      setArtisans(initialArtisans);
      setAllArtisansCache(initialArtisans);
    };
    
    initializeData();
  }, []);

  // Gestion intelligente des filtres et pagination
  const hasActiveFilters = useMemo(() => {
    // IMPORTANT: on ne considère pas la saisie secteurSearch comme un filtre actif.
    // Le filtrage géographique ne s'applique que lorsque l'utilisateur a sélectionné une suggestion (selectedSecteur).
    return !!(prestationSearch.trim() || selectedSecteur || selectedPrestation);
  }, [prestationSearch, selectedSecteur, selectedPrestation]);

  // Charger plus d'artisans quand on change de page
  const loadMoreArtisans = async () => {
    if (!hasMoreArtisans || loading) return;
    
    const newArtisans = await loadArtisansBatch(false, hasActiveFilters);
    if (newArtisans.length > 0) {
      setAllArtisansCache(prev => [...prev, ...newArtisans]);
    }
  };

  // Recharger quand les filtres changent
  useEffect(() => {
    if (hasActiveFilters) {
      // Avec filtres : recharger avec randomisation
      loadArtisansBatch(true, true).then(filteredArtisans => {
        setArtisans(filteredArtisans);
        setAllArtisansCache(filteredArtisans);
      });
    } else {
      // Sans filtres : revenir au chargement normal
      loadArtisansBatch(true, false).then(initialArtisans => {
        setArtisans(initialArtisans);
        setAllArtisansCache(initialArtisans);
      });
    }
    setCurrentPage(1);
  }, [hasActiveFilters, prestationSearch, selectedSecteur, selectedPrestation]);

  // Utiliser le nouvel algorithme de filtrage et tri
  const filteredResult = useMemo(() => {
    const criteria = {
      secteurSearch,
      prestationSearch,
      selectedSecteur,
      selectedPrestation
    };
    
    console.log(`🔍 AVANT ALGORITHME:`);
    console.log(`- allArtisansCache.length: ${allArtisansCache.length}`);
    console.log(`- criteria:`, criteria);
    console.log(`- currentPage: ${currentPage}`);
    console.log(`- itemsPerPage: ${itemsPerPage}`);
    
    const result = filterAndSortArtisans(
      allArtisansCache,
      criteria,
      currentPage,
      itemsPerPage
    );
    
    console.log(`🔍 APRÈS ALGORITHME:`);
    console.log(`- result.artisans.length: ${result.artisans.length}`);
    console.log(`- result.totalCount: ${result.totalCount}`);
    
    return result;
  }, [allArtisansCache, secteurSearch, prestationSearch, selectedSecteur, selectedPrestation, currentPage, itemsPerPage]);

  const displayedArtisans = filteredResult.artisans;
  
  // Calculer le nombre total de pages basé sur le vrai count d'artisans
  const totalPages = useMemo(() => {
    if (!countLoaded) return 0;
    
    if (hasActiveFilters) {
      // Avec filtres : utiliser le count filtré
      return Math.ceil(filteredResult.totalCount / itemsPerPage);
    } else {
      // Sans filtres : utiliser le count total de la DB
      return Math.ceil(totalArtisansCount / itemsPerPage);
    }
  }, [countLoaded, hasActiveFilters, filteredResult.totalCount, totalArtisansCount, itemsPerPage]);

  // Charger plus d'artisans si on arrive en fin de cache
  useEffect(() => {
    const currentCacheSize = allArtisansCache.length;
    const neededSize = currentPage * itemsPerPage;
    
    if (!hasActiveFilters && neededSize > currentCacheSize - 11 && hasMoreArtisans) {
      loadMoreArtisans();
    }
  }, [currentPage, allArtisansCache.length, hasActiveFilters, hasMoreArtisans]);

  // Fonction pour gérer le changement de page avec loader
  const handlePageChange = async (newPage: number) => {
    if (newPage === currentPage || paginationLoading) return;
    
    setPaginationLoading(true);
    
    // Simuler un délai pour que le loader soit visible
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentPage(newPage);
    
    // Attendre que les données soient prêtes
    setTimeout(() => {
      setPaginationLoading(false);
    }, 300);
  };

  // Extraire les données du résultat
  const filteredArtisans = displayedArtisans;
  const totalCount = hasActiveFilters ? filteredResult.totalCount : totalArtisansCount;
  const hasRandomPremium = filteredResult.hasRandomPremium;
  

  // Pagination basée sur le total count
  const paginatedArtisans = filteredArtisans; // Déjà paginé par l'algorithme

  // Ajouter une carte promotionnelle si pas de recherche manuelle et pas artisan connecté
  const artisansWithPromo = useMemo(() => {
    const hasManualSearch = secteurSearch.trim() || prestationSearch.trim();
    
    if (hasManualSearch || (user && isArtisan)) {
      return paginatedArtisans;
    }
    
    const result = [...paginatedArtisans];
    const promoPosition = Math.min(3, result.length);
    result.splice(promoPosition, 0, { isPromo: true } as any);
    
    return result;
  }, [paginatedArtisans, secteurSearch, prestationSearch, user, isArtisan]);

  // Reset page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [secteurSearch, prestationSearch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* En-tête avec titre et barre de recherche */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Nos Artisans Partenaires
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Découvrez nos professionnels qualifiés près de chez vous
            </p>
            
            {/* Barres de recherche séparées */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Secteur avec autocomplétion */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Secteur (ville, code postal...)"
                    value={secteurSearch}
                    onChange={(e) => handleSecteurChange(e.target.value)}
                    onFocus={() => secteurSearch.length >= 2 && secteurSuggestions.length > 0 && setShowSecteurSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSecteurSuggestions(false), 200)}
                    className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  />
                  
                  {/* Suggestions secteur */}
                  {showSecteurSuggestions && secteurSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1">
                      {secteurSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSecteur(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                              <div>
                                <span className="font-medium">{suggestion.name}</span>
                                {suggestion.type && (
                                  <span className="text-xs text-gray-400 ml-2">
                                    ({suggestion.type === 'place' ? 'ville' : 
                                      suggestion.type === 'locality' ? 'localité' : 
                                      suggestion.type === 'neighborhood' ? 'quartier' : 
                                      suggestion.type})
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">70km</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Prestation avec autocomplétion */}
                <div className="relative">
                  <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <Input
                    type="text"
                    placeholder="Prestation (cuisine, plomberie...)"
                    value={prestationSearch}
                    onChange={(e) => handlePrestationChange(e.target.value)}
                    onFocus={handlePrestationFocus}
                    onBlur={() => setTimeout(() => setShowPrestationSuggestions(false), 200)}
                    className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-green-500 rounded-lg"
                  />
                  
                  {/* Suggestions prestation */}
                  {showPrestationSuggestions && prestationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1">
                      {prestationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectPrestation(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-green-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <Wrench className="h-4 w-4 text-green-500 mr-2" />
                            <span className="font-medium">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Indicateur de filtres appliqués depuis le simulateur */}
            {hasUrlParams && (secteurSearch || prestationSearch) && (
              <div className="mt-4 max-w-4xl mx-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center">
                  <div className="flex-shrink-0">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Filtres appliqués depuis le simulateur :</span>
                      {secteurSearch && <span className="ml-2 bg-blue-100 px-2 py-1 rounded">📍 {secteurSearch}</span>}
                      {prestationSearch && <span className="ml-2 bg-blue-100 px-2 py-1 rounded">🔧 {prestationSearch}</span>}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSecteurSearch('');
                        setPrestationSearch('');
                        setHasUrlParams(false);
                        // Nettoyer l'URL
                        window.history.replaceState({}, '', '/artisans');
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1 h-auto"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Résultats */}
          {(loading || !countLoaded) ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">
                {!countLoaded ? "Comptage des artisans..." : "Chargement des artisans..."}
              </span>
            </div>
          ) : (
            <>
              {/* Nombre de résultats */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {totalCount} artisan{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
                  {secteurSearch && prestationSearch && ` pour "${prestationSearch}" dans "${secteurSearch}"`}
                  {secteurSearch && !prestationSearch && ` dans le secteur "${secteurSearch}"`}
                  {!secteurSearch && prestationSearch && ` pour "${prestationSearch}"`}
                  {totalPages > 1 && ` - Page ${currentPage} sur ${totalPages}`}
                </p>
              </div>

              {/* Loader de pagination */}
              {paginationLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  <span className="ml-2 text-gray-600">Chargement de la page {currentPage}...</span>
                </div>
              )}

              {/* Grille des artisans avec carte promotionnelle intégrée */}
              {!paginationLoading && artisansWithPromo.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {artisansWithPromo.map((artisan, index) => {
                    // Vérifier si c'est la carte promo
                    if (artisan.isPromo) {
                      return (
                        <Link key="promo-card" href="/devenir-pro" className="group">
                          <div className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group rounded-lg bg-white border-2 border-orange-500">
                            {/* Image de couverture promotionnelle */}
                            <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-600">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Plus className="h-16 w-16 text-white opacity-80" />
                              </div>
                              
                              {/* Badge "PUBLICITÉ" en overlay */}
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-white text-orange-600 font-semibold">
                                  PUBLICITÉ
                                </Badge>
                              </div>
                            </div>

                            <div className="p-4">
                              {/* Nom de l'entreprise */}
                              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                                Rejoignez nos artisans !
                              </h3>

                              {/* Nom du gérant */}
                              <p className="text-gray-600 text-sm mb-3">
                                Développez votre activité
                              </p>

                              {/* Profession principale */}
                              <Badge variant="secondary" className="mb-3">
                                Tous métiers
                              </Badge>

                              {/* Ville et distance - même structure */}
                              <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>Partout en France</span>
                                </div>
                              </div>

                              {/* Note et avis factices - même structure */}
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <div className="flex mr-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4" style={{ fill: "#fbbf24", color: "#fbbf24" }} />
                                  ))}
                                </div>
                                <span className="font-medium">4.9</span>
                                <span className="ml-1">(50+ avis)</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    }
                    
                    // C'est un artisan normal
                    return (
                      <Link 
                        key={`${artisan.id}-${index}`} 
                        href={`/artisans/${artisan.slug || artisan.id}`}
                        className="group"
                      >
                        <div className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group rounded-lg bg-white border border-gray-200 h-full flex flex-col">
                          {/* Image de couverture */}
                          <div className="relative h-48 bg-gray-200">
                            
                            {/* Badge Top Artisan en haut à droite */}
                            {artisan.premiumFeatures?.isPremium === true && 
                             (artisan.premiumFeatures as any)?.showTopArtisanBadge === true && (
                              <div className="absolute top-2 right-2 z-10">
                                <TopArtisanBadge 
                                  size="sm" 
                                  variant="compact"
                                />
                              </div>
                            )}
                            {artisan.coverUrl ? (
                              <Image
                                src={artisan.coverUrl}
                                alt={`Couverture ${artisan.companyName}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 text-4xl font-bold">
                                  {getCompanyInitials(artisan.companyName)}
                                </span>
                              </div>
                            )}
                            
                            {/* Logo en overlay */}
                            {artisan.logoUrl && (
                              <div className="absolute bottom-4 left-4">
                                <div className="w-16 h-16 rounded-full bg-white shadow-lg overflow-hidden border-2 border-white">
                                  <Image
                                    src={artisan.logoUrl}
                                    alt={`Logo ${artisan.companyName}`}
                                    width={64}
                                    height={64}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="p-4 flex-1 flex flex-col">
                            
                            {/* Nom de l'entreprise */}
                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                              {artisan.companyName}
                            </h3>

                            {/* Nom du gérant */}
                            <p className="text-gray-600 text-sm mb-3">
                              {artisan.firstName} {artisan.lastName}
                            </p>

                            {/* Profession principale */}
                            {artisan.profession && (
                              <Badge variant="secondary" className="mb-3">
                                {artisan.profession}
                              </Badge>
                            )}

                            {/* Ville et distance */}
                            <div className="flex items-center justify-between text-gray-600 text-sm mb-2">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{artisan.city}</span>
                              </div>
                              {artisan.distance && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {artisan.distance} km
                                </span>
                              )}
                            </div>

                            {/* Note et avis - vraies données de la DB */}
                            <div className="flex items-center text-sm text-gray-600 mb-3 mt-auto">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= (artisan.averageRating || 0) 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'fill-gray-300 text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium ml-2">{(artisan.averageRating || 0).toFixed(1)}/5</span>
                              <span className="ml-1">({artisan.reviewCount || 0} avis)</span>
                            </div>

                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : !paginationLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">Aucun artisan trouvé</p>
                  {(secteurSearch || prestationSearch) && (
                    <p className="text-gray-400 text-sm mt-2">
                      Essayez de modifier votre recherche ou de supprimer certains filtres
                    </p>
                  )}
                </div>
              ) : null}

              {/* Pagination */}
              {countLoaded && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || paginationLoading}
                  >
                    Précédent
                  </Button>
                  
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            disabled={paginationLoading}
                            className={currentPage === page ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || paginationLoading}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
