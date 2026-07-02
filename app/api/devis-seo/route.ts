/**
 * API Route — Réception des demandes de devis depuis les pages SEO publiques
 * Enregistre la demande dans Firestore (collection "estimations") et envoie
 * un email de notification au team via SendGrid.
 */
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { firstName, phone, email, description, metierSlug, villeSlug } =
      await req.json();

    if (!firstName || !phone || !metierSlug) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const docRef = await adminDb.collection("estimations").add({
      source: "seo_page",
      firstName,
      phone,
      email: email ?? "",
      description: description ?? "",
      metierSlug,
      villeSlug: villeSlug ?? null,
      createdAt: new Date().toISOString(),
      status: "new",
    });

    // Notification email
    const fromEmail = process.env.SENDGRID_FROM_EMAIL ?? "service@trouver-mon-chantier.fr";
    await sgMail.send({
      to: fromEmail,
      from: fromEmail,
      subject: `[SEO] Nouvelle demande de devis — ${metierSlug}${villeSlug ? ` à ${villeSlug}` : ""}`,
      html: `
        <h2>Nouvelle demande de devis depuis une page SEO</h2>
        <p><b>Métier :</b> ${metierSlug}</p>
        ${villeSlug ? `<p><b>Ville :</b> ${villeSlug}</p>` : ""}
        <p><b>Prénom :</b> ${firstName}</p>
        <p><b>Téléphone :</b> ${phone}</p>
        ${email ? `<p><b>Email :</b> ${email}</p>` : ""}
        ${description ? `<p><b>Projet :</b> ${description}</p>` : ""}
        <p><small>ID estimation : ${docRef.id}</small></p>
      `,
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("[api/devis-seo]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
