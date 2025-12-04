"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [projet, setProjet] = useState("");
  const [metier, setMetier] = useState("");
  const [localisation, setLocalisation] = useState("");

  const metiers = [
    "Plomberie", "Électricité", "Peinture", "Maçonnerie", "Menuiserie",
    "Carrelage", "Chauffage", "Couverture", "Isolation", "Climatisation"
  ];

  const handleSearch = () => {
    console.log("Recherche:", { projet, metier, localisation });
  };

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
                Que cherchez-vous ? Quel projet souhaitez-vous réaliser ?
              </p>
              
              {/* Formulaire de recherche */}
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Décrivez votre projet
                  </label>
                  <Input
                    placeholder="Ex: pose de carrelage, rénovation salle de bain, extension..."
                    value={projet}
                    onChange={(e) => setProjet(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Type de métier
                    </label>
                    <Select value={metier} onValueChange={setMetier}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un métier" />
                      </SelectTrigger>
                      <SelectContent>
                        {metiers.map((m) => (
                          <SelectItem key={m} value={m.toLowerCase()}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Localisation
                    </label>
                    <Input
                      placeholder="Ville ou code postal"
                      value={localisation}
                      onChange={(e) => setLocalisation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  <span className="lg:hidden">Rechercher</span>
                  <span className="hidden lg:inline">Chercher parmi plus de 12 000 artisans</span>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm">+12 000 artisans</span>
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
        className="bg-gray-800 text-white flex items-center justify-center min-h-[40vh] lg:min-h-auto"
        style={{ flex: "0 0 36%" }}
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
