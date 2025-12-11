"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, ArrowRight } from 'lucide-react'
import { getCoordinatesFromPostalCode, type Coordinates } from '@/lib/geo-utils'

interface PostalCodeStepProps {
  onNext: (postalCode: string, city: string, coordinates?: Coordinates) => void
  onPrevious?: () => void
  initialValue?: string
}

export default function PostalCodeStep({ onNext, onPrevious, initialValue = '' }: PostalCodeStepProps) {
  const [postalCode, setPostalCode] = useState(initialValue)
  const [city, setCity] = useState('')
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Fonction pour valider et récupérer la ville + coordonnées
  const validatePostalCode = async (code: string) => {
    if (code.length !== 5 || !/^\d{5}$/.test(code)) {
      setError('Le code postal doit contenir 5 chiffres')
      setCity('')
      setCoordinates(null)
      return false
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await getCoordinatesFromPostalCode(code)
      
      if (result) {
        setCity(result.city)
        setCoordinates(result.coordinates)
        setError('')
        console.log(`📍 Coordonnées récupérées pour ${code}:`, result.coordinates)
        return true
      } else {
        // Message d'erreur plus informatif selon le code postal
        if (!/^[0-9]{5}$/.test(code)) {
          setError('Le code postal doit contenir exactement 5 chiffres')
        } else {
          const dept = code.substring(0, 2)
          if (code === '75000') {
            setError('Code générique Paris détecté. Préférez un arrondissement (75001-75020) pour plus de précision.')
          } else if (['76'].includes(dept) && code.endsWith('04')) {
            setError('Ce code postal semble être un code spécial ou inexistant')
          } else {
            setError(`Code postal ${code} non reconnu. Vérifiez qu'il existe bien.`)
          }
        }
        setCity('')
        setCoordinates(null)
        return false
      }
    } catch (err) {
      console.error('Erreur validation code postal:', err)
      setError('Impossible de vérifier le code postal')
      setCity('')
      setCoordinates(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5)
    setPostalCode(value)
    
    if (value.length === 5) {
      validatePostalCode(value)
    } else {
      setCity('')
      setError('')
    }
  }

  const handleNext = () => {
    if (postalCode.length === 5 && city && !error) {
      onNext(postalCode, city, coordinates || undefined)
    }
  }

  const canProceed = postalCode.length === 5 && city && !error && !isLoading

  return (
    <div className="lg:max-w-2xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de l'étape */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <MapPin className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Où se situe votre projet ?
        </h1>
        <p className="text-lg text-gray-600">
          Indiquez votre code postal pour adapter l'estimation aux tarifs de votre région
        </p>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Localisation du projet</CardTitle>
          <CardDescription>
            Les prix peuvent varier selon les régions. Cette information nous permet de vous donner une estimation plus précise.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              Code postal *
            </label>
            <Input
              id="postalCode"
              type="text"
              placeholder="Ex: 75001"
              value={postalCode}
              onChange={handlePostalCodeChange}
              className={`text-lg h-12 ${error ? 'border-red-500' : city ? 'border-green-500' : ''}`}
              maxLength={5}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {city && !error && (
              <p className="text-sm text-green-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {city}
              </p>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 mt-2">Vérification du code postal...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton de navigation */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          Continuer
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Informations supplémentaires */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Pourquoi cette information ?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Les tarifs des artisans varient selon les régions</li>
          <li>• Certains matériaux ont des coûts de transport différents</li>
          <li>• Les réglementations locales peuvent influencer les prix</li>
        </ul>
      </div>
    </div>
  )
}
