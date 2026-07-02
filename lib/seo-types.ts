/**
 * Types partagés pour le système de pages SEO en pyramide.
 * Source de vérité pour les composants components/seo/ et les routes /[metier]/...
 */

export type SeoPageType = "national" | "departement" | "ville";

export interface ContenIA {
  intro: string;
  h2_synonyme?: string;
  paragraphe_synonyme?: string;
  faq: { q: string; r: string }[];
}

export interface PageSeoDoc {
  /** ID = "[metier_slug]__national" | "[metier_slug]__dep__[dep_slug]" | "[metier_slug]__[ville_slug]" */
  id: string;
  type: SeoPageType;
  metier_id: number;
  metier_slug: string;
  metier_nom: string;
  ville_code_insee?: string;
  ville_slug?: string;
  ville_nom?: string;
  departement_code?: string;
  departement_slug?: string;
  departement_nom?: string;
  statut: "publiee" | "noindex";
  /** Compteur dénormalisé — NE JAMAIS lire le nombre d'artisans à l'affichage */
  nb_artisans: number;
  contenu_ia: ContenIA;
  date_creation: Date;
  date_maj: Date;
}

export interface VilleDoc {
  /** code_insee = doc ID */
  code_insee: string;
  nom: string;
  slug: string;
  departement_code: string;
  departement_nom: string;
  departement_slug: string;
  region: string;
  population: number;
  lat: number;
  lng: number;
}

export interface ArtisanSeoCard {
  id: string;
  slug: string;
  companyName: string;
  firstName: string;
  lastName: string;
  city: string;
  profession: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  averageRating: number;
  reviewCount: number;
  averageQuoteMin?: number;
  averageQuoteMax?: number;
  isPremium: boolean;
  showTopArtisanBadge: boolean;
  certifications?: string[];
}

export interface AvisSeo {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  createdAt: Date;
  artisanName: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/** Props passées à SeoPageLayout pour l'assemblage */
export interface SeoPageProps {
  type: SeoPageType;
  metier: { slug: string; nom: string; synonymes: string[] };
  ville?: VilleDoc;
  departement?: { code: string; slug: string; nom: string };
  page: PageSeoDoc;
  artisans: ArtisanSeoCard[];
  avis: AvisSeo[];
  villesVoisines?: { nom: string; slug: string; nbArtisans: number }[];
  /** Pour page département : liste des villes actives du département */
  villesDuDepartement?: { nom: string; slug: string; nbArtisans: number }[];
  /** Pour page nationale : liste des départements actifs */
  departementsActifs?: { nom: string; slug: string; nbArtisans: number }[];
}
