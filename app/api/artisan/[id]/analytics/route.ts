import { NextRequest, NextResponse } from 'next/server';
import { getArtisanAnalytics, initializeArtisanAnalytics } from '@/lib/artisan-analytics';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: artisanId } = params;

    if (!artisanId) {
      return NextResponse.json(
        { error: 'ID artisan manquant' },
        { status: 400 }
      );
    }

    // Initialiser les analytics si elles n'existent pas
    await initializeArtisanAnalytics(artisanId);

    // Récupérer les analytics de l'artisan
    const analytics = await getArtisanAnalytics(artisanId);

    // Si pas d'analytics, retourner des valeurs par défaut au lieu d'une erreur
    const defaultAnalytics = {
      totalViews: 0,
      totalPhoneClicks: 0,
      totalFormSubmissions: 0,
      viewsThisMonth: 0,
      phoneClicksThisMonth: 0,
      formSubmissionsThisMonth: 0,
      lastViewedAt: null,
      updatedAt: null
    };

    return NextResponse.json({
      success: true,
      data: analytics || defaultAnalytics
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des analytics:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
