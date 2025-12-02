import { Metadata } from "next";
import { Suspense } from "react";
import OnboardingStep3Content from "@/components/OnboardingStep3Content";

export const metadata: Metadata = {
  title: "Finalisation - Portail Habitat",
  description: "Finalisez votre inscription sur Portail Habitat et commencez à recevoir des demandes de travaux qualifiées.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingStep3() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <OnboardingStep3Content />
    </Suspense>
  );
}
