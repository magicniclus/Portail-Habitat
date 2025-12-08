"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, ArrowRight } from 'lucide-react'

interface PostalCodeStepProps {
  onNext: (postalCode: string, city: string) => void
  onPrevious?: () => void
  initialValue?: string
}

export default function PostalCodeStep({ onNext, onPrevious, initialValue = '' }: PostalCodeStepProps) {
  const [postalCode, setPostalCode] = useState(initialValue)
  const [city, setCity] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Fonction pour valider et récupérer la ville
  const validatePostalCode = async (code: string) => {
    if (code.length !== 5 || !/^\d{5}$/.test(code)) {
      setError('Le code postal doit contenir 5 chiffres')
      setCity('')
      return false
    }

    setIsLoading(true)
    setError('')

    try {
      // Simulation d'appel API pour récupérer la ville
      // En réalité, vous utiliseriez une vraie API comme l'API Géo du gouvernement français
      const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${code}&fields=nom,centre&format=json&geometry=centre`)
      const data = await response.json()
      
      if (data && data.length > 0) {
        setCity(data[0].nom)
        setError('')
        return true
      } else {
        setError('Code postal non trouvé')
        setCity('')
        return false
      }
    } catch (err) {
      // Fallback avec quelques codes postaux courants
      const commonCities: { [key: string]: string } = {
        '75001': 'Paris 1er',
        '75002': 'Paris 2e',
        '75003': 'Paris 3e',
        '69001': 'Lyon 1er',
        '13001': 'Marseille 1er',
        '31000': 'Toulouse',
        '44000': 'Nantes',
        '59000': 'Lille',
        '67000': 'Strasbourg',
        '33000': 'Bordeaux'
      }
      
      if (commonCities[code]) {
        setCity(commonCities[code])
        setError('')
        return true
      } else {
        setError('Impossible de vérifier le code postal')
        setCity('')
        return false
      }
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
      onNext(postalCode, city)
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
