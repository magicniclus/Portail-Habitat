"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFilteredSuggestions, getPopularSuggestions } from '@/lib/renovation-suggestions';

export default function Hero() {
  const [projectInput, setProjectInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Gérer les suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectInput(value);
    setHasSelectedSuggestion(false); // Reset quand l'utilisateur tape
    
    if (value.length >= 2) {
      const filteredSuggestions = getFilteredSuggestions(value, 8);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else if (value.length === 0) {
      // Afficher les suggestions populaires si l'input est vide
      const popularSuggestions = getPopularSuggestions(8);
      setSuggestions(popularSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Gérer le focus sur l'input
  const handleInputFocus = () => {
    if (projectInput.length === 0) {
      // Afficher les suggestions populaires si l'input est vide
      const popularSuggestions = getPopularSuggestions(8);
      setSuggestions(popularSuggestions);
      setShowSuggestions(true);
    } else if (projectInput.length >= 2) {
      // Afficher les suggestions filtrées si il y a du texte
      const filteredSuggestions = getFilteredSuggestions(projectInput, 8);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    }
  };

  // Sélectionner une suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setProjectInput(suggestion);
    setShowSuggestions(false);
    setHasSelectedSuggestion(true);
  };

  // Fonction pour créer l'URL vers le simulateur
  const getSimulatorURL = () => {
    if (projectInput) {
      return `/simulateur-devis/steps?project=${encodeURIComponent(projectInput)}`;
    }
    return '/simulateur-devis/steps';
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section className="w-screen min-h-[60vh] md:min-h-[80vh] flex flex-col lg:flex-row">
      {/* Section Particuliers - 64% sur desktop, 100% sur mobile */}
      <div 
        className="flex-1 relative py-24"
        style={{ flex: "0 0 64%" }}
      >
        {/* Vidéo en arrière-plan */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/video.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center py-8 lg:py-0">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center lg:text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6">
                Trouvez le bon artisan pour vos travaux
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-8">
                Quel est votre projet ?
              </p>
              
              {/* Formulaire de recherche de projet */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Décrivez votre projet
                  </label>
                  <Input
                    ref={inputRef}
                    placeholder="Ex: Rénovation salle de bain, cuisine, peinture..."
                    value={projectInput}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    className="w-full text-lg"
                    autoComplete="off"
                  />
                  
                  {/* Suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div 
                      ref={suggestionsRef}
                      className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
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
                
                <Link href={getSimulatorURL()}>
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg py-3"
                    size="lg"
                    disabled={!hasSelectedSuggestion}
                  >
                    <Search className="mr-2 h-5 w-5" />
                    <span className="lg:hidden">Lancer mon estimation</span>
                    <span className="hidden lg:inline">Lancer mon estimation gratuite</span>
                  </Button>
                </Link>
              </div>
              
              {/* Tags de projets populaires */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <span className="text-white/80 text-sm">Projets populaires :</span>
                {['Cuisine', 'Salle de bain', 'Peinture', 'Électricité'].map((tag) => (
                  <Link key={tag} href={`/simulateur-devis/steps?project=${encodeURIComponent(tag)}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      {tag}
                    </Button>
                  </Link>
                ))}
              </div>
              
              {/* Stats */}
              <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm">+3 000 artisans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">✓ Vérifiés et qualifiés</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">✓ Devis gratuits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Artisans - 36% sur desktop, auto sur mobile */}
      <div 
        className="text-white flex items-center justify-center min-h-[40vh] lg:min-h-auto"
        style={{ flex: "0 0 36%", backgroundColor: "#0F172A" }}
      >
        <div className="p-6 sm:p-8 text-center max-w-sm mx-auto">
          <div className="mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Vous êtes un artisan ?
            </h2>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Rejoignez notre réseau de professionnels qualifiés et développez votre activité
            </p>
          </div>
          
          <div className="space-y-3 mb-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-orange-400">✓</span>
              <span>Leads qualifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">✓</span>
              <span>Gestion simplifiée</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">✓</span>
              <span>Visibilité accrue</span>
            </div>
          </div>
          
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700" size="lg">
            <Link href="/devenir-pro">
              Devenir partenaire
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
