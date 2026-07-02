interface FaqItem {
  q: string;
  r: string;
}

interface BlocFaqProps {
  faq: FaqItem[];
  h2?: string;
}

/**
 * FAQ visuelle + JSON-LD FAQPage depuis les mêmes données.
 * Une seule source, aucune divergence possible.
 */
export default function BlocFaq({ faq, h2 = "Questions fréquentes" }: BlocFaqProps) {
  if (faq.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, r }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: r,
      },
    })),
  };

  return (
    <section className="mb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-6">{h2}</h2>

      <div className="space-y-4">
        {faq.map(({ q, r }, i) => (
          <details
            key={i}
            className="group border border-gray-200 rounded-lg overflow-hidden"
          >
            <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
              <h3 className="font-semibold text-gray-900 pr-4">{q}</h3>
              <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 text-lg leading-none">
                ▾
              </span>
            </summary>
            <div className="px-4 pb-4 pt-0 text-gray-600 leading-relaxed border-t border-gray-100">
              {r}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
