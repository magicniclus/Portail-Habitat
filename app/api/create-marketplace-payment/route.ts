import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { leadId, artisanId, artisanName, artisanEmail } = await request.json();

    if (!leadId || !artisanId || !artisanName || !artisanEmail) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // Récupérer les détails du lead
    const leadDoc = await getDoc(doc(db, "estimations", leadId));
    
    if (!leadDoc.exists()) {
      return NextResponse.json(
        { error: "Demande introuvable" },
        { status: 404 }
      );
    }

    const leadData = leadDoc.data();

    // Vérifier que le lead est disponible
    if (!leadData.isPublished || leadData.marketplaceStatus !== 'active') {
      return NextResponse.json(
        { error: "Cette demande n'est plus disponible" },
        { status: 400 }
      );
    }

    // Vérifier que la limite n'est pas atteinte
    if (leadData.marketplaceSales >= leadData.maxSales) {
      return NextResponse.json(
        { error: "Limite de ventes atteinte pour cette demande" },
        { status: 400 }
      );
    }

    // Vérifier que l'artisan n'a pas déjà acheté ce lead
    const alreadyPurchased = leadData.marketplacePurchases?.some(
      (purchase: any) => purchase.artisanId === artisanId
    );

    if (alreadyPurchased) {
      return NextResponse.json(
        { error: "Vous avez déjà acheté cette demande" },
        { status: 400 }
      );
    }

    const amount = leadData.marketplacePrice || 35;
    const projectType = leadData.project?.prestationType || 'Projet';
    const city = leadData.location?.city || 'Ville non renseignée';

    // Créer l'intention de paiement Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe utilise les centimes
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        type: "marketplace_lead",
        leadId,
        artisanId,
        artisanName,
        artisanEmail,
        projectType,
        city,
      },
      description: `Achat lead: ${projectType} à ${city}`,
      receipt_email: artisanEmail,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      projectType,
      city,
    });

  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
