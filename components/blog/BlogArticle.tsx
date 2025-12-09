"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  User, 
  Calendar, 
  Target, 
  BookOpen, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowUp,
  ChevronRight
} from "lucide-react";
import blogData from "@/data/blog-articles.json";

interface BlogArticleProps {
  article: typeof blogData.articles[0];
}

export default function BlogArticle({ article }: BlogArticleProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
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

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction de partage
  const shareArticle = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Scroll vers le haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-orange-600">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-orange-600">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{article.title}</span>
          </nav>

          {/* En-tête de l'article */}
          <header className="mb-8">
            {/* Catégorie */}
            <div className="mb-4">
              <Badge 
                className="text-white font-medium"
                style={{ backgroundColor: getCategoryColor(article.category) }}
              >
                {getCategoryName(article.category)}
              </Badge>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Publié le {formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readingTime} min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{article.targetAudience}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Niveau {article.difficulty}</span>
              </div>
            </div>

            {/* Auteur */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-lg font-bold">
                  {article.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{article.author.name}</div>
                <div className="text-sm text-gray-600">{article.author.role}</div>
                <div className="text-sm text-gray-500 mt-1">{article.author.bio}</div>
              </div>
            </div>

            {/* Image principale */}
            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sommaire (sidebar) */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                    Sommaire
                  </h3>
                  <nav className="space-y-2">
                    {article.tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm hover:text-orange-600 transition-colors ${
                          item.level === 3 ? 'ml-4 text-gray-500' : 'text-gray-700'
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </Card>

                {/* Partage */}
                <Card className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-orange-600" />
                    Partager
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareArticle('facebook')}
                      className="flex-1"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareArticle('twitter')}
                      className="flex-1"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareArticle('linkedin')}
                      className="flex-1"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </aside>

            {/* Contenu principal */}
            <main className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                {/* Ici on afficherait le contenu markdown rendu */}
                <div className="text-gray-700 leading-relaxed space-y-6">
                  {/* Simulation du contenu de l'article */}
                  <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
                  
                  {/* Sections du sommaire */}
                  {article.tableOfContents.map((section) => (
                    <section key={section.id} id={section.id} className="scroll-mt-8">
                      {section.level === 2 && (
                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
                          {section.title}
                        </h2>
                      )}
                      {section.level === 3 && (
                        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                          {section.title}
                        </h3>
                      )}
                      <p className="text-gray-700 mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                      </p>
                    </section>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Tags :</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Card className="mt-12 p-8 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Besoin d'un professionnel pour vos travaux ?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Trouvez rapidement un artisan qualifié près de chez vous
                  </p>
                  <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/simulateur-devis">
                      Obtenir des devis gratuits
                    </Link>
                  </Button>
                </div>
              </Card>
            </main>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-orange-600 hover:bg-orange-700 shadow-lg z-50"
          size="sm"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </article>
  );
}
