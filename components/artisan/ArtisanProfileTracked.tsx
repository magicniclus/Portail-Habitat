"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  Send,
  Building2
} from "lucide-react";
import { useArtisanTracking, usePhoneTracking, useContactFormTracking } from "@/hooks/useArtisanTracking";

interface ArtisanProfileTrackedProps {
  artisan: {
    id: string;
    companyName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    city: string;
    profession: string;
    description: string;
    averageRating: number;
    reviewCount: number;
    logoUrl?: string;
    coverUrl?: string;
  };
}

export default function ArtisanProfileTracked({ artisan }: ArtisanProfileTrackedProps) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    projectType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracking automatique de la vue de la fiche
  useArtisanTracking({ 
    artisanId: artisan.id, 
    autoTrackView: true 
  });

  // Hook pour le tracking des clics téléphone
  const { handlePhoneClick } = usePhoneTracking(artisan.id);

  // Hook pour le tracking des formulaires
  const { handleFormSubmit } = useContactFormTracking(artisan.id);

  // Gérer l'envoi du formulaire
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Tracker l'envoi du formulaire
      await handleFormSubmit(formData);
      
      // Ici vous pourriez ajouter la logique d'envoi réel du formulaire
      // Par exemple, envoyer un email ou sauvegarder en base
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        projectType: ''
      });
      
      setShowContactForm(false);
      
      // Afficher un message de succès
      alert('Votre message a été envoyé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      alert('Une erreur est survenue lors de l\'envoi du message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header de la fiche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Logo/Avatar */}
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
              {artisan.logoUrl ? (
                <img 
                  src={artisan.logoUrl} 
                  alt={artisan.companyName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-blue-600" />
              )}
            </div>

            {/* Informations principales */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {artisan.companyName}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                {artisan.firstName} {artisan.lastName}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="text-blue-600">
                  {artisan.profession}
                </Badge>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{artisan.city}</span>
                </div>
                {artisan.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{artisan.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({artisan.reviewCount} avis)</span>
                  </div>
                )}
              </div>

              {/* Boutons d'action avec tracking */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => handlePhoneClick(artisan.phone)}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Appeler
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contacter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>À propos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {artisan.description}
          </p>
        </CardContent>
      </Card>

      {/* Formulaire de contact avec tracking */}
      {showContactForm && (
        <Card>
          <CardHeader>
            <CardTitle>Contactez {artisan.companyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de projet
                  </label>
                  <Input
                    type="text"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    placeholder="Ex: Rénovation salle de bain"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez votre projet..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
