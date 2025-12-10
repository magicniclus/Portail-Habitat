# Configuration Stripe Elements

## Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# Clé publique Stripe (commence par pk_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe

# Clé secrète Stripe (commence par sk_)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
```

## Où trouver vos clés Stripe

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com/)
2. Allez dans **Développeurs** > **Clés API**
3. Copiez :
   - **Clé publique** : pour `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Clé secrète** : pour `STRIPE_SECRET_KEY`

## Fonctionnalités implémentées

### ✅ Composants Stripe Elements Officiels

- **CardNumberElement** : Numéro de carte avec icônes automatiques
- **CardExpiryElement** : Date d'expiration
- **CardCvcElement** : Code CVV
- **Validation temps réel** : Format, erreurs, détection de carte
- **Design responsive** : Mobile et desktop

### ✅ Sécurité PCI DSS

- **Conformité PCI** : Aucune donnée de carte ne transite par notre serveur
- **Chiffrement** : Toutes les données sont chiffrées par Stripe
- **Tokenisation** : Les cartes sont tokenisées automatiquement

### ✅ Interface utilisateur

- **2 lignes séparées** :
  - Ligne 1 : Numéro de carte
  - Ligne 2 : Expiration + CVV
- **CGV obligatoires** : Checkbox juste au-dessus du bouton "Payer"
- **Messages d'erreur** : Contextuels et clairs
- **États de chargement** : Feedback visuel pendant le traitement

## Cartes de test Stripe

Pour tester les paiements en mode développement :

```
Visa : 4242 4242 4242 4242
Mastercard : 5555 5555 5555 4444
American Express : 3782 822463 10005

Expiration : N'importe quelle date future (ex: 12/25)
CVV : N'importe quel 3 chiffres (ex: 123)
```

## Pages de test disponibles

- `/test-stripe-elements` : Test du composant Stripe isolé
- `/buy-lead/test-lead-123` : Test de la page complète d'achat

## API Routes nécessaires

Assurez-vous que ces routes API existent :

- `POST /api/create-marketplace-payment` : Crée l'intention de paiement
- `POST /api/confirm-marketplace-payment` : Confirme le paiement

## Workflow de paiement

1. **Saisie** : L'utilisateur remplit le formulaire Stripe
2. **Validation** : Stripe valide le format en temps réel
3. **CGV** : L'utilisateur doit cocher les conditions générales
4. **Intention** : Création d'une PaymentIntent côté serveur
5. **Confirmation** : Stripe confirme le paiement
6. **Succès** : Redirection vers la page de succès

## Dépendances installées

```json
{
  "@stripe/react-stripe-js": "^5.4.1",
  "@stripe/stripe-js": "^8.5.3"
}
```

## Support

- [Documentation Stripe Elements](https://stripe.com/docs/stripe-js/react)
- [Guide d'intégration](https://stripe.com/docs/payments/quickstart)
- [Cartes de test](https://stripe.com/docs/testing#cards)
