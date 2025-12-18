"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { recomputeArtisanReviewStats } from "@/lib/review-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  User,
  Calendar,
  Star,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Loader2,
  MessageSquare
} from "lucide-react";

interface Review {
  id: string;
  artisanId: string;
  rating: number;
  comment: string;
  clientName: string;
  clientEmail?: string;
  projectType?: string;
  displayed: boolean;
  createdAt: any;
  updatedAt?: any;
  moderatedBy?: string;
  moderationNotes?: string;
}

interface Artisan {
  companyName: string;
  firstName: string;
  lastName: string;
}

export default function ReviewModerationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = params.id as string;
  const returnTo = searchParams.get('returnTo');
  const tab = searchParams.get('tab');
  
  const [review, setReview] = useState<Review | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [canModerate, setCanModerate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [moderationNotes, setModerationNotes] = useState("");
  const [isDisplayed, setIsDisplayed] = useState(false);

  useEffect(() => {
    if (reviewId) {
      loadReview();
    }
  }, [reviewId]);

  const loadReview = async () => {
    try {
      setLoading(true);

      // Vérifier les permissions
      const canModerateReviews = await hasPermission(ADMIN_PERMISSIONS.MODERATE_REVIEWS);
      setCanModerate(canModerateReviews);

      // Le reviewId contient artisanId-reviewId, on doit les séparer
      const [artisanId, actualReviewId] = reviewId.split('-');
      
      if (!artisanId || !actualReviewId) {
        console.error("Format d'ID avis invalide");
        return;
      }

      // Charger l'avis depuis la sous-collection de l'artisan
      const reviewDoc = await getDoc(doc(db, "artisans", artisanId, "reviews", actualReviewId));
      
      if (reviewDoc.exists()) {
        const reviewData = { id: reviewDoc.id, artisanId, ...reviewDoc.data() } as Review;
        setReview(reviewData);
        setIsDisplayed(reviewData.displayed);
        setModerationNotes(reviewData.moderationNotes || "");
      } else {
        console.error("Avis non trouvé");
        return;
      }

      // Charger les infos de l'artisan
      const artisanDoc = await getDoc(doc(db, "artisans", artisanId));
      if (artisanDoc.exists()) {
        setArtisan(artisanDoc.data() as Artisan);
      }

    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!review || !canModerate) return;

    try {
      setSaving(true);
      const [artisanId, actualReviewId] = reviewId.split('-');
      const currentAdmin = await getCurrentAdmin();
      
      await updateDoc(doc(db, "artisans", artisanId, "reviews", actualReviewId), {
        displayed: isDisplayed,
        moderationNotes: moderationNotes,
        moderatedBy: currentAdmin?.email || 'admin',
        updatedAt: new Date()
      });

      await recomputeArtisanReviewStats(artisanId);
      
      setReview({
        ...review,
        displayed: isDisplayed,
        moderationNotes: moderationNotes,
        moderatedBy: currentAdmin?.email || 'admin',
        updatedAt: new Date()
      });
      
      console.log('Avis modéré avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canModerate || !confirm('Êtes-vous sûr de vouloir supprimer cet avis définitivement ?')) return;

    try {
      setSaving(true);
      const [artisanId, actualReviewId] = reviewId.split('-');
      
      await deleteDoc(doc(db, "artisans", artisanId, "reviews", actualReviewId));

      await recomputeArtisanReviewStats(artisanId);
      handleReturn();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setSaving(false);
    }
  };

  const handleReturn = () => {
    if (returnTo && tab) {
      // Rediriger vers la page avec l'onglet spécifique
      router.push(`${returnTo}?tab=${tab}`);
    } else if (returnTo) {
      router.push(returnTo);
    } else {
      router.back();
    }
  };

  const getRatingStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de l'avis...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Avis non trouvé</h2>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleReturn}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Modération d'avis
            </h1>
            <p className="text-gray-600">
              Avis pour {artisan?.companyName || `${artisan?.firstName} ${artisan?.lastName}`}
            </p>
          </div>
        </div>
        
        {canModerate && (
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} size="sm" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sauvegarder
            </Button>
            <Button onClick={handleDelete} variant="destructive" size="sm" disabled={saving}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avis complet */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Détails de l'avis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Note et client */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {getRatingStars(review.rating)}
                  </div>
                  <span className="text-lg font-semibold">{review.rating}/5</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{review.clientName}</span>
                  {review.clientEmail && (
                    <>
                      <span>•</span>
                      <span>{review.clientEmail}</span>
                    </>
                  )}
                </div>
                {review.projectType && (
                  <div className="text-sm text-gray-600 mt-1">
                    Projet : {review.projectType}
                  </div>
                )}
              </div>
              <div className="text-right">
                <Badge variant={review.displayed ? 'default' : 'secondary'}>
                  {review.displayed ? 'Affiché' : 'Masqué'}
                </Badge>
                <div className="text-xs text-gray-500 mt-1">
                  {review.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <Label className="text-base font-semibold">Commentaire du client</Label>
              <div className="mt-2 p-4 bg-white border rounded-lg">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            </div>

            {/* Historique de modération */}
            {(review.moderatedBy || review.updatedAt) && (
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-gray-600">Historique de modération</Label>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  {review.moderatedBy && (
                    <div>Modéré par : {review.moderatedBy}</div>
                  )}
                  {review.updatedAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      Dernière modification : {review.updatedAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions de modération */}
        <Card>
          <CardHeader>
            <CardTitle>Actions de modération</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visibilité */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Visibilité de l'avis</Label>
              <div className="flex items-center space-x-3">
                <Switch 
                  checked={isDisplayed}
                  onCheckedChange={setIsDisplayed}
                  disabled={!canModerate}
                />
                <div className="flex items-center gap-2">
                  {isDisplayed ? (
                    <>
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Visible publiquement</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Masqué du public</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {isDisplayed 
                  ? "Cet avis sera visible sur le profil public de l'artisan"
                  : "Cet avis ne sera pas visible sur le profil public de l'artisan"
                }
              </p>
            </div>

            {/* Notes de modération */}
            <div className="space-y-3">
              <Label htmlFor="moderationNotes" className="text-base font-semibold">
                Notes de modération
              </Label>
              <Textarea
                id="moderationNotes"
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                placeholder="Ajoutez des notes sur cette modération..."
                rows={4}
                disabled={!canModerate}
              />
              <p className="text-xs text-gray-500">
                Ces notes sont privées et ne seront pas visibles publiquement
              </p>
            </div>

            {/* Informations système */}
            <div className="pt-4 border-t text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Avis créé le {review.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
              </div>
              <div>ID de l'avis : {review.id}</div>
              <div>ID de l'artisan : {review.artisanId}</div>
            </div>

            {/* Actions rapides */}
            {canModerate && (
              <div className="pt-4 border-t space-y-2">
                <Label className="text-sm font-medium">Actions rapides</Label>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsDisplayed(true)}
                    className="justify-start"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Approuver et afficher
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsDisplayed(false)}
                    className="justify-start"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Masquer l'avis
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
