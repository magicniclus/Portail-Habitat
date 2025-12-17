import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// Interface pour les coordonnées
interface Coordinates {
  lat: number;
  lng: number;
}

// Interface pour les données artisan
interface ArtisanData {
  id: string;
  city: string;
  postalCode: string;
  coordinates?: Coordinates;
}

// Fonction pour géocoder une adresse avec Mapbox
async function geocodeWithMapbox(city: string, postalCode: string): Promise<Coordinates | null> {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!mapboxToken) {
    console.error('Token Mapbox manquant');
    return null;
  }

  // Construire la requête de géocodage
  const query = `${postalCode} ${city}, France`;
  const encodedQuery = encodeURIComponent(query);
  
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${mapboxToken}&country=FR&types=postcode,place`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
    
    console.warn(`Aucun résultat trouvé pour: ${query}`);
    return null;
  } catch (error) {
    console.error(`Erreur géocodage pour ${query}:`, error);
    return null;
  }
}

// Fonction pour mettre à jour les coordonnées d'un artisan
async function updateArtisanCoordinates(artisanId: string, coordinates: Coordinates): Promise<boolean> {
  try {
    await db.collection('artisans').doc(artisanId).update({
      coordinates: coordinates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error(`Erreur mise à jour artisan ${artisanId}:`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dryRun = true, limit = 10 } = body;

    console.log(`🚀 Début du script de mise à jour des coordonnées (dryRun: ${dryRun}, limit: ${limit})`);

    // Récupérer tous les artisans avec coordonnées 0,0 ou manquantes
    const artisansSnapshot = await db.collection('artisans').get();
    
    const artisansToUpdate: ArtisanData[] = [];
    
    artisansSnapshot.forEach((doc) => {
      const data = doc.data();
      const coordinates = data.coordinates;
      
      // Vérifier si les coordonnées sont manquantes ou à 0,0
      const needsUpdate = !coordinates || 
                         coordinates.lat === 0 || 
                         coordinates.lng === 0 ||
                         !coordinates.lat ||
                         !coordinates.lng;
      
      if (needsUpdate && data.city && data.postalCode) {
        artisansToUpdate.push({
          id: doc.id,
          city: data.city,
          postalCode: data.postalCode,
          coordinates: coordinates
        });
      }
    });

    console.log(`📊 ${artisansToUpdate.length} artisans trouvés avec coordonnées manquantes/invalides`);

    // Limiter le nombre d'artisans à traiter
    const artisansToProcess = artisansToUpdate.slice(0, limit);
    
    const results = {
      total: artisansToUpdate.length,
      processed: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Traiter chaque artisan
    for (const artisan of artisansToProcess) {
      results.processed++;
      
      console.log(`🔍 Traitement ${artisan.id}: ${artisan.city} (${artisan.postalCode})`);
      
      // Géocoder l'adresse
      const coordinates = await geocodeWithMapbox(artisan.city, artisan.postalCode);
      
      if (coordinates) {
        console.log(`✅ Coordonnées trouvées: ${coordinates.lat}, ${coordinates.lng}`);
        
        if (!dryRun) {
          // Mettre à jour en base
          const success = await updateArtisanCoordinates(artisan.id, coordinates);
          if (success) {
            results.updated++;
            console.log(`💾 Artisan ${artisan.id} mis à jour`);
          } else {
            results.failed++;
            results.errors.push(`Échec mise à jour ${artisan.id}`);
          }
        } else {
          results.updated++;
          console.log(`🔍 [DRY RUN] Artisan ${artisan.id} serait mis à jour`);
        }
      } else {
        results.failed++;
        results.errors.push(`Géocodage échoué pour ${artisan.id}: ${artisan.city} (${artisan.postalCode})`);
        console.log(`❌ Échec géocodage pour ${artisan.id}`);
      }
      
      // Pause pour éviter de surcharger l'API Mapbox
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`🏁 Script terminé:`);
    console.log(`   - Total artisans à traiter: ${results.total}`);
    console.log(`   - Artisans traités: ${results.processed}`);
    console.log(`   - Succès: ${results.updated}`);
    console.log(`   - Échecs: ${results.failed}`);

    return NextResponse.json({
      success: true,
      message: `Script ${dryRun ? '(DRY RUN) ' : ''}terminé avec succès`,
      results: results
    });

  } catch (error) {
    console.error('Erreur dans le script de mise à jour:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
