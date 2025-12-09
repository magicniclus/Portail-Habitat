import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

// Métiers populaires à afficher dans le blog
const metiersPopulaires = [
  {
    id: "plomberie",
    name: "Plomberie",
    slug: "plomberie",
    icon: "🔧",
    color: "#3B82F6",
    chantiers: "150+",
    description: "Dépannages, installations, réparations"
  },
  {
    id: "electricite", 
    name: "Électricité",
    slug: "electricite",
    icon: "⚡",
    color: "#F59E0B",
    chantiers: "120+",
    description: "Installations, mises aux normes, dépannages"
  },
  {
    id: "peinture",
    name: "Peinture", 
    slug: "peinture",
    icon: "🎨",
    color: "#10B981",
    chantiers: "200+",
    description: "Intérieur, extérieur, décoration"
  },
  {
    id: "maconnerie",
    name: "Maçonnerie",
    slug: "maconnerie", 
    icon: "🧱",
    color: "#8B5CF6",
    chantiers: "80+",
    description: "Gros œuvre, extensions, rénovations"
  },
  {
    id: "menuiserie",
    name: "Menuiserie",
    slug: "menuiserie",
    icon: "🪚", 
    color: "#DC2626",
    chantiers: "100+",
    description: "Fenêtres, portes, aménagements"
  },
  {
    id: "carrelage",
    name: "Carrelage",
    slug: "carrelage",
    icon: "🏠",
    color: "#059669", 
    chantiers: "90+",
    description: "Sols, murs, salles de bain"
  }
];

export default function BlogMetiersSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4" />
              NOS MÉTIERS
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trouvez des Chantiers dans votre Métier
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Guides spécialisés, conseils de prospection et stratégies pour développer 
              votre activité d'artisan selon votre domaine d'expertise.
            </p>
          </div>

          {/* Grille des métiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {metiersPopulaires.map((metier) => (
              <Card key={metier.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  {/* Header coloré */}
                  <div 
                    className="p-6 text-white relative"
                    style={{ backgroundColor: metier.color }}
                  >
                    <div className="absolute top-2 right-2 text-3xl opacity-30">
                      {metier.icon}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2">{metier.name}</h3>
                      <div className="text-sm text-white/90 mb-2">
                        {metier.chantiers} chantiers/mois
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {metier.description}
                    </p>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full group-hover:shadow-md transition-all"
                      style={{ 
                        borderColor: metier.color,
                        color: metier.color
                      }}
                    >
                      <Link href={`/blog/metiers/${metier.slug}`}>
                        Voir les conseils
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Plus de 15 métiers disponibles
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Chauffage, couverture, isolation, climatisation... Découvrez tous nos guides 
                métiers pour développer votre activité d'artisan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/blog/metiers">
                    Voir tous les métiers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/devenir-pro">
                    Rejoindre le réseau
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
