"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TestBannerFixPage() {
  const [artisanId, setArtisanId] = useState("sE3u1ueTdyc2csC9hFnvdoxTZtN2");
  const [bannerUrls, setBannerUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [currentData, setCurrentData] = useState<any>(null);

  const handleLoadCurrent = async () => {
    setLoading(true);
    try {
      const artisanRef = doc(db, 'artisans', artisanId);
      const artisanDoc = await getDoc(artisanRef);
      
      if (artisanDoc.exists()) {
        const data = artisanDoc.data();
        setCurrentData(data.premiumFeatures?.bannerPhotos || []);
        setResult({ 
          success: true, 
          message: "Données chargées",
          current: data.premiumFeatures?.bannerPhotos || []
        });
      }
    } catch (error) {
      setResult({ error: 'Erreur de chargement', details: error });
    } finally {
      setLoading(false);
    }
  };

  const handleCleanUrls = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/force-clean-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artisanId }),
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Recharger les données
        await handleLoadCurrent();
      }
    } catch (error) {
      setResult({ error: 'Erreur réseau', details: error });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Parser les URLs (une par ligne)
      const urls = bannerUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      if (urls.length === 0) {
        setResult({ error: 'Aucune URL fournie' });
        setLoading(false);
        return;
      }

      // Mettre à jour Firestore
      const artisanRef = doc(db, 'artisans', artisanId);
      await updateDoc(artisanRef, {
        'premiumFeatures.bannerPhotos': urls,
        updatedAt: new Date()
      });

      setResult({
        success: true,
        message: `${urls.length} URL(s) sauvegardée(s)`,
        urls: urls
      });
      
      // Recharger les données
      await handleLoadCurrent();
    } catch (error) {
      setResult({ error: 'Erreur de mise à jour', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Correction manuelle des URLs de bannière</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              ID Artisan
            </label>
            <Input
              value={artisanId}
              onChange={(e) => setArtisanId(e.target.value)}
              placeholder="ID de l'artisan"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleLoadCurrent}
              disabled={loading || !artisanId}
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Charger les URLs"
              )}
            </Button>

            <Button
              onClick={handleCleanUrls}
              disabled={loading || !artisanId}
              variant="default"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Nettoyage...
                </>
              ) : (
                "🧹 Nettoyer automatiquement"
              )}
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              URLs de bannière (une par ligne, dans l'ordre)
            </label>
            <Textarea
              value={bannerUrls}
              onChange={(e) => setBannerUrls(e.target.value)}
              placeholder="Collez les URLs ici, une par ligne&#10;URL banner_001.jpg&#10;URL banner_002.jpg&#10;URL banner_003.jpg&#10;..."
              rows={10}
              className="font-mono text-xs"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Copiez les URLs depuis Firebase Storage, une par ligne
            </p>
          </div>

          <Button
            onClick={handleUpdate}
            disabled={loading || !artisanId || !bannerUrls}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour en cours...
              </>
            ) : (
              "Mettre à jour les URLs"
            )}
          </Button>

          {result && (
            <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-bold mb-2">
                {result.success ? "✅ Succès" : "❌ Erreur"}
              </h3>
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {currentData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold mb-2">📋 URLs actuelles dans Firestore</h3>
              {currentData.length === 0 ? (
                <p className="text-sm text-gray-600">Aucune URL enregistrée</p>
              ) : (
                <div className="space-y-3">
                  {currentData.map((url: string, index: number) => (
                    <div key={index} className="bg-white p-2 rounded border">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-sm">Image {index + 1}</strong>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            alert(`URL ${index + 1} copiée !`);
                          }}
                        >
                          Copier
                        </Button>
                      </div>
                      <p className="text-xs break-all font-mono text-gray-600">{url}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
