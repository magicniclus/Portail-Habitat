import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulateur de Devis - Portail Habitat',
  description: 'Obtenez une estimation rapide et gratuite de vos travaux de rénovation avec notre simulateur de devis en ligne.',
  openGraph: {
    title: 'Simulateur de Devis - Portail Habitat',
    description: 'Obtenez une estimation rapide et gratuite de vos travaux de rénovation avec notre simulateur de devis en ligne.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SimulateurDevisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
