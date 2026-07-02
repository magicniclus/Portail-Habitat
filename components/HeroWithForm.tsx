"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getCoordinatesFromPostalCode, type Coordinates } from "@/lib/geo-utils";
import { getMetiers } from "@/lib/metiers";

export default function HeroWithForm() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  
  // Fonction pour scroller vers le formulaire
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // États du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    profession: "",
    acceptedTerms: false
  });

  // États pour la géolocalisation
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const savedData = localStorage.getItem('prospectData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData({
          firstName: parsedData.firstName || "",
          lastName: parsedData.lastName || "",
          email: parsedData.email || "",
          phone: parsedData.phone || "",
          postalCode: parsedData.postalCode || "",
          profession: parsedData.profession || "",
          acceptedTerms: false // Toujours demander de re-accepter les CGV
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données localStorage:", error);
      }
    }
  }, []);

  const advantages = [
    "Demandes locales et réelles",
    "Vous choisissez les chantiers",
    "Accès immédiat",
    "Aucun engagement — résiliable à tout moment",
    "Application mobile pour répondre instantanément"
  ];

  // Fonction pour valider le code postal et récupérer les coordonnées
  const validatePostalCode = async (postalCode: string) => {
    if (postalCode.length === 5 && /^\d{5}$/.test(postalCode)) {
      try {
        console.log(`🌍 Récupération coordonnées pour code postal: ${postalCode}`);
        const result = await getCoordinatesFromPostalCode(postalCode);
        
        if (result) {
          setCity(result.city);
          setCoordinates(result.coordinates);
          console.log(`✅ Coordonnées récupérées:`, result);
        } else {
          setCity("");
          setCoordinates(null);
          console.log(`❌ Aucune coordonnée trouvée pour: ${postalCode}`);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des coordonnées:", error);
        setCity("");
        setCoordinates(null);
      }
    } else {
      setCity("");
      setCoordinates(null);
    }
  };

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // La validation HTML native se charge de vérifier les champs requis
    // Si on arrive ici, c'est que tous les champs sont valides
    
    try {
      // Créer le document prospect dans Firestore
      const prospectData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postalCode: formData.postalCode,
        city: city || "",
        coordinates: coordinates || null,
        profession: formData.profession,
        funnelStep: "step1",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log("📍 Sauvegarde prospect avec coordonnées:", { city, coordinates });

      const docRef = await addDoc(collection(db, "prospects"), prospectData);
      const prospectId = docRef.id;

      // Sauvegarder dans localStorage
      const localStorageData = {
        prospectId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postalCode: formData.postalCode,
        city: city || "",
        coordinates: coordinates || null,
        profession: formData.profession,
        funnelStep: "step1",
        step: "1",
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('prospectData', JSON.stringify(localStorageData));

      // Créer les paramètres d'URL avec l'ID Firebase et l'étape
      const params = new URLSearchParams({
        prospectId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postalCode: formData.postalCode,
        profession: formData.profession,
        step: "1"
      });

      // Rediriger vers la page onboarding step2 avec les paramètres
      router.push(`/onboarding/step2?${params.toString()}`);
      
    } catch (error) {
      console.error("Erreur lors de la création du prospect:", error);
      // Pas d'alert, mais on peut afficher l'erreur dans la console
      // et rediriger quand même avec les données
      const params = new URLSearchParams({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        postalCode: formData.postalCode,
        profession: formData.profession,
        step: "1"
      });
      router.push(`/onboarding/step2?${params.toString()}`);
    }
  };

  // Fonction pour convertir le markdown en JSX avec gras
  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <section id="onboarding" className="relative py-12 md:py-20 overflow-hidden">
      {/* Vidéo en arrière-plan */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
      >
        <source src="/video/video.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay - optimisé mobile pour meilleure lisibilité */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/40 z-20">
        {/* Gradient supplémentaire mobile pour contraste texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 md:hidden"></div>
      </div>
      
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Contenu gauche */}
          <div>
            {/* Badge de confiance */}
            <div className="mb-6">
              <div className="inline-flex items-start px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 max-w-xs sm:max-w-none">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="leading-tight">
                  Plus de&nbsp;<span className="font-bold">3 200 artisans</span>&nbsp;nous font confiance
                </span>
              </div>
            </div>


            {/* Titre mobile optimisé - contraste amélioré */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight drop-shadow-lg md:drop-shadow-none">
              <span className="md:hidden">Recevez des demandes de travaux qualifiées près de chez vous</span>
              <span className="hidden md:block">Recevez dès aujourd'hui des demandes de travaux qualifiées dans votre zone</span>
            </h1>
            
            {/* Sous-titre mobile optimisé - contraste amélioré */}
            <p className="text-base md:text-xl text-white md:text-gray-100 mb-6 md:mb-8 drop-shadow-md md:drop-shadow-none font-medium md:font-normal">
              <span className="md:hidden">Sans engagement – activation immédiate – résiliable à tout moment</span>
              <span className="hidden md:block">Des projets réels issus de demandes locales, triés et accessibles immédiatement</span>
            </p>

            <div className="space-y-2.5 md:space-y-4">
              <h3 className="text-sm md:text-lg font-semibold text-white mb-2.5 md:mb-4 opacity-90 md:opacity-100">
                Vos avantages avec Portail Habitat :
              </h3>
              {advantages.map((advantage, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2.5 md:space-x-3 ${index >= 3 ? 'hidden md:flex' : ''}`}
                >
                  <div className="flex-shrink-0">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />
                  </div>
                  <span className="text-sm md:text-base text-white md:text-gray-100 opacity-90 md:opacity-100">{renderTextWithBold(advantage)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire droite */}
          <div ref={formRef}>
            <Card className="shadow-xl">
              {/* Micro-réassurance mobile */}
              <div className="md:hidden pt-4 px-6 text-center">
                <p className="text-xs text-gray-500">
                  Inscription en 30 secondes — sans engagement
                </p>
              </div>
              
              {/* Ligne de transition desktop */}
              <div className="hidden md:block pt-6 px-6 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Remplissez ce formulaire pour accéder immédiatement aux demandes disponibles dans votre zone.
                </p>
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Inscrivez-vous dès maintenant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input 
                        id="prenom" 
                        placeholder="Votre prénom" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input 
                        id="nom" 
                        placeholder="Votre nom" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre@email.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="06 12 34 56 78" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">
                        Code postal{city && <span className="font-normal text-gray-500 ml-1">({city})</span>}
                      </Label>
                      <Input 
                        id="postalCode" 
                        type="text" 
                        placeholder="75001" 
                        maxLength={5}
                        pattern="[0-9]{5}"
                        value={formData.postalCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                          setFormData({...formData, postalCode: value});
                          if (value.length === 5) {
                            validatePostalCode(value);
                          } else {
                            setCity("");
                            setCoordinates(null);
                          }
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metier">Métier</Label>
                    <Select 
                      value={formData.profession} 
                      onValueChange={(value) => setFormData({...formData, profession: value})}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez votre métier" />
                      </SelectTrigger>
                      <SelectContent>
                        {getMetiers().map((m) => (
                          <SelectItem key={m.slug} value={m.slug}>{m.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Case à cocher CGV */}
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="cgv" 
                      checked={formData.acceptedTerms}
                      onCheckedChange={(checked) => setFormData({...formData, acceptedTerms: !!checked})}
                      required
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="cgv" className="text-xs text-gray-500 leading-4 cursor-pointer block">
                        J'accepte les{" "}
                        <a href="/conditions-generales" className="text-gray-600 hover:text-gray-700 underline">
                          conditions générales d'utilisation
                        </a>
                        {" "}et la{" "}
                        <a href="/politique-de-confidentialite" className="text-gray-600 hover:text-gray-700 underline">
                          politique de confidentialité
                        </a>
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full text-base md:text-lg py-3 bg-orange-600 hover:bg-orange-700">
                    <span className="hidden sm:inline">Accéder aux demandes de ma zone</span>
                    <span className="sm:hidden">Voir les demandes disponibles</span>
                  </Button>

                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600 flex-wrap">
                      <span>Sans engagement</span>
                      <span>•</span>
                      <span>Résiliable à tout moment</span>
                      <span>•</span>
                      <span>Activation immédiate</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
