"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, Wrench } from 'lucide-react'

interface ExistingStateStepProps {
  onNext: (state: ExistingState) => void
  onPrevious?: () => void
  initialValue?: string
}

interface ExistingState {
  state: 'creation' | 'renovation' | 'good_condition'
}

const existingStates = [
  {
    id: 'creation',
    title: 'À créer entièrement',
    description: 'Création complète, rien n\'existe actuellement',
    color: 'red',
    details: [
      'Création from scratch',
      'Tous les matériaux à prévoir',
      'Travaux de gros œuvre possibles'
    ]
  },
  {
    id: 'renovation',
    title: 'À rénover',
    description: 'Existant à remettre en état ou moderniser',
    color: 'orange',
    details: [
      'Démolition partielle possible',
      'Mise aux normes nécessaire',
      'Rénovation complète ou partielle'
    ]
  },
  {
    id: 'good_condition',
    title: 'En bon état',
    description: 'Existant en bon état, travaux d\'amélioration',
    color: 'green',
    details: [
      'Structure existante saine',
      'Travaux d\'embellissement',
      'Mise à jour ou modernisation'
    ]
  }
]

export default function ExistingStateStep({ 
  onNext, 
  onPrevious, 
  initialValue 
}: ExistingStateStepProps) {
  const [selectedState, setSelectedState] = useState<string>(initialValue || '')

  const handleNext = () => {
    if (selectedState) {
      onNext({ state: selectedState as 'creation' | 'renovation' | 'good_condition' })
    }
  }

  const getColorClasses = (stateId: string, color: string) => {
    const colorMap = {
      red: {
        selected: 'ring-2 ring-red-500 bg-red-50 border-red-200',
        unselected: 'hover:border-red-300',
        text: 'text-red-900',
        textUnselected: 'text-red-700'
      },
      orange: {
        selected: 'ring-2 ring-orange-500 bg-orange-50 border-orange-200',
        unselected: 'hover:border-orange-300',
        text: 'text-orange-900',
        textUnselected: 'text-orange-700'
      },
      green: {
        selected: 'ring-2 ring-green-500 bg-green-50 border-green-200',
        unselected: 'hover:border-green-300',
        text: 'text-green-900',
        textUnselected: 'text-green-700'
      }
    }

    return colorMap[color as keyof typeof colorMap]
  }

  return (
    <div className="lg:max-w-4xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de l'étape */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Wrench className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          État existant
        </h1>
        <p className="text-lg text-gray-600">
          L'existant est-il :
        </p>
      </div>

      {/* Sélection de l'état */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {existingStates.map((state) => {
          const colors = getColorClasses(state.id, state.color)
          const isSelected = selectedState === state.id
          
          return (
            <Card
              key={state.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? colors.selected : colors.unselected
              }`}
              onClick={() => setSelectedState(state.id)}
            >
              <CardContent className="p-6 text-center space-y-4">
                
                {/* Titre */}
                <h3 className={`text-xl font-bold ${
                  isSelected ? colors.text : 'text-gray-900'
                }`}>
                  {state.title}
                </h3>
                
                {/* Description */}
                <p className={`text-sm ${
                  isSelected ? colors.textUnselected : 'text-gray-600'
                }`}>
                  {state.description}
                </p>
                
                {/* Détails */}
                <ul className={`text-xs space-y-1 ${
                  isSelected ? colors.textUnselected : 'text-gray-500'
                }`}>
                  {state.details.map((detail, index) => (
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
        {/* Mobile: Continuer en premier */}
        <Button
          onClick={handleNext}
          disabled={!selectedState}
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
