import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';

// Initialiser Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

// Configurer SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// Configurer Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Fonction pour générer un mot de passe sécurisé
function generatePassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Fonction pour générer un slug unique
function generateSlug(firstName: string, lastName: string, profession: string): string {
  const baseSlug = `${firstName}-${lastName}-${profession}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Éviter les tirets multiples
    .trim();
  
  // Ajouter un timestamp pour garantir l'unicité
  return `${baseSlug}-${Date.now()}`;
}

// Template d'email de bienvenue
function createWelcomeEmailTemplate(firstName: string, lastName: string, email: string, password: string, profession: string) {
  return {
    to: email,
    from: {
      email: 'service@trouver-mon-chantier.fr',
      name: 'Portail Habitat'
    },
    subject: 'Bienvenue sur Portail Habitat - Vos identifiants de connexion',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue sur Portail Habitat</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://portail-habitat.fr/logo.png" alt="Portail Habitat" style="height: 60px;">
        </div>
        
        <div style="background: linear-gradient(135deg, #16a34a, #059669); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">Bienvenue ${firstName} !</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Votre compte artisan est maintenant actif</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #16a34a; margin-top: 0;">Vos identifiants de connexion</h2>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Mot de passe :</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
          <p style="color: #6c757d; font-size: 14px; margin-top: 15px;">
            <em>Pour votre sécurité, nous vous recommandons de changer ce mot de passe lors de votre première connexion.</em>
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://portail-habitat.fr/dashboard/marketplace" 
             style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Accéder à mon espace pro
          </a>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #1976d2; margin-top: 0;">Prochaines étapes :</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Complétez votre profil artisan</li>
            <li>Ajoutez vos photos de réalisations</li>
            <li>Configurez vos zones d'intervention</li>
            <li>Commencez à recevoir vos premières demandes</li>
          </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #856404; margin-top: 0;">🎯 Votre garantie</h3>
          <p style="margin: 0; color: #856404;">
            <strong>1 demande garantie par mois</strong> ou le mois suivant est offert. 
            La plupart de nos artisans reçoivent entre 4 et 6 demandes par mois.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #dee2e6; margin-top: 30px; color: #6c757d;">
          <p>Vous rejoignez plus de <strong>3 200 artisans</strong> qui nous font confiance</p>
          <p style="font-size: 14px;">
            Besoin d'aide ? Contactez-nous à 
            <a href="mailto:service@trouver-mon-chantier.fr" style="color: #16a34a;">service@trouver-mon-chantier.fr</a>
          </p>
          <p style="font-size: 12px; margin-top: 20px;">
            © 2024 Portail Habitat - Tous droits réservés
          </p>
        </div>
      </body>
      </html>
    `
  };
}

export async function POST(request: NextRequest) {
  let prospectId: string | undefined;
  
  try {
    const body = await request.json();
    const extractedData = body;
    prospectId = extractedData.prospectId;
    const {
      firstName, lastName, email, phone, postalCode, profession,
      selectedCity, selectedZoneRadius, coordinates,
      // Données fiche (optionnelles — passées depuis l'onboarding step 3)
      password: chosenPassword,
      companyName: chosenCompanyName,
      description: chosenDescription,
      ficheComplete: ficheCompleteFromBody,
    } = extractedData;

    if (!prospectId || !firstName || !lastName || !email || !profession) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Utiliser une transaction pour éviter les race conditions
    const prospectRef = db.collection('prospects').doc(prospectId);
    
    // Vérifier et verrouiller le prospect en une seule opération atomique
    const transactionResult = await db.runTransaction(async (transaction) => {
      const prospectDoc = await transaction.get(prospectRef);
      
      if (!prospectDoc.exists) {
        throw new Error('Prospect introuvable');
      }

      const prospectData = prospectDoc.data();
      
      // Si déjà en cours de traitement ou converti, arrêter
      if (prospectData?.funnelStep === 'converted' || prospectData?.processing === true) {
        return {
          alreadyProcessed: true,
          artisanId: prospectData?.artisanId || null
        };
      }

      // Marquer comme en cours de traitement
      transaction.update(prospectRef, {
        processing: true,
        processingStartedAt: new Date()
      });

      return { alreadyProcessed: false };
    });

    // Si déjà traité, retourner sans créer (avec custom token si possible)
    if (transactionResult.alreadyProcessed && transactionResult.artisanId) {
      try {
        const existingToken = await auth.createCustomToken(transactionResult.artisanId);
        return NextResponse.json(
          { success: true, artisanId: transactionResult.artisanId, customToken: existingToken, alreadyExists: true },
          { status: 200 }
        );
      } catch {
        return NextResponse.json(
          { success: true, artisanId: transactionResult.artisanId, alreadyExists: true },
          { status: 200 }
        );
      }
    }

    // Vérifier si l'email existe déjà dans Firebase Auth
    try {
      const existingUser = await auth.getUserByEmail(email);
      // Si l'utilisateur existe, vérifier s'il est déjà artisan
      const existingArtisan = await db.collection('artisans').doc(existingUser.uid).get();
      if (existingArtisan.exists) {
        return NextResponse.json(
          { 
            success: true, 
            artisanId: existingUser.uid,
            message: 'Compte artisan déjà existant',
            alreadyExists: true
          },
          { status: 200 }
        );
      }
    } catch (error) {
      // L'utilisateur n'existe pas, on peut continuer
    }

    // Utiliser le mot de passe choisi par l'artisan, sinon en générer un
    const generatedPassword = chosenPassword || generatePassword();

    // Créer l'utilisateur Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password: generatedPassword,
      displayName: `${firstName} ${lastName}`,
      emailVerified: true,
    });

    // Générer un slug unique
    const slug = generateSlug(firstName, lastName, profession);

    // Créer le client Stripe
    const stripeCustomer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      metadata: {
        prospectId,
        profession,
        city: selectedCity || ''
      }
    });

    // Créer le document utilisateur selon le schéma exact
    await db.collection('users').doc(userRecord.uid).set({
      email,
      phone: phone || '',
      role: 'artisan',
      createdAt: new Date(),
      lastLoginAt: null,
      stripeCustomerId: stripeCustomer.id
    });

    // ficheComplete = true si description + logo seront fournis (flag passé depuis le front)
    const ficheComplete = ficheCompleteFromBody === true;

    // Créer le document artisan selon le schéma — compte gratuit, fiche partiellement pré-remplie
    await db.collection('artisans').doc(userRecord.uid).set({
      userId: userRecord.uid,
      companyName: chosenCompanyName || `${firstName} ${lastName}`,
      slug,
      firstName,
      lastName,
      phone: phone || '',
      email,
      siret: '',
      city: selectedCity || '',
      postalCode: postalCode || '',
      fullAddress: '',
      coordinates: coordinates || { lat: 0, lng: 0 },
      profession,
      professions: [profession],
      description: chosenDescription || '',
      services: [],
      logoUrl: '',
      coverUrl: '',
      photos: [],
      hasPremiumSite: false,
      sitePricePaid: 0,
      monthlySubscriptionPrice: 49,
      subscriptionStatus: 'free',
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      premiumFeatures: {
        isPremium: false,
        premiumStartDate: null,
        premiumEndDate: null,
        premiumType: null,
        bannerPhotos: [],
        bannerVideo: null,
        showTopArtisanBadge: false,
        premiumBenefits: []
      },
      ficheComplete,
      premiumProposalShown: false,
      leadCountThisMonth: 0,
      totalLeads: 0,
      averageRating: 0,
      reviewCount: 0,
      hasSocialFeed: false,
      publishedPostsCount: 0,
      originalProspectId: prospectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPriority: false
    });

    // Supprimer le prospect car il est maintenant artisan (transaction finale)
    await db.runTransaction(async (transaction) => {
      // Ajouter la date de conversion à l'artisan
      transaction.update(db.collection('artisans').doc(userRecord.uid), {
        convertedAt: new Date()
      });
      
      // Supprimer le document prospect
      transaction.delete(prospectRef);
    });

    console.log(`Prospect ${prospectId} supprimé - maintenant artisan ${userRecord.uid}`);

    // Envoyer l'email de bienvenue
    // Si le mot de passe a été choisi par l'artisan, ne pas l'inclure dans l'email
    const emailPassword = chosenPassword ? "Mot de passe choisi lors de votre inscription" : generatedPassword;
    const emailData = createWelcomeEmailTemplate(firstName, lastName, email, emailPassword, profession);
    await sgMail.send(emailData);

    // Générer un custom token pour l'auto-login côté client
    const customToken = await auth.createCustomToken(userRecord.uid);

    return NextResponse.json({
      success: true,
      artisanId: userRecord.uid,
      customToken,
      message: 'Compte artisan créé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'artisan:', error);
    
    // En cas d'erreur, retirer le flag de traitement si on a le prospectId
    if (prospectId) {
      try {
        await db.collection('prospects').doc(prospectId).update({
          processing: false,
          processingError: error instanceof Error ? error.message : 'Erreur inconnue',
          processingErrorAt: new Date()
        });
      } catch (cleanupError) {
        console.error('Erreur lors du nettoyage:', cleanupError);
      }
    }
    
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
