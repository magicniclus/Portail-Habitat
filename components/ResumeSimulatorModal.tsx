"use client";
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, Trash2, ArrowRight, MapPin, Home, Wrench, Calendar, User } from 'lucide-react'

interface ResumeSimulatorModalProps {
  isOpen: boolean
  onResume: () => void
  onStartNew: () => void
  savedData: any
}

export default function ResumeSimulatorModal({ 
  isOpen, 
  onResume, 
  onStartNew, 
  savedData 
}: ResumeSimulatorModalProps) {
  
  const getStepName = (step: number) => {
    const stepNames = {
      1: 'Localisation',
      2: 'Type de bien',
      3: 'Détails du projet',
      4: 'Niveau de prestation',
      5: 'État existant',
      6: 'Délai des travaux',
      7: 'Informations de contact',
      8: 'Résultats'
    }
    return stepNames[step as keyof typeof stepNames] || `Étape ${step}`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Il y a moins d\'une heure'
    if (diffHours < 24) return `Il y a ${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  }

  const getProgressPercentage = (step: number) => {
    return Math.round((step / 8) * 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Reprendre votre simulation ?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informations de la simulation sauvegardée */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="space-y-3">
                {/* Progression */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">
                    Progression
                  </span>
                  <Badge variant="outline" className="border-green-300 text-green-700">
                    {getProgressPercentage(savedData.currentStep)}%
                  </Badge>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(savedData.currentStep)}%` }}
                  />
                </div>
                
                {/* Étape actuelle */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-800">
                    Étape {savedData.currentStep}/8 : {getStepName(savedData.currentStep)}
                  </span>
                  <span className="text-green-600">
                    {formatDate(savedData.timestamp)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aperçu des données */}
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Données sauvegardées :</h4>
              <div className="space-y-2 text-sm">
                {savedData.postalCode && savedData.city && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {savedData.city} ({savedData.postalCode})
                  </div>
                )}
                
                {savedData.propertyType && (
                  <div className="flex items-center text-gray-600">
                    <Home className="h-4 w-4 mr-2" />
                    {savedData.propertyType}
                  </div>
                )}
                
                {savedData.selectedPrestation && (
                  <div className="flex items-center text-gray-600">
                    <Wrench className="h-4 w-4 mr-2" />
                    {savedData.selectedPrestation}
                  </div>
                )}
                
                {savedData.timeline && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {savedData.timeline === 'urgent' ? 'Urgent (< 1 mois)' : 
                     savedData.timeline === 'soon' ? 'Prochainement (1-3 mois)' : 
                     'Plus tard (3-6 mois)'}
                  </div>
                )}
                
                {savedData.contactInfo?.firstName && (
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {savedData.contactInfo.firstName}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <Button 
              onClick={onResume}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reprendre où je me suis arrêté
            </Button>
            
            <Button 
              onClick={onStartNew}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Recommencer une nouvelle simulation
            </Button>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 text-center">
            Les données sont conservées pendant 24h pour votre confort
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
