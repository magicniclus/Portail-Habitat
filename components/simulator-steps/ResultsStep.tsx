"use client";
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail, Phone, MapPin, Calendar, Wrench, Users, ArrowRight, Loader2, Star, ExternalLink, Search } from 'lucide-react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ResultsStepProps {
  simulatorData: any
}

export default function ResultsStep({ simulatorData }: ResultsStepProps) {
  const [estimationData, setEstimationData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [nearbyArtisans, setNearbyArtisans] = useState<any[]>([])
  const [loadingArtisans, setLoadingArtisans] = useState(false)

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

  // Récupérer les artisans du secteur
  useEffect(() => {
    const fetchNearbyArtisans = async () => {
      if (!simulatorData?.postalCode || !simulatorData?.selectedPrestation) {
        return
      }

      setLoadingArtisans(true)
      
      try {
        // Extraire le département du code postal
        const department = simulatorData.postalCode.substring(0, 2)
        
        // Chercher les artisans dans le département avec la spécialité correspondante
        const artisansQuery = query(
          collection(db, 'artisans'),
          where('isActive', '==', true),
          where('department', '==', department),
          limit(6) // Limiter à 6 artisans
        )
        
        const querySnapshot = await getDocs(artisansQuery)
        
        if (!querySnapshot.empty) {
          const artisans = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          // Filtrer par spécialité si possible
          const filteredArtisans = artisans.filter((artisan: any) => {
            const specialties = artisan.specialties || []
            const prestationSlug = simulatorData.selectedPrestation?.toLowerCase()
            
            // Vérifier si l'artisan a la spécialité correspondante
            return specialties.some((specialty: string) => 
              specialty.toLowerCase().includes('cuisine') ||
              specialty.toLowerCase().includes('renovation') ||
              specialty.toLowerCase().includes('menuiserie') ||
              prestationSlug?.includes(specialty.toLowerCase())
            )
          })
          
          setNearbyArtisans(filteredArtisans.length > 0 ? filteredArtisans : artisans.slice(0, 4))
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des artisans:', error)
      } finally {
        setLoadingArtisans(false)
      }
    }

    fetchNearbyArtisans()
  }, [simulatorData?.postalCode, simulatorData?.selectedPrestation])

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
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Récapitulatif de votre projet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Localisation :</span>
                <span className="ml-2 font-medium">{simulatorData.city} ({simulatorData.postalCode})</span>
              </div>
              
              <div className="flex items-center">
                <Wrench className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Type de bien :</span>
                <span className="ml-2 font-medium">{simulatorData.propertyType}</span>
              </div>

              {simulatorData.projectDetails?.surface && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">Surface :</span>
                  <span className="ml-2 font-medium">{simulatorData.projectDetails.surface} m²</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600">Niveau :</span>
                <span className="ml-2 font-medium">{getLevelLabel(simulatorData.prestationLevel)}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-600">État existant :</span>
                <span className="ml-2 font-medium">{getStateLabel(simulatorData.existingState)}</span>
              </div>

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Délai :</span>
                <span className="ml-2 font-medium">{getTimelineLabel(simulatorData.timeline)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information sur les entreprises */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">
                Prochaines étapes
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>✅ Votre estimation a été envoyée par email à <strong>{clientInfo?.email}</strong></p>
                <p>📧 Des artisans qualifiés de votre région vont recevoir votre demande</p>
                <p>📨 Vous recevrez entre 1 à 3 propositions par email dans les prochains jours</p>
                <p>💡 Vous pourrez comparer leurs offres et choisir celle qui vous convient le mieux</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entreprises du secteur */}
      {(nearbyArtisans.length > 0 || (!loadingArtisans && simulatorData?.postalCode)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {nearbyArtisans.length > 0 ? 'Entreprises du secteur (dans un rayon de 70km)' : 'Rechercher des artisans dans votre secteur'}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {nearbyArtisans.length > 0 
                ? 'Ces professionnels qualifiés peuvent réaliser votre projet'
                : 'Aucun artisan trouvé dans votre secteur immédiat'
              }
            </p>
          </CardHeader>
          <CardContent>
            {loadingArtisans ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span className="text-gray-600">Recherche d'entreprises...</span>
              </div>
            ) : nearbyArtisans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyArtisans.map((artisan) => (
                  <div key={artisan.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {artisan.companyName || artisan.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {artisan.city} ({artisan.postalCode})
                        </div>
                      </div>
                      {artisan.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">
                            {artisan.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {artisan.specialties && artisan.specialties.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {artisan.specialties.slice(0, 2).map((specialty: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {artisan.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{artisan.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {artisan.experience && (
                          <span>{artisan.experience} ans d'expérience</span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/artisan/${artisan.slug || artisan.id}`, '_blank')}
                        className="text-xs"
                      >
                        Voir profil
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Composant affiché quand aucun artisan n'est trouvé
              <div className="text-center py-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Élargissons la recherche
                  </h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto">
                    Nous n'avons pas trouvé d'artisans spécialisés dans votre secteur immédiat. 
                    Recherchons dans un rayon plus large autour de <strong>{simulatorData?.city || simulatorData?.postalCode}</strong>.
                  </p>
                  <Button 
                    onClick={() => {
                      const searchParams = new URLSearchParams({
                        secteur: simulatorData?.postalCode || '',
                        ville: simulatorData?.city || '',
                        specialite: simulatorData?.selectedPrestation || ''
                      })
                      window.location.href = `/artisans?${searchParams.toString()}`
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher des artisans
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Vos coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Prénom :</span>
                <span className="font-medium">{clientInfo?.firstName}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Téléphone :</span>
                <span className="font-medium">{clientInfo?.phone}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Email :</span>
              <span className="font-medium text-blue-600">{clientInfo?.email}</span>
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
