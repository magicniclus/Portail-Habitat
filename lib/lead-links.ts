/**
 * Utilitaires pour générer des liens de paiement direct pour les leads
 */

/**
 * Génère un lien de paiement direct pour un lead
 */
export function generateLeadPurchaseLink(leadId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://portail-habitat.fr');
  return `${base}/buy-lead/${leadId}`;
}

/**
 * Génère plusieurs liens pour une liste de leads
 */
export function generateMultipleLeadLinks(leadIds: string[], baseUrl?: string): { leadId: string; link: string }[] {
  return leadIds.map(leadId => ({
    leadId,
    link: generateLeadPurchaseLink(leadId, baseUrl)
  }));
}

/**
 * Génère un lien avec paramètres UTM pour le tracking
 */
export function generateLeadPurchaseLinkWithTracking(
  leadId: string, 
  source?: string, 
  medium?: string, 
  campaign?: string,
  baseUrl?: string
): string {
  const base = generateLeadPurchaseLink(leadId, baseUrl);
  const params = new URLSearchParams();
  
  if (source) params.append('utm_source', source);
  if (medium) params.append('utm_medium', medium);
  if (campaign) params.append('utm_campaign', campaign);
  
  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

/**
 * Valide qu'un leadId est au bon format
 */
export function isValidLeadId(leadId: string): boolean {
  return typeof leadId === 'string' && leadId.length > 0 && !leadId.includes('/');
}

/**
 * Extrait le leadId d'un lien de paiement
 */
export function extractLeadIdFromLink(link: string): string | null {
  const match = link.match(/\/buy-lead\/([^/?]+)/);
  return match ? match[1] : null;
}

/**
 * Génère un lien court pour partage (optionnel)
 */
export function generateShortLeadLink(leadId: string): string {
  // Pour l'instant, retourne le lien normal
  // Peut être étendu avec un service de raccourcissement d'URL
  return generateLeadPurchaseLink(leadId);
}
