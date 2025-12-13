# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à Portail Habitat ! Ce guide vous aidera à commencer.

## 📋 Table des matières

- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🔧 Configuration de développement](#-configuration-de-développement)
- [📝 Standards de code](#-standards-de-code)
- [🌿 Workflow Git](#-workflow-git)
- [🧪 Tests](#-tests)
- [📚 Documentation](#-documentation)
- [🐛 Signalement de bugs](#-signalement-de-bugs)
- [💡 Proposer des fonctionnalités](#-proposer-des-fonctionnalités)

## 🚀 Démarrage rapide

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Installer** les dépendances : `npm install`
4. **Configurer** les variables d'environnement (voir README.md)
5. **Lancer** le serveur de développement : `npm run dev`

## 🔧 Configuration de développement

### Prérequis

- Node.js 18+
- npm/yarn/pnpm
- Git
- Compte Firebase (pour les tests)

### Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir les valeurs :

```bash
cp .env.example .env.local
```

### Base de données de développement

Utiliser une base Firebase séparée pour le développement :

1. Créer un nouveau projet Firebase
2. Configurer Firestore en mode test
3. Importer les données de test (si disponibles)

## 📝 Standards de code

### TypeScript

- **Mode strict** activé
- **Pas de `any`** sauf cas exceptionnels documentés
- **Interfaces** pour tous les types de données
- **Génériques** pour la réutilisabilité

```typescript
// ✅ Bon
interface User {
  id: string;
  email: string;
  role: 'artisan' | 'user' | 'admin';
}

// ❌ Éviter
const user: any = { ... };
```

### React

- **Composants fonctionnels** uniquement
- **Hooks personnalisés** pour la logique réutilisable
- **Props typées** avec interfaces
- **Composants purs** quand possible

```typescript
// ✅ Bon
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Styling

- **Tailwind CSS** uniquement
- **shadcn/ui** pour les composants de base
- **Classes utilitaires** plutôt que CSS custom
- **Responsive design** mobile-first

```tsx
// ✅ Bon
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-6">

// ❌ Éviter
<div style={{ display: 'flex', padding: '24px' }}>
```

### Naming Conventions

- **Fichiers** : kebab-case (`user-profile.tsx`)
- **Composants** : PascalCase (`UserProfile`)
- **Variables/Fonctions** : camelCase (`getUserProfile`)
- **Constantes** : SCREAMING_SNAKE_CASE (`API_BASE_URL`)

## 🌿 Workflow Git

### Branches

- `main` : Production
- `develop` : Développement
- `feature/nom-fonctionnalite` : Nouvelles fonctionnalités
- `fix/nom-bug` : Corrections de bugs
- `hotfix/nom-urgence` : Corrections urgentes

### Commits

Utiliser [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify user service
test: add unit tests for auth
chore: update dependencies
```

### Pull Requests

1. **Créer une branche** depuis `develop`
2. **Développer** la fonctionnalité
3. **Tester** localement
4. **Créer une PR** vers `develop`
5. **Attendre la review** et les tests CI
6. **Merger** après approbation

#### Template de PR

```markdown
## 📝 Description

Brève description des changements

## 🎯 Type de changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## 🧪 Tests

- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Tests E2E (si applicable)

## 📋 Checklist

- [ ] Code respecte les standards
- [ ] Documentation mise à jour
- [ ] Pas de console.log oubliés
- [ ] Variables d'environnement documentées
```

## 🧪 Tests

### Types de tests

1. **Unit tests** : Composants et fonctions isolés
2. **Integration tests** : API routes et services
3. **E2E tests** : Parcours utilisateur complets

### Commandes

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### Écriture de tests

```typescript
// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📚 Documentation

### Code

- **JSDoc** pour les fonctions complexes
- **Commentaires** pour la logique métier
- **README** pour les modules importants

```typescript
/**
 * Calcule la distance entre deux points géographiques
 * @param lat1 Latitude du premier point
 * @param lng1 Longitude du premier point
 * @param lat2 Latitude du second point
 * @param lng2 Longitude du second point
 * @returns Distance en kilomètres
 */
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  // Formule de Haversine
  // ...
}
```

### API

Documenter les endpoints avec des exemples :

```typescript
/**
 * GET /api/artisans
 * 
 * Récupère la liste des artisans avec filtres optionnels
 * 
 * Query params:
 * - city?: string - Filtrer par ville
 * - profession?: string - Filtrer par métier
 * - premium?: boolean - Artisans premium uniquement
 * 
 * Response: Artisan[]
 */
```

## 🐛 Signalement de bugs

### Avant de signaler

1. **Vérifier** que le bug n'est pas déjà signalé
2. **Reproduire** le bug de manière consistante
3. **Tester** sur différents navigateurs/appareils

### Template d'issue

```markdown
## 🐛 Description du bug

Description claire et concise du problème

## 🔄 Étapes pour reproduire

1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

## ✅ Comportement attendu

Ce qui devrait se passer

## 📱 Environnement

- OS: [ex: macOS 12.6]
- Navigateur: [ex: Chrome 108]
- Version: [ex: 1.2.3]

## 📸 Captures d'écran

Si applicable, ajouter des captures d'écran
```

## 💡 Proposer des fonctionnalités

### Template de proposition

```markdown
## 🚀 Fonctionnalité proposée

Description claire de la fonctionnalité

## 🎯 Problème résolu

Quel problème cette fonctionnalité résout-elle ?

## 💡 Solution proposée

Comment cette fonctionnalité devrait fonctionner

## 🔄 Alternatives considérées

Autres solutions envisagées

## 📋 Contexte supplémentaire

Informations additionnelles, maquettes, etc.
```

## 📞 Contact

- **Discord** : [Lien d'invitation]
- **Email** : dev@portail-habitat.fr
- **Issues** : GitHub Issues

---

Merci de contribuer à Portail Habitat ! 🏠✨
