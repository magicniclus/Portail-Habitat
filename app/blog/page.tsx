import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogContent from "@/components/blog/BlogContent";
import BlogMetiersSection from "@/components/blog/BlogMetiersSection";

export const metadata: Metadata = {
  title: "Blog Habitat - Conseils Rénovation & Travaux | Portail Habitat",
  description: "Découvrez nos guides et conseils d'experts pour tous vos projets de rénovation : salle de bain, isolation, budget, tendances. Articles rédigés par des professionnels.",
  keywords: "blog rénovation, conseils travaux, guide rénovation, tendances habitat, budget travaux, isolation, salle de bain",
  openGraph: {
    title: "Blog Habitat - Conseils Rénovation & Travaux",
    description: "Guides et conseils d'experts pour réussir vos projets de rénovation",
    url: "https://portail-habitat.fr/blog",
    type: "website",
    images: [
      {
        url: "https://portail-habitat.fr/images/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Portail Habitat"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <BlogHero />
        <BlogMetiersSection />
        <BlogContent />
      </main>
      
      <Footer />
    </div>
  );
}
