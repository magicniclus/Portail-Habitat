"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Download, Star, MapPin, Bell, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AppSection() {
  const features = [
    {
      icon: Search,
      title: "Recherche avancée",
      description: "Trouvez des chantiers près de chez vous selon vos critères"
    },
    {
      icon: Bell,
      title: "Notifications en temps réel",
      description: "Soyez alerté dès qu'un nouveau chantier correspond à votre profil"
    },
    {
      icon: MapPin,
      title: "Géolocalisation",
      description: "Visualisez les chantiers sur une carte interactive"
    },
    {
      icon: Star,
      title: "Système de notation",
      description: "Consultez les avis clients et construisez votre réputation"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Contenu à gauche */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-left">
              Notre application
              <span className="block text-orange-600">Portail Habitat</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 text-left">
              L'application mobile dédiée aux artisans pour trouver des chantiers 
              près de chez eux. Développez votre activité en toute simplicité.
            </p>

            {/* Fonctionnalités */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>


            {/* Stats */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">Note moyenne</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2K+</div>
                <div className="text-sm text-gray-600">Téléchargements</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Artisans actifs</div>
              </div>
            </div>

            {/* Logos des stores */}
            <div className="flex items-center gap-4 mt-8">
              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="Télécharger sur l'App Store"
                  className="h-12 w-auto"
                />
              </a>
              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Disponible sur Google Play"
                  className="h-18 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Mockup de l'app à droite */}
          <div className="relative">
            <div className="relative max-w-sm mx-auto">
              {/* Écran du téléphone */}
              <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Contenu de l'écran */}
                  <div className="relative aspect-[9/16]">
                    {/* Header */}
                    <div className="bg-orange-600 px-4 py-3 flex items-center justify-between">
                      <h3 className="text-white font-semibold text-sm">Portail Habitat</h3>
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Contenu principal */}
                    <div className="p-4 bg-gray-50 flex-1">
                      {/* Barre de recherche */}
                      <div className="bg-white rounded-lg p-3 mb-4 flex items-center gap-2 shadow-sm">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">Rechercher un chantier...</span>
                      </div>
                      
                      {/* Liste des chantiers */}
                      <div className="space-y-3">
                        {[
                          { title: "Rénovation salle de bain", location: "Paris 15ème", time: "Il y a 2h" },
                          { title: "Installation électrique", location: "Boulogne", time: "Il y a 4h" },
                          { title: "Pose de carrelage", location: "Issy-les-Moulineaux", time: "Il y a 6h" }
                        ].map((chantier, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 text-sm">{chantier.title}</h4>
                              <span className="text-gray-500 text-xs">{chantier.time}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 text-xs">{chantier.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-orange-600 text-xs font-medium">Voir détails</span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div className="w-10 h-2 bg-orange-600 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Bottom navigation */}
                    <div className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
                      {[
                        { icon: "🏠", active: true },
                        { icon: "🔍", active: false },
                        { icon: "📋", active: false },
                        { icon: "👤", active: false }
                      ].map((item, index) => (
                        <div key={index} className={`p-2 rounded-lg ${item.active ? 'bg-orange-100' : ''}`}>
                          <span className="text-lg">{item.icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
