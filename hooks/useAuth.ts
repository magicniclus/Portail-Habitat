import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface ArtisanData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  profession: string;
  professions: string[];
  city: string;
  subscriptionStatus: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface UseAuthReturn {
  user: User | null;
  artisan: ArtisanData | null;
  isLoading: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [artisan, setArtisan] = useState<ArtisanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Chercher l'artisan correspondant à cet utilisateur
          const artisanDoc = await getDoc(doc(db, "artisans", firebaseUser.uid));
          
          if (artisanDoc.exists()) {
            const artisanData = artisanDoc.data();
            setArtisan({
              id: artisanDoc.id,
              firstName: artisanData.firstName || '',
              lastName: artisanData.lastName || '',
              email: artisanData.email || firebaseUser.email || '',
              companyName: artisanData.companyName || '',
              profession: artisanData.profession || '',
              professions: artisanData.professions || [],
              city: artisanData.city || '',
              subscriptionStatus: artisanData.subscriptionStatus || 'inactive',
              coordinates: artisanData.coordinates || undefined
            });
          } else {
            setArtisan(null);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données artisan:", error);
          setArtisan(null);
        }
      } else {
        setArtisan(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, artisan, isLoading };
}
