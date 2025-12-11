"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Clock, 
  Euro, 
  ShoppingCart,
  Home,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { 
  getMarketplaceLeads,
  formatPrestationLevel,
  formatTimeline,
  getTimelineColor,
  formatPrice,
  type MarketplaceLead
} from "@/lib/marketplace-data";
import { 
  filterProjectsByDistance, 
  getCoordinatesFromLocation,
  type Coordinates 
} from "@/lib/geo-utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface MarketplaceBoardProps {
  artisanProfessions?: string[];
  artisanId?: string;
  showAllLeads?: boolean;
  artisanCoordinates?: Coordinates;
  artisanCity?: string;
}

export default function MarketplaceBoard({
  artisanProfessions = [],
  artisanId,
  showAllLeads = false,
  artisanCoordinates,
  artisanCity
}: MarketplaceBoardProps) {
  console.log(`🏗️ MarketplaceBoard initialisé avec:`, {
    artisanProfessions,
    artisanId,
    showAllLeads,
    artisanCoordinates,
    artisanCity
  });

  const [leads, setLeads] = useState<MarketplaceLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<(MarketplaceLead & { distance?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fonction pour vérifier si les coordonnées sont valides
  const areCoordinatesValid = (coords?: Coordinates) => {
    return coords && coords.lat !== 0 && coords.lng !== 0 && coords.lat && coords.lng;
  };

  // États pour le filtrage géographique
  const [searchRadius, setSearchRadius] = useState<number>(120); // 120km par défaut
  const [customLocation, setCustomLocation] = useState<string>("");
  const [searchCoordinates, setSearchCoordinates] = useState<Coordinates | null>(
    null // Commencer sans filtrage géographique
  );
  const [currentLocationName, setCurrentLocationName] = useState<string>(
    artisanCity || "Bordeaux"
  );
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{city: string; fullAddress: string; coordinates: Coordinates}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Si showAllLeads est true, on passe un tableau vide pour récupérer toutes les demandes
      const professionsFilter = showAllLeads ? [] : artisanProfessions;
      console.log(`🔍 Chargement des leads avec professions:`, professionsFilter, `showAllLeads:`, showAllLeads);
      
      const marketplaceLeads = await getMarketplaceLeads(professionsFilter, 50, artisanId); // Augmenter la limite pour avoir plus de choix avant filtrage
      console.log(`📦 Leads récupérés:`, marketplaceLeads.length, marketplaceLeads);
      
      setLeads(marketplaceLeads);
      
      // Appliquer le filtrage géographique
      applyGeographicFilter(marketplaceLeads);
    } catch (err) {
      console.error("Erreur lors du chargement des leads:", err);
      setError("Impossible de charger les demandes");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour appliquer le filtrage géographique
  const applyGeographicFilter = (leadsToFilter: MarketplaceLead[]) => {
    console.log(`🗺️ ApplyGeographicFilter appelé avec:`, {
      leadsCount: leadsToFilter.length,
      searchCoordinates,
      searchRadius,
      artisanCoordinates,
      artisanCity
    });

    if (!searchCoordinates) {
      // Pas de filtrage géographique - afficher tous les projets (même sans coordonnées)
      console.log(`🗺️ Aucun filtrage géographique - affichage de tous les ${leadsToFilter.length} projets`);
      setFilteredLeads(leadsToFilter.map(lead => ({ ...lead, distance: undefined })));
      return;
    }

    // Filtrage géographique actif - séparer les projets avec et sans coordonnées
    const projectsWithCoords = leadsToFilter.filter(lead => 
      lead.location?.coordinates?.lat && lead.location?.coordinates?.lng
    );
    const projectsWithoutCoords = leadsToFilter.filter(lead => 
      !lead.location?.coordinates?.lat || !lead.location?.coordinates?.lng
    );

    // Filtrer les projets avec coordonnées par distance
    const filteredWithCoords = filterProjectsByDistance(
      projectsWithCoords,
      searchCoordinates,
      searchRadius
    );

    // Combiner les résultats : projets filtrés + projets sans coordonnées
    const allFiltered = [
      ...filteredWithCoords,
      ...projectsWithoutCoords.map(lead => ({ ...lead, distance: undefined }))
    ];

    console.log(`🗺️ Filtrage géographique: ${filteredWithCoords.length} projets avec coordonnées dans ${searchRadius}km + ${projectsWithoutCoords.length} projets sans coordonnées = ${allFiltered.length}/${leadsToFilter.length} total`);
    setFilteredLeads(allFiltered);
  };

  useEffect(() => {
    loadLeads();
  }, [artisanProfessions]);

  // Réappliquer le filtrage quand le rayon ou les coordonnées changent
  useEffect(() => {
    applyGeographicFilter(leads);
  }, [searchRadius, searchCoordinates, leads]);

  // Fonction pour rechercher des suggestions en temps réel
  const searchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFnaWNuaWNsdXMiLCJhIjoiY2x6cWJhZGFvMGNxMjJqcGU4cGZqZGNsZCJ9.VYLgXgPKELUYXwJJgNKGFQ';
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=FR&limit=5&access_token=${mapboxToken}`
      );

      if (response.ok) {
        const data = await response.json();
        const newSuggestions = data.features.map((feature: any) => ({
          city: feature.text || feature.place_name.split(',')[0],
          fullAddress: feature.place_name,
          coordinates: {
            lat: feature.center[1],
            lng: feature.center[0]
          }
        }));
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de suggestions:", error);
    }
  };

  // Debounce pour les suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customLocation.trim()) {
        searchSuggestions(customLocation);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customLocation]);

  // Fonction pour rechercher une localisation personnalisée
  const handleCustomLocationSearch = async () => {
    if (!customLocation.trim()) return;

    setIsSearchingLocation(true);
    try {
      const result = await getCoordinatesFromLocation(customLocation);
      if (result) {
        setSearchCoordinates(result.coordinates);
        setCurrentLocationName(result.city);
        console.log(`📍 Nouvelle zone de recherche: ${result.city} (${result.coordinates.lat}, ${result.coordinates.lng})`);
        setCustomLocation(""); // Vider le champ après recherche réussie
      } else {
        console.error("Localisation non trouvée:", customLocation);
        // TODO: Afficher un message d'erreur à l'utilisateur
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de localisation:", error);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Fonction pour revenir à la localisation de l'artisan ou Bordeaux
  const resetToArtisanLocation = () => {
    if (areCoordinatesValid(artisanCoordinates)) {
      setSearchCoordinates(artisanCoordinates!);
      setCurrentLocationName(artisanCity || "Localisation artisan");
      console.log(`📍 Retour à la localisation de l'artisan: ${artisanCity}`);
    } else {
      setSearchCoordinates({ lat: 44.8378, lng: -0.5792 }); // Bordeaux par défaut
      setCurrentLocationName("Bordeaux");
      console.log(`📍 Retour à Bordeaux (coordonnées artisan invalides: ${JSON.stringify(artisanCoordinates)})`);
    }
    setCustomLocation("");
  };

  // Fonction pour sélectionner une suggestion
  const selectSuggestion = (suggestion: {city: string; fullAddress: string; coordinates: Coordinates}) => {
    setSearchCoordinates(suggestion.coordinates);
    setCurrentLocationName(suggestion.city);
    setCustomLocation("");
    setShowSuggestions(false);
    console.log(`📍 Suggestion sélectionnée: ${suggestion.city}`);
  };

  // Fonction pour supprimer le filtre de localisation (afficher tout)
  const removeLocationFilter = () => {
    setSearchCoordinates(null);
    setCurrentLocationName("Toutes les zones");
    setCustomLocation("");
    setShowSuggestions(false);
    console.log(`🗺️ Filtre de localisation supprimé - affichage de tous les projets`);
  };

  // Fonction pour supprimer le filtre de rayon (remettre par défaut)
  const removeRadiusFilter = () => {
    setSearchRadius(120); // Retour au rayon par défaut
    console.log(`🔵 Filtre de rayon supprimé - retour à 120km par défaut`);
  };


  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };


  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadLeads} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bourse au chantier</h2>
          <p className="text-gray-600">
            {leads.length} demande{leads.length > 1 ? 's' : ''} disponible{leads.length > 1 ? 's' : ''}
            {showAllLeads ? (
              <span className="ml-2 text-sm">
                • Toutes les demandes publiées
              </span>
            ) : artisanProfessions.length > 0 && (
              <span className="ml-2 text-sm">
                • Filtrées pour : {artisanProfessions.join(', ')}
              </span>
            )}
          </p>
        </div>
        <Button onClick={loadLeads} variant="outline" disabled={isLoading}>
          {isLoading ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      {/* Filtres géographiques simplifiés */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            {/* Recherche de localisation */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Localisation
              </label>
              <div className="relative">
                <Input
                  placeholder="Code postal ou ville (ex: 33000, Bordeaux)"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomLocationSearch()}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pr-10"
                />
                <Button 
                  onClick={handleCustomLocationSearch}
                  disabled={isSearchingLocation || !customLocation.trim()}
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                >
                  {isSearchingLocation ? "..." : "🔍"}
                </Button>
                
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-sm">{suggestion.city}</div>
                            <div className="text-xs text-gray-500">{suggestion.fullAddress}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sélecteur de rayon */}
            <div className="w-full md:w-40 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Rayon
              </label>
              <Select value={searchRadius.toString()} onValueChange={(value) => setSearchRadius(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 km</SelectItem>
                  <SelectItem value="100">100 km</SelectItem>
                  <SelectItem value="120">120 km</SelectItem>
                  <SelectItem value="150">150 km</SelectItem>
                  <SelectItem value="200">200 km</SelectItem>
                  <SelectItem value="300">300 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Badges des filtres actifs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {searchCoordinates && (
              <>
                <Badge variant="secondary" className="flex items-center gap-1 group">
                  <MapPin className="h-3 w-3" />
                  {currentLocationName}
                  <button
                    onClick={removeLocationFilter}
                    className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full p-0.5 transition-opacity"
                    title="Supprimer le filtre de localisation"
                  >
                    ✕
                  </button>
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 group">
                  {searchRadius}km de rayon
                  <button
                    onClick={removeRadiusFilter}
                    className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full p-0.5 transition-opacity"
                    title="Supprimer le filtre de rayon"
                  >
                    ✕
                  </button>
                </Badge>
              </>
            )}
            <Badge variant="outline">
              {filteredLeads.length} projet{filteredLeads.length > 1 ? 's' : ''} trouvé{filteredLeads.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredLeads.length === 0 && leads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune demande disponible
            </h3>
            <p className="text-gray-500 mb-6">
              {artisanProfessions.length > 0 
                ? "Aucune demande ne correspond à vos spécialités pour le moment."
                : "Aucune demande n'est actuellement publiée sur la bourse au chantier."
              }
            </p>
            <Button onClick={loadLeads} variant="outline">
              Actualiser
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty state après filtrage géographique */}
      {!isLoading && leads.length > 0 && filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun projet dans cette zone
            </h3>
            <p className="text-gray-500 mb-6">
              Aucun projet n'est disponible dans un rayon de {searchRadius}km de votre zone de recherche.
              Essayez d'augmenter le rayon ou de changer de zone.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setSearchRadius(200)} variant="outline">
                Étendre à 200km
              </Button>
              {searchCoordinates !== artisanCoordinates && (
                <Button onClick={resetToArtisanLocation} variant="outline">
                  Retour à ma zone
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads grid */}
      {!isLoading && filteredLeads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => {
            return (
              <Card key={lead.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {lead.projectType}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{lead.city}</span>
                        {lead.department && (
                          <span className="text-gray-400">({lead.department})</span>
                        )}
                        {lead.distance && (
                          <span className="text-blue-600 font-medium">• {lead.distance}km</span>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getTimelineColor(lead.timeline)} text-xs`}>
                      {formatTimeline(lead.timeline)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Détails du projet */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {lead.propertyType}
                        {lead.surface && ` • ${lead.surface}m²`}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Niveau : {formatPrestationLevel(lead.prestationLevel)}
                      </span>
                    </div>
                  </div>

                  {/* Estimation de prix */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Estimation du projet</div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(lead.estimationLow)} - {formatPrice(lead.estimationHigh)}
                      </span>
                      <Badge className={`${getConfidenceColor(lead.confidenceScore)} text-xs`}>
                        {lead.confidenceScore}% fiable
                      </Badge>
                    </div>
                  </div>

                  {/* Prix du lead et disponibilité */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatPrice(lead.marketplacePrice)}
                      </span>
                    </div>
                    
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Intl.RelativeTimeFormat('fr').format(
                            Math.floor((lead.publishedAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                            'day'
                          )}
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      asChild
                    >
                      <Link href={`/dashboard/marketplace/purchase/${lead.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Répondre
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info footer */}
      {!isLoading && leads.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Comment ça marche ?</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Cliquez sur "Répondre" pour voir plus de détails et acheter le contact</li>
                  <li>• Une fois acheté, vous recevrez les coordonnées complètes du client</li>
                  <li>• Chaque demande est limitée à {leads[0]?.maxSales || 3} artisans maximum</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
