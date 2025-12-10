"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock
} from "lucide-react";

export default function FixFirebaseUrgentPage() {
  const handleOpenFirebase = () => {
    window.open("https://console.firebase.google.com/v1/r/project/portail-habitat-2ac32/firestore/indexes?create_composite=ClNwcm9qZWN0cy9wb3J0YWlsLWhhYml0YXQtMmFjMzIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2xlYWRzL2luZGV4ZXMvXxABGgoKBnNvdXJjZRABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI", "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Alerte urgente */}
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>🚨 ACTION URGENTE REQUISE :</strong> L'onglet "Leads achetés" ne fonctionne pas car l'index Firebase n'est pas créé !
          </AlertDescription>
        </Alert>

        {/* Solution immédiate */}
        <Card className="border-orange-500 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Solution en 30 secondes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-orange-800">
              <p className="mb-4">
                <strong>L'erreur persiste car l'index Firebase n'a pas été créé.</strong> 
                Voici comment le résoudre définitivement :
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded border">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <span>Cliquer sur le bouton ci-dessous</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded border">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <span>Dans Firebase, cliquer sur <strong>"Create Index"</strong> (bouton bleu)</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded border">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <span>Attendre 2-3 minutes que l'index se construise</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleOpenFirebase} 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              🔥 OUVRIR FIREBASE ET CRÉER L'INDEX MAINTENANT
            </Button>
          </CardContent>
        </Card>

        {/* Pourquoi cette erreur */}
        <Card>
          <CardHeader>
            <CardTitle>Pourquoi cette erreur ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p>
                <strong>L'erreur "The query requires an index"</strong> apparaît car :
              </p>
              
              <div className="ml-4 space-y-1">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>L'onglet "Leads achetés" fait une requête complexe sur Firestore</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Cette requête filtre par <code>source = "bought"</code> ET trie par <code>createdAt</code></span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>Firebase exige un index composite pour ce type de requête</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution temporaire */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">✅ Solution temporaire appliquée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-800 text-sm">
              <p>
                En attendant la création de l'index, j'ai modifié le code pour éviter l'erreur :
              </p>
              
              <div className="mt-3 bg-white border border-blue-200 rounded p-3 font-mono text-xs">
                <p>// Récupère tous les leads puis filtre côté client</p>
                <p>const allLeads = await getDocs(leadsRef);</p>
                <p>return allLeads.filter(lead =&gt; lead.source === "bought");</p>
              </div>
              
              <p className="mt-3">
                <strong>Cela devrait permettre à l'onglet de fonctionner temporairement,</strong> 
                mais il faut quand même créer l'index pour une performance optimale.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Après création */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Après création de l'index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-800 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Plus d'erreur Firebase dans la console</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Onglet "Leads achetés" fonctionne parfaitement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Performance optimale des requêtes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Système complètement opérationnel</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temps estimé */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Temps estimé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cliquer sur le bouton :</span>
                <span className="font-medium">5 secondes</span>
              </div>
              <div className="flex justify-between">
                <span>Créer l'index dans Firebase :</span>
                <span className="font-medium">10 secondes</span>
              </div>
              <div className="flex justify-between">
                <span>Construction de l'index :</span>
                <span className="font-medium">2-3 minutes</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total :</span>
                <span className="text-green-600">~3 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton final */}
        <div className="text-center">
          <Button 
            onClick={handleOpenFirebase} 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            <Zap className="h-5 w-5 mr-2" />
            🚨 RÉSOUDRE L'ERREUR MAINTENANT
          </Button>
          
          <p className="text-sm text-gray-600 mt-2">
            Une fois l'index créé, cette erreur ne reviendra plus jamais
          </p>
        </div>
      </div>
    </div>
  );
}
