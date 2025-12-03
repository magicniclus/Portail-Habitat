"use client";

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ZoneInterventionMapProps {
  zones: string[];
  centerCity?: string;
}

export default function ZoneInterventionMap({ zones, centerCity }: ZoneInterventionMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !zones.length) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    // Ajouter un cercle pour représenter la zone d'intervention
    const addZoneCircle = (center: [number, number]) => {
      if (!map.current) return;

      const radiusInMeters = 25000; // 25km de rayon approximatif
      const points: [number, number][] = [];
      const centerLat = center[1];
      const centerLng = center[0];
      
      const latRadians = centerLat * Math.PI / 180;
      const degreeLatitude = radiusInMeters / 110540;
      const degreeLongitude = radiusInMeters / (111320 * Math.cos(latRadians));
      
      for (let i = 0; i <= 360; i += 10) {
        const angle = i * Math.PI / 180;
        const dx = degreeLongitude * Math.cos(angle);
        const dy = degreeLatitude * Math.sin(angle);
        points.push([centerLng + dx, centerLat + dy]);
      }

      // Attendre que la carte soit chargée ou l'ajouter immédiatement si elle l'est déjà
      const addCircleToMap = () => {
        if (!map.current) return;

        // Vérifier si la source existe déjà et la supprimer si c'est le cas
        if (map.current.getSource('zone-circle')) {
          if (map.current.getLayer('zone-circle-border')) {
            map.current.removeLayer('zone-circle-border');
          }
          if (map.current.getLayer('zone-circle')) {
            map.current.removeLayer('zone-circle');
          }
          map.current.removeSource('zone-circle');
        }

        map.current.addSource('zone-circle', {
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
          id: 'zone-circle',
          type: 'fill',
          source: 'zone-circle',
          paint: {
            'fill-color': '#059669',
            'fill-opacity': 0.15
          }
        });

        map.current.addLayer({
          id: 'zone-circle-border',
          type: 'line',
          source: 'zone-circle',
          paint: {
            'line-color': '#059669',
            'line-width': 2,
            'line-opacity': 0.7
          }
        });
      };

      if (map.current.isStyleLoaded()) {
        addCircleToMap();
      } else {
        map.current.on('load', addCircleToMap);
      }
    };

    // Géocoder d'abord pour obtenir la position correcte
    const initializeMap = async () => {
      const cityToGeocode = centerCity || zones[0];
      let initialCenter: [number, number] = [2.3522, 48.8566]; // Paris par défaut
      let initialZoom = 8;

      if (cityToGeocode) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityToGeocode)}.json?access_token=${mapboxgl.accessToken}&country=FR&types=place,region&limit=1`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            initialCenter = data.features[0].center;
            initialZoom = 9;
          }
        } catch (error) {
          console.error('Erreur lors du géocodage:', error);
        }
      }

      // Initialiser la carte directement avec la bonne position
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: initialCenter,
        zoom: initialZoom,
        interactive: false,
        attributionControl: false
      });

      // Désactiver tous les contrôles
      map.current.scrollZoom.disable();
      map.current.boxZoom.disable();
      map.current.dragRotate.disable();
      map.current.dragPan.disable();
      map.current.keyboard.disable();
      map.current.doubleClickZoom.disable();
      map.current.touchZoomRotate.disable();

      // Ajouter le marqueur et le cercle si on a une position valide
      if (initialCenter[0] !== 2.3522 || initialCenter[1] !== 48.8566) {
        // Ajouter un marqueur discret
        new mapboxgl.Marker({ 
          color: '#059669',
          scale: 0.8
        })
          .setLngLat(initialCenter)
          .addTo(map.current);

        // Ajouter un cercle de zone approximatif
        addZoneCircle(initialCenter);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [zones, centerCity]);

  if (!zones.length) {
    return null;
  }

  return (
    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
