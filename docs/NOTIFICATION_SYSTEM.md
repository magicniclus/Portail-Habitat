# Système de Notifications Automatiques

## 📧 Vue d'ensemble

Le système de notifications automatiques envoie des emails aux artisans lors de nouvelles demandes de devis et nouveaux avis clients, en respectant leurs préférences de notification définies dans les paramètres.

## 🔧 Architecture

### 1. Service de Notifications (`lib/notification-service.ts`)
- **Vérification des préférences** : Consulte les paramètres de l'artisan
- **Envoi conditionnel** : N'envoie que si autorisé par les préférences
- **Gestion d'erreurs** : Logging et fallback en cas d'erreur

### 2. APIs d'Envoi d'Emails
- **`/api/send-lead-notification`** : Notifications de nouvelles demandes
- **`/api/send-review-notification`** : Notifications de nouveaux avis

### 3. Intégration dans l'Application
- **Formulaire de contact** : `FicheEntreprise.tsx`
- **Soumission d'avis** : `/app/avis/[artisanId]/page.tsx`

## ⚙️ Fonctionnement

### Nouvelles Demandes de Devis

```typescript
// Dans FicheEntreprise.tsx - après sauvegarde du lead
const notificationSent = await sendLeadNotificationIfAllowed(entreprise.id, {
  artisanEmail: entreprise.email,
  artisanName: entreprise.nom,
  clientName: `${formData.prenom} ${formData.nom}`,
  clientEmail: formData.email,
  clientPhone: formData.telephone,
  clientPostalCode: formData.codePostal,
  projectDescription: formData.description
});
```

**Processus :**
1. Client soumet le formulaire de contact
2. Lead sauvegardé dans Firestore
3. Vérification des préférences (`notifications.emailLeads`)
4. Envoi d'email si autorisé

### Nouveaux Avis Clients

```typescript
// Dans /app/avis/[artisanId]/page.tsx - après sauvegarde de l'avis
const notificationSent = await sendReviewNotificationIfAllowed(artisanId, {
  artisanEmail: artisan.email,
  artisanName: artisan.companyName || `${artisan.firstName} ${artisan.lastName}`,
  clientName: clientName.trim(),
  rating: rating,
  comment: comment.trim()
});
```

**Processus :**
1. Client soumet un avis
2. Avis sauvegardé dans Firestore
3. Vérification des préférences (`notifications.emailReviews`)
4. Envoi d'email si autorisé

## 📋 Préférences de Notification

### Structure dans Firestore (`artisans/{artisanId}`)

```javascript
notifications: {
  emailLeads: true,        // Emails pour nouvelles demandes
  emailReviews: true,      // Emails pour nouveaux avis
  emailMarketing: false,   // Emails marketing (non utilisé pour l'instant)
  pushNotifications: true  // Notifications push (non utilisé pour l'instant)
}
```

### Valeurs par Défaut
- ✅ `emailLeads: true` - Activé par défaut
- ✅ `emailReviews: true` - Activé par défaut
- ❌ `emailMarketing: false` - Désactivé par défaut
- ✅ `pushNotifications: true` - Activé par défaut

## 📧 Templates d'Emails

### Email de Nouvelle Demande
- **Sujet** : `🎯 Nouvelle demande de devis de [Client]`
- **Contenu** :
  - Informations du client (nom, email, téléphone, code postal)
  - Description du projet
  - Conseils pour convertir le lead
  - Lien vers le dashboard

### Email de Nouvel Avis
- **Sujet** : `⭐ Nouvel avis [Note]/5 de [Client]`
- **Contenu** :
  - Note avec étoiles visuelles
  - Commentaire du client
  - Conseils selon la note (félicitations, amélioration, attention)
  - Lien vers la gestion des avis

## 🛠️ Configuration

### Variables d'Environnement Requises
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=service@trouver-mon-chantier.fr
```

### Sender par Défaut
- **Email** : `service@trouver-mon-chantier.fr`
- **Nom** : `Portail Habitat`

## 🔍 Debugging et Logs

### Logs de Service
```typescript
console.log(`Notification lead envoyée pour l'artisan ${artisanId}`);
console.log(`Notification lead désactivée pour l'artisan ${artisanId}`);
console.log(`Préférence emailLeads pour ${artisanId}: ${shouldNotify}`);
```

### Vérification des Envois
1. **Console navigateur** : Logs de succès/échec
2. **SendGrid Dashboard** : Statistiques d'envoi
3. **Firestore** : Vérification des préférences

## 🚨 Gestion d'Erreurs

### Stratégie de Fallback
- **Préférences manquantes** : Utilise les valeurs par défaut (true)
- **Erreur Firestore** : Envoie quand même (sécurité)
- **Erreur SendGrid** : Log l'erreur, ne fait pas échouer la soumission

### Codes d'Erreur Courants
- **403 Forbidden** : API key SendGrid invalide
- **400 Bad Request** : Données email manquantes
- **Permission Denied** : Problème d'accès Firestore

## 📊 Métriques et Suivi

### Données Trackées
- Nombre de notifications envoyées
- Taux de succès/échec
- Préférences des artisans

### Optimisations Futures
- **Rate limiting** : Éviter le spam
- **Templates personnalisés** : Par métier ou région
- **A/B testing** : Optimiser les taux d'ouverture
- **Notifications push** : Compléter les emails

## 🔄 Maintenance

### Ajout d'un Nouveau Type de Notification

1. **Ajouter la préférence** dans le schéma Firestore
2. **Créer l'API route** (`/api/send-[type]-notification`)
3. **Ajouter la fonction** dans `notification-service.ts`
4. **Intégrer** dans le composant approprié
5. **Mettre à jour** l'interface des paramètres

### Migration des Préférences
- Script disponible : `scripts/migrate-artisan-preferences.js`
- Exécution unique lors de la mise en production
- Backup recommandé avant migration

## 🎯 Bonnes Pratiques

### Performance
- **Appels asynchrones** : Ne pas bloquer l'UX
- **Timeout approprié** : Éviter les attentes trop longues
- **Retry logic** : Pour les erreurs temporaires

### UX/UI
- **Feedback utilisateur** : Confirmation d'envoi
- **Préférences claires** : Interface intuitive
- **Opt-out facile** : Respecter les choix utilisateur

### Sécurité
- **Validation des données** : Avant envoi
- **Rate limiting** : Éviter l'abus
- **Logs sécurisés** : Pas d'informations sensibles
