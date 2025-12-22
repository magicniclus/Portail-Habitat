import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique des avis clients - Portail Habitat',
  description: 'Notre politique de gestion des avis clients : transparence, authenticité et modération pour garantir des témoignages fiables.',
  openGraph: {
    title: 'Politique des avis clients - Portail Habitat',
    description: 'Notre politique de gestion des avis clients : transparence, authenticité et modération.',
    type: 'website',
    url: 'https://portail-habitat.fr/politique-avis',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://portail-habitat.fr/politique-avis',
  },
};

export default function PolitiqueAvisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
