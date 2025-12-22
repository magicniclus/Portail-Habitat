"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  CheckCircle, 
  ArrowLeft, 
  Users, 
  MapPin, 
  Wrench,
  Loader2,
  Info
} from "lucide-react";
import Link from "next/link";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

function ContactArtisanPageContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    codePostal: "",
    ville: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Paramètres de redirection
  const source = searchParams.get('source') || 'direct';
  const artisanId = searchParams.get('artisan') || '';
  const contactType = searchParams.get('type') || 'form';
  const city = searchParams.get('city') || '';
  const profession = searchParams.get('profession') || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || 
        !formData.telephone.trim() || !formData.codePostal.trim()) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Validation code postal
    if (!/^\d{5}$/.test(formData.codePostal)) {
      setErrorMessage("Le code postal doit contenir exactement 5 chiffres.");
      return;
    }

    // Validation email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Veuillez saisir une adresse email valide.");
      return;
    }

    // Validation téléphone
    if (!/^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/.test(formData.telephone.replace(/\s/g, ''))) {
      setErrorMessage("Veuillez saisir un numéro de téléphone français valide.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enregistrer la demande dans une collection générale
      await addDoc(collection(db, 'contact_requests'), {
        // Données client
        clientName: `${formData.prenom} ${formData.nom}`,
        clientEmail: formData.email,
        clientPhone: formData.telephone,
        clientCity: formData.ville || formData.codePostal,
        clientPostalCode: formData.codePostal,
        projectDescription: formData.description,
        
        // Métadonnées de redirection
        source: source,
        originalArtisanId: artisanId,
        contactType: contactType,
        targetCity: city,
        targetProfession: profession,
        
        // Timestamps
        createdAt: new Date(),
        status: 'new',
        
        // Flags
        isFromDemoArtisan: source === 'demo-artisan',
        needsAssignment: true
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setErrorMessage("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPageTitle = () => {
    if (source === 'demo-artisan') {
      return "Contactez nos artisans partenaires";
    }
    return "Demande de devis";
  };

  const getPageDescription = () => {
    if (source === 'demo-artisan') {
      return "Nous allons vous mettre en relation avec des artisans qualifiés de notre réseau.";
    }
    return "Décrivez votre projet et recevez des devis personnalisés.";
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Demande envoyée avec succès !
              </h1>
              
              <p className="text-gray-600 mb-6">
                Votre demande a été transmise à notre équipe. Nous vous mettrons en relation 
                avec des artisans qualifiés dans les plus brefs délais.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Prochaines étapes :</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Analyse de votre demande par notre équipe</li>
                  <li>• Sélection d'artisans qualifiés dans votre région</li>
                  <li>• Mise en relation sous 24-48h</li>
                  <li>• Réception de devis personnalisés</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à l'accueil
                  </Link>
                </Button>
                
                <Button asChild>
                  <Link href="/simulateur">
                    Faire une nouvelle demande
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getPageDescription()}
          </p>
        </div>

        {/* Informations contextuelles */}
        {source === 'demo-artisan' && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">
                    Mise en relation avec notre réseau d'artisans
                  </h3>
                  <p className="text-sm text-orange-800">
                    Vous avez exprimé votre intérêt pour un artisan de notre plateforme. 
                    Nous allons vous mettre en relation avec des professionnels qualifiés 
                    correspondant à vos besoins dans votre région.
                  </p>
                  
                  {(profession || city) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {profession && (
                        <Badge variant="outline" className="bg-white">
                          <Wrench className="h-3 w-3 mr-1" />
                          {profession}
                        </Badge>
                      )}
                      {city && (
                        <Badge variant="outline" className="bg-white">
                          <MapPin className="h-3 w-3 mr-1" />
                          {city}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Vos informations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations personnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <Input
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <Input
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        placeholder="06 12 34 56 78"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Localisation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal *
                      </label>
                      <Input
                        id="codePostal"
                        name="codePostal"
                        value={formData.codePostal}
                        onChange={handleInputChange}
                        placeholder="75001"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <Input
                        id="ville"
                        name="ville"
                        value={formData.ville}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Description du projet */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description de votre projet *
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Décrivez votre projet en détail : type de travaux, surface, délais souhaités, budget approximatif..."
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message d'erreur */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-sm text-red-800">{errorMessage}</p>
                    </div>
                  )}

                  {/* Bouton de soumission */}
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer ma demande
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar informative */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pourquoi nous choisir ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Artisans vérifiés</h4>
                    <p className="text-sm text-gray-600">Tous nos partenaires sont certifiés et assurés</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Devis gratuits</h4>
                    <p className="text-sm text-gray-600">Recevez plusieurs devis sans engagement</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Réponse rapide</h4>
                    <p className="text-sm text-gray-600">Mise en relation sous 24-48h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Notre équipe est là pour vous accompagner dans votre projet.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    Nous contacter
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactArtisanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center gap-3 py-16">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      }
    >
      <ContactArtisanPageContent />
    </Suspense>
  );
}
