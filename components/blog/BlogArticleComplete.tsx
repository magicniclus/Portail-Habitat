"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  ChevronRight,
  List,
  Eye,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import blogData from "@/data/blog-articles.json";

interface BlogArticleProps {
  article: typeof blogData.articles[0];
}

export default function BlogArticleComplete({ article }: BlogArticleProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [expandedFaqItems, setExpandedFaqItems] = useState<number[]>([]);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      
      // Détection de la section active pour le sommaire
      const sections = document.querySelectorAll('h2[id], h3[id]');
      let current = "";
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.id;
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonctions utilitaires
  const getCategoryColor = (categoryId: string) => {
    const category = blogData.categories.find(cat => cat.id === categoryId);
    return category?.color || "#EA580C"; // Orange par défaut
  };

  const getCategoryName = (categoryId: string) => {
    const category = blogData.categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFaqItem = (index: number) => {
    setExpandedFaqItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // FAQ par défaut si pas définie dans l'article
  const defaultFaq = [
    {
      question: `Combien coûte ${article.title.toLowerCase()} ?`,
      answer: "Le coût varie selon plusieurs facteurs : la surface, les matériaux choisis, la complexité des travaux et votre région. Demandez plusieurs devis pour comparer les prix."
    },
    {
      question: "Combien de temps durent ces travaux ?",
      answer: "La durée dépend de l'ampleur du projet. Pour une estimation précise, consultez un professionnel qui évaluera votre situation spécifique."
    },
    {
      question: "Faut-il un permis pour ces travaux ?",
      answer: "Cela dépend de la nature et de l'ampleur des travaux. Renseignez-vous auprès de votre mairie pour connaître les démarches nécessaires."
    },
    {
      question: "Comment choisir le bon artisan ?",
      answer: "Vérifiez les assurances, demandez des références, comparez plusieurs devis et privilégiez les artisans certifiés RGE si éligible aux aides."
    }
  ];

  const faqItems = (article as any).faq || defaultFaq;

  return (
    <article className="py-8 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-orange-600">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-orange-600">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              href={`/blog/categorie/${article.category}`}
              className="hover:text-orange-600"
            >
              {getCategoryName(article.category)}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate">{article.title}</span>
          </nav>

          {/* En-tête de l'article */}
          <header className="mb-8">
            {/* Catégorie et badges */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge 
                className="text-white font-medium"
                style={{ backgroundColor: getCategoryColor(article.category) }}
              >
                {getCategoryName(article.category)}
              </Badge>
              {article.featured && (
                <Badge className="bg-yellow-500 text-yellow-900">
                  ⭐ Article vedette
                </Badge>
              )}
              <Badge variant="outline" className="border-green-200 text-green-700">
                {article.difficulty}
              </Badge>
            </div>

            {/* Titre */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
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
                <Eye className="w-4 h-4" />
                <span>2500+ mots</span>
              </div>
            </div>

            {/* Auteur */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{article.author.name}</div>
                <div className="text-sm text-gray-600">{article.author.role}</div>
                <div className="text-xs text-gray-500 mt-1">{article.author.bio}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Sommaire toggle */}
              <Button
                variant="outline"
                onClick={() => setShowTableOfContents(!showTableOfContents)}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <List className="w-4 h-4 mr-2" />
                Sommaire
                {showTableOfContents ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>

              {/* Partage */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Partager :</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareArticle('facebook')}
                  className="p-2"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareArticle('twitter')}
                  className="p-2"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareArticle('linkedin')}
                  className="p-2"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Sommaire */}
          {showTableOfContents && article.tableOfContents && (
            <Card className="mb-8 border-orange-200">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  Sommaire
                </h3>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {article.tableOfContents.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left p-2 rounded hover:bg-orange-50 transition-colors ${
                        activeSection === item.id ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                      } ${item.level === 3 ? 'ml-4 text-sm' : ''}`}
                    >
                      {item.title}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          )}

          {/* Image principale */}
          <div className="mb-8">
            <div className="relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Contenu principal */}
          <div className="prose prose-lg max-w-none mb-12">
            {/* Introduction avec encadré */}
            <Card className="mb-8 border-l-4 border-orange-500 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">À retenir</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Cet article vous guide pas à pas pour réussir votre projet. 
                      Suivez nos conseils d'experts pour éviter les erreurs courantes et optimiser votre budget.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contenu de l'article (simulé - en réalité viendrait de article.content) */}
            <div className="space-y-8">
              {article.tableOfContents?.map((section, index) => (
                <section key={index} id={section.id}>
                  {section.level === 2 ? (
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-200 pb-2">
                      {section.title}
                    </h2>
                  ) : (
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {section.title}
                    </h3>
                  )}
                  
                  {/* Contenu simulé pour chaque section */}
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    
                    {/* Encadré conseil tous les 2 sections */}
                    {index % 2 === 0 && (
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-green-900 mb-2">Conseil d'expert</h4>
                              <p className="text-green-800 text-sm">
                                N'hésitez pas à demander plusieurs devis pour comparer les prix et les prestations. 
                                Un bon artisan prendra le temps de vous expliquer sa méthode de travail.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Image illustrative tous les 3 sections */}
                    {index % 3 === 1 && article.gallery && article.gallery[0] && (
                      <div className="my-6">
                        <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                          <Image
                            src={article.gallery[0]}
                            alt={`Illustration ${section.title}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center italic">
                          Exemple de {section.title.toLowerCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-orange-600" />
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqItems.map((faq: any, index: number) => (
                <Card key={index} className="border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaqItem(index)}
                      className="w-full p-6 text-left flex items-center justify-between transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFaqItems.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaqItems.includes(index) && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <Card className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Besoin d'un professionnel pour votre projet ?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Trouvez rapidement des artisans qualifiés près de chez vous. 
                Comparez les devis et choisissez le meilleur rapport qualité-prix.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/simulateur-devis">
                    Obtenir des devis gratuits
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/blog">
                    Lire d'autres articles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mots-clés</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bouton scroll to top */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 p-0 bg-orange-600 hover:bg-orange-700 shadow-lg"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </article>
  );
}
