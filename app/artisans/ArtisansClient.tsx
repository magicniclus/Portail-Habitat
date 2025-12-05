"use client";

import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Phone, Mail, MapPin, Star, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { filterArtisansByDistance } from "@/lib/geo-utils";

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
}

export default function ArtisansClient() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isArtisan, setIsArtisan] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  
  // Récupérer les paramètres de recherche depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projet = urlParams.get('projet');
    const localisation = urlParams.get('localisation');
    
    // Si on a au moins la localisation, construire la recherche
    if (localisation) {
      const searchQuery = projet ? `${projet} ${localisation}` : localisation;
      setSearchTerm(searchQuery);
    }
  }, []);

  // Composant étoile SVG personnalisé
  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#fbbf24" : "#d1d5db"}
      stroke={filled ? "#fbbf24" : "#d1d5db"}
      strokeWidth="1"
      className="inline-block"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
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
    const fullStars = Math.floor(safeRating);
    
    return (
      <div className="flex items-center">
        <StarIcon filled={fullStars > 0} />
        <StarIcon filled={fullStars > 1} />
        <StarIcon filled={fullStars > 2} />
        <StarIcon filled={fullStars > 3} />
        <StarIcon filled={fullStars > 4} />
      </div>
    );
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

  // Récupérer 20 artisans aléatoires au chargement
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        
        // Récupérer tous les artisans visibles
        const artisansRef = collection(db, "artisans");
        const q = query(artisansRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const allArtisans: Artisan[] = [];
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          // Filtrer seulement les artisans avec profil visible
          if (data.privacy?.profileVisible) {
            // Récupérer les reviews pour calculer la vraie moyenne
            try {
              const reviewsRef = collection(db, "artisans", doc.id, "reviews");
              const reviewsSnapshot = await getDocs(reviewsRef);
              
              let totalRating = 0;
              let reviewCount = 0;
              
              reviewsSnapshot.forEach((reviewDoc) => {
                const reviewData = reviewDoc.data();
                if (reviewData.rating && reviewData.displayed !== false) {
                  totalRating += reviewData.rating;
                  reviewCount++;
                }
              });
              
              const calculatedAverageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
              
              allArtisans.push({
                id: doc.id,
                ...data,
                averageRating: calculatedAverageRating,
                reviewCount: reviewCount
              } as Artisan);
            } catch (reviewError) {
              console.error("Erreur lors de la récupération des reviews:", reviewError);
              // Fallback sur les données originales
              allArtisans.push({
                id: doc.id,
                ...data
              } as Artisan);
            }
          }
        }

        // Mélanger et prendre 20 artisans aléatoires
        const shuffled = allArtisans.sort(() => 0.5 - Math.random());
        const randomArtisans = shuffled.slice(0, 20);
        
        setArtisans(randomArtisans);
      } catch (error) {
        console.error("Erreur lors de la récupération des artisans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  // Filtrer les artisans selon le terme de recherche avec logique en cascade
  const filteredArtisans = useMemo(() => {
    if (!searchTerm.trim()) {
      return artisans;
    }

    // Récupérer les paramètres de recherche depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const projet = urlParams.get('projet')?.toLowerCase();
    const localisation = urlParams.get('localisation')?.toLowerCase();

    // Si on a les paramètres URL, utiliser la logique en cascade avec géolocalisation
    if (localisation) {
      const lat = urlParams.get('lat');
      const lng = urlParams.get('lng');
      
      // Si on a les coordonnées, utiliser la recherche géographique
      if (lat && lng) {
        const centerLat = parseFloat(lat);
        const centerLng = parseFloat(lng);
        
        // Filtrer par distance (100km par défaut)
        let geoFilteredArtisans = filterArtisansByDistance(artisans, centerLat, centerLng, 100);
        
        // Si on a aussi un projet, filtrer en plus par projet
        if (projet) {
          const projectMatch = geoFilteredArtisans.filter(artisan => {
            return artisan.profession?.toLowerCase().includes(projet) ||
                   artisan.professions?.some((prof: string) => prof.toLowerCase().includes(projet)) ||
                   artisan.companyName?.toLowerCase().includes(projet);
          });
          
          if (projectMatch.length > 0) {
            return projectMatch;
          }
        }
        
        // Retourner les artisans dans la zone géographique
        if (geoFilteredArtisans.length > 0) {
          return geoFilteredArtisans;
        }
      }
      
      // Fallback sur la recherche textuelle si pas de coordonnées
      if (projet) {
        // 1. Essayer de filtrer par projet ET localisation
        const fullMatch = artisans.filter(artisan => {
          const matchesProject = artisan.profession?.toLowerCase().includes(projet) ||
                                artisan.professions?.some(prof => prof.toLowerCase().includes(projet)) ||
                                artisan.companyName?.toLowerCase().includes(projet);
          const matchesLocation = artisan.city?.toLowerCase().includes(localisation);
          return matchesProject && matchesLocation;
        });

        if (fullMatch.length > 0) {
          return fullMatch;
        }

        // 2. Si pas de résultat, essayer seulement par localisation
        const locationMatch = artisans.filter(artisan => 
          artisan.city?.toLowerCase().includes(localisation)
        );

        if (locationMatch.length > 0) {
          return locationMatch;
        }

        // 3. Si toujours pas de résultat, retourner tous les artisans
        return artisans;
      } else {
        // Si on a seulement la localisation
        const locationMatch = artisans.filter(artisan => 
          artisan.city?.toLowerCase().includes(localisation)
        );

        if (locationMatch.length > 0) {
          return locationMatch;
        }

        // Si pas de résultat, retourner tous les artisans
        return artisans;
      }
    }

    // Logique de recherche normale (si pas de paramètres URL)
    const searchLower = searchTerm.toLowerCase();
    return artisans.filter(artisan => 
      artisan.companyName?.toLowerCase().includes(searchLower) ||
      artisan.firstName?.toLowerCase().includes(searchLower) ||
      artisan.lastName?.toLowerCase().includes(searchLower) ||
      artisan.phone?.includes(searchTerm) ||
      artisan.profession?.toLowerCase().includes(searchLower) ||
      artisan.professions?.some(prof => prof.toLowerCase().includes(searchLower)) ||
      artisan.city?.toLowerCase().includes(searchLower)
    );
  }, [artisans, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Artisans pour la page actuelle
  const paginatedArtisans = filteredArtisans.slice(startIndex, endIndex);
  
  // Insérer la carte promotionnelle dans les artisans paginés
  const artisansWithPromo = useMemo(() => {
    console.log('Debug promo - searchTerm:', searchTerm, 'user:', !!user, 'isArtisan:', isArtisan, 'paginatedArtisans:', paginatedArtisans.length);
    
    // Vérifier si c'est une vraie recherche manuelle (pas géographique)
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const hasManualSearch = urlParams.get('projet') && searchTerm.includes(urlParams.get('projet') || '');
    
    if (hasManualSearch || (user && isArtisan)) {
      console.log('Pas de promo - recherche manuelle ou artisan connecté');
      return paginatedArtisans; // Pas de promo si recherche manuelle ou si artisan connecté
    }
    
    const result = [...paginatedArtisans];
    
    // Insérer la carte promo en position 3 (index 2) minimum
    const promoPosition = Math.min(2, result.length);
    result.splice(promoPosition, 0, { isPromo: true } as any);
    
    console.log('Promo ajoutée en position:', promoPosition, 'total items:', result.length);
    return result;
  }, [paginatedArtisans, searchTerm, user, isArtisan]);

  // Reset page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher par nom, téléphone, ville ou métier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-orange-500 rounded-lg"
              />
            </div>
          </div>

          {/* Résultats */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <span className="ml-2 text-gray-600">Chargement des artisans...</span>
            </div>
          ) : (
            <>
              {/* Nombre de résultats */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {filteredArtisans.length} artisan{filteredArtisans.length > 1 ? 's' : ''} trouvé{filteredArtisans.length > 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                  {totalPages > 1 && ` - Page ${currentPage} sur ${totalPages}`}
                </p>
              </div>

              {/* Grille des artisans avec carte promotionnelle intégrée */}
              {artisansWithPromo.length > 0 ? (
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
                        key={artisan.id} 
                        href={`/artisans/${artisan.slug || artisan.id}`}
                        className="group"
                      >
                        <div className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group rounded-lg bg-white border border-gray-200">
                          {/* Image de couverture */}
                          <div className="relative h-48 bg-gray-200">
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

                          <div className="p-4">
                            
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

                            {/* Note et avis */}
                            {(artisan.reviewCount > 0 || artisan.averageRating > 0) && (
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <div className="mr-2">
                                  {renderStars(artisan.averageRating || 0)}
                                </div>
                                <span className="font-medium">{(artisan.averageRating || 0).toFixed(1)}</span>
                                <span className="ml-1">({artisan.reviewCount || 0} avis)</span>
                              </div>
                            )}

                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun artisan trouvé</p>
                  {searchTerm && (
                    <p className="text-gray-400 text-sm mt-2">
                      Essayez de modifier votre recherche ou de supprimer certains filtres
                    </p>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
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
                            onClick={() => setCurrentPage(page)}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
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
