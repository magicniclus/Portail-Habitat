"use client";
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'

interface SimulatorTemplateProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
  stepTitle: string
  onPreviousStep?: () => void
  currentPrestation?: string
  onPrestationChange?: (prestation: string) => void
}

export default function SimulatorTemplate({ 
  children, 
  currentStep, 
  totalSteps, 
  stepTitle,
  onPreviousStep,
  currentPrestation,
  onPrestationChange
}: SimulatorTemplateProps) {
  // Calculer le pourcentage de progression basé uniquement sur l'étape
  const stepProgress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header avec logo et barre de progression */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/icon.png"
                alt="Portail Habitat"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-gray-900 font-semibold text-lg">
                Portail-habitat.fr
              </span>
            </div>

            {/* Espace vide pour équilibrer le layout */}
            <div></div>
          </div>

          {/* Barre de progression - masquée sur la page de résultats */}
          {currentStep < totalSteps && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{stepTitle}</span>
              </div>
              <Progress 
                value={stepProgress} 
                className="h-3 bg-gray-200 [&>[data-slot=progress-indicator]]:bg-green-500"
              />
            </div>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 lg:max-w-4xl lg:mx-auto lg:px-6 lg:py-8">
        <div className="bg-white lg:rounded-lg lg:shadow-sm lg:border lg:p-8">
          {children}
        </div>
      </main>

      {/* Footer simple */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <div className="space-y-3">
            <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Nos estimations sont calculées par intelligence artificielle à partir de milliers de projets réels 
              et de données du marché actualisées. Elles vous donnent une fourchette fiable pour préparer votre budget, 
              mais seul un devis personnalisé d'un professionnel vous garantira le prix exact de vos travaux.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Portail-habitat.fr - Estimation gratuite et sans engagement
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
