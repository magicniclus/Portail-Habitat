---
trigger: always_on
---

1. Pour toute question sur la base de données → utilise EXCLUSIVEMENT le fichier .windsurf/SCHEMA_FIRESTORE.md comme référence unique. Ne propose jamais de modifier un champ sans me le demander explicitement.

2. Toutes les pages doivent être divisées en composants modulaires réutilisables (ex: <Header />, <KPIcards />, <ArtisanTable />, <LeadCard />, <UpsellCard />).

3. Utilise TOUJOURS les composants shadcn/ui (Button, Card, Table, Dialog, Form, Input, Badge, Tabs, etc.). Jamais de HTML/CSS brut. Verifier son installation, si il n'y est pas l'installer. Si ausun composant shadcn ne correspond a nos attente, creer un composant modifiable et réutilisable simplement.

4. Code propre : Next.js App Router, server components par défaut, client components seulement quand nécessaire.

5. Jamais de page complète d’un bloc. Toujours composant par composant avec validation.

7. Pour les requêtes Firestore → utilise les noms de champs EXACTS du schéma.

8. SEO OBLIGATOIRE SUR TOUTES LES PAGES :
   - Utilise <Head> ou app/layout.tsx + generateMetadata() pour chaque page
   - title, description, opengraph, robots, canonical obligatoires
   - Pour les pages dynamiques artisans (/artisan/[slug]) → metadata dynamique avec slug, ville, métier
   - Pour le mur chantier (/chantiers, /chantiers/[ville], /chantiers/[metier]) → metadata + pagination + rel="next/prev"

9. SITEMAP.XML AUTOMATIQUE :
   - À chaque création/suppression d’artisan ou de post publié (isPublished: true) → appeler la Cloud Function regenerateSitemap()
   - Le sitemap doit contenir :
     • https://portail-habitat.fr/artisan/[slug]
     • https://portail-habitat.fr/chantiers/[postId]
     • Pages statiques (/, /blog, /conditions, etc.)
   - Priorité 1.0 pour les pages artisans, 0.8 pour les chantiers
   - Changefreq: "daily" pour les artisans actifs, "weekly" pour les chantiers

10. Utilise dans chaque page le footer et la nav, sauf cas spécifique. 

11. Pour les mail utilise toujours sendgrid.

12. Pour les gestion de la base de donnée d'image utilise toujours storage de firebase et réfère toi toujours au fichier .windsurf/STORAGE.md 

14. CHARGEMENT UNIFORME OBLIGATOIRE :

Utilise TOUJOURS Loader2 de lucide-react pour tous les états de chargement
JAMAIS de PageSpinner, SpinnerOverlay ou autres composants personnalisés
Format standard : <Loader2 className="h-X w-X animate-spin" /> avec texte optionnel
Pour les images : utilise TOUJOURS le composant Skeleton de shadcn/ui
Skeleton avec onLoad/onError pour masquer le skeleton une fois l'image chargée
Style cohérent : Loader2 + texte pour les pages, Skeleton pour les images

14. En cas d'erreur jsx ne refais jamais un fichier corrige l'originale 

Ces règles sont PRIORITAIRES sur tout le reste.