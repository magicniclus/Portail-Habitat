import { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import PopularServices from "@/components/PopularServices";
import SimulatorSection from "@/components/SimulatorSection";
import ArtisansSection from "@/components/ArtisansSection";
import TipsSection from "@/components/TipsSection";
import AppSection from "@/components/AppSection";
import CTAButtons from "@/components/CTAButtons";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Portail Habitat - Plateforme de mise en relation bâtiment",
  description: "Trouvez des professionnels du bâtiment qualifiés près de chez vous. Plateforme de mise en relation entre particuliers et artisans pour tous vos projets habitat.",
  keywords: "bâtiment, artisan, rénovation, construction, devis, professionnel",
  openGraph: {
    title: "Portail Habitat - Plateforme de mise en relation bâtiment",
    description: "Trouvez des professionnels du bâtiment qualifiés près de chez vous",
    url: "https://portail-habitat.fr",
    siteName: "Portail Habitat",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <main>
        <ServicesSection />
        <PopularServices />
        <SimulatorSection />
        <ArtisansSection />
        <TipsSection />
        <AppSection />
      </main>
      <Footer />
    </div>
  );
}
