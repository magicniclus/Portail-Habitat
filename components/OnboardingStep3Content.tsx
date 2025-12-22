"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, CheckCircle, Lock, Shield, ArrowRight, CreditCard, Smartphone, Bell, Star } from "lucide-react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Footer from "@/components/Footer";

interface ProspectData {
  prospectId?: string;
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

export default function OnboardingStep3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [prospectData, setProspectData] = useState<ProspectData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    profession: "",
    step: "3"
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    postalCode: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Composant Carousel avec autoplay
  const AutoplayCarousel = ({ children, className, opts }: any) => {
    const [api, setApi] = useState<any>();
    
    useEffect(() => {
      if (!api) return;
      
      const interval = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, 4000);
      
      return () => clearInterval(interval);
    }, [api]);
    
    return (
      <Carousel className={className} opts={opts} setApi={setApi}>
        {children}
      </Carousel>
    );
  };

  // Charger les données depuis les paramètres URL
  useEffect(() => {
    const data: ProspectData = {
      prospectId: searchParams.get("prospectId") || undefined,
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      postalCode: searchParams.get("postalCode") || "",
      profession: searchParams.get("profession") || "",
      step: "3",
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
          <Shield className="h-4 w-4 text-orange-600" />
          <span className="text-xs text-gray-600 font-medium">SSL 256-bit</span>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-orange-600" />
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
      // TODO: Intégrer le vrai paiement Stripe ici
      // Pour l'instant, on simule un paiement réussi
      console.log("Simulation paiement pour:", paymentData);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Seulement après un paiement réussi, mettre à jour le prospect
      if (prospectData.prospectId) {
        const prospectRef = doc(db, "prospects", prospectData.prospectId);
        await updateDoc(prospectRef, {
          funnelStep: "paid",
          paidAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Créer le compte artisan après paiement réussi
      const response = await fetch('/api/create-artisan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospectId: prospectData.prospectId,
          firstName: prospectData.firstName,
          lastName: prospectData.lastName,
          email: prospectData.email,
          phone: prospectData.phone,
          postalCode: prospectData.postalCode,
          profession: prospectData.profession,
          selectedCity: prospectData.selectedCity,
          selectedZoneRadius: prospectData.selectedZoneRadius,
          coordinates: prospectData.coordinates
        }),
      });

      let artisanId = '';
      if (response.ok) {
        const result = await response.json();
        artisanId = result.artisanId;
        console.log('Compte artisan créé avec succès, ID:', artisanId);
      } else {
        console.error('Erreur lors de la création du compte artisan');
      }

      // Créer l'URL pour la page de fin (success) avec l'artisanId
      const params = new URLSearchParams({
        artisanId: artisanId || "",
        firstName: prospectData.firstName,
        lastName: prospectData.lastName,
        email: prospectData.email,
        phone: prospectData.phone,
        postalCode: prospectData.postalCode,
        profession: prospectData.profession,
        city: prospectData.selectedCity || "",
        selectedZoneRadius: prospectData.selectedZoneRadius?.toString() || "30"
      });

      // Rediriger vers la page de fin (success) au lieu de step4
      router.push(`/onboarding/success?${params.toString()}`);
      
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
      alert("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header identique à Step 2 */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo.png"
                alt="Portail Habitat"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <span className="text-sm text-gray-500">Étape 3/3</span>
                <Progress value={100} className="w-32 mt-1" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {prospectData.firstName} {prospectData.lastName}
              </p>
              <p className="text-xs text-gray-500 lg:hidden">Étape 3/3</p>
              <p className="text-xs text-gray-500 hidden lg:block">{prospectData.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="lg:min-h-[calc(100vh-170px)] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Layout mobile : 1 colonne */}
          <div className="lg:hidden space-y-6">
            
            {/* Récapitulatif mobile */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4 md:p-6">
                {/* Titre court mobile */}
                <h2 className="text-xl font-bold text-gray-900 md:hidden">Votre fiche est prête</h2>
                {/* Titre desktop inchangé */}
                <h2 className="text-xl font-bold text-gray-900 hidden md:block">Vous êtes à 30 secondes d'être visible et de recevoir vos premières demandes</h2>
                
                {/* Texte court mobile */}
                <p className="text-sm text-gray-600 mb-4 md:mb-6 md:hidden">Les particuliers peuvent vous contacter dès l'activation.</p>
                {/* Texte desktop inchangé */}
                <p className="text-sm text-gray-600 mb-6 hidden md:block">Votre fiche est prête. Dès l'activation, vous apparaissez dans votre zone et recevez gratuitement les demandes des particuliers qui vous contactent directement. L'accès aux demandes ciblées à 35 € est entièrement facultatif.</p>
                
                <div className="space-y-4 md:space-y-6">
                  {/* Zone couverte - Fusion sur une ligne mobile */}
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    {/* Version mobile compacte */}
                    <p className="font-semibold text-sm md:hidden">📍 {prospectData.selectedCity} – {getProfessionLabel(prospectData.profession)} – {prospectData.selectedZoneRadius} km</p>
                    {/* Version desktop inchangée */}
                    <div className="hidden md:block">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Zone couverte :</h3>
                      <p className="font-semibold text-sm">{prospectData.selectedCity} + {prospectData.selectedZoneRadius} km — {getProfessionLabel(prospectData.profession)}</p>
                    </div>
                  </div>
                  
                  {/* Demandes estimées - Masqué sur mobile */}
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3 hidden md:block">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Demandes estimées dans votre secteur :</h3>
                    <div>
                      <p className="font-semibold text-sm">Des demandes de devis sont déjà générées chaque mois dans votre zone et votre métier</p>
                      <p className="text-xs text-gray-500 mt-1">Le volume dépend de la demande locale et de votre réactivité.</p>
                    </div>
                  </div>
                  
                  {/* Vos avantages inclus */}
                  <div className="pb-4 border-b border-gray-100 border-l-4 border-l-orange-500 pl-3">
                    <h3 className="text-gray-600 text-sm font-medium mb-3">Vos avantages inclus :</h3>
                    <div className="space-y-2">
                      {/* 3 premiers avantages visibles sur mobile */}
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700"><span className="md:hidden">Visibilité locale prioritaire (dans votre métier)</span><span className="hidden md:inline">Visibilité locale prioritaire</span></span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700"><span className="md:hidden">Demandes directes de particuliers (sans intermédiaire)</span><span className="hidden md:inline">Demandes directes de particuliers</span></span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Sans engagement – résiliable à tout moment</span>
                      </div>
                      {/* Avantages supplémentaires masqués sur mobile */}
                      <div className="flex items-start space-x-2 hidden md:flex">
                        <CheckCircle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Accès aux chantiers ciblés uniquement si vous le souhaitez</span>
                      </div>
                      <div className="flex items-start space-x-2 hidden md:flex">
                        <CheckCircle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Accès aux demandes ciblées — vous restez libre de répondre ou non</span>
                      </div>
                      <div className="flex items-start space-x-2 hidden md:flex">
                        <CheckCircle className="h-3 w-3 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Application mobile pour recevoir les demandes en temps réel</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Témoignages - Masqués sur mobile */}
                  <section className="mt-6 pb-4 border-b border-gray-100 hidden md:block">
                    <h3 className="text-gray-600 text-sm font-medium mb-3">
                      Ce que disent nos artisans
                    </h3>

                    <AutoplayCarousel 
                      className="w-full"
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                    >
                      <CarouselContent>
                        <CarouselItem>
                          <Card className="border border-gray-100 shadow-sm bg-gray-50/50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-bold">J</span>
                                </div>
                                <div className="flex gap-0.5">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                              <p className="text-xs text-gray-800">
                                "Premier chantier signé en 12 jours, abonnement déjà rentabilisé."
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                Julien — Plombier à Toulouse
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>

                        <CarouselItem>
                          <Card className="border border-gray-100 shadow-sm bg-gray-50/50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-bold">S</span>
                                </div>
                                <div className="flex gap-0.5">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                              <p className="text-xs text-gray-800">
                                "Je choisis uniquement les demandes qui m'intéressent, je ne subis plus les prospects."
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                Sarah — Électricienne à Bordeaux
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>

                        <CarouselItem>
                          <Card className="border border-gray-100 shadow-sm bg-gray-50/50">
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-bold">O</span>
                                </div>
                                <div className="flex gap-0.5">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                              <p className="text-xs text-gray-800">
                                "J'ai testé un mois sans risque, maintenant je garde l'abonnement en continu."
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                Omar — Peintre à Lille
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      </CarouselContent>
                    </AutoplayCarousel>
                  </section>
                  
                  {/* Abonnement - Masqué sur mobile (info dans le bouton) */}
                  <div className="pb-4 border-b border-gray-100 hidden md:block">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Abonnement :</h3>
                    <p className="font-semibold text-orange-600 text-sm">Activation immédiate – 69 €/mois, sans engagement</p>
                  </div>
                  
                  {/* Garantie satisfaction - Masqué sur mobile */}
                  <div className="pb-4 border-b border-gray-100 hidden md:block">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Garantie satisfaction :</h3>
                    <p className="font-semibold text-orange-600 text-sm">Sans engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paiement mobile */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Lock className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Paiement sécurisé</h2>
                </div>

                <form onSubmit={handlePayment} className="space-y-6 md:space-y-6">
                  {/* Numéro de carte - gros et clair */}
                  <div className="space-y-2 md:space-y-2">
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
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
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
                  <div className="space-y-2 md:space-y-2">
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
                  <div className="space-y-2 md:space-y-2">
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

                  {/* Bouton desktop inchangé */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full text-xl py-6 font-bold bg-orange-700 hover:bg-orange-800 text-white md:flex hidden items-center justify-center space-x-3"
                  >
                    <span>{isProcessing ? "TRAITEMENT EN COURS..." : "Recevoir des demandes – 69 €"}</span>
                    {!isProcessing && <ArrowRight className="h-6 w-6" />}
                  </Button>

                  {/* Bouton mobile optimisé */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full text-lg py-6 font-bold bg-orange-700 hover:bg-orange-800 text-white flex md:hidden items-center justify-center"
                  >
                    {isProcessing ? (
                      <span>TRAITEMENT...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Activer ma visibilité –</span>
                        <span className="font-extrabold">69 €</span>
                        <ArrowRight className="h-6 w-6 ml-1" />
                      </span>
                    )}
                  </Button>
                  
                  {/* Réassurance compacte - Mobile uniquement */}
                  <div className="text-center space-y-1.5 mt-2.5 md:hidden">
                    <p className="text-xs text-gray-600">🔒 Paiement sécurisé • Résiliation en 1 clic</p>
                    <p className="text-xs text-gray-500">Déjà utilisé par des artisans dans votre zone</p>
                  </div>

                  {/* Rassurance desktop inchangée */}
                  <div className="text-center mt-4 hidden md:block">
                    <p className="text-sm font-medium text-gray-700">🔒 Essai sans risque — résiliation en 1 clic depuis votre espace</p>
                  </div>

                  {/* Textes sous le bouton - Desktop uniquement */}
                  <div className="text-center space-y-1 mt-4 md:block hidden">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                      <span>Résiliation en 1 clic</span>
                      <span>•</span>
                      <span>Aucun engagement</span>
                      <span>•</span>
                      <span>Paiement 100 % sécurisé</span>
                    </div>
                  </div>

                  {/* Badges sécurité - Desktop uniquement */}
                  <div className="hidden md:block">
                    <PaymentSecurityBadges />
                  </div>
                  
                  {/* Texte de réassurance final - Desktop uniquement */}
                  <div className="mt-6 pt-4 border-t border-gray-100 hidden md:block">
                    <p className="text-xs text-gray-400 leading-relaxed md:text-base text-center">
                      Vous ne payez pas pour des promesses, mais pour être visible auprès de particuliers qui cherchent activement un artisan comme vous.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Layout desktop : 2 colonnes 50/50 */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
            
            {/* Colonne gauche - Récapitulatif */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Vous êtes à 30 secondes d'être visible et de recevoir vos premières demandes</h2>
                <p className="text-base text-gray-600 mb-8">Votre fiche est prête. Dès l'activation, vous apparaissez dans votre zone et recevez gratuitement les demandes des particuliers qui vous contactent directement.</p>
                
                <div className="space-y-8">
                  {/* Zone couverte */}
                  <div className="pb-6 border-b border-gray-100 border-l-4 border-l-orange-500 pl-4">
                    <h3 className="text-gray-600 text-base font-medium mb-3">Zone couverte :</h3>
                    <p className="font-semibold text-base">{prospectData.selectedCity} + {prospectData.selectedZoneRadius} km — {getProfessionLabel(prospectData.profession)}</p>
                  </div>
                  
                  {/* Demandes estimées */}
                  <div className="pb-6 border-b border-gray-100 border-l-4 border-l-orange-500 pl-4">
                    <h3 className="text-gray-600 text-base font-medium mb-3">Demandes estimées dans votre secteur :</h3>
                    <div>
                      <p className="font-semibold text-base">Des demandes de devis sont déjà générées chaque mois dans votre zone et votre métier</p>
                      <p className="text-sm text-gray-500 mt-1">Le volume dépend de la demande locale et de votre réactivité.</p>
                    </div>
                  </div>
                  
                  {/* Vos avantages inclus */}
                  <div className="pb-6 border-b border-gray-100 border-l-4 border-l-orange-500 pl-4">
                    <h3 className="text-gray-600 text-base font-medium mb-4">Vos avantages inclus :</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Visibilité prioritaire sur votre métier et votre ville</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Demandes clients GRATUITES quand on vous contacte depuis votre fiche</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Accès aux chantiers ciblés uniquement si vous le souhaitez</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Accès aux demandes ciblées — vous restez libre de répondre ou non</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Sans engagement, résiliable à tout moment</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Application mobile pour recevoir les demandes en temps réel</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Témoignages */}
                  <section className="mt-8">

                    <AutoplayCarousel 
                      className="w-full max-w-md"
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                    >
                      <CarouselContent>
                        <CarouselItem>
                          <Card className="border border-gray-100 shadow-sm bg-gray-50/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-sm font-bold">J</span>
                                </div>
                                <div className="flex gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-800">
                                "Premier chantier signé en 12 jours, abonnement déjà rentabilisé."
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                Julien — Plombier à Toulouse
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>

                        <CarouselItem>
                          <Card className="border border-gray-100 shadow-sm bg-gray-50/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-sm font-bold">S</span>
                                </div>
                                <div className="flex gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-800">
                                "Je choisis uniquement les demandes qui m'intéressent, je ne subis plus les prospects."
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                Sarah — Électricienne à Bordeaux
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>

                        <CarouselItem>
                          <Card className="border border-gray-100 shadow-sm bg-gray-50/50">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-sm font-bold">O</span>
                                </div>
                                <div className="flex gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                              </div>
                              <p className="text-sm text-gray-800">
                                "J'ai testé un mois sans risque, maintenant je garde l'abonnement en continu."
                              </p>
                              <p className="mt-2 text-xs text-gray-500">
                                Omar — Peintre à Lille
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      </CarouselContent>
                    </AutoplayCarousel>
                  </section>
                  
                </div>
              </CardContent>
            </Card>

            {/* Colonne droite - Paiement */}
            <div className="sticky top-20 max-h-[calc(100vh-5rem)]">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <Lock className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Paiement sécurisé</h2>
                </div>

                <form onSubmit={handlePayment} className="space-y-8">
                  {/* Numéro de carte - gros et clair */}
                  <div className="space-y-3">
                    <Label htmlFor="cardNumber-desktop" className="text-lg font-medium">Numéro de carte</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber-desktop"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({...paymentData, cardNumber: formatCardNumber(e.target.value)})}
                        maxLength={19}
                        className="text-xl py-6 px-6 pr-20 border-2 rounded-lg"
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <CardLogo type={getCardType(paymentData.cardNumber)} className="h-9 w-14" />
                      </div>
                    </div>
                  </div>

                  {/* Date d'expiration + CVV */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="expiryDate-desktop" className="text-lg font-medium">Date d'expiration</Label>
                      <Input
                        id="expiryDate-desktop"
                        placeholder="MM/AA"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({...paymentData, expiryDate: formatExpiryDate(e.target.value)})}
                        maxLength={5}
                        className="text-xl py-6 px-6 border-2 rounded-lg"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="cvv-desktop" className="text-lg font-medium">CVV</Label>
                      <Input
                        id="cvv-desktop"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                        maxLength={3}
                        className="text-xl py-6 px-6 border-2 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Nom sur la carte */}
                  <div className="space-y-3">
                    <Label htmlFor="cardholderName-desktop" className="text-lg font-medium">Nom sur la carte</Label>
                    <Input
                      id="cardholderName-desktop"
                      placeholder="Prénom Nom"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                      className="text-xl py-6 px-6 border-2 rounded-lg"
                      required
                    />
                  </div>

                  {/* Code postal */}
                  <div className="space-y-3">
                    <Label htmlFor="postalCode-desktop" className="text-lg font-medium">Code postal</Label>
                    <Input
                      id="postalCode-desktop"
                      placeholder="75000"
                      value={paymentData.postalCode}
                      onChange={(e) => setPaymentData({...paymentData, postalCode: e.target.value.replace(/\D/g, '').slice(0, 5)})}
                      maxLength={5}
                      className="text-xl py-6 px-6 border-2 rounded-lg"
                      required
                    />
                  </div>

                  {/* Bouton desktop */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full text-2xl py-8 font-bold bg-orange-700 hover:bg-orange-800 text-white hidden md:flex items-center justify-center space-x-4 rounded-lg"
                  >
                    <span>{isProcessing ? "TRAITEMENT EN COURS..." : "Activer ma visibilité maintenant – 69 €"}</span>
                    {!isProcessing && <ArrowRight className="h-7 w-7" />}
                  </Button>

                  {/* Bouton mobile */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full text-2xl py-8 font-bold bg-orange-700 hover:bg-orange-800 text-white flex md:hidden items-center justify-center space-x-4 rounded-lg"
                  >
                    <span>{isProcessing ? "TRAITEMENT EN COURS..." : "Mes Demandes – 69 €"}</span>
                    {!isProcessing && <ArrowRight className="h-7 w-7" />}
                  </Button>

                  {/* Texte de réassurance sous le bouton */}
                  <div className="text-center mt-4">
                    <p className="text-sm font-medium text-gray-700">🔒 Essai sans risque — résiliation en 1 clic depuis votre espace</p>
                  </div>

                  {/* Textes sous le bouton */}
                  <div className="text-center space-y-2 mt-6">
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                      <span>Résiliation en 1 clic</span>
                      <span>•</span>
                      <span>Aucun engagement</span>
                      <span>•</span>
                      <span>Paiement 100 % sécurisé</span>
                    </div>
                  </div>

                  {/* Badges sécurité */}
                  <PaymentSecurityBadges />
                  
                  {/* Texte de réassurance final */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Vous ne payez pas pour des promesses, mais pour être visible auprès de particuliers qui cherchent activement un artisan comme vous.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simple comme Step 2 */}
      <footer className="bg-gray-900 text-white py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300">
              © 2025 Portail Habitat. Tous droits réservés.
            </p>
            <a href="/conditions-generales" className="text-sm text-gray-300 hover:text-white">
              Conditions générales
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
