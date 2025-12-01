import { Metadata } from "next";
import { Suspense } from "react";
import OnboardingStep2Content from "@/components/OnboardingStep2Content";

export const metadata: Metadata = {
  title: "Choisir votre zone - Étape 2/3 | Portail Habitat",
  description: "Sélectionnez votre zone d'intervention géographique pour recevoir des demandes de devis qualifiées.",
  robots: "noindex, nofollow"
};

function OnboardingStep2Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <OnboardingStep2Content />
    </Suspense>
  );
}

export default OnboardingStep2Page;
