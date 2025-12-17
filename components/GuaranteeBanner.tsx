"use client";

import { useEffect, useState } from "react";

export default function GuaranteeBanner() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Écouter les changements du menu mobile via l'overflow du body
    const checkMobileMenu = () => {
      setIsMobileMenuOpen(document.body.style.overflow === 'hidden');
    };

    // Observer les changements de style du body
    const observer = new MutationObserver(checkMobileMenu);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['style'] 
    });

    return () => observer.disconnect();
  }, []);

  // Masquer la banner si le menu mobile est ouvert
  if (isMobileMenuOpen) {
    return null;
  }

  return (
    <div className="bg-orange-600 text-white py-2 text-center text-sm font-medium sticky top-0 z-50">
      <div className="container mx-auto px-4 md:block hidden">
        <span>
         <strong>Des particuliers vous contactent gratuitement dans votre zone — sans engagement</strong>
        </span>
      </div>
      <div className="container mx-auto px-4 md:hidden block">
        <span>
         <strong>Des particuliers vous contactent gratuitement dans votre zone</strong>
        </span>
      </div>
    </div>
  );
}
