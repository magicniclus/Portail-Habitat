"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Building, Store, ArrowRight, ArrowLeft } from 'lucide-react'

interface PropertyTypeStepProps {
  onNext: (propertyType: string) => void
  onPrevious?: () => void
  initialValue?: string
}

type PropertyType = 'maison' | 'appartement' | 'local-professionnel'

const propertyTypes = [
  {
    id: 'maison' as PropertyType,
    title: 'Maison',
    description: 'Maison individuelle, villa, pavillon',
    icon: Home,
    details: [
      'Accès extérieur direct',
      'Possibilité d\'extensions',
      'Jardin ou terrain',
      'Garage ou parking privé'
    ]
  },
  {
    id: 'appartement' as PropertyType,
    title: 'Appartement',
    description: 'Appartement en immeuble, studio, duplex',
    icon: Building,
    details: [
      'En copropriété',
      'Balcon ou terrasse possible',
      'Contraintes techniques spécifiques',
      'Accès par parties communes'
    ]
  },
  {
    id: 'local-professionnel' as PropertyType,
    title: 'Local professionnel',
    description: 'Bureau, commerce, atelier, entrepôt',
    icon: Store,
    details: [
      'Usage commercial ou professionnel',
      'Normes spécifiques',
      'Accessibilité PMR',
      'Réglementations particulières'
    ]
  }
]

export default function PropertyTypeStep({ onNext, onPrevious, initialValue = '' }: PropertyTypeStepProps) {
  const [selectedType, setSelectedType] = useState<PropertyType | ''>(initialValue as PropertyType)

  const handleNext = () => {
    if (selectedType) {
      onNext(selectedType)
    }
  }

  const canProceed = selectedType !== ''

  return (
    <div className="lg:max-w-4xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de l'étape */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Building className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Quel type de bien concernent vos travaux ?
        </h1>
        <p className="text-lg text-gray-600">
          Le type de bien influence les contraintes techniques et les tarifs
        </p>
      </div>

      {/* Options de type de bien */}
      <div className="grid md:grid-cols-3 gap-6">
        {propertyTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-green-500 bg-green-50 border-green-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  isSelected ? 'bg-green-500' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-8 w-8 ${
                    isSelected ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                
                <h3 className={`text-xl font-semibold ${
                  isSelected ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {type.title}
                </h3>
              </CardContent>
            </Card>
          )
        })}
      </div>


      {/* Boutons de navigation */}
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between space-y-reverse space-y-3 lg:space-y-0">
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          size="lg"
          className="bg-green-600 hover:bg-green-700 w-full lg:w-auto lg:order-2"
        >
          Continuer
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        {onPrevious && (
          <Button
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
    </div>
  )
}
