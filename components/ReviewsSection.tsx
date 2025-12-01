"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi) return;
    
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [emblaApi]);

  const platforms = [
    {
      name: "Trustpilot",
      rating: 5.0,
      logo: "/logo/logo_trustpilot.png",
      color: "text-green-500"
    },
    {
      name: "Google",
      rating: 4.5,
      logo: "/logo/logo_google.jpeg",
      color: "text-blue-500"
    },
    {
      name: "Jobber",
      rating: 5.0,
      logo: "/logo/logo_sitejabber.png",
      color: "text-purple-500"
    }
  ];

  const testimonials = [
    {
      text: "Grâce à Portail Habitat, j'ai multiplié par 3 mes demandes de devis. La plateforme est simple et les leads sont vraiment qualifiés.",
      author: "Marc Dubois",
      job: "Plombier",
      location: "Lyon",
      rating: 5
    },
    {
      text: "Excellent service ! Je reçois régulièrement des demandes dans ma zone. Le système de notification fonctionne parfaitement.",
      author: "Sophie Martin",
      job: "Électricienne",
      location: "Paris",
      rating: 5
    },
    {
      text: "Interface très intuitive, leads de qualité. J'ai trouvé de nouveaux clients dès la première semaine.",
      author: "Pierre Durand",
      job: "Peintre",
      location: "Marseille",
      rating: 5
    },
    {
      text: "La garantie de leads fonctionne vraiment. Si je n'ai pas de demande, le mois suivant est gratuit. Très rassurant !",
      author: "Julie Moreau",
      job: "Maçonne",
      location: "Toulouse",
      rating: 5
    },
    {
      text: "Plateforme professionnelle, support réactif. Mes revenus ont augmenté de 40% depuis que j'utilise Portail Habitat.",
      author: "Antoine Leroy",
      job: "Menuisier",
      location: "Nantes",
      rating: 5
    },
    {
      text: "Simple d'utilisation, leads géolocalisés précisément. Je recommande à tous les artisans de ma région.",
      author: "Céline Blanc",
      job: "Carreleur",
      location: "Strasbourg",
      rating: 5
    },
    {
      text: "Très satisfait du service. Les clients sont sérieux et les projets correspondent à mes compétences.",
      author: "Fabien Roux",
      job: "Chauffagiste",
      location: "Bordeaux",
      rating: 5
    },
    {
      text: "Interface moderne, notifications en temps réel. J'ai pu développer mon activité rapidement.",
      author: "Nathalie Petit",
      job: "Couvreur",
      location: "Lille",
      rating: 5
    },
    {
      text: "Excellent retour sur investissement. Les leads sont qualifiés et dans ma zone d'intervention.",
      author: "Thomas Bernard",
      job: "Plombier",
      location: "Nice",
      rating: 5
    },
    {
      text: "Service client au top, plateforme fiable. Je recommande vivement à mes confrères artisans.",
      author: "Isabelle Garnier",
      job: "Peintre",
      location: "Rennes",
      rating: 5
    },
    {
      text: "Très bonne expérience, leads réguliers et de qualité. L'interface est claire et efficace.",
      author: "David Rousseau",
      job: "Électricien",
      location: "Montpellier",
      rating: 5
    },
    {
      text: "Plateforme intuitive, résultats rapides. J'ai doublé mon chiffre d'affaires en 6 mois.",
      author: "Marie Fournier",
      job: "Maçonne",
      location: "Dijon",
      rating: 5
    },
    {
      text: "Leads géolocalisés, clients sérieux. Le système de garantie est un vrai plus pour nous artisans.",
      author: "Julien Mercier",
      job: "Menuisier",
      location: "Clermont-Ferrand",
      rating: 5
    },
    {
      text: "Interface professionnelle, support technique réactif. Mes revenus ont considérablement augmenté.",
      author: "Sandrine Lefevre",
      job: "Carreleur",
      location: "Caen",
      rating: 5
    },
    {
      text: "Excellent service, leads qualifiés dans ma zone. Je recommande à tous les professionnels du bâtiment.",
      author: "Olivier Moreau",
      job: "Chauffagiste",
      location: "Tours",
      rating: 5
    },
    {
      text: "Plateforme fiable, résultats concrets. J'ai trouvé de nouveaux clients réguliers grâce à Portail Habitat.",
      author: "Valérie Simon",
      job: "Couvreur",
      location: "Angers",
      rating: 5
    },
    {
      text: "Service de qualité, leads pertinents. L'investissement est rapidement rentabilisé.",
      author: "Christophe Dubois",
      job: "Plombier",
      location: "Le Mans",
      rating: 5
    },
    {
      text: "Interface moderne, notifications efficaces. Mes demandes de devis ont triplé en quelques mois.",
      author: "Émilie Laurent",
      job: "Peintre",
      location: "Orléans",
      rating: 5
    },
    {
      text: "Très satisfait du service client et de la qualité des leads. Plateforme recommandée !",
      author: "Sébastien Girard",
      job: "Électricien",
      location: "Reims",
      rating: 5
    },
    {
      text: "Leads réguliers, clients sérieux, interface intuitive. Portail Habitat a boosté mon activité.",
      author: "Laetitia Bonnet",
      job: "Maçonne",
      location: "Limoges",
      rating: 5
    }
  ];

  const renderStars = (rating: number, color: string) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center space-x-1">
        {/* Étoiles pleines */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`h-5 w-5 ${color} fill-current`} />
        ))}
        
        {/* Étoile à moitié */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-5 w-5 text-gray-300 fill-current" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`h-5 w-5 ${color} fill-current`} />
            </div>
          </div>
        )}
        
        {/* Étoiles vides */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300 fill-current" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout principal : texte à gauche, cards à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Contenu gauche */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nos clients nous font confiance
            </h2>
            <div className="flex items-baseline space-x-3 mb-4">
              <span className="text-6xl font-bold text-gray-900">4,8</span>
              <span className="text-2xl text-gray-600">/5</span>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              Notre moyenne basée sur plus de <span className="font-bold">1 000 avis clients</span>
            </p>
            <p className="text-gray-600">
              Rejoignez des milliers d'artisans satisfaits qui développent leur activité 
              grâce à notre plateforme de mise en relation avec des particuliers.
            </p>
          </div>

          {/* Cards plateformes à droite */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4">
                  {/* Logo de la plateforme */}
                  <div className="w-20 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Image
                      src={platform.logo}
                      alt={`Logo ${platform.name}`}
                      width={80}
                      height={48}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex justify-center mb-2">
                    {renderStars(platform.rating, "text-yellow-400")}
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {platform.rating}
                    </span>
                    <span className="text-gray-600">/5</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {platform.name === "Trustpilot" && "850 avis"}
                  {platform.name === "Google" && "1 200 avis"}
                  {platform.name === "Jobber" && "450 avis"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slider d'avis clients */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Ce que disent nos artisans
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={scrollPrev}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={scrollNext}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                  <div className="bg-gray-50 rounded-2xl p-6 h-full">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="border-t pt-4">
                      <div className="font-semibold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.job} • {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
