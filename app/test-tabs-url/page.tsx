"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  Link as LinkIcon,
  RefreshCw,
  ExternalLink,
  FileText as TabsIcon
} from "lucide-react";
import Link from "next/link";

export default function TestTabsUrlPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔗 Test Navigation par Onglets avec URL
          </h1>
          <p className="text-gray-600">
            Vérification de la persistance des onglets dans l'URL de la page "Mes demandes"
          </p>
        </div>

        {/* Fonctionnalité implémentée */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Navigation par URL implémentée ✅
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>URL dynamique :</strong> L'onglet actif est reflété dans l'URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Persistance :</strong> Rechargement conserve l'onglet sélectionné</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Navigation :</strong> Retour/Avancer fonctionne avec les onglets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Partage :</strong> URLs directes vers un onglet spécifique</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure des URLs */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Structure des URLs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">URLs disponibles :</h4>
              
              <div className="space-y-2">
                <div className="bg-white border border-blue-200 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-blue-600">/dashboard/demandes</p>
                      <p className="text-xs text-gray-600 mt-1">Par défaut → Demandes générées</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Défaut</Badge>
                  </div>
                </div>
                
                <div className="bg-white border border-blue-200 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-blue-600">/dashboard/demandes?tab=generated</p>
                      <p className="text-xs text-gray-600 mt-1">Onglet "Demandes générées"</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  </div>
                </div>
                
                <div className="bg-white border border-blue-200 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-blue-600">/dashboard/demandes?tab=bought</p>
                      <p className="text-xs text-gray-600 mt-1">Onglet "Appels d'offres"</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Actif</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tests à effectuer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TabsIcon className="h-5 w-5" />
                Tests de navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <h4 className="font-medium text-gray-900">À tester :</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Cliquer sur les onglets → URL change</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Recharger la page → Onglet conservé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Bouton retour → Navigation fonctionne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>URL directe → Onglet correct affiché</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Comportements attendus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <h4 className="font-medium text-gray-900">Résultats :</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>URL mise à jour automatiquement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Persistance après rechargement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Navigation browser fonctionnelle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>URLs partageables</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liens de test */}
        <Card>
          <CardHeader>
            <CardTitle>Liens de test directs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Tester les URLs directement :</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/dashboard/demandes">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Page par défaut
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/dashboard/demandes?tab=generated">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Demandes générées
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/dashboard/demandes?tab=bought">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Appels d'offres
                  </Link>
                </Button>
                
                <Button asChild className="justify-start">
                  <Link href="/dashboard/demandes?tab=bought">
                    <TabsIcon className="h-4 w-4 mr-2" />
                    Test complet
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implémentation technique */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle>Implémentation technique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Code ajouté :</h4>
              
              <div className="bg-white border border-gray-200 rounded p-3 font-mono text-sm space-y-2">
                <p className="text-blue-600">// 1. Imports ajoutés</p>
                <p>useRouter, useSearchParams from next/navigation</p>
                
                <p className="text-blue-600 mt-3">// 2. Récupération onglet actif</p>
                <p>activeTab = searchParams.get('tab') || 'generated'</p>
                
                <p className="text-blue-600 mt-3">// 3. Fonction changement onglet</p>
                <p>handleTabChange → met à jour URL avec nouveau tab</p>
                
                <p className="text-blue-600 mt-3">// 4. Utilisation dans Tabs</p>
                <p>onValueChange utilise handleTabChange</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avantages */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Avantages de cette implémentation
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="space-y-1">
                    <p><strong>1. Expérience utilisateur améliorée :</strong></p>
                    <div className="ml-4 text-green-700">
                      <p>• Persistance de l'état après rechargement</p>
                      <p>• Navigation browser fonctionnelle (retour/avancer)</p>
                      <p>• URLs partageables et bookmarkables</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>2. SEO et accessibilité :</strong></p>
                    <div className="ml-4 text-green-700">
                      <p>• URLs descriptives et logiques</p>
                      <p>• État de l'application dans l'URL</p>
                      <p>• Compatible avec les outils d'analyse</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>3. Développement :</strong></p>
                    <div className="ml-4 text-green-700">
                      <p>• État synchronisé avec l'URL</p>
                      <p>• Debugging facilité</p>
                      <p>• Comportement prévisible</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
