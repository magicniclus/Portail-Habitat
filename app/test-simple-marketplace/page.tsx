"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ShoppingCart,
  Database,
  Zap
} from "lucide-react";
import { getMarketplaceLeads } from "@/lib/marketplace-data";

export default function TestSimpleMarketplacePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testMarketplace = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("🧪 Test marketplace avec nouvelle approche...");
      const startTime = Date.now();
      
      const leads = await getMarketplaceLeads([], 5);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Succès ! ${leads.length} leads en ${duration}ms`);

      setResult({
        success: true,
        leadsCount: leads.length,
        duration,
        leads: leads.slice(0, 3) // Afficher seulement les 3 premiers
      });

    } catch (err: any) {
      console.error("❌ Erreur:", err);
      setError(err.message);
      setResult({
        success: false,
        error: err.message,
        code: err.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Marketplace Simplifié
          </h1>
          <p className="text-gray-600">
            Vérification rapide de la nouvelle approche sans index
          </p>
        </div>

        {/* Test Button */}
        <div className="text-center">
          <Button 
            onClick={testMarketplace} 
            disabled={isLoading}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Test en cours..." : "Tester la marketplace"}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
              <div className="space-y-2">
                <p className="font-medium">
                  {result.success ? "✅ Test réussi !" : "❌ Test échoué"}
                </p>
                {result.success && (
                  <>
                    <p>📊 {result.leadsCount} leads récupérés</p>
                    <p>⚡ Temps d'exécution : {result.duration}ms</p>
                  </>
                )}
                {result.error && (
                  <p className="font-mono text-sm bg-red-100 p-2 rounded">
                    {result.error}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <p className="font-medium">Erreur :</p>
              <p className="font-mono text-sm mt-1">{error}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Sample Leads */}
        {result?.success && result.leads?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Aperçu des leads ({result.leadsCount} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.leads.map((lead: any, index: number) => (
                  <div key={lead.id || index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{lead.projectType}</div>
                      <div className="text-sm text-green-600 font-medium">
                        {lead.marketplacePrice}€
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{lead.city}</div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Statut: {lead.marketplaceStatus}</span>
                      <span>Publié: {lead.isPublished ? "Oui" : "Non"}</span>
                      <span>{lead.marketplaceSales}/{lead.maxSales} vendus</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Approche Simplifiée
                </h3>
                <div className="text-blue-800 text-sm space-y-1">
                  <p>🔍 <strong>Requête :</strong> <code>orderBy("createdAt", "desc")</code></p>
                  <p>⚡ <strong>Filtrage :</strong> JavaScript côté client</p>
                  <p>📊 <strong>Critères :</strong> isPublished = true ET marketplaceStatus = active</p>
                  <p>🎯 <strong>Avantage :</strong> Aucun index Firestore requis</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
