# 🎭 Système d'Artisans Demo - Portail Habitat

## 📋 Vue d'ensemble

Ce système permet de créer des artisans temporaires (demo) **parfaitement invisibles** pour générer un effet de volume sur la plateforme. Les artisans demo sont **indiscernables** des vrais artisans pour tous les visiteurs.

## 🎯 Objectifs

- **Effet de volume immédiat** : 100+ artisans réalistes en quelques secondes
- **Invisibilité totale** : Impossible de distinguer demo/réel pour les utilisateurs
- **Génération sans IA** : Données ultra-réalistes créées algorithmiquement
- **Facilement réversible** : Suppression complète en une commande
- **Impact minimal** : Code existant préservé à 100%

## 🏗️ Architecture Technique

### 1. Structure de Base de Données

```typescript
// Collection: artisans
{
  id: string,
  accountType: 'real' | 'demo' | 'showcase', // NOUVEAU CHAMP
  
  // Configuration demo (seulement pour accountType: 'demo')
  demoConfig?: {
    isContactable: boolean,        // Peut-on contacter cet artisan ?
    showRealPhone: boolean,        // Afficher le vrai numéro ?
    redirectToContact: boolean,    // Rediriger vers formulaire général ?
    expiresAt?: Date              // Date d'expiration
  },
  
  // Champs standards...
  firstName: string,
  lastName: string,
  companyName: string,
  phone: string,                   // Masqué pour les demos
  email: string,                   // Email demo pour les demos
  // ... autres champs
}
```

### 2. Fichiers Créés

#### Scripts de Génération
- `scripts/generate-demo-artisans.ts` - Script principal de génération
- `scripts/run-demo-generation.js` - Script d'exécution Node.js

#### Utilitaires
- `lib/demo-artisan-utils.ts` - Fonctions utilitaires pour la gestion des demos

#### Composants
- `components/admin/DemoArtisanManager.tsx` - Interface admin de gestion
- `components/FicheEntreprisePublic.tsx` - Modifié pour supporter les demos

## 🚀 Utilisation Rapide

### Commandes Principales

```bash
# 🎭 GÉNÉRER des artisans demo (100 par défaut)
npm run generate-demo

# 📊 VOIR les statistiques du système
npm run demo-stats

# 🧹 SUPPRIMER COMPLÈTEMENT le système demo (IRRÉVERSIBLE)
npm run cleanup-demo-system
```

### Commandes Avancées

```bash
# Générer un nombre spécifique d'artisans
node scripts/run-demo-generation.js 50

# Nettoyer seulement les artisans demo (garde le système)
npm run generate-demo:cleanup

# Aide et options
node scripts/run-demo-generation.js help
```

## ✨ Génération Ultra-Réaliste (Sans IA)

### Descriptions Professionnelles
- **6 templates variés** avec années d'expérience (5-20 ans)
- **Vocabulaire métier authentique** et références aux normes
- **Mentions d'équipe aléatoires** pour plus de crédibilité
- **Personnalisation par ville et profession**

### Noms d'Entreprise Intelligents
- **40%** : Nom + Prénom (`Martin Pierre`)
- **30%** : Nom + Suffixe (`Dubois SARL`, `Garcia Bâtiment`) 
- **30%** : Métier + Ville (`Plomberie Parisienne`, `Électricité Lyonnaise`)

### Données Ultra-Crédibles
- **50 prénoms + 50 noms** français authentiques
- **30 villes françaises** avec coordonnées GPS réelles
- **Adresses réalistes** générées (rue de la République, etc.)
- **Certifications vraies** (RGE, Qualibat, Garantie décennale)
- **Notes 4.0-5.0** avec nombre d'avis crédible (5-50)
- **30% premium** avec badge "Top Artisan"
- **60% avec images** de profil et bannières
- **Expiration automatique** : 1 an par défaut

### Configuration par Artisan

```typescript
// Artisan non contactable (par défaut)
demoConfig: {
  isContactable: false,
  showRealPhone: false,
  redirectToContact: true,
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // +1 an
}

// Artisan contactable (redirection)
demoConfig: {
  isContactable: true,
  showRealPhone: false,
  redirectToContact: true,
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
}
```

## 🎨 Interface Utilisateur

### Pour les Visiteurs

Les artisans demo sont **indiscernables** des vrais artisans :
- Même affichage sur les fiches
- Mêmes informations visibles
- Numéros de téléphone masqués (`01 XX XX XX XX`)
- Emails demo (`demo.artisan-id@portail-habitat.fr`)

### Comportement des Contacts

#### Clic Téléphone
- **Artisan réel** : Révèle le numéro et permet l'appel
- **Demo non contactable** : Aucune action
- **Demo contactable** : Redirection vers formulaire de contact général

#### Formulaire de Contact
- **Artisan réel** : Envoi direct à l'artisan
- **Demo non contactable** : Message d'erreur
- **Demo contactable** : Redirection vers formulaire général

### Messages d'Information

Les artisans demo peuvent afficher des messages informatifs :
```
"Cet artisan fait partie de notre réseau de professionnels. 
Pour le contacter, utilisez notre formulaire de mise en relation."
```

## 🔧 Gestion Administrative

### Interface de Gestion

Le composant `DemoArtisanManager` permet :

#### Statistiques Globales
- Nombre total d'artisans demo
- Artisans contactables vs non contactables  
- Artisans premium vs standard
- Artisans expirés

#### Filtres et Recherche
- **Recherche** : Par nom, ville, métier
- **Statut contact** : Tous / Contactables / Non contactables / Expirés
- **Statut premium** : Tous / Premium / Standard

#### Actions Individuelles
- Basculer le statut contactable
- Supprimer un artisan demo
- Voir les détails complets

#### Actions en Lot
- Sélection multiple d'artisans
- Basculer le contact pour plusieurs artisans
- Prolonger l'expiration (+1 an)
- Suppression en masse

### Fonctions Utilitaires

```typescript
import { 
  isDemoArtisan,
  isDemoArtisanContactable,
  getDisplayPhone,
  getDisplayEmail,
  getPhoneClickAction,
  getContactFormAction,
  getContactRedirectUrl,
  getDemoArtisanMessage
} from '@/lib/demo-artisan-utils';

// Vérifier si un artisan est demo
const isDemo = isDemoArtisan(artisan);

// Obtenir le numéro à afficher
const phone = getDisplayPhone(artisan); // "01 XX XX XX XX" pour demos

// Déterminer l'action au clic téléphone
const action = getPhoneClickAction(artisan); // 'call' | 'redirect' | 'disabled'
```

## 📊 Données Générées

### Répartition Géographique

Les artisans sont répartis sur 30 villes françaises :
- **Grandes métropoles** : Paris, Lyon, Marseille, Toulouse, Nice...
- **Villes moyennes** : Rennes, Reims, Saint-Étienne, Le Havre...
- **Villes importantes** : Clermont-Ferrand, Aix-en-Provence, Brest...

### Prestations Disponibles

Basées sur `renovation-suggestions.ts` :
- Rénovation complète de cuisine
- Pose carrelage sol
- Installation chauffage
- Isolation combles
- Ravalement façade
- Rénovation salle de bain
- Charpente traditionnelle
- Et 40+ autres prestations...

### Données Réalistes

#### Noms et Prénoms
- 50 prénoms français courants
- 50 noms de famille français
- Combinaisons aléatoires crédibles

#### Entreprises
- Noms basés sur le nom de famille + suffixe professionnel
- Exemples : "Martin SARL", "Dupont Bâtiment", "Leroy Construction"

#### Certifications
- RGE, Qualibat, Garantie décennale
- Assurance responsabilité civile
- Label Artisan, Maître Artisan

## 🔒 Sécurité et Confidentialité

### Protection des Données

- **Numéros masqués** : Jamais de vrais numéros exposés
- **Emails demo** : Adresses dédiées non fonctionnelles
- **Pas de spam** : Aucun envoi d'email automatique
- **Expiration** : Artisans supprimés automatiquement après expiration

### Distinction Technique

```typescript
// Champ discriminant dans Firestore
accountType: 'demo' // vs 'real' pour les vrais artisans

// Vérification côté code
if (artisan.accountType === 'demo') {
  // Logique spécifique aux demos
}
```

## 🎛️ Configuration et Personnalisation

### Paramètres de Génération

Dans `generate-demo-artisans.ts` :

```typescript
// Pourcentages configurables
const PREMIUM_RATE = 0.3;        // 30% premium
const WITH_IMAGES_RATE = 0.6;    // 60% avec images
const CONTACTABLE_RATE = 0.0;    // 0% contactables par défaut

// Durée de vie
const EXPIRY_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 an

// Villes et prestations
const FRENCH_CITIES = [...];     // 30 villes
const AVAILABLE_PRESTATIONS = [...]; // Basé sur simulateur
```

### Personnalisation des Messages

Dans `demo-artisan-utils.ts` :

```typescript
export function getDemoArtisanMessage(artisan: ArtisanWithDemo): string | null {
  if (!isDemoArtisan(artisan)) return null;
  
  // Personnaliser les messages selon le contexte
  if (!isDemoArtisanContactable(artisan)) {
    return "Message pour artisans non contactables...";
  }
  
  return "Message pour artisans avec redirection...";
}
```

## 📈 Monitoring et Analytics

### Métriques Importantes

- **Taux de contact demo** : Combien de visiteurs tentent de contacter des demos
- **Conversions redirections** : Taux de complétion du formulaire général
- **Répartition géographique** : Quelles villes génèrent le plus d'intérêt
- **Prestations populaires** : Quels métiers attirent le plus

### Logs et Debugging

```typescript
// Logs automatiques dans la console
console.log('📞 Tentative contact artisan demo:', artisanId);
console.log('🔄 Redirection vers formulaire général');
console.log('❌ Contact bloqué - artisan demo non contactable');
```

## 🚨 Bonnes Pratiques

### Génération
1. **Commencer petit** : Tester avec 10-20 artisans avant génération massive
2. **Répartition équilibrée** : Vérifier la distribution géographique
3. **Monitoring** : Surveiller l'impact sur les performances Firestore
4. **Nettoyage régulier** : Supprimer les artisans expirés

### Gestion
1. **Transparence interne** : L'équipe doit savoir quels sont les demos
2. **Pas de sur-promesse** : Ne pas promettre de contact direct
3. **Transition progressive** : Remplacer graduellement par de vrais artisans
4. **Feedback utilisateur** : Monitorer les retours sur l'expérience

### Maintenance
1. **Mise à jour régulière** : Actualiser les données demo
2. **Cohérence** : Maintenir la qualité des données générées
3. **Performance** : Optimiser les requêtes avec filtres `accountType`
4. **Évolution** : Adapter selon les retours utilisateurs

## 🔄 Migration vers Vrais Artisans

### Stratégie de Remplacement

1. **Identification des zones prioritaires** : Remplacer d'abord les demos dans les zones à forte demande
2. **Transition douce** : Maintenir quelques demos pendant la période de transition
3. **Monitoring des conversions** : S'assurer que les vrais artisans convertissent mieux
4. **Nettoyage progressif** : Supprimer les demos au fur et à mesure

### Processus de Migration

```bash
# 1. Identifier les demos à remplacer
# 2. Recruter de vrais artisans dans ces zones
# 3. Créer les comptes réels
# 4. Supprimer les demos correspondants
node scripts/run-demo-generation.js cleanup
```

## 📞 Support et Dépannage

### Problèmes Courants

**Erreur de génération** :
```bash
# Vérifier les permissions Firestore
# Vérifier la configuration Firebase Admin
# Vérifier les variables d'environnement
```

**Artisans demo non visibles** :
```typescript
// Vérifier le filtre accountType dans les requêtes
const q = query(artisansRef, where('accountType', 'in', ['real', 'demo']));
```

**Contacts non redirigés** :
```typescript
// Vérifier la configuration demoConfig
// Vérifier l'implémentation dans FicheEntreprisePublic
```

### Commandes Utiles

```bash
# Statistiques des artisans demo
node -e "
const { getDemoArtisanStats } = require('./lib/demo-artisan-utils');
// Afficher les stats
"

# Nettoyage sélectif
# (Modifier le script pour filtrer par ville, date, etc.)
```

---

## 🎯 Invisibilité Parfaite Garantie

### ✅ Indiscernables des Vrais Artisans
- **Aucun badge** ou indicateur visible
- **Interface identique** pour tous les utilisateurs  
- **Mélange automatique** dans toutes les listes
- **Données ultra-réalistes** générées sans IA

### 🔄 Facilement Réversible
```bash
# Voir l'état actuel
npm run demo-stats

# Supprimer TOUT le système demo (irréversible)
npm run cleanup-demo-system
```

### 📊 Impact Code Existant : MINIMAL
- **Une seule ligne** modifiée dans `ArtisansClient.tsx`
- **Logique conditionnelle** ajoutée dans `FicheEntreprisePublic.tsx`
- **Aucun impact** sur les fonctionnalités existantes
- **Rétrocompatibilité** totale préservée

## 🚀 Prêt pour Production

Le système est **parfait** pour créer un effet de volume :

✅ **Invisible** : Impossible de distinguer demo/réel  
✅ **Réaliste** : Données générées sans IA, ultra-crédibles  
✅ **Facile à ajouter** : `npm run generate-demo`  
✅ **Facile à enlever** : `npm run cleanup-demo-system`  
✅ **Impact minimal** : Code existant préservé  
✅ **Réversible** : Suppression complète en une commande  

**Génère 100+ artisans demo parfaitement invisibles, puis supprime-les facilement quand tu as assez de vrais artisans !**
