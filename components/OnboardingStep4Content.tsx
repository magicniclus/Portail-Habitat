"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MapPin, CheckCircle, Lock, Shield, ArrowRight, CreditCard } from "lucide-react";

interface ProspectData {
  artisanId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  profession: string;
  step: string;
  selectedCity?: string;
  coordinates?: { lat: number; lng: number };
  selectedZoneRadius?: number;
}

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  postalCode: string;
}

export default function OnboardingStep4Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [prospectData, setProspectData] = useState<ProspectData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    profession: "",
    step: "4"
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    postalCode: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Charger les données depuis les paramètres URL
  useEffect(() => {
    const data: ProspectData = {
      artisanId: searchParams.get("artisanId") || undefined,
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      postalCode: searchParams.get("postalCode") || "",
      profession: searchParams.get("profession") || "",
      step: "4",
      selectedCity: searchParams.get("city") || "",
      selectedZoneRadius: parseInt(searchParams.get("selectedZoneRadius") || "30")
    };
    
    setProspectData(data);
    
    // Pré-remplir le nom du porteur de carte
    if (data.firstName && data.lastName) {
      setPaymentData(prev => ({
        ...prev,
        cardholderName: `${data.firstName} ${data.lastName}`
      }));
    }
  }, [searchParams]);

  const getProfessionLabel = (profession: string) => {
    const labels: { [key: string]: string } = {
      "plombier": "Plombier",
      "electricien": "Électricien", 
      "chauffagiste": "Chauffagiste",
      "peintre": "Peintre",
      "maconnerie": "Maçon",
      "menuisier": "Menuisier",
      "couvreur": "Couvreur",
      "carreleur": "Carreleur",
      "charpentier": "Charpentier",
      "multiservices": "Multiservices"
    };
    return labels[profession] || profession;
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    return 'unknown';
  };

  const CardLogo = ({ type, className = "h-8 w-12" }: { type: string; className?: string }) => {
    switch (type) {
      case 'visa':
        return (
          <svg className={className} viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="3" fill="#1A1F71"/>
            <text x="20" y="15" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">VISA</text>
          </svg>
        );
      case 'mastercard':
        return (
          <svg className={className} viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="3" fill="white" stroke="#ddd"/>
            <circle cx="15" cy="12" r="6" fill="#EB001B"/>
            <circle cx="25" cy="12" r="6" fill="#F79E1B"/>
            <path d="M20 7.5c1.2 1.2 2 3 2 4.5s-.8 3.3-2 4.5c-1.2-1.2-2-3-2-4.5s.8-3.3 2-4.5z" fill="#FF5F00"/>
          </svg>
        );
      case 'amex':
        return (
          <svg className={className} viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="3" fill="#006FCF"/>
            <text x="20" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">AMERICAN EXPRESS</text>
          </svg>
        );
      case 'discover':
        return (
          <svg className={className} viewBox="0 0 40 24" fill="none">
            <rect width="40" height="24" rx="3" fill="#FF6000"/>
            <text x="20" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">DISCOVER</text>
          </svg>
        );
      default:
        return <CreditCard className={`${className} text-gray-400`} />;
    }
  };

  const PaymentSecurityBadges = () => (
    <div className="flex flex-col items-center space-y-3 mt-6">
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-xs text-gray-600 font-medium">SSL 256-bit</span>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-green-600" />
          <span className="text-xs text-gray-600 font-medium">PCI DSS</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <CardLogo type="visa" className="h-8 w-12" />
        <CardLogo type="mastercard" className="h-8 w-12" />
        <CardLogo type="amex" className="h-8 w-12" />
        <CardLogo type="discover" className="h-8 w-12" />
      </div>
    </div>
  );

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      console.log("Démarrage paiement upsell Stripe pour:", paymentData);
      
      // 1. Créer le PaymentIntent pour l'upsell
      const paymentIntentResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 6900, // 69€ en centimes
          prospectData: {
            ...prospectData,
            artisanId: prospectData.artisanId // Utiliser artisanId au lieu de prospectId
          },
          type: 'upsell_site'
        }),
      });

      if (!paymentIntentResponse.ok) {
        throw new Error('Erreur lors de la création du PaymentIntent');
      }

      const { clientSecret, status, paymentIntentId } = await paymentIntentResponse.json();
      console.log('PaymentIntent créé et confirmé pour upsell:', { paymentIntentId, status });

      // Vérifier que le paiement est réussi
      if (status !== 'succeeded') {
        throw new Error(`Paiement échoué. Status: ${status}`);
      }

      console.log('Paiement upsell réussi:', paymentIntentId);
      
      // Mettre à jour Firebase avec l'upsell
      console.log('🔍 Données artisan complètes:', prospectData);
      
      if (prospectData.artisanId) {
        console.log('Mise à jour Firebase pour artisan:', prospectData.artisanId);
        const firebaseResponse = await fetch('/api/update-artisan-upsell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            artisanId: prospectData.artisanId,
            sitePricePaid: 69,
            hasPremiumSite: true,
            paymentData: paymentData
          }),
        });
        
        const firebaseResult = await firebaseResponse.json();
        console.log('Résultat Firebase:', firebaseResult);
        
        if (!firebaseResponse.ok) {
          console.error('Erreur Firebase:', firebaseResult);
        }
      } else {
        console.error('Pas d\'artisanId pour la mise à jour Firebase');
      }
      
      // Envoyer email de remerciement upsell
      console.log('Envoi email à:', prospectData.email);
      const emailResponse = await fetch('/api/send-upsell-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: prospectData.email,
          firstName: prospectData.firstName,
          lastName: prospectData.lastName,
          profession: prospectData.profession
        }),
      });
      
      const emailResult = await emailResponse.json();
      console.log('Résultat email:', emailResult);
      
      if (!emailResponse.ok) {
        console.error('Erreur email:', emailResult);
      }
      
      // Rediriger vers page de succès avec paramètre upsell
      router.push('/onboarding/success?upsell=true');
      
    } catch (error) {
      console.error("Erreur lors du paiement upsell:", error);
      alert("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section */}
      <section className="w-full bg-[#FFF5EC] border-b border-orange-100 py-10">
        <div className="max-w-5xl mx-auto text-center px-4">
          <p className="text-3xl md:text-4xl font-semibold text-green-600 mb-2">
            🎉 Votre inscription est confirmée !
          </p>
          <p className="text-2xl md:text-3xl font-semibold text-orange-700 leading-tight">
            🎁 Offre spéciale réservée à votre inscription — disponible uniquement maintenant
          </p>
        </div>
      </section>

      {/* Contenu principal en deux colonnes */}
      <section className="max-w-6xl mx-auto py-10 px-4 grid md:grid-cols-2 gap-8">
        
        {/* Colonne gauche - Contenu de l'upsell */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Obtenez maintenant votre site professionnel pour attirer encore plus de clients !
          </h1>

          <p className="text-sm md:text-base text-slate-600 mb-5">
            Option facultative : cette offre ne fait pas partie de votre abonnement.
            Elle vous permet d'obtenir un site professionnel complet pour un tarif
            exceptionnel réservé à votre inscription, afin d'améliorer votre visibilité
            sur Google Local et en dehors de Portail Habitat.
          </p>

          {/* Bandeau prix */}
          <div className="mb-5 rounded-lg bg-green-50 border border-green-100 px-4 py-3 inline-flex items-center gap-2">
            <span className="text-lg font-semibold text-green-700">
              69€ seulement
            </span>
            <span className="text-sm text-slate-400 line-through">
              au lieu de 299€
            </span>
            <span className="text-xs font-medium text-green-700 uppercase tracking-wide">
              Offre spéciale inscription
            </span>
          </div>

          {/* Image du site */}
          <div className="mb-4 rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full aspect-video object-cover"
            >
              <source src="/video/ecran.mp4" type="video/mp4" />
              <div className="flex items-center justify-center h-full bg-gray-200">
                <p className="text-gray-600">Aperçu : Site artisan professionnel</p>
              </div>
            </video>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Aperçu du type de site que vous allez recevoir (adapté à votre métier et votre secteur).
          </p>

          {/* Liste « Votre site inclut » */}
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            Votre site inclut :
          </h2>

          <ul className="space-y-1.5 text-sm text-slate-700 mb-4">
            <li>✅ Nom de domaine .fr offert (valeur 12€/an)</li>
            <li>✅ Site professionnel optimisé Google Local — visible dans votre zone</li>
            <li>✅ Image sérieuse et crédible pour attirer plus de demandes</li>
            <li>✅ Site livré en 72h, prêt à l'emploi</li>
            <li>✅ Compatible mobile & ultra rapide</li>
          </ul>

          {/* Mention sur le lien avec l'abonnement */}
          <p className="text-xs text-slate-500 italic mb-4">
            Ce site reste actif tant que votre abonnement Portail Habitat est en cours.
            En cas de résiliation, le site pourra être désactivé.
          </p>

          {/* Avertissement bas de colonne */}
          <p className="text-xs text-orange-600 font-medium">
            ⚠️ Offre réservée uniquement à votre inscription — cette page ne sera plus
            proposée plus tard.
          </p>
        </div>

        {/* Colonne droite - Paiement sécurisé */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Paiement sécurisé</h2>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Numéro de carte */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-base font-medium">Numéro de carte</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({...paymentData, cardNumber: formatCardNumber(e.target.value)})}
                  maxLength={19}
                  className="text-lg py-4 px-4 pr-16 border-2"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CardLogo type={getCardType(paymentData.cardNumber)} className="h-7 w-11" />
                </div>
              </div>
            </div>

            {/* Date d'expiration + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-base font-medium">Date d'expiration</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/AA"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({...paymentData, expiryDate: formatExpiryDate(e.target.value)})}
                  maxLength={5}
                  className="text-lg py-4 px-4 border-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-base font-medium">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                  maxLength={3}
                  className="text-lg py-4 px-4 border-2"
                  required
                />
              </div>
            </div>

            {/* Nom sur la carte */}
            <div className="space-y-2">
              <Label htmlFor="cardholderName" className="text-base font-medium">Nom sur la carte</Label>
              <Input
                id="cardholderName"
                placeholder="Prénom Nom"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                className="text-lg py-4 px-4 border-2"
                required
              />
            </div>

            {/* Code postal */}
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-base font-medium">Code postal</Label>
              <Input
                id="postalCode"
                placeholder="75000"
                value={paymentData.postalCode}
                onChange={(e) => setPaymentData({...paymentData, postalCode: e.target.value.replace(/\D/g, '').slice(0, 5)})}
                maxLength={5}
                className="text-lg py-4 px-4 border-2"
                required
              />
            </div>

            {/* Bouton principal */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full text-xl py-6 font-semibold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-3"
            >
              <span>{isProcessing ? "TRAITEMENT EN COURS..." : "Obtenir mon site – 69 €"}</span>
              {!isProcessing && <ArrowRight className="h-6 w-6" />}
            </Button>

            {/* Texte rassurant */}
            <div className="text-center mt-2 space-y-1">
              <p className="text-xs text-slate-500">
                Paiement unique — aucun abonnement ajouté à votre formule.
              </p>
              <p className="text-xs text-slate-500">
                Livré sous 72h — garantie satisfaction.
              </p>
            </div>

            {/* Badges sécurité */}
            <PaymentSecurityBadges />

            {/* Lien de refus discret */}
            <div className="mt-6 text-center">
              <a 
                href="/onboarding/success" 
                className="text-sm hover:underline text-slate-400"
              >
                Non merci, je ne souhaite pas de site professionnel
              </a>
            </div>
          </form>
        </div>

      </section>
    </div>
  );
}
