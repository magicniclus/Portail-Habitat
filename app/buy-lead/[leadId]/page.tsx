"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Euro, 
  Home,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  CheckCircle,
  Clock,
  User
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  formatPrestationLevel,
  formatTimeline,
  formatPrice
} from "@/lib/marketplace-data";
import InlineLoginForm from "@/components/InlineLoginForm";
import StripePaymentForm from "@/components/StripePaymentForm";

interface EstimationData {
  id: string;
  isPublished: boolean;
  marketplaceStatus: string;
  marketplacePrice: number;
  maxSales: number;
  marketplaceSales: number;
  marketplacePurchases: any[];
  location: {
    city: string;
    department: string;
  };
  project: {
    prestationType: string;
    propertyType: string;
    surface?: number;
    prestationLevel: string;
    timeline: string;
  };
  pricing: {
    estimationLow: number;
    estimationMedium: number;
    estimationHigh: number;
  };
  clientInfo?: {
    firstName: string;
    lastName: string;
  };
}

export default function BuyLeadPage() {
  const params = useParams();
  const router = useRouter();
  const { user, artisan, isLoading: authLoading } = useAuth();
  const [estimation, setEstimation] = useState<EstimationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [acceptCGV, setAcceptCGV] = useState(false);

  const leadId = params.leadId as string;

  // Charger les données de l'estimation
  useEffect(() => {
    const loadEstimation = async () => {
      if (!leadId) return;

      try {
        const docRef = doc(db, "estimations", leadId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Cette demande n'existe pas");
          return;
        }

        const data = docSnap.data() as EstimationData;
        data.id = docSnap.id;

        // Vérifier que la demande est publiée et active
        if (!data.isPublished || data.marketplaceStatus !== 'active') {
          setError("Cette demande n'est plus disponible à l'achat");
          return;
        }

        // Vérifier que la limite n'est pas atteinte
        if (data.marketplaceSales >= data.maxSales) {
          setError("Cette demande a atteint sa limite de ventes");
          return;
        }

        setEstimation(data);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Impossible de charger cette demande");
      } finally {
        setIsLoading(false);
      }
    };

    loadEstimation();
  }, [leadId]);

  // Vérifier si l'artisan a déjà acheté ce lead
  const hasAlreadyPurchased = estimation?.marketplacePurchases?.some(
    (purchase: any) => purchase.artisanId === artisan?.id
  ) || false;

  const handlePaymentSuccess = () => {
    // Rediriger vers la page de succès
    router.push(`/dashboard/marketplace/success/${leadId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error("Erreur de paiement:", error);
    // Optionnel : afficher une notification d'erreur
  };

  // États de chargement
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Erreur de chargement
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Demande non disponible
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/dashboard/marketplace')}>
              Retour à la bourse
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur non connecté - Formulaire de connexion intégré
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <InlineLoginForm 
          title="Connexion requise"
          description="Connectez-vous à votre espace artisan pour voir cette demande et l'acheter"
          redirectAfterLogin={`/buy-lead/${leadId}`}
          showSignupOption={true}
        />
      </div>
    );
  }

  // Utilisateur connecté mais pas artisan
  if (!artisan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Espace artisan requis
            </h1>
            <p className="text-gray-600 mb-6">
              Cette demande est réservée aux artisans. Créez votre espace professionnel pour y accéder.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/devenir-pro')} 
                className="w-full"
                size="lg"
              >
                Devenir artisan partenaire
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                Retour au dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Lead déjà acheté
  if (hasAlreadyPurchased) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Déjà acheté
            </h1>
            <p className="text-gray-600 mb-6">
              Vous avez déjà acheté cette demande. Vous pouvez la retrouver dans vos projets.
            </p>
            <Button onClick={() => router.push('/dashboard/projets')}>
              Voir mes projets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!estimation) return null;

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                Répondre au projet
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {artisan?.firstName} {artisan?.lastName}
              </p>
              <p className="text-xs text-gray-500">{artisan?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="min-h-[calc(100vh-80px)] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Layout mobile : 1 colonne */}
          <div className="lg:hidden space-y-6">
            
            {/* Détails mobile */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Détails du projet</h2>
                
                <div className="space-y-6">
                  {/* Informations principales */}
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Type de prestation :</h3>
                    <p className="font-semibold text-sm">{estimation.project.prestationType}</p>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Localisation :</h3>
                    <p className="font-semibold text-sm">{estimation.location.city}, {estimation.location.department}</p>
                  </div>
                  
                  {estimation.project.surface && (
                    <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Surface :</h3>
                      <p className="font-semibold text-sm">{estimation.project.surface} m²</p>
                    </div>
                  )}
                  
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Budget estimé :</h3>
                    <p className="font-semibold text-orange-600 text-sm">
                      {formatPrice(estimation.pricing.estimationLow)} - {formatPrice(estimation.pricing.estimationHigh)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paiement mobile */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Paiement sécurisé</h2>
                </div>

                {/* Formulaire Stripe avec CGV intégrées */}
                <StripePaymentForm
                  amount={estimation.marketplacePrice}
                  leadId={leadId}
                  artisanId={artisan?.id}
                  artisanName={`${artisan?.firstName} ${artisan?.lastName}`}
                  artisanEmail={artisan?.email}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={isPurchasing}
                  acceptCGV={acceptCGV}
                  onCGVChange={setAcceptCGV}
                />
              </CardContent>
            </Card>
          </div>

          {/* Layout desktop : 2 colonnes */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
            
            {/* Colonne gauche : Détails */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Détails du projet</h2>
                
                <div className="space-y-6">
                  {/* Informations principales */}
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Type de prestation :</h3>
                    <p className="font-semibold text-sm">{estimation.project.prestationType}</p>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Type de bien :</h3>
                    <p className="font-semibold text-sm">{estimation.project.propertyType}</p>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Localisation :</h3>
                    <p className="font-semibold text-sm">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      {estimation.location.city}, {estimation.location.department}
                    </p>
                  </div>
                  
                  {estimation.project.surface && (
                    <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Surface :</h3>
                      <p className="font-semibold text-sm">{estimation.project.surface} m²</p>
                    </div>
                  )}
                  
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Niveau de prestation :</h3>
                    <Badge variant="outline">
                      {formatPrestationLevel(estimation.project.prestationLevel)}
                    </Badge>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Délai souhaité :</h3>
                    <p className="font-semibold text-sm">
                      <Clock className="inline h-4 w-4 mr-1" />
                      {formatTimeline(estimation.project.timeline)}
                    </p>
                  </div>
                  
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Budget estimé :</h3>
                    <p className="font-semibold text-orange-600 text-sm">
                      <TrendingUp className="inline h-4 w-4 mr-1" />
                      {formatPrice(estimation.pricing.estimationLow)} - {formatPrice(estimation.pricing.estimationHigh)}
                    </p>
                  </div>

                  {/* Ce que vous recevrez */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-3">Après l'achat, vous recevrez :</h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-green-800">Nom et prénom du client</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-green-800">Numéro de téléphone</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-green-800">Adresse email</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-green-800">Détails complets du projet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colonne droite : Paiement */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Paiement sécurisé</h2>
                </div>

                {/* Formulaire Stripe avec CGV intégrées */}
                <StripePaymentForm
                  amount={estimation.marketplacePrice}
                  leadId={leadId}
                  artisanId={artisan?.id}
                  artisanName={`${artisan?.firstName} ${artisan?.lastName}`}
                  artisanEmail={artisan?.email}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  disabled={isPurchasing}
                  acceptCGV={acceptCGV}
                  onCGVChange={setAcceptCGV}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
