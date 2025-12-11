"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Key, Building2 } from "lucide-react";

export default function DebugAuthPage() {
  const { user, artisan, isLoading } = useAuth();
  const [artisanSearch, setArtisanSearch] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchArtisanByEmail = async () => {
    if (!user?.email) return;

    setSearchLoading(true);
    try {
      const artisansQuery = query(
        collection(db, "artisans"),
        where("email", "==", user.email)
      );
      
      const querySnapshot = await getDocs(artisansQuery);
      
      if (!querySnapshot.empty) {
        const artisanDoc = querySnapshot.docs[0];
        setArtisanSearch({
          id: artisanDoc.id,
          ...artisanDoc.data()
        });
      } else {
        setArtisanSearch(null);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setArtisanSearch({ error: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      searchArtisanByEmail();
    }
  }, [user?.email]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Debug Authentification</h1>
        <p className="text-gray-600">Informations de debug pour résoudre les problèmes d'authentification</p>
      </div>

      {/* Informations utilisateur Firebase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Utilisateur Firebase Auth
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">UID:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">{user.uid}</div>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">{user.email}</div>
                </div>
              </div>
              <div>
                <span className="font-medium">Email vérifié:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.emailVerified ? 'Oui' : 'Non'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-red-600">Aucun utilisateur connecté</p>
          )}
        </CardContent>
      </Card>

      {/* Informations artisan du hook useAuth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Artisan (Hook useAuth)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {artisan ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">ID:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">{artisan.id}</div>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">{artisan.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Nom:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {artisan.firstName} {artisan.lastName}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Entreprise:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">{artisan.companyName}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Profession:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">{artisan.profession}</div>
                </div>
                <div>
                  <span className="font-medium">Statut:</span>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">{artisan.subscriptionStatus}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-red-600">Aucun artisan trouvé avec le hook useAuth</p>
          )}
        </CardContent>
      </Card>

      {/* Recherche artisan par email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Recherche Artisan par Email
            <Button 
              onClick={searchArtisanByEmail} 
              disabled={searchLoading || !user?.email}
              size="sm"
              variant="outline"
            >
              {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Recherche en cours...</span>
            </div>
          ) : artisanSearch ? (
            artisanSearch.error ? (
              <p className="text-red-600">Erreur: {artisanSearch.error}</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">ID trouvé:</span>
                    <div className="font-mono text-sm bg-green-100 p-2 rounded">{artisanSearch.id}</div>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <div className="font-mono text-sm bg-green-100 p-2 rounded">{artisanSearch.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Nom:</span>
                    <div className="font-mono text-sm bg-green-100 p-2 rounded">
                      {artisanSearch.firstName} {artisanSearch.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Entreprise:</span>
                    <div className="font-mono text-sm bg-green-100 p-2 rounded">{artisanSearch.companyName}</div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <p className="text-orange-600">Aucun artisan trouvé avec cet email</p>
          )}
        </CardContent>
      </Card>

      {/* Test API Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Test API Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {artisanSearch?.id && (
              <div>
                <p className="mb-2">URL API à tester:</p>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  /api/artisan/{artisanSearch.id}/analytics
                </div>
                <Button 
                  className="mt-2"
                  onClick={() => window.open(`/api/artisan/${artisanSearch.id}/analytics`, '_blank')}
                >
                  Tester l'API
                </Button>
              </div>
            )}
            
            {user?.uid && (
              <div>
                <p className="mb-2">URL API avec UID Firebase:</p>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  /api/artisan/{user.uid}/analytics
                </div>
                <Button 
                  className="mt-2"
                  onClick={() => window.open(`/api/artisan/${user.uid}/analytics`, '_blank')}
                >
                  Tester avec UID
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {!user && (
              <p className="text-red-600">❌ Vous n'êtes pas connecté</p>
            )}
            
            {user && !artisan && (
              <p className="text-orange-600">⚠️ Utilisateur connecté mais aucun profil artisan trouvé avec le hook useAuth</p>
            )}
            
            {user && artisan && artisan.id !== user.uid && (
              <p className="text-blue-600">ℹ️ L'ID artisan ({artisan.id}) est différent de l'UID Firebase ({user.uid})</p>
            )}
            
            {user && artisanSearch && (
              <p className="text-green-600">✅ Artisan trouvé par recherche email</p>
            )}
            
            {user && !artisanSearch && (
              <p className="text-red-600">❌ Aucun artisan trouvé avec l'email {user.email}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
