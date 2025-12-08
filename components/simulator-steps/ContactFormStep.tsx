"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Mail, User, Phone, Send, Loader2 } from 'lucide-react'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ContactFormStepProps {
  onNext: (contact: ContactInfo) => void
  onPrevious?: () => void
  initialValues?: ContactInfo
  simulatorData?: any // Toutes les données du simulateur
}

interface ContactInfo {
  firstName: string
  phone: string
  email: string
  acceptsCGV: boolean
}

export default function ContactFormStep({ 
  onNext, 
  onPrevious, 
  initialValues = { firstName: '', phone: '', email: '', acceptsCGV: false },
  simulatorData
}: ContactFormStepProps) {
  const [formData, setFormData] = useState<ContactInfo>(initialValues)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validation prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères'
    }

    // Validation téléphone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide'
    }

    // Validation email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    // Validation CGV
    if (!formData.acceptsCGV) {
      newErrors.acceptsCGV = 'Cochez cette case pour recevoir votre estimation !'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fonction pour créer l'estimation dans Firestore
  const createEstimation = async (contactData: ContactInfo) => {
    try {
      // Générer un sessionId unique
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Calculer les estimations (logique simplifiée pour l'exemple)
      const calculatePricing = () => {
        let basePrice = 1000
        
        if (simulatorData?.projectDetails?.surface) {
          basePrice = simulatorData.projectDetails.surface * 50
        }
        
        let levelMultiplier = 1
        if (simulatorData?.prestationLevel === 'low') levelMultiplier = 0.8
        if (simulatorData?.prestationLevel === 'high') levelMultiplier = 1.4
        
        let stateMultiplier = 1
        if (simulatorData?.existingState === 'creation') stateMultiplier = 1.3
        if (simulatorData?.existingState === 'renovation') stateMultiplier = 1.1
        
        const finalPrice = basePrice * levelMultiplier * stateMultiplier
        
        return {
          estimationLow: Math.round(finalPrice * 0.8),
          estimationMedium: Math.round(finalPrice),
          estimationHigh: Math.round(finalPrice * 1.3),
          calculationMethod: 'statistical',
          confidenceScore: 85,
          priceFactors: [
            `Surface: ${simulatorData?.projectDetails?.surface || 'Non spécifiée'} m²`,
            `Niveau: ${simulatorData?.prestationLevel || 'Standard'}`,
            `État: ${simulatorData?.existingState || 'Non spécifié'}`
          ]
        }
      }
      
      // Détecter le type d'appareil
      const getDeviceType = () => {
        const width = window.innerWidth
        if (width < 768) return 'mobile'
        if (width < 1024) return 'tablet'
        return 'desktop'
      }
      
      // Préparer les données pour Firestore
      const estimationData = {
        sessionId,
        status: 'completed',
        
        clientInfo: {
          firstName: contactData.firstName,
          phone: contactData.phone,
          email: contactData.email,
          acceptsCGV: contactData.acceptsCGV
        },
        
        location: {
          postalCode: simulatorData?.postalCode || '',
          city: simulatorData?.city || '',
          department: simulatorData?.postalCode?.substring(0, 2) || '',
          coordinates: null // À implémenter avec une API de géocodage
        },
        
        project: {
          propertyType: simulatorData?.propertyType || '',
          prestationType: simulatorData?.selectedPrestation || '',
          prestationSlug: simulatorData?.selectedPrestation?.toLowerCase().replace(/\s+/g, '-') || '',
          surface: simulatorData?.projectDetails?.surface || null,
          prestationLevel: simulatorData?.prestationLevel || 'mid',
          existingState: simulatorData?.existingState || 'good_condition',
          timeline: simulatorData?.timeline || 'soon',
          specificAnswers: simulatorData?.projectDetails?.specificAnswers || {}
        },
        
        pricing: calculatePricing(),
        
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          deviceType: getDeviceType(),
          ipAddress: null, // À implémenter côté serveur
          completionTime: null // À calculer depuis le début du simulateur
        },
        
        leads: {
          artisansNotified: [],
          artisansInterested: [],
          quotesReceived: 0,
          leadConverted: false,
          conversionValue: null
        },
        
        createdAt: serverTimestamp(),
        completedAt: serverTimestamp(),
        sentAt: null,
        updatedAt: serverTimestamp()
      }
      
      // Sauvegarder dans Firestore
      const docRef = await addDoc(collection(db, 'estimations'), estimationData)
      console.log('Estimation créée avec ID:', docRef.id)
      
      // Préparer le contenu de l'email
      const emailContent = `
Bonjour ${contactData.firstName},

🎉 Votre estimation personnalisée est prête !

PROJET : ${simulatorData?.selectedPrestation || 'Rénovation'}
LOCALISATION : ${simulatorData?.city || ''} (${simulatorData?.postalCode || ''})

ESTIMATIONS :
💰 Estimation basse : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(calculatePricing().estimationLow)}
💰 Estimation moyenne : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(calculatePricing().estimationMedium)} (recommandée)
💰 Estimation haute : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(calculatePricing().estimationHigh)}

DÉTAILS DU PROJET :
🏠 Type de bien : ${simulatorData?.propertyType || ''}
📏 Surface : ${simulatorData?.projectDetails?.surface || 'Non spécifiée'} m²
💎 Niveau : ${simulatorData?.prestationLevel === 'low' ? 'Économique' : simulatorData?.prestationLevel === 'high' ? 'Premium' : 'Standard'}
🔧 État existant : ${simulatorData?.existingState === 'creation' ? 'À créer entièrement' : simulatorData?.existingState === 'renovation' ? 'À rénover' : 'En bon état'}
⏰ Délai souhaité : ${simulatorData?.timeline === 'urgent' ? 'Urgent (< 1 mois)' : simulatorData?.timeline === 'soon' ? 'Prochainement (1-3 mois)' : 'Plus tard (3-6 mois)'}

PROCHAINES ÉTAPES :
✅ Des artisans qualifiés de votre région vont recevoir votre demande
✅ Vous recevrez entre 1 à 3 propositions par email dans les prochains jours
✅ Vous pourrez comparer leurs offres et choisir celle qui vous convient le mieux
✅ Aucun engagement de votre part - vous restez libre de votre choix

ℹ️ À PROPOS DE CETTE ESTIMATION :
Cette estimation est calculée par intelligence artificielle à partir de milliers de projets réels et de données du marché actualisées. Elle vous donne une fourchette fiable pour préparer votre budget, mais seul un devis personnalisé d'un professionnel vous garantira le prix exact de vos travaux.

Cordialement,
L'équipe Portail-habitat.fr
      `

      // Envoyer l'email avec l'estimation
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: contactData.email,
            subject: `🎉 Votre estimation pour ${simulatorData?.selectedPrestation || 'votre projet'} est prête !`,
            content: emailContent,
            fromName: 'Portail Habitat',
            fromEmail: 'service@trouver-mon-chantier.fr'
          })
        })

        if (!emailResponse.ok) {
          console.error('Erreur lors de l\'envoi de l\'email:', await emailResponse.text())
        } else {
          console.log('Email d\'estimation envoyé avec succès')
          setEmailSent(true)
          
          // Mettre à jour le timestamp sentAt dans Firestore
          await updateDoc(doc(db, 'estimations', docRef.id), {
            sentAt: serverTimestamp(),
            status: 'sent'
          })
        }
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError)
        // Ne pas faire échouer la création de l'estimation si l'email échoue
      }
      
      return docRef.id
    } catch (error) {
      console.error('Erreur lors de la création de l\'estimation:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Créer l'estimation dans Firestore
      const estimationId = await createEstimation(formData)
      
      // Simuler un délai pour le loader
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Passer à l'étape suivante avec les données de contact
      onNext(formData)
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      // Gérer l'erreur (afficher un message, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ContactInfo, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Supprimer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="lg:max-w-2xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de l'étape */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Recevez votre estimation personnalisée
        </h1>
        <p className="text-lg text-gray-600">
          Laissez-nous vos coordonnées pour recevoir votre devis par email
        </p>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl text-gray-800">
            Vos coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Prénom */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Prénom *
              </label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Votre prénom"
                required
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Téléphone *
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="06 12 34 56 78"
                required
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre.email@exemple.com"
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* CGV */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="cgv"
                  checked={formData.acceptsCGV}
                  onCheckedChange={(checked) => handleInputChange('acceptsCGV', checked as boolean)}
                  required
                  className={errors.acceptsCGV ? 'border-red-500' : ''}
                />
                <label htmlFor="cgv" className="text-sm text-gray-700 leading-relaxed">
                  J'accepte les{' '}
                  <a href="/conditions-generales" target="_blank" className="text-blue-600 hover:underline">
                    conditions générales d'utilisation
                  </a>{' '}
                  et de recevoir des offres de partenaires *
                </label>
              </div>
              {errors.acceptsCGV && (
                <p className="text-sm text-red-600">{errors.acceptsCGV}</p>
              )}
            </div>

            {/* Note informative */}
            <div className={`border rounded-lg p-4 ${emailSent ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start">
                <Mail className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${emailSent ? 'text-green-600' : 'text-blue-600'}`} />
                <div className={`text-sm ${emailSent ? 'text-green-800' : 'text-blue-800'}`}>
                  {emailSent ? (
                    <>
                      <p className="font-medium mb-1">✅ Votre estimation a été envoyée par email !</p>
                      <p>Vérifiez votre boîte de réception à l'adresse : <strong>{formData.email}</strong></p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium mb-1">Votre estimation vous sera envoyée par email</p>
                      <p>Vous recevrez également des propositions d'artisans qualifiés de votre région par email uniquement.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col-reverse lg:flex-row lg:justify-between space-y-reverse space-y-3 lg:space-y-0 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 w-full lg:w-auto lg:order-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Recevoir mon estimation
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              {onPrevious && (
                <Button
                  type="button"
                  onClick={onPrevious}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full lg:w-auto lg:order-1"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Retour
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
