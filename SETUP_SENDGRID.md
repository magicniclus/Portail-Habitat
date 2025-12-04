# 🚨 CONFIGURATION RAPIDE SENDGRID

## Problème actuel : "Email expéditeur non configuré"

### ✅ ÉTAPE 1 : Créer le fichier .env.local

Créez un fichier `.env.local` à la racine de votre projet (à côté de package.json) :

```bash
# Contenu du fichier .env.local
SENDGRID_API_KEY=SG.votre_cle_sendgrid_ici
SENDGRID_FROM_EMAIL=service@trouver-mon-chantier.fr
```

### ✅ ÉTAPE 2 : Obtenir votre clé SendGrid

1. Aller sur https://sendgrid.com/
2. Se connecter ou créer un compte
3. Aller dans **Settings > API Keys**
4. Cliquer sur **Create API Key**
5. Choisir **Restricted Access**
6. Donner la permission **Mail Send : Full Access**
7. Copier la clé qui commence par `SG.`

### ✅ ÉTAPE 3 : Vérifier l'email expéditeur

1. Dans SendGrid, aller dans **Settings > Sender Authentication**
2. Cliquer sur **Verify a Single Sender**
3. Remplir avec `service@trouver-mon-chantier.fr`
4. Vérifier l'email reçu

### ✅ ÉTAPE 4 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

### ✅ ÉTAPE 5 : Tester

Essayez d'envoyer un email depuis l'interface.

## 🔍 Vérification

Regardez les logs dans votre terminal. Vous devriez voir :
```
=== DEBUT ENVOI EMAIL ===
Variables d'environnement:
SENDGRID_API_KEY présente: true
SENDGRID_FROM_EMAIL: service@trouver-mon-chantier.fr
```

Si vous voyez `false` pour SENDGRID_API_KEY, le fichier .env.local n'est pas bien configuré.
