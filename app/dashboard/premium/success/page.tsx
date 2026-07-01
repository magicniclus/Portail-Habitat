"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PremiumSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le dashboard après 4 secondes
    const timer = setTimeout(() => {
      router.push("/dashboard/fiche");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center max-w-md px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <Crown className="h-10 w-10 text-yellow-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue dans Premium !
        </h1>
        <p className="text-gray-600 mb-2">
          Votre essai gratuit de 7 jours commence maintenant.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Puis 49 €/mois. Sans engagement, résiliable à tout moment.
        </p>
        <Button
          onClick={() => router.push("/dashboard/fiche")}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          Accéder à mon espace Pro
        </Button>
        <p className="text-xs text-gray-400 mt-4">
          Redirection automatique dans quelques secondes…
        </p>
      </div>
    </div>
  );
}
