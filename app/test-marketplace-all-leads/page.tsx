"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  ArrowRight,
  ShoppingCart,
  Link,
  Users,
  Globe
} from "lucide-react";
import { generateLeadPurchaseLink } from "@/lib/lead-links";

export default function TestMarketplaceAllLeadsPage() {
  // Exemples de leads pour la démo
  const exampleLeads = [
    {
      id: "lead-123",
      type: "Rénovation cuisine",
      city: "Paris",
      price: 35,
      status: "active"
    },
    {
      id: "lead-456", 
      type: "Installation chauffage",
      city: "Lyon",
      price: 45,
      status: "active"
    },
    {
      id: "lead-789",
      type: "Isolation combles",
      city: "Marseille", 
      price: 30,
      status: "completed"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Marketplace - Toutes les Demandes
          </h1>
          <p className="text-gray-600">
            Vérification des nouvelles fonctionnalités : affichage de toutes les demandes + liens de paiement direct
          </p>
        </div>

        {/* Fonctionnalités implémentées */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  Nouvelles fonctionnalités
                </h3>
                <div className="text-green-800 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Dashboard artisan :</strong> Affiche TOUTES les demandes publiées (pas seulement filtrées par profession)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Liens de paiement direct :</strong> Chaque estimation a un lien unique pour achat direct</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Vérifications automatiques :</strong> Authentification, abonnement, disponibilité du lead</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    <span><strong>Interface admin :</strong> Bouton "Copier le lien" dans chaque projet</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow utilisateur */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Users className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Workflow artisan
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p><strong>1. Dashboard :</strong> L'artisan va sur /dashboard/marketplace</p>
                  <p><strong>2. Toutes les demandes :</strong> Il voit TOUTES les estimations publiées, pas seulement celles de ses professions</p>
                  <p><strong>3. Choix libre :</strong> Il peut acheter n'importe quel lead qui l'intéresse</p>
                  <p><strong>4. Achat normal :</strong> Processus de paiement Stripe habituel</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liens de paiement direct */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Link className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">
                  Liens de paiement direct
                </h3>
                <div className="text-orange-800 text-sm space-y-3">
                  <p><strong>Principe :</strong> Chaque estimation a un lien unique permettant l'achat direct</p>
                  
                  <div className="space-y-2">
                    <p><strong>Exemples de liens :</strong></p>
                    {exampleLeads.map((lead) => (
                      <div key={lead.id} className="bg-white border border-orange-200 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{lead.type} - {lead.city}</span>
                          <Badge variant={lead.status === 'active' ? 'default' : 'secondary'}>
                            {lead.status === 'active' ? 'Disponible' : 'Complet'}
                          </Badge>
                        </div>
                        <div className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                          {generateLeadPurchaseLink(lead.id)}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Prix : {lead.price}€
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vérifications automatiques */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Globe className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">
                  Vérifications automatiques
                </h3>
                <div className="text-purple-800 text-sm space-y-2">
                  <p><strong>Quand un artisan clique sur un lien :</strong></p>
                  <div className="space-y-1 ml-4">
                    <p>• <strong>Authentification :</strong> Vérifie qu'un utilisateur est connecté</p>
                    <p>• <strong>Type d'utilisateur :</strong> Vérifie que c'est bien un artisan</p>
                    <p>• <strong>Abonnement :</strong> Vérifie que l'abonnement est actif</p>
                    <p>• <strong>Disponibilité :</strong> Vérifie que le lead est encore disponible</p>
                    <p>• <strong>Pas de doublon :</strong> Vérifie que l'artisan n'a pas déjà acheté ce lead</p>
                  </div>
                  <p className="mt-3"><strong>Si tout est OK :</strong> Affichage de la page d'achat avec détails complets</p>
                  <p><strong>Sinon :</strong> Redirection appropriée (connexion, dashboard, etc.)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interface admin */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShoppingCart className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Interface admin améliorée
                </h3>
                <div className="text-gray-800 text-sm space-y-2">
                  <p><strong>Dans chaque projet (/admin/projets/[id]) :</strong></p>
                  <div className="space-y-1 ml-4">
                    <p>• <strong>Section "Lien de paiement direct"</strong> ajoutée</p>
                    <p>• <strong>Lien généré automatiquement</strong> pour chaque estimation</p>
                    <p>• <strong>Bouton "Copier"</strong> pour partager facilement le lien</p>
                    <p>• <strong>Feedback visuel</strong> quand le lien est copié</p>
                  </div>
                  <p className="mt-3"><strong>Utilisation :</strong> L'admin peut copier le lien et l'envoyer directement aux artisans intéressés</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pages créées */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Pages et fichiers créés
                </h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p><strong>1. Page d'achat direct :</strong> <code>/app/buy-lead/[leadId]/page.tsx</code></p>
                  <p><strong>2. Utilitaires de liens :</strong> <code>/lib/lead-links.ts</code></p>
                  <p><strong>3. Marketplace modifiée :</strong> <code>/components/marketplace/MarketplaceBoard.tsx</code></p>
                  <p><strong>4. Interface admin mise à jour :</strong> <code>/components/admin/ProjectMarketplaceCard.tsx</code></p>
                  <p><strong>5. Dashboard artisan modifié :</strong> <code>/app/dashboard/marketplace/page.tsx</code></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test des liens */}
        <Card>
          <CardHeader>
            <CardTitle>Test des liens générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Cliquez sur les liens ci-dessous pour tester le système :
              </p>
              {exampleLeads.map((lead) => (
                <div key={lead.id} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{lead.type} - {lead.city}</span>
                    <Badge variant={lead.status === 'active' ? 'default' : 'secondary'}>
                      {lead.price}€
                    </Badge>
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    disabled={lead.status !== 'active'}
                  >
                    <a href={generateLeadPurchaseLink(lead.id)} target="_blank" rel="noopener noreferrer">
                      {lead.status === 'active' ? 'Tester l\'achat' : 'Lead complet'}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
