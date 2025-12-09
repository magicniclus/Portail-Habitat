"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditableField from "@/components/admin/EditableField";
import EditableSelect from "@/components/admin/EditableSelect";
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
  TrendingUp,
  Globe,
  Link,
  Copy,
  ExternalLink
} from "lucide-react";

interface Prospect {
  id: string;
  sessionId: string;
  funnelStep: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  postalCode?: string;
  department?: string;
  propertyType?: string;
  prestationType?: string;
  surface?: number;
  searchesLast24h?: number;
  demandsLast30d?: number;
  selectedZoneRadius?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  notes?: string;
  assignedTo?: string;
  createdAt: any;
  updatedAt?: any;
}

const FUNNEL_STEPS = [
  { value: 'step1', label: 'Étape 1 - Informations' },
  { value: 'step2', label: 'Étape 2 - Localisation' },
  { value: 'step3', label: 'Étape 3 - Contact' },
  { value: 'abandoned', label: 'Abandonné' },
  { value: 'completed', label: 'Terminé' },
  { value: 'contacted', label: 'Contacté' }
];

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prospectId = params.id as string;
  const returnTo = searchParams.get('returnTo');
  
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (prospectId) {
      loadProspect();
    }
  }, [prospectId]);

  const loadProspect = async () => {
    try {
      setLoading(true);

      // Vérifier les permissions
      const canManageUsers = await hasPermission(ADMIN_PERMISSIONS.MANAGE_USERS);
      setCanEdit(canManageUsers);

      const prospectDoc = await getDoc(doc(db, "prospects", prospectId));
      
      if (prospectDoc.exists()) {
        const prospectData = { id: prospectDoc.id, ...prospectDoc.data() } as Prospect;
        setProspect(prospectData);
      } else {
        console.error("Prospect non trouvé");
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
      router.push('/admin/demandes');
    }
  };

  const updateField = async (field: string, value: string | number) => {
    if (!prospect || !canEdit) return;

    try {
      await updateDoc(doc(db, "prospects", prospectId), {
        [field]: value,
        updatedAt: new Date()
      });
      
      // Mettre à jour l'état local
      setProspect({
        ...prospect,
        [field]: value,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const generateRegistrationLink = () => {
    if (!prospect) return '';
    
    const params = new URLSearchParams({
      prospectId: prospect.id,
      firstName: prospect.firstName || '',
      lastName: prospect.lastName || '',
      email: prospect.email || '',
      phone: prospect.phone || '',
      postalCode: prospect.postalCode || '',
      profession: prospect.prestationType || '',
      step: "1"
    });

    return `${window.location.origin}/onboarding/step2?${params.toString()}`;
  };

  const copyRegistrationLink = async () => {
    const link = generateRegistrationLink();
    try {
      await navigator.clipboard.writeText(link);
      // Vous pourriez ajouter une notification toast ici
      console.log('Lien copié dans le presse-papiers');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const getFunnelBadge = (step: string) => {
    const stepConfig = {
      step1: { label: "Candidature initiale", className: "bg-blue-100 text-blue-800" },
      step2: { label: "Zone sélectionnée", className: "bg-yellow-100 text-yellow-800" },
      step3: { label: "Paiement en cours", className: "bg-orange-100 text-orange-800" },
      abandoned: { label: "Abandonné", className: "bg-red-100 text-red-800" },
      completed: { label: "Inscrit", className: "bg-green-100 text-green-800" },
      contacted: { label: "Contacté", className: "bg-purple-100 text-purple-800" }
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
          <p>Chargement du prospect...</p>
        </div>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Prospect non trouvé</h2>
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
              Entreprise candidate - {prospect.firstName} {prospect.lastName}
            </h1>
            <p className="text-gray-600">{prospect.prestationType} • {prospect.city}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={copyRegistrationLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copier lien d'inscription
          </Button>
          <Button variant="outline" onClick={() => window.open(generateRegistrationLink(), '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir inscription
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations client */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations de l'entreprise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Prénom du dirigeant"
                value={prospect.firstName || ''}
                onSave={(value) => updateField('firstName', value)}
                placeholder="Prénom du dirigeant"
                disabled={!canEdit}
              />
              
              <EditableField
                label="Nom du dirigeant"
                value={prospect.lastName || ''}
                onSave={(value) => updateField('lastName', value)}
                placeholder="Nom du dirigeant"
                disabled={!canEdit}
              />

              <EditableField
                label="Email de contact"
                value={prospect.email || ''}
                onSave={(value) => updateField('email', value)}
                type="email"
                placeholder="Email de l'entreprise"
                disabled={!canEdit}
              />

              <EditableField
                label="Téléphone"
                value={prospect.phone || ''}
                onSave={(value) => updateField('phone', value)}
                placeholder="Téléphone de l'entreprise"
                disabled={!canEdit}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Ville d'activité"
                value={prospect.city || ''}
                onSave={(value) => updateField('city', value)}
                placeholder="Ville où l'entreprise souhaite opérer"
                disabled={!canEdit}
              />

              <EditableField
                label="Code postal"
                value={prospect.postalCode || ''}
                onSave={(value) => updateField('postalCode', value)}
                placeholder="Code postal de la zone d'activité"
                disabled={!canEdit}
              />
            </div>

            <EditableField
              label="Métier/Spécialité"
              value={prospect.prestationType || ''}
              onSave={(value) => updateField('prestationType', value)}
              placeholder="Métier ou spécialité de l'entreprise"
              disabled={!canEdit}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="Rayon d'intervention souhaité (km)"
                value={prospect.selectedZoneRadius || 0}
                onSave={(value) => updateField('selectedZoneRadius', value)}
                type="number"
                placeholder="Rayon en kilomètres"
                disabled={!canEdit}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gestion et suivi */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi de candidature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableSelect
              label="Étape d'inscription"
              value={prospect.funnelStep || ''}
              options={FUNNEL_STEPS}
              onSave={(value) => updateField('funnelStep', value)}
              placeholder="Sélectionner une étape"
              disabled={!canEdit}
              renderValue={(value) => getFunnelBadge(value)}
            />

            <EditableField
              label="Assigné à"
              value={prospect.assignedTo || ''}
              onSave={(value) => updateField('assignedTo', value)}
              placeholder="Nom du responsable du suivi"
              disabled={!canEdit}
            />

            <EditableField
              label="Notes internes"
              value={prospect.notes || ''}
              onSave={(value) => updateField('notes', value)}
              type="textarea"
              placeholder="Notes sur cette entreprise candidate"
              disabled={!canEdit}
              rows={4}
            />

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Lien d'inscription</h4>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2">
                  Envoyez ce lien à l'entreprise pour qu'elle reprenne son inscription où elle s'est arrêtée :
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white px-2 py-1 rounded border flex-1 truncate">
                    {generateRegistrationLink()}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyRegistrationLink}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Activité</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Recherches 24h: {prospect.searchesLast24h || 0}</div>
                <div>Demandes 30j: {prospect.demandsLast30d || 0}</div>
                <div>Rayon sélectionné: {prospect.selectedZoneRadius || 0}km</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Source UTM</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Source: {prospect.utm_source || 'Non renseigné'}</div>
                <div>Medium: {prospect.utm_medium || 'Non renseigné'}</div>
                <div>Campaign: {prospect.utm_campaign || 'Non renseigné'}</div>
              </div>
            </div>

            <div className="pt-4 border-t text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Créé le {prospect.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
              </div>
              {prospect.updatedAt && (
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3" />
                  Mis à jour le {prospect.updatedAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                </div>
              )}
              <div className="mt-2">
                Session ID: {prospect.sessionId}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
