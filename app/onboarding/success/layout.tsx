import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription réussie - Portail Habitat',
  description: 'Bienvenue sur Portail Habitat ! Votre compte artisan a été créé avec succès.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
