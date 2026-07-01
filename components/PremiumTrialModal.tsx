"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Crown,
  X,
  ArrowRight,
  Shield,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PremiumTrialModalProps {
  artisanId: string;
  onClose: () => void;
}

export default function PremiumTrialModal({
  artisanId,
  onClose,
}: PremiumTrialModalProps) {
  const { artisan } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const benefits = [
    "Visibilité prioritaire — apparaissez en tête des recherches dans votre zone",
    "Demandes de chantiers illimitées — accédez à tous les contacts, sans limite",
    "Jusqu'à 10× plus de demandes qu'un compte gratuit",
    "Coordonnées clients débloquées — contactez directement les particuliers",
    "Statistiques avancées — suivez vos vues, appels et demandes en temps réel",
    "Avis clients mis en avant pour renforcer votre réputation",
    "Application mobile — soyez alerté et répondez avant vos concurrents",
  ];

  const handleActivateTrial = async () => {
    setIsRedirecting(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanId: artisanId,
          email: artisan?.email || "",
          companyName: artisan?.companyName || "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Erreur paiement");
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
      setIsRedirecting(false);
    }
  };

  const handleDecline = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">

        {/* Header — blanc, accent orange doux */}
        <div className="relative px-7 pt-7 pb-5 border-b border-gray-100">
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Crown className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                Devenez Artisan Premium
              </h2>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Recevez jusqu'à{" "}
            <span className="font-semibold text-gray-800">
              10× plus de demandes de chantiers
            </span>{" "}
            qu'un compte gratuit — et transformez-les en clients.
          </p>
        </div>

        {/* Corps */}
        <div className="px-7 py-5 space-y-5">

          {/* Liste d'avantages */}
          <ul className="space-y-2.5">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Bloc prix */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-gray-900">0 €</span>
              <span className="text-gray-500 text-sm">pendant 7 jours</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Puis <span className="font-semibold text-gray-700">49 €/mois</span>. Sans engagement, résiliable en 1 clic.
            </p>
          </div>

          {/* Bouton principal */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <Button
            onClick={handleActivateTrial}
            disabled={isRedirecting}
            className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold py-5 text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Redirection vers le paiement…</span>
              </>
            ) : (
              <>
                <span>Activer mon essai gratuit — 7 jours</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>

          {/* Sous le bouton */}
          <p className="text-center text-xs text-gray-400">
            Aucun débit aujourd'hui · Résiliable avant la fin de l'essai
          </p>

          {/* Badges réassurance */}
          <div className="flex items-center justify-center gap-6 pt-1">
            <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
              <Shield className="h-4 w-4" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
              <RotateCcw className="h-4 w-4" />
              <span>Sans engagement</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-xs text-gray-400">
              <X className="h-4 w-4" />
              <span>Résiliable en 1 clic</span>
            </div>
          </div>
        </div>

        {/* Pied — lien refus discret */}
        <div className="px-7 pb-5 text-center">
          <button
            onClick={handleDecline}
            className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
          >
            Non merci, continuer en compte gratuit
          </button>
        </div>
      </div>
    </div>
  );
}
