import { NextRequest, NextResponse } from 'next/server';
import { trackArtisanInteraction, InteractionType } from '@/lib/artisan-analytics';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: artisanId } = params;
    const body = await request.json();
    
    const { type, formData } = body;

    if (!artisanId) {
      return NextResponse.json(
        { error: 'ID artisan manquant' },
        { status: 400 }
      );
    }

    if (!type || !['view', 'phone_click', 'form_submission'].includes(type)) {
      return NextResponse.json(
        { error: 'Type d\'interaction invalide' },
        { status: 400 }
      );
    }

    // Valider les données du formulaire si c'est une soumission
    if (type === 'form_submission') {
      if (!formData || !formData.name || !formData.email || !formData.message) {
        return NextResponse.json(
          { error: 'Données du formulaire incomplètes' },
          { status: 400 }
        );
      }
    }

    // Tracker l'interaction
    await trackArtisanInteraction(artisanId, type as InteractionType, formData);

    return NextResponse.json({
      success: true,
      message: `Interaction ${type} trackée avec succès`
    });

  } catch (error) {
    console.error('Erreur lors du tracking de l\'interaction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
