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
  Briefcase,
  Building,
  Home,
  Wrench
} from "lucide-react";
import villesArticles from "@/data/villes-articles-complets.json";

interface VilleData {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  population: string;
  codePostal: string;
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

interface VillePageProps {
  ville: VilleData;
}

export default function VillePageEnrichi({ ville }: VillePageProps) {
  const [expandedFaqItems, setExpandedFaqItems] = useState<number[]>([]);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  // Récupérer l'article complet correspondant à la ville
  const articleComplet = villesArticles.articles.find(article => article.ville === ville.slug);

  const toggleFaqItem = (index: number) => {
    setExpandedFaqItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Couleur simple et uniforme
  const regionColor = "#6B7280"; // Gris simple

  // Villes suggérées de la même région
  const getVillesSugerees = () => {
    const autresVilles = [
      { slug: "paris", name: "Paris", region: "Île-de-France" },
      { slug: "lyon", name: "Lyon", region: "Auvergne-Rhône-Alpes" },
      { slug: "marseille", name: "Marseille", region: "Provence-Alpes-Côte d'Azur" },
      { slug: "toulouse", name: "Toulouse", region: "Occitanie" },
      { slug: "nice", name: "Nice", region: "Provence-Alpes-Côte d'Azur" },
      { slug: "nantes", name: "Nantes", region: "Pays de la Loire" }
    ];

    return autresVilles
      .filter(v => v.region === ville.region && v.slug !== ville.slug)
      .slice(0, 3);
  };

  const villesSugerees = getVillesSugerees();

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-orange-600">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/villes" className="hover:text-orange-600">Villes</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{ville.name}</span>
          </nav>

          {/* Hero Section Enrichi */}
          <div className="mb-12">
            <div 
              className="rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
              style={{ backgroundColor: regionColor }}
            >
              <div className="absolute top-0 right-0 text-8xl opacity-20 transform rotate-12">
                🏙️
              </div>
              <div className="relative z-10 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-white/20 text-white">
                    GUIDE VILLE COMPLET
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    2500+ MOTS
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    {ville.region.toUpperCase()}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Chantiers {ville.name} 2024
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-3xl">
                  {articleComplet?.excerpt || ville.description}
                </p>
                
                {/* Métadonnées enrichies */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{ville.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{ville.population} habitants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Guide complet 2500+ mots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Mis à jour décembre 2024</span>
                  </div>
                </div>

                {/* Stats enrichies */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5" />
                      <span className="font-semibold">Chantiers disponibles</span>
                    </div>
                    <div className="text-2xl font-bold">{ville.stats.chantiers}</div>
                    <div className="text-sm text-white/80">par an en moyenne</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">Demande</span>
                    </div>
                    <div className="text-2xl font-bold">{ville.stats.demande}</div>
                    <div className="text-sm text-white/80">sur le marché local</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">Niveau de prix</span>
                    </div>
                    <div className="text-2xl font-bold">{ville.stats.prix}</div>
                    <div className="text-sm text-white/80">comparé à la moyenne</div>
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
                Exemples de chantiers à {ville.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {articleComplet.gallery.map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden group">
                    <Image
                      src={image}
                      alt={`Chantier ${ville.name} ${index + 1}`}
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
                    Conseil d'expert pour {ville.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le marché de {ville.name} offre des opportunités uniques en 2024. 
                    Adaptez votre stratégie aux spécificités locales, développez un réseau de proximité 
                    et misez sur les segments porteurs de la région {ville.region}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conseils spécialisés pour la ville */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Stratégies gagnantes à {ville.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Connaissez le marché local",
                  description: `Étudiez les spécificités de ${ville.name} : quartiers porteurs, projets urbains, réglementation locale.`,
                  icon: <Target className="w-5 h-5" />
                },
                {
                  title: "Développez votre réseau local",
                  description: "Participez aux événements professionnels, rejoignez les associations d'artisans locales.",
                  icon: <Users className="w-5 h-5" />
                },
                {
                  title: "Adaptez vos tarifs au marché",
                  description: `Ajustez vos prix selon le niveau de vie de ${ville.name} et la concurrence locale.`,
                  icon: <DollarSign className="w-5 h-5" />
                },
                {
                  title: "Maîtrisez la réglementation",
                  description: "Respectez les normes locales, PLU, contraintes architecturales spécifiques à la ville.",
                  icon: <CheckCircle className="w-5 h-5" />
                },
                {
                  title: "Optimisez votre zone d'intervention",
                  description: "Définissez un périmètre rentable, gérez les déplacements et frais de transport.",
                  icon: <MapPin className="w-5 h-5" />
                },
                {
                  title: "Spécialisez-vous intelligemment",
                  description: "Identifiez les créneaux porteurs selon les caractéristiques du parc immobilier local.",
                  icon: <Star className="w-5 h-5" />
                }
              ].map((conseil, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${regionColor}20`, color: regionColor }}
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
                Questions fréquentes - {ville.name}
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
              Mots-clés populaires - {ville.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {ville.keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="outline" 
                  className="text-sm py-2 px-4 border-2"
                  style={{ borderColor: regionColor, color: regionColor }}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* Villes suggérées de la région */}
          {villesSugerees.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-orange-600" />
                Autres villes en {ville.region}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {villesSugerees.map((villeSugeree) => (
                  <Card key={villeSugeree.slug} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-2xl"
                        style={{ backgroundColor: `${regionColor}20` }}
                      >
                        🏙️
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Chantiers {villeSugeree.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Découvrez les opportunités à {villeSugeree.name} 
                        et les spécificités du marché local.
                      </p>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full group-hover:shadow-md transition-all"
                        style={{ 
                          borderColor: regionColor,
                          color: regionColor
                        }}
                      >
                        <Link href={`/villes/${villeSugeree.slug}`}>
                          Découvrir {villeSugeree.name}
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
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Trouvez des chantiers à {ville.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  Accédez à des centaines de chantiers dans votre ville. 
                  Inscription gratuite pour les artisans qualifiés.
                </p>
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/devenir-pro">
                    Rejoindre le réseau
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
                  Besoin d'accompagnement ?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nos experts locaux vous conseillent pour optimiser 
                  votre développement à {ville.name}.
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

          {/* Navigation Précédent/Suivant */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {(() => {
                const toutesVilles = [
                  { slug: "paris", name: "Paris" },
                  { slug: "lyon", name: "Lyon" },
                  { slug: "marseille", name: "Marseille" },
                  { slug: "toulouse", name: "Toulouse" },
                  { slug: "nice", name: "Nice" },
                  { slug: "nantes", name: "Nantes" },
                  { slug: "montpellier", name: "Montpellier" },
                  { slug: "strasbourg", name: "Strasbourg" },
                  { slug: "bordeaux", name: "Bordeaux" },
                  { slug: "lille", name: "Lille" }
                ];
                
                const currentIndex = toutesVilles.findIndex(v => v.slug === ville.slug);
                const prevVille = currentIndex > 0 ? toutesVilles[currentIndex - 1] : null;
                const nextVille = currentIndex < toutesVilles.length - 1 ? toutesVilles[currentIndex + 1] : null;
                
                return (
                  <>
                    <div className="flex-1">
                      {prevVille && (
                        <Button asChild variant="ghost" className="group">
                          <Link href={`/villes/${prevVille.slug}`} className="flex items-center">
                            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            <div className="text-left">
                              <div className="text-xs text-gray-500">Précédent</div>
                              <div className="font-medium">{prevVille.name}</div>
                            </div>
                          </Link>
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex-1 text-right">
                      {nextVille && (
                        <Button asChild variant="ghost" className="group">
                          <Link href={`/villes/${nextVille.slug}`} className="flex items-center justify-end">
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Suivant</div>
                              <div className="font-medium">{nextVille.name}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Navigation entre villes */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Découvrez d'autres villes
            </h3>
            
            {/* Grille des autres villes */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { slug: "paris", name: "Paris", region: "Île-de-France" },
                { slug: "lyon", name: "Lyon", region: "Rhône-Alpes" },
                { slug: "marseille", name: "Marseille", region: "PACA" },
                { slug: "toulouse", name: "Toulouse", region: "Occitanie" },
                { slug: "nice", name: "Nice", region: "Côte d'Azur" },
                { slug: "nantes", name: "Nantes", region: "Pays de Loire" },
                { slug: "montpellier", name: "Montpellier", region: "Hérault" },
                { slug: "strasbourg", name: "Strasbourg", region: "Grand Est" },
                { slug: "bordeaux", name: "Bordeaux", region: "Gironde" },
                { slug: "lille", name: "Lille", region: "Nord" }
              ]
                .filter(v => v.slug !== ville.slug) // Exclure la ville actuelle
                .slice(0, 10) // Limiter à 10 villes
                .map((autreVille) => (
                <Card key={autreVille.slug} className="group hover:shadow-lg transition-all duration-300 border-gray-200">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {autreVille.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">
                      {autreVille.region}
                    </p>
                    <Button 
                      asChild 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs group-hover:bg-gray-50"
                    >
                      <Link href={`/villes/${autreVille.slug}`}>
                        En savoir plus
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Liens de navigation principaux */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="outline" className="border-gray-300">
                  <Link href="/villes">
                    <MapPin className="w-4 h-4 mr-2" />
                    Toutes les villes
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300">
                  <Link href="/blog/metiers">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Guides métiers
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-300">
                  <Link href="/blog">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Retour au blog
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
