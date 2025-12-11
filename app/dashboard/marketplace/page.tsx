"use client";

import { useAuth } from "../../../hooks/useAuth";
import MarketplaceBoard from "@/components/marketplace/MarketplaceBoard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ShoppingCart } from "lucide-react";

export default function MarketplacePage() {
  const { user, artisan, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || !artisan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Vous devez être connecté en tant qu'artisan pour accéder à la bourse au chantier.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Plus de vérification d'abonnement - accès libre pour les artisans connectés

  return (
    <div className="container mx-auto px-4 py-8">
      <MarketplaceBoard 
        artisanProfessions={artisan.professions || []} // Utiliser les professions de l'artisan
        artisanId={artisan.id}
        showAllLeads={true} // Afficher tous les projets par défaut (meilleure expérience utilisateur)
        artisanCoordinates={artisan.coordinates} // Passer les coordonnées de l'artisan
        artisanCity={artisan.city} // Passer la ville de l'artisan
      />
    </div>
  );
}
