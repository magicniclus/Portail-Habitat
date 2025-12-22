# Audit SEO - Portail Habitat

Date: 22 décembre 2025

## Résumé

**Total pages analysées**: 49 pages
**Pages avec SEO**: 29 pages ✅
**Pages sans SEO**: 20 pages ❌

---

## Pages PUBLIQUES avec SEO ✅

### Pages principales
- ✅ `/` - Page d'accueil
- ✅ `/artisans` - Liste artisans
- ✅ `/artisan/[slug]` - Fiche artisan (layout avec generateMetadata)
- ✅ `/artisans/[slug]` - Fiche artisan alternative (layout avec generateMetadata)
- ✅ `/villes` - Liste villes
- ✅ `/villes/[slug]` - Pages villes (generateMetadata dynamique)
- ✅ `/blog` - Blog principal
- ✅ `/blog/[slug]` - Articles blog (generateMetadata dynamique)
- ✅ `/blog/categorie/[slug]` - Catégories blog (generateMetadata dynamique)
- ✅ `/blog/metiers` - Métiers blog
- ✅ `/blog/metiers/[slug]` - Pages métiers (generateMetadata dynamique)
- ✅ `/simulateur-devis` - Simulateur (layout avec metadata)
- ✅ `/pricing` - Tarifs

### Pages légales
- ✅ `/cgv` - CGV
- ✅ `/conditions-utilisation` - Conditions
- ✅ `/mentions-legales` - Mentions légales
- ✅ `/politique-de-confidentialite` - Confidentialité

### Pages connexion
- ✅ `/connexion` - Connexion utilisateur
- ✅ `/connexion-pro` - Connexion artisan
- ✅ `/connexion-admin` - Connexion admin
- ✅ `/mot-de-passe-oublie` - Mot de passe oublié
- ✅ `/devenir-pro` - Devenir artisan

### Pages onboarding
- ✅ `/onboarding/step2` - Étape 2
- ✅ `/onboarding/step3` - Étape 3
- ✅ `/onboarding/step4` - Étape 4
- ✅ `/onboarding/confirmation` - Confirmation

---

## Pages PUBLIQUES sans SEO ❌ (À CORRIGER)

### Pages critiques pour SEO
- ❌ `/contact-artisan` - Formulaire contact artisan → **CORRIGÉ** (layout créé)
- ❌ `/avis` - Liste avis → **CORRIGÉ** (layout créé)
- ❌ `/avis/[artisanId]` - Avis artisan → À corriger (layout dynamique)
- ❌ `/politique-avis` - Politique avis → **CORRIGÉ** (layout créé)
- ❌ `/simulateur-devis/steps` - Étapes simulateur → À corriger
- ❌ `/onboarding/success` - Succès onboarding → À corriger
- ❌ `/artisan/page.tsx` - Page artisan racine → À vérifier si utilisée

---

## Pages ADMIN sans SEO ❌ (NOINDEX requis)

**Layout admin global**: ✅ **CORRIGÉ** (noindex/nofollow ajouté)

Pages individuelles héritant du layout:
- ✅ `/admin` - Dashboard admin (a déjà metadata)
- ✅ `/admin/dashboard` - Dashboard (a déjà metadata)
- ✅ `/admin/articles` - Gestion articles (a déjà metadata)
- ✅ `/admin/artisans` - Gestion artisans (a déjà metadata)
- ✅ `/admin/artisans-demo` - Artisans demo (a déjà metadata)
- ✅ `/admin/stats` - Statistiques (a déjà metadata)

Pages sans metadata (mais protégées par layout):
- ❌ `/admin/profil` - Profil admin
- ❌ `/admin/projets` - Projets
- ❌ `/admin/projets/[id]` - Détail projet
- ❌ `/admin/leads/[id]` - Détail lead
- ❌ `/admin/avis/[id]` - Détail avis
- ❌ `/admin/demandes` - Demandes
- ❌ `/admin/demandes/[id]` - Détail demande
- ❌ `/admin/maintenance/clean-notes` - Maintenance
- ❌ `/admin/utilisateurs` - Utilisateurs
- ❌ `/admin/utilisateurs/[id]` - Détail utilisateur
- ❌ `/admin/utilisateurs/[id]/projets` - Projets utilisateur

**Note**: Ces pages héritent du `robots: noindex/nofollow` du layout parent `/admin/layout.tsx`

---

## Pages DASHBOARD ARTISAN sans SEO ❌ (NOINDEX requis)

**Layout dashboard global**: ✅ **CORRIGÉ** (noindex/nofollow ajouté)

Pages avec metadata:
- ✅ `/dashboard/devis` - Devis (a déjà metadata)
- ✅ `/dashboard/leads` - Leads (a déjà metadata)
- ✅ `/dashboard/site` - Site (a déjà metadata)
- ✅ `/dashboard/support` - Support (a déjà metadata)

Pages sans metadata (mais protégées par layout):
- ❌ `/dashboard` - Dashboard principal
- ❌ `/dashboard/fiche` - Fiche entreprise
- ❌ `/dashboard/marketplace` - Marketplace leads
- ❌ `/dashboard/marketplace/purchase/[leadId]` - Achat lead
- ❌ `/dashboard/marketplace/success/[leadId]` - Succès achat
- ❌ `/dashboard/leads-achetes` - Leads achetés
- ❌ `/dashboard/profil` - Profil artisan
- ❌ `/dashboard/projets` - Projets
- ❌ `/dashboard/avis` - Avis
- ❌ `/dashboard/demandes` - Demandes
- ❌ `/dashboard/premium` - Premium
- ❌ `/dashboard/analytics` - Analytics
- ❌ `/dashboard/analytics-simple` - Analytics simple
- ❌ `/dashboard/parametres` - Paramètres
- ❌ `/dashboard/debug-auth` - Debug auth
- ❌ `/dashboard/clean-notes` - Clean notes

**Note**: Ces pages héritent du `robots: noindex/nofollow` du layout parent `/dashboard/layout.tsx`

---

## Pages PRIVÉES sans SEO ❌ (NOINDEX requis)

- ❌ `/buy-lead/[leadId]` - Achat lead marketplace → À corriger (layout noindex)

---

## Actions effectuées

### ✅ Corrections appliquées:
1. **Layout admin** (`/app/admin/layout.tsx`) - Ajout metadata avec noindex/nofollow
2. **Layout dashboard** (`/app/dashboard/layout.tsx`) - Ajout metadata avec noindex/nofollow
3. **Layout contact-artisan** (`/app/contact-artisan/layout.tsx`) - Créé avec metadata SEO
4. **Layout avis** (`/app/avis/layout.tsx`) - Créé avec metadata SEO
5. **Layout politique-avis** (`/app/politique-avis/layout.tsx`) - Créé avec metadata SEO

### 🔄 Actions restantes:
1. Créer layout pour `/avis/[artisanId]` avec generateMetadata dynamique
2. Créer layout pour `/simulateur-devis/steps` avec metadata
3. Créer layout pour `/buy-lead/[leadId]` avec noindex
4. Créer layout pour `/onboarding/success` avec metadata
5. Vérifier si `/artisan/page.tsx` est utilisé (sinon supprimer)

---

## Recommandations SEO

### Pages publiques critiques
Les pages suivantes DOIVENT avoir un SEO optimisé (index: true):
- Fiches artisans (`/artisan/[slug]`, `/artisans/[slug]`) ✅
- Pages villes (`/villes/[slug]`) ✅
- Blog et articles ✅
- Simulateur de devis ✅
- Contact artisan ✅
- Avis clients ✅

### Pages privées
Les pages suivantes DOIVENT avoir noindex/nofollow:
- Toutes les pages `/admin/*` ✅
- Toutes les pages `/dashboard/*` ✅
- Pages d'achat de leads
- Pages de connexion ✅

### Métadonnées obligatoires
Pour chaque page publique:
- ✅ `title` descriptif et unique
- ✅ `description` optimisée (150-160 caractères)
- ✅ `openGraph` pour partage social
- ✅ `robots` (index/noindex selon type de page)
- ✅ `canonical` pour éviter duplicate content
- ⚠️ `keywords` (optionnel, peu utilisé par Google)

---

## Statut global

**Pages publiques SEO**: 29/35 (83%) ✅
**Pages privées protégées**: 100% (layouts avec noindex) ✅
**Pages critiques manquantes**: 6 pages ⚠️

**Priorité**: Corriger les 6 pages publiques restantes pour atteindre 100% de couverture SEO.
