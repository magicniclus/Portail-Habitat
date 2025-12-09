import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight, ChevronRight } from "lucide-react";
import blogData from "@/data/blog-articles.json";

interface BlogCategoryPageProps {
  category: typeof blogData.categories[0];
  articles: typeof blogData.articles;
}

export default function BlogCategoryPage({ category, articles }: BlogCategoryPageProps) {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-orange-600">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-orange-600">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{category.name}</span>
          </nav>

          {/* En-tête de la catégorie */}
          <header className="text-center mb-12">
            <Badge 
              className="text-white font-medium mb-4"
              style={{ backgroundColor: category.color }}
            >
              {category.name.toUpperCase()}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {category.name}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {category.description}
            </p>
            <div className="text-sm text-gray-500">
              {articles.length} article{articles.length > 1 ? 's' : ''} dans cette catégorie
            </div>
          </header>

          {/* Articles */}
          {articles.length > 0 ? (
            <>
              {/* Articles en vedette de la catégorie */}
              {articles.filter(article => article.featured).length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Articles en vedette</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {articles.filter(article => article.featured).slice(0, 2).map((article) => (
                      <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
                        <div className="relative h-64">
                          <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-yellow-500 text-yellow-900">
                              ⭐ En vedette
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {article.readingTime} min
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {article.targetAudience}
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 text-sm font-bold">
                                  {article.author.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {article.author.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {article.author.role}
                                </div>
                              </div>
                            </div>
                            <Button asChild variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                              <Link href={`/blog/${article.slug}`}>
                                Lire l'article
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Tous les articles de la catégorie */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Tous les articles {category.name}
                </h2>
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
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun article dans cette catégorie
              </h3>
              <p className="text-gray-600 mb-6">
                Les articles de cette catégorie arrivent bientôt !
              </p>
              <Button asChild variant="outline">
                <Link href="/blog">
                  Retour au blog
                </Link>
              </Button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center">
            <Card className="p-8 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Besoin d'aide pour vos travaux ?
              </h3>
              <p className="text-gray-600 mb-6">
                Trouvez rapidement des professionnels qualifiés près de chez vous
              </p>
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/simulateur-devis">
                  Obtenir des devis gratuits
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
