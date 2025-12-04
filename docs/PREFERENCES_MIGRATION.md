# Migration des Préférences Artisans

## 📋 Vue d'ensemble

Ce document explique comment ajouter et gérer les préférences de notifications et de confidentialité pour les artisans dans Firestore.

## 🗄️ Schéma Firestore Mis à Jour

### Nouveaux champs dans `artisans/{artisanId}` :

```javascript
{
  // ... champs existants ...
  
  // Préférences de notifications
  notifications: {
    emailLeads: true,        // Emails pour nouvelles demandes
    emailReviews: true,      // Emails pour nouveaux avis
    emailMarketing: false,   // Emails marketing/newsletters
    pushNotifications: true  // Notifications push navigateur
  },
  
  // Paramètres de confidentialité
  privacy: {
    profileVisible: true,     // Profil visible dans recherches
    showPhone: true,         // Afficher téléphone publiquement
    showEmail: false,        // Afficher email publiquement
    allowDirectContact: true // Contact direct sans formulaire
  }
}
```

## 🚀 Migration des Données Existantes

### 1. Exécuter le script de migration

```bash
# Depuis la racine du projet
node scripts/migrate-artisan-preferences.js
```

### 2. Vérification manuelle (optionnel)

Vous pouvez vérifier dans la console Firebase que les champs ont été ajoutés :
- Allez dans Firestore Database
- Ouvrez la collection `artisans`
- Vérifiez qu'un document contient les champs `notifications` et `privacy`

## 💻 Utilisation dans le Code

### 1. Pour un nouvel artisan

```typescript
import { getDefaultArtisanPreferences } from '@/lib/artisan-preferences';

// Lors de la création d'un nouvel artisan
const newArtisanData = {
  // ... autres champs ...
  ...getDefaultArtisanPreferences(),
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### 2. Pour charger les préférences existantes

```typescript
import { getArtisanPreferencesWithDefaults } from '@/lib/artisan-preferences';

// Charger avec fallback sur les valeurs par défaut
const preferences = getArtisanPreferencesWithDefaults(artisanData);
setNotifications(preferences.notifications);
setPrivacy(preferences.privacy);
```

### 3. Pour sauvegarder les préférences

```typescript
// Sauvegarder les notifications
await updateDoc(artisanRef, {
  notifications: {
    emailLeads: true,
    emailReviews: false,
    emailMarketing: false,
    pushNotifications: true
  },
  updatedAt: new Date()
});

// Sauvegarder la confidentialité
await updateDoc(artisanRef, {
  privacy: {
    profileVisible: true,
    showPhone: true,
    showEmail: false,
    allowDirectContact: true
  },
  updatedAt: new Date()
});
```

## 🎯 Valeurs par Défaut

### Notifications (toutes `true` sauf marketing)
- ✅ `emailLeads: true` - Important pour les nouvelles demandes
- ✅ `emailReviews: true` - Important pour les avis
- ❌ `emailMarketing: false` - Opt-in pour le marketing
- ✅ `pushNotifications: true` - Notifications temps réel

### Confidentialité (toutes `true` sauf email)
- ✅ `profileVisible: true` - Profil visible par défaut
- ✅ `showPhone: true` - Téléphone visible pour contact
- ❌ `showEmail: false` - Email privé par défaut
- ✅ `allowDirectContact: true` - Contact direct autorisé

## 🔧 Maintenance

### Ajouter une nouvelle préférence

1. **Mettre à jour le schéma** dans `SHEMA_FIRESTORE.md`
2. **Modifier les interfaces** dans `lib/artisan-preferences.ts`
3. **Ajouter la valeur par défaut** dans les constantes
4. **Créer un script de migration** si nécessaire
5. **Mettre à jour l'interface utilisateur**

### Exemple d'ajout d'une nouvelle préférence :

```typescript
// Dans lib/artisan-preferences.ts
export const defaultNotifications = {
  emailLeads: true,
  emailReviews: true,
  emailMarketing: false,
  pushNotifications: true,
  smsNotifications: false  // ← Nouvelle préférence
};
```

## 🚨 Points d'Attention

1. **Migration unique** : Le script de migration ne doit être exécuté qu'une seule fois
2. **Backup recommandé** : Sauvegardez votre base avant la migration
3. **Valeurs par défaut** : Respectez les valeurs par défaut définies
4. **Compatibilité** : Le code gère automatiquement les anciens documents sans ces champs

## 📊 Impact sur l'Application

### Pages affectées :
- ✅ `/dashboard/parametres` - Interface de gestion
- ✅ Composant `FicheEntreprise` - Respect des préférences d'affichage
- 🔄 Système de notifications (à implémenter)
- 🔄 Recherche publique (filtrage selon `profileVisible`)

### Fonctionnalités à adapter :
1. **Affichage du téléphone** - Vérifier `privacy.showPhone`
2. **Affichage de l'email** - Vérifier `privacy.showEmail`
3. **Visibilité du profil** - Vérifier `privacy.profileVisible`
4. **Envoi d'emails** - Respecter `notifications.emailLeads` et `notifications.emailReviews`
