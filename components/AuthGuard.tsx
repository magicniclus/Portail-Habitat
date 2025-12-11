"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('🔐 AuthGuard - État authentification:', currentUser ? 'Connecté' : 'Non connecté');
      
      if (!currentUser) {
        // Utilisateur non connecté, rediriger vers la page de connexion
        console.log('❌ Utilisateur non connecté, redirection vers /connexion-pro');
        router.push('/connexion-pro');
        return;
      }

      // Utilisateur connecté
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, [router, pathname]);

  // Affichage du loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  // Utilisateur authentifié, afficher le contenu
  return <>{children}</>;
}
