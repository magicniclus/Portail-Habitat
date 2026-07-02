# Déploiement du système SEO en pyramide

## Architecture

```
app/[metier]/page.tsx                  → /plombier, /electricien, etc. (36 pages nationales)
app/[metier]/[localite]/page.tsx       → /plombier/rhone, /plombier/lyon, etc.
components/seo/SeoPageLayout.tsx       → Template unique pour toutes les pages SEO
functions/src/seo-generator.ts         → Cloud Function déclenchée sur écriture artisan
```

## Ordre de déploiement initial

### 1. Importer la collection `villes`

```bash
node scripts/import-villes.js --min-pop=5000
```

> Importe ~4500 communes depuis `geo.api.gouv.fr`. Les slugs homonymes sont suffixés du code département.

### 2. Créer les index Firestore

Dans la console Firebase → Firestore → Index :

```
Collection: pages_seo
  Champ 1: metier_slug (ASC)
  Champ 2: statut (ASC)
  Champ 3: type (ASC)
  Champ 4: nb_artisans (DESC)

Collection: pages_seo
  Champ 1: metier_slug (ASC)
  Champ 2: departement_code (ASC)
  Champ 3: statut (ASC)
  Champ 4: type (ASC)

Collection: artisans
  Champ 1: privacy.profileVisible (ASC)
  Champ 2: communes_couvertes (ARRAY_CONTAINS)
  Champ 3: profession (ASC)

Collection: artisans
  Champ 1: privacy.profileVisible (ASC)
  Champ 2: departement_code (ASC)
  Champ 3: profession (ASC)
```

### 3. Seeder les 36 pages nationales

```bash
node scripts/seed-national-pages.js
```

### 4. Déployer les Cloud Functions

```bash
cd functions && npm install
npx firebase deploy --only functions
```

### 5. Configurer les variables de la Cloud Function

```bash
firebase functions:config:set openai.key="sk-..."
firebase functions:config:set netlify.revalidate_url="https://portail-habitat.fr"
firebase functions:config:set netlify.revalidate_secret="VOTRE_SECRET"
```

Ajouter `REVALIDATE_SECRET` dans les variables d'environnement Netlify.

### 6. Valider avec le seed de test

```bash
node scripts/seed-test-artisans.js
```

Puis vérifier :
- http://localhost:3000/plombier → page nationale
- http://localhost:3000/plombier/rhone → page département
- http://localhost:3000/plombier/lyon → page ville
- http://localhost:3000/sitemap.xml → sitemap
- http://localhost:3000/robots.txt → robots

Nettoyer après validation :
```bash
node scripts/seed-test-artisans.js --cleanup
```

## Variables d'environnement requises

```env
# Déjà présentes
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
OPENAI_API_KEY=sk-...

# À ajouter
REVALIDATE_SECRET=un-token-secret-32-caracteres
```

## Décisions techniques prises

| Décision | Choix |
|---|---|
| Rayon d'intervention | 30km par défaut, éditable via `rayon_km` dans le profil artisan |
| API IA | OpenAI `gpt-4o-mini` (key déjà présente) |
| Périmètre villes | Population ≥ 5000 (~4500 communes) |
| Génération IA | Une fois à la création, uniquement régénérable manuellement |
| Déclencheur génération | Cloud Function `onWrite` sur `artisans` |
| Revalidation ISR | Webhook → `/api/seo/revalidate` → `revalidatePath()` |
| robots.txt | Bloque GPTBot, CCBot, Anthropic, Google-Extended sur tout le site |
