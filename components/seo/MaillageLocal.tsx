import Link from "next/link";
import { Users } from "lucide-react";
import type { SeoPageType } from "@/lib/seo-types";

interface MaillageLocalProps {
  type: SeoPageType;
  metierSlug: string;
  metierNom: string;
  localiteNom?: string;
  depSlug?: string;
  depNom?: string;
  /** Villes voisines actives (même métier, même département) */
  villesVoisines?: { nom: string; slug: string; nbArtisans: number }[];
  /** Villes actives du département (pour page département) */
  villesDuDepartement?: { nom: string; slug: string; nbArtisans: number }[];
  /** Départements actifs (pour page nationale) */
  departementsActifs?: { nom: string; slug: string; nbArtisans: number }[];
}

/**
 * Liens internes de maillage SEO.
 * Tous les liens sont de vrais <a href>, jamais de navigation JS.
 */
export default function MaillageLocal({
  type,
  metierSlug,
  metierNom,
  localiteNom,
  depSlug,
  depNom,
  villesVoisines,
  villesDuDepartement,
  departementsActifs,
}: MaillageLocalProps) {
  if (type === "ville") {
    const hasVoisines = villesVoisines && villesVoisines.length > 0;
    if (!hasVoisines && !depSlug) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Autour de {localiteNom}
        </h2>

        {depSlug && depNom && (
          <p className="text-gray-600 mb-4">
            <Link
              href={`/${metierSlug}/${depSlug}`}
              className="text-orange-600 hover:underline font-medium"
            >
              ← Voir tous les {metierNom.toLowerCase()}s en {depNom}
            </Link>
          </p>
        )}

        {hasVoisines && (
          <div className="flex flex-wrap gap-3">
            {villesVoisines!.map((v) => (
              <Link
                key={v.slug}
                href={`/${metierSlug}/${v.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
              >
                {v.nom}
                <span className="text-xs text-gray-400">({v.nbArtisans})</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    );
  }

  if (type === "departement") {
    const hasCities = villesDuDepartement && villesDuDepartement.length > 0;
    if (!hasCities) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez votre ville
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          {villesDuDepartement!.length} ville{villesDuDepartement!.length > 1 ? "s" : ""}{" "}
          avec des {metierNom.toLowerCase()}s vérifiés
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {villesDuDepartement!.map((v) => (
            <Link
              key={v.slug}
              href={`/${metierSlug}/${v.slug}`}
              className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-orange-400 hover:text-orange-600 transition-colors"
            >
              <span className="font-medium truncate">{v.nom}</span>
              <span className="ml-2 text-xs text-gray-400 flex-shrink-0 flex items-center gap-0.5">
                <Users className="h-3 w-3" />
                {v.nbArtisans}
              </span>
            </Link>
          ))}
        </div>

        <p className="text-gray-600 mt-6">
          <Link
            href={`/${metierSlug}`}
            className="text-orange-600 hover:underline"
          >
            ← Voir tous les {metierNom.toLowerCase()}s en France
          </Link>
        </p>
      </section>
    );
  }

  // national
  const hasDeps = departementsActifs && departementsActifs.length > 0;
  if (!hasDeps) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Trouvez un {metierNom.toLowerCase()} dans votre département
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        {departementsActifs!.length} département{departementsActifs!.length > 1 ? "s" : ""} couverts
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {departementsActifs!.map((d) => (
          <Link
            key={d.slug}
            href={`/${metierSlug}/${d.slug}`}
            className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-orange-400 hover:text-orange-600 transition-colors"
          >
            <span className="font-medium truncate">{d.nom}</span>
            <span className="ml-2 text-xs text-gray-400 flex-shrink-0 flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              {d.nbArtisans}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
