"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft,
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  User,
  Building2,
  Euro,
  Save,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";

interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectType: string;
  projectDescription?: string;
  city: string;
  postalCode?: string;
  budget: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: any;
  updatedAt?: any;
}

const LEAD_STATUSES = [
  { value: 'new', label: 'Nouveau' },
  { value: 'contacted', label: 'Contacté' },
  { value: 'qualified', label: 'Qualifié' },
  { value: 'proposal_sent', label: 'Devis envoyé' },
  { value: 'converted', label: 'Converti' },
  { value: 'lost', label: 'Perdu' },
  { value: 'cancelled', label: 'Annulé' }
];

const PRIORITIES = [
  { value: 'low', label: 'Faible' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
  { value: 'urgent', label: 'Urgente' }
];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = params.id as string;
  const returnTo = searchParams.get('returnTo');
  const tab = searchParams.get('tab');
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (leadId) {
      loadLead();
    }
  }, [leadId]);

  const loadLead = async () => {
    try {
      setLoading(true);

      // Vérifier les permissions
      const canManageUsers = await hasPermission(ADMIN_PERMISSIONS.MANAGE_USERS);
      setCanEdit(canManageUsers);
      setEditing(canManageUsers); // Activer l'édition si l'utilisateur a les permissions

      // Le leadId contient artisanId-leadId, on doit les séparer
      const [artisanId, actualLeadId] = leadId.split('-');
      
      if (!artisanId || !actualLeadId) {
        console.error("Format d'ID lead invalide");
        return;
      }

      // Charger le lead depuis la sous-collection de l'artisan
      const leadDoc = await getDoc(doc(db, "artisans", artisanId, "leads", actualLeadId));
      
      if (leadDoc.exists()) {
        const leadData = { id: leadDoc.id, artisanId, ...leadDoc.data() } as Lead & { artisanId: string };
        setLead(leadData);
        setEditedLead(leadData);
      } else {
        console.error("Lead non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedLead || !canEdit) return;

    try {
      setSaving(true);
      const [artisanId, actualLeadId] = leadId.split('-');
      
      await updateDoc(doc(db, "artisans", artisanId, "leads", actualLeadId), {
        ...editedLead,
        updatedAt: new Date()
      });
      
      setLead(editedLead);
      setEditing(false);
      console.log('Lead mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit || !confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) return;

    try {
      setSaving(true);
      const [artisanId, actualLeadId] = leadId.split('-');
      
      await deleteDoc(doc(db, "artisans", artisanId, "leads", actualLeadId));
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

  const handleCancel = () => {
    setEditedLead(lead);
    setEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editedLead) return;
    
    setEditedLead({
      ...editedLead,
      [field]: value
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "Nouveau", className: "bg-blue-100 text-blue-800" },
      contacted: { label: "Contacté", className: "bg-yellow-100 text-yellow-800" },
      qualified: { label: "Qualifié", className: "bg-purple-100 text-purple-800" },
      proposal_sent: { label: "Devis envoyé", className: "bg-orange-100 text-orange-800" },
      converted: { label: "Converti", className: "bg-green-100 text-green-800" },
      lost: { label: "Perdu", className: "bg-red-100 text-red-800" },
      cancelled: { label: "Annulé", className: "bg-gray-100 text-gray-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "Faible", className: "bg-gray-100 text-gray-800" },
      medium: { label: "Moyenne", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "Haute", className: "bg-orange-100 text-orange-800" },
      urgent: { label: "Urgente", className: "bg-red-100 text-red-800" }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || 
                   { label: priority, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement du lead...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lead non trouvé</h2>
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
              Lead - {lead.clientName}
            </h1>
            <p className="text-gray-600">{lead.projectType} • {lead.city}</p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} size="sm" disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sauvegarder
            </Button>
            <Button onClick={handleDelete} variant="outline" size="sm" disabled={saving}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations client */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nom du client</Label>
                {editing ? (
                  <Input
                    id="clientName"
                    value={editedLead?.clientName || ''}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                  />
                ) : (
                  <div className="mt-1 text-sm">{lead.clientName}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                {editing ? (
                  <Input
                    id="clientEmail"
                    type="email"
                    value={editedLead?.clientEmail || ''}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  />
                ) : (
                  <div className="mt-1 text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {lead.clientEmail}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="clientPhone">Téléphone</Label>
                {editing ? (
                  <Input
                    id="clientPhone"
                    value={editedLead?.clientPhone || ''}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  />
                ) : (
                  <div className="mt-1 text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {lead.clientPhone || 'Non renseigné'}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="city">Ville</Label>
                {editing ? (
                  <Input
                    id="city"
                    value={editedLead?.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                ) : (
                  <div className="mt-1 text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {lead.city}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="projectType">Type de projet</Label>
              {editing ? (
                <Input
                  id="projectType"
                  value={editedLead?.projectType || ''}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                />
              ) : (
                <div className="mt-1 text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  {lead.projectType}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="projectDescription">Description du projet</Label>
              {editing ? (
                <Textarea
                  id="projectDescription"
                  value={editedLead?.projectDescription || ''}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  rows={3}
                />
              ) : (
                <div className="mt-1 text-sm">{lead.projectDescription || 'Non renseigné'}</div>
              )}
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              {editing ? (
                <Input
                  id="budget"
                  value={editedLead?.budget || ''}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              ) : (
                <div className="mt-1 text-sm flex items-center gap-2">
                  <Euro className="h-4 w-4 text-gray-500" />
                  {lead.budget}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statut et gestion */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion du lead</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Statut</Label>
              {editing ? (
                <Select 
                  value={editedLead?.status || ''} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  {getStatusBadge(lead.status)}
                </div>
              )}
            </div>

            <div>
              <Label>Priorité</Label>
              {editing ? (
                <Select 
                  value={editedLead?.priority || ''} 
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="mt-1">
                  {lead.priority ? getPriorityBadge(lead.priority) : 'Non définie'}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigné à</Label>
              {editing ? (
                <Input
                  id="assignedTo"
                  value={editedLead?.assignedTo || ''}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                />
              ) : (
                <div className="mt-1 text-sm">{lead.assignedTo || 'Non assigné'}</div>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              {editing ? (
                <Textarea
                  id="notes"
                  value={editedLead?.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                />
              ) : (
                <div className="mt-1 text-sm">{lead.notes || 'Aucune note'}</div>
              )}
            </div>

            <div className="pt-4 border-t text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Créé le {lead.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
              </div>
              {lead.updatedAt && (
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3" />
                  Mis à jour le {lead.updatedAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
