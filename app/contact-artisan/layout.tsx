import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacter un artisan - Portail Habitat',
  description: 'Contactez directement un artisan professionnel pour votre projet de rénovation. Recevez une réponse rapide et un devis personnalisé.',
  openGraph: {
    title: 'Contacter un artisan - Portail Habitat',
    description: 'Contactez directement un artisan professionnel pour votre projet de rénovation.',
    type: 'website',
    url: 'https://portail-habitat.fr/contact-artisan',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://portail-habitat.fr/contact-artisan',
  },
};

export default function ContactArtisanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
