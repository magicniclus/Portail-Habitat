"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TipsSection() {
  const mainTip = {
    title: "Comment bien choisir son artisan pour sa rénovation",
    excerpt: "Découvrez nos conseils d'experts pour sélectionner le bon professionnel et éviter les pièges courants lors de vos travaux de rénovation.",
    image: "/photos/accueil/TipsSection/renovation.png",
    author: "Julia",
    readTime: "5 min",
    link: "/blog/choisir-artisan-renovation"
  };

  const sideTips = [
    {
      title: "Les 5 erreurs à éviter en plomberie",
      excerpt: "Évitez les problèmes courants qui peuvent coûter cher...",
      image: "/photos/accueil/TipsSection/erreur-plomberie.png",
      readTime: "3 min",
      link: "/blog/erreurs-plomberie"
    },
    {
      title: "Budget rénovation : comment bien l'estimer",
      excerpt: "Nos astuces pour prévoir le coût de vos travaux...",
      image: "/photos/accueil/TipsSection/budget-renovation.png",
      readTime: "4 min",
      link: "/blog/budget-renovation"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Titre aligné à gauche */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-left">
            Nos astuces
          </h2>
          <p className="text-gray-600 mt-2 text-left">
            Conseils d'experts pour réussir vos projets de rénovation
          </p>
        </div>

        {/* Layout : Grande photo à gauche + 2 photos à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Article principal - 2/3 de la largeur */}
          <div className="lg:col-span-2 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group h-full rounded-lg">
            <Link href={mainTip.link} className="block h-full">
              <div className="relative h-full min-h-[320px] lg:min-h-[400px]">
                <Image
                  src={mainTip.image}
                  alt={mainTip.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Contenu superposé */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{mainTip.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{mainTip.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-2 group-hover:text-orange-300 transition-colors">
                    {mainTip.title}
                  </h3>
                  <p className="text-gray-200 text-sm lg:text-base line-clamp-2">
                    {mainTip.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Articles secondaires - 1/3 de la largeur */}
          <div className="space-y-6">
            {sideTips.map((tip, index) => (
              <div key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group rounded-lg bg-white flex flex-col h-48">
                <Link href={tip.link} className="flex flex-col h-full">
                  <div className="relative flex-1">
                    <Image
                      src={tip.image}
                      alt={tip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  
                  <div className="p-4 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3" />
                      <span>{tip.readTime}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {tip.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {tip.excerpt}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section avec trait orange */}
        <div className="text-left mt-12 flex items-stretch gap-4">
          {/* Barre verticale orange */}
          <div className="w-1 bg-orange-600 rounded-full flex-shrink-0"></div>
          
          {/* Contenu */}
          <div className="flex-1">
            <p className="text-gray-600 mb-4">
              Découvrez plus de conseils d'experts
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/blog" className="flex items-center gap-2">
                Voir toutes nos astuces
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
