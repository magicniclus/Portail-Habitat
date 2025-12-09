import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VillePageEnrichi from "@/components/villes/VillePageEnrichi";

// Données des villes (même structure que dans Header)
const villes = [
  {
    id: "paris",
    name: "Paris",
    slug: "paris",
    description: "Trouvez des chantiers à Paris : rénovation haussmannienne, copropriétés, bureaux",
    region: "Île-de-France",
    population: "2 165 000",
    codePostal: "75000",
    stats: {
      chantiers: "50 000+",
      demande: "Très forte",
      prix: "Premium"
    },
    keywords: ["chantiers Paris", "artisan Paris", "rénovation Paris", "copropriété Paris", "haussmannien"],
    seo: {
      title: "Chantiers Paris 2024 : Guide Artisan + 50k Opportunités Capital",
      description: "Décrochez des chantiers à Paris ! Rénovation haussmannienne, copropriétés, bureaux. 50 000+ chantiers disponibles. Guide complet artisans parisiens.",
      keywords: "chantiers Paris, artisan Paris, trouver chantiers Paris, travaux Paris, rénovation Paris, copropriété Paris"
    }
  },
  {
    id: "lyon",
    name: "Lyon",
    slug: "lyon", 
    description: "Trouvez des chantiers à Lyon : écoquartiers, rénovation Soie, Part-Dieu",
    region: "Auvergne-Rhône-Alpes",
    population: "1 400 000",
    codePostal: "69000",
    stats: {
      chantiers: "25 000+",
      demande: "Forte",
      prix: "Élevé"
    },
    keywords: ["chantiers Lyon", "artisan Lyon", "écoquartier Lyon", "Part-Dieu", "métropole Lyon"],
    seo: {
      title: "Chantiers Lyon 2024 : Guide Artisan Rhône + 25k Opportunités",
      description: "Trouvez des chantiers à Lyon ! Écoquartiers, Part-Dieu, rénovation Soie. 25 000+ chantiers métropole. Guide artisans Rhône-Alpes.",
      keywords: "chantiers Lyon, artisan Lyon, travaux Lyon, BTP Lyon, métropole Lyon, écoquartier Confluence"
    }
  },
  {
    id: "marseille",
    name: "Marseille",
    slug: "marseille",
    description: "Trouvez des chantiers à Marseille : Euroméditerranée, rénovation urbaine, littoral",
    region: "Provence-Alpes-Côte d'Azur", 
    population: "870 000",
    codePostal: "13000",
    stats: {
      chantiers: "20 000+",
      demande: "Moyenne",
      prix: "Modéré"
    },
    keywords: ["chantiers Marseille", "artisan Marseille", "Euroméditerranée", "PACA", "rénovation urbaine"],
    seo: {
      title: "Chantiers Marseille 2024 : Guide Artisan PACA + 20k Opportunités",
      description: "Décrochez des chantiers à Marseille ! Euroméditerranée, rénovation urbaine, littoral. 20 000+ chantiers PACA. Guide artisans Provence.",
      keywords: "chantiers Marseille, artisan Marseille, BTP Marseille, Euroméditerranée, PACA chantiers"
    }
  },
  {
    id: "toulouse",
    name: "Toulouse",
    slug: "toulouse",
    description: "Trouvez des chantiers à Toulouse : aéronautique, université, ville rose",
    region: "Occitanie",
    population: "750 000", 
    codePostal: "31000",
    stats: {
      chantiers: "18 000+",
      demande: "Forte",
      prix: "Élevé"
    },
    keywords: ["chantiers Toulouse", "artisan Toulouse", "ville rose", "aéronautique", "Occitanie"],
    seo: {
      title: "Chantiers Toulouse 2024 : Guide Artisan Occitanie + 18k Opportunités",
      description: "Trouvez des chantiers à Toulouse ! Aéronautique, université, rénovation ville rose. 18 000+ chantiers Occitanie. Guide artisans Haute-Garonne.",
      keywords: "chantiers Toulouse, artisan Toulouse, BTP Toulouse, ville rose rénovation, Occitanie chantiers"
    }
  },
  {
    id: "nice",
    name: "Nice",
    slug: "nice",
    description: "Trouvez des chantiers à Nice : Côte d'Azur, villas, résidences de luxe",
    region: "Provence-Alpes-Côte d'Azur",
    population: "340 000",
    codePostal: "06000", 
    stats: {
      chantiers: "12 000+",
      demande: "Forte",
      prix: "Premium"
    },
    keywords: ["chantiers Nice", "artisan Nice", "Côte d'Azur", "villas luxe", "Alpes-Maritimes"],
    seo: {
      title: "Chantiers Nice 2024 : Guide Artisan Côte d'Azur + 12k Opportunités",
      description: "Décrochez des chantiers à Nice ! Villas luxe, résidences Côte d'Azur, rénovation premium. 12 000+ chantiers Alpes-Maritimes. Guide artisans PACA.",
      keywords: "chantiers Nice, artisan Nice, Côte d'Azur chantiers, villas Nice, BTP Alpes-Maritimes"
    }
  },
  {
    id: "nantes",
    name: "Nantes",
    slug: "nantes",
    description: "Trouvez des chantiers à Nantes : écoquartiers, île de Nantes, métropole",
    region: "Pays de la Loire",
    population: "650 000",
    codePostal: "44000",
    stats: {
      chantiers: "15 000+", 
      demande: "Forte",
      prix: "Modéré"
    },
    keywords: ["chantiers Nantes", "artisan Nantes", "île de Nantes", "écoquartier", "Loire-Atlantique"],
    seo: {
      title: "Chantiers Nantes 2024 : Guide Artisan Loire + 15k Opportunités",
      description: "Trouvez des chantiers à Nantes ! Île de Nantes, écoquartiers, métropole dynamique. 15 000+ chantiers Loire-Atlantique. Guide artisans Pays de Loire.",
      keywords: "chantiers Nantes, artisan Nantes, BTP Nantes, île de Nantes, Loire-Atlantique chantiers"
    }
  },
  {
    id: "montpellier",
    name: "Montpellier",
    slug: "montpellier",
    description: "Trouvez des chantiers à Montpellier : écoquartiers, tramway, université",
    region: "Occitanie",
    population: "480 000",
    codePostal: "34000",
    stats: {
      chantiers: "14 000+",
      demande: "Forte", 
      prix: "Élevé"
    },
    keywords: ["chantiers Montpellier", "artisan Montpellier", "écoquartier", "Hérault", "Occitanie"],
    seo: {
      title: "Chantiers Montpellier 2024 : Guide Artisan Hérault + 14k Opportunités",
      description: "Décrochez des chantiers à Montpellier ! Écoquartiers, tramway, université. 14 000+ chantiers Hérault. Guide artisans Occitanie dynamique.",
      keywords: "chantiers Montpellier, artisan Montpellier, BTP Montpellier, Hérault chantiers, Occitanie travaux"
    }
  },
  {
    id: "strasbourg",
    name: "Strasbourg",
    slug: "strasbourg",
    description: "Trouvez des chantiers à Strasbourg : européen, écoquartiers, rénovation",
    region: "Grand Est",
    population: "480 000",
    codePostal: "67000",
    stats: {
      chantiers: "13 000+",
      demande: "Moyenne",
      prix: "Modéré"
    },
    keywords: ["chantiers Strasbourg", "artisan Strasbourg", "européen", "Bas-Rhin", "Grand Est"],
    seo: {
      title: "Chantiers Strasbourg 2024 : Guide Artisan Grand Est + 13k Opportunités",
      description: "Trouvez des chantiers à Strasbourg ! Quartier européen, écoquartiers, rénovation. 13 000+ chantiers Bas-Rhin. Guide artisans Grand Est.",
      keywords: "chantiers Strasbourg, artisan Strasbourg, BTP Strasbourg, Bas-Rhin chantiers, Grand Est travaux"
    }
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    slug: "bordeaux",
    description: "Trouvez des chantiers à Bordeaux : pierre, tramway, métropole",
    region: "Nouvelle-Aquitaine",
    population: "760 000",
    codePostal: "33000",
    stats: {
      chantiers: "16 000+",
      demande: "Forte",
      prix: "Élevé"
    },
    keywords: ["chantiers Bordeaux", "artisan Bordeaux", "pierre Bordeaux", "Gironde", "Nouvelle-Aquitaine"],
    seo: {
      title: "Chantiers Bordeaux 2024 : Guide Artisan Gironde + 16k Opportunités",
      description: "Décrochez des chantiers à Bordeaux ! Rénovation pierre, tramway, métropole. 16 000+ chantiers Gironde. Guide artisans Nouvelle-Aquitaine.",
      keywords: "chantiers Bordeaux, artisan Bordeaux, BTP Bordeaux, Gironde chantiers, pierre Bordeaux"
    }
  },
  {
    id: "lille",
    name: "Lille",
    slug: "lille",
    description: "Trouvez des chantiers à Lille : métropole, rénovation urbaine, Flandres",
    region: "Hauts-de-France",
    population: "1 200 000",
    codePostal: "59000",
    stats: {
      chantiers: "22 000+",
      demande: "Moyenne",
      prix: "Modéré"
    },
    keywords: ["chantiers Lille", "artisan Lille", "métropole Lille", "Nord", "Hauts-de-France"],
    seo: {
      title: "Chantiers Lille 2024 : Guide Artisan Nord + 22k Opportunités",
      description: "Trouvez des chantiers à Lille ! Métropole européenne, rénovation urbaine. 22 000+ chantiers Nord. Guide artisans Hauts-de-France.",
      keywords: "chantiers Lille, artisan Lille, BTP Lille, Nord chantiers, métropole Lille"
    }
  },
  {
    id: "rennes",
    name: "Rennes",
    slug: "rennes",
    description: "Trouvez des chantiers à Rennes : métropole, université, innovation",
    region: "Bretagne",
    population: "450 000",
    codePostal: "35000",
    stats: {
      chantiers: "12 000+",
      demande: "Forte",
      prix: "Modéré"
    },
    keywords: ["chantiers Rennes", "artisan Rennes", "métropole Rennes", "Ille-et-Vilaine", "Bretagne"],
    seo: {
      title: "Chantiers Rennes 2024 : Guide Artisan Bretagne + 12k Opportunités",
      description: "Décrochez des chantiers à Rennes ! Métropole dynamique, université, innovation. 12 000+ chantiers Ille-et-Vilaine. Guide artisans Bretagne.",
      keywords: "chantiers Rennes, artisan Rennes, BTP Rennes, Bretagne chantiers, Ille-et-Vilaine"
    }
  }
];

interface VillePageProps {
  params: {
    slug: string;
  };
}

// Fonction pour récupérer la ville par slug
function getVilleBySlug(slug: string) {
  return villes.find(ville => ville.slug === slug);
}

// Génération des métadonnées dynamiques
export async function generateMetadata({ params }: VillePageProps): Promise<Metadata> {
  const { slug } = await params;
  const ville = getVilleBySlug(slug);
  
  if (!ville) {
    return {
      title: "Ville non trouvée",
    };
  }

  return {
    title: ville.seo.title,
    description: ville.seo.description,
    keywords: ville.seo.keywords,
    openGraph: {
      title: ville.seo.title,
      description: ville.seo.description,
      type: "article",
      locale: "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title: ville.seo.title,
      description: ville.seo.description,
    },
    alternates: {
      canonical: `https://portail-habitat.fr/villes/${ville.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Génération des pages statiques
export async function generateStaticParams() {
  return villes.map((ville) => ({
    slug: ville.slug,
  }));
}

export default async function VillePage({ params }: VillePageProps) {
  const { slug } = await params;
  const ville = getVilleBySlug(slug);

  if (!ville) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <VillePageEnrichi ville={ville} />
      </main>
      
      <Footer />
    </div>
  );
}
