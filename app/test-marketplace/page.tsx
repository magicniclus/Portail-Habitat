"use client";

import MarketplaceBoard from "@/components/marketplace/MarketplaceBoard";

export default function TestMarketplacePage() {
  // Simuler un artisan avec des professions
  const mockArtisanProfessions = ["Plomberie", "Chauffage", "Salle de bain"];
  const mockArtisanId = "test-artisan-123";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Test Marketplace
        </h1>
        <p className="text-gray-600">
          Aperçu de la bourse au travail pour les artisans
        </p>
      </div>

      <MarketplaceBoard 
        artisanProfessions={mockArtisanProfessions}
        artisanId={mockArtisanId}
      />
    </div>
  );
}
