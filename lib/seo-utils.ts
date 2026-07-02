/**
 * Fonctions de lecture Firestore pour les pages SEO.
 * Utilise Firebase Admin SDK (server-side uniquement).
 * Règle : max 3 requêtes Firestore par page.
 */

import { adminDb } from "@/lib/firebase-admin";
import { findMetierBySlug } from "@/lib/metiers";
import type {
  PageSeoDoc,
  ArtisanSeoCard,
  AvisSeo,
  VilleDoc,
  SeoPageType,
} from "@/lib/seo-types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDate(v: unknown): Date {
  if (!v) return new Date();
  if (v instanceof Date) return v;
  if (typeof v === "object" && "toDate" in (v as object)) {
    return (v as { toDate: () => Date }).toDate();
  }
  return new Date(v as string | number);
}

// ─── Pages SEO ────────────────────────────────────────────────────────────────

export async function getPageSeo(id: string): Promise<PageSeoDoc | null> {
  const snap = await adminDb.collection("pages_seo").doc(id).get();
  if (!snap.exists) return null;
  const d = snap.data()!;
  return {
    id: snap.id,
    type: d.type as SeoPageType,
    metier_id: d.metier_id,
    metier_slug: d.metier_slug,
    metier_nom: d.metier_nom,
    ville_code_insee: d.ville_code_insee,
    ville_slug: d.ville_slug,
    ville_nom: d.ville_nom,
    departement_code: d.departement_code,
    departement_slug: d.departement_slug,
    departement_nom: d.departement_nom,
    statut: d.statut,
    nb_artisans: d.nb_artisans ?? 0,
    contenu_ia: d.contenu_ia ?? { intro: "", faq: [] },
    date_creation: toDate(d.date_creation),
    date_maj: toDate(d.date_maj),
  };
}

export function buildPageSeoId(
  metierSlug: string,
  type: SeoPageType,
  localiteSlug?: string
): string {
  if (type === "national") return `${metierSlug}__national`;
  if (type === "departement") return `${metierSlug}__dep__${localiteSlug}`;
  return `${metierSlug}__${localiteSlug}`;
}

// ─── Artisans ─────────────────────────────────────────────────────────────────

export async function getArtisansByVille(
  metierSlug: string,
  codeInsee: string,
  limit = 20
): Promise<ArtisanSeoCard[]> {
  const snap = await adminDb
    .collection("artisans")
    .where("privacy.profileVisible", "==", true)
    .where("communes_couvertes", "array-contains", codeInsee)
    .where("profession", "==", metierSlug)
    .limit(limit)
    .get();

  return snap.docs.map((doc) => mapArtisanDoc(doc.id, doc.data()));
}

export async function getArtisansByDepartement(
  metierSlug: string,
  depCode: string,
  limit = 20
): Promise<ArtisanSeoCard[]> {
  const snap = await adminDb
    .collection("artisans")
    .where("privacy.profileVisible", "==", true)
    .where("departement_code", "==", depCode)
    .where("profession", "==", metierSlug)
    .limit(limit)
    .get();

  return snap.docs.map((doc) => mapArtisanDoc(doc.id, doc.data()));
}

export async function getArtisansByMetier(
  metierSlug: string,
  limit = 20
): Promise<ArtisanSeoCard[]> {
  const snap = await adminDb
    .collection("artisans")
    .where("privacy.profileVisible", "==", true)
    .where("profession", "==", metierSlug)
    .limit(limit)
    .get();

  return snap.docs.map((doc) => mapArtisanDoc(doc.id, doc.data()));
}

function mapArtisanDoc(id: string, d: FirebaseFirestore.DocumentData): ArtisanSeoCard {
  const pf = d.premiumFeatures ?? {};
  return {
    id,
    slug: d.slug ?? id,
    companyName: d.companyName ?? "",
    firstName: d.firstName ?? "",
    lastName: d.lastName ?? "",
    city: d.city ?? "",
    profession: d.profession ?? "",
    description: d.description ?? "",
    logoUrl: d.logoUrl,
    coverUrl: d.coverUrl,
    averageRating: d.averageRating ?? 0,
    reviewCount: d.reviewCount ?? 0,
    averageQuoteMin: d.averageQuoteMin,
    averageQuoteMax: d.averageQuoteMax,
    isPremium: pf.isPremium === true,
    showTopArtisanBadge: pf.showTopArtisanBadge === true,
    certifications: d.certifications ?? [],
  };
}

// ─── Avis récents ─────────────────────────────────────────────────────────────

export async function getAvisRecentsPourArtisans(
  artisanIds: string[],
  limit = 5
): Promise<AvisSeo[]> {
  if (artisanIds.length === 0) return [];

  const ids = artisanIds.slice(0, 10);
  const allAvis: AvisSeo[] = [];

  for (const artisanId of ids) {
    if (allAvis.length >= limit) break;
    const snap = await adminDb
      .collection("artisans")
      .doc(artisanId)
      .collection("reviews")
      .where("displayed", "==", true)
      .orderBy("createdAt", "desc")
      .limit(2)
      .get();

    for (const doc of snap.docs) {
      if (allAvis.length >= limit) break;
      const d = doc.data();
      allAvis.push({
        id: doc.id,
        rating: d.rating ?? 5,
        comment: d.comment ?? "",
        clientName: d.clientName ?? "Client",
        createdAt: toDate(d.createdAt),
        artisanName: "",
      });
    }
  }

  return allAvis;
}

// ─── Villes ───────────────────────────────────────────────────────────────────

export async function getVilleBySlug(slug: string): Promise<VilleDoc | null> {
  const snap = await adminDb
    .collection("villes")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { code_insee: doc.id, ...doc.data() } as VilleDoc;
}

export async function getVilleByCodeInsee(codeInsee: string): Promise<VilleDoc | null> {
  const snap = await adminDb.collection("villes").doc(codeInsee).get();
  if (!snap.exists) return null;
  return { code_insee: snap.id, ...snap.data() } as VilleDoc;
}

// ─── Maillage local ───────────────────────────────────────────────────────────

export async function getVillesVoisinesActives(
  metierSlug: string,
  departementCode: string,
  excludeVilleSlug: string,
  limit = 8
): Promise<{ nom: string; slug: string; nbArtisans: number }[]> {
  const snap = await adminDb
    .collection("pages_seo")
    .where("metier_slug", "==", metierSlug)
    .where("departement_code", "==", departementCode)
    .where("statut", "==", "publiee")
    .where("type", "==", "ville")
    .limit(limit + 1)
    .get();

  return snap.docs
    .filter((d) => d.data().ville_slug !== excludeVilleSlug)
    .slice(0, limit)
    .map((d) => ({
      nom: d.data().ville_nom ?? "",
      slug: d.data().ville_slug ?? "",
      nbArtisans: d.data().nb_artisans ?? 0,
    }));
}

export async function getVillesDepartementActives(
  metierSlug: string,
  departementCode: string
): Promise<{ nom: string; slug: string; nbArtisans: number }[]> {
  const snap = await adminDb
    .collection("pages_seo")
    .where("metier_slug", "==", metierSlug)
    .where("departement_code", "==", departementCode)
    .where("statut", "==", "publiee")
    .where("type", "==", "ville")
    .orderBy("nb_artisans", "desc")
    .get();

  return snap.docs.map((d) => ({
    nom: d.data().ville_nom ?? "",
    slug: d.data().ville_slug ?? "",
    nbArtisans: d.data().nb_artisans ?? 0,
  }));
}

export async function getDepartementsActifs(
  metierSlug: string
): Promise<{ nom: string; slug: string; nbArtisans: number }[]> {
  const snap = await adminDb
    .collection("pages_seo")
    .where("metier_slug", "==", metierSlug)
    .where("statut", "==", "publiee")
    .where("type", "==", "departement")
    .orderBy("nb_artisans", "desc")
    .get();

  return snap.docs.map((d) => ({
    nom: d.data().departement_nom ?? "",
    slug: d.data().departement_slug ?? "",
    nbArtisans: d.data().nb_artisans ?? 0,
  }));
}

// ─── Slug vers données de contexte ───────────────────────────────────────────

export async function resolveLocaliteSlug(
  slug: string
): Promise<{ type: "departement" | "ville"; data: VilleDoc | { code: string; slug: string; nom: string } } | null> {
  // 1. Chercher comme département dans la collection villes
  const depSnap = await adminDb
    .collection("villes")
    .where("departement_slug", "==", slug)
    .limit(1)
    .get();
  if (!depSnap.empty) {
    const d = depSnap.docs[0].data();
    return {
      type: "departement",
      data: {
        code: d.departement_code,
        slug: d.departement_slug,
        nom: d.departement_nom,
      },
    };
  }

  // 2. Chercher comme ville
  const ville = await getVilleBySlug(slug);
  if (ville) return { type: "ville", data: ville };

  return null;
}

// ─── Utilitaires titre / description ─────────────────────────────────────────

export function buildTitle(
  type: SeoPageType,
  metierNom: string,
  nbArtisans: number,
  villeNom?: string,
  depNom?: string
): string {
  const n = nbArtisans;
  const s = n > 1 ? "s" : "";
  const siteName = "Portail Habitat";

  if (type === "ville" && villeNom) {
    const core = `${metierNom} à ${villeNom} : ${n} artisan${s} vérifié${s} — Devis gratuit`;
    const full = `${core} | ${siteName}`;
    return full.length > 65 ? `${core.slice(0, 60)}… | ${siteName}` : full;
  }
  if (type === "departement" && depNom) {
    return `${metierNom} en ${depNom} : artisans vérifiés par ville | ${siteName}`;
  }
  return `${metierNom} : trouvez un artisan vérifié près de chez vous | ${siteName}`;
}

export function buildDescription(
  type: SeoPageType,
  metierNom: string,
  nbArtisans: number,
  villeNom?: string,
  depNom?: string
): string {
  const n = nbArtisans;
  const s = n > 1 ? "s" : "";
  const metierMin = metierNom.toLowerCase();

  if (type === "ville" && villeNom) {
    return `Trouvez un ${metierMin} à ${villeNom} parmi ${n} professionnel${s} au SIRET vérifié. Avis clients, devis gratuit et sans engagement.`;
  }
  if (type === "departement" && depNom) {
    return `Trouvez un ${metierMin} en ${depNom}. Comparez les artisans par ville, consultez les avis et demandez votre devis gratuit.`;
  }
  return `Trouvez un ${metierMin} vérifié partout en France. Comparez les avis, consultez les fiches et demandez un devis gratuit et sans engagement.`;
}

export function buildH1(
  type: SeoPageType,
  metierNom: string,
  nbArtisans: number,
  villeNom?: string,
  depNom?: string
): string {
  const n = nbArtisans;
  const s = n > 1 ? "s" : "";

  if (type === "ville" && villeNom) {
    return `${metierNom} à ${villeNom} — ${n} artisan${s} vérifié${s}`;
  }
  if (type === "departement" && depNom) {
    return `${metierNom} en ${depNom} — Artisans vérifiés par ville`;
  }
  return `${metierNom} — Trouvez un artisan vérifié près de chez vous`;
}

/** Trie les artisans : Top Artisan premium d'abord, puis note, puis nb avis */
export function sortArtisansSeo(artisans: ArtisanSeoCard[]): ArtisanSeoCard[] {
  return [...artisans].sort((a, b) => {
    if (a.showTopArtisanBadge && !b.showTopArtisanBadge) return -1;
    if (!a.showTopArtisanBadge && b.showTopArtisanBadge) return 1;
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    const rDiff = b.averageRating - a.averageRating;
    if (rDiff !== 0) return rDiff;
    return b.reviewCount - a.reviewCount;
  });
}
