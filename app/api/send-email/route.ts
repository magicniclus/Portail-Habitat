import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUT ENVOI EMAIL ===');
    console.log('Variables d\'environnement:');
    console.log('SENDGRID_API_KEY présente:', !!process.env.SENDGRID_API_KEY);
    console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
    
    // Vérification de la configuration
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY non configurée');
      return NextResponse.json(
        { error: 'Configuration SendGrid manquante - Vérifiez votre fichier .env.local' },
        { status: 500 }
      );
    }

    // SENDGRID_FROM_EMAIL est optionnel car nous avons un fallback

    // Configuration SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { to, subject, content, fromName, fromEmail } = await request.json();

    // Validation des données
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Données manquantes: to, subject et content sont requis' },
        { status: 400 }
      );
    }

    // Configuration du message
    const msg = {
      to: to,
      from: {
        email: fromEmail || process.env.SENDGRID_FROM_EMAIL || 'service@trouver-mon-chantier.fr',
        name: fromName || 'Portail Habitat'
      },
      subject: subject,
      text: content,
      html: content.replace(/\n/g, '<br>'), // Conversion simple des retours à la ligne
    };

    console.log('Tentative d\'envoi email vers:', to);
    console.log('Depuis:', msg.from.email);

    // Envoi de l'email
    await sgMail.send(msg);

    console.log('Email envoyé avec succès');
    return NextResponse.json(
      { message: 'Email envoyé avec succès' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Erreur SendGrid complète:', error);
    
    // Gestion spécifique des erreurs SendGrid
    if (error.code === 403) {
      return NextResponse.json(
        { 
          error: 'Accès refusé par SendGrid. Vérifiez votre API key et les permissions.',
          details: 'API key invalide ou permissions insuffisantes'
        },
        { status: 403 }
      );
    }

    if (error.code === 401) {
      return NextResponse.json(
        { 
          error: 'API key SendGrid invalide',
          details: 'Vérifiez votre configuration SENDGRID_API_KEY'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error.message || 'Erreur inconnue',
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}
