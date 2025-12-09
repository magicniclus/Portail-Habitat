# 📝 Guide d'utilisation du Blog Portail Habitat

## 🎯 Vue d'ensemble

Le système de blog est entièrement basé sur un fichier JSON (`/data/blog-articles.json`) qui contient tous les articles et catégories. Aucune base de données n'est nécessaire !

## 📁 Structure des fichiers

```
/app/blog/                          # Page principale du blog
/app/blog/[slug]/                   # Pages d'articles individuels
/app/blog/categorie/[slug]/         # Pages de catégories
/components/blog/                   # Composants du blog
/data/blog-articles.json           # Base de données des articles
```

## ✍️ Comment ajouter un nouvel article

### 1. Ouvrir le fichier JSON
Éditez `/data/blog-articles.json`

### 2. Ajouter l'article dans le tableau "articles"

```json
{
  "id": "mon-nouvel-article",
  "title": "Titre de mon article",
  "slug": "mon-nouvel-article",
  "excerpt": "Résumé de l'article en 1-2 phrases...",
  "content": "# Titre principal\n\nContenu de l'article en markdown...",
  "category": "renovation",
  "tags": ["tag1", "tag2", "tag3"],
  "author": {
    "name": "Nom de l'auteur",
    "role": "Expert en rénovation",
    "avatar": "/images/authors/nom-auteur.jpg",
    "bio": "Biographie courte de l'auteur"
  },
  "publishedAt": "2024-12-09T10:00:00Z",
  "updatedAt": "2024-12-09T10:00:00Z",
  "readingTime": 8,
  "targetAudience": "Particuliers",
  "difficulty": "Débutant",
  "featured": false,
  "featuredImage": "/images/blog/mon-article.jpg",
  "tableOfContents": [
    {
      "id": "section-1",
      "title": "Première section",
      "level": 2
    },
    {
      "id": "sous-section",
      "title": "Sous-section",
      "level": 3
    }
  ],
  "relatedArticles": ["article-1", "article-2"],
  "seo": {
    "metaTitle": "Titre SEO optimisé (60 caractères max)",
    "metaDescription": "Description SEO (160 caractères max)",
    "keywords": ["mot-clé1", "mot-clé2"],
    "canonicalUrl": "https://portail-habitat.fr/blog/mon-nouvel-article"
  }
}
```

### 3. Champs obligatoires vs optionnels

**Obligatoires :**
- `id` : Identifiant unique
- `title` : Titre de l'article
- `slug` : URL de l'article (sans espaces, tirets uniquement)
- `excerpt` : Résumé court
- `content` : Contenu principal
- `category` : ID d'une catégorie existante
- `author` : Informations sur l'auteur
- `publishedAt` : Date de publication
- `readingTime` : Temps de lecture estimé
- `featuredImage` : Image principale
- `seo` : Métadonnées SEO

**Optionnels :**
- `tags` : Mots-clés
- `updatedAt` : Date de mise à jour
- `targetAudience` : Public cible
- `difficulty` : Niveau de difficulté
- `featured` : Article en vedette (true/false)
- `gallery` : Images supplémentaires
- `tableOfContents` : Sommaire
- `relatedArticles` : Articles liés

## 🏷️ Gestion des catégories

### Catégories existantes :
- `renovation` : Rénovation
- `budget` : Budget & Prix
- `isolation` : Isolation
- `conseils` : Conseils

### Ajouter une nouvelle catégorie :

```json
{
  "id": "nouvelle-categorie",
  "name": "Nouvelle Catégorie",
  "slug": "nouvelle-categorie",
  "description": "Description de la catégorie",
  "color": "#ea580c"
}
```

## 🎨 Images et médias

### Structure recommandée :
```
/public/images/blog/
  ├── article-slug.jpg          # Image principale
  ├── article-slug-1.jpg        # Images supplémentaires
  └── article-slug-2.jpg
  
/public/images/authors/
  ├── nom-auteur.jpg            # Photo de l'auteur
```

### Formats recommandés :
- **Images principales** : 1200x630px (ratio 16:9)
- **Images auteurs** : 200x200px (carré)
- **Format** : JPG ou WebP optimisé

## 📊 SEO et référencement

### Bonnes pratiques :

1. **Titre SEO** : 50-60 caractères max
2. **Meta description** : 150-160 caractères max
3. **Mots-clés** : 3-5 mots-clés pertinents
4. **URL canonique** : Toujours renseigner
5. **Images** : Alt text descriptif

### Structure d'URL :
- Article : `/blog/slug-de-l-article`
- Catégorie : `/blog/categorie/slug-categorie`

## 🔄 Sommaire automatique

Le sommaire se génère automatiquement à partir du champ `tableOfContents` :

```json
"tableOfContents": [
  {
    "id": "introduction",        // Ancre pour le lien
    "title": "Introduction",     // Texte affiché
    "level": 2                   // Niveau de titre (2 ou 3)
  }
]
```

## 📱 Fonctionnalités automatiques

### ✅ Déjà implémentées :
- **Filtrage par catégorie**
- **Pagination automatique**
- **Articles en vedette**
- **Articles liés**
- **Partage social** (Facebook, Twitter, LinkedIn)
- **Temps de lecture**
- **Breadcrumbs**
- **SEO complet**
- **Responsive design**
- **Sommaire cliquable**

### 🔍 Recherche
La barre de recherche est présente mais nécessite une implémentation côté client pour fonctionner.

## 🚀 Déploiement

1. **Ajouter l'article** dans le JSON
2. **Ajouter les images** dans `/public/images/blog/`
3. **Commit et push** - Les pages se génèrent automatiquement
4. **Vérifier** que l'article apparaît sur `/blog`

## 📋 Checklist avant publication

- [ ] Article ajouté dans le JSON
- [ ] Images uploadées et optimisées
- [ ] SEO renseigné (titre, description, mots-clés)
- [ ] Sommaire créé si nécessaire
- [ ] Articles liés définis
- [ ] Catégorie correcte
- [ ] Temps de lecture estimé
- [ ] Relecture du contenu

## 🛠️ Maintenance

### Modifier un article existant :
1. Trouver l'article par son `id` dans le JSON
2. Modifier les champs nécessaires
3. Mettre à jour `updatedAt`

### Supprimer un article :
1. Retirer l'objet du tableau `articles`
2. Supprimer les images associées
3. Vérifier les `relatedArticles` des autres articles

## 💡 Conseils de rédaction

### Structure recommandée :
1. **Introduction** (pourquoi ce sujet ?)
2. **Développement** (comment faire ?)
3. **Conseils pratiques**
4. **Conclusion** (résumé + CTA)

### Ton éditorial :
- **Accessible** : Éviter le jargon technique
- **Pratique** : Donner des conseils concrets
- **Rassurant** : Guider le lecteur
- **Professionnel** : Expertise reconnue

## 🔧 Personnalisation avancée

### Modifier les couleurs des catégories :
Éditer le champ `color` dans la catégorie (format hexadécimal)

### Ajouter de nouveaux champs :
1. Modifier l'interface TypeScript
2. Mettre à jour les composants
3. Ajouter le champ dans le JSON

---

**🎉 Votre blog est maintenant prêt à recevoir du contenu de qualité !**
