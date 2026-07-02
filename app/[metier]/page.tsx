/**
 * Page SEO — Niveau 1 : Métier national
 * Route : /[metier]  ex: /plombier
 *
 * Rendu : SSG + ISR (revalidate 24h)
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
  getArtisansByMetier,
  getAvisRecentsPourArtisans,
  getDepartementsActifs,
  buildTitle,
  buildDescription,
} from "@/lib/seo-utils";
import { findMetierBySlug, getMetiers } from "@/lib/metiers";

// ─── ISR 24h ─────────────────────────────────────────────────────────────────
export const revalidate = 86400;

// ─── Pré-génération statique des 36 métiers ───────────────────────────────────
export async function generateStaticParams() {
  return getMetiers().map((m) => ({ metier: m.slug }));
}

// ─── Métadonnées dynamiques ───────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ metier: string }>;
}): Promise<Metadata> {
  const { metier: metierSlug } = await params;
  const metier = findMetierBySlug(metierSlug);
  if (!metier) return { title: "Page introuvable" };

  const pageId = buildPageSeoId(metierSlug, "national");
  const page = await getPageSeo(pageId);
  const nbArtisans = page?.nb_artisans ?? 0;

  const title = buildTitle("national", metier.nom, nbArtisans);
  const description = buildDescription("national", metier.nom, nbArtisans);

  return {
    title,
    description,
    alternates: { canonical: `https://portail-habitat.fr/${metierSlug}` },
    openGraph: {
      title,
      description,
      url: `https://portail-habitat.fr/${metierSlug}`,
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
export default async function MetierNationalPage({
  params,
}: {
  params: Promise<{ metier: string }>;
}) {
  const { metier: metierSlug } = await params;
  const metier = findMetierBySlug(metierSlug);
  if (!metier) notFound();

  const pageId = buildPageSeoId(metierSlug, "national");
  const page = await getPageSeo(pageId);

  if (!page) {
    // Page nationale non encore seedée — fallback minimal
    notFound();
  }

  const [artisans, departementsActifs] = await Promise.all([
    getArtisansByMetier(metierSlug),
    getDepartementsActifs(metierSlug),
  ]);

  const avis = await getAvisRecentsPourArtisans(artisans.slice(0, 5).map((a) => a.id));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <SeoPageLayout
          type="national"
          metier={{ slug: metier.slug, nom: metier.nom, synonymes: metier.synonymes }}
          page={page}
          artisans={artisans}
          avis={avis}
          departementsActifs={departementsActifs}
        />
      </main>
      <Footer />
    </>
  );
}
