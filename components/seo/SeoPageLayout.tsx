import { sortArtisansSeo } from "@/lib/seo-utils";
import type { SeoPageProps, BreadcrumbItem } from "@/lib/seo-types";
import BreadcrumbSeo from "./BreadcrumbSeo";
import HeroSeo from "./HeroSeo";
import ListeArtisans from "./ListeArtisans";
import FormulaireDevisBloc from "./FormulaireDevisBloc";
import BlocSynonyme from "./BlocSynonyme";
import AvisRecents from "./AvisRecents";
import BlocFaq from "./BlocFaq";
import MaillageLocal from "./MaillageLocal";

/**
 * TEMPLATE UNIQUE pour toutes les pages SEO.
 * Assemble les blocs dans le bon ordre selon le type (national / département / ville).
 * Aucune page ne duplique du markup — corriger ce fichier corrige toutes les pages.
 */
export default function SeoPageLayout({
  type,
  metier,
  ville,
  departement,
  page,
  artisans,
  avis,
  villesVoisines,
  villesDuDepartement,
  departementsActifs,
}: SeoPageProps) {
  const sortedArtisans = sortArtisansSeo(artisans);
  const villeNom = ville?.nom;
  const depNom = departement?.nom ?? ville?.departement_nom;
  const depSlug = departement?.slug ?? ville?.departement_slug;

  const localiteNom = villeNom ?? depNom;

  // ─── Breadcrumb ──────────────────────────────────────────────────────────────
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Accueil", href: "/" }];
  breadcrumbs.push({ label: metier.nom, href: `/${metier.slug}` });

  if (type === "departement" && departement) {
    breadcrumbs.push({
      label: departement.nom,
      href: `/${metier.slug}/${departement.slug}`,
    });
  }

  if (type === "ville" && ville) {
    if (departement || ville.departement_slug) {
      breadcrumbs.push({
        label: depNom ?? "",
        href: `/${metier.slug}/${depSlug}`,
      });
    }
    breadcrumbs.push({
      label: ville.nom,
      href: `/${metier.slug}/${ville.slug}`,
    });
  }

  // ─── H1 ──────────────────────────────────────────────────────────────────────
  const nbArtisans = page.nb_artisans;
  const s = nbArtisans > 1 ? "s" : "";
  let h1 = "";
  if (type === "ville" && villeNom) {
    h1 = `${metier.nom} à ${villeNom} — ${nbArtisans} artisan${s} vérifié${s}`;
  } else if (type === "departement" && depNom) {
    h1 = `${metier.nom} en ${depNom} — Artisans vérifiés par ville`;
  } else {
    h1 = `${metier.nom} — Trouvez un artisan vérifié près de chez vous`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BreadcrumbSeo items={breadcrumbs} />

      <HeroSeo
        h1={h1}
        intro={page.contenu_ia.intro}
        nbArtisans={nbArtisans}
        type={type}
        metierNom={metier.nom}
        villeNom={villeNom}
        depNom={depNom}
      />

      {/* Page nationale : prix moyens avant la liste des départements */}
      {type === "national" && (
        <MaillageLocal
          type="national"
          metierSlug={metier.slug}
          metierNom={metier.nom}
          departementsActifs={departementsActifs}
        />
      )}

      {/* Liste artisans — présente sur toutes les pages */}
      <ListeArtisans
        artisans={sortedArtisans}
        metierNom={metier.nom}
        localiteNom={localiteNom}
      />

      {/* Formulaire de devis */}
      <FormulaireDevisBloc
        metierNom={metier.nom}
        localiteNom={localiteNom}
        metierSlug={metier.slug}
        villeSlug={ville?.slug}
      />

      {/* Synonymes */}
      {page.contenu_ia.h2_synonyme && page.contenu_ia.paragraphe_synonyme && (
        <BlocSynonyme
          h2={page.contenu_ia.h2_synonyme}
          paragraphe={page.contenu_ia.paragraphe_synonyme}
        />
      )}

      {/* Avis récents */}
      <AvisRecents avis={avis} metierNom={metier.nom} localiteNom={localiteNom} />

      {/* FAQ */}
      <BlocFaq faq={page.contenu_ia.faq} />

      {/* Maillage local — ville et département */}
      {type === "ville" && (
        <MaillageLocal
          type="ville"
          metierSlug={metier.slug}
          metierNom={metier.nom}
          localiteNom={villeNom}
          depSlug={depSlug}
          depNom={depNom}
          villesVoisines={villesVoisines}
        />
      )}
      {type === "departement" && (
        <MaillageLocal
          type="departement"
          metierSlug={metier.slug}
          metierNom={metier.nom}
          villesDuDepartement={villesDuDepartement}
        />
      )}
    </div>
  );
}
