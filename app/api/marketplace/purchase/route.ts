import { NextRequest, NextResponse } from 'next/server';
import { recordMarketplacePurchase, MarketplacePurchase } from '@/lib/marketplace-utils';

export async function POST(request: NextRequest) {
  try {
    const { estimationId, artisanId, artisanName, price, paymentId } = await request.json();

    // Validation des données requises
    if (!estimationId || !artisanId || !artisanName || !price) {
      return NextResponse.json(
        { error: 'Données manquantes (estimationId, artisanId, artisanName, price requis)' },
        { status: 400 }
      );
    }

    // Créer l'objet purchase
    const purchase: MarketplacePurchase = {
      artisanId,
      artisanName,
      purchasedAt: new Date(), // Sera remplacé par serverTimestamp dans la fonction
      price: Number(price),
      paymentId
    };

    // Enregistrer l'achat
    const result = await recordMarketplacePurchase(estimationId, purchase);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement de l\'achat' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Achat enregistré avec succès',
      data: {
        currentSales: result.currentSales,
        isCompleted: result.isCompleted,
        estimationId
      }
    });

  } catch (error) {
    console.error('Erreur API marketplace purchase:', error);
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      if (error.message.includes('déjà acheté')) {
        return NextResponse.json(
          { error: 'Cet artisan a déjà acheté ce lead' },
          { status: 409 }
        );
      }
      if (error.message.includes('limite')) {
        return NextResponse.json(
          { error: 'Limite de ventes déjà atteinte' },
          { status: 410 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// GET pour vérifier si un artisan peut acheter un lead
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estimationId = searchParams.get('estimationId');
    const artisanId = searchParams.get('artisanId');

    if (!estimationId || !artisanId) {
      return NextResponse.json(
        { error: 'estimationId et artisanId requis' },
        { status: 400 }
      );
    }

    // Ici vous pourriez ajouter la logique pour vérifier
    // si l'artisan peut acheter le lead (récupérer l'estimation, etc.)
    
    return NextResponse.json({
      canPurchase: true,
      message: 'Vérification OK'
    });

  } catch (error) {
    console.error('Erreur API marketplace check:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
