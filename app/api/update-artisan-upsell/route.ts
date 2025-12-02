import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { prospectId, sitePricePaid, hasPremiumSite, paymentData } = await request.json();

    if (!prospectId) {
      return NextResponse.json({ error: 'ID prospect manquant' }, { status: 400 });
    }

    // Référence du document artisan
    const artisanRef = doc(db, 'artisans', prospectId);

    // Données à mettre à jour selon le schéma Firestore
    const updateData = {
      // Upsell site premium
      hasPremiumSite: hasPremiumSite || true,
      sitePricePaid: sitePricePaid || 69,
      
      // Informations de paiement (optionnel, pour audit)
      lastPaymentDate: serverTimestamp(),
      lastPaymentAmount: sitePricePaid,
      
      // Mise à jour timestamp
      updatedAt: serverTimestamp(),
      
      // Statut pour suivi
      upsellCompleted: true,
      upsellCompletedAt: serverTimestamp()
    };

    // Mettre à jour le document
    await updateDoc(artisanRef, updateData);

    console.log(`Artisan ${prospectId} mis à jour avec upsell site premium`);

    return NextResponse.json({ 
      success: true, 
      message: 'Artisan mis à jour avec succès',
      data: {
        prospectId,
        sitePricePaid,
        hasPremiumSite
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'artisan:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'artisan' },
      { status: 500 }
    );
  }
}
