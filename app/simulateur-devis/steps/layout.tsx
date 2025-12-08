import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulateur de Devis - Étapes | Portail Habitat',
  description: 'Estimez le coût de vos travaux de rénovation étape par étape. Simulation gratuite et sans engagement.',
  keywords: 'simulateur devis, estimation travaux, rénovation, prix artisan',
  openGraph: {
    title: 'Simulateur de Devis - Étapes | Portail Habitat',
    description: 'Estimez le coût de vos travaux de rénovation étape par étape. Simulation gratuite et sans engagement.',
    url: 'https://portail-habitat.fr/simulateur-devis/steps',
    siteName: 'Portail Habitat',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://portail-habitat.fr/simulateur-devis/steps'
  }
}

export default function SimulatorStepsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
