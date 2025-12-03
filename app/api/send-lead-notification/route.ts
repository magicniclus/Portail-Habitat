import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log('📧 Données reçues pour notification lead:', requestData);
    
    const { 
      artisanEmail, 
      artisanName, 
      clientName, 
      clientEmail, 
      clientPhone, 
      clientPostalCode,
      projectDescription 
    } = requestData;

    if (!artisanEmail || !artisanName || !clientName) {
      console.log('❌ Données manquantes:', { artisanEmail, artisanName, clientName });
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    console.log('✅ Données trouvées pour notification lead:', { artisanEmail, artisanName, clientName });

    // Template email de notification de lead
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle demande de devis - Portail Habitat</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://portail-habitat.fr/logo.png" alt="Portail Habitat" style="height: 60px;">
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">🎯 Nouvelle demande de devis !</h1>
          
          <p style="font-size: 18px; margin-bottom: 20px;">
            <strong>Bonjour ${artisanName},</strong>
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Vous avez reçu une nouvelle demande de devis via votre fiche entreprise sur Portail Habitat.
          </p>
        </div>

        <div style="background: #e8f4fd; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #2563eb; margin-top: 0;">👤 Informations du client</h3>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <p style="margin: 8px 0;"><strong>Nom :</strong> ${clientName}</p>
            <p style="margin: 8px 0;"><strong>Email :</strong> <a href="mailto:${clientEmail}" style="color: #2563eb;">${clientEmail}</a></p>
            <p style="margin: 8px 0;"><strong>Téléphone :</strong> <a href="tel:${clientPhone}" style="color: #2563eb;">${clientPhone}</a></p>
            <p style="margin: 8px 0;"><strong>Code postal :</strong> ${clientPostalCode}</p>
          </div>
          
          ${projectDescription ? `
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <h4 style="color: #2563eb; margin-top: 0;">📝 Description du projet :</h4>
            <p style="margin: 0; font-style: italic;">"${projectDescription}"</p>
          </div>
          ` : ''}
        </div>

        <div style="background: #dcfce7; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #16a34a; margin-top: 0;">⚡ Actions recommandées</h3>
          <ul style="margin: 15px 0; padding-left: 20px;">
            <li><strong>Contactez rapidement</strong> : Les clients préfèrent les artisans qui répondent vite</li>
            <li><strong>Préparez votre devis</strong> : Utilisez les informations fournies</li>
            <li><strong>Suivez votre lead</strong> : Connectez-vous à votre espace pro pour gérer cette demande</li>
          </ul>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://portail-habitat.fr/connexion-pro" 
               style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🚀 Gérer mes leads
            </a>
          </div>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 30px;">
          <h4 style="color: #856404; margin-top: 0;">💡 Conseils pour convertir ce lead :</h4>
          <p style="margin-bottom: 10px; color: #856404;">
            • Appelez dans les 2 heures pour maximiser vos chances<br>
            • Préparez des questions sur le projet<br>
            • Proposez un rendez-vous rapide<br>
            • Envoyez un devis détaillé et professionnel
          </p>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 40px;">
          <p style="color: #666; font-size: 14px;">
            Une question ? Contactez-nous à <a href="mailto:support@portail-habitat.fr">support@portail-habitat.fr</a>
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Portail Habitat - Votre partenaire digital pour développer votre activité
          </p>
        </div>

      </body>
      </html>
    `;

    // Envoyer l'email avec SendGrid
    const emailData = {
      to: artisanEmail,
      from: {
        email: 'service@trouver-mon-chantier.fr',
        name: 'Portail Habitat'
      },
      subject: `🎯 Nouvelle demande de devis de ${clientName}`,
      html: emailHtml,
    };

    console.log('📧 Envoi notification lead:', { to: artisanEmail, from: emailData.from });
    await sgMail.send(emailData);

    console.log(`Email de notification lead envoyé à ${artisanEmail}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Email de notification envoyé'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
