"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  User,
  AlertCircle,
  CheckCircle,
  Mail,
  Loader2
} from "lucide-react";
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';

interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  createdAt: any;
  displayed: boolean;
}

interface EmailForm {
  to: string;
  subject: string;
  content: string;
}

const getStarRating = (note: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
      }`}
    />
  ));
};

const getNoteBadge = (note: number) => {
  if (note >= 4) return <Badge className="bg-green-100 text-green-800">Positif</Badge>;
  if (note >= 3) return <Badge className="bg-orange-100 text-orange-800">Neutre</Badge>;
  return <Badge className="bg-red-100 text-red-800">Négatif</Badge>;
};

export default function AvisPage() {
  const [artisanId, setArtisanId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailForm, setEmailForm] = useState<EmailForm>({
    to: "",
    subject: "",
    content: ""
  });
  const [emailMessage, setEmailMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Récupérer l'ID de l'artisan connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const artisansRef = collection(db, 'artisans');
          const q = query(artisansRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const artisanDoc = querySnapshot.docs[0];
            setArtisanId(artisanDoc.id);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'artisan:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Récupérer les avis en temps réel
  useEffect(() => {
    if (!artisanId) return;

    const reviewsRef = collection(db, 'artisans', artisanId, 'reviews');
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const reviewsData: Review[] = [];
      snapshot.forEach((doc) => {
        reviewsData.push({
          id: doc.id,
          ...doc.data()
        } as Review);
      });
      
      // Trier par date de création (plus récent en premier)
      reviewsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setReviews(reviewsData);
    });

    return () => unsubscribe();
  }, [artisanId]);

  // Calculer les statistiques
  const calculateStats = () => {
    if (reviews.length === 0) {
      return {
        noteGlobale: 0,
        totalAvis: 0,
        repartition: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        avisPositifs: 0
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const noteGlobale = totalRating / reviews.length;
    
    const repartition = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      repartition[review.rating as keyof typeof repartition]++;
    });

    const avisPositifs = Math.round(((repartition[4] + repartition[5]) / reviews.length) * 100);

    return {
      noteGlobale: Math.round(noteGlobale * 10) / 10,
      totalAvis: reviews.length,
      repartition,
      avisPositifs
    };
  };

  const stats = calculateStats();

  // Fonction pour ouvrir la modale d'email
  const handleRequestReview = () => {
    const reviewUrl = artisanId ? `${window.location.origin}/avis/${artisanId}` : '[URL non disponible]';
    
    setEmailForm({
      to: "",
      subject: "Votre avis nous intéresse - Portail Habitat",
      content: `Bonjour,

J'espère que vous êtes satisfait(e) des travaux que j'ai réalisés pour vous.

Votre avis est très important pour moi et m'aide à améliorer mes services. Si vous avez quelques minutes, pourriez-vous laisser un avis sur mon profil Portail Habitat ?

Vous pouvez laisser votre avis en suivant ce lien : ${reviewUrl}

Je vous remercie par avance pour votre retour.

Cordialement,`
    });
    setIsEmailModalOpen(true);
  };

  // Fonction pour envoyer l'email
  const handleSubmitEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.content) {
      setEmailMessage({type: 'error', text: "Veuillez remplir tous les champs."});
      return;
    }

    setIsSubmitting(true);
    setEmailMessage(null);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailForm.to,
          subject: emailForm.subject,
          content: emailForm.content,
          fromName: 'Portail Habitat',
          fromEmail: 'service@trouver-mon-chantier.fr'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setEmailMessage({type: 'success', text: "Email envoyé avec succès !"});
        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailForm({ to: "", subject: "", content: "" });
          setEmailMessage(null);
        }, 2000);
      } else {
        setEmailMessage({type: 'error', text: result.error || "Erreur lors de l'envoi de l'email."});
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setEmailMessage({type: 'error', text: "Erreur de connexion lors de l'envoi de l'email."});
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formater la date
  const formatDate = (timestamp: any) => {
    const date = timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avis clients</h1>
          <p className="text-muted-foreground">
            Gérez vos avis clients et votre réputation en ligne
          </p>
        </div>
        <Button onClick={handleRequestReview}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Demander un avis
        </Button>
      </div>

      {reviews.length > 0 ? (
        <>
          {/* Statistiques des avis */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Note globale</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.noteGlobale}/5</div>
                <div className="flex items-center space-x-1 mt-1">
                  {getStarRating(Math.round(stats.noteGlobale))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total avis</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAvis}</div>
                <p className="text-xs text-muted-foreground">
                  Avis clients
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avis positifs</CardTitle>
                <ThumbsUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avisPositifs}%</div>
                <p className="text-xs text-muted-foreground">
                  4-5 étoiles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Derniers avis</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviews.slice(0, 3).length}</div>
                <p className="text-xs text-muted-foreground">
                  Récents
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Répartition des notes */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des notes</CardTitle>
              <CardDescription>
                Distribution de vos avis par nombre d'étoiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((note) => (
                  <div key={note} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium">{note}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: stats.totalAvis > 0 ? `${(stats.repartition[note as keyof typeof stats.repartition] / stats.totalAvis) * 100}%` : '0%'
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {stats.repartition[note as keyof typeof stats.repartition]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liste des avis */}
          <Card>
            <CardHeader>
              <CardTitle>Tous les avis ({reviews.length})</CardTitle>
              <CardDescription>
                Vos avis clients récents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 space-y-4">
                    {/* En-tête de l'avis */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{review.clientName}</span>
                          </div>
                          {getNoteBadge(review.rating)}
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Vérifié
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            {getStarRating(review.rating)}
                          </div>
                          <span>•</span>
                          <span>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenu de l'avis */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* État vide - Pas d'avis */
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun avis pour le moment
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Vous n'avez pas encore reçu d'avis clients. Demandez à vos clients satisfaits 
              de laisser un avis pour améliorer votre réputation en ligne.
            </p>
            <Button onClick={handleRequestReview} size="lg">
              <Mail className="h-4 w-4 mr-2" />
              Demandez vos premiers avis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modale pour envoyer un email */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Demander un avis client</DialogTitle>
            <DialogDescription>
              Envoyez un email à vos clients pour leur demander de laisser un avis
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">Email du client</Label>
              <Input
                id="email-to"
                type="email"
                value={emailForm.to}
                onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                placeholder="client@exemple.com"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email-subject">Objet</Label>
              <Input
                id="email-subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email-content">Message</Label>
              <Textarea
                id="email-content"
                value={emailForm.content}
                onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                className="mt-1 min-h-[200px]"
                placeholder="Votre message..."
              />
            </div>

            {emailMessage && (
              <div className={`p-3 rounded-lg ${
                emailMessage.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {emailMessage.text}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmitEmail} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer l'email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
