import { Metadata } from "next";
import Link from "next/link";
import HeaderPro from "@/components/HeaderPro";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Tarifs Professionnels - Portail Habitat",
  description: "Découvrez nos offres d'abonnement pour professionnels du bâtiment. Plans Starter, Pro et Enterprise avec leads qualifiés et outils de gestion.",
  keywords: "tarifs, abonnement, professionnel, bâtiment, leads, devis",
  openGraph: {
    title: "Tarifs Professionnels - Portail Habitat",
    description: "Découvrez nos offres d'abonnement pour professionnels du bâtiment",
    url: "https://portail-habitat.fr/pricing",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/pricing",
  },
};

export default function Pricing() {
  const plans = [
    {
      title: "Starter",
      description: "Parfait pour débuter sur la plateforme",
      price: "29€",
      period: "/mois",
      features: ["5 leads par mois", "Profil basique", "Support email"],
      buttonText: "Commencer",
      buttonHref: "/connexion-pro",
      buttonVariant: "outline" as const,
    },
    {
      title: "Pro",
      description: "Pour les professionnels actifs",
      price: "79€",
      period: "/mois",
      features: ["20 leads par mois", "Profil premium", "Galerie photos", "Support prioritaire", "Statistiques avancées"],
      buttonText: "Commencer",
      buttonHref: "/connexion-pro",
      isPopular: true,
    },
    {
      title: "Enterprise",
      description: "Pour les grandes entreprises",
      price: "199€",
      period: "/mois",
      features: ["Leads illimités", "Profil premium+", "API access", "Support dédié", "Formations incluses"],
      buttonText: "Nous contacter",
      buttonHref: "/connexion-pro",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      <main className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tarifs Professionnels
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Choisissez l'offre qui correspond à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
