import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { artisanId, email, companyName } = await request.json();

    if (!artisanId || !email) {
      return NextResponse.json(
        { error: "artisanId et email requis" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe non configuré" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Créer ou récupérer un product/price Stripe pour l'abonnement Premium 49€/mois
    const products = await stripe.products.list({ limit: 100 });
    let product = products.data.find(
      (p) => p.name === "Portail Habitat Premium" && p.active
    );

    if (!product) {
      product = await stripe.products.create({
        name: "Portail Habitat Premium",
        description: "Abonnement Premium pour artisans — 7 jours d'essai gratuit",
        metadata: { type: "premium_subscription" },
      });
    }

    const prices = await stripe.prices.list({
      product: product.id,
      currency: "eur",
      type: "recurring",
      limit: 100,
    });

    let price = prices.data.find(
      (p) =>
        p.unit_amount === 4900 &&
        p.recurring?.interval === "month" &&
        p.active
    );

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        currency: "eur",
        unit_amount: 4900,
        recurring: { interval: "month" },
        nickname: "Premium 49€/mois",
      });
    }

    // Créer la session Stripe Checkout avec 7 jours d'essai gratuit
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          artisanId,
        },
      },
      metadata: {
        artisanId,
      },
      success_url: `${baseUrl}/dashboard/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/fiche`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur create-checkout-session:", message);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement", details: message },
      { status: 500 }
    );
  }
}
