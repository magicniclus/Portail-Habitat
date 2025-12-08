import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Pour l'instant, on utilise des métadonnées génériques
  // Plus tard, on pourra récupérer les vraies données de l'artisan
  
  return {
    title: `Artisan ${params.slug} - Portail Habitat`,
    description: `Découvrez le profil de cet artisan professionnel. Consultez ses réalisations, avis clients et demandez un devis gratuit.`,
    openGraph: {
      title: `Artisan ${params.slug} - Portail Habitat`,
      description: `Découvrez le profil de cet artisan professionnel. Consultez ses réalisations, avis clients et demandez un devis gratuit.`,
      type: 'website',
      url: `https://portail-habitat.fr/artisan/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://portail-habitat.fr/artisan/${params.slug}`,
    },
  };
}

export default function ArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}