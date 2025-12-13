# 🎨 Guide des Composants - Portail Habitat

Documentation détaillée de tous les composants UI et leur utilisation.

## 📋 Table des matières

- [🏷️ Composants de badge](#️-composants-de-badge)
- [📋 Composants de formulaire](#-composants-de-formulaire)
- [🖼️ Composants média](#️-composants-média)
- [📊 Composants de données](#-composants-de-données)
- [🎯 Composants métier](#-composants-métier)
- [🔧 Composants utilitaires](#-composants-utilitaires)

## 🏷️ Composants de badge

### TopArtisanBadge

Badge premium pour identifier les artisans "Top Artisan" avec icône couronne.

```typescript
interface TopArtisanBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}
```

**Utilisation :**

```tsx
// Badge complet avec texte
<TopArtisanBadge size="md" variant="default" />

// Badge compact pour les espaces restreints
<TopArtisanBadge size="sm" variant="compact" />

// Badge large pour les headers
<TopArtisanBadge size="lg" variant="default" className="shadow-lg" />
```

**Styles appliqués :**
- **Couleur** : Fond jaune (`bg-yellow-500`), texte blanc
- **Icône** : Couronne (`Crown` de Lucide)
- **Positionnement** : Absolu avec `z-20` pour superposition

**Cas d'usage :**
- En haut à droite des bannières d'artisan
- Dans les listes d'artisans
- Sur les cartes de profil

### StatusBadge

Badge générique pour afficher des statuts avec couleurs sémantiques.

```typescript
interface StatusBadgeProps {
  status: 'active' | 'pending' | 'inactive' | 'premium' | 'standard';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Utilisation :**

```tsx
<StatusBadge status="premium" size="md" />
<StatusBadge status="pending" size="sm" />
<StatusBadge status="active" size="lg" />
```

## 📋 Composants de formulaire

### LeadForm

Formulaire de demande de devis avec validation complète.

```typescript
interface LeadFormProps {
  artisanId: string;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<LeadFormData>;
}
```

**Utilisation :**

```tsx
function ContactArtisan({ artisan }) {
  const handleSubmit = async (data: LeadFormData) => {
    try {
      await createLead(data);
      toast({ title: 'Demande envoyée avec succès', variant: 'success' });
    } catch (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <LeadForm
      artisanId={artisan.id}
      onSubmit={handleSubmit}
      initialData={{ projectType: 'renovation' }}
    />
  );
}
```

**Champs du formulaire :**
- Type de projet (select)
- Description (textarea, 10-1000 caractères)
- Budget estimé (select avec tranches)
- Délai souhaité (select)
- Informations de contact (prénom, nom, email, téléphone, adresse)

**Validation :**
- Schéma Zod intégré
- Validation en temps réel
- Messages d'erreur contextuels

### ArtisanProfileForm

Formulaire d'édition du profil artisan avec upload d'images.

```typescript
interface ArtisanProfileFormProps {
  artisan: Artisan;
  onUpdate: (data: Partial<Artisan>) => Promise<void>;
  canEdit: boolean;
}
```

**Sections du formulaire :**
1. **Informations générales** : Nom, prénom, entreprise
2. **Contact** : Email, téléphone, adresse
3. **Professionnel** : Métiers, services, description
4. **Médias** : Logo, photos de couverture, galerie
5. **Premium** : Fonctionnalités avancées

## 🖼️ Composants média

### BannerVideoManager

Gestionnaire de vidéo de présentation pour les artisans premium.

```typescript
interface BannerVideoManagerProps {
  entreprise: Artisan;
  canEdit: boolean;
  onUpdate?: (data: Partial<Artisan>) => void;
}
```

**Fonctionnalités :**
- Upload de vidéo (MP4, WebM, OGG)
- Validation de taille (max 50MB)
- Lecteur vidéo HTML5 avec contrôles
- Suppression avec confirmation
- États de chargement avec overlay

**Utilisation :**

```tsx
// Dans le dashboard (éditable)
<BannerVideoManager
  entreprise={artisan}
  canEdit={true}
  onUpdate={handleArtisanUpdate}
/>

// Dans la vue publique (lecture seule)
{artisan.premiumFeatures?.bannerVideo && (
  <BannerVideoManager
    entreprise={artisan}
    canEdit={false}
  />
)}
```

### SequentialBannerManager

Gestionnaire de carrousel d'images pour les bannières premium.

```typescript
interface SequentialBannerManagerProps {
  entreprise: Artisan;
  className?: string;
  canEdit: boolean;
  onUpdate: (data: Partial<Artisan>) => void;
}
```

**Fonctionnalités :**
- Upload multiple d'images
- Réorganisation par drag & drop
- Suppression individuelle
- Carrousel automatique
- Indicateurs de navigation

### StandardBannerManager

Gestionnaire d'image unique pour les bannières standard.

```typescript
interface StandardBannerManagerProps {
  entreprise: Artisan;
  className?: string;
  canEdit: boolean;
  onUpdate: (data: Partial<Artisan>) => void;
  onCoverChange?: (url: string) => void;
}
```

## 📊 Composants de données

### ArtisanCard

Carte d'artisan pour les listes et grilles.

```typescript
interface ArtisanCardProps {
  artisan: Artisan;
  showDistance?: boolean;
  userLocation?: { lat: number; lng: number };
  onClick?: (artisan: Artisan) => void;
}
```

**Éléments affichés :**
- Image de couverture avec badge Top Artisan
- Logo d'entreprise avec couronne premium
- Nom d'entreprise et métier
- Note moyenne et nombre d'avis
- Ville et distance (si géolocalisation)
- Services principaux

**Utilisation :**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {artisans.map(artisan => (
    <ArtisanCard
      key={artisan.id}
      artisan={artisan}
      showDistance={true}
      userLocation={userLocation}
      onClick={handleArtisanClick}
    />
  ))}
</div>
```

### ArtisanTable

Tableau d'artisans pour l'administration.

```typescript
interface ArtisanTableProps {
  artisans: Artisan[];
  onEdit?: (artisan: Artisan) => void;
  onDelete?: (artisanId: string) => void;
  onTogglePremium?: (artisanId: string, isPremium: boolean) => void;
}
```

**Colonnes :**
- Photo de profil
- Nom/Entreprise
- Métier
- Ville
- Statut premium
- Date d'inscription
- Actions (éditer, supprimer, premium)

### ReviewsList

Liste d'avis clients avec pagination.

```typescript
interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}
```

## 🎯 Composants métier

### FicheEntreprise

Composant principal pour l'affichage/édition du profil artisan (dashboard).

```typescript
interface FicheEntrepriseProps {
  entreprise: Artisan;
  canEdit: boolean;
  onEntrepriseUpdate: (data: Partial<Artisan>) => void;
  onCoverChange?: (url: string) => void;
  isPreview?: boolean;
}
```

**Sections :**
1. **Bannière** : Images/vidéo avec badge Top Artisan
2. **Profil** : Logo, nom, métiers, description
3. **Services** : Liste des prestations
4. **Galerie** : Photos de réalisations
5. **Certifications** : Diplômes et qualifications
6. **Zone d'intervention** : Carte interactive
7. **Avis** : Commentaires clients
8. **Contact** : Formulaire de demande

### FicheEntreprisePublic

Version publique du profil artisan (vue client).

```typescript
interface FicheEntreprisePublicProps {
  entreprise: Artisan;
  isPreview?: boolean;
  projects?: Project[];
  reviews?: Review[];
}
```

**Différences avec la version dashboard :**
- Mode lecture seule
- Formulaire de contact actif
- Tracking des vues et interactions
- Exclusion du propriétaire du tracking
- Boutons de partage social

### MarketplaceBoard

Interface de la bourse au travail pour les artisans.

```typescript
interface MarketplaceBoardProps {
  artisan: Artisan;
  onPurchase: (leadId: string) => void;
}
```

**Fonctionnalités :**
- Affichage des leads disponibles
- Filtrage par métiers de l'artisan
- Informations partielles avant achat
- Système de paiement Stripe intégré
- Historique des achats

## 🔧 Composants utilitaires

### LoadingSpinner

Composant de chargement uniforme avec Loader2.

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}
```

**Utilisation :**

```tsx
// Spinner simple
<LoadingSpinner size="md" />

// Avec texte
<LoadingSpinner size="lg" text="Chargement des artisans..." />

// Page complète
<div className="min-h-screen flex items-center justify-center">
  <LoadingSpinner size="lg" text="Chargement..." />
</div>
```

### ErrorBoundary

Composant de gestion d'erreurs React.

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}
```

**Utilisation :**

```tsx
<ErrorBoundary fallback={CustomErrorComponent}>
  <ArtisanProfile artisan={artisan} />
</ErrorBoundary>
```

### SEOHead

Composant pour les métadonnées SEO.

```typescript
interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}
```

**Utilisation :**

```tsx
<SEOHead
  title="Nicolas Castera - Teras Bois - Charpentier à Bordeaux | Portail Habitat"
  description="Découvrez Nicolas Castera, charpentier chez Teras Bois à Bordeaux. Consultez ses réalisations, avis clients et demandez un devis gratuit."
  canonical={`https://portail-habitat.fr/artisan/${artisan.slug}`}
  ogImage={artisan.coverUrl}
/>
```

## 🎨 Conventions de style

### Classes CSS communes

```css
/* Conteneurs */
.container-page { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }
.container-section { @apply max-w-4xl mx-auto; }

/* Cartes */
.card-base { @apply bg-white rounded-lg shadow-md border border-gray-200; }
.card-hover { @apply hover:shadow-lg transition-shadow duration-300; }

/* Badges */
.badge-premium { @apply bg-yellow-500 text-white border-yellow-400; }
.badge-status { @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium; }

/* Boutons */
.btn-primary { @apply bg-orange-500 hover:bg-orange-600 text-white; }
.btn-secondary { @apply bg-gray-100 hover:bg-gray-200 text-gray-900; }

/* États de chargement */
.loading-overlay { @apply absolute inset-0 bg-black/50 flex items-center justify-center; }
.skeleton-base { @apply animate-pulse bg-gray-300 rounded; }
```

### Responsive design

```css
/* Breakpoints Tailwind */
sm: 640px   /* Mobile large */
md: 768px   /* Tablette */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop large */
2xl: 1536px /* Desktop XL */

/* Grilles responsives */
.grid-responsive { 
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6; 
}

/* Espacement responsive */
.spacing-responsive { 
  @apply px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16; 
}
```

---

*Guide des composants mis à jour le 13 décembre 2025*
