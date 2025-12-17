"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getCoordinatesFromPostalCode, type Coordinates } from "@/lib/geo-utils";

export default function HeroWithForm() {
  const router = useRouter();
  
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
    "Accès gratuit aux demandes – vous décidez lesquelles accepter",
    "Vous choisissez quels chantiers accepter",
    "Aucun engagement — résiliable à tout moment",
    "Activation immédiate",
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
    <section id="onboarding" className="relative py-20 overflow-hidden">
      {/* Vidéo en arrière-plan */}
      <video 
        autoPlay 
        muted 
        loop 
        className="absolute inset-0 w-full h-full object-cover z-10"
      >
        <source src="/video/video.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-20"></div>
      
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


            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recevez des demandes de travaux qualifiées dans votre zone
            </h1>
            
            <p className="text-xl text-gray-100 mb-8">
             Des projets réels issus de demandes locales, triés et accessibles immédiatement
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Vos avantages avec Portail Habitat :
              </h3>
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-orange-400" />
                  </div>
                  <span className="text-gray-100">{renderTextWithBold(advantage)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire droite */}
          <div>
            <Card className="shadow-xl">
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
                      <Label htmlFor="postalCode">Code postal</Label>
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
                      {city && (
                        <p className="text-sm text-green-600 mt-1">
                          📍 {city}
                        </p>
                      )}
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
                        <SelectItem value="carreleur">Carreleur</SelectItem>
                        <SelectItem value="charpentier">Charpentier</SelectItem>
                        <SelectItem value="chauffagiste">Chauffagiste</SelectItem>
                        <SelectItem value="constructeur-maison">Constructeur de maison</SelectItem>
                        <SelectItem value="courtier">Courtier</SelectItem>
                        <SelectItem value="couvreur">Couvreur</SelectItem>
                        <SelectItem value="cuisiniste">Cuisiniste</SelectItem>
                        <SelectItem value="decorateur">Décorateur</SelectItem>
                        <SelectItem value="detailleur">Détailleur</SelectItem>
                        <SelectItem value="diagnostiqueur">Diagnostiqueur immobilier</SelectItem>
                        <SelectItem value="domoticien">Domoticien</SelectItem>
                        <SelectItem value="electricien">Électricien</SelectItem>
                        <SelectItem value="entreprise-generale">Entreprise générale de bâtiment</SelectItem>
                        <SelectItem value="escalieteur">Escalieteur</SelectItem>
                        <SelectItem value="fenetres-installateur">Fenêtres (installateur)</SelectItem>
                        <SelectItem value="geometre">Géomètre</SelectItem>
                        <SelectItem value="installateur-alarmes">Installateur d'alarmes</SelectItem>
                        <SelectItem value="installateur-climatisation">Installateur de climatisation</SelectItem>
                        <SelectItem value="installateur-communication">Installateur de communication & pompe à chaleur</SelectItem>
                        <SelectItem value="installateur-portail">Installateur de portail et clôtures</SelectItem>
                        <SelectItem value="installateur-salle-bain">Installateur de salle de bain</SelectItem>
                        <SelectItem value="installateur-photovoltaique">Installateur Photovoltaïque / Solaire</SelectItem>
                        <SelectItem value="jardinier">Jardinier</SelectItem>
                        <SelectItem value="macon">Maçon</SelectItem>
                        <SelectItem value="maitre-oeuvre">Maître d'œuvre</SelectItem>
                        <SelectItem value="menuisier">Menuisier</SelectItem>
                        <SelectItem value="miroitier-vitrier">Miroitier / Vitrier</SelectItem>
                        <SelectItem value="multiservices">Multiservices</SelectItem>
                        <SelectItem value="parqueteur">Parqueteur</SelectItem>
                        <SelectItem value="paysagiste">Paysagiste</SelectItem>
                        <SelectItem value="peintre">Peintre</SelectItem>
                        <SelectItem value="pisciniste">Pisciniste</SelectItem>
                        <SelectItem value="placoiste">Placoïste</SelectItem>
                        <SelectItem value="platrier">Plâtrier</SelectItem>
                        <SelectItem value="plombier">Plombier</SelectItem>
                        <SelectItem value="ravaleur-facade">Ravaleur de façade / Façadier</SelectItem>
                        <SelectItem value="serrurier">Serrurier</SelectItem>
                        <SelectItem value="solier-moquettiste">Solier Moquettiste</SelectItem>
                        <SelectItem value="storiste">Storiste</SelectItem>
                        <SelectItem value="terrassier">Terrassier</SelectItem>
                        <SelectItem value="verandaliste">Vérandaliste</SelectItem>
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

                  <Button type="submit" className="w-full text-lg py-3 bg-orange-600 hover:bg-orange-700">
                    <span className="hidden sm:inline">Voir les demandes disponibles dans ma zone</span>
                    <span className="sm:hidden">Voir les demandes</span>
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
