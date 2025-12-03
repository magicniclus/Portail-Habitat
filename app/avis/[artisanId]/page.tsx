"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Artisan {
  id: string;
  nom: string;
  profession: string;
  ville: string;
  logoUrl?: string;
}

export default function AvisPage() {
  const params = useParams();
  const artisanId = params.artisanId as string;
  
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const artisanDoc = await getDoc(doc(db, 'artisans', artisanId));
        if (artisanDoc.exists()) {
          setArtisan({
            id: artisanDoc.id,
            ...artisanDoc.data()
          } as Artisan);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'artisan:', error);
      } finally {
        setLoading(false);
      }
    };

    if (artisanId) {
      fetchArtisan();
    }
  }, [artisanId]);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error message
    setErrorMessage("");
    
    if (rating === 0) {
      setErrorMessage("Veuillez donner une note en cliquant sur les étoiles.");
      return;
    }

    if (!comment.trim()) {
      setErrorMessage("Veuillez laisser un commentaire.");
      return;
    }

    if (!clientName.trim()) {
      setErrorMessage("Veuillez indiquer votre nom.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ajouter l'avis dans la sous-collection reviews
      const reviewsRef = collection(db, 'artisans', artisanId, 'reviews');
      await addDoc(reviewsRef, {
        rating,
        comment: comment.trim(),
        clientName: clientName.trim(),
        createdAt: new Date(),
        displayed: true // Par défaut affiché, l'artisan peut modérer après
      });

      // Mettre à jour les statistiques de l'artisan
      const artisanRef = doc(db, 'artisans', artisanId);
      await updateDoc(artisanRef, {
        reviewCount: increment(1),
        // Note: le calcul de la moyenne se fera côté serveur ou lors de la lecture
        updatedAt: new Date()
      });

      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'avis:', error);
      setErrorMessage('Une erreur est survenue lors de l\'envoi de votre avis. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <h1 className="text-xl font-semibold mb-2">Artisan introuvable</h1>
            <p className="text-gray-600">
              L'artisan que vous cherchez n'existe pas ou n'est plus disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* En-tête avec info artisan */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              {artisan.logoUrl && (
                <img
                  src={artisan.logoUrl}
                  alt={`Logo ${artisan.nom}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{artisan.nom}</h1>
                <p className="text-gray-600">{artisan.profession} • {artisan.ville}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire d'avis ou message de confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isSubmitted ? "Merci pour votre avis !" : "Laissez votre avis"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Votre avis a été publié !
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Merci d'avoir pris le temps de partager votre expérience avec {artisan.nom}.
                  </p>
                  <p className="text-sm text-gray-500">
                    Votre avis aide d'autres clients à faire leur choix et permet à l'artisan d'améliorer ses services.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message d'erreur */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800 font-medium">{errorMessage}</p>
                  </div>
                )}
                
                {/* Note avec étoiles */}
                <div className="text-center space-y-3">
                  <label className="block text-sm font-medium">
                    Quelle note donneriez-vous à {artisan.nom} ?
                  </label>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-colors"
                        disabled={isSubmitting}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600">
                      {rating === 1 && "Très insatisfait"}
                      {rating === 2 && "Insatisfait"}
                      {rating === 3 && "Correct"}
                      {rating === 4 && "Satisfait"}
                      {rating === 5 && "Très satisfait"}
                    </p>
                  )}
                </div>

                {/* Nom du client */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Votre nom ou prénom
                  </label>
                  <Input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Comment souhaitez-vous apparaître ?"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Commentaire */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Votre commentaire
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience avec cet artisan..."
                    className="min-h-[120px] resize-none"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publication en cours...
                    </>
                  ) : (
                    "Publier mon avis"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Portail Habitat</p>
        </div>
      </div>
    </div>
  );
}
