// Fonction pour calculer la distance entre deux points géographiques (formule de Haversine)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Arrondir à 1 décimale
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Fonction pour filtrer les artisans par distance
export function filterArtisansByDistance(
  artisans: any[],
  centerLat: number,
  centerLng: number,
  maxDistance: number = 100 // Distance max en km
): any[] {
  return artisans
    .map(artisan => {
      if (!artisan.coordinates?.lat || !artisan.coordinates?.lng) {
        return { ...artisan, distance: null };
      }
      
      const distance = calculateDistance(
        centerLat,
        centerLng,
        artisan.coordinates.lat,
        artisan.coordinates.lng
      );
      
      return { ...artisan, distance };
    })
    .filter(artisan => artisan.distance === null || artisan.distance <= maxDistance)
    .sort((a, b) => {
      // Trier par distance (les plus proches en premier)
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
}
