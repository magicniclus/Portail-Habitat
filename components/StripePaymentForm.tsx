"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShoppingCart, AlertCircle, CheckCircle } from "lucide-react";

// Charger Stripe (remplace par ta clé publique)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  leadId?: string;
  artisanId?: string;
  artisanName?: string;
  artisanEmail?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
  acceptCGV: boolean;
  onCGVChange?: (accepted: boolean) => void;
}

function PaymentForm({ amount, leadId, artisanId, artisanName, artisanEmail, onSuccess, onError, disabled, acceptCGV, onCGVChange }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !acceptCGV) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setPaymentError("Erreur lors du chargement du formulaire de paiement");
      setIsProcessing(false);
      return;
    }

    try {
      // Créer l'intention de paiement
      const response = await fetch('/api/create-marketplace-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          artisanId,
          artisanName,
          artisanEmail,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.error);
      }

      const { clientSecret } = responseData;

      if (!clientSecret) {
        throw new Error('Aucun clientSecret reçu du serveur');
      }

      // Confirmer le paiement
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirmer l'achat côté serveur
        const confirmResponse = await fetch('/api/confirm-marketplace-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (!confirmResponse.ok) {
          const confirmError = await confirmResponse.json();
          throw new Error(confirmError.error || 'Erreur lors de la confirmation de l\'achat');
        }

        const confirmData = await confirmResponse.json();
        console.log('Achat confirmé:', confirmData);

        onSuccess();
      }
    } catch (err: any) {
      console.error('Erreur de paiement:', err);
      setPaymentError(err.message || 'Une erreur est survenue lors du paiement');
      onError(err.message || 'Erreur de paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Numéro de carte - Ligne 1 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Numéro de carte
        </label>
        <div className="p-4 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
          <CardNumberElement options={elementOptions} />
        </div>
      </div>

      {/* Expiration + CVV - Ligne 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date d'expiration
          </label>
          <div className="p-4 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            CVV
          </label>
          <div className="p-4 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Cartes acceptées : Visa, Mastercard, American Express
      </p>

      {/* Erreur de paiement */}
      {paymentError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {paymentError}
          </AlertDescription>
        </Alert>
      )}

      {/* Récapitulatif */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Montant :</span>
          <span className="font-semibold text-lg text-orange-600">{amount}€</span>
        </div>
      </div>

      {/* CGV juste au-dessus du bouton */}
      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
        <input
          type="checkbox"
          id="cgv-stripe"
          checked={acceptCGV}
          onChange={(e) => onCGVChange?.(e.target.checked)}
          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          required
        />
        <label htmlFor="cgv-stripe" className="text-sm text-gray-700">
          J'accepte les{" "}
          <a href="/conditions-generales" target="_blank" className="text-orange-600 hover:text-orange-700 underline">
            Conditions Générales de Vente
          </a>{" "}
          et confirme vouloir accéder aux coordonnées de ce client.
        </label>
      </div>

      {!acceptCGV && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Vous devez accepter les conditions générales pour continuer.
          </AlertDescription>
        </Alert>
      )}

      {/* Bouton de paiement */}
      <Button
        type="submit"
        disabled={!stripe || isProcessing || disabled || !acceptCGV}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          `Payer ${amount}€`
        )}
      </Button>

      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
        <ShoppingCart className="h-3 w-3" />
        <span>Paiement 100% sécurisé par Stripe</span>
      </div>
    </form>
  );
}

interface StripePaymentFormProps {
  amount: number;
  leadId?: string;
  artisanId?: string;
  artisanName?: string;
  artisanEmail?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
  acceptCGV: boolean;
  onCGVChange?: (accepted: boolean) => void;
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
