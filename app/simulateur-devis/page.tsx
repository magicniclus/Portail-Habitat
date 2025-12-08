import SimulatorHero from '@/components/SimulatorHero'
import ReviewsSection from '@/components/ReviewsSection'

export default function SimulateurDevisPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section avec Navigation intégrée */}
      <SimulatorHero />

      {/* Section Avis Clients */}
      <ReviewsSection />
    </div>
  )
}