import { Smartphone, Bell, Calendar, MessageCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function MobileAppSection() {
  const features = [
    {
      icon: Bell,
      title: "Notifications instantanées",
      description: "Recevez vos demandes de devis en temps réel"
    },
    {
      icon: MessageCircle,
      title: "Chat avec les clients",
      description: "Communiquez directement avec vos prospects"
    },
    {
      icon: Calendar,
      title: "Gestion de planning",
      description: "Organisez vos rendez-vous et chantiers"
    },
    {
      icon: BarChart3,
      title: "Suivi d'activité",
      description: "Analysez vos performances et revenus"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Contenu gauche */}
          <div>
            <div className="mb-8">
              <div className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm mb-6">
                NOTRE APPLICATION MOBILE
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Téléchargez notre appli
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Trouvez et gérez vos projets de chantier encore plus facilement avec 
                l'appli Portail Habitat. Recevez des notifications instantanées et 
                gérez votre entreprise où que vous soyez.
              </p>
            </div>

            {/* Fonctionnalités */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Boutons de téléchargement - Desktop seulement */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-4">
              <a 
                href="#" 
                className="inline-flex items-center justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Disponible sur</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </div>
              </a>

              <a 
                href="#" 
                className="inline-flex items-center justify-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.445 12l2.253-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs">Disponible sur</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Téléphone à droite */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Mockup de téléphone */}
              <div className="relative w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  
                  {/* Barre de statut */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center text-sm">
                    <span className="font-semibold">9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      <div className="w-6 h-3 border border-gray-400 rounded-sm">
                        <div className="w-4 h-full bg-green-500 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu de l'app */}
                  <div className="p-6 space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Portail Habitat Pro
                      </h3>
                      <p className="text-sm text-gray-600">
                        Gérez votre activité en déplacement
                      </p>
                    </div>

                    {/* Notification card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">
                            Nouvelle demande
                          </div>
                          <div className="text-xs text-gray-600">
                            Rénovation salle de bain • Lyon 3e
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-700">12</div>
                        <div className="text-xs text-green-600">Demandes ce mois</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-orange-700">€2,450</div>
                        <div className="text-xs text-orange-600">Revenus estimés</div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="space-y-2 mt-6">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium">Planning</span>
                        </div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Messages</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Statistiques</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Éléments décoratifs */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Boutons de téléchargement - Mobile seulement (en dessous du téléphone) */}
        <div className="lg:hidden mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#" 
              className="inline-flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Disponible sur</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </div>
            </a>

            <a 
              href="#" 
              className="inline-flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.445 12l2.253-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Disponible sur</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
