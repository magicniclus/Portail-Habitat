"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import EditableField from "@/components/admin/EditableField";
import EditableSelect from "@/components/admin/EditableSelect";
import ArtisanAssignment from "@/components/admin/ArtisanAssignment";
import { 
  ArrowLeft,
  User,
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Building2,
  Save,
  Loader2,
  FileText,
  Send,
  Download,
  Eye,
  Globe
} from "lucide-react";

interface Assignment {
  artisanId: string;
  artisanName: string;
  artisanCompany?: string;
  assignedAt: any; // Date ou Timestamp Firestore
  price?: number;
}

interface Estimation {
  id: string;
  sessionId: string;
  status: string;
  clientInfo: {
    firstName: string;
    phone: string;
    email: string;
    acceptsCGV: boolean;
  };
  location: {
    postalCode: string;
    city: string;
    department: string;
    coordinates?: { lat: number; lng: number };
  };
  project: {
    propertyType: string;
    prestationType: string;
    prestationSlug: string;
    surface?: number;
    responses?: Record<string, any>;
  };
  pricing?: {
    estimatedPrice: number;
    priceRange: { min: number; max: number };
    artisanCount: number;
  };
  notes?: string;
  assignedTo?: string;
  assignments?: Assignment[];
  isPublished?: boolean;
  publishedAt?: any;
  createdAt: any;
  updatedAt?: any;
  sentAt?: any;
}

const ESTIMATION_STATUS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'completed', label: 'Terminé' },
  { value: 'sent', label: 'Envoyé' },
  { value: 'expired', label: 'Expiré' }
];

export default function ProjetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projetId = params.id as string;
  const returnTo = searchParams.get('returnTo');
  
  const [estimation, setEstimation] = useState<Estimation | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (projetId) {
      loadEstimation();
    }
  }, [projetId]);

  const loadEstimation = async () => {
    try {
      setLoading(true);

      // Vérifier les permissions
      const canManageUsers = await hasPermission(ADMIN_PERMISSIONS.MANAGE_USERS);
      setCanEdit(canManageUsers);

      const estimationDoc = await getDoc(doc(db, "estimations", projetId));
      
      if (estimationDoc.exists()) {
        const estimationData = { id: estimationDoc.id, ...estimationDoc.data() } as Estimation;
        setEstimation(estimationData);
      } else {
        console.error("Estimation non trouvée");
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    if (returnTo) {
      router.push(returnTo);
    } else {
      router.push('/admin/projets');
    }
  };

  const updateField = async (field: string, value: string | number) => {
    if (!estimation || !canEdit) return;

    try {
      // Gérer les champs imbriqués
      const updateData: any = { updatedAt: new Date() };
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updateData[parent] = {
          ...estimation[parent as keyof Estimation] as any,
          [child]: value
        };
      } else {
        updateData[field] = value;
      }

      await updateDoc(doc(db, "estimations", projetId), updateData);
      
      // Mettre à jour l'état local
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        setEstimation({
          ...estimation,
          [parent]: {
            ...estimation[parent as keyof Estimation] as any,
            [child]: value
          },
          updatedAt: new Date()
        });
      } else {
        setEstimation({
          ...estimation,
          [field]: value,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const handleAssignmentsUpdate = (assignments: Assignment[]) => {
    if (!estimation) return;
    
    setEstimation({
      ...estimation,
      assignments,
      updatedAt: new Date()
    });
  };

  const togglePublishStatus = async (newPublishedStatus: boolean) => {
    if (!estimation || !canEdit) return;

    try {
      const updateData: any = {
        isPublished: newPublishedStatus,
        updatedAt: new Date()
      };

      // Si on publie, ajouter la date de publication
      if (newPublishedStatus) {
        updateData.publishedAt = new Date();
      } else {
        // Si on dépublie, supprimer la date de publication
        updateData.publishedAt = null;
      }

      await updateDoc(doc(db, "estimations", projetId), updateData);
      
      // Mettre à jour l'état local
      setEstimation({
        ...estimation,
        isPublished: newPublishedStatus,
        publishedAt: newPublishedStatus ? new Date() : null,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Brouillon", className: "bg-gray-100 text-gray-800" },
      completed: { label: "Terminé", className: "bg-blue-100 text-blue-800" },
      sent: { label: "Envoyé", className: "bg-green-100 text-green-800" },
      expired: { label: "Expiré", className: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!estimation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h2>
        <Button onClick={handleReturn}>
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
              Projet - {estimation.clientInfo?.firstName}
            </h1>
            <p className="text-gray-600">{estimation.project?.prestationType} • {estimation.location?.city}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {canEdit && (
            <div className="flex items-center gap-3">
              <label htmlFor="publish-switch" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Publier le projet
              </label>
              <Switch
                id="publish-switch"
                checked={estimation.isPublished || false}
                onCheckedChange={togglePublishStatus}
              />
            </div>
          )}

          {estimation.status === 'completed' && (
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Envoyer l'estimation
            </Button>
          )}
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations client et projet */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations client et projet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client */}
            <div>
              <h3 className="font-semibold mb-3">Client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Prénom"
                  value={estimation.clientInfo?.firstName || ''}
                  onSave={(value) => updateField('clientInfo.firstName', value)}
                  placeholder="Prénom du client"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Email"
                  value={estimation.clientInfo?.email || ''}
                  onSave={(value) => updateField('clientInfo.email', value)}
                  type="email"
                  placeholder="Email du client"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Téléphone"
                  value={estimation.clientInfo?.phone || ''}
                  onSave={(value) => updateField('clientInfo.phone', value)}
                  placeholder="Téléphone du client"
                  disabled={!canEdit}
                />

                <div>
                  <label className="text-sm font-medium">CGV acceptées</label>
                  <div className="mt-1">
                    <Badge variant={estimation.clientInfo?.acceptsCGV ? 'default' : 'secondary'}>
                      {estimation.clientInfo?.acceptsCGV ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div>
              <h3 className="font-semibold mb-3">Localisation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EditableField
                  label="Ville"
                  value={estimation.location?.city || ''}
                  onSave={(value) => updateField('location.city', value)}
                  placeholder="Ville du projet"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Code postal"
                  value={estimation.location?.postalCode || ''}
                  onSave={(value) => updateField('location.postalCode', value)}
                  placeholder="Code postal"
                  disabled={!canEdit}
                />

                <div>
                  <label className="text-sm font-medium">Département</label>
                  <div className="mt-1 text-sm">{estimation.location?.department}</div>
                </div>
              </div>
            </div>

            {/* Projet */}
            <div>
              <h3 className="font-semibold mb-3">Projet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField
                  label="Type de bien"
                  value={estimation.project?.propertyType || ''}
                  onSave={(value) => updateField('project.propertyType', value)}
                  placeholder="Type de propriété"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Surface (m²)"
                  value={estimation.project?.surface || 0}
                  onSave={(value) => updateField('project.surface', value)}
                  type="number"
                  placeholder="Surface en m²"
                  disabled={!canEdit}
                />
              </div>

              <div className="mt-4">
                <EditableField
                  label="Type de prestation"
                  value={estimation.project?.prestationType || ''}
                  onSave={(value) => updateField('project.prestationType', value)}
                  placeholder="Type de prestation"
                  disabled={!canEdit}
                />
              </div>
            </div>

            {/* Réponses du questionnaire */}
            {estimation.project?.responses && (
              <div>
                <h3 className="font-semibold mb-3">Réponses du questionnaire</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(estimation.project.responses, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gestion et tarification */}
        <div className="space-y-6">
          {/* Statut et gestion */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EditableSelect
                label="Statut"
                value={estimation.status || ''}
                options={ESTIMATION_STATUS}
                onSave={(value) => updateField('status', value)}
                placeholder="Sélectionner un statut"
                disabled={!canEdit}
                renderValue={(value) => getStatusBadge(value)}
              />

              <EditableField
                label="Notes"
                value={estimation.notes || ''}
                onSave={(value) => updateField('notes', value)}
                type="textarea"
                placeholder="Notes sur ce projet"
                disabled={!canEdit}
                rows={4}
              />

              <div className="pt-4 border-t text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Créé le {estimation.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                </div>
                {estimation.updatedAt && (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    Mis à jour le {estimation.updatedAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                  </div>
                )}
                {estimation.sentAt && (
                  <div className="flex items-center gap-2 mt-1">
                    <Send className="h-3 w-3" />
                    Envoyé le {estimation.sentAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {estimation.isPublished ? (
                    <>
                      <Globe className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">
                        Publié le {estimation.publishedAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-500">Non publié</span>
                    </>
                  )}
                </div>
                <div className="mt-2">
                  Session ID: {estimation.sessionId}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attribution aux artisans */}
          <ArtisanAssignment
            estimationId={estimation.id}
            currentAssignments={estimation.assignments || []}
            onAssignmentsUpdate={handleAssignmentsUpdate}
            disabled={!canEdit}
          />

        </div>
      </div>
    </div>
  );
}
