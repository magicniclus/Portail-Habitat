# 🚀 Guide de Déploiement

Guide complet pour déployer Portail Habitat en production.

## 📋 Table des matières

- [🏗️ Architecture](#️-architecture)
- [🌍 Environnements](#-environnements)
- [⚙️ Configuration](#️-configuration)
- [📦 Build et déploiement](#-build-et-déploiement)
- [🔒 Sécurité](#-sécurité)
- [📊 Monitoring](#-monitoring)
- [🔄 CI/CD](#-cicd)
- [🆘 Rollback](#-rollback)
- [📝 Checklist](#-checklist)

## 🏗️ Architecture

### Stack de production

- **Frontend** : Next.js (Vercel)
- **Base de données** : Firebase Firestore
- **Storage** : Firebase Storage
- **CDN** : Vercel Edge Network
- **DNS** : Cloudflare
- **Monitoring** : Vercel Analytics + Sentry

### Diagramme d'architecture

```
Internet → Cloudflare → Vercel → Next.js App
                                     ↓
                              Firebase Services
                              ├── Firestore
                              ├── Storage
                              └── Auth
```

## 🌍 Environnements

### Development
- **URL** : `http://localhost:3000`
- **Firebase** : Projet de dev
- **Stripe** : Mode test
- **Analytics** : Désactivé

### Staging
- **URL** : `https://staging.portail-habitat.fr`
- **Firebase** : Projet de staging
- **Stripe** : Mode test
- **Analytics** : Test

### Production
- **URL** : `https://portail-habitat.fr`
- **Firebase** : Projet de production
- **Stripe** : Mode live
- **Analytics** : Activé

## ⚙️ Configuration

### Variables d'environnement

#### Production
```env
# App
NEXT_PUBLIC_APP_URL=https://portail-habitat.fr
NODE_ENV=production

# Firebase Production
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=portail-habitat-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=portail-habitat-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=portail-habitat-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# Stripe Production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.abc123...
SENDGRID_FROM_EMAIL=noreply@portail-habitat.fr

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry
SENTRY_DSN=https://...
SENTRY_ORG=portail-habitat
SENTRY_PROJECT=frontend
```

### Configuration Firebase

#### Règles Firestore (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Artisans - lecture publique, écriture authentifiée
    match /artisans/{artisanId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     (request.auth.uid == artisanId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Users - accès restreint
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                           (request.auth.uid == userId || 
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Leads - accès contrôlé
    match /leads/{leadId} {
      allow read: if request.auth != null && 
                    (request.auth.uid == resource.data.artisanId || 
                     request.auth.uid == resource.data.userId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      request.auth.uid == resource.data.artisanId;
    }
    
    // Reviews - lecture publique
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                              (request.auth.uid == resource.data.userId ||
                               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

#### Règles Storage (Production)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Artisan files
    match /artisans/{artisanId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     (request.auth.uid == artisanId ||
                      firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // User files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📦 Build et déploiement

### Build local

```bash
# Installation des dépendances
npm ci

# Build de production
npm run build

# Test du build
npm start
```

### Déploiement Vercel

#### Via CLI
```bash
# Installation de Vercel CLI
npm i -g vercel

# Login
vercel login

# Déploiement
vercel --prod
```

#### Via Git (Recommandé)
1. Push sur la branche `main`
2. Vercel déploie automatiquement
3. Vérification des logs de déploiement

### Configuration Vercel

#### `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/artisan/:slug",
      "destination": "/artisans/:slug",
      "permanent": true
    }
  ]
}
```

## 🔒 Sécurité

### Headers de sécurité

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### Variables sensibles

- ✅ Utiliser les variables d'environnement Vercel
- ✅ Jamais de secrets dans le code
- ✅ Rotation régulière des clés API
- ✅ Accès limité aux variables de production

### Audit de sécurité

```bash
# Audit des dépendances
npm audit

# Fix automatique
npm audit fix

# Scan de sécurité
npm run security:scan
```

## 📊 Monitoring

### Métriques Vercel

- **Performance** : Core Web Vitals
- **Erreurs** : Taux d'erreur 4xx/5xx
- **Trafic** : Requêtes par seconde
- **Géographie** : Répartition du trafic

### Sentry (Erreurs)

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filtrer les erreurs non critiques
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError') {
        return null;
      }
    }
    return event;
  }
});
```

### Alertes

- **Erreur 5xx** : > 1% pendant 5 minutes
- **Latence** : > 2s pendant 5 minutes
- **Disponibilité** : < 99% pendant 1 minute

## 🔄 CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Hooks de déploiement

```bash
# Pre-deploy
npm run pre-deploy

# Post-deploy
npm run post-deploy
```

## 🆘 Rollback

### Rollback Vercel

```bash
# Lister les déploiements
vercel list

# Promouvoir un déploiement précédent
vercel promote <deployment-url>
```

### Rollback base de données

```bash
# Backup avant déploiement
npm run db:backup

# Restauration
npm run db:restore <backup-id>
```

## 📝 Checklist

### Pré-déploiement

- [ ] Tests passants
- [ ] Build réussi
- [ ] Variables d'environnement configurées
- [ ] Backup de la base de données
- [ ] Notification de l'équipe

### Post-déploiement

- [ ] Vérification des fonctionnalités critiques
- [ ] Monitoring des erreurs
- [ ] Performance acceptable
- [ ] SEO fonctionnel
- [ ] Paiements opérationnels

### Rollback si nécessaire

- [ ] Taux d'erreur > 5%
- [ ] Fonctionnalité critique cassée
- [ ] Performance dégradée > 50%
- [ ] Paiements non fonctionnels

---

## 🆘 Support

En cas de problème :

1. **Vérifier** les logs Vercel
2. **Consulter** Sentry pour les erreurs
3. **Contacter** l'équipe technique
4. **Documenter** l'incident

**Contact d'urgence** : dev@portail-habitat.fr

---

*Guide mis à jour le 12 décembre 2025*
