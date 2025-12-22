import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ artisanId: string }> }): Promise<Metadata> {
  const { artisanId } = await params;
  
  return {
    title: `Avis clients - Artisan | Portail Habitat`,
    description: `Consultez les avis vérifiés des clients sur cet artisan professionnel. Témoignages authentiques pour vous aider à choisir.`,
    openGraph: {
      title: `Avis clients - Artisan | Portail Habitat`,
      description: `Consultez les avis vérifiés des clients sur cet artisan professionnel.`,
      type: 'website',
      url: `https://portail-habitat.fr/avis/${artisanId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://portail-habitat.fr/avis/${artisanId}`,
    },
  };
}

export default function AvisArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
