import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight } from "lucide-react";
import blogData from "@/data/blog-articles.json";

interface RelatedArticlesProps {
  articles: typeof blogData.articles;
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (categoryId: string) => {
    const category = blogData.categories.find(cat => cat.id === categoryId);
    return category?.color || "#6b7280";
  };

  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (categoryId: string) => {
    const category = blogData.categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Titre de la section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Articles complémentaires
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez d'autres conseils et guides qui pourraient vous intéresser
            </p>
          </div>

          {/* Grille des articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-md">
                <div className="relative h-48">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge 
                      className="text-white font-medium text-xs"
                      style={{ backgroundColor: getCategoryColor(article.category) }}
                    >
                      {getCategoryName(article.category)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readingTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.targetAudience}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Par {article.author.name}
                    </div>
                    <Button asChild size="sm" variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-0">
                      <Link href={`/blog/${article.slug}`}>
                        Lire →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA vers le blog */}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-orange-200 text-orange-600 hover:bg-orange-50">
              <Link href="/blog">
                Voir tous les articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
