import { Metadata } from "next";
import OnboardingStep4Content from "@/components/OnboardingStep4Content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Votre site professionnel pour 69€ - Portail Habitat",
  description: "Ajoutez votre site internet professionnel complet pour 69€ au lieu de 299€. Livré en 72h, optimisé SEO.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingStep4() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OnboardingStep4Content />
    </Suspense>
  );
}
