interface BlocSynonymeProps {
  h2: string;
  paragraphe: string;
}

/**
 * Section dédiée aux synonymes du métier.
 * Permet à Google d'associer les termes alternatifs (ex: "placo", "placoïste")
 * à la page officielle sans créer de pages séparées.
 */
export default function BlocSynonyme({ h2, paragraphe }: BlocSynonymeProps) {
  if (!h2 || !paragraphe) return null;

  return (
    <section className="mb-12 bg-orange-50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{h2}</h2>
      <p className="text-gray-700 leading-relaxed">{paragraphe}</p>
    </section>
  );
}
