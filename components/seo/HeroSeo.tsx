import { Badge } from "@/components/ui/badge";
import type { SeoPageType } from "@/lib/seo-types";

interface HeroSeoProps {
  h1: string;
  intro: string;
  nbArtisans: number;
  type: SeoPageType;
  metierNom: string;
  villeNom?: string;
  depNom?: string;
}

export default function HeroSeo({
  h1,
  intro,
  nbArtisans,
  type,
  metierNom,
  villeNom,
  depNom,
}: HeroSeoProps) {
  const s = nbArtisans > 1 ? "s" : "";

  return (
    <section className="bg-gradient-to-br from-orange-50 to-white py-10 px-4 rounded-xl mb-8">
      <div className="max-w-3xl">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {nbArtisans} artisan{s} vérifié{s}
          </Badge>
          {type === "ville" && villeNom && (
            <Badge variant="outline">{villeNom}</Badge>
          )}
          {type === "departement" && depNom && (
            <Badge variant="outline">{depNom}</Badge>
          )}
          {type === "national" && (
            <Badge variant="outline">Partout en France</Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {h1}
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">{intro}</p>
      </div>
    </section>
  );
}
