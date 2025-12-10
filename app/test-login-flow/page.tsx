"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  LogIn,
  UserPlus,
  ShoppingCart,
  AlertCircle
} from "lucide-react";
import InlineLoginForm from "@/components/InlineLoginForm";
import { generateLeadPurchaseLink } from "@/lib/lead-links";

export default function TestLoginFlowPage() {
  const exampleLeadId = "test-lead-123";
  const leadLink = generateLeadPurchaseLink(exampleLeadId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Flux de Connexion - Sans Abonnement
          </h1>
          <p className="text-gray-600">
            Vérification du nouveau système de connexion sans vérification d'abonnement
          </p>
        </div>

        {/* Modifications apportées */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Modifications apportées
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Suppression vérification abonnement :</strong> Plus de blocage pour les artisans non abonnés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Formulaire de connexion intégré :</strong> Connexion directe dans la page sans redirection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Options d'inscription :</strong> Bouton pour devenir artisan partenaire</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Messages adaptés :</strong> Différents selon l'état de l'utilisateur</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nouveau flux utilisateur */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <LogIn className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Nouveau flux utilisateur
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>1. Utilisateur non connecté :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Formulaire de connexion intégré dans la page</p>
                    <p>• Option "S'inscrire comme artisan" visible</p>
                    <p>• Redirection automatique après connexion</p>
                  </div>
                  
                  <p><strong>2. Utilisateur connecté mais pas artisan :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Message "Espace artisan requis"</p>
                    <p>• Bouton "Devenir artisan partenaire"</p>
                    <p>• Option retour au dashboard</p>
                  </div>
                  
                  <p><strong>3. Artisan connecté :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Accès direct à la page d'achat</p>
                    <p>• Plus de vérification d'abonnement</p>
                    <p>• Processus d'achat normal</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Composant de connexion intégré */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Formulaire de connexion intégré</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <InlineLoginForm 
                  title="Exemple de connexion"
                  description="Formulaire intégré directement dans la page"
                  redirectAfterLogin="/test-login-flow"
                  showSignupOption={true}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avantages du nouveau système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Pas de redirection</p>
                  <p className="text-sm text-green-700">L'utilisateur reste sur la page du lead</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Expérience fluide</p>
                  <p className="text-sm text-green-700">Connexion et retour automatique</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Options claires</p>
                  <p className="text-sm text-green-700">Connexion ou inscription selon le besoin</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Accès libre</p>
                  <p className="text-sm text-green-700">Plus de barrière d'abonnement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* États gérés */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  États utilisateur gérés
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white border border-purple-200 rounded p-3">
                    <div className="font-medium text-purple-900 mb-2">Non connecté</div>
                    <div className="text-purple-700 space-y-1">
                      <p>• Formulaire de connexion</p>
                      <p>• Option inscription</p>
                      <p>• Redirection après login</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-purple-200 rounded p-3">
                    <div className="font-medium text-purple-900 mb-2">Connecté non-artisan</div>
                    <div className="text-purple-700 space-y-1">
                      <p>• Message "Espace artisan requis"</p>
                      <p>• Bouton "Devenir artisan"</p>
                      <p>• Retour dashboard</p>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-purple-200 rounded p-3">
                    <div className="font-medium text-purple-900 mb-2">Artisan connecté</div>
                    <div className="text-purple-700 space-y-1">
                      <p>• Accès direct</p>
                      <p>• Page d'achat complète</p>
                      <p>• Processus normal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test du lien */}
        <Card>
          <CardHeader>
            <CardTitle>Test du lien de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-600 mb-2">Lien de test généré :</p>
              <div className="font-mono text-xs bg-white border rounded p-2 break-all">
                {leadLink}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button asChild>
                <a href={leadLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tester le lien (nouvel onglet)
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/dashboard/marketplace">
                  Aller à la bourse au chantier
                </a>
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Si vous n'êtes pas connecté : formulaire de connexion intégré</p>
              <p>• Si vous êtes connecté mais pas artisan : message d'inscription</p>
              <p>• Si vous êtes artisan : page d'achat directe</p>
            </div>
          </CardContent>
        </Card>

        {/* Composant créé */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <UserPlus className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Nouveau composant créé
                </h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p><strong>InlineLoginForm</strong> (<code>/components/InlineLoginForm.tsx</code>)</p>
                  <div className="ml-4 space-y-1">
                    <p>• Formulaire de connexion réutilisable</p>
                    <p>• Gestion d'erreurs intégrée</p>
                    <p>• Options de personnalisation (titre, description, redirection)</p>
                    <p>• Option d'inscription configurable</p>
                    <p>• Lien vers page de connexion complète</p>
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
