import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Pour l'instant, utilisons des métadonnées basiques mais fonctionnelles
  // Le slug contient souvent des informations utiles qu'on peut extraire
  
  if (!params.slug || typeof params.slug !== 'string') {
    return {
      title: 'Artisan - Portail Habitat',
      description: 'Découvrez le profil de cet artisan professionnel.',
      robots: { index: false, follow: false },
    };
  }

  // Extraire des informations basiques du slug pour créer un titre plus descriptif
  const slugParts = params.slug.split('-');
  const possibleName = slugParts.length > 0 ? slugParts[0] : '';
  const possibleCompany = slugParts.length > 1 ? slugParts.slice(0, -1).join(' ') : '';
  
  // Créer un titre basique mais descriptif
  const title = possibleCompany 
    ? `${possibleCompany.charAt(0).toUpperCase() + possibleCompany.slice(1)} - Artisan professionnel | Portail Habitat`
    : `Artisan professionnel | Portail Habitat`;
    
  const description = `Découvrez le profil de cet artisan professionnel. Consultez ses réalisations, avis clients et demandez un devis gratuit.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://portail-habitat.fr/artisans/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://portail-habitat.fr/artisans/${params.slug}`,
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
