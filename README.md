# 🏠 Portail Habitat

Plateforme de mise en relation entre particuliers et artisans du bâtiment. Une solution complète pour trouver des professionnels qualifiés et gérer sa présence en ligne en tant qu'artisan.

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [🛠 Stack technique](#-stack-technique)
- [🚀 Installation](#-installation)
- [📁 Structure du projet](#-structure-du-projet)
- [🔧 Configuration](#-configuration)
- [💾 Base de données](#-base-de-données)
- [🎨 Interface utilisateur](#-interface-utilisateur)
- [🔐 Authentification](#-authentification)
- [💳 Système Premium](#-système-premium)
- [📱 Fonctionnalités](#-fonctionnalités)
- [🔍 SEO](#-seo)
- [📊 Analytics](#-analytics)
- [🚀 Déploiement](#-déploiement)
- [🧪 Tests](#-tests)
- [📚 Documentation API](#-documentation-api)

## 🎯 Vue d'ensemble

Portail Habitat est une plateforme B2B2C qui connecte les particuliers avec des artisans qualifiés. Elle offre :

- **Pour les particuliers** : Recherche d'artisans, consultation de profils, demande de devis
- **Pour les artisans** : Gestion de profil, réception de leads, outils premium
- **Pour les admins** : Gestion des utilisateurs, modération, analytics

### Objectifs business
- Faciliter la mise en relation artisan/client
- Valoriser les artisans avec des outils premium
- Générer des revenus via les abonnements premium

## 🛠 Stack technique

### Frontend
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **État** : React Hooks + Context API
- **Images** : Next/Image avec optimisation

### Backend
- **Runtime** : Node.js (serverless)
- **API** : Next.js API Routes
- **Base de données** : Firebase Firestore
- **Authentification** : Firebase Auth
- **Storage** : Firebase Storage
- **Email** : SendGrid

### Services externes
- **Géolocalisation** : Mapbox API
- **Paiements** : Stripe
- **Analytics** : Google Analytics 4
- **Monitoring** : Vercel Analytics

### Outils de développement
- **Linting** : ESLint + Prettier
- **Types** : TypeScript strict
- **Git** : Conventional Commits
- **CI/CD** : Vercel

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm/yarn/pnpm
- Compte Firebase
- Compte Vercel (optionnel)

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/magicniclus/Portail-Habitat.git
cd Portail-Habitat

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Configurer les variables (voir section Configuration)
# Puis lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
portailhabitat/
├── app/                          # App Router Next.js 14
│   ├── (auth)/                   # Routes d'authentification
│   ├── admin/                    # Interface d'administration
│   ├── artisans/                 # Pages publiques artisans
│   ├── dashboard/                # Dashboard artisan
│   ├── api/                      # API Routes
│   └── globals.css               # Styles globaux
├── components/                   # Composants React réutilisables
│   ├── ui/                       # Composants shadcn/ui
│   ├── admin/                    # Composants admin
│   └── forms/                    # Formulaires
├── lib/                          # Utilitaires et configuration
│   ├── firebase.ts               # Configuration Firebase
│   ├── stripe.ts                 # Configuration Stripe
│   └── utils.ts                  # Utilitaires généraux
├── hooks/                        # Custom React Hooks
├── types/                        # Définitions TypeScript
├── public/                       # Assets statiques
└── .windsurf/                    # Documentation technique
    ├── SCHEMA_FIRESTORE.md       # Schéma base de données
    └── STORAGE.md                # Structure Firebase Storage
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` avec :

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# App
NEXT_PUBLIC_APP_URL=https://portail-habitat.fr
```

### Configuration Firebase

1. Créer un projet Firebase
2. Activer Authentication (Email/Password)
3. Créer une base Firestore
4. Configurer Storage
5. Ajouter les règles de sécurité (voir `.windsurf/SCHEMA_FIRESTORE.md`)

## 💾 Base de données

### Structure Firestore

La base de données utilise les collections principales :

- **`artisans`** : Profils des artisans
- **`users`** : Utilisateurs particuliers  
- **`leads`** : Demandes de devis
- **`reviews`** : Avis clients
- **`posts`** : Publications sur le mur chantier

Voir le schéma détaillé dans `.windsurf/SCHEMA_FIRESTORE.md`

### Règles de sécurité

```javascript
// Exemple de règle Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artisans/{artisanId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == artisanId;
    }
  }
}
```

## 🎨 Interface utilisateur

### Design System

- **Composants** : shadcn/ui (Radix UI + Tailwind)
- **Couleurs** : Orange (primary), Gris (neutral)
- **Typographie** : Geist Sans
- **Icônes** : Lucide React
- **Responsive** : Mobile-first

### Composants clés

- `TopArtisanBadge` : Badge premium avec couronne
- `BannerVideoManager` : Gestion vidéos premium
- `SequentialBannerManager` : Carrousel photos premium
- `PremiumSwitch` : Toggle fonctionnalités premium

### Thème

```css
:root {
  --primary: 24 100% 50%;        /* Orange */
  --secondary: 210 40% 98%;      /* Gris clair */
  --accent: 210 40% 96%;         /* Gris accent */
  --destructive: 0 84% 60%;      /* Rouge */
  --success: 142 76% 36%;        /* Vert */
}
```

## 🔐 Authentification

### Firebase Auth

- **Méthodes** : Email/Password
- **Rôles** : `artisan`, `user`, `admin`
- **Protection** : Middleware Next.js
- **Sessions** : Cookies sécurisés

### Gestion des rôles

```typescript
// Vérification du rôle
const isArtisan = user?.role === 'artisan';
const isAdmin = user?.role === 'admin';
```

## 💳 Système Premium

### Fonctionnalités Premium

- **Bannières multiples** : Jusqu'à 5 photos
- **Vidéo de présentation** : Upload vidéo MP4/WebM
- **Badge Top Artisan** : Mise en avant
- **Priorité d'affichage** : Algorithme de tri

### Types d'abonnements

- **Mensuel** : 29€/mois
- **Annuel** : 299€/an (-15%)
- **Lifetime** : 999€ (une fois)

### Intégration Stripe

```typescript
// Création d'un abonnement
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});
```

## 📱 Fonctionnalités

### Pour les particuliers

- **Recherche d'artisans** : Par ville, métier, distance
- **Consultation de profils** : Photos, avis, certifications
- **Demande de devis** : Formulaire intelligent
- **Suivi des demandes** : Dashboard personnel

### Pour les artisans

- **Gestion de profil** : Informations, photos, services
- **Réception de leads** : Notifications temps réel
- **Outils premium** : Bannières, vidéos, badges
- **Analytics** : Statistiques de performance

### Pour les admins

- **Gestion des utilisateurs** : CRUD complet
- **Modération** : Validation des contenus
- **Analytics** : Métriques business
- **Configuration premium** : Activation/désactivation

## 🔍 SEO

### Optimisations

- **Métadonnées dynamiques** : Title, description, OG
- **Sitemap automatique** : Génération via Cloud Functions
- **URLs optimisées** : Slugs SEO-friendly
- **Schema.org** : Données structurées
- **Performance** : Core Web Vitals optimisés

### Exemple de métadonnées

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const artisan = await getArtisan(params.slug);
  
  return {
    title: `${artisan.firstName} ${artisan.lastName} - ${artisan.profession} à ${artisan.city}`,
    description: `Découvrez ${artisan.firstName}, ${artisan.profession.toLowerCase()} à ${artisan.city}. Consultez ses réalisations et demandez un devis gratuit.`,
    openGraph: {
      title: `${artisan.companyName} - ${artisan.profession}`,
      description: artisan.description,
      images: [artisan.coverUrl],
    },
  };
}
```

## 📊 Analytics

### Métriques trackées

- **Trafic** : Pages vues, sessions, utilisateurs
- **Conversions** : Inscriptions, abonnements premium
- **Engagement** : Temps sur site, taux de rebond
- **Business** : Leads générés, revenus

### Outils utilisés

- **Google Analytics 4** : Analyse comportementale
- **Vercel Analytics** : Performance technique
- **Stripe Dashboard** : Métriques financières

## 🚀 Déploiement

### Environnements

- **Development** : `localhost:3000`
- **Staging** : `staging.portail-habitat.fr`
- **Production** : `portail-habitat.fr`

### Pipeline CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@v1
```

### Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Tests passants
- [ ] Build réussi
- [ ] DNS configuré
- [ ] SSL activé

## 🧪 Tests

### Stratégie de test

- **Unit tests** : Jest + React Testing Library
- **Integration tests** : API Routes
- **E2E tests** : Playwright (à venir)

### Commandes

```bash
# Tests unitaires
npm run test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 📚 Documentation API

### Endpoints principaux

#### Artisans
- `GET /api/artisans` : Liste des artisans
- `GET /api/artisans/[id]` : Détail artisan
- `PUT /api/artisans/[id]` : Mise à jour profil
- `POST /api/artisans/[id]/premium` : Activation premium

#### Leads
- `POST /api/leads` : Création d'un lead
- `GET /api/leads/[artisanId]` : Leads d'un artisan
- `PUT /api/leads/[id]` : Mise à jour statut

#### Webhooks
- `POST /api/webhooks/stripe` : Événements Stripe
- `POST /api/webhooks/sendgrid` : Événements email

### Authentification API

```typescript
// Middleware d'authentification
export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = await verifyToken(token);
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  return user;
}
```

---

## 🤝 Contribution

### Workflow Git

1. Fork du repository
2. Création d'une branche feature
3. Commits avec convention
4. Pull request avec description
5. Review et merge

### Standards de code

- **TypeScript strict** : Pas de `any`
- **ESLint + Prettier** : Formatage automatique
- **Conventional Commits** : Messages standardisés
- **Tests** : Coverage > 80%

### Contact

- **Email** : dev@portail-habitat.fr
- **Discord** : [Lien d'invitation]
- **Issues** : GitHub Issues

---

*Documentation mise à jour le 12 décembre 2025*
