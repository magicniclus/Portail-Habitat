"use client";

import { useAuth } from "@/hooks/useAuth";
import PurchasedLeadsBoard from "@/components/artisan/PurchasedLeadsBoard";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ShoppingCart } from "lucide-react";

export default function LeadsAchetesPage() {
  const { user, artisan, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Chargement de vos leads achetés...</p>
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
            Vous devez être connecté en tant qu'artisan pour voir vos leads achetés.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header de la page */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mes leads achetés
              </h1>
              <p className="text-gray-600">
                Gérez et suivez vos leads achetés sur la marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Composant des leads achetés */}
        <PurchasedLeadsBoard artisanId={artisan.id} />
      </div>
    </div>
  );
}
