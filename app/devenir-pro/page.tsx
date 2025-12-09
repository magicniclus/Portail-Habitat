import { Metadata } from "next";
import GuaranteeBanner from "@/components/GuaranteeBanner";
import HeaderPro from "@/components/HeaderPro";
import Footer from "@/components/Footer";
import HeroWithForm from "@/components/HeroWithForm";
import TrustSection from "@/components/TrustSection";
import HowItWorks from "@/components/HowItWorks";
import ProjectsFeedPreview from "@/components/ProjectsFeedPreview";
import ProfessionsSection from "@/components/ProfessionsSection";
import ArtisanPageFeatures from "@/components/ArtisanPageFeatures";
import MobileAppSection from "@/components/MobileAppSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import RevenueSection from "@/components/RevenueSection";
import FinalCTA from "@/components/FinalCTA";

export const metadata: Metadata = {
  title: "Devenir Professionnel - Portail Habitat",
  description: "Rejoignez Portail Habitat et développez votre activité grâce à des leads qualifiés. Inscription gratuite pour les professionnels du bâtiment.",
  keywords: "devenir professionnel, inscription, leads, bâtiment, artisan, entrepreneur",
  openGraph: {
    title: "Devenir Professionnel - Portail Habitat",
    description: "Rejoignez Portail Habitat et développez votre activité grâce à des leads qualifiés",
    url: "https://portail-habitat.fr/devenir-pro",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/devenir-pro",
  },
};

export default function DevenirPro() {
  return (
    <div className="min-h-screen bg-white">
      <GuaranteeBanner />
      <HeaderPro />
      
      <main>
        <HeroWithForm />
        <TrustSection />
        <HowItWorks />
        <ArtisanPageFeatures />
        <ProjectsFeedPreview />
        <ProfessionsSection />
        <RevenueSection />
        <TestimonialsSection />
        <MobileAppSection />
      </main>
      
      <FinalCTA />
      <Footer />
    </div>
  );
}
