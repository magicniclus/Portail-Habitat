"use client";
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuContent = isOpen ? (
    <div 
      className="fixed inset-0 bg-white overflow-y-auto"
      style={{ 
        position: 'fixed',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        backgroundColor: '#ffffff !important',
        zIndex: '999999',
        width: '100vw',
        height: '100vh',
        opacity: '1 !important'
      }}
    >
      {/* Header du menu mobile */}
      <div className="border-b px-4 py-4 flex items-center justify-between" style={{ backgroundColor: '#ffffff' }}>
        <Link href="/" className="relative" onClick={() => setIsOpen(false)}>
          <Image
            src="/logo.png"
            alt="Portail Habitat"
            width={200}
            height={80}
            className="h-16 w-auto"
          />
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2"
          aria-label="Fermer le menu"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      
      <div className="px-6 py-8 space-y-8 min-h-full" style={{ backgroundColor: '#ffffff' }}>
        <div className="space-y-8">
          <Link 
            href="/devenir-pro" 
            className="block text-center text-gray-600 hover:text-gray-900 py-2 transition-colors text-lg font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Devenir partenaire
          </Link>
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
            <Link href="/connexion-pro" onClick={() => setIsOpen(false)}>
              Mon Espace Pro
            </Link>
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Bouton hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-gray-200"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Menu rendu directement dans le body via Portal */}
      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  )
}
