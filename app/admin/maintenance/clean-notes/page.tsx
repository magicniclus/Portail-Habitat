"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Trash2,
  FileText
} from "lucide-react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CleanNotesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    cleaned: number;
  } | null>(null);

  const cleanBoughtLeadsNotes = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('🧹 Début du nettoyage des notes des leads achetés...');
      
      // Récupérer tous les artisans
      const artisansSnapshot = await getDocs(collection(db, 'artisans'));
      let totalCleaned = 0;
      
      for (const artisanDoc of artisansSnapshot.docs) {
        const artisanId = artisanDoc.id;
        console.log(`👤 Traitement de l'artisan: ${artisanId}`);
        
        // Récupérer les leads de cet artisan
        const leadsRef = collection(db, 'artisans', artisanId, 'leads');
        const leadsSnapshot = await getDocs(leadsRef);
        
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧹 Nettoyage des Notes d'Appels d'Offres
          </h1>
          <p className="text-gray-600">
            Supprimer les notes automatiques "Lead acheté sur la marketplace pour X€" des appels d'offres existants
          </p>
        </div>

        {/* Avertissement */}
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>⚠️ Action de maintenance :</strong> Cette opération va supprimer les notes automatiques 
            de tous les appels d'offres existants. Cette action est irréversible.
          </AlertDescription>
        </Alert>

        {/* Description de l'opération */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Que fait cette opération ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p><strong>Cette opération va :</strong></p>
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Parcourir tous les artisans de la base de données</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Identifier les appels d'offres avec des notes automatiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Supprimer les textes : "Lead acheté sur la marketplace pour X€"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Remplacer par des notes vides</span>
                </div>
              </div>
              
              <p className="mt-3"><strong>Résultat :</strong></p>
              <div className="ml-4 text-gray-700">
                <p>Les appels d'offres afficheront "Aucune note" au lieu du texte commercial automatique.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton d'action */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Button
                onClick={cleanBoughtLeadsNotes}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
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
                    Nettoyer les notes automatiques
                  </>
                )}
              </Button>
              
              {isLoading && (
                <p className="text-sm text-gray-600">
                  Cette opération peut prendre quelques secondes...
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Résultat */}
        {result && (
          <Alert className={result.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              <strong>{result.success ? "✅ Succès :" : "❌ Erreur :"}</strong> {result.message}
              {result.success && result.cleaned > 0 && (
                <div className="mt-2">
                  <strong>📊 Statistiques :</strong>
                  <div className="ml-4">
                    <p>• {result.cleaned} appel(s) d'offres nettoyé(s)</p>
                    <p>• Notes automatiques supprimées</p>
                    <p>• Interface maintenant épurée</p>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions post-nettoyage */}
        {result?.success && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Nettoyage terminé !
                  </h3>
                  <div className="text-blue-800 text-sm">
                    <p>
                      Les appels d'offres n'affichent plus le texte commercial automatique. 
                      Vous pouvez maintenant retourner à la page "Mes demandes" pour vérifier le résultat.
                    </p>
                    
                    <div className="mt-3">
                      <Button asChild variant="outline" size="sm">
                        <a href="/dashboard/demandes">
                          Voir mes demandes
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
