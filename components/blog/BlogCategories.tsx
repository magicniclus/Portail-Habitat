"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import blogData from "@/data/blog-articles.json";

interface BlogCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function BlogCategories({ selectedCategory, onCategoryChange }: BlogCategoriesProps) {
  const { categories } = blogData;

  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Titre */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Explorez par catégorie
            </h2>
            <p className="text-gray-600">
              Trouvez rapidement les conseils qui vous intéressent
            </p>
          </div>
          
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap justify-center gap-3">
            {/* Bouton "Tous" */}
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => onCategoryChange("all")}
              className={`${
                selectedCategory === "all" 
                  ? "bg-orange-600 hover:bg-orange-700 text-white" 
                  : "border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              Tous les articles
            </Button>
            
            {/* Boutons des catégories */}
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => onCategoryChange(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "text-white" 
                    : "border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600"
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined,
                  borderColor: selectedCategory === category.id ? category.color : undefined,
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Description de la catégorie sélectionnée */}
          {selectedCategory !== "all" && (
            <div className="text-center mt-6">
              {(() => {
                const category = categories.find(cat => cat.id === selectedCategory);
                return category ? (
                  <p className="text-gray-600 italic">
                    {category.description}
                  </p>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
