import { Search, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogMetiersHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            NOS MÉTIERS
          </div>
          
          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trouvez des <span className="text-blue-600">Chantiers</span>{" "}
            dans votre Métier
          </h1>
          
          {/* Sous-titre */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Guides, conseils et stratégies pour développer votre activité d'artisan. 
            Découvrez comment trouver plus de clients dans votre domaine d'expertise.
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                type="text"
                placeholder="Rechercher un métier..."
                className="bg-white pl-10 pr-28 py-3 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
              />
              <Button 
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
              >
                Rechercher
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mt-12 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">15+</div>
              <div>Métiers</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">100+</div>
              <div>Conseils</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">1000+</div>
              <div>Chantiers/mois</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
