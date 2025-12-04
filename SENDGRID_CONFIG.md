# Configuration SendGrid

## Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=service@trouver-mon-chantier.fr
NEXT_PUBLIC_FROM_EMAIL=service@trouver-mon-chantier.fr
```

## Configuration SendGrid étape par étape

### 1. Créer un compte SendGrid
- Aller sur https://sendgrid.com/
- Créer un compte gratuit (100 emails/jour)

### 2. Générer une API Key
- Aller dans **Settings > API Keys**
- Cliquer sur **Create API Key**
- Choisir **Restricted Access**
- Donner les permissions suivantes :
  - **Mail Send** : Full Access
  - **Mail Settings** : Read Access (optionnel)
- Copier la clé qui commence par `SG.`

### 3. Vérifier le domaine d'envoi
- Aller dans **Settings > Sender Authentication**
- **Option A - Single Sender Verification** (plus simple) :
  - Cliquer sur **Verify a Single Sender**
  - Remplir avec votre email (ex: service@trouver-mon-chantier.fr)
  - Vérifier l'email reçu
- **Option B - Domain Authentication** (recommandé pour production) :
  - Cliquer sur **Authenticate Your Domain**
  - Suivre les instructions DNS

### 4. Tester la configuration
- Redémarrer votre serveur Next.js après avoir ajouté les variables
- Essayer d'envoyer un email de test

## Fonctionnalités implémentées

- ✅ Envoi d'emails via API SendGrid
- ✅ Gestion des erreurs
- ✅ Interface utilisateur avec feedback
- ✅ Conversion automatique des retours à la ligne en HTML
- ✅ Configuration flexible de l'expéditeur

## API Route

L'API route `/api/send-email` accepte :

```json
{
  "to": "client@example.com",
  "subject": "Sujet de l'email",
  "content": "Contenu de l'email",
  "fromName": "Portail Habitat",
  "fromEmail": "service@trouver-mon-chantier.fr"
}
```

## Dépannage des erreurs courantes

### Erreur 403 "Forbidden"
**Causes possibles :**
- API Key invalide ou expirée
- Permissions insuffisantes sur l'API Key
- Email expéditeur non vérifié

**Solutions :**
1. Vérifier que l'API Key commence par `SG.`
2. Recréer une API Key avec les bonnes permissions
3. Vérifier l'email expéditeur dans SendGrid
4. Redémarrer le serveur après modification des variables

### Erreur 401 "Unauthorized"
- API Key manquante ou mal configurée
- Vérifier la variable `SENDGRID_API_KEY` dans `.env.local`

### Erreur "Configuration SendGrid manquante"
- Variables d'environnement non définies
- Fichier `.env.local` non créé ou mal placé
- Redémarrage du serveur nécessaire

### Email expéditeur non vérifié
- Aller dans SendGrid > Settings > Sender Authentication
- Vérifier l'email ou le domaine utilisé

## Sécurité

- L'API Key SendGrid est stockée côté serveur uniquement
- Validation des données d'entrée
- Gestion des erreurs sans exposer les détails sensibles
