# Configuration des variables d'environnement

Pour que l'upsell fonctionne correctement, vous devez configurer ces variables dans votre fichier `.env.local` :

## SendGrid (pour l'envoi d'emails)
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

## Firebase (déjà configuré normalement)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... autres variables Firebase
```

## Vérifications nécessaires

### 1. SendGrid
- Créer un compte SendGrid
- Générer une API Key
- Vérifier le domaine `portail-habitat.fr` dans SendGrid
- Ou changer l'email `from` dans `/app/api/send-upsell-confirmation/route.ts` ligne 86

### 2. Firebase
- Vérifier que la collection `artisans` existe
- Vérifier les permissions Firestore
- Tester avec un `prospectId` valide

### 3. Test de l'upsell
1. Aller sur `/onboarding/step4` avec des paramètres URL valides
2. Remplir le formulaire de paiement
3. Vérifier les logs dans la console du navigateur
4. Vérifier les logs du serveur Next.js

## Logs à surveiller
- "Mise à jour Firebase pour: [prospectId]"
- "Résultat Firebase: [objet]"
- "Envoi email à: [email]"
- "Résultat email: [objet]"
