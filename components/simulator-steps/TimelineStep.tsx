"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, Calendar } from 'lucide-react'

interface TimelineStepProps {
  onNext: (timeline: Timeline) => void
  onPrevious?: () => void
  initialValue?: string
}

interface Timeline {
  timeline: 'urgent' | 'soon' | 'later'
}

const timelines = [
  {
    id: 'urgent',
    title: 'Urgent',
    subtitle: '< 1 mois',
    description: 'Je souhaite commencer très rapidement',
    color: 'red',
    details: [
      'Démarrage immédiat',
      'Priorité absolue',
      'Planning serré'
    ]
  },
  {
    id: 'soon',
    title: 'Prochainement',
    subtitle: '1–3 mois',
    description: 'Je prévois de commencer dans les prochains mois',
    color: 'orange',
    details: [
      'Planification normale',
      'Délai raisonnable',
      'Préparation possible'
    ]
  },
  {
    id: 'later',
    title: 'Plus tard',
    subtitle: '3–6 mois',
    description: 'Je me renseigne pour un projet futur',
    color: 'blue',
    details: [
      'Projet à long terme',
      'Temps de réflexion',
      'Préparation approfondie'
    ]
  }
]

export default function TimelineStep({ 
  onNext, 
  onPrevious, 
  initialValue 
}: TimelineStepProps) {
  const [selectedTimeline, setSelectedTimeline] = useState<string>(initialValue || '')

  const handleNext = () => {
    if (selectedTimeline) {
      onNext({ timeline: selectedTimeline as 'urgent' | 'soon' | 'later' })
    }
  }

  const getColorClasses = (timelineId: string, color: string) => {
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
      blue: {
        selected: 'ring-2 ring-blue-500 bg-blue-50 border-blue-200',
        unselected: 'hover:border-blue-300',
        text: 'text-blue-900',
        textUnselected: 'text-blue-700'
      }
    }

    return colorMap[color as keyof typeof colorMap]
  }

  return (
    <div className="lg:max-w-4xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de l'étape */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Délai des travaux
        </h1>
        <p className="text-lg text-gray-600">
          Quand souhaitez-vous faire les travaux ?
        </p>
      </div>

      {/* Sélection du délai */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {timelines.map((timeline) => {
          const colors = getColorClasses(timeline.id, timeline.color)
          const isSelected = selectedTimeline === timeline.id
          
          return (
            <Card
              key={timeline.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? colors.selected : colors.unselected
              }`}
              onClick={() => setSelectedTimeline(timeline.id)}
            >
              <CardContent className="p-6 text-center space-y-4">
                
                {/* Titre */}
                <div>
                  <h3 className={`text-xl font-bold ${
                    isSelected ? colors.text : 'text-gray-900'
                  }`}>
                    {timeline.title}
                  </h3>
                  <p className={`text-lg font-medium ${
                    isSelected ? colors.textUnselected : 'text-gray-700'
                  }`}>
                    {timeline.subtitle}
                  </p>
                </div>
                
                {/* Description */}
                <p className={`text-sm ${
                  isSelected ? colors.textUnselected : 'text-gray-600'
                }`}>
                  {timeline.description}
                </p>
                
                {/* Détails */}
                <ul className={`text-xs space-y-1 ${
                  isSelected ? colors.textUnselected : 'text-gray-500'
                }`}>
                  {timeline.details.map((detail, index) => (
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
          disabled={!selectedTimeline}
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
