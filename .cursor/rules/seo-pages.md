---
description: Règles obligatoires pour toutes les pages SEO publiques de Portail Habitat (/[metier], /[metier]/[localite])
globs: ["app/[metier]/**", "components/seo/**", "lib/seo-utils.ts", "lib/villes-utils.ts", "app/sitemap.ts", "app/robots.ts"]
alwaysApply: false
---

# Règles SEO — Portail Habitat

Ces règles sont PRIORITAIRES sur toutes les autres pour les fichiers couverts par ce ruleset.

---

## 1. Slugs

- Tous les slugs de métiers proviennent EXCLUSIVEMENT de `lib/metiers.ts` (tableau `METIERS`, champ `slug`).
- Tous les slugs de villes/départements proviennent EXCLUSIVEMENT de la collection Firestore `villes` (champ `slug`).
- Un slug est en minuscules, sans accents, avec des tirets. Exemple : `plombier`, `seine-saint-denis`, `saint-medard-en-jalles-33`.
- **Jamais** de slug construit à la volée depuis du texte libre ou d'un `toLowerCase().replace()` sur un nom.
- Un slug **ne change jamais** après sa première publication. Si renommage nécessaire → 301 vers le nouveau slug, l'ancien reste.

## 2. Une seule page par intention de recherche

- Les synonymes d'un métier (ex. "placo", "placoiste") vivent **dans** la page officielle (intro, H2 dédié, FAQ), jamais en pages séparées.
- Deux villes homonymes dans des départements différents reçoivent des slugs distincts suffixés du code département (ex. `saint-medard-33`).
- Pas de page en double pour le même (métier × localité).

## 3. Pages sans artisan actif

- Une page avec `nb_artisans = 0` reçoit `<meta name="robots" content="noindex,follow">` et est exclue du sitemap.
- Elle **n'est jamais supprimée** de Firestore (préserve le contenu IA et l'historique).
- Dès qu'un artisan est rattaché → `nb_artisans` repasse à ≥ 1 → statut `"publiee"` → la page réintègre le sitemap au prochain build ISR.

## 4. Template unique obligatoire

- Toute page SEO passe par `components/seo/SeoPageLayout.tsx`.
- **Interdit** de créer du markup de page SEO en dehors des composants `components/seo/`.
- Corriger un bloc (`BlocFaq`, `ListeArtisans`, etc.) propage la correction à toutes les pages.
- Aucun `"use client"` dans les composants `components/seo/` sauf pour le `FormulaireDevisBloc` qui wrappe un composant interactif existant.

## 5. Formats title / meta / H1 exacts

### Page métier × ville
```
<title>  : "{Metier} à {Ville} : {N} artisan{s} vérifié{s} — Devis gratuit | Portail Habitat"
           (tronqué proprement à ~60 caractères si dépassement)
<meta description> : "Trouvez un {metier} à {Ville} parmi {N} professionnel{s} au SIRET vérifié. Avis clients, devis gratuit et sans engagement."
H1 : "{Metier} à {Ville} — {N} artisan{s} vérifié{s}"
```

### Page métier × département
```
<title>  : "{Metier} en {Département} : artisans vérifiés par ville | Portail Habitat"
<meta description> : "Trouvez un {metier} en {Département}. Comparez les artisans par ville, consultez les avis et demandez votre devis gratuit."
H1 : "{Metier} en {Département} — Artisans vérifiés par ville"
```

### Page métier nationale
```
<title>  : "{Metier} : trouvez un artisan vérifié près de chez vous | Portail Habitat"
<meta description> : "Trouvez un {metier} vérifié partout en France. Comparez les avis, consultez les fiches et demandez un devis gratuit et sans engagement."
H1 : "{Metier} — Trouvez un artisan vérifié près de chez vous"
```

## 6. Structure Hn stricte

- **1 seul H1** par page (dans `HeroSeo`).
- H2 pour chaque section principale : liste artisans, formulaire, synonyme, avis, FAQ, maillage.
- H3 pour les questions individuelles dans `BlocFaq`.
- Jamais de saut de niveau (H1 → H3 sans H2 intermédiaire).

## 7. JSON-LD

- Chaque bloc génère son propre JSON-LD depuis les données qu'il affiche — **aucune divergence** entre contenu visible et balisage.
- `aggregateRating` : uniquement si `reviewCount ≥ 1`. Jamais de rating fictif.
- `FAQPage` : généré par `BlocFaq` depuis le même tableau `faq[]` que l'affichage.
- `BreadcrumbList` : généré par `BreadcrumbSeo` depuis les mêmes props.
- Sur les fiches artisans (`/artisans/[slug]`) : `LocalBusiness` avec `address`, `geo`, `aggregateRating` si avis réels.

## 8. Contenu IA

- Le contenu (`intro`, `h2_synonyme`, `faq[]`) est généré **une seule fois** lors de la création de la `pages_seo` doc.
- Il est stocké dans `pages_seo.contenu_ia` et jamais régénéré automatiquement.
- Seule une action admin explicite (`/api/seo/regenerate-content`) peut le régénérer.
- 4 gabarits de prompt en rotation (hash de l'ID de page mod 4) pour éviter l'uniformité entre pages similaires.

## 9. Firestore — règle des 3 requêtes max

Par affichage de page SEO : **maximum 3 lectures Firestore** :
1. `pages_seo/{id}` — contenu IA + compteurs
2. `artisans` — limite 20, tri Premium puis note, filtrés par métier + commune
3. `artisans/{id}/reviews` — limite 5, les plus récents affichés

Cache/ISR : `export const revalidate = 86400` (24h) sur toutes les routes SEO.

Estimation coût Firestore pour 10 000 pages vues : 10 000 × 3 = **30 000 lectures/jour** ≈ 0,018 USD/jour (tarif Spark 50 000 lectures gratuites/jour).

## 10. Liens internes

- Toujours de vrais `<a href="...">`, jamais de navigation `onClick` ou `router.push()` sur les pages publiques indexées.
- Le maillage local (`MaillageLocal`) utilise exclusivement des `<Link href="...">` Next.js (rendu en `<a>`).

## 11. Règle d'extension

- Toute nouvelle famille de pages SEO (blog local, pages "trouver chantier", etc.) doit réutiliser les blocs `components/seo/` et être validée contre ces règles.
- Créer un nouveau bloc dans `components/seo/` si besoin — ne jamais dupliquer du markup SEO dans `app/`.
