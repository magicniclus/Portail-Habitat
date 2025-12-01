"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

interface MapboxMapProps {
  onLocationSelect: (location: string, coordinates?: [number, number]) => void;
  selectedCity: string;
  selectedRadius: number;
}

interface Suggestion {
  place_name: string;
  center: [number, number];
}

export default function MapboxMap({ onLocationSelect, selectedCity, selectedRadius }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const circle = useRef<any>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // Initialiser la carte
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [2.3522, 48.8566], // Paris par défaut
      zoom: 6
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Recherche de suggestions
  const searchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3 || isSelected) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=FR&types=place,region,district,postcode&limit=5`
      );
      const data = await response.json();
      
      if (data.features && !isSelected) {
        const newSuggestions = data.features.map((feature: any) => ({
          place_name: feature.place_name,
          center: feature.center
        }));
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      searchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sélectionner une suggestion
  const selectSuggestion = (suggestion: Suggestion, event?: React.MouseEvent) => {
    // Empêcher les événements multiples
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Fermer immédiatement et définitivement AVANT tout le reste
    setShowSuggestions(false);
    setSuggestions([]);
    setIsSelected(true);
    
    // Attendre un peu avant de faire le reste pour éviter les conflits
    setTimeout(() => {
      // Sélectionner
      setSearchQuery(suggestion.place_name);
      onLocationSelect(suggestion.place_name, suggestion.center);
      
      if (map.current) {
        // Centrer la carte avec un zoom moins fort
        map.current.flyTo({
          center: suggestion.center,
          zoom: 8 // Réduit de 10 à 8 pour moins zoomer
        });

        // Ajouter/mettre à jour le marqueur
        if (marker.current) {
          marker.current.remove();
        }
        marker.current = new mapboxgl.Marker({ color: '#16a34a' })
          .setLngLat(suggestion.center)
          .addTo(map.current);

        // Ajouter le cercle de rayon
        updateCircle(suggestion.center, selectedRadius);
      }
    }, 50); // Petit délai pour laisser le temps aux suggestions de se fermer
  };

  // Mettre à jour le cercle de rayon
  const updateCircle = (center: [number, number], radius: number) => {
    if (!map.current) return;

    // Supprimer l'ancien cercle
    if (circle.current) {
      // Supprimer les layers avant la source
      if (map.current.getLayer('radius-circle-border')) {
        map.current.removeLayer('radius-circle-border');
      }
      if (map.current.getLayer('radius-circle')) {
        map.current.removeLayer('radius-circle');
      }
      if (map.current.getSource('radius-circle')) {
        map.current.removeSource('radius-circle');
      }
    }

    // Créer un nouveau cercle
    const radiusInMeters = radius * 1000;
    
    // Calcul précis du cercle en tenant compte de la latitude
    const points = [];
    const centerLat = center[1];
    const centerLng = center[0];
    
    // Conversion plus précise en degrés
    const latRadians = centerLat * Math.PI / 180;
    const degreeLatitude = radiusInMeters / 110540; // 1 degré de latitude = ~110540 mètres
    const degreeLongitude = radiusInMeters / (111320 * Math.cos(latRadians)); // Ajusté selon la latitude
    
    for (let i = 0; i <= 360; i += 5) { // Plus de points pour un cercle plus lisse
      const angle = i * Math.PI / 180;
      const dx = degreeLongitude * Math.cos(angle);
      const dy = degreeLatitude * Math.sin(angle);
      points.push([centerLng + dx, centerLat + dy]);
    }

    map.current.addSource('radius-circle', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [points]
        }
      }
    });

    map.current.addLayer({
      id: 'radius-circle',
      type: 'fill',
      source: 'radius-circle',
      paint: {
        'fill-color': '#16a34a',
        'fill-opacity': 0.2
      }
    });

    map.current.addLayer({
      id: 'radius-circle-border',
      type: 'line',
      source: 'radius-circle',
      paint: {
        'line-color': '#16a34a',
        'line-width': 2
      }
    });

    circle.current = true;
  };

  // Mettre à jour le cercle quand le rayon change
  useEffect(() => {
    if (selectedCity && marker.current && map.current) {
      const center = marker.current.getLngLat();
      updateCircle([center.lng, center.lat], selectedRadius);
    }
  }, [selectedRadius, selectedCity]);

  return (
    <div className="relative h-full w-full">
      {/* Barre de recherche */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Ville, région, département ou code postal..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSelected(false); // Permettre les nouvelles suggestions si on retape
            }}
            className="pl-10 bg-white shadow-lg border-0"
          />
          
          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border max-h-60 overflow-y-auto z-20">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onMouseDown={(e) => selectSuggestion(suggestion, e)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-2 border-b last:border-b-0"
                >
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{suggestion.place_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Carte */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
