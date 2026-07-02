import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TopArtisanBadge from "@/components/TopArtisanBadge";
import type { ArtisanSeoCard } from "@/lib/seo-types";

interface ListeArtisansProps {
  artisans: ArtisanSeoCard[];
  metierNom: string;
  localiteNom?: string;
  h2?: string;
}

/**
 * Liste des cartes artisans + JSON-LD ItemList.
 * Tri : Top Artisan d'abord, puis note décroissante.
 * Chaque carte contient un vrai <a> vers la fiche.
 */
export default function ListeArtisans({
  artisans,
  metierNom,
  localiteNom,
  h2,
}: ListeArtisansProps) {
  if (artisans.length === 0) return null;

  const titre =
    h2 ??
    (localiteNom
      ? `Les ${metierNom.toLowerCase()}s disponibles à ${localiteNom}`
      : `Les ${metierNom.toLowerCase()}s vérifiés`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: titre,
    numberOfItems: artisans.length,
    itemListElement: artisans.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.companyName || `${a.firstName} ${a.lastName}`,
      url: `https://portail-habitat.fr/artisans/${a.slug}`,
    })),
  };

  return (
    <section className="mb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-6">{titre}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </div>
    </section>
  );
}

function ArtisanCard({ artisan }: { artisan: ArtisanSeoCard }) {
  const displayName = artisan.companyName || `${artisan.firstName} ${artisan.lastName}`;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative h-36 bg-gray-100">
        {artisan.showTopArtisanBadge && (
          <div className="absolute top-2 right-2 z-10">
            <TopArtisanBadge size="sm" variant="compact" />
          </div>
        )}
        {artisan.coverUrl ? (
          <Image
            src={artisan.coverUrl}
            alt={`Couverture ${displayName}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
            <span className="text-3xl font-bold text-orange-400">{initials}</span>
          </div>
        )}
        {artisan.logoUrl && (
          <div className="absolute bottom-3 left-3">
            <div className="w-12 h-12 rounded-full bg-white shadow border-2 border-white overflow-hidden">
              <Image
                src={artisan.logoUrl}
                alt={`Logo ${displayName}`}
                width={48}
                height={48}
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 leading-snug">{displayName}</h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{artisan.city}</span>
        </div>

        {artisan.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3.5 w-3.5 ${
                  s <= artisan.averageRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {artisan.averageRating.toFixed(1)} ({artisan.reviewCount} avis)
            </span>
          </div>
        )}

        {(artisan.averageQuoteMin || artisan.averageQuoteMax) && (
          <p className="text-xs text-gray-500 mb-3">
            Devis estimé :{" "}
            {artisan.averageQuoteMin && artisan.averageQuoteMax
              ? `${artisan.averageQuoteMin} – ${artisan.averageQuoteMax} €`
              : artisan.averageQuoteMin
              ? `à partir de ${artisan.averageQuoteMin} €`
              : `jusqu'à ${artisan.averageQuoteMax} €`}
          </p>
        )}

        {artisan.certifications && artisan.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {artisan.certifications.slice(0, 2).map((c) => (
              <Badge key={c} variant="outline" className="text-xs flex items-center gap-1">
                <BadgeCheck className="h-3 w-3 text-green-600" />
                {c}
              </Badge>
            ))}
          </div>
        )}

        <Button asChild size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
          <a href={`/artisans/${artisan.slug}`}>Voir la fiche</a>
        </Button>
      </CardContent>
    </Card>
  );
}
