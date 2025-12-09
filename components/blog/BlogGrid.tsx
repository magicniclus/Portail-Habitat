"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight, Calendar } from "lucide-react";
import blogData from "@/data/blog-articles.json";

interface BlogGridProps {
  selectedCategory: string;
}

export default function BlogGrid({ selectedCategory }: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const { articles, categories } = blogData;

  // Réinitialiser la page quand la catégorie change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Filtrer les articles par catégorie
  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") {
      return articles;
    }
    return articles.filter(article => article.category === selectedCategory);
  }, [selectedCategory, articles]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour obtenir la couleur de la catégorie
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || "#6b7280";
  };

  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Articles en vedette */}
          {selectedCategory === "all" && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Articles en vedette</h2>
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
                      <div className="absolute top-4 left-4">
                        <Badge 
                          className="text-white font-medium"
                          style={{ backgroundColor: getCategoryColor(article.category) }}
                        >
                          {getCategoryName(article.category)}
                        </Badge>
                      </div>
                      {article.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-500 text-yellow-900">
                            ⭐ En vedette
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.publishedAt)}
                        </div>
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

          {/* Tous les articles */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory === "all" ? "Tous les articles" : `Articles - ${getCategoryName(selectedCategory)}`}
              </h2>
              <div className="text-sm text-gray-500">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Grille des articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedArticles.map((article) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-orange-600 hover:bg-orange-700" : ""}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
