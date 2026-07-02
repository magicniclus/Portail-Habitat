import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AvisSeo } from "@/lib/seo-types";

interface AvisRecentsProps {
  avis: AvisSeo[];
  metierNom: string;
  localiteNom?: string;
}

/** Bloc entièrement masqué si aucun avis. */
export default function AvisRecents({ avis, metierNom, localiteNom }: AvisRecentsProps) {
  if (avis.length === 0) return null;

  const titre = localiteNom
    ? `Avis récents sur nos ${metierNom.toLowerCase()}s à ${localiteNom}`
    : `Avis récents sur nos ${metierNom.toLowerCase()}s`;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{titre}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {avis.map((a) => (
          <Card key={a.id} className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= a.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-4">
                &ldquo;{a.comment}&rdquo;
              </p>
              <p className="text-xs text-gray-500 font-medium">
                — {a.clientName}
                {a.artisanName && (
                  <span className="text-gray-400"> · {a.artisanName}</span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
