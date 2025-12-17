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
      <header className="border-b bg-white relative z-40">
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
              {/* Navigation simplifiée */}
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
          <div className="xl:hidden bg-white fixed inset-0 top-0 z-[60] overflow-y-auto">
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
                    {/* Navigation simplifiée */}
                  </div>
                  
                  <div className="pt-6 space-y-4">
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
