"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Database,
  ExternalLink,
  Clock,
  Zap
} from "lucide-react";

export default function FirebaseIndexHelpPage() {
  const handleOpenFirebase = () => {
    window.open("https://console.firebase.google.com/v1/r/project/portail-habitat-2ac32/firestore/indexes?create_composite=ClNwcm9qZWN0cy9wb3J0YWlsLWhhYml0YXQtMmFjMzIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2xlYWRzL2luZGV4ZXMvXxABGgoKBnNvdXJjZRABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI", "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔥 Création d'Index Firebase Requis
          </h1>
          <p className="text-gray-600">
            Résolution de l'erreur FirebaseError pour la collection "leads"
          </p>
        </div>

        {/* Erreur détectée */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  Erreur Firebase détectée
                </h3>
                <div className="text-red-800 text-sm space-y-2">
                  <p><strong>Message d'erreur :</strong></p>
                  <div className="bg-white border border-red-200 rounded p-3 font-mono text-xs">
                    <p className="text-red-600">FirebaseError: The query requires an index</p>
                    <p className="text-gray-600 mt-1">Collection: artisans/{`{artisanId}`}/leads</p>
                    <p className="text-gray-600">Query: where("source", "==", "bought").orderBy("createdAt", "desc")</p>
                  </div>
                  
                  <p className="mt-3"><strong>Cause :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Requête composite sur la collection "leads"</p>
                    <p>• Filtrage par champ "source" + tri par "createdAt"</p>
                    <p>• Index composite requis par Firestore</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution immédiate */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Zap className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Solution immédiate (2 clics)
                </h3>
                <div className="text-green-800 text-sm space-y-3">
                  <p><strong>Étapes à suivre :</strong></p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">1</Badge>
                      <span>Cliquer sur le bouton ci-dessous pour ouvrir Firebase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">2</Badge>
                      <span>Cliquer sur "Create Index" dans la console Firebase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">3</Badge>
                      <span>Attendre 2-5 minutes que l'index soit créé</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <Button onClick={handleOpenFirebase} className="bg-green-600 hover:bg-green-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir Firebase Console (Index pré-configuré)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails de l'index */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Database className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Détails de l'index à créer
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>Configuration de l'index :</strong></p>
                  
                  <div className="bg-white border border-blue-200 rounded p-3">
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="font-medium">Collection Group:</span>
                        <span className="text-blue-600">leads</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Query Scope:</span>
                        <span className="text-blue-600">COLLECTION</span>
                      </div>
                      <div className="border-t pt-2">
                        <p className="font-medium mb-1">Fields:</p>
                        <div className="ml-4 space-y-1">
                          <div className="flex justify-between">
                            <span>source</span>
                            <span className="text-green-600">ASCENDING</span>
                          </div>
                          <div className="flex justify-between">
                            <span>createdAt</span>
                            <span className="text-orange-600">DESCENDING</span>
                          </div>
                          <div className="flex justify-between">
                            <span>__name__</span>
                            <span className="text-orange-600">DESCENDING</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-3"><strong>Utilisation :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Fonction getBoughtLeads() dans lib/artisan-leads.ts</p>
                    <p>• Onglet "Leads achetés" dans /dashboard/demandes</p>
                    <p>• Requête: where("source", "==", "bought").orderBy("createdAt", "desc")</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processus de création */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Temps de création
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Création :</strong> Instantanée (1 clic)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span><strong>Construction :</strong> 2-5 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Activation :</strong> Automatique</span>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded p-3 text-xs">
                <p><strong>Note :</strong> Une fois l'index créé, l'erreur disparaîtra automatiquement et les leads achetés s'afficheront normalement.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Après création
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Onglet "Leads achetés" fonctionnel</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Affichage des leads par date</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Gestion des statuts opérationnelle</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Plus d'erreurs Firebase</span>
                </div>
              </div>
              
              <div className="bg-green-100 rounded p-3 text-xs">
                <p><strong>Résultat :</strong> Le système de leads achetés sera pleinement opérationnel.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions visuelles */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions visuelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Ce que vous verrez dans Firebase :</h4>
              
              <div className="bg-gray-100 rounded p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Page "Create a composite index" ouverte</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Collection Group: "leads" pré-rempli</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Champs source + createdAt pré-configurés</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Bouton "Create Index" prêt à cliquer</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleOpenFirebase} className="bg-orange-600 hover:bg-orange-700">
                <Database className="h-4 w-4 mr-2" />
                Créer l'index maintenant
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/dashboard/demandes">
                  Retour aux demandes
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statut */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Statut actuel
                </h3>
                <div className="text-yellow-800 text-sm">
                  <p>
                    <strong>⚠️ Index manquant :</strong> L'onglet "Leads achetés" ne peut pas charger les données 
                    tant que l'index Firebase n'est pas créé. Cette opération est nécessaire une seule fois 
                    et prend quelques minutes.
                  </p>
                  
                  <p className="mt-2">
                    <strong>🚀 Action requise :</strong> Cliquez sur le bouton ci-dessus pour créer l'index 
                    et résoudre définitivement cette erreur.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
