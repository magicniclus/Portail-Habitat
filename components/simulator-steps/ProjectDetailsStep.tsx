"use client";
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, Square, Minus, CornerDownRight, Circle, Mountain, Maximize, ArrowUp, ArrowUpRight } from 'lucide-react'
import { renovationPrestations } from '@/lib/renovation-suggestions'

interface ProjectDetailsStepProps {
  onNext: (details: ProjectDetails) => void
  onPrevious?: () => void
  selectedPrestation?: string
  initialValues?: ProjectDetails
}

interface ProjectDetails {
  surface?: number
  specificAnswers?: { [key: string]: any }
}

interface QuestionOption {
  value: string
  label: string
  icon: string
}

interface Question {
  id: string
  label: string
  type: 'cards' | 'number' | 'input'
  required: boolean
  options?: QuestionOption[]
  min?: number
  max?: number
}

interface Questionnaire {
  surface_question: string
  surface_required: boolean
  questions_specifiques?: Question[]
}

// Mapping des icônes
const iconMap = {
  'minus': Minus,
  'corner-down-right': CornerDownRight,
  'square': Square,
  'circle': Circle,
  'mountain': Mountain,
  'maximize': Maximize,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight
}

export default function ProjectDetailsStep({ 
  onNext, 
  onPrevious, 
  selectedPrestation,
  initialValues = {}
}: ProjectDetailsStepProps) {
  const [surface, setSurface] = useState<number>(initialValues.surface || 0)
  const [specificAnswers, setSpecificAnswers] = useState<{ [key: string]: any }>(initialValues.specificAnswers || {})

  // Trouver la prestation sélectionnée
  const prestation = renovationPrestations.find(p => p.slug === selectedPrestation)
  const questionnaire = prestation?.questionnaire as Questionnaire | undefined


  if (!prestation || !questionnaire) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Configuration non trouvée
        </h2>
        <p className="text-gray-600">
          La prestation sélectionnée "{selectedPrestation}" n'a pas de questionnaire configuré.
        </p>
        <div className="text-sm text-gray-500 mt-4">
          <p>Prestations disponibles avec questionnaire :</p>
          <div className="max-h-32 overflow-y-auto">
            {renovationPrestations
              .filter(p => p.questionnaire)
              .map(p => (
                <p key={p.slug}>• {p.slug} - {p.nom}</p>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  const handleSpecificAnswer = (questionId: string, value: any) => {
    setSpecificAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    const details: ProjectDetails = {
      surface: questionnaire.surface_required ? surface : undefined,
      specificAnswers
    }
    onNext(details)
  }

  // Vérifier si on peut continuer
  const canProceed = () => {
    // Vérifier la surface si requise
    if (questionnaire.surface_required && (!surface || surface <= 0)) {
      return false
    }

    // Vérifier les questions spécifiques requises
    if (questionnaire.questions_specifiques) {
      for (const question of questionnaire.questions_specifiques) {
        if (question.required && !specificAnswers[question.id]) {
          return false
        }
      }
    }

    return true
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'cards':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {question.options?.map((option) => {
              const IconComponent = iconMap[option.icon as keyof typeof iconMap] || Square
              const isSelected = specificAnswers[question.id] === option.value
              
              return (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-200' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleSpecificAnswer(question.id, option.value)}
                >
                  <CardContent className="p-4 text-center">
                    <p className={`text-sm font-medium ${
                      isSelected ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )

      case 'number':
        return (
          <Input
            type="number"
            value={specificAnswers[question.id] || ''}
            onChange={(e) => handleSpecificAnswer(question.id, parseInt(e.target.value) || 0)}
            min={question.min}
            max={question.max}
            className="w-full max-w-xs"
            placeholder="Entrez un nombre"
          />
        )

      case 'input':
        return (
          <Input
            type="text"
            value={specificAnswers[question.id] || ''}
            onChange={(e) => handleSpecificAnswer(question.id, e.target.value)}
            className="w-full max-w-md"
            placeholder="Votre réponse"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="lg:max-w-4xl lg:mx-auto space-y-8 px-6 py-8 lg:px-0 lg:py-0">
      {/* En-tête de l'étape */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <Square className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Détails de votre projet
        </h1>
        <p className="text-lg text-gray-600">
          {prestation.nom}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {/* Question surface */}
        {questionnaire.surface_required && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {questionnaire.surface_question}
            </h3>
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={surface || ''}
                onChange={(e) => setSurface(parseInt(e.target.value) || 0)}
                min={1}
                max={1000}
                className="w-32 text-lg"
                placeholder="0"
              />
              {/* Afficher l'unité seulement si c'est une vraie surface */}
              {questionnaire.surface_question.toLowerCase().includes('surface') || 
               questionnaire.surface_question.toLowerCase().includes('m²') ? (
                <span className="text-gray-600">m²</span>
              ) : null}
            </div>
          </div>
        )}

        {/* Questions spécifiques */}
        {questionnaire.questions_specifiques?.map((question) => (
          <div key={question.id} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {question.label}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {renderQuestion(question)}
          </div>
        ))}
      </div>

      {/* Boutons de navigation */}
      <div className="flex flex-col-reverse lg:flex-row lg:justify-between space-y-reverse space-y-3 lg:space-y-0">
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
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
