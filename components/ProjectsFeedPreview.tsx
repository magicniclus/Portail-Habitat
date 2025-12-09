"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Euro, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  type: string;
  ville: string;
  budget: string;
  delai: string;
  badge?: "Nouveau" | "Urgent";
}

const projects: Project[] = [
  {
    id: "1",
    type: "Rénovation salle de bain",
    ville: "Bordeaux",
    budget: "6 000 – 8 000 €",
    delai: "Sous 1 mois",
    badge: "Nouveau"
  },
  {
    id: "2", 
    type: "Isolation des combles",
    ville: "Mérignac",
    budget: "4 000 – 6 500 €",
    delai: "2 mois"
  },
  {
    id: "3",
    type: "Réfection toiture", 
    ville: "Pessac",
    budget: "9 000 – 14 000 €",
    delai: "Urgent",
    badge: "Urgent"
  },
  {
    id: "4",
    type: "Pose cuisine complète",
    ville: "Talence", 
    budget: "7 000 – 10 000 €",
    delai: "1 à 3 mois"
  }
];

export default function ProjectsFeedPreview() {
  const handleScrollToOnboarding = () => {
    const onboardingSection = document.getElementById('onboarding');
    if (onboardingSection) {
      onboardingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          {/* Mini-label au-dessus */}
          <div className="mb-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium px-3 py-1">
              EXEMPLES DE PROJETS
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Des projets réels déposés chaque jour par des particuliers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-3">
            Voici des exemples de demandes actuellement visibles par nos partenaires dans leur espace.
          </p>
          
          {/* Micro-détail de preuve */}
          <p className="text-sm text-gray-500 italic">
            Ces exemples sont basés sur des projets déposés récemment sur Portail Habitat.
          </p>
        </div>

        {/* Grille de projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl border-0 relative">
              {/* Badge sur la carte */}
              {project.badge && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge 
                    variant={project.badge === "Urgent" ? "destructive" : "default"}
                    className={project.badge === "Nouveau" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {project.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 pr-16">
                  {project.type}
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Ville */}
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                  <span className="text-sm">{project.ville}</span>
                </div>

                {/* Budget */}
                <div className="flex items-center text-gray-600">
                  <Euro className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">{project.budget}</span>
                </div>

                {/* Délai */}
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm">{project.delai}</span>
                </div>

                {/* Bouton */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                >
                  Voir le projet
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bloc de conversion */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Ces projets sont visibles en temps réel par nos partenaires. Vous choisissez ceux qui vous intéressent, sans aucune obligation.
          </p>
          <Button 
            onClick={handleScrollToOnboarding}
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Voir les demandes dans ma zone
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
