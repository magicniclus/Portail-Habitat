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
  Info
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

export default function BlogMetierPage({ metier }: BlogMetierPageProps) {
  // Conseils spécifiques par métier
  const getConseilsSpecifiques = (metierSlug: string) => {
    const conseilsBase = [
      {
        title: "Optimisez votre profil professionnel",
        description: "Un profil complet avec photos de réalisations augmente vos chances de 300%",
        icon: <Star className="w-5 h-5" />
      },
      {
        title: "Répondez rapidement aux demandes",
        description: "Les premiers à répondre décrochent 80% des chantiers",
        icon: <Clock className="w-5 h-5" />
      },
      {
        title: "Proposez des devis détaillés",
        description: "Un devis précis et professionnel rassure vos clients",
        icon: <CheckCircle className="w-5 h-5" />
      }
    ];

    const conseilsSpecifiques = {
      plomberie: [
        {
          title: "Spécialisez-vous dans l'urgence",
          description: "Les dépannages urgents sont 40% mieux rémunérés",
          icon: <Target className="w-5 h-5" />
        },
        {
          title: "Proposez des contrats d'entretien",
          description: "Fidélisez vos clients avec des contrats annuels",
          icon: <DollarSign className="w-5 h-5" />
        }
      ],
      electricite: [
        {
          title: "Mettez en avant vos certifications",
          description: "Qualibat, RGE... Les labels rassurent et valorisent",
          icon: <Target className="w-5 h-5" />
        },
        {
          title: "Spécialisez-vous dans le smart home",
          description: "La domotique est un marché en forte croissance",
          icon: <Lightbulb className="w-5 h-5" />
        }
      ],
      peinture: [
        {
          title: "Montrez vos réalisations avant/après",
          description: "Les photos de transformation séduisent les clients",
          icon: <Target className="w-5 h-5" />
        },
        {
          title: "Proposez des finitions haut de gamme",
          description: "Enduits décoratifs, peintures écologiques...",
          icon: <Star className="w-5 h-5" />
        }
      ]
    };

    return [...conseilsBase, ...(conseilsSpecifiques[metierSlug as keyof typeof conseilsSpecifiques] || [])];
  };

  const conseils = getConseilsSpecifiques(metier.slug);

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

          {/* Hero Section */}
          <div className="mb-12">
            <div 
              className="rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
              style={{ backgroundColor: metier.color }}
            >
              <div className="absolute top-0 right-0 text-8xl opacity-20 transform rotate-12">
                {metier.icon}
              </div>
              <div className="relative z-10 max-w-4xl">
                <Badge className="bg-white/20 text-white mb-4">
                  GUIDE MÉTIER
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Chantiers {metier.name}
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-3xl">
                  {metier.description}. Découvrez nos stratégies éprouvées pour développer 
                  votre activité et trouver plus de clients dans votre région.
                </p>
                
                {/* Stats */}
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

          {/* Conseils Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Comment trouver plus de chantiers en {metier.name.toLowerCase()} ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conseils.map((conseil, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${metier.color}20`, color: metier.color }}
                    >
                      {conseil.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{conseil.title}</h3>
                    <p className="text-gray-600 text-sm">{conseil.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mots-clés Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Mots-clés populaires pour {metier.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {metier.keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="outline" 
                  className="text-sm py-2 px-4 border-2"
                  style={{ borderColor: metier.color, color: metier.color }}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Rejoindre le réseau */}
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

            {/* Contact */}
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

          {/* Navigation vers autres métiers */}
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
