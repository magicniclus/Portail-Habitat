"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  AlertCircle,
  Eye,
  CreditCard
} from "lucide-react";
import { generateLeadPurchaseLink } from "@/lib/lead-links";

export default function TestBuyLeadFinalPage() {
  const exampleLeadId = "test-lead-final";
  const leadLink = generateLeadPurchaseLink(exampleLeadId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Page Finale - Répondre au Projet
          </h1>
          <p className="text-gray-600">
            Vérification des dernières améliorations : titre, hauteur, CGV obligatoires
          </p>
        </div>

        {/* Améliorations apportées */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Améliorations finales
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Titre modifié :</strong> "Répondre au projet" (plus authentique que "se positionner")</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Hauteur ajustée :</strong> Background gris couvre toute la page moins le header</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>CGV obligatoires :</strong> Checkbox requise avant paiement avec lien vers conditions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Bouton adaptatif :</strong> Désactivé si CGV non acceptées</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nouveau titre */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Eye className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Nouveau titre : "Répondre au projet"
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>Pourquoi ce changement :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• "Se positionner" peut être trompeur (fausse vente)</p>
                    <p>• "Répondre au projet" est plus direct et honnête</p>
                    <p>• L'artisan comprend qu'il répond à une demande client</p>
                    <p>• Pas de promesse de positionnement qui ne sera pas tenue</p>
                  </div>
                  
                  <p className="mt-3"><strong>Alternatives possibles :</strong></p>
                  <div className="ml-4 space-y-1 text-blue-700">
                    <p>• "Voir le projet complet"</p>
                    <p>• "Accéder aux détails"</p>
                    <p>• "Contacter ce client"</p>
                    <p>• "Répondre à cette demande"</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CGV obligatoires */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">
                  CGV obligatoires avant paiement
                </h3>
                <div className="text-orange-800 text-sm space-y-2">
                  <p><strong>Implémentation :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Checkbox obligatoire avant le bouton de paiement</p>
                    <p>• Lien vers /conditions-generales (s'ouvre dans nouvel onglet)</p>
                    <p>• Bouton désactivé tant que CGV non acceptées</p>
                    <p>• Vérification côté client ET serveur</p>
                  </div>
                  
                  <div className="bg-white border border-orange-200 rounded p-3 mt-3">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded"
                        disabled
                      />
                      <label className="text-sm text-gray-700">
                        J'accepte les{" "}
                        <span className="text-orange-600 underline">Conditions Générales de Vente</span>{" "}
                        et confirme vouloir accéder aux coordonnées de ce client.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hauteur et design */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShoppingCart className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Hauteur et design améliorés
                </h3>
                <div className="text-purple-800 text-sm space-y-2">
                  <p><strong>Hauteur minimum :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• <code>min-h-[calc(100vh-80px)]</code> sur le main</p>
                    <p>• Background gris couvre toute la page visible</p>
                    <p>• Pas d'espace blanc en bas</p>
                    <p>• Responsive sur mobile et desktop</p>
                  </div>
                  
                  <p><strong>Cohérence visuelle :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Header blanc fixe en haut</p>
                    <p>• Main gris avec padding adaptatif</p>
                    <p>• Cards blanches sur fond gris</p>
                    <p>• Couleurs orange pour les actions</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paiement Stripe */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CreditCard className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Paiement Stripe adaptatif
                </h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p><strong>Fonctionnalités :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Prix dynamique récupéré depuis <code>estimation.marketplacePrice</code></p>
                    <p>• Formulaire complet : carte, expiration, CVV, nom</p>
                    <p>• Nom pré-rempli avec les données artisan</p>
                    <p>• Redirection vers page Stripe existante</p>
                  </div>
                  
                  <p><strong>Sécurité :</strong></p>
                  <div className="ml-4 space-y-1">
                    <p>• Validation des champs obligatoires</p>
                    <p>• CGV acceptées avant soumission</p>
                    <p>• Bouton désactivé pendant traitement</p>
                    <p>• Gestion d'erreurs intégrée</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test du lien */}
        <Card>
          <CardHeader>
            <CardTitle>Tester la page finale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 border rounded p-4">
              <p className="text-sm text-gray-600 mb-2">Lien de test :</p>
              <div className="font-mono text-xs bg-white border rounded p-2 break-all">
                {leadLink}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button asChild>
                <a href={leadLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tester "Répondre au projet"
                </a>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="/dashboard/marketplace">
                  Aller à la bourse au chantier
                </a>
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>À vérifier :</strong></p>
              <p>• Titre "Répondre au projet" dans le header</p>
              <p>• Background gris couvre toute la hauteur</p>
              <p>• Checkbox CGV obligatoire avant paiement</p>
              <p>• Bouton désactivé si CGV non acceptées</p>
              <p>• Prix dynamique affiché correctement</p>
              <p>• Redirection vers page Stripe fonctionnelle</p>
            </div>
          </CardContent>
        </Card>

        {/* Résumé des fonctionnalités */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Fonctionnalités complètes
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-1">Interface :</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Titre authentique</li>
                        <li>• Hauteur adaptée</li>
                        <li>• Design responsive</li>
                        <li>• Couleurs cohérentes</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-1">Fonctionnalités :</p>
                      <ul className="space-y-1 text-gray-700">
                        <li>• CGV obligatoires</li>
                        <li>• Prix dynamique</li>
                        <li>• Paiement Stripe</li>
                        <li>• Validation complète</li>
                      </ul>
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
