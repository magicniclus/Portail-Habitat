"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [projet, setProjet] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    coordinates: [number, number];
  } | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour rechercher des suggestions avec Mapbox
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Vérifier que la clé API est disponible
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    console.log('Mapbox token présent:', !!mapboxToken);
    
    if (!mapboxToken) {
      console.error('Clé API Mapbox manquante - Ajoutez NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN dans votre fichier .env.local');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${mapboxToken}&` +
        `country=FR&` +
        `types=place,locality,postcode&` +
        `limit=5`;
      
      console.log('URL de recherche Mapbox:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Erreur API Mapbox: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.error('Détails de l\'erreur:', errorText);
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      const data = await response.json();
      console.log('Réponse complète Mapbox:', data);
      console.log('Suggestions reçues:', data.features);
      
      if (data.features && data.features.length > 0) {
        setSuggestions(data.features);
        setShowSuggestions(true);
      } else {
        console.log('Aucune suggestion trouvée pour:', query);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de localisation:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Debounce pour la recherche
  useEffect(() => {
    if (localisation.length >= 3 && !isLocationSelected) {
      const timeoutId = setTimeout(() => {
        console.log('Recherche API pour:', localisation);
        searchLocations(localisation);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else if (localisation.length < 3 && !isLocationSelected) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [localisation, isLocationSelected]);

  // Gérer le changement de saisie
  const handleLocationChange = (value: string) => {
    console.log('Changement de saisie:', value);
    setLocalisation(value);
    setIsLocationSelected(false); // Reset la sélection quand on tape
    console.log('isLocationSelected reset à false');
  };

  // Sélectionner une suggestion
  const selectLocation = (feature: any) => {
    const locationName = feature.place_name;
    const coordinates = feature.center;
    
    console.log('Sélection de:', locationName, coordinates);
    
    // Marquer comme sélectionné AVANT de changer la localisation
    setIsLocationSelected(true);
    setSelectedLocation({
      name: locationName,
      coordinates: coordinates
    });
    setLocalisation(locationName);
    setSuggestions([]);
    setShowSuggestions(false);
    
    console.log('État après sélection - isLocationSelected:', true);
  };

  const handleSearch = () => {
    // Vérifier qu'une localisation a été sélectionnée
    if (!isLocationSelected || !selectedLocation) {
      alert('Veuillez sélectionner une localisation dans la liste des suggestions.');
      return;
    }
    
    // Construire l'URL avec les paramètres de recherche
    const params = new URLSearchParams();
    
    if (projet.trim()) {
      params.set('projet', projet.trim());
    }
    params.set('localisation', localisation.trim());
    
    // Ajouter les coordonnées si disponibles
    if (selectedLocation?.coordinates) {
      params.set('lat', selectedLocation.coordinates[1].toString());
      params.set('lng', selectedLocation.coordinates[0].toString());
    }
    
    // Rediriger vers la page artisans avec les filtres
    router.push(`/artisans?${params.toString()}`);
  };

  return (
    <section className="w-screen min-h-[60vh] md:min-h-[80vh] flex flex-col lg:flex-row">
      {/* Section Particuliers - 64% sur desktop, 100% sur mobile */}
      <div 
        className="flex-1 relative py-24"
        style={{ flex: "0 0 64%" }}
      >
        {/* Vidéo en arrière-plan */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/video.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center lg:text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6">
                Trouvez le bon artisan pour vos travaux
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-8">
                Que cherchez-vous ? Quel projet souhaitez-vous réaliser ?
              </p>
              
              {/* Formulaire de recherche */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Décrivez votre projet
                  </label>
                  <Input
                    placeholder="Ex: pose de carrelage, rénovation salle de bain, extension..."
                    value={projet}
                    onChange={(e) => setProjet(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Localisation
                  </label>
                  <Input
                    ref={inputRef}
                    placeholder="Ville ou code postal"
                    value={localisation}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full"
                    autoComplete="off"
                  />
                  
                  {/* Suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            console.log('Clic sur suggestion:', suggestion.place_name);
                            selectLocation(suggestion);
                          }}
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{suggestion.place_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleSearch}
                  disabled={!isLocationSelected}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg py-3"
                  size="lg"
                  onMouseEnter={() => console.log('État bouton - isLocationSelected:', isLocationSelected, 'selectedLocation:', selectedLocation)}
                >
                  <Search className="mr-2 h-5 w-5" />
                  <span className="lg:hidden">Rechercher</span>
                  <span className="hidden lg:inline">Chercher parmi plus de 3 000 artisans</span>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm">+3 000 artisans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">✓ Vérifiés et qualifiés</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">✓ Devis gratuits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Artisans - 36% sur desktop, auto sur mobile */}
      <div 
        className="bg-gray-800 text-white flex items-center justify-center min-h-[40vh] lg:min-h-auto"
        style={{ flex: "0 0 36%" }}
      >
        <div className="p-6 sm:p-8 text-center max-w-sm mx-auto">
          <div className="mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Vous êtes un artisan ?
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Rejoignez notre réseau de professionnels qualifiés et développez votre activité
            </p>
          </div>
          
          <div className="space-y-3 mb-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-orange-400">✓</span>
              <span>Leads qualifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">✓</span>
              <span>Gestion simplifiée</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">✓</span>
              <span>Visibilité accrue</span>
            </div>
          </div>
          
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
            <Link href="/devenir-pro">
              Devenir partenaire
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
