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

interface HeaderProProps {
  isDashboard?: boolean;
}

export default function HeaderPro({ isDashboard = false }: HeaderProProps) {
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

  return (
    <>
      <header className="border-b bg-white relative z-50">
        <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={isDashboard ? "/dashboard" : "/devenir-pro"} className="relative">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Portail Habitat"
                width={200}
                height={80}
                className="h-16 w-auto md:h-20"
              />
              <span className="absolute bottom-2 -right-4 text-xl font-semibold text-gray-500 md:bottom-3 md:-right-5 md:text-2xl">
                Pro
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          {isDashboard ? (
            <nav className="hidden xl:flex items-center space-x-6">
              <Link href="/dashboard/leads" className="text-gray-600 hover:text-gray-900">
                Leads
              </Link>
              <Link href="/dashboard/devis" className="text-gray-600 hover:text-gray-900">
                Devis
              </Link>
              <Link href="/dashboard/chantiers" className="text-gray-600 hover:text-gray-900">
                Chantiers
              </Link>
            </nav>
          ) : (
            <nav className="hidden xl:flex items-center space-x-6">
              {/* Fonctionnalités Dropdown */}
              {isMounted && (
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900">
                  Fonctionnalités
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/fonctionnalites/gestion-leads">Gestion des leads</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/fonctionnalites/devis">Création de devis</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/fonctionnalites/planning">Planning chantiers</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/fonctionnalites/facturation">Facturation</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}

              {/* Métiers Dropdown */}
              {isMounted && (
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900">
                  Métiers
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/blog/metiers/plomberie">Plomberie</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/blog/metiers/electricite">Électricité</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/blog/metiers/peinture">Peinture</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/blog/metiers/maconnerie">Maçonnerie</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/blog/metiers/menuiserie">Menuiserie</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}

              {/* Ressources Dropdown */}
              {isMounted && (
                <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-900">
                  Ressources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/ressources/guides">Guides pratiques</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/ressources/blog">Blog</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/ressources/webinaires">Webinaires</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/ressources/support">Support</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}

              {/* Lien FAQ */}
              <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                FAQ
              </Link>
            </nav>
          )}

          {/* Boutons Desktop */}
          <div className="hidden xl:flex items-center space-x-6">
            {isDashboard ? (
              <>
                <span className="text-gray-700 hidden lg:block">Professionnel</span>
                <Button variant="outline" size="sm">
                  Profil
                </Button>
                <Button variant="destructive" size="sm">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/" className="text-gray-600 hover:text-gray-900 hidden lg:block">
                  Vous êtes un particulier ?
                </Link>
                <Button asChild>
                  <Link href="/connexion-pro">Se connecter</Link>
                </Button>
              </>
            )}
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
              <Link href={isDashboard ? "/dashboard" : "/devenir-pro"} className="relative" onClick={() => setIsMenuOpen(false)}>
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Portail Habitat"
                    width={200}
                    height={80}
                    className="h-16 w-auto"
                  />
                  <span className="absolute bottom-2 -right-4 text-xl font-semibold text-gray-500">
                    Pro
                  </span>
                </div>
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
              {isDashboard ? (
                <>
                  <div className="space-y-6">
                    <Link 
                      href="/dashboard/leads" 
                      className="block text-gray-600 hover:text-gray-900 font-medium text-lg py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Leads
                    </Link>
                    <Link 
                      href="/dashboard/devis" 
                      className="block text-gray-600 hover:text-gray-900 font-medium text-lg py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Devis
                    </Link>
                    <Link 
                      href="/dashboard/chantiers" 
                      className="block text-gray-600 hover:text-gray-900 font-medium text-lg py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Chantiers
                    </Link>
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      Profil
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      Déconnexion
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="font-semibold text-gray-900 text-lg">Fonctionnalités</div>
                      <div className="pl-4 space-y-4">
                        <Link 
                          href="/fonctionnalites/gestion-leads" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Gestion des leads
                        </Link>
                        <Link 
                          href="/fonctionnalites/devis" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Création de devis
                        </Link>
                        <Link 
                          href="/fonctionnalites/planning" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Planning chantiers
                        </Link>
                        <Link 
                          href="/fonctionnalites/facturation" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Facturation
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="font-semibold text-gray-900 text-lg">Métiers</div>
                      <div className="pl-4 space-y-4">
                        <Link 
                          href="/blog/metiers/plomberie" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Plomberie
                        </Link>
                        <Link 
                          href="/blog/metiers/electricite" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Électricité
                        </Link>
                        <Link 
                          href="/blog/metiers/peinture" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Peinture
                        </Link>
                        <Link 
                          href="/blog/metiers/maconnerie" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Maçonnerie
                        </Link>
                        <Link 
                          href="/blog/metiers/menuiserie" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Menuiserie
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="font-semibold text-gray-900 text-lg">Ressources</div>
                      <div className="pl-4 space-y-4">
                        <Link 
                          href="/ressources/guides" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Guides pratiques
                        </Link>
                        <Link 
                          href="/ressources/blog" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Blog
                        </Link>
                        <Link 
                          href="/ressources/webinaires" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Webinaires
                        </Link>
                        <Link 
                          href="/ressources/support" 
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Support
                        </Link>
                      </div>
                    </div>

                    <Link 
                      href="/faq" 
                      className="block text-gray-600 hover:text-gray-900 font-semibold text-lg py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <Link 
                      href="/" 
                      className="block text-center text-gray-600 hover:text-gray-900 py-5"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Vous êtes un particulier ?
                    </Link>
                    <Button asChild className="w-full">
                      <Link href="/connexion-pro" onClick={() => setIsMenuOpen(false)}>
                        Se connecter
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        </div>
      </header>
    </>
  );
}
