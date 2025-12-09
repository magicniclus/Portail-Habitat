"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, MapPin } from "lucide-react";

// Liste des métiers avec leurs données SEO
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
    keywords: ["plombier", "fuite", "canalisation", "robinetterie", "chauffage"]
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
    keywords: ["électricien", "installation", "tableau électrique", "prise", "éclairage"]
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
    keywords: ["peintre", "décoration", "façade", "intérieur", "rénovation"]
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
    keywords: ["maçon", "gros œuvre", "extension", "mur", "fondation"]
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
    keywords: ["menuisier", "fenêtre", "porte", "placard", "aménagement"]
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
    keywords: ["carreleur", "faïence", "salle de bain", "cuisine", "sol"]
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
    keywords: ["chauffagiste", "chaudière", "radiateur", "pompe à chaleur", "maintenance"]
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
    keywords: ["couvreur", "toiture", "tuile", "étanchéité", "zinguerie"]
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
    keywords: ["isolation", "combles", "thermique", "économie énergie", "rénovation énergétique"]
  }
];

export default function BlogMetiersGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* En-tête */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explorez les Opportunités par Métier
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque métier a ses spécificités. Découvrez des conseils personnalisés, 
              des stratégies de prospection et des guides pour développer votre activité.
            </p>
          </div>

          {/* Grille des métiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {metiers.map((metier) => (
              <Card key={metier.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardContent className="p-0">
                  {/* Header coloré */}
                  <div 
                    className="p-6 text-white relative overflow-hidden"
                    style={{ backgroundColor: metier.color }}
                  >
                    <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12">
                      {metier.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-2">{metier.name}</h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {metier.description}
                      </p>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-gray-400 mr-1" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{metier.stats.chantiers}</div>
                        <div className="text-xs text-gray-500">Chantiers/mois</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{metier.stats.demande}</div>
                        <div className="text-xs text-gray-500">Demande</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{metier.stats.prix}</div>
                        <div className="text-xs text-gray-500">Tarif moyen</div>
                      </div>
                    </div>

                    {/* Mots-clés */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {metier.keywords.slice(0, 3).map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button 
                      asChild 
                      className="w-full group-hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: metier.color }}
                    >
                      <Link href={`/blog/metiers/${metier.slug}`}>
                        Découvrir les chantiers
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA global */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Vous ne trouvez pas votre métier ?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Portail Habitat travaille avec plus de 50 métiers du bâtiment. 
                Contactez-nous pour découvrir les opportunités dans votre domaine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/devenir-pro">
                    Rejoindre le réseau
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/blog">
                    Retour au blog
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
