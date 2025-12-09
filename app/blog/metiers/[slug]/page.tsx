import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogMetierPageEnrichi from "@/components/blog/BlogMetierPageEnrichi";

// Données des métiers (même structure que dans BlogMetiersGrid)
const metiers = [
  {
    id: "plomberie",
    name: "Plomberie",
    slug: "plomberie",
    description: "Trouvez des chantiers de plomberie : réparations, installations, dépannages urgents",
    color: "#3B82F6",
    icon: "🔧",
    stats: {
      chantiers: "150+",
      demande: "Très forte",
      prix: "45-80€/h"
    },
    keywords: ["plombier", "fuite", "canalisation", "robinetterie", "chauffage"],
    seo: {
      title: "Trouver des Chantiers de Plomberie - Guide Complet 2024",
      description: "Découvrez comment trouver des chantiers de plomberie rentables. Conseils, stratégies et astuces pour développer votre activité de plombier. +150 chantiers/mois disponibles.",
      keywords: "chantiers plomberie, trouver clients plombier, plombier indépendant, dépannage plomberie, installation sanitaire"
    }
  },
  {
    id: "electricite",
    name: "Électricité", 
    slug: "electricite",
    description: "Chantiers électriques : installations, rénovations, mise aux normes, dépannages",
    color: "#F59E0B",
    icon: "⚡",
    stats: {
      chantiers: "120+",
      demande: "Très forte", 
      prix: "50-85€/h"
    },
    keywords: ["électricien", "installation", "tableau électrique", "prise", "éclairage"],
    seo: {
      title: "Chantiers Électricité - Comment Trouver des Clients Électricien",
      description: "Guide pour électriciens : trouvez des chantiers d'installation électrique, mise aux normes, dépannage. Stratégies éprouvées pour développer votre clientèle.",
      keywords: "chantiers électricité, électricien indépendant, installation électrique, mise aux normes, dépannage électrique"
    }
  },
  {
    id: "peinture",
    name: "Peinture",
    slug: "peinture", 
    description: "Travaux de peinture intérieure et extérieure, décoration, ravalement de façades",
    color: "#10B981",
    icon: "🎨",
    stats: {
      chantiers: "200+",
      demande: "Forte",
      prix: "25-45€/h"
    },
    keywords: ["peintre", "décoration", "façade", "intérieur", "rénovation"],
    seo: {
      title: "Chantiers Peinture - Trouver des Clients Peintre en Bâtiment",
      description: "Comment trouver des chantiers de peinture intérieure et extérieure. Conseils pour peintres : prospection, tarifs, techniques pour fidéliser vos clients.",
      keywords: "chantiers peinture, peintre bâtiment, peinture intérieure, peinture façade, décoration"
    }
  },
  {
    id: "maconnerie", 
    name: "Maçonnerie",
    slug: "maconnerie",
    description: "Chantiers de maçonnerie : gros œuvre, rénovation, extension, terrassement",
    color: "#8B5CF6",
    icon: "🧱",
    stats: {
      chantiers: "80+",
      demande: "Forte",
      prix: "35-60€/h"
    },
    keywords: ["maçon", "gros œuvre", "extension", "mur", "fondation"],
    seo: {
      title: "Chantiers Maçonnerie - Trouver des Clients Maçon Gros Œuvre",
      description: "Guide maçon : comment décrocher des chantiers de gros œuvre, extension, rénovation. Stratégies de prospection et conseils pour développer votre activité.",
      keywords: "chantiers maçonnerie, maçon gros œuvre, extension maison, rénovation, terrassement"
    }
  },
  {
    id: "menuiserie",
    name: "Menuiserie", 
    slug: "menuiserie",
    description: "Travaux de menuiserie : fenêtres, portes, placards, aménagements sur mesure",
    color: "#DC2626",
    icon: "🪚",
    stats: {
      chantiers: "100+",
      demande: "Forte",
      prix: "40-70€/h"
    },
    keywords: ["menuisier", "fenêtre", "porte", "placard", "aménagement"],
    seo: {
      title: "Chantiers Menuiserie - Trouver des Clients Menuisier Agenceur",
      description: "Comment trouver des chantiers de menuiserie : fenêtres, portes, aménagements. Guide complet pour menuisiers indépendants et entreprises.",
      keywords: "chantiers menuiserie, menuisier agenceur, fenêtre sur mesure, aménagement intérieur, porte"
    }
  },
  {
    id: "carrelage",
    name: "Carrelage",
    slug: "carrelage", 
    description: "Pose de carrelage, faïence, sols et murs, salles de bain, cuisines",
    color: "#059669",
    icon: "🏠",
    stats: {
      chantiers: "90+",
      demande: "Forte",
      prix: "30-55€/h"
    },
    keywords: ["carreleur", "faïence", "salle de bain", "cuisine", "sol"],
    seo: {
      title: "Chantiers Carrelage - Trouver des Clients Carreleur Faïencier",
      description: "Guide carreleur : comment décrocher des chantiers de pose carrelage, faïence, rénovation salle de bain. Conseils pour développer votre clientèle.",
      keywords: "chantiers carrelage, carreleur faïencier, pose carrelage, salle de bain, cuisine"
    }
  },
  {
    id: "chauffage",
    name: "Chauffage",
    slug: "chauffage",
    description: "Installation et maintenance chauffage : chaudières, radiateurs, pompes à chaleur",
    color: "#DC2626",
    icon: "🔥",
    stats: {
      chantiers: "70+", 
      demande: "Très forte",
      prix: "50-90€/h"
    },
    keywords: ["chauffagiste", "chaudière", "radiateur", "pompe à chaleur", "maintenance"],
    seo: {
      title: "Chantiers Chauffage - Trouver des Clients Chauffagiste Plombier",
      description: "Comment trouver des chantiers de chauffage : installation chaudière, pompe à chaleur, maintenance. Guide pour chauffagistes indépendants.",
      keywords: "chantiers chauffage, chauffagiste plombier, installation chaudière, pompe à chaleur, maintenance chauffage"
    }
  },
  {
    id: "couverture",
    name: "Couverture",
    slug: "couverture",
    description: "Travaux de toiture : réparation, rénovation, étanchéité, zinguerie",
    color: "#6B7280",
    icon: "🏘️",
    stats: {
      chantiers: "60+",
      demande: "Forte", 
      prix: "40-75€/h"
    },
    keywords: ["couvreur", "toiture", "tuile", "étanchéité", "zinguerie"],
    seo: {
      title: "Chantiers Couverture - Trouver des Clients Couvreur Zingueur",
      description: "Guide couvreur : comment décrocher des chantiers de toiture, réparation, étanchéité. Stratégies pour développer votre activité de couverture.",
      keywords: "chantiers couverture, couvreur zingueur, réparation toiture, étanchéité, zinguerie"
    }
  },
  {
    id: "isolation",
    name: "Isolation",
    slug: "isolation",
    description: "Isolation thermique et phonique : combles, murs, sols, économies d'énergie",
    color: "#7C3AED",
    icon: "🏠",
    stats: {
      chantiers: "85+",
      demande: "Très forte",
      prix: "25-50€/h"
    },
    keywords: ["isolation", "combles", "thermique", "économie énergie", "rénovation énergétique"],
    seo: {
      title: "Chantiers Isolation - Trouver des Clients Isolation Thermique",
      description: "Comment trouver des chantiers d'isolation thermique et phonique. Guide pour professionnels de l'isolation : combles, murs, rénovation énergétique.",
      keywords: "chantiers isolation, isolation thermique, isolation combles, rénovation énergétique, économie énergie"
    }
  }
];

interface MetierPageProps {
  params: {
    slug: string;
  };
}

// Fonction pour récupérer le métier par slug
function getMetierBySlug(slug: string) {
  return metiers.find(metier => metier.slug === slug);
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: MetierPageProps): Promise<Metadata> {
  const { slug } = await params;
  const metier = getMetierBySlug(slug);
  
  if (!metier) {
    return {
      title: "Métier non trouvé",
    };
  }

  return {
    title: metier.seo.title,
    description: metier.seo.description,
    keywords: metier.seo.keywords,
    openGraph: {
      title: metier.seo.title,
      description: metier.seo.description,
      url: `https://portail-habitat.fr/blog/metiers/${metier.slug}`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://portail-habitat.fr/blog/metiers/${metier.slug}`,
    },
  };
}

// Génération des pages statiques
export async function generateStaticParams() {
  return metiers.map((metier) => ({
    slug: metier.slug,
  }));
}

export default async function MetierPage({ params }: MetierPageProps) {
  const { slug } = await params;
  const metier = getMetierBySlug(slug);

  if (!metier) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <BlogMetierPageEnrichi metier={metier} />
      </main>
      
      <Footer />
    </div>
  );
}
