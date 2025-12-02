import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, profession } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const professionLabel = getProfessionLabel(profession);

    // Template email de remerciement upsell
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Merci pour votre commande - Site professionnel</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://portail-habitat.fr/logo.png" alt="Portail Habitat" style="height: 60px;">
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 20px;">🎉 Merci ${firstName} !</h1>
          
          <p style="font-size: 18px; margin-bottom: 20px;">
            <strong>Votre site professionnel ${professionLabel} est en cours de création.</strong>
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a;">
            <h3 style="color: #16a34a; margin-top: 0;">📅 Prochaines étapes :</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li><strong>Sous 48h (jours ouvrés)</strong> : Notre équipe vous contactera pour finaliser votre site</li>
              <li><strong>Livraison</strong> : Votre site sera en ligne sous 72h maximum</li>
              <li><strong>Formation</strong> : Nous vous expliquerons comment gérer votre espace</li>
            </ul>
          </div>
        </div>

        <div style="background: #e8f5e8; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
          <h3 style="color: #16a34a; margin-top: 0;">🔐 Vos identifiants de connexion</h3>
          <p>Vous avez reçu vos identifiants de connexion dans un email séparé.</p>
          <p><strong>Vous pouvez dès maintenant accéder à votre espace professionnel :</strong></p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="https://portail-habitat.fr/connexion-pro" 
               style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🚀 Accéder à mon espace pro
            </a>
          </div>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 30px;">
          <h4 style="color: #856404; margin-top: 0;">💡 En attendant votre site :</h4>
          <p style="margin-bottom: 10px; color: #856404;">
            • Consultez vos demandes de devis<br>
            • Mettez à jour vos informations<br>
            • Découvrez toutes les fonctionnalités
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
    const msg = {
      to: email,
      from: 'noreply@portail-habitat.fr', // Doit être vérifié dans SendGrid
      subject: `Merci ${firstName} ! Votre site professionnel est en cours de création`,
      html: emailHtml,
    };

    await sgMail.send(msg);

    console.log(`Email de confirmation upsell envoyé à ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Email de confirmation envoyé'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}

function getProfessionLabel(profession: string) {
  const labels: { [key: string]: string } = {
    "plombier": "Plombier",
    "electricien": "Électricien", 
    "chauffagiste": "Chauffagiste",
    "peintre": "Peintre",
    "maconnerie": "Maçon",
    "menuisier": "Menuisier",
    "couvreur": "Couvreur",
    "carreleur": "Carreleur",
    "charpentier": "Charpentier",
    "multiservices": "Multiservices"
  };
  return labels[profession] || profession;
}
