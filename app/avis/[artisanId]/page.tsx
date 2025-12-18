"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, CheckCircle, Loader2, AlertCircle, Briefcase } from "lucide-react";
import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendReviewNotificationIfAllowed } from '@/lib/notification-service';
import { recomputeArtisanReviewStats } from '@/lib/review-stats';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Artisan {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  profession: string;
  city: string;
  email?: string;
  logoUrl?: string;
}

export default function AvisPage() {
  const params = useParams();
  const router = useRouter();
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
  const [showNameAndComment, setShowNameAndComment] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  // Messages pour les étoiles
  const ratingMessages = {
    1: "Très décevant",
    2: "Décevant", 
    3: "Correct",
    4: "Bien",
    5: "Excellent"
  };

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const artisanDoc = await getDoc(doc(db, 'artisans', artisanId));
        if (artisanDoc.exists()) {
          const data = artisanDoc.data();
          setArtisan({
            id: artisanDoc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            companyName: data.companyName || '',
            profession: data.profession || '',
            city: data.city || '',
            email: data.email || '',
            logoUrl: data.logoUrl
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'artisan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisan();
  }, [artisanId]);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
    setShowNameAndComment(true);
  };

  const handleSubmit = async () => {
    
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
      await recomputeArtisanReviewStats(artisanId);

      const artisanRef = doc(db, 'artisans', artisanId);
      await updateDoc(artisanRef, {
        updatedAt: new Date()
      });

      // Envoyer la notification d'avis à l'artisan (si autorisé par ses préférences)
      try {
        if (artisan) {
          // Si l'artisan n'a pas d'email, on n'essaie pas d'envoyer de notification
          if (!artisan.email) {
            setIsSubmitted(true);
            return;
          }

          const notificationSent = await sendReviewNotificationIfAllowed(artisanId, {
            artisanEmail: artisan.email || '',
            artisanName: artisan.companyName || `${artisan.firstName} ${artisan.lastName}`,
            clientName: clientName.trim(),
            rating: rating,
            comment: comment.trim()
          });

          if (notificationSent) {
            console.log('Email de notification avis envoyé avec succès');
          } else {
            console.log('Email de notification avis non envoyé (préférences ou erreur)');
          }
        }
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email d\'avis:', emailError);
        // On ne fait pas échouer la soumission si l'email échoue
      }

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
    <div className="bg-gray-50">
      <Header />
      
      <main className="min-h-screen container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Une seule grande carte */}
          <Card className="p-8">
            <CardContent className="space-y-8">
              
              {/* Informations artisan */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  {artisan.logoUrl ? (
                    <img
                      src={artisan.logoUrl}
                      alt={`Logo ${artisan.companyName || `${artisan.firstName} ${artisan.lastName}`}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-blue-600" />
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {artisan.companyName || `${artisan.firstName} ${artisan.lastName}`}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    {artisan.profession} • {artisan.city}
                  </p>
                </div>
              </div>

              {/* Contenu conditionnel selon l'état */}
              {isSubmitted ? (
                /* Message de confirmation */
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      Merci pour votre avis !
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Votre avis a été publié et aidera d'autres clients à faire leur choix.
                    </p>
                  </div>
                  
                  {/* Boutons de redirection */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => router.push('/avis')}
                      className="flex-1 sm:flex-none"
                    >
                      Laisser un nouvel avis
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/')}
                      className="flex-1 sm:flex-none"
                    >
                      Retour à l'accueil
                    </Button>
                  </div>
                </div>
              ) : isSubmitting ? (
                /* Loader pendant soumission */
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                  <p className="text-lg text-gray-600">Publication en cours...</p>
                </div>
              ) : (
                /* Formulaire d'avis */
                <>
                  {/* Section notation */}
                  <div className="text-center space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Quelle note donneriez-vous ?
                    </h2>
                    
                    <div className="flex justify-center items-center space-x-4">
                      {/* Étoiles */}
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-all duration-200 hover:scale-110"
                          >
                            <Star
                              className={`h-12 w-12 ${
                                star <= (hoverRating || rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      
                      {/* Message à droite des étoiles */}
                      <div className="text-xl font-medium text-gray-700 min-w-[120px] text-left">
                        {(hoverRating || rating) > 0 && (
                          <span className="animate-fade-in">
                            {ratingMessages[(hoverRating || rating) as keyof typeof ratingMessages]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Champs nom et commentaire (apparaissent après sélection d'étoile) */}
                  {showNameAndComment && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="clientName" className="text-base font-medium">
                            Nom et prénom
                          </Label>
                          <Input
                            id="clientName"
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Votre nom et prénom"
                            className="mt-2 text-base"
                          />
                        </div>

                        <div>
                          <Label htmlFor="comment" className="text-base font-medium">
                            Votre commentaire
                          </Label>
                          <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Partagez votre expérience avec cet artisan..."
                            className="mt-2 min-h-[120px] text-base"
                          />
                        </div>
                      </div>

                      {/* Politique d'avis */}
                      <div className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="policy"
                            checked={policyAccepted}
                            onCheckedChange={(checked) => setPolicyAccepted(checked as boolean)}
                            className="mt-1 w-5 h-5 flex-shrink-0"
                          />
                          <div className="text-sm text-gray-700 leading-relaxed">
                            Je certifie que cet avis reflète ma propre expérience et mon opinion authentique sur ce professionnel. 
                            Je confirme ne pas être un concurrent, ne pas avoir de lien personnel ou professionnel avec cet artisan, 
                            et respecter la <span
                              onClick={() => router.push('/politique-avis')}
                              className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                            >politique d'avis de Portail Habitat</span>.
                          </div>
                        </div>
                      </div>

                      {/* Message d'erreur */}
                      {errorMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                          <p className="text-red-800">{errorMessage}</p>
                        </div>
                      )}

                      {/* Bouton de soumission */}
                      <Button
                        onClick={handleSubmit}
                        className="w-full py-3 text-lg"
                        disabled={!policyAccepted || !clientName.trim() || !comment.trim()}
                      >
                        Publier mon avis
                      </Button>
                    </div>
                  )}
                </>
              )}

            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
