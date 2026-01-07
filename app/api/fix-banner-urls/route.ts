import { NextRequest, NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

export async function POST(request: NextRequest) {
  try {
    const { artisanId } = await request.json();

    if (!artisanId) {
      return NextResponse.json(
        { error: 'artisanId requis' },
        { status: 400 }
      );
    }

    console.log(`🔍 Vérification des bannières pour: ${artisanId}`);

    // Récupérer les données Firestore
    const artisanRef = doc(db, 'artisans', artisanId);
    const artisanDoc = await getDoc(artisanRef);

    if (!artisanDoc.exists()) {
      return NextResponse.json(
        { error: 'Artisan non trouvé' },
        { status: 404 }
      );
    }

    const data = artisanDoc.data();
    console.log('✅ Artisan trouvé:', data.companyName);

    // Lister les fichiers dans Storage
    const bannerPhotosRef = ref(storage, `artisans/${artisanId}/premium/banner_photos/`);
    
    let files;
    try {
      const listResult = await listAll(bannerPhotosRef);
      files = listResult.items;
    } catch (error) {
      console.error('Erreur listAll:', error);
      return NextResponse.json(
        { error: 'Impossible de lister les fichiers Storage' },
        { status: 500 }
      );
    }

    console.log(`📁 Fichiers trouvés: ${files.length}`);

    // Trier les fichiers par nom
    const sortedFiles = files
      .filter(file => file.name.endsWith('.jpg'))
      .sort((a, b) => a.name.localeCompare(b.name));

    const bannerUrls: string[] = [];

    // Générer les URLs
    for (const file of sortedFiles) {
      try {
        const url = await getDownloadURL(file);
        bannerUrls.push(url);
        console.log(`✅ URL générée pour ${file.name}`);
      } catch (error) {
        console.error(`❌ Erreur pour ${file.name}:`, error);
      }
    }

    if (bannerUrls.length === 0) {
      return NextResponse.json(
        { error: 'Aucune URL générée', currentUrls: data.premiumFeatures?.bannerPhotos || [] },
        { status: 400 }
      );
    }

    // Mettre à jour Firestore
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerPhotos': bannerUrls,
      updatedAt: new Date()
    });

    console.log('✅ URLs sauvegardées!');

    return NextResponse.json({
      success: true,
      message: `${bannerUrls.length} URL(s) régénérée(s)`,
      urls: bannerUrls,
      previousUrls: data.premiumFeatures?.bannerPhotos || []
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
