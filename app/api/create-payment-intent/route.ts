import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { amount, prospectData, type } = await request.json();

    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      confirm: true, // Confirmer automatiquement
      payment_method: 'pm_card_visa', // Méthode de test
      return_url: 'https://portail-habitat.fr/onboarding/success', // URL de retour
      metadata: {
        type,
        prospectId: prospectData.prospectId || '',
        artisanId: prospectData.artisanId || '', // Pour les upsells
        firstName: prospectData.firstName,
        lastName: prospectData.lastName,
        email: prospectData.email,
        phone: prospectData.phone || '',
        postalCode: prospectData.postalCode || '',
        profession: prospectData.profession,
        city: prospectData.selectedCity || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Erreur lors de la création du PaymentIntent:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
