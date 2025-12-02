"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Crown, ArrowRight, X } from "lucide-react";

interface ProspectData {
  prospectId?: string;
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  selectedCity?: string;
  selectedZoneRadius?: number;
}

export default function OnboardingStep4Content() {
  const searchParams = useSearchParams();
  const [prospectData, setProspectData] = useState<ProspectData>({
    firstName: "",
    lastName: "",
    email: "",
    profession: ""
  });

  // Charger les données depuis les paramètres URL
  useEffect(() => {
    const data: ProspectData = {
      prospectId: searchParams.get("prospectId") || undefined,
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      email: searchParams.get("email") || "",
      profession: searchParams.get("profession") || "",
      selectedCity: searchParams.get("city") || "",
      selectedZoneRadius: parseInt(searchParams.get("selectedZoneRadius") || "30")
    };
    
    setProspectData(data);
  }, [searchParams]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header ultra-léger */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <Image
                src="/logo.png"
                alt="Portail Habitat"
                width={160}
                height={64}
                className="h-10 sm:h-12 w-auto"
              />
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0 text-center sm:text-left">
                <span className="text-base sm:text-lg font-medium text-gray-900">
                  Félicitations, votre abonnement est activé !
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Étape terminée
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal - UPSELL SITE */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Bloc principal - Upsell Site */}
        <Card className="bg-white shadow-lg border-0 mb-8">
          <CardContent className="p-12 text-center">
            {/* Titre principal */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Passez à l'étape supérieure dès maintenant
            </h1>
            
            {/* Sous-titre */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-12">
              Ajoutez votre site internet professionnel complet pour <span className="font-bold text-green-600">69 €</span> au lieu de <span className="line-through text-gray-500">199 €</span> (une seule fois)
            </p>

            {/* 4 lignes ultra-puissantes */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center justify-center space-x-4 text-base sm:text-lg lg:text-xl font-semibold text-green-600">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                <span className="text-left">Site vitrine complet + nom de domaine offert (.fr ou .com)</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-base sm:text-lg lg:text-xl font-semibold text-green-600">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                <span className="text-left">Optimisé SEO – référencé Google en 7-14 jours</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-base sm:text-lg lg:text-xl font-semibold text-green-600">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                <span className="text-left">+5 demandes par mois en moyenne une fois bien positionné</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-base sm:text-lg lg:text-xl font-semibold text-green-600">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                <span className="text-left">Crédibilité immédiate auprès de vos clients</span>
              </div>
            </div>

            {/* Bloc prix énorme */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 sm:p-8 mb-8">
              <div className="text-center">
                <div className="mb-6">
                  <span className="text-2xl sm:text-3xl text-gray-500 line-through">199 €</span>
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-green-600 my-4">69 €</div>
                  <p className="text-base sm:text-lg text-gray-700 font-medium">(une seule fois)</p>
                </div>
                
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  Livré en 72h maximum – Garantie satisfaction
                </p>
              </div>
            </div>

            {/* Bouton énorme */}
            <Button className="w-full max-w-2xl bg-green-700 hover:bg-green-800 text-white font-bold py-4 sm:py-6 px-6 sm:px-8 text-lg sm:text-xl lg:text-2xl rounded-xl mb-6">
              OUI, je veux mon site professionnel →
            </Button>

            {/* Texte rassurant */}
            <p className="text-gray-500 text-base sm:text-lg mb-8">
              Vous ne payez qu'une seule fois · Aucun abonnement supplémentaire
            </p>

            {/* Bouton secondaire discret */}
            <Button variant="outline" className="text-gray-500 border-gray-300 hover:bg-gray-50" asChild>
              <Link href="/connexion-pro">
                Non merci, aller au tableau de bord
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
