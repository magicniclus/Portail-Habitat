import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BlogHero() {
  return (
    <section className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            BLOG HABITAT
          </div>
          
          {/* Titre principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Conseils & Guides pour vos{" "}
            <span className="text-orange-600">Travaux</span>
          </h1>
          
          {/* Sous-titre */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez nos articles rédigés par des experts pour réussir tous vos projets de rénovation et d'aménagement.
          </p>
          
          {/* Barre de recherche */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                type="text"
                placeholder="Rechercher un article..."
                className="bg-white pl-10 pr-28 py-3 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500 shadow-sm"
              />
              <Button 
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700"
              >
                Rechercher
              </Button>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mt-12 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">50+</div>
              <div>Articles</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">10+</div>
              <div>Experts</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900">5</div>
              <div>Catégories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
