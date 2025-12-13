# 📋 Documentation Technique - Portail Habitat

Documentation complète du code source et de l'architecture technique.

## 📋 Table des matières

- [🏗️ Architecture générale](#️-architecture-générale)
- [🎨 Composants UI](#-composants-ui)
- [🔧 Services et utilitaires](#-services-et-utilitaires)
- [💾 Gestion des données](#-gestion-des-données)
- [🔐 Authentification et sécurité](#-authentification-et-sécurité)
- [📱 Fonctionnalités métier](#-fonctionnalités-métier)
- [🧪 Tests et qualité](#-tests-et-qualité)
- [📊 Performance et monitoring](#-performance-et-monitoring)

## 🏗️ Architecture générale

### Stack technique

```typescript
// Configuration Next.js
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true, // App Router Next.js 14
  },
  images: {
    domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}
```

### Structure des dossiers

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── (auth)/            # Route groups
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard artisan
│   └── artisans/          # Pages publiques
├── components/            # Composants React
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Formulaires
│   └── layout/           # Layout components
├── lib/                  # Utilitaires et services
│   ├── firebase.ts       # Configuration Firebase
│   ├── utils.ts          # Utilitaires généraux
│   └── validations.ts    # Schémas Zod
├── hooks/                # Custom React Hooks
├── types/                # Définitions TypeScript
└── styles/               # Styles globaux
```

## 🎨 Composants UI

### Système de design

```typescript
// components/ui/button.tsx - Exemple shadcn/ui
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Composants métier principaux

#### TopArtisanBadge
```typescript
// components/TopArtisanBadge.tsx
interface TopArtisanBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}

/**
 * Badge premium pour identifier les artisans "Top Artisan"
 * 
 * @param size - Taille du badge (sm: 12px, md: 16px, lg: 20px)
 * @param variant - Style du badge (default: complet, compact: minimal)
 * @param className - Classes CSS additionnelles
 * 
 * @example
 * <TopArtisanBadge size="md" variant="default" />
 */
export default function TopArtisanBadge({ size, variant, className }: TopArtisanBadgeProps)
```

#### FicheEntreprise vs FicheEntreprisePublic
```typescript
// Différences entre les vues dashboard et publique

// Dashboard (éditable)
interface FicheEntrepriseProps {
  entreprise: Entreprise;
  canEdit: boolean;           // Permet l'édition
  onUpdate: (data) => void;   // Callback de mise à jour
  isPreview?: boolean;        // Mode prévisualisation
}

// Vue publique (lecture seule)
interface FicheEntreprisePublicProps {
  entreprise: Entreprise;
  showContactForm?: boolean;  // Afficher formulaire contact
  isPreview?: boolean;        // Mode prévisualisation
  projects?: Project[];       // Projets à afficher
  reviews?: Review[];         // Avis clients
}
```

### Gestion des états de chargement

```typescript
// Pattern uniforme pour les états de chargement
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Pour les pages
<div className="flex items-center justify-center min-h-screen">
  <Loader2 className="h-8 w-8 animate-spin" />
  <span className="ml-2">Chargement...</span>
</div>

// Pour les images
{isLoading && <Skeleton className="w-full h-48" />}
<img 
  onLoad={() => setIsLoading(false)}
  style={{ display: isLoading ? 'none' : 'block' }}
/>
```

## 🔧 Services et utilitaires

### Configuration Firebase

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

### Gestion du storage

```typescript
// lib/storage.ts - Fonctions utilitaires pour Firebase Storage

/**
 * Upload d'une image avec validation et optimisation
 * @param file - Fichier à uploader
 * @param path - Chemin de destination
 * @param maxSize - Taille maximale en MB (défaut: 5MB)
 * @returns Promise<string> URL de l'image uploadée
 */
export async function uploadImage(
  file: File, 
  path: string, 
  maxSize: number = 5
): Promise<string> {
  // Validation du fichier
  const validation = validateImageFile(file, maxSize);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Upload vers Firebase Storage
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

/**
 * Validation des fichiers image
 */
export function validateImageFile(file: File, maxSizeMB: number) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Format non supporté' };
  }

  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `Fichier trop volumineux (max ${maxSizeMB}MB)` };
  }

  return { isValid: true };
}
```

---

*Documentation technique - Partie 1/3*
