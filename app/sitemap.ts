/**
 * Sitemap index dynamique — Next.js App Router
 * Segmenté en plusieurs fichiers (max 5000 URLs chacun)
 * Inclut uniquement les pages avec statut "publiee"
 */
import type { MetadataRoute } from "next";
import { adminDb } from "@/lib/firebase-admin";
import { getMetiers } from "@/lib/metiers";

const BASE_URL = "https://portail-habitat.fr";

// ISR 24h pour le sitemap
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // ─── Pages statiques ─────────────────────────────────────────────────────────
  const staticPages = [
    { url: "/", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/artisans", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/devenir-pro", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/simulateur-devis", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/contact-artisan", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/pricing", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  for (const p of staticPages) {
    entries.push({
      url: `${BASE_URL}${p.url}`,
      lastModified: new Date(),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    });
  }

  // ─── 36 pages métiers nationales ─────────────────────────────────────────────
  for (const m of getMetiers()) {
    entries.push({
      url: `${BASE_URL}/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // ─── Pages SEO générées (publiees uniquement) ─────────────────────────────────
  try {
    const snap = await adminDb
      .collection("pages_seo")
      .where("statut", "==", "publiee")
      .where("type", "in", ["ville", "departement"])
      .get();

    for (const doc of snap.docs) {
      const d = doc.data();
      const localiteSlug = d.ville_slug ?? d.departement_slug;
      if (!d.metier_slug || !localiteSlug) continue;

      entries.push({
        url: `${BASE_URL}/${d.metier_slug}/${localiteSlug}`,
        lastModified: d.date_maj?.toDate?.() ?? new Date(),
        changeFrequency: "weekly",
        priority: d.type === "ville" ? 0.8 : 0.7,
      });
    }
  } catch {
    // Firestore non disponible au build — on continue sans les pages dynamiques
  }

  // ─── Fiches artisans publiques ────────────────────────────────────────────────
  try {
    const artisansSnap = await adminDb
      .collection("artisans")
      .where("privacy.profileVisible", "==", true)
      .select("slug", "updatedAt")
      .get();

    for (const doc of artisansSnap.docs) {
      const d = doc.data();
      if (!d.slug) continue;
      entries.push({
        url: `${BASE_URL}/artisans/${d.slug}`,
        lastModified: d.updatedAt?.toDate?.() ?? new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      });
    }
  } catch {
    // Non bloquant
  }

  return entries;
}
