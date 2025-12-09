import { auth } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin';
  adminRole: 'super_admin' | 'content_admin' | 'support_admin' | 'stats_admin';
  permissions: string[];
}

export const ADMIN_PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_CONTENT: 'manage_content',
  VIEW_STATS: 'view_stats',
  MODERATE_REVIEWS: 'moderate_reviews',
  MANAGE_SYSTEM: 'manage_system',
  MANAGE_ADMINS: 'manage_admins',
  VIEW_LOGS: 'view_logs'
} as const;

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_ADMIN: 'content_admin',
  SUPPORT_ADMIN: 'support_admin',
  STATS_ADMIN: 'stats_admin'
} as const;

/**
 * Vérifie si l'utilisateur actuel est un administrateur
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    if (userData.role !== 'admin') return null;

    return {
      uid: user.uid,
      email: user.email!,
      role: userData.role,
      adminRole: userData.adminRole,
      permissions: userData.permissions || []
    };
  } catch (error) {
    console.error('Erreur lors de la vérification admin:', error);
    return null;
  }
}

/**
 * Vérifie si l'admin actuel a une permission spécifique
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const admin = await getCurrentAdmin();
  if (!admin) return false;
  
  return admin.permissions.includes(permission);
}

/**
 * Vérifie si l'admin actuel a un rôle spécifique ou supérieur
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const admin = await getCurrentAdmin();
  if (!admin) return false;

  // Super admin a accès à tout
  if (admin.adminRole === ADMIN_ROLES.SUPER_ADMIN) return true;
  
  return admin.adminRole === requiredRole;
}

/**
 * Middleware pour protéger les pages admin
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Accès non autorisé - Connexion admin requise');
  }
  return admin;
}

/**
 * Middleware pour protéger les pages avec une permission spécifique
 */
export async function requirePermission(permission: string): Promise<AdminUser> {
  const admin = await requireAdmin();
  
  if (!admin.permissions.includes(permission)) {
    throw new Error(`Accès non autorisé - Permission requise: ${permission}`);
  }
  
  return admin;
}

/**
 * Utilitaire pour logger les actions admin
 */
export async function logAdminAction(
  action: string,
  details: any = {},
  artisanId?: string,
  prospectId?: string
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return;

    const logData = {
      action,
      artisanId: artisanId || null,
      prospectId: prospectId || null,
      adminId: admin.uid,
      adminRole: admin.adminRole,
      details,
      timestamp: new Date()
    };

    // Ajouter le log à Firestore
    await addDoc(collection(db, 'adminLogs'), logData);
  } catch (error) {
    console.error('Erreur lors du logging admin:', error);
  }
}
