import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { artisanId } = await request.json();

    if (!artisanId) {
      return NextResponse.json({ error: 'artisanId requis' }, { status: 400 });
    }

    const artisanRef = doc(db, 'artisans', artisanId);
    const artisanDoc = await getDoc(artisanRef);

    if (!artisanDoc.exists()) {
      return NextResponse.json({ error: 'Artisan non trouvé' }, { status: 404 });
    }

    const data = artisanDoc.data();
    const currentUrls = data.premiumFeatures?.bannerPhotos || [];

    // Nettoyer les URLs en supprimant tout ce qui suit ?t= ou &t=
    const cleanedUrls = currentUrls.map((url: string) => {
      // Supprimer ?t=... ou &t=...
      return url.replace(/[?&]t=\d+/g, '');
    });

    console.log('URLs avant:', currentUrls);
    console.log('URLs après:', cleanedUrls);

    // Forcer la mise à jour
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerPhotos': cleanedUrls,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'URLs nettoyées',
      before: currentUrls,
      after: cleanedUrls
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
