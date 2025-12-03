import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log('📧 Données reçues pour demandes d\'avis:', requestData);
    
    const { artisanId, artisanName, emails, subject, message } = requestData;

    if (!artisanId || !artisanName || !emails || !Array.isArray(emails) || emails.length === 0) {
      console.log('❌ Données manquantes:', { artisanId, artisanName, emailsCount: emails?.length });
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    if (!subject.trim() || !message.trim()) {
      console.log('❌ Sujet ou message manquant');
      return NextResponse.json({ error: 'Sujet et message requis' }, { status: 400 });
    }

    console.log('✅ Envoi de demandes d\'avis à', emails.length, 'destinataires');

    const reviewUrl = `https://portail-habitat.fr/avis/${artisanId}`;
    
    // Préparer les emails individuels
    const emailPromises = emails.map(async (email: string) => {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://portail-habitat.fr/logo.png" alt="Portail Habitat" style="height: 60px;">
          </div>

          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 20px;">⭐ Votre avis nous intéresse</h1>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
              <div style="white-space: pre-line; line-height: 1.6;">
                ${message}
              </div>
            </div>
          </div>

          <div style="background: #e8f4fd; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
            <h3 style="color: #2563eb; margin-top: 0;">🌟 Laissez votre avis en quelques clics</h3>
            <p style="margin-bottom: 20px;">
              Votre retour d'expérience est précieux et ne prend que 2 minutes.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${reviewUrl}" 
                 style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                ⭐ Laisser mon avis
              </a>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #666; margin-top: 15px;">
              Ou copiez ce lien dans votre navigateur :<br>
              <a href="${reviewUrl}" style="color: #2563eb; word-break: break-all;">${reviewUrl}</a>
            </p>
          </div>

          <div style="background: #dcfce7; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 30px;">
            <h4 style="color: #16a34a; margin-top: 0;">✅ Pourquoi votre avis est important :</h4>
            <ul style="margin: 10px 0; padding-left: 20px; color: #16a34a;">
              <li>Il aide d'autres clients à faire leur choix</li>
              <li>Il permet à l'artisan d'améliorer ses services</li>
              <li>Il ne prend que quelques minutes</li>
              <li>Il est entièrement gratuit et sécurisé</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 40px;">
            <p style="color: #666; font-size: 14px;">
              Cet email vous a été envoyé par ${artisanName} via Portail Habitat
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Portail Habitat - Plateforme de mise en relation artisans-clients
            </p>
          </div>

        </body>
        </html>
      `;

      // Envoyer l'email individuel
      const emailData = {
        to: email,
        from: {
          email: 'service@trouver-mon-chantier.fr',
          name: artisanName
        },
        subject: subject,
        html: emailHtml,
      };

      console.log('📧 Envoi demande d\'avis à:', email);
      return sgMail.send(emailData);
    });

    // Envoyer tous les emails en parallèle
    await Promise.all(emailPromises);

    console.log(`${emails.length} demandes d'avis envoyées avec succès`);

    return NextResponse.json({ 
      success: true, 
      message: `${emails.length} demande(s) d'avis envoyée(s) avec succès`,
      sentCount: emails.length
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi des demandes d\'avis:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi des demandes d\'avis',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
