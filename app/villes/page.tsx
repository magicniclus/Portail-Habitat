import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Briefcase
} from "lucide-react";

export const metadata: Metadata = {
  title: "Chantiers par Ville 2024 : Guide Complet Artisans France",
  description: "Trouvez des chantiers dans votre ville ! Paris, Lyon, Marseille, Toulouse... Guides complets par ville avec opportunités locales, tarifs, spécificités. 200k+ chantiers France.",
  keywords: "chantiers ville, artisan ville, BTP France, trouver chantiers, travaux ville, opportunités locales",
  openGraph: {
    title: "Chantiers par Ville 2024 : Guide Complet Artisans France",
    description: "Trouvez des chantiers dans votre ville ! Guides complets par ville avec opportunités locales, tarifs, spécificités. 200k+ chantiers France.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/villes",
  },
};

// Données des villes principales
const villes = [
  {
    name: "Paris",
    slug: "paris",
    region: "Île-de-France",
    population: "2 165 000",
    chantiers: "50 000+",
    niveau: "Premium",
    color: "#6B7280",
    description: "Comment trouver des chantiers à Paris et en Île-de-France"
  },
  {
    name: "Lyon", 
    slug: "lyon",
    region: "Auvergne-Rhône-Alpes",
    population: "1 400 000", 
    chantiers: "25 000+",
    niveau: "Élevé",
    color: "#6B7280",
    description: "Trouver des chantiers à Lyon, Villeurbanne, Vénissieux"
  },
  {
    name: "Marseille",
    slug: "marseille", 
    region: "Provence-Alpes-Côte d'Azur",
    population: "870 000",
    chantiers: "20 000+",
    niveau: "Modéré", 
    color: "#6B7280",
    description: "Trouver chantiers Marseille, Aix-en-Provence, Aubagne"
  },
  {
    name: "Toulouse",
    slug: "toulouse",
    region: "Occitanie", 
    population: "750 000",
    chantiers: "18 000+",
    niveau: "Élevé",
    color: "#6B7280", 
    description: "Comment trouver des chantiers à Toulouse, Blagnac, Colomiers"
  },
  {
    name: "Nice",
    slug: "nice",
    region: "Provence-Alpes-Côte d'Azur",
    population: "340 000",
    chantiers: "12 000+", 
    niveau: "Premium",
    color: "#6B7280",
    description: "Trouver chantiers Nice, Cannes, Antibes, Monaco"
  },
  {
    name: "Nantes",
    slug: "nantes",
    region: "Pays de la Loire",
    population: "650 000",
    chantiers: "15 000+",
    niveau: "Modéré",
    color: "#6B7280",
    description: "Chantiers Nantes, Saint-Nazaire, Rezé, Saint-Herblain"
  },
  {
    name: "Montpellier", 
    slug: "montpellier",
    region: "Occitanie",
    population: "480 000",
    chantiers: "14 000+",
    niveau: "Élevé",
    color: "#6B7280",
    description: "Trouver chantiers Montpellier, Béziers, Nîmes, Perpignan"
  },
  {
    name: "Strasbourg",
    slug: "strasbourg", 
    region: "Grand Est",
    population: "480 000",
    chantiers: "13 000+",
    niveau: "Modéré",
    color: "#6B7280",
    description: "Chantiers Strasbourg, Mulhouse, Colmar, Haguenau"
  },
  {
    name: "Bordeaux",
    slug: "bordeaux",
    region: "Nouvelle-Aquitaine", 
    population: "760 000",
    chantiers: "16 000+",
    niveau: "Élevé",
    color: "#6B7280",
    description: "Trouver chantiers Bordeaux, Mérignac, Pessac, Talence"
  },
  {
    name: "Lille",
    slug: "lille",
    region: "Hauts-de-France",
    population: "1 200 000",
    chantiers: "22 000+", 
    niveau: "Modéré",
    color: "#6B7280",
    description: "Chantiers Lille, Roubaix, Tourcoing, Villeneuve-d'Ascq"
  },
  {
    name: "Rennes",
    slug: "rennes",
    region: "Bretagne",
    population: "450 000",
    chantiers: "12 000+",
    niveau: "Modéré", 
    color: "#6B7280",
    description: "Trouver chantiers Rennes, Saint-Malo, Brest, Vannes"
  }
];

export default function VillesPage() {
  const totalChantiers = villes.reduce((total, ville) => {
    const nombre = parseInt(ville.chantiers.replace(/[^0-9]/g, ''));
    return total + nombre;
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Chantiers par Ville 2024
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Apprenez comment trouver des chantiers dans votre ville. 
                Guides complets avec stratégies de prospection, réseaux locaux et conseils d'experts.
              </p>
              
              {/* Stats globales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{Math.floor(totalChantiers/1000)}k+</div>
                  <div className="text-sm text-gray-600">Stratégies pour trouver</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{villes.length}</div>
                  <div className="text-sm text-gray-600">Villes couvertes</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">2500+</div>
                  <div className="text-sm text-gray-600">Mots par guide</div>
                </div>
              </div>
            </div>

            {/* Grille des villes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {villes.map((ville) => (
                <Card key={ville.slug} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    {/* Header avec région */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: ville.color, color: ville.color }}
                      >
                        {ville.region}
                      </Badge>
                      <Badge 
                        className="text-xs text-white"
                        style={{ backgroundColor: ville.color }}
                      >
                        {ville.niveau}
                      </Badge>
                    </div>

                    {/* Nom de la ville */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {ville.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {ville.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{ville.population} habitants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Briefcase className="w-4 h-4" />
                        <span>{ville.chantiers} chantiers/an</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4" />
                        <span>Niveau {ville.niveau.toLowerCase()}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button 
                      asChild 
                      className="w-full group-hover:shadow-md transition-all"
                      style={{ backgroundColor: ville.color }}
                    >
                      <Link href={`/villes/${ville.slug}`}>
                        Guide complet {ville.name}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Section avantages */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Pourquoi choisir une approche locale ?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Chaque ville a ses spécificités : réglementation, clientèle, concurrence, tarifs. 
                  Nos guides vous donnent les clés pour réussir localement.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Spécificités locales</h3>
                  <p className="text-sm text-gray-600">
                    Réglementation, contraintes, opportunités spécifiques à chaque ville
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tarification adaptée</h3>
                  <p className="text-sm text-gray-600">
                    Grilles tarifaires selon le niveau de vie et la concurrence locale
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Réseaux locaux</h3>
                  <p className="text-sm text-gray-600">
                    Contacts, événements, partenariats pour développer votre réseau
                  </p>
                </div>
              </div>
            </div>

            {/* CTA final */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Prêt à développer votre activité ?
              </h2>
              <p className="text-gray-600 mb-6">
                Rejoignez notre réseau d'artisans et accédez à des milliers de chantiers dans votre ville.
              </p>
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/devenir-pro">
                  Rejoindre le réseau
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
