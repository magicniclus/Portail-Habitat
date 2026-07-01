import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';

// Configurer SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Configurer Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function createWelcomeEmailTemplate(
  firstName: string,
  lastName: string,
  email: string,
  profession: string
) {
  return {
    to: email,
    from: { email: 'service@trouver-mon-chantier.fr', name: 'Portail Habitat' },
    subject: 'Bienvenue sur Portail Habitat — Votre espace pro est prêt',
    html: `
      <!DOCTYPE html><html><head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333">
        <div style="text-align:center;margin-bottom:24px">
          <img src="https://portail-habitat.fr/logo.png" alt="Portail Habitat" style="height:50px">
        </div>
        <div style="background:linear-gradient(135deg,#ea580c,#f97316);color:white;padding:28px;border-radius:10px;text-align:center;margin-bottom:24px">
          <h1 style="margin:0;font-size:26px">Bienvenue ${firstName} !</h1>
          <p style="margin:10px 0 0;font-size:16px;opacity:0.9">Votre fiche artisan est créée et active.</p>
        </div>
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px">
          <h2 style="color:#ea580c;margin-top:0">Vos prochaines étapes</h2>
          <ul style="padding-left:20px;line-height:1.8">
            <li>Complétez votre description et ajoutez vos photos</li>
            <li>Configurez vos zones d'intervention</li>
            <li>Commencez à recevoir des demandes</li>
          </ul>
        </div>
        <div style="text-align:center;margin:28px 0">
          <a href="https://portail-habitat.fr/dashboard"
             style="background:#ea580c;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block">
            Accéder à mon espace pro
          </a>
        </div>
        <p style="font-size:12px;color:#999;text-align:center;margin-top:32px">
          © 2025 Portail Habitat – <a href="mailto:service@trouver-mon-chantier.fr" style="color:#999">service@trouver-mon-chantier.fr</a>
        </p>
      </body></html>
    `,
  };
}

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      profession,
      selectedCity,
    } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    let stripeCustomerId: string | null = null;

    // Créer le client Stripe (non bloquant si Stripe fail)
    try {
      const customer = await stripe.customers.create({
        email,
        name: `${firstName} ${lastName}`,
        phone: phone || undefined,
        metadata: { userId, profession, city: selectedCity || '' },
      });
      stripeCustomerId = customer.id;
    } catch (stripeErr) {
      console.error('Stripe customer creation failed (non-fatal):', stripeErr);
    }

    // Mettre à jour Firestore via Firebase Admin SDK si disponible
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      try {
        const { initializeApp, getApps, cert } = await import('firebase-admin/app');
        const { getFirestore } = await import('firebase-admin/firestore');

        if (!getApps().length) {
          initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
          });
        }
        const db = getFirestore();
        const updates: Record<string, any> = { updatedAt: new Date() };
        if (stripeCustomerId) updates.stripeCustomerId = stripeCustomerId;
        await db.collection('artisans').doc(userId).update(updates);
        await db.collection('users').doc(userId).update(updates);
      } catch (adminErr) {
        console.error('Firebase Admin update failed (non-fatal):', adminErr);
      }
    }

    // Envoyer l'email de bienvenue
    try {
      const emailData = createWelcomeEmailTemplate(firstName, lastName, email, profession);
      await sgMail.send(emailData);
    } catch (emailErr) {
      console.error('Email sending failed (non-fatal):', emailErr);
    }

    return NextResponse.json({ success: true, stripeCustomerId });
  } catch (err) {
    console.error('setup-artisan error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
