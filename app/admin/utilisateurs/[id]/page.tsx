"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditableField from "@/components/admin/EditableField";
import EditableSelect from "@/components/admin/EditableSelect";
import PrestationsModal from "@/components/admin/PrestationsModal";
import PremiumSwitch from "@/components/admin/PremiumSwitch";
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
  Loader2,
  Globe,
  Shield,
  Edit,
  Save,
  X,
  Image as ImageIcon,
  Eye,
  CreditCard,
  Settings,
  Plus,
  Euro,
  Crown
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
  premiumFeatures?: any;
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
  assignedLeads?: Array<{
    estimationId: string;
    assignedAt: any;
    price?: number;
  }>;
  
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
  const searchParams = useSearchParams();
  const userId = params.id as string;
  const defaultTab = searchParams.get('tab') || 'profile';
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignedEstimations, setAssignedEstimations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPrestationsModalOpen, setIsPrestationsModalOpen] = useState(false);
  const [isUpdatingPrestations, setIsUpdatingPrestations] = useState(false);

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (tabValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tabValue);
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

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

        // Charger les estimations assignées
        if (artisanData.assignedLeads && artisanData.assignedLeads.length > 0) {
          const estimationIds = artisanData.assignedLeads.map((lead: any) => lead.estimationId);
          // Dédupliquer les IDs d'estimation pour éviter les doublons
          const uniqueEstimationIds = [...new Set(estimationIds.filter(id => id))];
          const estimationsData = [];
          
          // Charger chaque estimation individuellement (Firestore ne supporte pas les requêtes IN avec plus de 10 éléments)
          for (const estimationId of uniqueEstimationIds.slice(0, 20)) { // Limiter à 20 pour les performances
            try {
              const estimationDoc = await getDoc(doc(db, "estimations", estimationId));
              if (estimationDoc.exists()) {
                estimationsData.push({
                  id: estimationDoc.id,
                  ...estimationDoc.data()
                });
              }
            } catch (error) {
              console.error(`Erreur lors du chargement de l'estimation ${estimationId}:`, error);
            }
          }
          
          setAssignedEstimations(estimationsData);
        }
      } else {
        // Essayer de charger depuis prospects
        const prospectDoc = await getDoc(doc(db, "prospects", userId));
        
        if (prospectDoc.exists()) {
          const prospectData = { id: prospectDoc.id, type: 'prospect' as const, ...prospectDoc.data() } as UserDetail;
          setUser(prospectData);
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

  const updateField = async (field: string, value: string | number) => {
    if (!user || !canEdit) return;

    try {
      const collectionName = user.type === 'artisan' ? 'artisans' : 'prospects';
      await updateDoc(doc(db, collectionName, userId), {
        [field]: value,
        updatedAt: new Date()
      });
      
      setUser({
        ...user,
        [field]: value,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const handleSavePrestations = async (selectedPrestations: string[]) => {
    if (!user || !canEdit) return;

    setIsUpdatingPrestations(true);
    try {
      await updateDoc(doc(db, "artisans", userId), {
        professions: selectedPrestations,
        updatedAt: new Date()
      });
      
      setUser({
        ...user,
        professions: selectedPrestations,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des prestations:', error);
      throw error;
    } finally {
      setIsUpdatingPrestations(false);
    }
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
        
      </div>

      {/* Informations principales */}
      <Tabs value={defaultTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="business">Entreprise</TabsTrigger>
          {user.type === 'artisan' && (
            <>
              <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
              <TabsTrigger value="estimations">Estimations ({assignedEstimations.length})</TabsTrigger>
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
                  <EditableField
                    label="Prénom"
                    value={user.firstName || ''}
                    onSave={(value) => updateField('firstName', value)}
                    placeholder="Prénom"
                    disabled={!canEdit}
                  />
                  
                  <EditableField
                    label="Nom"
                    value={user.lastName || ''}
                    onSave={(value) => updateField('lastName', value)}
                    placeholder="Nom de famille"
                    disabled={!canEdit}
                  />
                </div>
                
                <EditableField
                  label="Email"
                  value={user.email || ''}
                  onSave={(value) => updateField('email', value)}
                  type="email"
                  placeholder="Adresse email"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Téléphone"
                  value={user.phone || ''}
                  onSave={(value) => updateField('phone', value)}
                  placeholder="Numéro de téléphone"
                  disabled={!canEdit}
                />
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
                <EditableField
                  label="Ville"
                  value={user.city || ''}
                  onSave={(value) => updateField('city', value)}
                  placeholder="Ville"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Code postal"
                  value={user.postalCode || ''}
                  onSave={(value) => updateField('postalCode', value)}
                  placeholder="Code postal"
                  disabled={!canEdit}
                />

                {user.type === 'artisan' && (
                  <EditableField
                    label="Adresse complète"
                    value={user.fullAddress || ''}
                    onSave={(value) => updateField('fullAddress', value)}
                    type="textarea"
                    placeholder="Adresse complète"
                    disabled={!canEdit}
                    rows={3}
                  />
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

        </TabsContent>

        {/* Onglet Entreprise */}
        <TabsContent value="business" className="space-y-6">
          {user.type === 'artisan' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations entreprise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Entreprise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EditableField
                    label="Nom de l'entreprise"
                    value={user.companyName || ''}
                    onSave={(value) => updateField('companyName', value)}
                    placeholder="Nom de l'entreprise"
                    disabled={!canEdit}
                  />

                  <EditableField
                    label="SIRET"
                    value={user.siret || ''}
                    onSave={(value) => updateField('siret', value)}
                    placeholder="Numéro SIRET"
                    disabled={!canEdit}
                  />

                  <EditableField
                    label="Profession"
                    value={user.profession || ''}
                    onSave={(value) => updateField('profession', value)}
                    placeholder="Profession/Métier"
                    disabled={!canEdit}
                  />

                  <EditableField
                    label="Description"
                    value={user.description || ''}
                    onSave={(value) => updateField('description', value)}
                    type="textarea"
                    placeholder="Description de l'entreprise"
                    disabled={!canEdit}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Prestations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Prestations
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {user.professions?.length || 0} prestation(s)
                      </Badge>
                      {canEdit && (
                        <Button
                          size="sm"
                          onClick={() => setIsPrestationsModalOpen(true)}
                          disabled={isUpdatingPrestations}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Gérer
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.professions && user.professions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.professions.slice(0, 10).map((profession) => (
                        <Badge key={profession} variant="secondary" className="text-xs">
                          {profession.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      ))}
                      {user.professions.length > 10 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.professions.length - 10} autres
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Settings className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>Aucune prestation configurée</p>
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => setIsPrestationsModalOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter des prestations
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Premium */}
              <PremiumSwitch
                artisanId={user.id}
                premiumFeatures={user.premiumFeatures}
                onUpdate={loadUserData}
                disabled={!canEdit}
              />

              {/* Abonnement et statut */}
              <div className="space-y-4">
                {/* Statut principal */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      Abonnement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Statut</label>
                        <div className="mt-1">
                          {getStatusBadge(user.subscriptionStatus || 'inactive')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {user.monthlySubscriptionPrice || 0}€
                        </div>
                        <div className="text-xs text-gray-500">par mois</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>


              </div>
            </div>
          )}
        </TabsContent>

        {/* Onglet Leads */}
        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Leads attribués</h3>
            <Badge variant="outline">{leads.length} leads</Badge>
          </div>
          
          {leads.map((lead) => (
            <Card key={lead.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{lead.clientName}</h3>
                    <p className="text-sm text-gray-600">{lead.projectType}</p>
                    <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.clientEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {lead.city}
                      </span>
                      <span>{lead.budget}</span>
                      {/* Afficher le prix d'assignation si disponible */}
                      {user.type === 'artisan' && user.assignedLeads && (
                        (() => {
                          const assignedLead = user.assignedLeads.find(
                            (assigned: any) => assigned.estimationId === lead.id
                          );
                          return assignedLead?.price ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <Euro className="h-3 w-3" />
                              Assigné à {assignedLead.price}€
                            </span>
                          ) : null;
                        })()
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={lead.status === 'converted' ? 'default' : 'secondary'}>
                      {lead.status}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {lead.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/leads/${userId}-${lead.id}?returnTo=/admin/utilisateurs/${userId}&tab=leads`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Onglet Estimations assignées */}
        <TabsContent value="estimations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Estimations assignées</h3>
            <Badge variant="outline">{assignedEstimations.length} estimations</Badge>
          </div>
          
          {assignedEstimations.map((estimation: any, index: number) => (
            <Card key={`${estimation.id}-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">
                        {estimation.clientInfo?.firstName} - {estimation.project?.prestationType}
                      </h4>
                      <Badge variant="outline">
                        {estimation.status === 'completed' ? 'Terminé' : 
                         estimation.status === 'sent' ? 'Envoyé' : 
                         estimation.status === 'draft' ? 'Brouillon' : estimation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>📧 {estimation.clientInfo?.email}</div>
                      <div>📞 {estimation.clientInfo?.phone}</div>
                      <div>📍 {estimation.location?.city}</div>
                      {estimation.pricing?.estimatedPrice && (
                        <div>💰 {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(estimation.pricing.estimatedPrice)}</div>
                      )}
                      {/* Afficher le prix d'assignation */}
                      {user.type === 'artisan' && user.assignedLeads && (
                        (() => {
                          const assignedLead = user.assignedLeads.find(
                            (assigned: any) => assigned.estimationId === estimation.id
                          );
                          return assignedLead?.price ? (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <Euro className="h-4 w-4" />
                              Assigné à {assignedLead.price}€
                            </div>
                          ) : null;
                        })()
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-500">
                      {estimation.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/projets/${estimation.id}?returnTo=/admin/utilisateurs/${userId}&tab=estimations`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Voir détail
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {assignedEstimations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune estimation assignée à cet artisan
            </div>
          )}
        </TabsContent>

        {/* Onglet Avis */}
        <TabsContent value="reviews" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Avis clients</h3>
            <Badge variant="outline">{reviews.length} avis</Badge>
          </div>
          
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-sm font-medium">Note: {review.rating}/5</div>
                      <span className="font-medium">{review.clientName}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={review.displayed ? 'default' : 'secondary'}>
                      {review.displayed ? 'Affiché' : 'Masqué'}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {review.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                    </div>
                    {canEdit && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/avis/${userId}-${review.id}?returnTo=/admin/utilisateurs/${userId}&tab=reviews`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Modérer
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Onglet Projets */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Projets publiés</h3>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{projects.length} projets</Badge>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/admin/utilisateurs/${userId}/projets?returnTo=/admin/utilisateurs/${userId}&tab=projects`}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Voir tous les projets
                </Link>
              </Button>
            </div>
          </div>
          
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.city}
                      </span>
                      <span>{project.projectType}</span>
                      <span className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        {project.photos?.length || 0} photos
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={project.isPublished ? 'default' : 'secondary'}>
                      {project.isPublished ? 'Publié' : 'Brouillon'}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      {project.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Voir le projet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Modal de détail du projet */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <Button 
                      variant={selectedProject.isPubliclyVisible ? "default" : "outline"}
                      size="sm"
                      onClick={async () => {
                        try {
                          const [artisanId, actualProjectId] = [userId, selectedProject.id];
                          await updateDoc(doc(db, "artisans", artisanId, "posts", actualProjectId), {
                            isPubliclyVisible: !selectedProject.isPubliclyVisible,
                            updatedAt: new Date()
                          });
                          
                          // Mettre à jour l'état local
                          const updatedProject = { ...selectedProject, isPubliclyVisible: !selectedProject.isPubliclyVisible };
                          setSelectedProject(updatedProject);
                          
                          // Mettre à jour aussi dans la liste des projets
                          setProjects(projects.map(p => 
                            p.id === selectedProject.id ? updatedProject : p
                          ));
                        } catch (error) {
                          console.error('Erreur lors de la mise à jour:', error);
                        }
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedProject.isPubliclyVisible ? 'Masquer' : 'Rendre visible'}
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedProject(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Fermer
                  </Button>
                </div>
              </div>

              {/* Photos du projet */}
              {selectedProject.photos && selectedProject.photos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {selectedProject.photos.map((photo, index) => (
                    <div key={index} className="relative h-64 w-full">
                      <img
                        src={photo}
                        alt={`${selectedProject.title} - Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Détails */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Localisation</h4>
                    <p className="text-sm text-gray-600">{selectedProject.city}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Type de projet</h4>
                    <p className="text-sm text-gray-600">{selectedProject.projectType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Statut</h4>
                    <Badge variant={selectedProject.isPublished ? 'default' : 'secondary'}>
                      {selectedProject.isPublished ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">Visibilité</h4>
                    <Badge variant={selectedProject.isPubliclyVisible ? 'default' : 'secondary'}>
                      {selectedProject.isPubliclyVisible ? 'Public' : 'Privé'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>👍 {selectedProject.likesCount || 0} j'aime</span>
                  <span>💬 {selectedProject.commentsCount || 0} commentaires</span>
                  <span>📅 {selectedProject.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal des prestations */}
      <PrestationsModal
        isOpen={isPrestationsModalOpen}
        onClose={() => setIsPrestationsModalOpen(false)}
        currentProfessions={user?.professions || []}
        onSave={handleSavePrestations}
        disabled={!canEdit || isUpdatingPrestations}
      />
    </div>
  );
}
