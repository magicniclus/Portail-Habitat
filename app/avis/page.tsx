"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Star, MapPin, Briefcase, Loader2 } from "lucide-react";
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Artisan {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  profession: string;
  city: string;
  phone?: string;
  logoUrl?: string;
}

export default function AvisPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Artisan[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const normalizeText = (text: string) => {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const artisansRef = collection(db, 'artisans');
      const results: Artisan[] = [];
      const seenIds = new Set<string>();

      const normalizedQuery = normalizeText(searchTerm);
      const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

      // IMPORTANT: Firestore ne peut pas faire de recherche prefixe multi-mots sur un seul champ.
      // Donc on interroge Firestore mot-par-mot (julia + castera) pour constituer un pool,
      // puis on filtre côté client pour vérifier que TOUS les mots matchent.
      const rawTerms = searchTerm.trim().split(/\s+/).filter(Boolean);

      // Fonction pour ajouter un résultat unique
      const addResult = (doc: any) => {
        if (!seenIds.has(doc.id)) {
          const data = doc.data();
          results.push({
            id: doc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            companyName: data.companyName || '',
            profession: data.profession || '',
            city: data.city || '',
            phone: data.phone || '',
            logoUrl: data.logoUrl
          });
          seenIds.add(doc.id);
        }
      };

      for (const term of rawTerms) {
        const termLower = term.toLowerCase();
        const termCapitalized = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
        const termVariants = [term, termLower, termCapitalized];

        for (const variant of termVariants) {
          // 1. Recherche par nom de famille
          try {
            const lastNameQuery = query(
              artisansRef,
              where('lastName', '>=', variant),
              where('lastName', '<=', variant + '\uf8ff'),
              limit(10)
            );
            const lastNameSnapshot = await getDocs(lastNameQuery);
            lastNameSnapshot.forEach(addResult);
          } catch (e) {
            console.log(`Recherche lastName avec "${variant}" échouée:`, e);
          }

          // 2. Recherche par prénom
          try {
            const firstNameQuery = query(
              artisansRef,
              where('firstName', '>=', variant),
              where('firstName', '<=', variant + '\uf8ff'),
              limit(10)
            );
            const firstNameSnapshot = await getDocs(firstNameQuery);
            firstNameSnapshot.forEach(addResult);
          } catch (e) {
            console.log(`Recherche firstName avec "${variant}" échouée:`, e);
          }

          // 3. Recherche par nom d'entreprise
          try {
            const companyQuery = query(
              artisansRef,
              where('companyName', '>=', variant),
              where('companyName', '<=', variant + '\uf8ff'),
              limit(10)
            );
            const companySnapshot = await getDocs(companyQuery);
            companySnapshot.forEach(addResult);
          } catch (e) {
            console.log(`Recherche companyName avec "${variant}" échouée:`, e);
          }

          // 4. Recherche par ville
          try {
            const cityQuery = query(
              artisansRef,
              where('city', '>=', variant),
              where('city', '<=', variant + '\uf8ff'),
              limit(10)
            );
            const citySnapshot = await getDocs(cityQuery);
            citySnapshot.forEach(addResult);
          } catch (e) {
            console.log(`Recherche city avec "${variant}" échouée:`, e);
          }

          // 5. Recherche par profession
          try {
            const professionQuery = query(
              artisansRef,
              where('profession', '>=', variant),
              where('profession', '<=', variant + '\uf8ff'),
              limit(10)
            );
            const professionSnapshot = await getDocs(professionQuery);
            professionSnapshot.forEach(addResult);
          } catch (e) {
            console.log(`Recherche profession avec "${variant}" échouée:`, e);
          }
        }
      }

      // Recherche téléphone uniquement si la requête est mono-terme
      if (rawTerms.length === 1) {
        const term = rawTerms[0];
        try {
          const phoneQuery = query(
            artisansRef,
            where('phone', '>=', term),
            where('phone', '<=', term + '\uf8ff'),
            limit(5)
          );
          const phoneSnapshot = await getDocs(phoneQuery);
          phoneSnapshot.forEach(addResult);
        } catch (e) {
          console.log(`Recherche phone avec "${rawTerms[0]}" échouée:`, e);
        }
      }

      // Filtre multi-mots côté client:
      // Firestore ne peut pas faire un "contains" multi-critères sur (firstName + lastName).
      // On récupère un pool puis on garde les artisans qui matchent TOUS les mots.
      const filteredResults = results.filter((a) => {
        const haystack = normalizeText(
          [
            a.companyName,
            a.firstName,
            a.lastName,
            `${a.firstName} ${a.lastName}`,
            a.city,
            a.profession,
            a.phone,
          ].filter(Boolean).join(" ")
        );

        return queryTerms.every((t) => haystack.includes(t));
      });

      // Limiter à 10 résultats maximum
      setSearchResults(filteredResults.slice(0, 10));
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectArtisan = (artisanId: string) => {
    router.push(`/avis/${artisanId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-gray-50">
      <Header />
      
      <main className="min-h-screen container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Laisser un avis
            </h1>
            <p className="text-lg text-gray-600">
              Recherchez l'artisan sur lequel vous souhaitez laisser un avis
            </p>
          </div>

          {/* Formulaire de recherche */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Rechercher un artisan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Nom, entreprise, ville, profession ou téléphone</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Ex: Martin, SARL Dupont, Paris, Plombier, 06 12 34 56 78..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching || !searchTerm.trim()}
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultats de recherche */}
          {hasSearched && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {searchResults.length > 0 
                    ? `${searchResults.length} artisan(s) trouvé(s)`
                    : "Aucun artisan trouvé"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((artisan) => (
                      <div
                        key={artisan.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {artisan.logoUrl ? (
                            <img
                              src={artisan.logoUrl}
                              alt={`Logo ${artisan.firstName} ${artisan.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Briefcase className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                          
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {artisan.companyName || `${artisan.firstName} ${artisan.lastName}`}
                            </h3>
                            {artisan.companyName && (
                              <p className="text-sm text-gray-500">
                                {artisan.firstName} {artisan.lastName}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {artisan.profession}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {artisan.city}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleSelectArtisan(artisan.id)}
                          className="flex items-center gap-2"
                        >
                          <Star className="h-4 w-4" />
                          Laisser un avis
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Aucun artisan trouvé</p>
                    <p>Essayez avec un autre nom ou une autre profession</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
