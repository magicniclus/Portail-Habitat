/**
 * Page SEO — Niveaux 2 et 3 : Métier × Département ou Métier × Ville
 * Routes :
 *   /[metier]/[localite]  ex: /plombier/rhone  (département)
 *   /[metier]/[localite]  ex: /plombier/lyon   (ville)
 *
 * Résolution : le segment [localite] est d'abord testé comme slug de département,
 * puis comme slug de ville. 404 si aucune correspondance.
 *
 * Rendu : SSG (pages existantes) + ISR (revalidate 24h) + fallback "blocking"
 * HTML complet au premier octet — aucun fetch client.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoPageLayout from "@/components/seo/SeoPageLayout";
import {
  getPageSeo,
  buildPageSeoId,
  getArtisansByVille,
  getArtisansByDepartement,
  getAvisRecentsPourArtisans,
  getVilleBySlug,
  resolveLocaliteSlug,
  getVillesVoisinesActives,
  getVillesDepartementActives,
  buildTitle,
  buildDescription,
} from "@/lib/seo-utils";
import { findMetierBySlug, getMetiers } from "@/lib/metiers";
import type { VilleDoc } from "@/lib/seo-types";
import { adminDb } from "@/lib/firebase-admin";

// ─── ISR 24h ─────────────────────────────────────────────────────────────────
export const revalidate = 86400;

// ─── Pré-génération des pages publiées existantes ────────────────────────────
export async function generateStaticParams() {
  try {
    const snap = await adminDb
      .collection("pages_seo")
      .where("statut", "==", "publiee")
      .where("type", "in", ["ville", "departement"])
      .get();

    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        metier: d.metier_slug as string,
        localite: (d.ville_slug ?? d.departement_slug) as string,
      };
    });
  } catch {
    // En cas d'erreur (collection vide au build initial), retourner un tableau vide
    return [];
  }
}

// ─── Résolution interne ───────────────────────────────────────────────────────
async function resolvePageData(metierSlug: string, localiteSlug: string) {
  const metier = findMetierBySlug(metierSlug);
  if (!metier) return null;

  const resolved = await resolveLocaliteSlug(localiteSlug);
  if (!resolved) return null;

  if (resolved.type === "departement") {
    const dep = resolved.data as { code: string; slug: string; nom: string };
    const pageId = buildPageSeoId(metierSlug, "departement", dep.slug);
    const page = await getPageSeo(pageId);
    return { type: "departement" as const, metier, dep, page };
  }

  const ville = resolved.data as VilleDoc;
  const pageId = buildPageSeoId(metierSlug, "ville", ville.slug);
  const page = await getPageSeo(pageId);
  return { type: "ville" as const, metier, ville, page };
}

// ─── Métadonnées dynamiques ───────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ metier: string; localite: string }>;
}): Promise<Metadata> {
  const { metier: metierSlug, localite: localiteSlug } = await params;
  const data = await resolvePageData(metierSlug, localiteSlug);
  if (!data) return { title: "Page introuvable" };

  const { metier, page } = data;
  const nbArtisans = page?.nb_artisans ?? 0;

  const villeNom = data.type === "ville" ? data.ville.nom : undefined;
  const depNom =
    data.type === "departement" ? data.dep.nom : data.type === "ville" ? data.ville.departement_nom : undefined;

  const title = buildTitle(data.type, metier.nom, nbArtisans, villeNom, depNom);
  const description = buildDescription(data.type, metier.nom, nbArtisans, villeNom, depNom);
  const canonical = `https://portail-habitat.fr/${metierSlug}/${localiteSlug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Portail Habitat",
      type: "website",
    },
    robots:
      !page || page.statut === "noindex"
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function MetierLocalitePage({
  params,
}: {
  params: Promise<{ metier: string; localite: string }>;
}) {
  const { metier: metierSlug, localite: localiteSlug } = await params;
  const data = await resolvePageData(metierSlug, localiteSlug);
  if (!data || !data.page) notFound();

  const { metier, page } = data;

  // ── Page DÉPARTEMENT ────────────────────────────────────────────────────────
  if (data.type === "departement") {
    const [artisans, villesDuDepartement] = await Promise.all([
      getArtisansByDepartement(metierSlug, data.dep.code),
      getVillesDepartementActives(metierSlug, data.dep.code),
    ]);
    const avis = await getAvisRecentsPourArtisans(artisans.slice(0, 5).map((a) => a.id));

    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <SeoPageLayout
            type="departement"
            metier={{ slug: metier.slug, nom: metier.nom, synonymes: metier.synonymes }}
            departement={data.dep}
            page={page}
            artisans={artisans}
            avis={avis}
            villesDuDepartement={villesDuDepartement}
          />
        </main>
        <Footer />
      </>
    );
  }

  // ── Page VILLE ──────────────────────────────────────────────────────────────
  const { ville } = data;
  const [artisans, villesVoisines] = await Promise.all([
    getArtisansByVille(metierSlug, ville.code_insee),
    getVillesVoisinesActives(metierSlug, ville.departement_code, ville.slug),
  ]);
  const avis = await getAvisRecentsPourArtisans(artisans.slice(0, 5).map((a) => a.id));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <SeoPageLayout
          type="ville"
          metier={{ slug: metier.slug, nom: metier.nom, synonymes: metier.synonymes }}
          ville={ville}
          departement={{
            code: ville.departement_code,
            slug: ville.departement_slug,
            nom: ville.departement_nom,
          }}
          page={page}
          artisans={artisans}
          avis={avis}
          villesVoisines={villesVoisines}
        />
      </main>
      <Footer />
    </>
  );
}
