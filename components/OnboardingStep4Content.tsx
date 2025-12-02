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
  prospectId?: string;
  firstName: string;
  lastName: string;
  email: string;
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
      prospectId: searchParams.get("prospectId") || undefined,
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      email: searchParams.get("email") || "",
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
      // TODO: Intégrer le vrai paiement Stripe ici
      // Pour l'instant, on simule un paiement réussi
      console.log("Simulation paiement upsell pour:", paymentData);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mettre à jour Firebase avec l'upsell
      if (prospectData.prospectId) {
        console.log('Mise à jour Firebase pour:', prospectData.prospectId);
        const firebaseResponse = await fetch('/api/update-artisan-upsell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prospectId: prospectData.prospectId,
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
        console.error('Pas de prospectId pour la mise à jour Firebase');
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
    <div className="bg-gray-50">
      {/* Banner offre exclusive - fixe au-dessus de tout */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-orange-800 font-medium flex items-center justify-center space-x-2">
            <span className="text-lg">🎁</span>
            <span>Offre spéciale réservée à votre inscription — disponible uniquement maintenant</span>
          </p>
        </div>
      </div>

      {/* Header identique à Step 3 */}
      <header className="bg-white border-b shadow-sm" style={{ marginTop: '52px' }}>
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
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {prospectData.firstName} {prospectData.lastName}
              </p>
              <p className="text-xs text-gray-500">{prospectData.email}</p>
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
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Votre site internet professionnel complet pour 69 € au lieu de 299 €</h2>
                <p className="text-sm text-gray-600 mb-6">Donnez immédiatement une image sérieuse et crédible à votre entreprise, augmentez vos demandes et démarquez-vous dans votre secteur.</p>
                
                {/* Vidéo du site livré */}
                <div className="mb-6">
                  <div className="relative w-full rounded-lg shadow-md overflow-hidden">
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full aspect-video object-cover"
                    >
                      <source src="/video/ecran.mp4" type="video/mp4" />
                      {/* Fallback si la vidéo ne charge pas */}
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <p className="text-gray-600">Aperçu : Site artisan professionnel</p>
                      </div>
                    </video>
                    
                    {/* Texte superposé en bas de la vidéo */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent p-4">
                      <p className="text-base text-white text-center font-medium">
                        Aperçu du type de site que vous allez recevoir
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Avantages site */}
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="text-gray-600 text-sm font-medium mb-3">Votre site inclut :</h3>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Nom de domaine .fr offert</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Site professionnel optimisé Google Local — visible dans votre zone</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Image sérieuse et crédible pour attirer plus de demandes</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Site livré en 72h, prêt à l'emploi</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700">Compatible mobile & ultra rapide</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prix */}
                  <div className="pb-4 border-b border-gray-100">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">Prix :</h3>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="text-gray-500 line-through text-xs">299 €</span>
                        <span className="font-bold text-green-600 text-lg ml-2">→ 69 €</span>
                        <span className="text-gray-600 text-xs ml-1">(paiement unique)</span>
                      </p>
                      <p className="text-xs font-bold text-green-700 mt-1">🎁 Offre réservée uniquement à votre inscription — non proposée plus tard</p>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* Paiement mobile */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Lock className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Paiement sécurisé</h2>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Numéro de carte - gros et clair */}
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

                  {/* Bouton énorme */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full text-xl py-6 font-bold bg-green-700 hover:bg-green-800 text-white flex items-center justify-center space-x-3"
                    style={{backgroundColor: '#16a34a'}}
                  >
                    <span>{isProcessing ? "TRAITEMENT EN COURS..." : "👉 Obtenir mon site professionnel maintenant – 69 €"}</span>
                    {!isProcessing && <ArrowRight className="h-6 w-6" />}
                  </Button>

                  {/* Micro-ligne rassurante */}
                  <div className="text-center mt-3 space-y-1">
                    <p className="text-xs text-gray-500">
                      Paiement unique — aucun abonnement ajouté à votre formule.
                    </p>
                    <p className="text-xs text-gray-500">
                      Livré sous 72h – garantie satisfaction
                    </p>
                  </div>

                  {/* Badges sécurité */}
                  <PaymentSecurityBadges />
                  

                  {/* Lien de refus discret */}
                  <div className="mt-6 text-center">
                    <a 
                      href="/onboarding/success" 
                      className="text-xs hover:underline"
                      style={{ color: '#9CA3AF' }}
                    >
                      Non merci, je ne souhaite pas de site professionnel
                    </a>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Votre site internet professionnel complet pour 69 € au lieu de 299 €</h2>
                <p className="text-base text-gray-600 mb-8">Donnez immédiatement une image sérieuse et crédible à votre entreprise, augmentez vos demandes et démarquez-vous dans votre secteur.</p>
                
                {/* Vidéo du site livré */}
                <div className="mb-8">
                  <div className="relative w-full rounded-lg shadow-md overflow-hidden">
                    <video 
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                      className="w-full aspect-video object-cover"
                    >
                      <source src="/video/ecran.mp4" type="video/mp4" />
                      {/* Fallback si la vidéo ne charge pas */}
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <p className="text-gray-600">Aperçu : Site artisan professionnel</p>
                      </div>
                    </video>
                    
                    {/* Texte superposé en bas de la vidéo */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent p-6">
                      <p className="text-lg text-white text-center font-medium">
                        Aperçu du type de site que vous allez recevoir
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Avantages site */}
                  <div className="pb-6 border-b border-gray-100">
                    <h3 className="text-gray-600 text-base font-medium mb-4">Votre site inclut :</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Nom de domaine .fr offert (valeur 12€/an)</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Site professionnel optimisé Google Local — visible dans votre zone</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Image sérieuse et crédible pour attirer plus de demandes</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Site livré en 72h, prêt à l'emploi</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Compatible mobile & ultra rapide</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prix */}
                  <div className=" border-gray-100">
                    <h3 className="text-gray-600 text-base font-medium mb-3">Prix :</h3>
                    <div className="space-y-2">
                      <p className="text-base">
                        <span className="text-gray-500 line-through text-sm">299 €</span>
                        <span className="font-bold text-green-600 text-xl ml-3">→ 69 €</span>
                        <span className="text-gray-600 text-sm ml-2">(paiement unique)</span>
                      </p>
                      <p className="text-sm font-bold text-green-700 mt-1">🎁 Offre réservée uniquement à votre inscription — non proposée plus tard</p>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* Colonne droite - Paiement */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <Lock className="h-6 w-6 text-green-600" />
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

                  {/* Bouton énorme */}
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full text-2xl py-8 font-bold bg-green-700 hover:bg-green-800 text-white flex items-center justify-center space-x-4 rounded-lg"
                    style={{backgroundColor: '#16a34a'}}
                  >
                    <span>{isProcessing ? "TRAITEMENT EN COURS..." : "Obtenir mon site – 69 €"}</span>
                    {!isProcessing && <ArrowRight className="h-7 w-7" />}
                  </Button>

                  {/* Micro-ligne rassurante */}
                  <div className="text-center mt-4 space-y-1">
                    <p className="text-sm text-gray-500">
                      Paiement unique — aucun abonnement ajouté à votre formule.
                    </p>
                    <p className="text-sm text-gray-500">
                      Livré sous 72h – garantie satisfaction
                    </p>
                  </div>

                  {/* Badges sécurité */}
                  <PaymentSecurityBadges />
                  

                  {/* Lien de refus discret */}
                  <div className="mt-6 text-center">
                    <a 
                      href="/onboarding/success" 
                      className="text-sm hover:underline"
                      style={{ color: '#9CA3AF' }}
                    >
                      Non merci, je ne souhaite pas de site professionnel
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
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
