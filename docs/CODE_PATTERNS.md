# 🎯 Patterns de Code - Portail Habitat

Documentation des patterns et conventions de code utilisés dans le projet.

## 📋 Table des matières

- [🏗️ Patterns React](#️-patterns-react)
- [🎨 Patterns UI/UX](#-patterns-uiux)
- [💾 Patterns de données](#-patterns-de-données)
- [🔐 Patterns de sécurité](#-patterns-de-sécurité)
- [📊 Patterns de performance](#-patterns-de-performance)
- [🧪 Patterns de tests](#-patterns-de-tests)

## 🏗️ Patterns React

### Hook personnalisé pour l'authentification

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';

interface AuthUser extends User {
  role?: 'artisan' | 'user' | 'admin';
  artisanData?: Artisan;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupérer les données utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        setUser({
          ...firebaseUser,
          role: userData?.role || 'user',
          artisanData: userData?.artisanData
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  return { user, loading };
}

// Utilisation dans un composant
function ProtectedComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
  if (!user) return <LoginForm />;
  
  return <Dashboard user={user} />;
}
```

### Pattern de gestion d'état complexe avec useReducer

```typescript
// hooks/useArtisanForm.ts
interface ArtisanFormState {
  data: Partial<Artisan>;
  errors: Record<string, string>;
  loading: boolean;
  step: number;
}

type ArtisanFormAction = 
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

function artisanFormReducer(state: ArtisanFormState, action: ArtisanFormAction): ArtisanFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error }
      };
    
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 4) };
    
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    
    default:
      return state;
  }
}

export function useArtisanForm() {
  const [state, dispatch] = useReducer(artisanFormReducer, {
    data: {},
    errors: {},
    loading: false,
    step: 1
  });
  
  const setField = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };
  
  const setError = (field: string, error: string) => {
    dispatch({ type: 'SET_ERROR', field, error });
  };
  
  return { state, setField, setError, dispatch };
}
```

### Pattern de composant avec variants (CVA)

```typescript
// components/ui/badge.tsx
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Utilisation
<Badge variant="success" size="lg">Premium</Badge>
<Badge variant="outline" size="sm">Standard</Badge>
```

## 🎨 Patterns UI/UX

### Pattern de notification uniforme

```typescript
// hooks/useToast.ts
import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export function useToast() {
  const toast = ({ title, description, variant = "default", duration = 4000 }: ToastOptions) => {
    const message = description ? `${title}\n${description}` : title;
    
    switch (variant) {
      case "success":
        sonnerToast.success(message, { duration });
        break;
      case "destructive":
        sonnerToast.error(message, { duration });
        break;
      default:
        sonnerToast(message, { duration });
    }
  };
  
  return { toast };
}

// Utilisation dans un composant
function SaveButton() {
  const { toast } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      toast({
        title: "Sauvegarde réussie",
        description: "Vos modifications ont été enregistrées",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return <Button onClick={handleSave}>Sauvegarder</Button>;
}
```

### Pattern de chargement avec Skeleton

```typescript
// components/ui/skeleton-loader.tsx
interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'profile' | 'table';
  count?: number;
}

export function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <Card className="p-6">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        );
      
      case 'list':
        return (
          <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        );
      
      default:
        return <Skeleton className="h-4 w-full" />;
    }
  };
  
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

// Utilisation
function ArtisanList() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchArtisans().then(data => {
      setArtisans(data);
      setLoading(false);
    });
  }, []);
  
  if (loading) {
    return <SkeletonLoader type="card" count={6} />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artisans.map(artisan => (
        <ArtisanCard key={artisan.id} artisan={artisan} />
      ))}
    </div>
  );
}
```

### Pattern de modal réutilisable

```typescript
// components/ui/modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[425px]", sizeClasses[size])}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook pour gérer les modals
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);
  
  return { isOpen, openModal, closeModal, toggleModal };
}

// Utilisation
function ArtisanProfile() {
  const { isOpen, openModal, closeModal } = useModal();
  
  return (
    <>
      <Button onClick={openModal}>Modifier le profil</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Modifier le profil"
        description="Mettez à jour vos informations professionnelles"
        size="lg"
      >
        <ArtisanForm onSubmit={closeModal} />
      </Modal>
    </>
  );
}
```

## 💾 Patterns de données

### Pattern Repository pour Firestore

```typescript
// lib/repositories/artisan-repository.ts
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filters?: any): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class ArtisanRepository implements Repository<Artisan> {
  private collection = collection(db, 'artisans');
  
  async findById(id: string): Promise<Artisan | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Artisan;
    }
    
    return null;
  }
  
  async findAll(filters: ArtisanFilters = {}): Promise<Artisan[]> {
    let q = query(this.collection);
    
    // Appliquer les filtres
    if (filters.city) {
      q = query(q, where('city', '==', filters.city));
    }
    
    if (filters.profession) {
      q = query(q, where('professions', 'array-contains', filters.profession));
    }
    
    if (filters.premium) {
      q = query(q, where('premiumFeatures.isPremium', '==', true));
    }
    
    // Tri et pagination
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Artisan[];
  }
  
  async create(data: Omit<Artisan, 'id'>): Promise<Artisan> {
    const docRef = await addDoc(this.collection, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: docRef.id, ...data } as Artisan;
  }
  
  async update(id: string, data: Partial<Artisan>): Promise<Artisan> {
    const docRef = doc(this.collection, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    const updated = await this.findById(id);
    if (!updated) throw new Error('Artisan not found after update');
    
    return updated;
  }
  
  async delete(id: string): Promise<void> {
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
  }
  
  // Méthodes spécifiques aux artisans
  async findBySlug(slug: string): Promise<Artisan | null> {
    const q = query(this.collection, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Artisan;
  }
  
  async findNearby(lat: number, lng: number, radiusKm: number): Promise<Artisan[]> {
    // Pour une recherche géographique précise, utiliser une solution comme GeoFirestore
    // Ici, on récupère tous les artisans et on filtre côté client (à optimiser)
    const allArtisans = await this.findAll();
    
    return allArtisans.filter(artisan => {
      if (!artisan.coordinates) return false;
      
      const distance = calculateDistance(
        lat, lng,
        artisan.coordinates.lat, artisan.coordinates.lng
      );
      
      return distance <= radiusKm;
    });
  }
}

// Service layer
export class ArtisanService {
  constructor(private repository: ArtisanRepository) {}
  
  async getArtisanProfile(id: string): Promise<Artisan> {
    const artisan = await this.repository.findById(id);
    if (!artisan) throw new Error('Artisan not found');
    
    return artisan;
  }
  
  async searchArtisans(criteria: SearchCriteria): Promise<SearchResult> {
    const artisans = await this.repository.findAll(criteria);
    
    // Appliquer l'algorithme de tri complexe
    const sorted = filterAndSortArtisans(artisans, criteria);
    
    return {
      artisans: sorted.artisans,
      totalCount: sorted.totalCount,
      hasRandomPremium: sorted.hasRandomPremium
    };
  }
}

// Utilisation dans un composant
function useArtisanService() {
  const repository = new ArtisanRepository();
  const service = new ArtisanService(repository);
  
  return service;
}
```

---

*Documentation des patterns de code - Partie 1/2*
