import { NextRequest, NextResponse } from 'next/server';
import { autoExpireTemporaryPremiums } from '@/lib/auto-expire-premium';

/**
 * API Route Next.js pour expirer manuellement les premiums temporaires
 * GET /api/expire-temporary-premiums
 */
export async function GET(request: NextRequest) {
  try {
    // Optionnel : Vérifier une clé API pour sécuriser l'endpoint
    const apiKey = request.nextUrl.searchParams.get('key');
    const expectedKey = process.env.ADMIN_API_KEY;
    
    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Clé API invalide' },
        { status: 401 }
      );
    }

    console.log('🔄 Expiration manuelle des premiums temporaires via API...');
    
    const result = await autoExpireTemporaryPremiums();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${result.expiredCount} premium(s) temporaire(s) expirés`,
        expiredCount: result.expiredCount,
        expiredArtisanIds: result.expiredArtisanIds
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur API expiration premiums:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de l\'expiration' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST pour expirer avec paramètres spécifiques
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, force = false } = body;

    // Ici vous pourriez ajouter des vérifications d'authentification admin
    if (!adminId) {
      return NextResponse.json(
        { error: 'ID admin requis' },
        { status: 400 }
      );
    }

    const result = await autoExpireTemporaryPremiums();
    
    // Log de l'action admin
    console.log(`🔧 Expiration manuelle déclenchée par admin ${adminId}:`, {
      expiredCount: result.expiredCount,
      force
    });

    return NextResponse.json({
      success: result.success,
      message: `Expiration déclenchée par admin ${adminId}`,
      expiredCount: result.expiredCount,
      expiredArtisanIds: result.expiredArtisanIds,
      error: result.error
    });

  } catch (error) {
    console.error('❌ Erreur POST expiration premiums:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur lors de l\'expiration' 
      },
      { status: 500 }
    );
  }
}
