"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, Diamond } from 'lucide-react'

interface PrestationLevelStepProps {
  onNext: (level: PrestationLevel) => void
  onPrevious?: () => void
  initialValue?: string
}

interface PrestationLevel {
  range: 'low' | 'mid' | 'high'
}

const prestationLevels = [
  {
    id: 'low',
    title: 'Économique',
    description: 'Matériaux standards, finitions simples',
    color: 'green',
    details: [
      'Matériaux d\'entrée de gamme',
      'Finitions standards',
      'Rapport qualité-prix optimal'
    ]
  },
  {
    id: 'mid',
    title: 'Standard',
    description: 'Bon équilibre qualité-prix',
    color: 'blue',
    details: [
      'Matériaux de qualité',
      'Finitions soignées',
      'Garanties étendues'
    ]
  },
  {
    id: 'high',
    title: 'Premium',
    description: 'Matériaux haut de gamme, finitions parfaites',
    color: 'purple',
    details: [
      'Matériaux premium',
      'Finitions exceptionnelles',
      'Service personnalisé'
    ]
  }
]

export default function PrestationLevelStep({ 
  onNext, 
  onPrevious, 
  initialValue 
}: PrestationLevelStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(initialValue || '')

  const handleNext = () => {
    if (selectedLevel) {
      onNext({ range: selectedLevel as 'low' | 'mid' | 'high' })
    }
  }

  const getColorClasses = (levelId: string, color: string) => {
    const colorMap = {
      green: {
        selected: 'ring-2 ring-green-500 bg-green-50 border-green-200',
        unselected: 'hover:border-green-300',
        text: 'text-green-900',
        textUnselected: 'text-green-700'
      },
      blue: {
        selected: 'ring-2 ring-blue-500 bg-blue-50 border-blue-200',
        unselected: 'hover:border-blue-300',
        text: 'text-blue-900',
        textUnselected: 'text-blue-700'
      },
      purple: {
        selected: 'ring-2 ring-purple-500 bg-purple-50 border-purple-200',
        unselected: 'hover:border-purple-300',
        text: 'text-purple-900',
        textUnselected: 'text-purple-700'
      }
    }

    return colorMap[color as keyof typeof colorMap]
  }

  return (
    <div className="lg:max-w-4xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de l'étape */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Diamond className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Niveau de prestation
        </h1>
        <p className="text-lg text-gray-600">
          Quel niveau de prestation souhaitez-vous ?
        </p>
      </div>

      {/* Sélection du niveau */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prestationLevels.map((level) => {
          const colors = getColorClasses(level.id, level.color)
          const isSelected = selectedLevel === level.id
          
          return (
            <Card
              key={level.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? colors.selected : colors.unselected
              }`}
              onClick={() => setSelectedLevel(level.id)}
            >
              <CardContent className="p-6 text-center space-y-4">
                
                {/* Titre */}
                <h3 className={`text-xl font-bold ${
                  isSelected ? colors.text : 'text-gray-900'
                }`}>
                  {level.title}
                </h3>
                
                {/* Description */}
                <p className={`text-sm ${
                  isSelected ? colors.textUnselected : 'text-gray-600'
                }`}>
                  {level.description}
                </p>
                
                {/* Détails */}
                <ul className={`text-xs space-y-1 ${
                  isSelected ? colors.textUnselected : 'text-gray-500'
                }`}>
                  {level.details.map((detail, index) => (
                    <li key={index}>• {detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Boutons de navigation */}
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between space-y-reverse space-y-3 lg:space-y-0">
        <Button
          onClick={handleNext}
          disabled={!selectedLevel}
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
