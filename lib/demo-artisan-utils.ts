import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Interface pour la configuration des artisans demo
export interface DemoArtisanConfig {
  isContactable: boolean;
  showRealPhone: boolean;
  redirectToContact: boolean;
  expiresAt?: Date;
}

// Interface étendue pour les artisans avec support demo
export interface ArtisanWithDemo {
  id: string;
  accountType?: 'real' | 'demo' | 'showcase';
  demoConfig?: DemoArtisanConfig;
  phone?: string;
  email?: string;
  [key: string]: any;
}

/**
 * Vérifie si un artisan est un compte demo
 */
export function isDemoArtisan(artisan: ArtisanWithDemo): boolean {
  return artisan.accountType === 'demo';
}

/**
 * Vérifie si un artisan demo est encore valide (pas expiré)
 */
export function isDemoArtisanValid(artisan: ArtisanWithDemo): boolean {
  if (!isDemoArtisan(artisan)) return true; // Les vrais artisans sont toujours valides
  
  const expiresAt = artisan.demoConfig?.expiresAt;
  if (!expiresAt) return true; // Pas de date d'expiration = valide
  
  return new Date() < new Date(expiresAt);
}

/**
 * Vérifie si un artisan demo peut être contacté
 */
export function isDemoArtisanContactable(artisan: ArtisanWithDemo): boolean {
  if (!isDemoArtisan(artisan)) return true; // Les vrais artisans sont contactables
  
  return artisan.demoConfig?.isContactable === true;
}

/**
 * Obtient le numéro de téléphone à afficher (masqué pour les demos)
 */
export function getDisplayPhone(artisan: ArtisanWithDemo): string {
  if (!isDemoArtisan(artisan)) {
    return artisan.phone || '';
  }
  
  // Pour les artisans demo, toujours retourner un numéro masqué
  if (artisan.demoConfig?.showRealPhone) {
    return artisan.phone || '01 XX XX XX XX';
  }
  
  return '01 XX XX XX XX';
}

/**
 * Obtient l'email à afficher (masqué pour les demos)
 */
export function getDisplayEmail(artisan: ArtisanWithDemo): string {
  if (!isDemoArtisan(artisan)) {
    return artisan.email || '';
  }
  
  // Pour les artisans demo, retourner l'email demo
  return artisan.email || `demo.${artisan.id}@portail-habitat.fr`;
}

/**
 * Détermine l'action à effectuer lors d'un clic sur le téléphone
 */
export function getPhoneClickAction(artisan: ArtisanWithDemo): 'call' | 'redirect' | 'disabled' {
  if (!isDemoArtisan(artisan)) {
    return 'call'; // Appel normal pour les vrais artisans
  }
  
  if (!isDemoArtisanContactable(artisan)) {
    return 'disabled'; // Pas de contact possible
  }
  
  if (artisan.demoConfig?.redirectToContact) {
    return 'redirect'; // Redirection vers formulaire général
  }
  
  return 'disabled'; // Par défaut, pas de contact direct
}

/**
 * Détermine l'action à effectuer lors de la soumission du formulaire de contact
 */
export function getContactFormAction(artisan: ArtisanWithDemo): 'submit' | 'redirect' | 'disabled' {
  if (!isDemoArtisan(artisan)) {
    return 'submit'; // Soumission normale pour les vrais artisans
  }
  
  if (!isDemoArtisanContactable(artisan)) {
    return 'disabled'; // Pas de contact possible
  }
  
  if (artisan.demoConfig?.redirectToContact) {
    return 'redirect'; // Redirection vers formulaire général
  }
  
  return 'disabled'; // Par défaut, pas de contact direct
}

/**
 * Obtient l'URL de redirection pour le contact
 */
export function getContactRedirectUrl(artisan: ArtisanWithDemo, source: 'phone' | 'form' = 'form'): string {
  const baseUrl = '/contact-artisan';
  const params = new URLSearchParams({
    source: 'demo-artisan',
    artisan: artisan.id,
    type: source,
    city: artisan.city || '',
    profession: artisan.profession || ''
  });
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Récupère les données complètes d'un artisan avec vérification demo
 */
export async function getArtisanWithDemoCheck(artisanId: string): Promise<ArtisanWithDemo | null> {
  try {
    const artisanDoc = await getDoc(doc(db, 'artisans', artisanId));
    
    if (!artisanDoc.exists()) {
      return null;
    }
    
    const artisanData = { id: artisanDoc.id, ...artisanDoc.data() } as ArtisanWithDemo;
    
    // Vérifier si l'artisan demo est encore valide
    if (isDemoArtisan(artisanData) && !isDemoArtisanValid(artisanData)) {
      console.log(`Artisan demo ${artisanId} expiré`);
      return null;
    }
    
    return artisanData;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artisan:', error);
    return null;
  }
}

/**
 * Génère un message d'information pour les artisans demo
 */
export function getDemoArtisanMessage(artisan: ArtisanWithDemo): string | null {
  if (!isDemoArtisan(artisan)) return null;
  
  if (!isDemoArtisanContactable(artisan)) {
    return "Cet artisan fait partie de notre réseau de professionnels. Pour le contacter, utilisez notre formulaire de mise en relation.";
  }
  
  if (artisan.demoConfig?.redirectToContact) {
    return "Pour contacter cet artisan, nous vous redirigerons vers notre formulaire de mise en relation sécurisé.";
  }
  
  return null;
}

/**
 * Vérifie si un artisan demo doit afficher un badge spécial
 */
export function shouldShowDemoBadge(artisan: ArtisanWithDemo): boolean {
  // Pour l'instant, on ne montre pas de badge "demo" aux utilisateurs
  // pour maintenir l'illusion de volume
  return false;
}

/**
 * Filtre les artisans demo expirés d'une liste
 */
export function filterValidDemoArtisans(artisans: ArtisanWithDemo[]): ArtisanWithDemo[] {
  return artisans.filter(artisan => {
    if (!isDemoArtisan(artisan)) return true;
    return isDemoArtisanValid(artisan);
  });
}

/**
 * Statistiques sur les artisans demo
 */
export function getDemoArtisanStats(artisans: ArtisanWithDemo[]) {
  const total = artisans.length;
  const demoCount = artisans.filter(isDemoArtisan).length;
  const realCount = total - demoCount;
  const expiredDemo = artisans.filter(a => isDemoArtisan(a) && !isDemoArtisanValid(a)).length;
  const contactableDemo = artisans.filter(a => isDemoArtisan(a) && isDemoArtisanContactable(a)).length;
  
  return {
    total,
    real: realCount,
    demo: demoCount,
    expired: expiredDemo,
    contactable: contactableDemo,
    demoPercentage: total > 0 ? Math.round((demoCount / total) * 100) : 0
  };
}
