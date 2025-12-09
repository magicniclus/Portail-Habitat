"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Star,
  Users,
  MessageSquare,
  TrendingUp,
  Loader2,
  Globe,
  Shield,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Eye,
  CreditCard,
  Settings
} from "lucide-react";

interface UserDetail {
  id: string;
  type: 'artisan' | 'prospect';
  // Données communes
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  fullAddress?: string;
  createdAt: any;
  updatedAt?: any;
  
  // Données artisan
  companyName?: string;
  slug?: string;
  profession?: string;
  professions?: string[];
  description?: string;
  services?: string[];
  siret?: string;
  subscriptionStatus?: string;
  monthlySubscriptionPrice?: number;
  sitePricePaid?: number;
  averageRating?: number;
  reviewCount?: number;
  totalLeads?: number;
  leadCountThisMonth?: number;
  logoUrl?: string;
  coverUrl?: string;
  photos?: string[];
  hasPremiumSite?: boolean;
  hasSocialFeed?: boolean;
  publishedPostsCount?: number;
  averageQuoteMin?: number;
  averageQuoteMax?: number;
  certifications?: string[];
  notifications?: {
    emailLeads?: boolean;
    emailReviews?: boolean;
    emailMarketing?: boolean;
    pushNotifications?: boolean;
  };
  privacy?: {
    profileVisible?: boolean;
    showPhone?: boolean;
    showEmail?: boolean;
    allowDirectContact?: boolean;
  };
  
  // Données prospect
  funnelStep?: string;
  searchesLast24h?: number;
  demandsLast30d?: number;
  selectedZoneRadius?: number;
  department?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  projectType: string;
  city: string;
  budget: string;
  status: string;
  createdAt: any;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  createdAt: any;
  displayed: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  city: string;
  projectType: string;
  isPublished: boolean;
  isPubliclyVisible: boolean;
  photos: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: any;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserDetail | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      // Vérifier les permissions
      const canEditUsers = await hasPermission(ADMIN_PERMISSIONS.MANAGE_USERS);
      setCanEdit(canEditUsers);

      // Essayer de charger depuis artisans
      const artisanDoc = await getDoc(doc(db, "artisans", userId));
      
      if (artisanDoc.exists()) {
        const artisanData = { id: artisanDoc.id, type: 'artisan' as const, ...artisanDoc.data() } as UserDetail;
        setUser(artisanData);
        setEditedUser(artisanData);
        
        // Charger les leads de l'artisan
        const leadsQuery = query(
          collection(db, "artisans", userId, "leads"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const leadsSnapshot = await getDocs(leadsQuery);
        const leadsData = leadsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lead[];
        setLeads(leadsData);

        // Charger les avis de l'artisan
        const reviewsQuery = query(
          collection(db, "artisans", userId, "reviews"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewsData = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];
        setReviews(reviewsData);

        // Charger les projets de l'artisan
        const projectsQuery = query(
          collection(db, "artisans", userId, "posts"),
          orderBy("createdAt", "desc"),
          limit(20)
        );
        const projectsSnapshot = await getDocs(projectsQuery);
        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsData);
      } else {
        // Essayer de charger depuis prospects
        const prospectDoc = await getDoc(doc(db, "prospects", userId));
        
        if (prospectDoc.exists()) {
          const prospectData = { id: prospectDoc.id, type: 'prospect' as const, ...prospectDoc.data() } as UserDetail;
          setUser(prospectData);
          setEditedUser(prospectData);
        } else {
          console.error("Utilisateur non trouvé");
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedUser || !canEdit) return;

    try {
      const collection_name = editedUser.type === 'artisan' ? 'artisans' : 'prospects';
      await updateDoc(doc(db, collection_name, userId), {
        ...editedUser,
        updatedAt: new Date()
      });
      
      setUser(editedUser);
      setEditing(false);
      console.log('Utilisateur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedUser) return;
    
    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", className: "bg-green-100 text-green-800" },
      canceled: { label: "Annulé", className: "bg-red-100 text-red-800" },
      past_due: { label: "Impayé", className: "bg-yellow-100 text-yellow-800" },
      trialing: { label: "Essai", className: "bg-blue-100 text-blue-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getFunnelBadge = (step: string) => {
    const stepConfig = {
      step1: { label: "Étape 1", className: "bg-blue-100 text-blue-800" },
      step2: { label: "Étape 2", className: "bg-yellow-100 text-yellow-800" },
      step3: { label: "Étape 3", className: "bg-orange-100 text-orange-800" },
      abandoned: { label: "Abandonné", className: "bg-red-100 text-red-800" },
      paid: { label: "Payé", className: "bg-green-100 text-green-800" }
    };
    
    const config = stepConfig[step as keyof typeof stepConfig] || 
                   { label: step, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des détails utilisateur...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Utilisateur non trouvé</h2>
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
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.type === 'artisan' 
                ? (user.companyName || `${user.firstName} ${user.lastName}`)
                : `${user.firstName} ${user.lastName}`
              }
            </h1>
            <p className="text-gray-600">
              {user.type === 'artisan' ? 'Artisan' : 'Prospect'} • {user.profession}
            </p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Informations principales */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="business">Entreprise</TabsTrigger>
          {user.type === 'artisan' && (
            <>
              <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
              <TabsTrigger value="projects">Projets ({projects.length})</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    {editing ? (
                      <Input
                        id="firstName"
                        value={editedUser?.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    ) : (
                      <div className="mt-1 text-sm">{user.firstName || 'Non renseigné'}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    {editing ? (
                      <Input
                        id="lastName"
                        value={editedUser?.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    ) : (
                      <div className="mt-1 text-sm">{user.lastName || 'Non renseigné'}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  {editing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="mt-1 text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {user.email}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  {editing ? (
                    <Input
                      id="phone"
                      value={editedUser?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div className="mt-1 text-sm flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {user.phone || 'Non renseigné'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Localisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  {editing ? (
                    <Input
                      id="city"
                      value={editedUser?.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  ) : (
                    <div className="mt-1 text-sm">{user.city || 'Non renseigné'}</div>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  {editing ? (
                    <Input
                      id="postalCode"
                      value={editedUser?.postalCode || ''}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    />
                  ) : (
                    <div className="mt-1 text-sm">{user.postalCode || 'Non renseigné'}</div>
                  )}
                </div>

                {user.type === 'artisan' && (
                  <div>
                    <Label htmlFor="fullAddress">Adresse complète</Label>
                    {editing ? (
                      <Textarea
                        id="fullAddress"
                        value={editedUser?.fullAddress || ''}
                        onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                      />
                    ) : (
                      <div className="mt-1 text-sm">{user.fullAddress || 'Non renseigné'}</div>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Inscrit le {user.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                  </div>
                  {user.updatedAt && (
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      Mis à jour le {user.updatedAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques pour artisans */}
          {user.type === 'artisan' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{user.totalLeads || 0}</div>
                    <div className="text-sm text-gray-600">Leads totaux</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {user.averageRating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{user.reviewCount || 0}</div>
                    <div className="text-sm text-gray-600">Avis reçus</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{user.publishedPostsCount || 0}</div>
                    <div className="text-sm text-gray-600">Projets publiés</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

      {/* Données détaillées pour artisans */}
      {user.type === 'artisan' && (
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{lead.clientName}</h3>
                      <p className="text-sm text-gray-600">{lead.projectType}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{lead.clientEmail}</span>
                        <span>{lead.city}</span>
                        <span>{lead.budget}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={lead.status === 'converted' ? 'default' : 'secondary'}>
                        {lead.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {lead.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="font-medium">{review.clientName}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant={review.displayed ? 'default' : 'secondary'}>
                        {review.displayed ? 'Affiché' : 'Masqué'}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {review.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
