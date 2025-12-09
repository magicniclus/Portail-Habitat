"use client";
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import SimulatorTemplate from '@/components/SimulatorTemplate'
import PostalCodeStep from '@/components/simulator-steps/PostalCodeStep'
import PropertyTypeStep from '@/components/simulator-steps/PropertyTypeStep'
import ProjectDetailsStep from '@/components/simulator-steps/ProjectDetailsStep'
import PrestationLevelStep from '@/components/simulator-steps/PrestationLevelStep'
import ExistingStateStep from '@/components/simulator-steps/ExistingStateStep'
import TimelineStep from '@/components/simulator-steps/TimelineStep'
import ContactFormStep from '@/components/simulator-steps/ContactFormStep'
import ResultsStep from '@/components/simulator-steps/ResultsStep'
import { renovationPrestations } from '@/lib/renovation-suggestions'

interface ProjectDetails {
  surface?: number
  specificAnswers?: { [key: string]: any }
}

interface ContactInfo {
  firstName: string
  phone: string
  email: string
  acceptsCGV: boolean
}

interface SimulatorData {
  postalCode?: string
  city?: string
  propertyType?: string
  selectedPrestation?: string
  projectDetails?: ProjectDetails
  prestationLevel?: string
  existingState?: string
  timeline?: string
  contactInfo?: ContactInfo
}

// Fonction pour convertir un nom de prestation en slug
const findPrestationSlug = (nameOrSlug: string): string => {
  // D'abord essayer de trouver par slug exact
  const bySlug = renovationPrestations.find(p => p.slug === nameOrSlug)
  if (bySlug) return nameOrSlug

  // Sinon essayer de trouver par nom exact
  const byName = renovationPrestations.find(p => p.nom === nameOrSlug)
  if (byName) return byName.slug

  // Recherche approximative par nom (tolérance aux fautes)
  const normalizedInput = nameOrSlug.toLowerCase().trim()
  const approximateMatch = renovationPrestations.find(p => 
    p.nom.toLowerCase().includes(normalizedInput) || 
    normalizedInput.includes(p.nom.toLowerCase())
  )
  if (approximateMatch) return approximateMatch.slug

  // En dernier recours, retourner tel quel
  return nameOrSlug
}

function SimulatorStepsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [simulatorData, setSimulatorData] = useState<SimulatorData>({})
  
  // Clé pour le localStorage
  const STORAGE_KEY = 'simulator-data'

  // Fonction pour valider quelle étape est accessible selon les données
  const getValidStep = (data: SimulatorData): number => {
    if (!data.postalCode || !data.city) return 1
    if (!data.propertyType) return 2
    if (!data.selectedPrestation || !data.projectDetails) return 3
    if (!data.prestationLevel) return 4
    if (!data.existingState) return 5
    if (!data.timeline) return 6
    if (!data.contactInfo?.firstName || !data.contactInfo?.phone || !data.contactInfo?.email || !data.contactInfo?.acceptsCGV) return 7
    return 8 // Toutes les données sont présentes
  }

  // Fonction pour sauvegarder dans localStorage
  const saveToStorage = (data: SimulatorData, step: number) => {
    try {
      const storageData = {
        ...data,
        currentStep: step,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

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

  // Fonction pour mettre à jour l'URL avec les paramètres
  const updateURL = (newData: Partial<SimulatorData>, step?: number, resetProjectDetails?: boolean) => {
    const params = new URLSearchParams()
    
    // Si on change de prestation, on repart à zéro sauf pour les données de base
    if (newData.selectedPrestation) {
      // Nouvelle prestation : on garde seulement les données de base
      if (newData.postalCode || searchParams.get('postalCode')) {
        params.set('postalCode', newData.postalCode || searchParams.get('postalCode')!)
      }
      if (newData.city || searchParams.get('city')) {
        params.set('city', newData.city || searchParams.get('city')!)
      }
      if (newData.propertyType || searchParams.get('propertyType')) {
        params.set('propertyType', newData.propertyType || searchParams.get('propertyType')!)
      }
      if (newData.selectedPrestation) {
        params.set('prestation', newData.selectedPrestation)
      }
      if (searchParams.get('project')) {
        params.set('project', searchParams.get('project')!)
      }
      // On repart à l'étape 1 si on change de prestation
      params.set('step', '1')
    } else {
      // Mise à jour normale : on conserve tout et on met à jour
      const currentParams = new URLSearchParams(searchParams.toString())
      
      if (newData.postalCode) currentParams.set('postalCode', newData.postalCode)
      if (newData.city) currentParams.set('city', newData.city)
      if (newData.propertyType) currentParams.set('propertyType', newData.propertyType)
      if (newData.prestationLevel) currentParams.set('prestationLevel', newData.prestationLevel)
      if (newData.existingState) currentParams.set('existingState', newData.existingState)
      if (newData.timeline) currentParams.set('timeline', newData.timeline)
      if (newData.contactInfo) {
        currentParams.set('firstName', newData.contactInfo.firstName)
        currentParams.set('phone', newData.contactInfo.phone)
        currentParams.set('email', newData.contactInfo.email)
        currentParams.set('acceptsCGV', newData.contactInfo.acceptsCGV.toString())
      }
      
      if (resetProjectDetails) {
        // Supprimer les détails du projet si on revient en arrière
        currentParams.delete('surface')
        currentParams.delete('answers')
      } else if (newData.projectDetails) {
        if (newData.projectDetails.surface) {
          currentParams.set('surface', newData.projectDetails.surface.toString())
        }
        if (newData.projectDetails.specificAnswers) {
          currentParams.set('answers', JSON.stringify(newData.projectDetails.specificAnswers))
        }
      }
      
      if (step) currentParams.set('step', step.toString())
      
      // Copier seulement les paramètres nécessaires
      const allowedParams = ['postalCode', 'city', 'propertyType', 'prestation', 'project', 'surface', 'answers', 'prestationLevel', 'existingState', 'timeline', 'firstName', 'phone', 'email', 'acceptsCGV', 'step']
      currentParams.forEach((value, key) => {
        if (allowedParams.includes(key) && value) {
          params.set(key, value)
        }
      })
    }
    
    // Valider l'étape demandée avec les données disponibles
    const mergedData = { ...simulatorData, ...newData }
    const validStep = getValidStep(mergedData)
    const requestedStep = step || currentStep
    
    // Si l'étape demandée n'est pas valide, rediriger vers la bonne étape
    if (requestedStep > validStep) {
      params.set('step', validStep.toString())
      setCurrentStep(validStep)
    } else {
      setCurrentStep(requestedStep)
    }
    
    // Sauvegarder dans localStorage
    const finalStep = parseInt(params.get('step') || '1')
    saveToStorage(mergedData, finalStep)
    
    router.push(`/simulateur-devis/steps?${params.toString()}`)
  }

  // Charger les données depuis l'URL au montage
  useEffect(() => {
    const postalCode = searchParams.get('postalCode')
    const city = searchParams.get('city')
    const propertyType = searchParams.get('propertyType')
    const prestation = searchParams.get('prestation')
    const project = searchParams.get('project')
    const prestationLevel = searchParams.get('prestationLevel')
    const existingState = searchParams.get('existingState')
    const timeline = searchParams.get('timeline')
    const firstName = searchParams.get('firstName')
    const phone = searchParams.get('phone')
    const email = searchParams.get('email')
    const acceptsCGV = searchParams.get('acceptsCGV')
    const surface = searchParams.get('surface')
    const answers = searchParams.get('answers')
    const step = searchParams.get('step')

    const urlData: SimulatorData = {}
    
    if (postalCode) urlData.postalCode = postalCode
    if (city) urlData.city = city
    if (propertyType) urlData.propertyType = propertyType
    if (prestationLevel) urlData.prestationLevel = prestationLevel
    if (existingState) urlData.existingState = existingState
    if (timeline) urlData.timeline = timeline
    if (firstName || phone || email || acceptsCGV) {
      urlData.contactInfo = {
        firstName: firstName || '',
        phone: phone || '',
        email: email || '',
        acceptsCGV: acceptsCGV === 'true'
      }
    }
    // Prioriser 'project' sur 'prestation' pour la prestation sélectionnée
    if (project) {
      urlData.selectedPrestation = findPrestationSlug(project)
    } else if (prestation) {
      urlData.selectedPrestation = findPrestationSlug(prestation)
    }
    
    if (surface || answers) {
      urlData.projectDetails = {}
      if (surface) urlData.projectDetails.surface = parseInt(surface)
      if (answers) {
        try {
          urlData.projectDetails.specificAnswers = JSON.parse(answers)
        } catch (e) {
          console.error('Erreur parsing answers:', e)
        }
      }
    }

    if (Object.keys(urlData).length > 0) {
      setSimulatorData(prev => ({ ...prev, ...urlData }))
    }

    if (step) {
      const stepNumber = parseInt(step)
      if (stepNumber >= 1 && stepNumber <= 8) {
        setCurrentStep(stepNumber)
      }
    }
  }, [searchParams])
  
  const totalSteps = 8 // Nombre total d'étapes prévues

  // Titres des étapes
  const stepTitles = {
    1: 'Localisation du projet',
    2: 'Type de bien',
    3: 'Détails du projet',
    4: 'Niveau de prestation',
    5: 'État existant',
    6: 'Délai des travaux',
    7: 'Dernière étape avant le résultat de votre estimation',
    8: 'Votre estimation personnalisée'
  }

  // Gestion de la navigation vers l'étape suivante
  const handlePostalCodeNext = (postalCode: string, city: string) => {
    const newData = { postalCode, city }
    setSimulatorData(prev => ({ ...prev, ...newData }))
    updateURL(newData, 2)
    setCurrentStep(2)
  }

  const handlePropertyTypeNext = (propertyType: string) => {
    const newData = { propertyType }
    setSimulatorData(prev => ({ ...prev, ...newData }))
    updateURL(newData, 3)
    setCurrentStep(3)
  }

  const handleProjectDetailsNext = (projectDetails: ProjectDetails) => {
    const newData = { projectDetails }
    setSimulatorData(prev => ({ ...prev, ...newData }))
    updateURL(newData, 4)
    setCurrentStep(4)
  }

  const handlePrestationLevelNext = (level: { range: string }) => {
    const newData = { prestationLevel: level.range }
    setSimulatorData(prev => ({ ...prev, ...newData }))
    updateURL(newData, 5)
    setCurrentStep(5)
  }

  // Handler pour l'étape 5 - État existant
  const handleExistingStateNext = (state: { state: string }) => {
    const newData = { existingState: state.state }
    setSimulatorData(prev => ({ ...prev, ...newData }))
    updateURL(newData, 6)
    setCurrentStep(6)
  }

  // Handler pour l'étape 6 - Délai des travaux
  const handleTimelineNext = (timeline: { timeline: string }) => {
    const newData = { timeline: timeline.timeline }
    setSimulatorData(prev => ({ ...prev, ...newData }))
    updateURL(newData, 7)
    setCurrentStep(7)
  }

  // Handler pour l'étape 7 - Formulaire de contact
  const handleContactFormNext = (contactInfo: ContactInfo) => {
    const newData = { contactInfo }
    setSimulatorData(prev => ({ ...prev, ...newData }))
    updateURL(newData, 8)
    setCurrentStep(8)
  }

  // Fonction pour changer de prestation (remplace l'ancienne)
  const handlePrestationChange = (newPrestation: string) => {
    const newData = { selectedPrestation: newPrestation }
    setSimulatorData({
      selectedPrestation: newPrestation,
      // On garde seulement les données de localisation et type de bien si elles existent
      postalCode: simulatorData.postalCode,
      city: simulatorData.city,
      propertyType: simulatorData.propertyType
    })
    updateURL(newData) // Cela va automatiquement reset et revenir à l'étape 1
    setCurrentStep(1)
  }

  // Fonction pour revenir à l'étape précédente
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      
      // Nettoyer les données des étapes suivantes
      if (newStep < 3) {
        // Si on revient avant l'étape 3, supprimer toutes les données suivantes
        setSimulatorData(prev => ({ 
          ...prev, 
          projectDetails: undefined, 
          prestationLevel: undefined, 
          existingState: undefined,
          timeline: undefined,
          contactInfo: undefined
        }))
        updateURL({}, newStep, true) // true = reset project details
      } else if (newStep < 4) {
        // Si on revient avant l'étape 4
        setSimulatorData(prev => ({ 
          ...prev, 
          prestationLevel: undefined, 
          existingState: undefined,
          timeline: undefined,
          contactInfo: undefined
        }))
        updateURL({}, newStep)
      } else if (newStep < 5) {
        // Si on revient avant l'étape 5
        setSimulatorData(prev => ({ 
          ...prev, 
          existingState: undefined,
          timeline: undefined,
          contactInfo: undefined
        }))
        updateURL({}, newStep)
      } else if (newStep < 6) {
        // Si on revient avant l'étape 6
        setSimulatorData(prev => ({ 
          ...prev, 
          timeline: undefined,
          contactInfo: undefined
        }))
        updateURL({}, newStep)
      } else if (newStep < 7) {
        // Si on revient avant l'étape 7
        setSimulatorData(prev => ({ 
          ...prev, 
          contactInfo: undefined
        }))
        updateURL({}, newStep)
      } else {
        updateURL({}, newStep)
      }
    }
  }

  // Fonction pour rendre l'étape courante
  const renderCurrentStep = () => {
    // Si pas de prestation sélectionnée, afficher un message
    if (!simulatorData.selectedPrestation) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Aucune prestation sélectionnée
          </h2>
          <p className="text-gray-600 mb-6">
            Veuillez d'abord choisir un type de travaux depuis la page d'accueil.
          </p>
          <Link href="/simulateur-devis">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <PostalCodeStep
            onNext={handlePostalCodeNext}
            initialValue={simulatorData.postalCode}
          />
        )
      case 2:
        return (
          <PropertyTypeStep
            onNext={handlePropertyTypeNext}
            onPrevious={handlePreviousStep}
            initialValue={simulatorData.propertyType}
          />
        )
      case 3:
        return (
          <ProjectDetailsStep
            onNext={handleProjectDetailsNext}
            onPrevious={handlePreviousStep}
            selectedPrestation={simulatorData.selectedPrestation}
            initialValues={simulatorData.projectDetails}
          />
        )
      case 4:
        return (
          <PrestationLevelStep
            onNext={handlePrestationLevelNext}
            onPrevious={handlePreviousStep}
            initialValue={simulatorData.prestationLevel}
          />
        )
      case 5:
        return (
          <ExistingStateStep
            onNext={handleExistingStateNext}
            onPrevious={handlePreviousStep}
            initialValue={simulatorData.existingState}
          />
        )
      case 6:
        return (
          <TimelineStep
            onNext={handleTimelineNext}
            onPrevious={handlePreviousStep}
            initialValue={simulatorData.timeline}
          />
        )
      case 7:
        return (
          <ContactFormStep
            onNext={handleContactFormNext}
            onPrevious={handlePreviousStep}
            initialValues={simulatorData.contactInfo}
            simulatorData={simulatorData}
          />
        )
      case 8:
        return (
          <ResultsStep simulatorData={simulatorData} />
        )
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Étape en cours de développement
            </h2>
          </div>
        )
    }
  }

  return (
    <SimulatorTemplate
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepTitle={stepTitles[currentStep as keyof typeof stepTitles]}
      currentPrestation={simulatorData.selectedPrestation}
      onPrestationChange={handlePrestationChange}
    >
      {renderCurrentStep()}
    </SimulatorTemplate>
  )
}

export default function SimulatorStepsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du simulateur...</p>
        </div>
      </div>
    }>
      <SimulatorStepsContent />
    </Suspense>
  )
}
