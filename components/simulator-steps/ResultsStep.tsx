"use client";
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Phone, MapPin, Calendar, Wrench, ArrowRight, Loader2 } from 'lucide-react'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ResultsStepProps {
  simulatorData: any
}

export default function ResultsStep({ simulatorData }: ResultsStepProps) {
  const [estimationData, setEstimationData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Clé pour le localStorage (même que dans le simulateur)
  const STORAGE_KEY = 'simulator-data'

  // Fonction pour effacer le localStorage
  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Données du simulateur effacées du localStorage')
    } catch (error) {
      console.error('Erreur lors de l\'effacement du localStorage:', error)
    }
  }

  // Récupérer l'estimation depuis Firestore
  useEffect(() => {
    const fetchEstimation = async () => {
      if (!simulatorData?.contactInfo?.email) {
        setIsLoading(false)
        // Effacer le localStorage même sans email
        clearStorage()
        return
      }

      try {
        // Chercher l'estimation pour cet email (sans tri pour éviter l'erreur d'index)
        const q = query(
          collection(db, 'estimations'),
          where('clientInfo.email', '==', simulatorData.contactInfo.email),
          limit(5) // Récupérer les 5 dernières pour trier côté client
        )
        
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          // Trier les documents côté client par createdAt (le plus récent en premier)
          const sortedDocs = querySnapshot.docs.sort((a, b) => {
            const aTime = a.data().createdAt?.toMillis() || 0
            const bTime = b.data().createdAt?.toMillis() || 0
            return bTime - aTime // Tri décroissant (plus récent en premier)
          })
          
          const mostRecentDoc = sortedDocs[0]
          setEstimationData({ id: mostRecentDoc.id, ...mostRecentDoc.data() })
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'estimation:', error)
      } finally {
        setIsLoading(false)
        // Effacer le localStorage une fois que l'estimation est chargée
        clearStorage()
      }
    }

    fetchEstimation()
  }, [simulatorData?.contactInfo?.email])

  // Calcul des estimations (simulation basée sur les données)
  const calculateEstimations = () => {
    let basePrice = 1000 // Prix de base
    
    // Ajustement selon la surface
    if (simulatorData.projectDetails?.surface) {
      basePrice = simulatorData.projectDetails.surface * 50
    }
    
    // Multiplicateur selon le niveau de prestation
    let levelMultiplier = 1
    if (simulatorData.prestationLevel === 'low') levelMultiplier = 0.8
    if (simulatorData.prestationLevel === 'high') levelMultiplier = 1.4
    
    // Multiplicateur selon l'état existant
    let stateMultiplier = 1
    if (simulatorData.existingState === 'creation') stateMultiplier = 1.3
    if (simulatorData.existingState === 'renovation') stateMultiplier = 1.1
    
    const finalPrice = basePrice * levelMultiplier * stateMultiplier
    
    return {
      low: Math.round(finalPrice * 0.8),
      medium: Math.round(finalPrice),
      high: Math.round(finalPrice * 1.3)
    }
  }

  const estimations = calculateEstimations()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Économique'
      case 'mid': return 'Standard'
      case 'high': return 'Premium'
      default: return level
    }
  }

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'creation': return 'À créer entièrement'
      case 'renovation': return 'À rénover'
      case 'good_condition': return 'En bon état'
      default: return state
    }
  }

  const getTimelineLabel = (timeline: string) => {
    switch (timeline) {
      case 'urgent': return 'Urgent (< 1 mois)'
      case 'soon': return 'Prochainement (1-3 mois)'
      case 'later': return 'Plus tard (3-6 mois)'
      default: return timeline
    }
  }

  // Afficher le loader pendant le chargement
  if (isLoading) {
    return (
      <div className="lg:max-w-4xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Finalisation de votre estimation...
          </h2>
          <p className="text-gray-600">
            Nous préparons votre estimation personnalisée
          </p>
        </div>
      </div>
    )
  }

  // Utiliser les données de Firestore si disponibles, sinon les données du simulateur
  const pricing = estimationData?.pricing || calculateEstimations()
  const clientInfo = estimationData?.clientInfo || simulatorData.contactInfo
  const projectInfo = estimationData?.project || simulatorData

  return (
    <div className="lg:max-w-4xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de confirmation */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          🎉 Votre estimation est prête !
        </h1>
        <p className="text-lg text-gray-600">
          Merci {clientInfo?.firstName}, voici votre estimation personnalisée
        </p>
      </div>

      {/* Estimations de prix */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-800">
            Estimation pour : {projectInfo.prestationType || projectInfo.selectedPrestation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Estimation basse */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <Badge variant="outline" className="mb-2 border-gray-300 text-gray-700">
                  Estimation basse
                </Badge>
                <div className="text-2xl font-bold text-gray-600">
                  {formatPrice(pricing.estimationLow || pricing.low)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Matériaux standards
                </p>
              </div>
            </div>

            {/* Estimation moyenne */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-400 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">
                  Recommandé
                </Badge>
              </div>
              <div className="text-center pt-2">
                <Badge variant="outline" className="mb-2 border-blue-400 text-blue-700">
                  Estimation moyenne
                </Badge>
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(pricing.estimationMedium || pricing.medium)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Rapport qualité-prix optimal
                </p>
              </div>
            </div>

            {/* Estimation haute */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <Badge variant="outline" className="mb-2 border-gray-300 text-gray-700">
                  Estimation haute
                </Badge>
                <div className="text-2xl font-bold text-gray-600">
                  {formatPrice(pricing.estimationHigh || pricing.high)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Matériaux premium
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Récapitulatif du projet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center space-y-2">
            <Wrench className="h-5 w-5" />
            <span>Récapitulatif de votre projet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex flex-col items-center space-y-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Localisation :</span>
                <span className="font-medium text-center break-words">{simulatorData.city} ({simulatorData.postalCode})</span>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <Wrench className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Type de bien :</span>
                <span className="font-medium text-center break-words">{simulatorData.propertyType}</span>
              </div>

              {simulatorData.projectDetails?.surface && (
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-sm text-gray-600">Surface :</span>
                  <span className="font-medium">{simulatorData.projectDetails.surface} m²</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-col items-center space-y-1">
                <span className="text-sm text-gray-600">Niveau :</span>
                <span className="font-medium text-center break-words">{getLevelLabel(simulatorData.prestationLevel)}</span>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <span className="text-sm text-gray-600">État existant :</span>
                <span className="font-medium text-center break-words">{getStateLabel(simulatorData.existingState)}</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Délai :</span>
                <span className="font-medium text-center break-words">{getTimelineLabel(simulatorData.timeline)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center space-y-2">
            <Phone className="h-5 w-5" />
            <span>Vos coordonnées</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg space-y-2">
                <span className="text-sm text-gray-600">Prénom :</span>
                <span className="font-medium text-center break-words w-full" title={clientInfo?.firstName}>{clientInfo?.firstName}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg space-y-2">
                <span className="text-sm text-gray-600">Téléphone :</span>
                <span className="font-medium text-center break-words w-full" title={clientInfo?.phone}>{clientInfo?.phone}</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg space-y-2">
              <span className="text-sm text-gray-600">Email :</span>
              <span className="font-medium text-blue-600 text-center break-all w-full" title={clientInfo?.email}>{clientInfo?.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de retour */}
      <div className="text-center">
        <Button 
          onClick={() => window.location.href = '/'}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          Retour à l'accueil
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
