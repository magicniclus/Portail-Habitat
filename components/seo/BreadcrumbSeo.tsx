import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo-types";

interface BreadcrumbSeoProps {
  items: BreadcrumbItem[];
}

/**
 * Fil d'Ariane visuel + JSON-LD BreadcrumbList.
 * Les données JSON-LD proviennent exactement des mêmes items que l'affichage.
 */
export default function BreadcrumbSeo({ items }: BreadcrumbSeoProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `https://portail-habitat.fr${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane" className="text-sm text-gray-500 py-3">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i < items.length - 1 ? (
                <>
                  <Link href={item.href} className="hover:text-orange-600 transition-colors">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-gray-300">
                    /
                  </span>
                </>
              ) : (
                <span className="text-gray-700 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
