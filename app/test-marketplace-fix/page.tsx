"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ShoppingCart,
  Database
} from "lucide-react";
import { getMarketplaceLeads } from "@/lib/marketplace-data";

export default function TestMarketplaceFixPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>({});

  const runTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults({});

    try {
      console.log("🧪 Test 1: Récupération des leads marketplace...");
      const startTime = Date.now();
      
      const marketplaceLeads = await getMarketplaceLeads([], 10);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Test réussi en ${duration}ms`);
      console.log(`📊 ${marketplaceLeads.length} leads récupérés`);

      setLeads(marketplaceLeads);
      setTestResults({
        success: true,
        duration,
        leadsCount: marketplaceLeads.length,
        message: "Requête marketplace réussie sans erreur d'index"
      });

    } catch (err: any) {
      console.error("❌ Test échoué:", err);
      setError(err.message || "Erreur inconnue");
      setTestResults({
        success: false,
        error: err.message,
        code: err.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runProfessionTest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🧪 Test 2: Filtrage par professions...");
      const startTime = Date.now();
      
      const filteredLeads = await getMarketplaceLeads(["Plomberie", "Électricité"], 5);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Test filtrage réussi en ${duration}ms`);
      console.log(`📊 ${filteredLeads.length} leads filtrés`);

      setLeads(filteredLeads);
      setTestResults({
        success: true,
        duration,
        leadsCount: filteredLeads.length,
        message: "Filtrage par professions réussi",
        filter: ["Plomberie", "Électricité"]
      });

    } catch (err: any) {
      console.error("❌ Test filtrage échoué:", err);
      setError(err.message || "Erreur inconnue");
      setTestResults({
        success: false,
        error: err.message,
        code: err.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Marketplace - Fix Index Firestore
          </h1>
          <p className="text-gray-600">
            Vérification que les requêtes marketplace fonctionnent sans erreur d'index
          </p>
        </div>

        {/* Boutons de test */}
        <div className="flex gap-4">
          <Button onClick={runTest} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test général
          </Button>
          <Button onClick={runProfessionTest} disabled={isLoading} variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Test filtrage
          </Button>
        </div>

        {/* Résultats du test */}
        {testResults.success !== undefined && (
          <Alert className={testResults.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {testResults.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={testResults.success ? "text-green-700" : "text-red-700"}>
              <div className="space-y-2">
                <p className="font-medium">
                  {testResults.success ? "✅ Test réussi !" : "❌ Test échoué"}
                </p>
                <p>{testResults.message}</p>
                {testResults.duration && (
                  <p className="text-sm">Durée : {testResults.duration}ms</p>
                )}
                {testResults.leadsCount !== undefined && (
                  <p className="text-sm">Leads trouvés : {testResults.leadsCount}</p>
                )}
                {testResults.filter && (
                  <p className="text-sm">Filtres : {testResults.filter.join(", ")}</p>
                )}
                {testResults.error && (
                  <p className="text-sm font-mono bg-red-100 p-2 rounded">
                    {testResults.error}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Erreur */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <p className="font-medium">Erreur détectée :</p>
              <p className="font-mono text-sm mt-1">{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                <span>Test en cours...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leads récupérés */}
        {leads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Leads marketplace ({leads.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((lead, index) => (
                  <div key={lead.id || index} className="border rounded-lg p-4 space-y-2">
                    <div className="font-medium">{lead.projectType}</div>
                    <div className="text-sm text-gray-600">{lead.city}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {lead.marketplaceSales}/{lead.maxSales} vendus
                      </span>
                      <span className="font-medium text-green-600">
                        {lead.marketplacePrice}€
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Statut: {lead.marketplaceStatus}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info technique */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Database className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Correction appliquée
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>Problème :</strong> Requête Firestore nécessitant un index composite</p>
                  <p><strong>Avant :</strong> <code>where("isPublished") + orderBy("publishedAt")</code></p>
                  <p><strong>Après :</strong> <code>orderBy("createdAt")</code> puis filtrage complet côté client</p>
                  <p><strong>Solution :</strong> Une seule requête simple + filtrage JavaScript pour isPublished et marketplaceStatus</p>
                  <p><strong>Avantages :</strong> Aucun index requis, fonctionne immédiatement, très flexible</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
