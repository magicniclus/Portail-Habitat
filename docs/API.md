# 📚 Documentation API

Documentation complète de l'API Portail Habitat.

## 📋 Table des matières

- [🔐 Authentification](#-authentification)
- [👥 Artisans](#-artisans)
- [📝 Leads](#-leads)
- [⭐ Reviews](#-reviews)
- [📊 Posts](#-posts)
- [💳 Paiements](#-paiements)
- [🔧 Admin](#-admin)
- [📨 Webhooks](#-webhooks)
- [❌ Gestion d'erreurs](#-gestion-derreurs)

## 🔐 Authentification

### Headers requis

```http
Authorization: Bearer <firebase-token>
Content-Type: application/json
```

### Obtenir un token

```javascript
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const { user } = await signInWithEmailAndPassword(auth, email, password);
const token = await user.getIdToken();
```

## 👥 Artisans

### GET /api/artisans

Récupère la liste des artisans avec filtres optionnels.

**Query Parameters:**
- `city` (string, optional) - Filtrer par ville
- `profession` (string, optional) - Filtrer par métier
- `premium` (boolean, optional) - Artisans premium uniquement
- `limit` (number, optional) - Nombre maximum de résultats (défaut: 20)
- `offset` (number, optional) - Décalage pour la pagination

**Response:**
```json
{
  "artisans": [
    {
      "id": "artisan123",
      "companyName": "Teras Bois",
      "firstName": "Nicolas",
      "lastName": "Castera",
      "email": "nicolas@terasbois.fr",
      "phone": "+33123456789",
      "city": "Bordeaux",
      "profession": "Charpentier",
      "professions": ["Charpentier", "Couvreur"],
      "description": "Spécialiste en charpente traditionnelle...",
      "logoUrl": "https://storage.googleapis.com/...",
      "coverUrl": "https://storage.googleapis.com/...",
      "averageRating": 4.8,
      "reviewCount": 23,
      "slug": "nicolas-castera-charpentier-bordeaux",
      "premiumFeatures": {
        "isPremium": true,
        "showTopArtisanBadge": true,
        "bannerPhotos": ["url1", "url2"],
        "bannerVideo": "video_url"
      }
    }
  ],
  "total": 150,
  "hasMore": true
}
```

### GET /api/artisans/[id]

Récupère les détails d'un artisan spécifique.

**Response:**
```json
{
  "id": "artisan123",
  "companyName": "Teras Bois",
  "firstName": "Nicolas",
  "lastName": "Castera",
  "email": "nicolas@terasbois.fr",
  "phone": "+33123456789",
  "city": "Bordeaux",
  "postalCode": "33000",
  "fullAddress": "123 Rue de la Paix, 33000 Bordeaux",
  "coordinates": {
    "lat": 44.8378,
    "lng": -0.5792
  },
  "profession": "Charpentier",
  "professions": ["Charpentier", "Couvreur"],
  "description": "Spécialiste en charpente traditionnelle...",
  "services": ["Charpente neuve", "Rénovation", "Isolation"],
  "logoUrl": "https://storage.googleapis.com/...",
  "coverUrl": "https://storage.googleapis.com/...",
  "photos": ["url1", "url2", "url3"],
  "averageRating": 4.8,
  "reviewCount": 23,
  "certifications": ["RGE", "Qualibat"],
  "averageQuoteMin": 5000,
  "averageQuoteMax": 15000,
  "premiumFeatures": {
    "isPremium": true,
    "premiumStartDate": "2024-01-01T00:00:00Z",
    "premiumEndDate": "2024-12-31T23:59:59Z",
    "premiumType": "yearly",
    "showTopArtisanBadge": true,
    "bannerPhotos": ["url1", "url2"],
    "bannerVideo": "video_url"
  }
}
```

### PUT /api/artisans/[id]

Met à jour le profil d'un artisan.

**Auth:** Requis (artisan propriétaire ou admin)

**Body:**
```json
{
  "companyName": "Nouveau nom",
  "description": "Nouvelle description",
  "services": ["Service 1", "Service 2"],
  "averageQuoteMin": 3000,
  "averageQuoteMax": 12000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès"
}
```

### POST /api/artisans/[id]/premium

Active ou configure les fonctionnalités premium.

**Auth:** Requis (admin uniquement)

**Body:**
```json
{
  "action": "activate",
  "premiumType": "yearly",
  "durationMonths": 12,
  "features": ["multiple_banners", "video_banner", "top_badge"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Premium activé avec succès",
  "premiumEndDate": "2024-12-31T23:59:59Z"
}
```

## 📝 Leads

### POST /api/leads

Crée une nouvelle demande de devis.

**Auth:** Requis

**Body:**
```json
{
  "artisanId": "artisan123",
  "projectType": "Rénovation toiture",
  "description": "Je souhaite rénover ma toiture de 100m²...",
  "budget": "10000-15000",
  "timeline": "Dans les 3 mois",
  "contactInfo": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@email.com",
    "phone": "+33123456789",
    "address": "456 Avenue de la République, 33000 Bordeaux"
  }
}
```

**Response:**
```json
{
  "success": true,
  "leadId": "lead456",
  "message": "Demande de devis envoyée avec succès"
}
```

### GET /api/leads/[artisanId]

Récupère les leads d'un artisan.

**Auth:** Requis (artisan propriétaire ou admin)

**Query Parameters:**
- `status` (string, optional) - Filtrer par statut (pending, contacted, quoted, accepted, rejected)
- `limit` (number, optional) - Nombre maximum de résultats
- `offset` (number, optional) - Décalage pour la pagination

**Response:**
```json
{
  "leads": [
    {
      "id": "lead456",
      "projectType": "Rénovation toiture",
      "description": "Je souhaite rénover ma toiture...",
      "budget": "10000-15000",
      "timeline": "Dans les 3 mois",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "contactInfo": {
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean.dupont@email.com",
        "phone": "+33123456789",
        "address": "456 Avenue de la République, 33000 Bordeaux"
      }
    }
  ],
  "total": 15,
  "hasMore": false
}
```

### PUT /api/leads/[id]

Met à jour le statut d'un lead.

**Auth:** Requis (artisan propriétaire ou admin)

**Body:**
```json
{
  "status": "contacted",
  "notes": "Client contacté par téléphone"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead mis à jour avec succès"
}
```

## ⭐ Reviews

### GET /api/reviews/[artisanId]

Récupère les avis d'un artisan.

**Query Parameters:**
- `limit` (number, optional) - Nombre maximum de résultats
- `offset` (number, optional) - Décalage pour la pagination

**Response:**
```json
{
  "reviews": [
    {
      "id": "review789",
      "rating": 5,
      "comment": "Excellent travail, très professionnel",
      "projectType": "Rénovation toiture",
      "createdAt": "2024-01-10T14:20:00Z",
      "user": {
        "firstName": "Marie",
        "lastName": "D.",
        "city": "Bordeaux"
      }
    }
  ],
  "averageRating": 4.8,
  "total": 23
}
```

### POST /api/reviews

Crée un nouvel avis.

**Auth:** Requis

**Body:**
```json
{
  "artisanId": "artisan123",
  "rating": 5,
  "comment": "Excellent travail, très professionnel",
  "projectType": "Rénovation toiture"
}
```

**Response:**
```json
{
  "success": true,
  "reviewId": "review789",
  "message": "Avis ajouté avec succès"
}
```

## 📊 Posts

### GET /api/posts

Récupère les posts du mur chantier.

**Query Parameters:**
- `artisanId` (string, optional) - Filtrer par artisan
- `city` (string, optional) - Filtrer par ville
- `profession` (string, optional) - Filtrer par métier
- `limit` (number, optional) - Nombre maximum de résultats
- `offset` (number, optional) - Décalage pour la pagination

**Response:**
```json
{
  "posts": [
    {
      "id": "post123",
      "title": "Rénovation complète d'une maison bordelaise",
      "description": "Découvrez cette magnifique rénovation...",
      "images": ["url1", "url2", "url3"],
      "projectType": "Rénovation",
      "duration": "3 mois",
      "budget": "50000-75000",
      "createdAt": "2024-01-05T09:15:00Z",
      "artisan": {
        "id": "artisan123",
        "companyName": "Teras Bois",
        "firstName": "Nicolas",
        "lastName": "Castera",
        "city": "Bordeaux",
        "profession": "Charpentier"
      }
    }
  ],
  "total": 45,
  "hasMore": true
}
```

### POST /api/posts

Crée un nouveau post.

**Auth:** Requis (artisan)

**Body:**
```json
{
  "title": "Rénovation complète d'une maison bordelaise",
  "description": "Découvrez cette magnifique rénovation...",
  "images": ["url1", "url2", "url3"],
  "projectType": "Rénovation",
  "duration": "3 mois",
  "budget": "50000-75000",
  "isPublished": true
}
```

**Response:**
```json
{
  "success": true,
  "postId": "post123",
  "message": "Post créé avec succès"
}
```

## 💳 Paiements

### POST /api/payments/create-subscription

Crée un abonnement Stripe.

**Auth:** Requis (artisan)

**Body:**
```json
{
  "priceId": "price_1234567890",
  "premiumType": "yearly"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_abcdef",
  "subscriptionId": "sub_1234567890"
}
```

### POST /api/payments/cancel-subscription

Annule un abonnement.

**Auth:** Requis (artisan propriétaire ou admin)

**Body:**
```json
{
  "subscriptionId": "sub_1234567890",
  "reason": "Plus besoin du service"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Abonnement annulé avec succès"
}
```

## 🔧 Admin

### GET /api/admin/stats

Récupère les statistiques globales.

**Auth:** Requis (admin uniquement)

**Response:**
```json
{
  "users": {
    "total": 1250,
    "artisans": 450,
    "clients": 800,
    "newThisMonth": 85
  },
  "leads": {
    "total": 2340,
    "thisMonth": 234,
    "conversionRate": 0.68
  },
  "revenue": {
    "thisMonth": 12450,
    "lastMonth": 11230,
    "growth": 0.109
  },
  "premium": {
    "activeSubscriptions": 89,
    "churnRate": 0.05
  }
}
```

### GET /api/admin/artisans

Liste tous les artisans pour l'administration.

**Auth:** Requis (admin uniquement)

**Query Parameters:**
- `search` (string, optional) - Recherche par nom/email
- `status` (string, optional) - Filtrer par statut (active, inactive, premium)
- `limit` (number, optional) - Nombre maximum de résultats
- `offset` (number, optional) - Décalage pour la pagination

**Response:**
```json
{
  "artisans": [
    {
      "id": "artisan123",
      "companyName": "Teras Bois",
      "firstName": "Nicolas",
      "lastName": "Castera",
      "email": "nicolas@terasbois.fr",
      "city": "Bordeaux",
      "profession": "Charpentier",
      "status": "active",
      "isPremium": true,
      "subscriptionStatus": "active",
      "leadCount": 15,
      "lastActivity": "2024-01-15T10:30:00Z",
      "createdAt": "2023-06-15T08:00:00Z"
    }
  ],
  "total": 450,
  "hasMore": true
}
```

## 📨 Webhooks

### POST /api/webhooks/stripe

Webhook pour les événements Stripe.

**Headers:**
```http
Stripe-Signature: t=1234567890,v1=abcdef...
```

**Events supportés:**
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### POST /api/webhooks/sendgrid

Webhook pour les événements SendGrid.

**Headers:**
```http
Authorization: Bearer <webhook-token>
```

**Events supportés:**
- `delivered`
- `opened`
- `clicked`
- `bounce`
- `spam_report`

## ❌ Gestion d'erreurs

### Codes d'erreur

- `400` - Bad Request (données invalides)
- `401` - Unauthorized (non authentifié)
- `403` - Forbidden (pas les permissions)
- `404` - Not Found (ressource introuvable)
- `409` - Conflict (conflit de données)
- `429` - Too Many Requests (limite de taux)
- `500` - Internal Server Error (erreur serveur)

### Format des erreurs

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies sont invalides",
    "details": {
      "field": "email",
      "reason": "Format d'email invalide"
    }
  }
}
```

### Codes d'erreur personnalisés

- `ARTISAN_NOT_FOUND` - Artisan introuvable
- `LEAD_ALREADY_EXISTS` - Lead déjà existant
- `PREMIUM_REQUIRED` - Fonctionnalité premium requise
- `SUBSCRIPTION_INACTIVE` - Abonnement inactif
- `QUOTA_EXCEEDED` - Quota dépassé
- `INVALID_CREDENTIALS` - Identifiants invalides

---

## 📞 Support

Pour toute question sur l'API :

- **Documentation** : [docs.portail-habitat.fr](https://docs.portail-habitat.fr)
- **Email** : api@portail-habitat.fr
- **Discord** : [Lien d'invitation]

---

*Documentation mise à jour le 12 décembre 2025*
