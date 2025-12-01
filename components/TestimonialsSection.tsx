"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function TestimonialsSection() {
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <div className="bg-white rounded-2xl p-6 h-full shadow-sm">
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
