# 🔐 Guide de Sécurité - Portail Habitat

Documentation complète des mesures de sécurité et bonnes pratiques.

## 📋 Table des matières

- [🛡️ Authentification et autorisation](#️-authentification-et-autorisation)
- [🔒 Protection des données](#-protection-des-données)
- [🚫 Validation et sanitisation](#-validation-et-sanitisation)
- [🌐 Sécurité réseau](#-sécurité-réseau)
- [📁 Sécurité des fichiers](#-sécurité-des-fichiers)
- [💳 Sécurité des paiements](#-sécurité-des-paiements)
- [📊 Monitoring et logs](#-monitoring-et-logs)

## 🛡️ Authentification et autorisation

### Middleware de protection des routes

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes publiques (pas de vérification)
  const publicRoutes = [
    '/',
    '/artisans',
    '/login',
    '/register',
    '/api/public'
  ];
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Routes protégées
  const protectedRoutes = {
    '/dashboard': ['artisan', 'admin'],
    '/admin': ['admin'],
    '/api/artisan': ['artisan', 'admin'],
    '/api/admin': ['admin']
  };
  
  // Vérifier le token d'authentification
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Vérifier et décoder le JWT
    const payload = await verifyJWT(token);
    
    // Vérifier les permissions pour la route
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(payload.role)) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }
    
    // Ajouter les informations utilisateur aux headers
    const response = NextResponse.next();
    response.headers.set('X-User-ID', payload.uid);
    response.headers.set('X-User-Role', payload.role);
    
    return response;
    
  } catch (error) {
    // Token invalide ou expiré
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

### Système de rôles et permissions

```typescript
// lib/auth/permissions.ts

export enum Role {
  USER = 'user',
  ARTISAN = 'artisan', 
  ADMIN = 'admin'
}

export enum Permission {
  // Artisan permissions
  EDIT_PROFILE = 'edit_profile',
  MANAGE_PROJECTS = 'manage_projects',
  VIEW_LEADS = 'view_leads',
  PURCHASE_LEADS = 'purchase_leads',
  
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_ARTISANS = 'manage_artisans',
  VIEW_ANALYTICS = 'view_analytics',
  MODERATE_CONTENT = 'moderate_content',
  MANAGE_MARKETPLACE = 'manage_marketplace',
  
  // User permissions
  SUBMIT_LEADS = 'submit_leads',
  RATE_ARTISANS = 'rate_artisans'
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.USER]: [
    Permission.SUBMIT_LEADS,
    Permission.RATE_ARTISANS
  ],
  
  [Role.ARTISAN]: [
    Permission.EDIT_PROFILE,
    Permission.MANAGE_PROJECTS,
    Permission.VIEW_LEADS,
    Permission.PURCHASE_LEADS,
    Permission.SUBMIT_LEADS,
    Permission.RATE_ARTISANS
  ],
  
  [Role.ADMIN]: [
    ...Object.values(Permission) // Toutes les permissions
  ]
};

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

/**
 * Middleware pour vérifier les permissions dans les API routes
 */
export function requirePermission(permission: Permission) {
  return (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const userRole = req.headers['x-user-role'] as Role;
      
      if (!hasPermission(userRole, permission)) {
        return res.status(403).json({ 
          error: 'Permission insuffisante',
          required: permission 
        });
      }
      
      return handler(req, res);
    };
  };
}

// Utilisation dans une API route
export default requirePermission(Permission.MANAGE_ARTISANS)(
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Code de l'API protégée
  }
);
```

### Protection CSRF et rate limiting

```typescript
// lib/security/csrf.ts
import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET!;

/**
 * Génère un token CSRF
 */
export function generateCSRFToken(sessionId: string): string {
  const timestamp = Date.now().toString();
  const random = randomBytes(16).toString('hex');
  const payload = `${sessionId}:${timestamp}:${random}`;
  
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(payload)
    .digest('hex');
  
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

/**
 * Vérifie un token CSRF
 */
export function verifyCSRFToken(token: string, sessionId: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [session, timestamp, random, signature] = decoded.split(':');
    
    // Vérifier la session
    if (session !== sessionId) return false;
    
    // Vérifier l'expiration (1 heure)
    const tokenTime = parseInt(timestamp);
    const now = Date.now();
    if (now - tokenTime > 3600000) return false;
    
    // Vérifier la signature
    const payload = `${session}:${timestamp}:${random}`;
    const expectedSignature = createHmac('sha256', CSRF_SECRET)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
    
  } catch (error) {
    return false;
  }
}

// lib/security/rate-limit.ts
interface RateLimitConfig {
  windowMs: number;  // Fenêtre de temps en ms
  maxRequests: number;  // Nombre max de requêtes
  keyGenerator?: (req: NextApiRequest) => string;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Middleware de rate limiting
 */
export function rateLimit(config: RateLimitConfig) {
  return (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const key = config.keyGenerator 
        ? config.keyGenerator(req)
        : req.ip || 'unknown';
      
      const now = Date.now();
      const windowStart = now - config.windowMs;
      
      // Nettoyer les anciennes entrées
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
          rateLimitStore.delete(k);
        }
      }
      
      // Vérifier la limite
      const current = rateLimitStore.get(key);
      
      if (!current) {
        rateLimitStore.set(key, { 
          count: 1, 
          resetTime: now + config.windowMs 
        });
      } else {
        if (current.count >= config.maxRequests) {
          return res.status(429).json({
            error: 'Trop de requêtes',
            retryAfter: Math.ceil((current.resetTime - now) / 1000)
          });
        }
        
        current.count++;
      }
      
      return handler(req, res);
    };
  };
}

// Utilisation
export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requêtes max
  keyGenerator: (req) => req.headers['x-user-id'] as string || req.ip
})(handler);
```

## 🔒 Protection des données

### Chiffrement des données sensibles

```typescript
// lib/security/encryption.ts
import { createCipher, createDecipher, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

/**
 * Chiffre des données sensibles
 */
export async function encrypt(text: string): Promise<string> {
  const iv = randomBytes(16);
  const salt = randomBytes(16);
  
  const key = (await scryptAsync(ENCRYPTION_KEY, salt, 32)) as Buffer;
  const cipher = createCipher('aes-256-gcm', key);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${salt.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Déchiffre des données
 */
export async function decrypt(encryptedData: string): Promise<string> {
  const [ivHex, saltHex, authTagHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const salt = Buffer.from(saltHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const key = (await scryptAsync(ENCRYPTION_KEY, salt, 32)) as Buffer;
  const decipher = createDecipher('aes-256-gcm', key);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hash sécurisé pour les mots de passe
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

/**
 * Vérifie un mot de passe
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [saltHex, hashHex] = hashedPassword.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');
  
  const derivedHash = (await scryptAsync(password, salt, 64)) as Buffer;
  
  return hash.equals(derivedHash);
}
```

### Anonymisation des données

```typescript
// lib/security/anonymization.ts

/**
 * Anonymise les données personnelles pour les logs/analytics
 */
export function anonymizePersonalData<T extends Record<string, any>>(
  data: T,
  fieldsToAnonymize: (keyof T)[]
): T {
  const anonymized = { ...data };
  
  fieldsToAnonymize.forEach(field => {
    if (anonymized[field]) {
      if (typeof anonymized[field] === 'string') {
        anonymized[field] = anonymizeString(anonymized[field] as string);
      } else if (typeof anonymized[field] === 'object') {
        anonymized[field] = '[OBJECT_ANONYMIZED]';
      }
    }
  });
  
  return anonymized;
}

/**
 * Anonymise une chaîne de caractères
 */
function anonymizeString(str: string): string {
  if (str.includes('@')) {
    // Email
    const [local, domain] = str.split('@');
    return `${local.charAt(0)}***@${domain}`;
  } else if (/^\+?[\d\s-()]+$/.test(str)) {
    // Numéro de téléphone
    return str.replace(/\d/g, '*').slice(0, -2) + str.slice(-2);
  } else {
    // Texte général
    return str.charAt(0) + '*'.repeat(Math.max(0, str.length - 2)) + str.slice(-1);
  }
}

/**
 * Supprime les données personnelles expirées (RGPD)
 */
export async function cleanupExpiredPersonalData(): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 3); // 3 ans
  
  // Supprimer les anciens leads
  const expiredLeads = await getDocs(
    query(
      collection(db, 'leads'),
      where('createdAt', '<', Timestamp.fromDate(cutoffDate)),
      where('status', 'in', ['rejected', 'expired'])
    )
  );
  
  const batch = writeBatch(db);
  expiredLeads.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  
  // Anonymiser les anciens événements de tracking
  const expiredEvents = await getDocs(
    query(
      collection(db, 'tracking_events'),
      where('timestamp', '<', Timestamp.fromDate(cutoffDate))
    )
  );
  
  const anonymizeBatch = writeBatch(db);
  expiredEvents.docs.forEach(doc => {
    const data = doc.data();
    anonymizeBatch.update(doc.ref, {
      userId: null,
      sessionId: 'anonymized',
      metadata: null
    });
  });
  
  await anonymizeBatch.commit();
}
```

## 🚫 Validation et sanitisation

### Schémas de validation Zod

```typescript
// lib/validations/schemas.ts
import { z } from 'zod';

// Validation des données artisan
export const ArtisanSchema = z.object({
  companyName: z.string()
    .min(2, 'Nom trop court')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s\-'&.]+$/, 'Caractères non autorisés'),
    
  firstName: z.string()
    .min(2, 'Prénom trop court')
    .max(50, 'Prénom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères non autorisés'),
    
  lastName: z.string()
    .min(2, 'Nom trop court')
    .max(50, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères non autorisés'),
    
  email: z.string()
    .email('Email invalide')
    .max(255, 'Email trop long'),
    
  phone: z.string()
    .regex(/^(\+33|0)[1-9](\d{8})$/, 'Numéro de téléphone français invalide'),
    
  description: z.string()
    .max(2000, 'Description trop longue')
    .optional(),
    
  services: z.array(z.string().max(100))
    .max(20, 'Trop de services')
    .optional(),
    
  city: z.string()
    .min(2, 'Ville trop courte')
    .max(100, 'Ville trop longue')
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères non autorisés'),
    
  postalCode: z.string()
    .regex(/^[0-9]{5}$/, 'Code postal français invalide'),
});

// Validation des leads
export const LeadSchema = z.object({
  artisanId: z.string().min(1, 'ID artisan requis'),
  
  projectType: z.string()
    .min(1, 'Type de projet requis')
    .max(100, 'Type trop long'),
    
  description: z.string()
    .min(10, 'Description trop courte')
    .max(2000, 'Description trop longue')
    .refine(
      (val) => !containsMaliciousContent(val),
      'Contenu non autorisé détecté'
    ),
    
  budget: z.enum(['0-5000', '5000-15000', '15000-30000', '30000+']),
  
  timeline: z.string().min(1, 'Délai requis'),
  
  contactInfo: z.object({
    firstName: z.string()
      .min(2, 'Prénom requis')
      .max(50, 'Prénom trop long')
      .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères non autorisés'),
      
    lastName: z.string()
      .min(2, 'Nom requis')
      .max(50, 'Nom trop long')
      .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, 'Caractères non autorisés'),
      
    email: z.string().email('Email invalide'),
    
    phone: z.string()
      .regex(/^(\+33|0)[1-9](\d{8})$/, 'Téléphone invalide'),
      
    address: z.string()
      .min(5, 'Adresse trop courte')
      .max(200, 'Adresse trop longue')
  })
});

/**
 * Détecte le contenu malveillant
 */
function containsMaliciousContent(text: string): boolean {
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(text));
}

/**
 * Sanitise le HTML
 */
export function sanitizeHtml(html: string): string {
  // Utiliser une bibliothèque comme DOMPurify côté client
  // ou une alternative côté serveur
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '');
}
```

## 🌐 Sécurité réseau

### Headers de sécurité

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.stripe.com https://firestore.googleapis.com https://storage.googleapis.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com"
    ].join('; ')
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Protection contre les attaques

```typescript
// lib/security/protection.ts

/**
 * Détection d'injection SQL (même si on utilise Firestore)
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(--|\/\*|\*\/|;)/gi,
    /(\b(SCRIPT|JAVASCRIPT|VBSCRIPT)\b)/gi
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Détection de tentatives XSS
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[\\s]*=[\\s]*["\']javascript:/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Validation de l'origine des requêtes
 */
export function validateOrigin(req: NextApiRequest): boolean {
  const allowedOrigins = [
    'https://portail-habitat.fr',
    'https://www.portail-habitat.fr',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  
  if (!origin) return false;
  
  return allowedOrigins.includes(origin);
}

/**
 * Middleware de sécurité global
 */
export function securityMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Vérifier l'origine
    if (!validateOrigin(req)) {
      return res.status(403).json({ error: 'Origine non autorisée' });
    }
    
    // Vérifier les tentatives d'injection dans les paramètres
    const allParams = { ...req.query, ...req.body };
    
    for (const [key, value] of Object.entries(allParams)) {
      if (typeof value === 'string') {
        if (detectSQLInjection(value) || detectXSS(value)) {
          console.warn(`Tentative d'attaque détectée: ${key} = ${value}`);
          return res.status(400).json({ error: 'Données non valides' });
        }
      }
    }
    
    return handler(req, res);
  };
}
```

---

*Guide de sécurité - Documentation complète des mesures de protection*
