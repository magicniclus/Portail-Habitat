"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Gérer l'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup au démontage
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const metiers = [
    "Plomberie", "Électricité", "Peinture", "Maçonnerie", "Menuiserie",
    "Carrelage", "Chauffage", "Couverture", "Isolation", "Climatisation",
    "Serrurerie", "Vitrerie", "Terrassement", "Charpente", "Ravalement"
  ];

  const villes = [
    "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes",
    "Montpellier", "Strasbourg", "Bordeaux", "Lille", "Rennes",
    "Reims", "Saint-Étienne", "Toulon", "Le Havre"
  ];

  return (
    <>
      <header className="border-b bg-white relative z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative">
              <Image
                src="/logo.png"
                alt="Portail Habitat"
                width={200}
                height={80}
                className="h-16 w-auto md:h-20"
              />
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden xl:flex items-center space-x-6">
              {/* Métiers Dropdown */}
              {isMounted && (
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900">
                  Métiers
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[500px] p-4 bg-white rounded-lg shadow-lg">
                  <div className="flex gap-6">
                    {/* Contenu */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-4">Nos métiers</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {metiers.slice(0, 10).map((metier) => (
                          <Link 
                            key={metier}
                            href={`/blog/metiers/${metier.toLowerCase().replace(/é/g, 'e')}`} 
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm text-gray-700 hover:text-gray-900"
                          >
                            <span className="text-gray-400">→</span>
                            {metier}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Link 
                          href="/blog/metiers" 
                          className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                        >
                          Voir tous les métiers 
                          <span className="text-xs">→</span>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Illustration à droite */}
                    <div className="flex items-center justify-center flex-shrink-0">
                      <Image 
                        src="/illustrations/dropdowns/metiers.png" 
                        alt="Métiers" 
                        width={120} 
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              )}

              {/* Villes Dropdown */}
              {isMounted && (
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900">
                  Villes
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[500px] p-4 bg-white rounded-lg shadow-lg">
                  <div className="flex gap-6">
                    {/* Contenu */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-4">Nos villes</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {villes.slice(0, 10).map((ville) => (
                          <Link 
                            key={ville}
                            href={`/villes/${ville.toLowerCase().replace(/\s+/g, '-')}`} 
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm text-gray-700 hover:text-gray-900"
                          >
                            <span className="text-gray-400">→</span>
                            {ville}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Link 
                          href="/villes" 
                          className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                        >
                          Voir toutes les villes 
                          <span className="text-xs">→</span>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Illustration à droite */}
                    <div className="flex items-center justify-center flex-shrink-0">
                      <Image 
                        src="/illustrations/dropdowns/villes.png" 
                        alt="Villes" 
                        width={120} 
                        height={120}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              )}

              {/* Avis Pro */}
              <Link href="/avis" className="text-gray-600 hover:text-gray-900">
                Avis Pro
              </Link>

              {/* Artisans */}
              <Link href="/artisans" className="text-gray-600 hover:text-gray-900">
                Artisans
              </Link>

              {/* Blog */}
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>

              {/* Simuler mon devis */}
              <Button asChild variant="ghost" className="text-orange-600 hover:text-orange-700 font-semibold">
                <Link href="/simulateur-devis">SIMULER MON DEVIS</Link>
              </Button>
            </nav>

            {/* Boutons Desktop */}
            <div className="hidden xl:flex items-center space-x-6">
              <Link 
                href="/devenir-pro" 
                className="text-gray-600 hover:text-gray-900 hover:cursor-pointer transition-colors"
              >
                Devenir partenaire
              </Link>
              <Button asChild>
                <Link href="/connexion-pro">Mon Espace</Link>
              </Button>
            </div>

            {/* Menu Hamburger Mobile */}
            <button
              className="xl:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="xl:hidden bg-white fixed inset-0 top-0 z-50 overflow-y-auto">
              {/* Header du menu mobile */}
              <div className="border-b px-4 py-4 flex items-center justify-between">
                <Link href="/" className="relative" onClick={() => setIsMenuOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="Portail Habitat"
                    width={200}
                    height={80}
                    className="h-16 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2"
                  aria-label="Fermer le menu"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              
              <div className="px-6 py-8 space-y-8 min-h-full">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="font-semibold text-gray-900 text-lg">Métiers</div>
                    <div className="pl-4 space-y-4 grid grid-cols-2 gap-2">
                      {metiers.map((metier) => (
                        <Link 
                          key={metier}
                          href={`/blog/metiers/${metier.toLowerCase().replace(/é/g, 'e')}`}
                          className="block text-gray-600 hover:text-gray-900 py-1 text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {metier}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="font-semibold text-gray-900 text-lg">Villes</div>
                    <div className="pl-4 space-y-4 grid grid-cols-2 gap-2">
                      {villes.map((ville) => (
                        <Link 
                          key={ville}
                          href={`/villes/${ville.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block text-gray-600 hover:text-gray-900 py-1 text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {ville}
                        </Link>
                      ))}
                    </div>
                  </div>


                  <Link 
                    href="/avis" 
                    className="block text-gray-600 hover:text-gray-900 font-semibold text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Avis Pro
                  </Link>

                  <Link 
                    href="/artisans" 
                    className="block text-gray-600 hover:text-gray-900 font-semibold text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Artisans
                  </Link>

                  <Link 
                    href="/blog" 
                    className="block text-gray-600 hover:text-gray-900 font-semibold text-lg py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>

                  <Button asChild variant="ghost" className="w-full text-orange-600 hover:text-orange-700 font-semibold text-lg">
                    <Link href="/simulateur-devis" onClick={() => setIsMenuOpen(false)}>
                      SIMULER MON DEVIS
                    </Link>
                  </Button>
                </div>
                
                <div className="border-t pt-6 space-y-4">
                  <Link 
                    href="/devenir-pro" 
                    className="block text-center text-gray-600 hover:text-gray-900 py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Devenir partenaire
                  </Link>
                  <Button asChild className="w-full">
                    <Link href="/connexion-pro" onClick={() => setIsMenuOpen(false)}>
                      Mon Espace
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
