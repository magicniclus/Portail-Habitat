/**
 * SOURCE DE VÉRITÉ UNIQUE — 36 métiers officiels Portail Habitat
 * Ne jamais dupliquer cette liste ailleurs dans le code.
 * Slugs immuables : ne pas modifier sans migration BDD.
 */

export interface Metier {
  id: number;
  nom: string;
  /** Slug immuable — utilisé dans les URLs et en base de données */
  slug: string;
  /** Variantes reconnues en recherche / autocomplétion */
  synonymes: string[];
  /** 1 = prioritaire, 2 = standard, 3 = secondaire */
  priorite: 1 | 2 | 3;
  actif: boolean;
}

export const METIERS: Metier[] = [
  {
    id: 1,
    nom: "Plombier",
    slug: "plombier",
    synonymes: [
      "plomberie",
      "dépannage plomberie",
      "fuite d'eau",
      "installateur sanitaire",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 2,
    nom: "Électricien",
    slug: "electricien",
    synonymes: [
      "électricité",
      "mise aux normes électrique",
      "tableau électrique",
      "domotique",
      "domoticien",
      "installateur alarmes",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 3,
    nom: "Chauffagiste",
    slug: "chauffagiste",
    synonymes: [
      "chauffage",
      "installateur chaudière",
      "dépannage chaudière",
      "entretien chaudière",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 4,
    nom: "Serrurier",
    slug: "serrurier",
    synonymes: [
      "serrurerie",
      "ouverture de porte",
      "dépannage serrure",
      "blindage",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 5,
    nom: "Maçon",
    slug: "macon",
    synonymes: [
      "maçonnerie",
      "gros œuvre",
      "extension maison",
      "ouverture mur porteur",
      "maconnerie",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 6,
    nom: "Peintre en bâtiment",
    slug: "peintre",
    synonymes: [
      "peinture",
      "peintre intérieur",
      "rafraîchissement peinture",
      "enduit décoratif",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 7,
    nom: "Couvreur",
    slug: "couvreur",
    synonymes: [
      "couverture",
      "toiture",
      "réparation toiture",
      "fuite toiture",
      "zingueur",
      "zinguerie",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 8,
    nom: "Menuisier",
    slug: "menuisier",
    synonymes: [
      "menuiserie",
      "menuiserie bois",
      "agencement",
      "placard sur mesure",
      "dressing",
      "escalier",
      "escalieteur",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 9,
    nom: "Carreleur",
    slug: "carreleur",
    synonymes: ["carrelage", "pose carrelage", "faïence", "mosaïque"],
    priorite: 1,
    actif: true,
  },
  {
    id: 10,
    nom: "Jardinier-paysagiste",
    slug: "paysagiste",
    synonymes: [
      "jardinier",
      "entretien jardin",
      "aménagement extérieur",
      "élagage",
      "tonte",
      "jardinage",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 11,
    nom: "Installateur de climatisation",
    slug: "climatisation",
    synonymes: [
      "clim",
      "climatiseur",
      "pose climatisation",
      "entretien clim",
      "gainable",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 12,
    nom: "Installateur pompe à chaleur",
    slug: "pompe-a-chaleur",
    synonymes: [
      "PAC",
      "pac air eau",
      "pac air air",
      "installateur PAC",
      "installateur communication",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 13,
    nom: "Entreprise d'isolation",
    slug: "isolation",
    synonymes: [
      "isolation combles",
      "isolation thermique",
      "ITE",
      "isolation extérieure",
      "isolation intérieur",
      "laine de verre",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 14,
    nom: "Installateur de fenêtres",
    slug: "fenetres",
    synonymes: [
      "pose fenêtre",
      "remplacement fenêtres",
      "double vitrage",
      "menuiserie PVC",
      "menuiserie alu",
      "baie vitrée",
      "volet roulant",
      "véranda",
      "vérandaliste",
      "fenetres-installateur",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 15,
    nom: "Entreprise de rénovation",
    slug: "renovation",
    synonymes: [
      "rénovation complète",
      "rénovation appartement",
      "rénovation maison",
      "travaux tous corps d'état",
      "contractant général",
      "multiservices",
      "constructeur maison",
      "entreprise generale",
    ],
    priorite: 1,
    actif: true,
  },
  {
    id: 16,
    nom: "Plaquiste",
    slug: "plaquiste",
    synonymes: [
      "placo",
      "cloison placo",
      "faux plafond",
      "plâtrier",
      "plâtrerie",
      "ba13",
      "placoiste",
      "platrier",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 17,
    nom: "Charpentier",
    slug: "charpentier",
    synonymes: [
      "charpente",
      "charpente bois",
      "traitement charpente",
      "surélévation",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 18,
    nom: "Façadier",
    slug: "facadier",
    synonymes: [
      "ravalement de façade",
      "ravalement",
      "enduit façade",
      "crépi",
      "nettoyage façade",
      "ravaleur facade",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 19,
    nom: "Terrassier",
    slug: "terrassement",
    synonymes: [
      "terrassement",
      "enrochement",
      "nivellement",
      "fouilles",
      "viabilisation",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 20,
    nom: "Cuisiniste",
    slug: "cuisiniste",
    synonymes: [
      "pose cuisine",
      "cuisine équipée",
      "installateur cuisine",
      "cuisine sur mesure",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 21,
    nom: "Pisciniste",
    slug: "pisciniste",
    synonymes: [
      "construction piscine",
      "piscine coque",
      "entretien piscine",
      "liner",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 22,
    nom: "Vitrier",
    slug: "vitrier",
    synonymes: [
      "vitrerie",
      "remplacement vitre",
      "miroiterie",
      "double vitrage cassé",
      "miroitier",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 23,
    nom: "Solier / poseur de sols",
    slug: "poseur-de-sol",
    synonymes: [
      "pose parquet",
      "parqueteur",
      "sol souple",
      "lino",
      "moquette",
      "béton ciré",
      "vitrification",
      "solier moquettiste",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 24,
    nom: "Étancheur",
    slug: "etancheite",
    synonymes: [
      "étanchéité toit terrasse",
      "étanchéité toiture",
      "infiltration",
      "résine",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 25,
    nom: "Installateur panneaux solaires",
    slug: "panneaux-solaires",
    synonymes: [
      "photovoltaïque",
      "panneau solaire",
      "autoconsommation",
      "installateur solaire",
      "installateur photovoltaique",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 26,
    nom: "Installateur poêle & cheminée",
    slug: "poele-cheminee",
    synonymes: [
      "poêle à granulés",
      "poêle à bois",
      "cheminée",
      "insert",
      "fumisterie",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 27,
    nom: "Salle de bain clé en main",
    slug: "salle-de-bain",
    synonymes: [
      "rénovation salle de bain",
      "installateur salle de bain",
      "douche italienne",
      "remplacement baignoire",
      "installateur-salle-bain",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 28,
    nom: "Poseur de portails & clôtures",
    slug: "portail-cloture",
    synonymes: [
      "pose portail",
      "clôture",
      "portail motorisé",
      "grillage",
      "portillon",
      "installateur portail",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 29,
    nom: "Entreprise d'assainissement",
    slug: "assainissement",
    synonymes: [
      "fosse septique",
      "micro-station",
      "raccordement tout-à-l'égout",
      "débouchage canalisation",
    ],
    priorite: 2,
    actif: true,
  },
  {
    id: 30,
    nom: "Métallier-ferronnier",
    slug: "metallier",
    synonymes: [
      "ferronnerie",
      "garde-corps",
      "escalier métallique",
      "verrière",
      "portail fer",
    ],
    priorite: 3,
    actif: true,
  },
  {
    id: 31,
    nom: "Entreprise de démolition",
    slug: "demolition",
    synonymes: ["démolition intérieure", "curage", "déconstruction"],
    priorite: 3,
    actif: true,
  },
  {
    id: 32,
    nom: "Ramoneur",
    slug: "ramoneur",
    synonymes: ["ramonage", "ramonage cheminée", "certificat de ramonage"],
    priorite: 3,
    actif: true,
  },
  {
    id: 33,
    nom: "Poseur de stores & pergolas",
    slug: "store-pergola",
    synonymes: [
      "pergola bioclimatique",
      "store banne",
      "volet roulant",
      "protection solaire",
      "storiste",
    ],
    priorite: 3,
    actif: true,
  },
  {
    id: 34,
    nom: "Cordiste / travaux en hauteur",
    slug: "travaux-hauteur",
    synonymes: [
      "cordiste",
      "travaux acrobatiques",
      "nettoyage vitres en hauteur",
    ],
    priorite: 3,
    actif: true,
  },
  {
    id: 35,
    nom: "Nettoyage après travaux",
    slug: "nettoyage-chantier",
    synonymes: ["nettoyage fin de chantier", "remise en état"],
    priorite: 3,
    actif: true,
  },
  {
    id: 36,
    nom: "Diagnostiqueur immobilier",
    slug: "diagnostic-immobilier",
    synonymes: [
      "DPE",
      "diagnostic avant vente",
      "amiante",
      "plomb",
      "audit énergétique",
      "diagnostiqueur",
    ],
    priorite: 3,
    actif: true,
  },
];

/** Tous les métiers actifs, triés par priorité puis nom */
export function getMetiers(): Metier[] {
  return METIERS.filter((m) => m.actif).sort(
    (a, b) => a.priorite - b.priorite || a.nom.localeCompare(b.nom, "fr"),
  );
}

/** Métier par slug (retourne undefined si inexistant) */
export function findMetierBySlug(slug: string): Metier | undefined {
  return METIERS.find((m) => m.slug === slug);
}

/** Métier par slug avec fallback sur l'ancien slug maçon */
export function findMetierBySlugOrLegacy(slug: string): Metier | undefined {
  return (
    findMetierBySlug(slug) ?? METIERS.find((m) => m.synonymes.includes(slug))
  );
}

/** Normalise une chaîne pour la comparaison (minuscules, sans accents) */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();
}

/**
 * Recherche insensible à la casse et aux accents dans nom + synonymes.
 * Exemples : "placo" → Plaquiste, "PAC" → Installateur pompe à chaleur
 */
export function searchMetiers(texte: string): Metier[] {
  if (!texte || texte.trim().length < 2) return getMetiers();
  const q = normalize(texte);
  return METIERS.filter((m) => {
    if (!m.actif) return false;
    if (normalize(m.nom).includes(q)) return true;
    if (normalize(m.slug).includes(q)) return true;
    return m.synonymes.some((s) => normalize(s).includes(q));
  });
}

/**
 * Retourne le label affiché pour un slug donné.
 * Compatible avec les anciens slugs (maconnerie, platrier, etc.)
 * Retourne le slug tel quel si aucun métier trouvé.
 */
export function getMetierLabel(slug: string): string {
  const m = findMetierBySlugOrLegacy(slug);
  return m ? m.nom : slug;
}

/**
 * Table de correspondance legacy → slug officiel
 * Pour la migration des anciens enregistrements BDD
 */
export const LEGACY_SLUG_MAP: Record<string, string> = {
  maconnerie: "macon",
  platrier: "plaquiste",
  placoiste: "plaquiste",
  vitrier: "vitrier",
  diagnostiqueur: "diagnostic-immobilier",
  paysagiste: "paysagiste",
  jardinier: "paysagiste",
  "ravaleur-facade": "facadier",
  facadier: "facadier",
  parqueteur: "poseur-de-sol",
  "solier-moquettiste": "poseur-de-sol",
  "miroitier-vitrier": "vitrier",
  "installateur-portail": "portail-cloture",
  "installateur-salle-bain": "salle-de-bain",
  "installateur-photovoltaique": "panneaux-solaires",
  "fenetres-installateur": "fenetres",
  storiste: "store-pergola",
  terrassier: "terrassement",
  "entreprise-generale": "renovation",
  multiservices: "renovation",
  "constructeur-maison": "renovation",
  domoticien: "electricien",
  domotique: "electricien",
  "installateur-alarmes": "electricien",
  "installateur-communication": "pompe-a-chaleur",
  verandaliste: "fenetres",
  escalieteur: "menuisier",
  charpentier: "charpentier",
  cuisiniste: "cuisiniste",
  pisciniste: "pisciniste",
  // Supprimés (hors liste) — mappés au métier le plus proche par défaut
  courtier: "renovation",
  decorateur: "renovation",
  detailleur: "renovation",
  geometre: "renovation",
  "maitre-oeuvre": "renovation",
  architecte: "renovation",
};

/** Résout un ancien slug vers le slug officiel */
export function resolveLegacySlug(slug: string): string {
  return LEGACY_SLUG_MAP[slug] ?? slug;
}
