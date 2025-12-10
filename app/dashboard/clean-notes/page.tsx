"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle,
  Loader2,
  Trash2,
  ArrowLeft
} from "lucide-react";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function CleanNotesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [artisanId, setArtisanId] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    cleaned: number;
  } | null>(null);

  // Récupérer l'ID de l'artisan connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Récupérer l'artisan correspondant à cet utilisateur
        const artisansRef = collection(db, "artisans");
        const q = query(artisansRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const artisanDoc = querySnapshot.docs[0];
          setArtisanId(artisanDoc.id);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const cleanMyBoughtLeadsNotes = async () => {
    if (!artisanId) return;

    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧹 Nettoyage des notes pour l\'artisan:', artisanId);
      
      // Récupérer les leads de cet artisan
      const leadsRef = collection(db, 'artisans', artisanId, 'leads');
      const leadsSnapshot = await getDocs(leadsRef);
      
      let totalCleaned = 0;
      
      for (const leadDoc of leadsSnapshot.docs) {
        const leadData = leadDoc.data();
        
        // Vérifier si c'est un lead acheté avec une note à nettoyer
        if (leadData.source === 'bought' && 
            leadData.notes && 
            (leadData.notes.includes('Lead acheté sur la marketplace pour') ||
             leadData.notes.includes('Appel d\'offres reçu via la bourse au travail'))) {
          
          console.log(`🔧 Nettoyage du lead: ${leadDoc.id}`);
          
          // Mettre à jour avec une note vide
          await updateDoc(doc(db, 'artisans', artisanId, 'leads', leadDoc.id), {
            notes: '',
            updatedAt: new Date()
          });
          
          totalCleaned++;
        }
      }
      
      setResult({
        success: true,
        message: `Nettoyage terminé avec succès !`,
        cleaned: totalCleaned
      });
      
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
      setResult({
        success: false,
        message: `Erreur lors du nettoyage: ${error}`,
        cleaned: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!artisanId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Chargement...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard/demandes" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />
            Retour aux demandes
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧹 Nettoyer mes appels d'offres
          </h1>
          <p className="text-gray-600">
            Supprimer les notes automatiques de vos appels d'offres
          </p>
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Que fait cette action ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p>Cette action va nettoyer vos appels d'offres en :</p>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Supprimant le texte "Lead acheté sur la marketplace pour X€"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Remplaçant par "Aucune note" pour un affichage plus propre</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Button
                onClick={cleanMyBoughtLeadsNotes}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Nettoyage en cours...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Nettoyer mes appels d'offres
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Résultat */}
        {result && (
          <Alert className={result.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>✅ {result.message}</strong>
              {result.success && (
                <div className="mt-2">
                  <p>📊 {result.cleaned} appel(s) d'offres nettoyé(s)</p>
                  <div className="mt-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard/demandes">
                        Voir mes demandes
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
