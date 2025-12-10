# 📧 Système d'Email - Documentation Technique

## Vue d'ensemble

Le système d'email de Portail Habitat permet aux administrateurs d'envoyer des emails personnalisés aux prospects directement depuis l'interface admin. Il inclut un système de modèles, la gestion des CC/BCC, et une intégration prête pour SendGrid.

## Architecture

### Composants principaux

```
📁 components/admin/
├── EmailModal.tsx          # Modal d'envoi d'email
└── ...

📁 app/admin/demandes/[id]/
├── page.tsx               # Page détail prospect avec bouton email
└── ...

📁 lib/
├── email-service.ts       # Service d'envoi (à créer)
└── ...
```

## 🎯 Fonctionnalités

### 1. Modal EmailModal

**Fichier :** `components/admin/EmailModal.tsx`

#### Props
```typescript
interface EmailModalProps {
  isOpen: boolean;                    // État d'ouverture de la modal
  onClose: () => void;               // Fonction de fermeture
  recipientEmail: string;            // Email du destinataire principal
  recipientName: string;             // Nom du destinataire
  onSend: (emailData: EmailData) => Promise<void>; // Fonction d'envoi
}
```

#### Structure EmailData
```typescript
interface EmailData {
  to: string;           // Destinataire principal
  cc: string[];         // Emails en copie
  bcc: string[];        // Emails en copie cachée
  subject: string;      // Sujet de l'email
  body: string;         // Corps du message
  template?: string;    // ID du modèle utilisé (optionnel)
}
```

### 2. Système de modèles

#### Modèles prédéfinis

| ID | Nom | Usage |
|---|---|---|
| `welcome` | Bienvenue | Premier contact avec un prospect |
| `follow_up` | Relance | Suivi d'une demande en cours |
| `quote_ready` | Devis prêt | Notification de disponibilité du devis |
| `custom` | Personnalisé | Email libre sans modèle |

#### Variables dynamiques

- `{{name}}` : Remplacé par le nom complet du prospect
- Extensible pour d'autres variables (ville, projet, etc.)

#### Exemple de modèle
```typescript
{
  id: "welcome",
  name: "Bienvenue",
  subject: "Bienvenue sur Portail Habitat",
  body: `Bonjour {{name}},

Nous vous remercions de votre intérêt pour nos services.

Notre équipe va étudier votre demande et vous recontacter dans les plus brefs délais.

Cordialement,
L'équipe Portail Habitat`
}
```

## 🔧 Intégration technique

### 1. Dans la page prospect

**Fichier :** `app/admin/demandes/[id]/page.tsx`

#### États nécessaires
```typescript
const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
```

#### Fonction d'envoi
```typescript
const handleSendEmail = async (emailData: EmailData) => {
  try {
    // Intégration avec service d'email (SendGrid, etc.)
    await emailService.send(emailData);
    console.log('Email envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error);
    throw error;
  }
};
```

#### Bouton d'ouverture
```typescript
<Button variant="outline" onClick={() => setIsEmailModalOpen(true)}>
  <Mail className="h-4 w-4 mr-2" />
  Envoyer un email
</Button>
```

#### Intégration de la modal
```typescript
<EmailModal
  isOpen={isEmailModalOpen}
  onClose={() => setIsEmailModalOpen(false)}
  recipientEmail={prospect.email || ''}
  recipientName={`${prospect.firstName} ${prospect.lastName}`}
  onSend={handleSendEmail}
/>
```

### 2. Service d'email (à implémenter)

**Fichier à créer :** `lib/email-service.ts`

```typescript
import sgMail from '@sendgrid/mail';

// Configuration SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface EmailData {
  to: string;
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  template?: string;
}

export class EmailService {
  static async send(emailData: EmailData): Promise<void> {
    const msg = {
      to: emailData.to,
      cc: emailData.cc.length > 0 ? emailData.cc : undefined,
      bcc: emailData.bcc.length > 0 ? emailData.bcc : undefined,
      from: process.env.FROM_EMAIL || 'admin@portail-habitat.fr',
      subject: emailData.subject,
      text: emailData.body,
      html: emailData.body.replace(/\n/g, '<br>'), // Conversion basique
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Erreur SendGrid:', error);
      throw new Error('Échec de l\'envoi de l\'email');
    }
  }
}
```

### 3. API Route (recommandée)

**Fichier à créer :** `app/api/send-email/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';
import { getCurrentAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification admin
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const emailData = await request.json();
    
    // Validation des données
    if (!emailData.to || !emailData.subject || !emailData.body) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Envoi de l'email
    await EmailService.send(emailData);

    // Log de l'activité (optionnel)
    console.log(`Email envoyé par ${admin.email} à ${emailData.to}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API send-email:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
```

## 🎨 Interface utilisateur

### Fonctionnalités UX

1. **Modèles prédéfinis** : Sélection rapide avec pré-remplissage
2. **CC/BCC dynamiques** : Ajout/suppression avec badges visuels
3. **Validation** : Désactivation du bouton si champs requis vides
4. **États de chargement** : Spinner pendant l'envoi
5. **Gestion d'erreurs** : Affichage des erreurs utilisateur

### Responsive Design

- Modal adaptée mobile/desktop
- Textarea redimensionnable
- Boutons optimisés tactile

## 🔐 Sécurité

### Authentification
- Vérification admin obligatoire
- Permissions d'envoi d'email

### Validation
- Validation des emails (format)
- Sanitisation du contenu
- Limite de destinataires (CC/BCC)

### Logs
- Traçabilité des envois
- Historique par admin
- Gestion des erreurs

## 📊 Métriques (futures)

### Tracking recommandé
- Nombre d'emails envoyés par admin
- Taux de succès/échec
- Modèles les plus utilisés
- Temps de réponse moyen

### Base de données (extension)
```sql
-- Table pour l'historique des emails
CREATE TABLE email_history (
  id SERIAL PRIMARY KEY,
  admin_id VARCHAR(255) NOT NULL,
  prospect_id VARCHAR(255) NOT NULL,
  to_email VARCHAR(255) NOT NULL,
  cc_emails TEXT[], 
  bcc_emails TEXT[],
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  template_id VARCHAR(50),
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent', -- sent, failed, pending
  error_message TEXT
);
```

## 🚀 Déploiement

### Variables d'environnement requises

```env
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=admin@portail-habitat.fr

# Optionnel : limites
MAX_CC_RECIPIENTS=10
MAX_BCC_RECIPIENTS=5
MAX_EMAIL_LENGTH=10000
```

### Installation SendGrid

```bash
npm install @sendgrid/mail
```

### Configuration Next.js

Ajouter dans `next.config.js` :
```javascript
module.exports = {
  env: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
  },
}
```

## 🔄 Évolutions futures

### Fonctionnalités avancées
1. **Pièces jointes** : Upload et envoi de fichiers
2. **Éditeur riche** : WYSIWYG pour mise en forme
3. **Programmation** : Envoi différé
4. **Campagnes** : Envoi en masse avec segmentation
5. **Analytics** : Ouverture, clics, réponses

### Intégrations
- CRM externe (HubSpot, Salesforce)
- Outils de marketing automation
- Système de tickets support

## 📝 Maintenance

### Monitoring
- Surveillance des quotas SendGrid
- Alertes en cas d'échec répétés
- Performance des envois

### Backup
- Sauvegarde des modèles
- Historique des communications
- Configuration des templates

---

**Auteur :** Équipe Portail Habitat  
**Version :** 1.0  
**Dernière mise à jour :** Décembre 2024
