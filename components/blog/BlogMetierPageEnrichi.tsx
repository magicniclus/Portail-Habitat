"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  Users, 
  TrendingUp, 
  MapPin, 
  CheckCircle, 
  ArrowRight,
  Target,
  Lightbulb,
  DollarSign,
  Clock,
  Star,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Eye,
  Calendar,
  Info,
  Briefcase
} from "lucide-react";
import metiersArticles from "@/data/metiers-articles-complets.json";

interface MetierData {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  stats: {
    chantiers: string;
    demande: string;
    prix: string;
  };
  keywords: string[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

interface BlogMetierPageProps {
  metier: MetierData;
}

export default function BlogMetierPageEnrichi({ metier }: BlogMetierPageProps) {
  const [expandedFaqItems, setExpandedFaqItems] = useState<number[]>([]);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  // Récupérer l'article complet correspondant au métier
  const articleComplet = metiersArticles.articles.find(article => article.metier === metier.slug);

  const toggleFaqItem = (index: number) => {
    setExpandedFaqItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Si pas d'article complet trouvé, utiliser des données par défaut
  if (!articleComplet) {
    console.log(`Article non trouvé pour le métier: ${metier.slug}`);
  }

  // Métiers suggérés basés sur les relations
  const getMetiersSuggeres = () => {
    const relatedSlugs = articleComplet?.relatedMetiers || [];
    const allMetiers = [
      { slug: "plomberie", name: "Plomberie", icon: "🔧", color: "#6B7280" },
      { slug: "electricite", name: "Électricité", icon: "⚡", color: "#6B7280" },
      { slug: "peinture", name: "Peinture", icon: "🎨", color: "#6B7280" },
      { slug: "maconnerie", name: "Maçonnerie", icon: "🧱", color: "#6B7280" },
      { slug: "menuiserie", name: "Menuiserie", icon: "🪚", color: "#6B7280" },
      { slug: "carrelage", name: "Carrelage", icon: "🏠", color: "#6B7280" },
      { slug: "chauffage", name: "Chauffage", icon: "🔥", color: "#6B7280" },
      { slug: "couverture", name: "Couverture", icon: "🏘️", color: "#6B7280" },
      { slug: "isolation", name: "Isolation", icon: "🏠", color: "#6B7280" }
    ];

    return allMetiers
      .filter(m => relatedSlugs.includes(m.slug) && m.slug !== metier.slug)
      .slice(0, 3);
  };

  const metiersSuggeres = getMetiersSuggeres();

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
            <Link href="/blog/metiers" className="hover:text-orange-600">Métiers</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{metier.name}</span>
          </nav>

          {/* Hero Section Enrichi */}
          <div className="mb-12">
            <div 
              className="rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
              style={{ backgroundColor: "#6B7280" }}
            >
              <div className="absolute top-0 right-0 text-8xl opacity-20 transform rotate-12">
                {metier.icon}
              </div>
              <div className="relative z-10 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-white/20 text-white">
                    GUIDE MÉTIER COMPLET
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    2500+ MOTS
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    EXPERT CERTIFIÉ
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Chantiers {metier.name} 2024
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-3xl">
                  {articleComplet?.excerpt || metier.description}
                </p>
                
                {/* Métadonnées enrichies */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Mis à jour en décembre 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Guide complet 2500+ mots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Pour artisans {metier.name.toLowerCase()}</span>
                  </div>
                </div>

                {/* Stats enrichies */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="font-semibold">Chantiers disponibles</span>
                    </div>
                    <div className="text-2xl font-bold">{metier.stats.chantiers}</div>
                    <div className="text-sm text-white/80">par mois en moyenne</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Demande</span>
                    </div>
                    <div className="text-2xl font-bold">{metier.stats.demande}</div>
                    <div className="text-sm text-white/80">sur le marché</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">Tarif moyen</span>
                    </div>
                    <div className="text-2xl font-bold">{metier.stats.prix}</div>
                    <div className="text-sm text-white/80">selon la région</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions et Sommaire */}
          {articleComplet && (
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowTableOfContents(!showTableOfContents)}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Sommaire de l'article
                  {showTableOfContents ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                </Button>
              </div>

              {/* Sommaire */}
              {showTableOfContents && articleComplet.tableOfContents && (
                <Card className="mt-4 border-orange-200">
                  <CardHeader className="pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                      Plan de l'article complet
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {articleComplet.tableOfContents.map((item, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded hover:bg-orange-50 transition-colors text-gray-700 ${
                            item.level === 3 ? 'ml-4 text-sm' : ''
                          }`}
                        >
                          {item.title}
                        </div>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Images de la galerie */}
          {articleComplet?.gallery && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Exemples de chantiers {metier.name.toLowerCase()}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {articleComplet.gallery.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                    <Image
                      src={image}
                      alt={`Chantier ${metier.name} ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encadré conseil principal */}
          <Card className="mb-12 border-l-4 border-orange-500 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Conseil d'expert pour {metier.name.toLowerCase()}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le marché du {metier.name.toLowerCase()} évolue rapidement en 2024. 
                    Pour réussir, spécialisez-vous dans les créneaux porteurs, 
                    développez votre présence digitale et misez sur la qualité de service. 
                    Ce guide complet vous donne toutes les clés pour développer votre activité.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conseils spécialisés */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Stratégies gagnantes pour {metier.name.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Spécialisez-vous dans le haut de gamme",
                  description: `Les clients recherchent la qualité en ${metier.name.toLowerCase()}. Formez-vous aux techniques premium.`,
                  icon: <Star className="w-5 h-5" />
                },
                {
                  title: "Développez votre présence en ligne",
                  description: "80% des clients cherchent sur Google. Un site web et des avis clients sont indispensables.",
                  icon: <TrendingUp className="w-5 h-5" />
                },
                {
                  title: "Proposez des devis détaillés",
                  description: "Un devis précis avec photos et explications rassure et justifie vos tarifs.",
                  icon: <CheckCircle className="w-5 h-5" />
                },
                {
                  title: "Répondez rapidement aux demandes",
                  description: "Les premiers à répondre décrochent 80% des chantiers. Réactivité = succès.",
                  icon: <Clock className="w-5 h-5" />
                },
                {
                  title: "Fidélisez vos clients",
                  description: "Un client satisfait en amène 3 autres. Soignez le SAV et demandez des recommandations.",
                  icon: <Users className="w-5 h-5" />
                },
                {
                  title: "Formez-vous continuellement",
                  description: "Les techniques évoluent. Restez à jour pour proposer les dernières innovations.",
                  icon: <Target className="w-5 h-5" />
                }
              ].map((conseil, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: "#6B728020", color: "#6B7280" }}
                    >
                      {conseil.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{conseil.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{conseil.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ enrichie */}
          {articleComplet?.faq && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-orange-600" />
                Questions fréquentes - {metier.name}
              </h2>
              <div className="space-y-4">
                {articleComplet.faq.map((faq, index) => (
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
          )}

          {/* Mots-clés */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Mots-clés populaires - {metier.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {metier.keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="outline" 
                  className="text-sm py-2 px-4 border-2"
                  style={{ borderColor: "#6B7280", color: "#6B7280" }}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Métiers suggérés */}
          {metiersSuggeres.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-orange-600" />
                Métiers complémentaires
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metiersSuggeres.map((metierSuggere) => (
                  <Card key={metierSuggere.slug} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-2xl"
                        style={{ backgroundColor: `${metierSuggere.color}20` }}
                      >
                        {metierSuggere.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Chantiers {metierSuggere.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Découvrez les opportunités en {metierSuggere.name.toLowerCase()} 
                        et les synergies avec votre activité actuelle.
                      </p>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full group-hover:shadow-md transition-all"
                        style={{ 
                          borderColor: metierSuggere.color,
                          color: metierSuggere.color
                        }}
                      >
                        <Link href={`/blog/metiers/${metierSuggere.slug}`}>
                          Découvrir {metierSuggere.name}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Rejoignez notre réseau
                </h3>
                <p className="text-gray-600 mb-6">
                  Accédez à des centaines de chantiers {metier.name.toLowerCase()} 
                  dans votre région. Inscription gratuite.
                </p>
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/devenir-pro">
                    Devenir partenaire
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Besoin d'aide ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nos experts vous accompagnent pour optimiser votre profil 
                  et décrocher plus de chantiers.
                </p>
                <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Link href="/contact">
                    Nous contacter
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Découvrez d'autres métiers
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/blog/metiers">
                  Tous les métiers
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/blog">
                  Retour au blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
