import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { recordLeadPurchase } from "@/lib/marketplace-data";
import { recordMarketplaceSale } from "@/lib/stats-utils";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "ID de paiement manquant" },
        { status: 400 }
      );
    }

    // Récupérer les détails du paiement depuis Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Le paiement n'a pas été confirmé" },
        { status: 400 }
      );
    }

    const metadata = paymentIntent.metadata;
    
    if (metadata.type !== "marketplace_lead") {
      return NextResponse.json(
        { error: "Type de paiement invalide" },
        { status: 400 }
      );
    }

    const {
      leadId,
      artisanId,
      artisanName,
    } = metadata;

    const amount = paymentIntent.amount / 100; // Convertir de centimes en euros

    try {
      // Récupérer les détails du lead pour l'ajouter à l'artisan
      const leadDoc = await getDoc(doc(db, "estimations", leadId));
      
      if (!leadDoc.exists()) {
        throw new Error("Lead introuvable");
      }

      const leadData = leadDoc.data();

      // Enregistrer l'achat du lead dans la marketplace
      await recordLeadPurchase(
        leadId,
        artisanId,
        artisanName,
        paymentIntentId,
        amount
      );

      // Ajouter le lead à la collection de l'artisan
      const artisanLeadsRef = collection(db, "artisans", artisanId, "leads");
      await addDoc(artisanLeadsRef, {
        clientName: `${leadData.clientInfo?.firstName || ''} ${leadData.clientInfo?.lastName || ''}`.trim(),
        clientPhone: leadData.clientInfo?.phone || '',
        clientEmail: leadData.clientInfo?.email || '',
        projectType: leadData.project?.prestationType || 'Projet',
        city: leadData.location?.city || '',
        budget: leadData.project?.budget || 0,
        source: "bought",
        status: "new",
        marketplacePrice: amount,
        originalEstimationId: leadId,
        createdAt: serverTimestamp(),
        notes: ""
      });

      // Mettre à jour les statistiques marketplace
      await recordMarketplaceSale(amount);

      return NextResponse.json({
        success: true,
        message: "Achat confirmé avec succès",
        leadId,
        amount,
      });

    } catch (dbError) {
      console.error("Erreur lors de la mise à jour de la base de données:", dbError);
      
      // Le paiement a réussi mais la mise à jour DB a échoué
      // Il faudra traiter cela manuellement
      return NextResponse.json(
        { 
          error: "Paiement réussi mais erreur de traitement. Contactez le support.",
          paymentIntentId,
          needsManualProcessing: true
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Erreur lors de la confirmation du paiement:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la confirmation du paiement" },
      { status: 500 }
    );
  }
}
