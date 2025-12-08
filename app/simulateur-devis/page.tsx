"use client";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SimulatorHero from '@/components/SimulatorHero'
import ReviewsSection from '@/components/ReviewsSection'
import ResumeSimulatorModal from '@/components/ResumeSimulatorModal'
import TrustSection from '@/components/TrustSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import WhyPortailHabitat from '@/components/WhyPortailHabitat'
import SimulateDevisSection from '@/components/SimulateDevisSection'
import SimulatorProfessionsSection from '@/components/SimulatorProfessionsSection'
import AppSection from '@/components/AppSection'
import SimulatorTestimonialsSection from '@/components/SimulatorTestimonialsSection'
import Footer from '@/components/Footer'

export default function SimulateurDevisPage() {
  const router = useRouter()
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [savedData, setSavedData] = useState<any>(null)
  
  const STORAGE_KEY = 'simulator-data'

  // Fonction pour charger depuis localStorage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        // Vérifier que les données ne sont pas trop anciennes (24h)
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          return data
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    }
    return null
  }

  // Fonction pour effacer le localStorage
  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Erreur lors de l\'effacement:', error)
    }
  }

  // Vérifier s'il y a des données sauvegardées au montage
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored && stored.currentStep > 1) {
      setSavedData(stored)
      setShowResumeModal(true)
    }
  }, [])

  // Reprendre la simulation
  const handleResume = () => {
    if (savedData) {
      // Construire l'URL avec tous les paramètres
      const params = new URLSearchParams()
      
      if (savedData.postalCode) params.set('postalCode', savedData.postalCode)
      if (savedData.city) params.set('city', savedData.city)
      if (savedData.propertyType) params.set('propertyType', savedData.propertyType)
      if (savedData.selectedPrestation) params.set('prestation', savedData.selectedPrestation)
      if (savedData.prestationLevel) params.set('prestationLevel', savedData.prestationLevel)
      if (savedData.existingState) params.set('existingState', savedData.existingState)
      if (savedData.timeline) params.set('timeline', savedData.timeline)
      if (savedData.contactInfo?.firstName) params.set('firstName', savedData.contactInfo.firstName)
      if (savedData.contactInfo?.phone) params.set('phone', savedData.contactInfo.phone)
      if (savedData.contactInfo?.email) params.set('email', savedData.contactInfo.email)
      if (savedData.contactInfo?.acceptsCGV) params.set('acceptsCGV', savedData.contactInfo.acceptsCGV.toString())
      if (savedData.projectDetails?.surface) params.set('surface', savedData.projectDetails.surface.toString())
      if (savedData.projectDetails?.specificAnswers) params.set('answers', JSON.stringify(savedData.projectDetails.specificAnswers))
      
      params.set('step', savedData.currentStep.toString())
      
      router.push(`/simulateur-devis/steps?${params.toString()}`)
    }
    setShowResumeModal(false)
  }

  // Commencer une nouvelle simulation
  const handleStartNew = () => {
    clearStorage()
    setShowResumeModal(false)
    // Rester sur la page actuelle, pas de redirection
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section avec Navigation intégrée */}
      <SimulatorHero />

      {/* Section Avis Clients */}
      <TrustSection />

      {/* Section Comment ça fonctionne */}
      <HowItWorksSection />

      {/* Section Pourquoi Portail Habitat */}
      <WhyPortailHabitat />

      {/* Section Simuler Devis */}
      <SimulateDevisSection />

      {/* Section Professions Simulateur */}
      <SimulatorProfessionsSection />

      {/* Section Application Mobile */}
      <AppSection />

      {/* Section Témoignages Simulateur */}
      <SimulatorTestimonialsSection />

      {/* Footer */}
      <Footer />

      {/* Modal de reprise */}
      {savedData && (
        <ResumeSimulatorModal
          isOpen={showResumeModal}
          onResume={handleResume}
          onStartNew={handleStartNew}
          savedData={savedData}
        />
      )}
    </div>
  )
}