import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogMetiersGrid from "@/components/blog/BlogMetiersGrid";
import BlogMetiersHero from "@/components/blog/BlogMetiersHero";

export const metadata: Metadata = {
  title: "Trouver des Chantiers par Métier - Portail Habitat",
  description: "Découvrez des opportunités de chantiers dans votre métier : plomberie, électricité, peinture, maçonnerie, menuiserie et plus. Conseils et guides pour développer votre activité.",
  keywords: "chantiers plomberie, chantiers électricité, chantiers peinture, chantiers maçonnerie, chantiers menuiserie, trouver des clients, développer son activité artisan",
  openGraph: {
    title: "Trouver des Chantiers par Métier - Portail Habitat",
    description: "Guides et conseils pour trouver des chantiers dans votre métier d'artisan",
    url: "https://portail-habitat.fr/blog/metiers",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/blog/metiers",
  },
};

export default function BlogMetiersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <BlogMetiersHero />
        <BlogMetiersGrid />
      </main>
      
      <Footer />
    </div>
  );
}
