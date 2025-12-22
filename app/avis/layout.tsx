import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avis clients - Artisans certifiés | Portail Habitat',
  description: 'Consultez les avis vérifiés de nos clients sur les artisans partenaires. Témoignages authentiques pour choisir le bon professionnel.',
  openGraph: {
    title: 'Avis clients - Artisans certifiés | Portail Habitat',
    description: 'Consultez les avis vérifiés de nos clients sur les artisans partenaires.',
    type: 'website',
    url: 'https://portail-habitat.fr/avis',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://portail-habitat.fr/avis',
  },
};

export default function AvisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
