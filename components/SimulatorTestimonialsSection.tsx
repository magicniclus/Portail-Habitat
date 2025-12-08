"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function SimulatorTestimonialsSection() {
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
      text: "Le simulateur m'a donné une estimation très précise pour ma rénovation de cuisine. J'ai pu comparer avec les devis reçus, c'était exactement dans la fourchette annoncée !",
      author: "Sarah Benali",
      project: "Rénovation cuisine",
      location: "Lyon",
      rating: 5
    },
    {
      text: "Impressionnant ! En 5 minutes j'avais une estimation détaillée pour mes travaux de salle de bain. Les artisans contactés ont confirmé les prix.",
      author: "Mohamed Diallo",
      project: "Rénovation salle de bain",
      location: "Paris",
      rating: 5
    },
    {
      text: "Très pratique pour budgétiser mes travaux. L'estimation était réaliste et m'a aidé à négocier avec les entreprises. Je recommande !",
      author: "Marie Dubois",
      project: "Isolation combles",
      location: "Marseille",
      rating: 5
    },
    {
      text: "Le simulateur m'a évité de mauvaises surprises. L'estimation correspondait parfaitement au devis final de l'artisan choisi.",
      author: "Karim El Mansouri",
      project: "Installation chauffage",
      location: "Toulouse",
      rating: 5
    },
    {
      text: "Interface simple et résultat fiable. J'ai pu anticiper le budget de ma rénovation complète grâce à cet outil.",
      author: "Jennifer O'Connor",
      project: "Rénovation complète",
      location: "Nantes",
      rating: 5
    },
    {
      text: "Excellent outil ! L'estimation était précise à 200€ près sur un projet de 15 000€. Très utile pour planifier ses travaux.",
      author: "David Chen",
      project: "Pose parquet",
      location: "Strasbourg",
      rating: 5
    },
    {
      text: "Le simulateur m'a donné confiance pour me lancer dans mes travaux. L'estimation était juste et les artisans proposés compétents.",
      author: "Fatima Bouchard",
      project: "Peinture intérieure",
      location: "Bordeaux",
      rating: 5
    },
    {
      text: "Très bien fait ! J'ai pu comparer plusieurs scénarios pour ma rénovation. L'outil m'a fait gagner beaucoup de temps.",
      author: "Alessandro Rossi",
      project: "Rénovation électrique",
      location: "Lille",
      rating: 5
    },
    {
      text: "Estimation précise et rapide. Cela m'a permis de mieux négocier avec les artisans en connaissant les prix du marché.",
      author: "Priya Sharma",
      project: "Carrelage sol",
      location: "Nice",
      rating: 5
    },
    {
      text: "Super outil pour anticiper le budget ! L'estimation était très proche de la réalité. Interface claire et intuitive.",
      author: "Jean-Baptiste Martin",
      project: "Ravalement façade",
      location: "Rennes",
      rating: 5
    },
    {
      text: "Le simulateur m'a rassurée sur les prix pratiqués. L'estimation correspondait aux devis reçus. Très fiable !",
      author: "Aisha Kone",
      project: "Pose cuisine",
      location: "Montpellier",
      rating: 5
    },
    {
      text: "Excellent pour budgétiser ses projets ! L'estimation était dans la fourchette des devis. Outil très utile.",
      author: "Thomas Müller",
      project: "Isolation façade",
      location: "Dijon",
      rating: 5
    },
    {
      text: "Très pratique et fiable. J'ai pu planifier mes travaux sereinement grâce à l'estimation précise du simulateur.",
      author: "Camille Nguyen",
      project: "Aménagement combles",
      location: "Clermont-Ferrand",
      rating: 5
    },
    {
      text: "Le simulateur m'a donné une base solide pour négocier. L'estimation était juste et m'a évité les arnaques.",
      author: "Omar Benali",
      project: "Plomberie complète",
      location: "Caen",
      rating: 5
    },
    {
      text: "Interface moderne et résultats fiables. L'estimation m'a permis de valider mon budget travaux. Parfait !",
      author: "Elena Popovic",
      project: "Rénovation toiture",
      location: "Tours",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Slider d'avis clients */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Ce que disent nos utilisateurs
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
                  <div className="bg-gray-50 rounded-2xl p-6 h-full shadow-sm border border-gray-100">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="font-semibold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.project} • {testimonial.location}
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
