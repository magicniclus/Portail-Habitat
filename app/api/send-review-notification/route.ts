import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log('⭐ Données reçues pour notification avis:', requestData);
    
    const { 
      artisanEmail, 
      artisanName, 
      clientName, 
      rating,
      comment,
      reviewUrl
    } = requestData;

    if (!artisanEmail || !artisanName || !clientName || !rating) {
      console.log('❌ Données manquantes:', { artisanEmail, artisanName, clientName, rating });
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    console.log('✅ Données trouvées pour notification avis:', { artisanEmail, artisanName, clientName, rating });

    // Générer les étoiles pour l'affichage
    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    const ratingText = rating >= 4 ? 'Excellent' : rating >= 3 ? 'Bien' : rating >= 2 ? 'Moyen' : 'À améliorer';
    const ratingColor = rating >= 4 ? '#16a34a' : rating >= 3 ? '#2563eb' : rating >= 2 ? '#f59e0b' : '#dc2626';

    // Template email de notification d'avis
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvel avis client - Portail Habitat</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://portail-habitat.fr/logo.png" alt="Portail Habitat" style="height: 60px;">
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h1 style="color: ${ratingColor}; margin-bottom: 20px;">⭐ Nouvel avis client !</h1>
          
          <p style="font-size: 18px; margin-bottom: 20px;">
            <strong>Bonjour ${artisanName},</strong>
          </p>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Vous avez reçu un nouvel avis de la part d'un client sur votre fiche Portail Habitat.
          </p>
        </div>

        <div style="background: #e8f4fd; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #2563eb; margin-top: 0;">👤 Détails de l'avis</h3>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <p style="margin: 8px 0;"><strong>Client :</strong> ${clientName}</p>
            <p style="margin: 8px 0;"><strong>Note :</strong> 
              <span style="color: ${ratingColor}; font-size: 18px;">${stars}</span> 
              <span style="color: ${ratingColor}; font-weight: bold;">${rating}/5 - ${ratingText}</span>
            </p>
          </div>
          
          ${comment ? `
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${ratingColor};">
            <h4 style="color: ${ratingColor}; margin-top: 0;">💬 Commentaire du client :</h4>
            <p style="margin: 0; font-style: italic; font-size: 16px;">"${comment}"</p>
          </div>
          ` : ''}
        </div>

        ${rating >= 4 ? `
        <div style="background: #dcfce7; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #16a34a; margin-top: 0;">🎉 Félicitations !</h3>
          <p style="color: #16a34a; margin-bottom: 15px;">
            Cet excellent avis va améliorer votre réputation en ligne et attirer plus de clients !
          </p>
          <ul style="margin: 15px 0; padding-left: 20px; color: #16a34a;">
            <li>Votre note moyenne s'améliore</li>
            <li>Votre fiche gagne en visibilité</li>
            <li>Les clients font plus confiance</li>
          </ul>
        </div>
        ` : rating >= 2 ? `
        <div style="background: #fff3cd; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #856404; margin-top: 0;">💡 Conseils d'amélioration</h3>
          <p style="color: #856404; margin-bottom: 15px;">
            Cet avis vous donne des pistes pour améliorer vos services :
          </p>
          <ul style="margin: 15px 0; padding-left: 20px; color: #856404;">
            <li>Analysez les points d'amélioration mentionnés</li>
            <li>Contactez le client pour comprendre ses attentes</li>
            <li>Mettez en place des actions correctives</li>
          </ul>
        </div>
        ` : `
        <div style="background: #fee2e2; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #dc2626; margin-top: 0;">⚠️ Attention requise</h3>
          <p style="color: #dc2626; margin-bottom: 15px;">
            Cet avis nécessite une attention particulière :
          </p>
          <ul style="margin: 15px 0; padding-left: 20px; color: #dc2626;">
            <li>Contactez rapidement le client pour résoudre le problème</li>
            <li>Proposez une solution ou un geste commercial</li>
            <li>Améliorez vos processus pour éviter la répétition</li>
          </ul>
        </div>
        `}

        <div style="text-align: center; margin: 25px 0;">
          <a href="https://portail-habitat.fr/dashboard/avis" 
             style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            📊 Gérer mes avis
          </a>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h4 style="color: #2563eb; margin-top: 0;">💡 Maximisez l'impact de vos avis :</h4>
          <p style="margin-bottom: 10px; color: #666;">
            • Remerciez vos clients pour leurs avis positifs<br>
            • Demandez plus d'avis à vos clients satisfaits<br>
            • Répondez professionnellement aux critiques<br>
            • Utilisez les retours pour améliorer vos services
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
      subject: `⭐ Nouvel avis ${rating}/5 de ${clientName}`,
      html: emailHtml,
    };

    console.log('📧 Envoi notification avis:', { to: artisanEmail, from: emailData.from });
    await sgMail.send(emailData);

    console.log(`Email de notification avis envoyé à ${artisanEmail}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Email de notification avis envoyé'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de notification avis:', error);
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
