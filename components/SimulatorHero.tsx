"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calculator, FileText, Clock, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { getFilteredSuggestions, getPopularSuggestions } from '@/lib/renovation-suggestions'

export default function SimulatorHero() {
  const [projectInput, setProjectInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Gérer les suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProjectInput(value)
    setHasSelectedSuggestion(false) // Reset quand l'utilisateur tape
    
    if (value.length >= 2) {
      const filteredSuggestions = getFilteredSuggestions(value, 8)
      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    } else if (value.length === 0) {
      // Afficher les suggestions populaires si l'input est vide
      const popularSuggestions = getPopularSuggestions(8)
      setSuggestions(popularSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Gérer le focus sur l'input
  const handleInputFocus = () => {
    if (projectInput.length === 0) {
      // Afficher les suggestions populaires si l'input est vide
      const popularSuggestions = getPopularSuggestions(8)
      setSuggestions(popularSuggestions)
      setShowSuggestions(true)
    } else if (projectInput.length >= 2) {
      // Afficher les suggestions filtrées si il y a du texte
      const filteredSuggestions = getFilteredSuggestions(projectInput, 8)
      setSuggestions(filteredSuggestions)
      setShowSuggestions(true)
    }
  }

  // Sélectionner une suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setProjectInput(suggestion)
    setShowSuggestions(false)
    setHasSelectedSuggestion(true)
  }

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" style={{ background: 'linear-gradient(135deg, #0F172A, #0F766E)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo et nom à gauche */}
          <div className="flex items-center space-x-3">
            <Image
              src="/icon.png"
              alt="Portail Habitat"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-white font-semibold text-lg">
              Portail-habitat.fr
            </span>
          </div>

          {/* Boutons à droite */}
          <div className="flex items-center space-x-4">
            <Link href="/connexion">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Connexion
              </Button>
            </Link>
            <Link href="/devenir-pro">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                S'inscrire en tant que professionnel
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenu principal du héros */}
      <div className="relative z-10 px-6 py-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenu à gauche */}
            <div className="space-y-8">
              <div className="space-y-6">
                {/* Déclencheur émotionnel */}
                <p className="text-lg lg:text-xl text-orange-300 font-medium">
                  Évitez les mauvaises surprises sur votre budget
                </p>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  Estimez votre devis en ligne en deux minutes
                </h1>
                
                {/* Trio de confiance */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-4">
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm font-medium">+10 000 devis réalisés</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm font-medium">Résultat immédiat</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm font-medium">Gratuit et sans engagement</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl lg:text-2xl text-white/90 font-medium">
                    Quel est votre projet ?
                  </h2>
                  
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Input
                          ref={inputRef}
                          type="text"
                          placeholder="Ex: Rénovation salle de bain, cuisine, peinture..."
                          value={projectInput}
                          onChange={handleInputChange}
                          onFocus={handleInputFocus}
                          className="h-12 text-lg bg-white/95 border-0 placeholder:text-gray-500"
                        />
                        
                        {/* Suggestions dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                          <div 
                            ref={suggestionsRef}
                            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
                          >
                            {suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 text-gray-900 text-sm"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button 
                        className="bg-orange-500 hover:bg-orange-600 h-12 px-6 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                        disabled={!hasSelectedSuggestion}
                      >
                        Lancer mon estimation gratuite
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <span className="text-white/80 text-sm">Projets populaires :</span>
                  {['Cuisine', 'Salle de bain', 'Peinture', 'Électricité'].map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                      onClick={() => {
                        setProjectInput(tag)
                        setHasSelectedSuggestion(true)
                        setShowSuggestions(false)
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo à droite */}
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <Image
                  src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Rénovation maison"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900">
                      + de 10 000 devis en ligne réalisés
                    </p>
                    <p className="text-xs text-gray-600">
                      Estimation gratuite et sans engagement, résultat instantané
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
