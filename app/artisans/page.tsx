import { Metadata } from "next";
import ArtisansClient from "./ArtisansClient";

export const metadata: Metadata = {
  title: "Artisans Partenaires - Portail Habitat",
  description: "Découvrez nos artisans partenaires qualifiés près de chez vous. Plombiers, électriciens, peintres et plus encore pour tous vos projets de rénovation.",
  keywords: "artisan, professionnel, bâtiment, rénovation, plombier, électricien, peintre, menuisier",
  openGraph: {
    title: "Artisans Partenaires - Portail Habitat",
    description: "Découvrez nos artisans partenaires qualifiés près de chez vous",
    url: "https://portail-habitat.fr/artisans",
    siteName: "Portail Habitat",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/artisans",
  },
};

export default function ArtisansPage() {
  return <ArtisansClient />;
}
