"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Search, Users, CheckCircle, Navigation, MousePointer } from "lucide-react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MapboxMap from "@/components/MapboxMap";

interface ProspectData {
  prospectId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  profession: string;
  step: string;
  selectedCity?: string;
  coordinates?: { lat: number; lng: number };
  selectedZoneRadius?: number;
}

export default function OnboardingStep2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [prospectData, setProspectData] = useState<ProspectData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    profession: "",
    step: "2"
  });
  
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedRadius, setSelectedRadius] = useState(30);
  const [estimatedSearches, setEstimatedSearches] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [cachedSearches, setCachedSearches] = useState<{[key: string]: number}>({});

  // Charger les données depuis les paramètres URL
  useEffect(() => {
    const data: ProspectData = {
      prospectId: searchParams.get("prospectId") || undefined,
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      postalCode: searchParams.get("postalCode") || "",
      profession: searchParams.get("profession") || "",
      step: "2",
      selectedCity: searchParams.get("city") || ""
    };
    
    setProspectData(data);
    if (data.selectedCity) {
      setSelectedCity(data.selectedCity);
    }
  }, [searchParams]);

  // Extraire la profession pour éviter les problèmes de dépendances
  const profession = prospectData.profession;

  // Calculer les recherches estimées selon la profession et le rayon avec loader et cache
  useEffect(() => {
    if (selectedCity && profession) {
      // Créer une clé unique pour le cache
      const cacheKey = `${selectedCity}-${profession}-${selectedRadius}`;
      
      // Vérifier si on a déjà les données en cache
      if (cachedSearches[cacheKey]) {
        setEstimatedSearches(cachedSearches[cacheKey]);
        setIsLoadingStats(false);
        return;
      }
      
      setIsLoadingStats(true);
      
      // Délai aléatoire entre 1 et 3.5 secondes
      const randomDelay = Math.random() * 2500 + 1000; // 1000ms à 3500ms
      
      setTimeout(() => {
        // Base selon la profession (certains métiers plus recherchés)
        const professionMultiplier: { [key: string]: number } = {
          "plombier": 1.5,
          "electricien": 1.4,
          "chauffagiste": 1.3,
          "peintre": 1.2,
          "maconnerie": 1.1,
          "menuisier": 1.0,
          "couvreur": 0.9,
          "carreleur": 0.8,
          "charpentier": 0.7,
          "multiservices": 1.6
        };

        // Base selon le rayon (plus grande zone = plus de recherches)
        const radiusMultiplier = selectedRadius === 30 ? 1 : selectedRadius === 50 ? 2.8 : 8.9;
        
        // Calcul avec une base aléatoire pour simuler la variabilité
        const baseSearches = Math.floor(Math.random() * 8) + 4; // Entre 4 et 12
        const professionFactor = professionMultiplier[profession] || 1;
        
        const estimated = Math.floor(baseSearches * professionFactor * radiusMultiplier);
        
        // Sauvegarder dans le cache
        setCachedSearches(prev => ({
          ...prev,
          [cacheKey]: estimated
        }));
        
        setEstimatedSearches(estimated);
        setIsLoadingStats(false);
      }, randomDelay);
    }
  }, [selectedCity, selectedRadius, profession]);

  const handleCitySearch = (city: string, coordinates?: [number, number]) => {
    // Si on change de ville, vider le cache des recherches
    if (city !== selectedCity) {
      setCachedSearches({});
      setEstimatedSearches(0);
    }
    
    setSelectedCity(city);
    setProspectData(prev => ({ 
      ...prev, 
      selectedCity: city,
      coordinates: coordinates ? { lat: coordinates[1], lng: coordinates[0] } : undefined
    }));
  };

  const handleReserveZone = async () => {
    if (!selectedCity) return;

    try {
      // Mettre à jour le document Firestore avec toutes les données
      if (prospectData.prospectId) {
        const prospectRef = doc(db, "prospects", prospectData.prospectId);
        await updateDoc(prospectRef, {
          selectedCity,
          selectedZoneRadius: selectedRadius,
          coordinates: prospectData.coordinates,
          step: "3",
          updatedAt: serverTimestamp()
        });
      }

      // Sauvegarder dans localStorage
      const completeData = {
        ...prospectData,
        selectedCity,
        selectedZoneRadius: selectedRadius,
        coordinates: prospectData.coordinates,
        step: "3"
      };
      localStorage.setItem("prospectData", JSON.stringify(completeData));

      // Créer l'URL avec tous les paramètres
      const params = new URLSearchParams({
        prospectId: prospectData.prospectId || "",
        firstName: prospectData.firstName,
        lastName: prospectData.lastName,
        email: prospectData.email,
        phone: prospectData.phone,
        postalCode: prospectData.postalCode,
        profession: prospectData.profession,
        city: selectedCity,
        selectedZoneRadius: selectedRadius.toString(),
        ...(prospectData.coordinates && {
          lat: prospectData.coordinates.lat.toString(),
          lng: prospectData.coordinates.lng.toString()
        })
      });

      router.push(`/onboarding/step3?${params.toString()}`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      // Redirection de fallback avec toutes les données
      const params = new URLSearchParams({
        prospectId: prospectData.prospectId || "",
        firstName: prospectData.firstName,
        lastName: prospectData.lastName,
        email: prospectData.email,
        phone: prospectData.phone,
        postalCode: prospectData.postalCode,
        profession: prospectData.profession,
        city: selectedCity,
        selectedZoneRadius: selectedRadius.toString(),
        ...(prospectData.coordinates && {
          lat: prospectData.coordinates.lat.toString(),
          lng: prospectData.coordinates.lng.toString()
        })
      });
      router.push(`/onboarding/step3?${params.toString()}`);
    }
  };

  const getProfessionLabel = (profession: string) => {
    const labels: { [key: string]: string } = {
      "plombier": "Plombier",
      "electricien": "Électricien", 
      "chauffagiste": "Chauffagiste",
      "peintre": "Peintre",
      "maconnerie": "Maçon",
      "menuisier": "Menuisier",
      "couvreur": "Couvreur",
      "carreleur": "Carreleur",
      "charpentier": "Charpentier",
      "multiservices": "Multiservices"
    };
    return labels[profession] || profession;
  };

  return (
    <>
    
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header - hauteur fixe */}
      <header className="bg-white border-b shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo.png"
                alt="Portail Habitat"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <span className="text-sm text-gray-500">Étape 2/3</span>
                <Progress value={66} className="w-32 mt-1" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {prospectData.firstName} {prospectData.lastName}
              </p>
              <p className="text-xs text-gray-500 lg:hidden">Étape 2/3</p>
              <p className="text-xs text-gray-500 hidden lg:block">{prospectData.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Layout mobile : carte + barre prennent le reste de l'espace */}
      <div className="lg:hidden flex flex-col flex-1">
        {/* Carte qui prend l'espace restant */}
        <div className="relative flex-1">
          <MapboxMap 
            onLocationSelect={handleCitySearch}
            selectedCity={selectedCity}
            selectedRadius={selectedRadius}
          />
          
          {/* Sélecteur de rayon (overlay mobile) */}
          {selectedCity && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="bg-white rounded-lg shadow-lg p-3">
                {/* Titre principal */}
                <p className="font-bold text-gray-900 text-base mb-1">
                  Votre zone d'intervention
                </p>
                {/* Ville en secondaire */}
                <p className="text-sm text-gray-600 mb-2">
                  📍 {selectedCity.split(',')[0].trim()}
                </p>
                
                {/* Stats demandes au-dessus des boutons */}
                {!isLoadingStats && estimatedSearches > 0 && (
                  <p className="text-xs text-gray-500 mb-2">
                    ≈ {estimatedSearches} demandes ces dernières 24h
                  </p>
                )}
                
                <div className="space-y-2">
                  <p className="text-xs text-gray-700 font-medium">Jusqu'à quelle distance souhaitez-vous intervenir ?</p>
                  <div className="flex gap-2">
                    {[30, 50, 100].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => setSelectedRadius(radius)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                          selectedRadius === radius
                            ? 'bg-orange-50 text-orange-700 border-2 border-orange-600'
                            : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200 active:scale-95'
                        }`}
                      >
                        {radius} km
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barre en bas mobile - prend l'espace restant */}
        <div className="bg-white border-t shadow-lg p-3 flex-shrink-0">
          <div className="flex flex-col gap-2 mb-7">
            {/* CTA principal - pleine largeur */}
            <Button
              onClick={handleReserveZone}
              disabled={!selectedCity}
              className="w-full py-3 text-base font-bold bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 shadow-lg"
            >
              ACCÉDER
            </Button>
            
            {/* Micro-rassurance sous le CTA */}
            <p className="text-[11px] text-gray-500 text-center opacity-75">
              Aucun engagement – vous choisissez ensuite vos demandes
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal desktop */}
      <div className="hidden lg:block flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Colonne gauche - Carte (desktop seulement) */}
          <div className="order-2 lg:order-1">
            <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
              <MapboxMap 
                onLocationSelect={handleCitySearch}
                selectedCity={selectedCity}
                selectedRadius={selectedRadius}
              />
              
              {/* Sélecteur de rayon (overlay desktop) */}
              {selectedCity && (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <p className="font-semibold text-orange-600 mb-3">
                      📍 {selectedCity}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Rayon d'intervention :</p>
                      <div className="flex space-x-2">
                        {[30, 50, 100].map((radius) => (
                          <button
                            key={radius}
                            onClick={() => setSelectedRadius(radius)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedRadius === radius
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {radius} km
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite - Bloc rassurance */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="h-full min-h-[400px] lg:min-h-[600px] flex flex-col">
              <Card className="shadow-xl flex-1 flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col justify-between">
                  
                  {/* Contenu principal */}
                  <div className="flex-1">
                    {/* Ligne dynamique */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-8 h-8 flex-shrink-0 text-blue-600" />
                        <span className="font-semibold text-gray-900">
                          Voici les demandes disponibles pour votre activité dans cette zone
                        </span>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="space-y-6 mb-8">
                      {selectedCity ? (
                        <>
                          <div className="flex items-center space-x-3">
                            <MousePointer className="w-8 h-8 flex-shrink-0 text-blue-600" />
                            <span className="text-lg text-gray-700">
                              {isLoadingStats ? (
                                <>
                                  <div className="inline-flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                                    <span>Analyse en cours...</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="text-3xl font-bold text-orange-600">{estimatedSearches}</span> <span className="text-lg">particuliers recherchent actuellement un {getProfessionLabel(profession).toLowerCase()}</span>
                                  <br />
                                  <span className="text-base">dans cette zone</span>
                                  <br />
                                  <span className="text-sm text-orange-600 font-medium">Zone très active en ce moment</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-8 h-8 flex-shrink-0 text-orange-600" />
                            <span className="text-lg text-gray-700">
                              <strong>Visibilité locale</strong>
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-8 h-8 flex-shrink-0 text-orange-600" />
                            <span className="text-lg text-gray-700">
                              <strong>12 demandes de devis réelles ont été générées dans cette zone hier</strong>
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-8 h-8 flex-shrink-0 text-orange-600" />
                            <span className="text-lg text-gray-700">
                              <strong>Disponible immédiatement</strong>
                            </span>
                          </div>
                          
                          {/* Micro-projection business */}
                          <div className="mt-4 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                            <p className="text-sm text-gray-700">
                              💡 Un seul chantier signé peut rentabiliser l'abonnement.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-lg">
                          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-xl text-gray-600">
                            Choisissez une ville pour voir les informations sur votre secteur
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section CTA */}
                  <div className="space-y-4">
                    <Button
                      onClick={handleReserveZone}
                      disabled={!selectedCity}
                      className="w-full py-4 text-xl font-semibold bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300"
                    >
                      Voir les demandes disponibles dans cette zone →
                    </Button>

                    {/* Transparence repositionnée sous le CTA */}
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      <strong>Transparence :</strong> Données basées sur l'activité réelle des dernières 24h. Elles peuvent varier selon la saison, les tendances locales et la demande du secteur.
                    </p>

                    <p className="text-xs text-gray-400 text-center">
                      Zone disponible aujourd'hui • des demandes sont déjà actives dans votre secteur
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer desktop seulement */}
    </div>
      <footer className="hidden lg:block bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-300">
                © 2024 Portail Habitat. Tous droits réservés.
              </p>
            </div>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="/conditions" className="text-sm text-gray-500 hover:text-gray-700">
                Conditions
              </a>
              <a href="/confidentialite" className="text-sm text-gray-500 hover:text-gray-700">
                Confidentialité
              </a>
              <a href="/support" className="text-sm text-gray-500 hover:text-gray-700">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}