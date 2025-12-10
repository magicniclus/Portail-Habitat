"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Clock, 
  Euro, 
  Home,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Shield
} from "lucide-react";
import { 
  getMarketplaceLeads,
  formatPrestationLevel,
  formatTimeline,
  getTimelineColor,
  formatPrice,
  type MarketplaceLead
} from "@/lib/marketplace-data";
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  CardNumberElement,
  CardExpiryElement, 
  CardCvcElement,
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { useAuth } from "../../../../../hooks/useAuth";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  lead: MarketplaceLead;
  artisanId: string;
  artisanName: string;
  artisanEmail: string;
}

function PaymentForm({ lead, artisanId, artisanName, artisanEmail }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [acceptCGV, setAcceptCGV] = useState(false);

  useEffect(() => {
    // Créer l'intention de paiement
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-marketplace-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadId: lead.id,
            artisanId,
            artisanName,
            artisanEmail,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de la création du paiement");
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    };

    createPaymentIntent();
  }, [lead.id, artisanId, artisanName, artisanEmail]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret || !acceptCGV) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setError("Élément de carte non trouvé");
      setIsProcessing(false);
      return;
    }

    try {
      // Confirmer le paiement
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: artisanName,
              email: artisanEmail,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // Confirmer côté serveur
        const confirmResponse = await fetch("/api/confirm-marketplace-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        });

        const confirmData = await confirmResponse.json();

        if (!confirmResponse.ok) {
          throw new Error(confirmData.error || "Erreur lors de la confirmation");
        }

        // Rediriger vers la page de succès
        router.push(`/dashboard/marketplace/success/${lead.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informations de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Numéro de carte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de carte
              </label>
              <div className="p-4 border rounded-lg bg-gray-50">
                <CardNumberElement options={cardElementOptions} />
              </div>
            </div>
            
            {/* Expiration et CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration
                </label>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <CardExpiryElement options={cardElementOptions} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <div className="p-4 border rounded-lg bg-gray-50">
                  <CardCvcElement options={cardElementOptions} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Paiement sécurisé par Stripe</span>
          </div>
        </CardContent>
      </Card>

      {/* Conditions Générales de Vente */}
      <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <input
          type="checkbox"
          id="cgv-purchase"
          checked={acceptCGV}
          onChange={(e) => setAcceptCGV(e.target.checked)}
          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
        />
        <label htmlFor="cgv-purchase" className="text-sm text-gray-700">
          J'accepte les{" "}
          <span className="text-orange-600 underline cursor-pointer">
            Conditions Générales de Vente
          </span>{" "}
          et confirme vouloir accéder aux coordonnées de ce client pour le montant de{" "}
          <span className="font-semibold">{formatPrice(lead.marketplacePrice)}</span>.
        </label>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          asChild
        >
          <Link href="/dashboard/marketplace">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        
        <Button
          type="submit"
          disabled={!stripe || !clientSecret || isProcessing || !acceptCGV}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            "Traitement..."
          ) : (
            <>
              <Euro className="h-4 w-4 mr-2" />
              Payer {formatPrice(lead.marketplacePrice)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function PurchaseLeadPage() {
  const params = useParams();
  const router = useRouter();
  const { user, artisan } = useAuth();
  
  const [lead, setLead] = useState<MarketplaceLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leadId = params.leadId as string;

  useEffect(() => {
    const loadLead = async () => {
      if (!leadId) {
        setError("ID de demande manquant");
        setIsLoading(false);
        return;
      }

      try {
        // Récupérer tous les leads et trouver celui qui correspond
        const leads = await getMarketplaceLeads([], 100);
        const foundLead = leads.find(l => l.id === leadId);
        
        if (!foundLead) {
          setError("Demande introuvable ou non disponible");
        } else {
          setLead(foundLead);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du lead:", err);
        setError("Impossible de charger la demande");
      } finally {
        setIsLoading(false);
      }
    };

    loadLead();
  }, [leadId]);

  // Vérifier l'authentification
  if (!user || !artisan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Vous devez être connecté en tant qu'artisan pour acheter des leads.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error || "Demande introuvable"}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/dashboard/marketplace">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la bourse
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Acheter cette demande
          </h1>
          <p className="text-gray-600">
            Confirmez votre achat pour recevoir les coordonnées complètes du client
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Détails de la demande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{lead.projectType}</span>
                <Badge className={`${getTimelineColor(lead.timeline)}`}>
                  {formatTimeline(lead.timeline)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{lead.city}</span>
                {lead.department && (
                  <span className="text-gray-400">({lead.department})</span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span>
                    {lead.propertyType}
                    {lead.surface && ` • ${lead.surface}m²`}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span>Niveau : {formatPrestationLevel(lead.prestationLevel)}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Estimation du projet</div>
                <div className="text-xl font-bold text-blue-600">
                  {formatPrice(lead.estimationLow)} - {formatPrice(lead.estimationHigh)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Fiabilité : {lead.confidenceScore}%
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Prix de cette demande</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(lead.marketplacePrice)}
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Après paiement, vous recevrez immédiatement les coordonnées complètes 
                  du client et pourrez le contacter directement.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Formulaire de paiement */}
          <div>
            <Elements stripe={stripePromise}>
              <PaymentForm
                lead={lead}
                artisanId={artisan.id}
                artisanName={`${artisan.firstName} ${artisan.lastName}`}
                artisanEmail={artisan.email}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
