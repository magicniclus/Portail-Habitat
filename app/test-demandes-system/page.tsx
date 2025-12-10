"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  Mail,
  Package,
  AlertCircle,
  Database,
  Eye,
  X,
  FileText as TabsIcon
} from "lucide-react";

export default function TestDemandesSystemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Système Mes Demandes Unifié
          </h1>
          <p className="text-gray-600">
            Vérification de l'intégration des leads achetés dans "Mes demandes"
          </p>
        </div>

        {/* Système implémenté */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Système unifié implémenté ✅
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Navigation simplifiée :</strong> "Leads achetés" et "Mes projets" supprimés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Onglets intégrés :</strong> Demandes générées + Leads achetés dans une seule page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Interface cohérente :</strong> Même style et fonctionnalités</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Gestion complète :</strong> Statuts, coordonnées, actions directes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure des onglets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Demandes générées</h3>
              </div>
              <div className="text-blue-800 text-sm space-y-2">
                <p><strong>Contenu existant :</strong></p>
                <div className="ml-2 space-y-1 text-blue-700">
                  <p>• Statistiques rapides (4 cartes KPI)</p>
                  <p>• Filtres de recherche et tri</p>
                  <p>• Liste des demandes avec actions</p>
                  <p>• Modal de création de demande</p>
                  <p>• Modal d'envoi d'email</p>
                </div>
                
                <p className="mt-3"><strong>Fonctionnalités :</strong></p>
                <div className="ml-2 space-y-1 text-blue-700">
                  <p>• Gestion des statuts</p>
                  <p>• Édition des notes</p>
                  <p>• Appel et email directs</p>
                  <p>• Filtrage par type et statut</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Package className="h-6 w-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Leads achetés</h3>
              </div>
              <div className="text-orange-800 text-sm space-y-2">
                <p><strong>Nouveau contenu :</strong></p>
                <div className="ml-2 space-y-1 text-orange-700">
                  <p>• Grille de cartes responsive</p>
                  <p>• Coordonnées client complètes</p>
                  <p>• Prix payé et date d'achat</p>
                  <p>• Boutons d'action contextuels</p>
                </div>
                
                <p className="mt-3"><strong>Fonctionnalités :</strong></p>
                <div className="ml-2 space-y-1 text-orange-700">
                  <p>• Statuts : Nouveau → Contacté → Converti</p>
                  <p>• Liens tel: et mailto: directs</p>
                  <p>• Informations marketplace</p>
                  <p>• État vide avec lien vers bourse</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation mise à jour */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <X className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">
                  Navigation simplifiée
                </h3>
                <div className="text-red-800 text-sm space-y-2">
                  <p><strong>Supprimé de la sidebar :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• "Leads achetés" (redondant)</p>
                    <p>• "Mes projets" (selon demande utilisateur)</p>
                  </div>
                  
                  <p className="mt-3"><strong>Navigation actuelle :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• "Bourse au chantier" → Acheter des leads</p>
                    <p>• "Mes demandes" → Gérer tout (générées + achetées)</p>
                    <p>• Interface unifiée et intuitive</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Index Firebase requis */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Database className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Index Firebase requis
                </h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p><strong>Erreur détectée :</strong></p>
                  <div className="bg-white border border-yellow-200 rounded p-3 font-mono text-xs">
                    <p>FirebaseError: The query requires an index</p>
                    <p>Collection: artisans/{`{artisanId}`}/leads</p>
                    <p>Fields: source (ASC) + createdAt (DESC)</p>
                  </div>
                  
                  <p className="mt-3"><strong>Solution :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Créer l'index via console Firebase</p>
                    <p>• Collection group: "leads"</p>
                    <p>• Champs: source (ASC), createdAt (DESC)</p>
                    <p>• Lien direct fourni dans FIREBASE_INDEXES.md</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure technique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TabsIcon className="h-5 w-5" />
              Structure technique des onglets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Composant Tabs :</h4>
              <div className="bg-gray-100 rounded p-3 font-mono text-sm">
                <p>{`<Tabs value={activeTab} onValueChange={setActiveTab}>`}</p>
                <p className="ml-4">{`<TabsList className="grid w-full grid-cols-2">`}</p>
                <p className="ml-8">{`<TabsTrigger value="generated">Demandes générées</TabsTrigger>`}</p>
                <p className="ml-8">{`<TabsTrigger value="bought">Leads achetés</TabsTrigger>`}</p>
                <p className="ml-4">{`</TabsList>`}</p>
                <p className="ml-4">{`<TabsContent value="generated">...</TabsContent>`}</p>
                <p className="ml-4">{`<TabsContent value="bought">...</TabsContent>`}</p>
                <p>{`</Tabs>`}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">États gérés :</h4>
              <div className="bg-gray-100 rounded p-3 font-mono text-sm space-y-1">
                <p>const [leads, setLeads] = useState{`<Lead[]>`}([]);</p>
                <p>const [boughtLeads, setBoughtLeads] = useState{`<ArtisanLead[]>`}([]);</p>
                <p>const [activeTab, setActiveTab] = useState("generated");</p>
                <p>const [loadingBought, setLoadingBought] = useState(true);</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow utilisateur amélioré</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Onglet "Demandes générées" :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Statistiques en temps réel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Filtres et recherche</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Actions : voir, appeler, email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Création de nouvelles demandes</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Onglet "Leads achetés" :</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Coordonnées client complètes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Prix payé et informations achat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Gestion des statuts de conversion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Actions directes (tel, email)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild>
                <a href="/dashboard/demandes">
                  <Mail className="h-4 w-4 mr-2" />
                  Tester Mes demandes
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/dashboard/marketplace">
                  <Package className="h-4 w-4 mr-2" />
                  Acheter des leads
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Avantages du système */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Avantages du système unifié
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <div className="space-y-1">
                    <p><strong>1. Navigation simplifiée :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Moins d'éléments dans la sidebar</p>
                      <p>• Logique unifiée : tout dans "Mes demandes"</p>
                      <p>• Interface plus claire et intuitive</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>2. Expérience utilisateur cohérente :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Même interface pour tous les types de leads</p>
                      <p>• Onglets pour séparer les sources</p>
                      <p>• Actions similaires (statuts, contact)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p><strong>3. Gestion centralisée :</strong></p>
                    <div className="ml-4 text-gray-700">
                      <p>• Vue d'ensemble complète des leads</p>
                      <p>• Workflow unifié de gestion</p>
                      <p>• Pas de duplication d'interface</p>
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
