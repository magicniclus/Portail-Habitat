"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, Eye, MessageSquare, Phone, Mail, Loader2, X, Package, Euro } from "lucide-react";
import { collection, query, orderBy, onSnapshot, where, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { getBoughtLeads, updateLeadStatus, type ArtisanLead } from '@/lib/artisan-leads';

// Interface pour les leads
interface Lead {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectType: string;
  city: string;
  budget: string;
  source: string;
  status: string;
  createdAt: any;
  notes: string;
}


// Fonction pour déterminer le type basé sur les données
const determineType = (lead: Lead) => {
  const notes = lead.notes?.toLowerCase() || '';
  const projectType = lead.projectType?.toLowerCase() || '';
  
  if (notes.includes('urgent') || projectType.includes('urgent')) {
    return 'urgence';
  }
  if (notes.includes('devis') || projectType.includes('devis')) {
    return 'devis';
  }
  if (notes.includes('information') || notes.includes('question')) {
    return 'information';
  }
  return 'devis'; // Par défaut
};

const getStatusBadge = (status: string) => {
  const statusConfig = {
    new: { label: "Nouveau", className: "bg-blue-100 text-blue-800" },
    contacted: { label: "Contacté", className: "bg-yellow-100 text-yellow-800" },
    converted: { label: "Converti", className: "bg-green-100 text-green-800" },
    lost: { label: "Perdu", className: "bg-gray-100 text-gray-800" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: string) => {
  const typeConfig = {
    devis: { label: "Devis", className: "bg-purple-100 text-purple-800" },
    information: { label: "Information", className: "bg-blue-100 text-blue-800" },
    urgence: { label: "Urgence", className: "bg-red-100 text-red-800" },
    suivi: { label: "Suivi", className: "bg-orange-100 text-orange-800" },
  };
  
  const config = typeConfig[type as keyof typeof typeConfig];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function DemandesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [boughtLeads, setBoughtLeads] = useState<ArtisanLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBought, setLoadingBought] = useState(true);
  const [artisanId, setArtisanId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Récupérer l'onglet actif depuis l'URL
  const activeTab = searchParams.get('tab') || 'generated';
  
  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.push(`/dashboard/demandes?${params.toString()}`);
  };
  
  // États pour les modales
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isLeadDetailOpen, setIsLeadDetailOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // États pour les formulaires
  const [newLeadForm, setNewLeadForm] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    projectType: "",
    city: "",
    budget: "",
    notes: ""
  });
  
  const [emailForm, setEmailForm] = useState({
    subject: "",
    content: ""
  });
  
  // États pour les messages (seulement pour email)
  const [emailMessage, setEmailMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");

  // Récupérer l'ID de l'artisan connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Récupérer l'artisan correspondant à cet utilisateur
          const artisansRef = collection(db, 'artisans');
          const q = query(artisansRef, where('userId', '==', user.uid));
          
          const unsubscribeArtisan = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
              const artisanDoc = querySnapshot.docs[0];
              setArtisanId(artisanDoc.id);
            }
          });

          return () => unsubscribeArtisan();
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'artisan:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Récupérer les leads de l'artisan
  useEffect(() => {
    if (!artisanId) return;

    const leadsRef = collection(db, 'artisans', artisanId, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsData: Lead[] = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({
          id: doc.id,
          ...doc.data()
        } as Lead);
      });
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [artisanId]);

  // Récupérer les leads achetés
  useEffect(() => {
    if (!artisanId) return;

    const loadBoughtLeads = async () => {
      setLoadingBought(true);
      try {
        const purchased = await getBoughtLeads(artisanId);
        setBoughtLeads(purchased);
      } catch (error) {
        console.error('Erreur lors du chargement des leads achetés:', error);
      } finally {
        setLoadingBought(false);
      }
    };

    loadBoughtLeads();
  }, [artisanId]);

  // Filtrer les leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === "" || 
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    const leadType = determineType(lead);
    const matchesType = typeFilter === "all" || leadType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (date: any) => {
    if (!date) return 'Date inconnue';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
  };

  // Fonctions de validation avec regex
  const validateEmail = (email: string) => {
    // Regex email robuste selon RFC 5322
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim());
  };

  const validatePhone = (phone: string) => {
    // Accepte les formats français : 06 12 34 56 78, 0612345678, +33612345678
    const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
    const cleanPhone = phone.replace(/\s/g, '');
    return phoneRegex.test(cleanPhone);
  };

  const validateBudget = (budget: string) => {
    // Accepte les chiffres, espaces, tirets et le symbole €
    const budgetRegex = /^[\d\s\-€]*$/;
    return budgetRegex.test(budget);
  };

  // Fonction de validation complète
  const validateForm = () => {
    // Vérifier les champs obligatoires et leur format
    if (!newLeadForm.clientName.trim()) return false;
    if (!newLeadForm.clientEmail.trim()) return false;
    if (!validateEmail(newLeadForm.clientEmail)) return false;
    if (!newLeadForm.clientPhone.trim()) return false;
    if (!validatePhone(newLeadForm.clientPhone)) return false;
    if (newLeadForm.budget && !validateBudget(newLeadForm.budget)) return false;

    return true;
  };

  // Fonction pour créer une nouvelle demande
  const handleCreateLead = async () => {
    if (!artisanId) return;

    // Valider le formulaire
    if (!validateForm()) {
      return; // Validation échouée, ne pas continuer
    }

    setIsSubmitting(true);
    setCreatedLeadId(null);
    try {
      const leadsRef = collection(db, 'artisans', artisanId, 'leads');
      const docRef = await addDoc(leadsRef, {
        ...newLeadForm,
        source: 'manual',
        status: 'new',
        createdAt: serverTimestamp()
      });

      // Afficher la demande créée
      setCreatedLeadId(docRef.id);
      
      // Réinitialiser le formulaire après un délai
      setTimeout(() => {
        setNewLeadForm({
          clientName: "",
          clientPhone: "",
          clientEmail: "",
          projectType: "",
          city: "",
          budget: "",
          notes: ""
        });
        setIsNewLeadModalOpen(false);
        setCreatedLeadId(null);
        setValidationErrors({}); // Reset des erreurs de validation
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      // En cas d'erreur, on peut garder un message simple
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour ouvrir la modale d'email
  const handleSendEmail = (lead: Lead) => {
    setSelectedLead(lead);
    setEmailForm({
      subject: `Concernant votre projet ${lead.projectType}`,
      content: `Bonjour ${lead.clientName},\n\nJe vous recontacte concernant votre projet ${lead.projectType}.\n\nCordialement,`
    });
    setIsEmailModalOpen(true);
  };

  // Fonction pour mettre à jour le statut d'un lead
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    if (!artisanId) return;

    try {
      const leadRef = doc(db, 'artisans', artisanId, 'leads', leadId);
      await updateDoc(leadRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Mettre à jour le lead sélectionné si c'est celui qu'on modifie
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({...selectedLead, status: newStatus});
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Fonction pour mettre à jour les notes d'un lead
  const handleUpdateNotes = async (leadId: string, newNotes: string) => {
    if (!artisanId) return;

    try {
      const leadRef = doc(db, 'artisans', artisanId, 'leads', leadId);
      await updateDoc(leadRef, {
        notes: newNotes,
        updatedAt: serverTimestamp()
      });

      // Mettre à jour le lead sélectionné si c'est celui qu'on modifie
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({...selectedLead, notes: newNotes});
      }
      
      setEditingNotes(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notes:', error);
    }
  };

  // Fonction pour mettre à jour le statut d'un lead acheté
  const handleUpdateBoughtLeadStatus = async (leadId: string, newStatus: "new" | "contacted" | "converted" | "lost") => {
    if (!artisanId) return;

    try {
      const success = await updateLeadStatus(artisanId, leadId, newStatus);
      
      if (success) {
        // Mettre à jour l'état local
        setBoughtLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId 
              ? { ...lead, status: newStatus }
              : lead
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du lead acheté:', error);
    }
  };

  // Fonction pour ouvrir les détails d'un lead
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesValue(lead.notes || "");
    setEditingNotes(false);
    setIsLeadDetailOpen(true);
  };

  // Fonction pour envoyer l'email via SendGrid
  const handleSubmitEmail = async () => {
    if (!selectedLead || !emailForm.subject || !emailForm.content) {
      setEmailMessage({type: 'error', text: "Veuillez remplir tous les champs."});
      return;
    }

    setIsSubmitting(true);
    setEmailMessage(null);
    try {
      // Envoi via API SendGrid
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedLead.clientEmail,
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
          setEmailForm({ subject: "", content: "" });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de vos demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes demandes</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos demandes générées et achetées
          </p>
        </div>
        <Dialog open={isNewLeadModalOpen} onOpenChange={(open) => {
          setIsNewLeadModalOpen(open);
          if (!open) {
            // Reset complet quand on ferme la modale
            setCreatedLeadId(null);
            setValidationErrors({});
            setNewLeadForm({
              clientName: "",
              clientPhone: "",
              clientEmail: "",
              projectType: "",
              city: "",
              budget: "",
              notes: ""
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nouvelle demande</DialogTitle>
              <DialogDescription>
                Créez une nouvelle demande client manuellement
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Affichage conditionnel : loader, succès ou formulaire */}
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">Création de la demande en cours...</p>
                </div>
              ) : createdLeadId ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Demande créée avec succès !</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    La demande apparaît maintenant dans votre liste
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nom du client *</Label>
                  <Input
                    id="clientName"
                    value={newLeadForm.clientName}
                    onChange={(e) => {
                      setNewLeadForm({...newLeadForm, clientName: e.target.value});
                    }}
                    placeholder="Nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Téléphone *</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={newLeadForm.clientPhone}
                    onChange={(e) => {
                      // Ne garder que les chiffres, espaces et le +
                      const cleanValue = e.target.value.replace(/[^\d\s+]/g, '');
                      setNewLeadForm({...newLeadForm, clientPhone: cleanValue});
                      
                      // Validation silencieuse pour le bouton
                      const newErrors = {...validationErrors};
                      if (cleanValue && cleanValue.length > 0 && !validatePhone(cleanValue)) {
                        newErrors.clientPhone = "invalid";
                      } else {
                        delete newErrors.clientPhone;
                      }
                      setValidationErrors(newErrors);
                    }}
                    onKeyPress={(e) => {
                      // Autoriser seulement les chiffres, espaces et +
                      if (!/[\d\s+]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                        e.preventDefault();
                      }
                    }}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={newLeadForm.clientEmail}
                  onChange={(e) => {
                    const email = e.target.value;
                    setNewLeadForm({...newLeadForm, clientEmail: email});
                    
                    // Validation silencieuse pour le bouton
                    const newErrors = {...validationErrors};
                    if (email && email.length > 0 && !validateEmail(email)) {
                      newErrors.clientEmail = "invalid";
                    } else {
                      delete newErrors.clientEmail;
                    }
                    setValidationErrors(newErrors);
                  }}
                  placeholder="client@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType">Type de projet</Label>
                  <Input
                    id="projectType"
                    value={newLeadForm.projectType}
                    onChange={(e) => setNewLeadForm({...newLeadForm, projectType: e.target.value})}
                    placeholder="Rénovation salle de bain"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({...newLeadForm, city: e.target.value})}
                    placeholder="Paris"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  type="text"
                  value={newLeadForm.budget}
                  onChange={(e) => {
                    // Ne garder que les chiffres, espaces, tirets et €
                    const cleanValue = e.target.value.replace(/[^\d\s\-€]/g, '');
                    setNewLeadForm({...newLeadForm, budget: cleanValue});
                  }}
                  onKeyPress={(e) => {
                    // Autoriser seulement les chiffres, espaces, tirets et €
                    if (!/[\d\s\-€]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="5000-10000€"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Description</Label>
                <Textarea
                  id="notes"
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({...newLeadForm, notes: e.target.value})}
                  placeholder="Détails du projet, urgence, etc."
                  rows={3}
                />
              </div>
                </>
              )}
            </div>
            {!isSubmitting && !createdLeadId && (
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewLeadModalOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateLead} 
                  disabled={
                    !newLeadForm.clientName || 
                    !newLeadForm.clientEmail || 
                    !newLeadForm.clientPhone ||
                    Object.keys(validationErrors).some(key => validationErrors[key])
                  }
                >
                  Créer la demande
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generated" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Demandes générées ({leads.length})
          </TabsTrigger>
          <TabsTrigger value="bought" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Appels d'offres ({boughtLeads.length})
          </TabsTrigger>
        </TabsList>

        {/* Onglet Demandes générées */}
        <TabsContent value="generated" className="space-y-6">
          {/* Statistiques rapides */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total demandes</CardTitle>
            <Mail className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-blue-800">Nouvelles</CardTitle>
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-blue-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-900">
              {leads.filter((lead: Lead) => lead.status === 'new').length}
            </div>
            <p className="text-xs text-blue-700">
              À traiter
            </p>
            {/* Aperçu masqué sur mobile pour économiser l'espace */}
            {leads.filter((lead: Lead) => lead.status === 'new').length > 0 && (
              <div className="mt-2 space-y-1 hidden md:block">
                {leads.filter((lead: Lead) => lead.status === 'new').slice(0, 2).map((lead) => (
                  <div key={lead.id} className="text-xs text-blue-800 truncate">
                    ✨ {lead.clientName} - {lead.projectType}
                  </div>
                ))}
                {leads.filter((lead: Lead) => lead.status === 'new').length > 2 && (
                  <div className="text-xs text-blue-600">
                    +{leads.filter((lead: Lead) => lead.status === 'new').length - 2} nouvelles...
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-yellow-800">Contactées</CardTitle>
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-yellow-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-yellow-900">
              {leads.filter((lead: Lead) => lead.status === 'contacted').length}
            </div>
            <p className="text-xs text-yellow-700">
              En traitement
            </p>
            {leads.filter((lead: Lead) => lead.status === 'contacted').length > 0 && (
              <div className="mt-2 space-y-1 hidden md:block">
                {leads.filter((lead: Lead) => lead.status === 'contacted').slice(0, 2).map((lead) => (
                  <div key={lead.id} className="text-xs text-yellow-800 truncate">
                    📞 {lead.clientName} - {lead.projectType}
                  </div>
                ))}
                {leads.filter((lead: Lead) => lead.status === 'contacted').length > 2 && (
                  <div className="text-xs text-yellow-600">
                    +{leads.filter((lead: Lead) => lead.status === 'contacted').length - 2} autres...
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-green-800">Converties</CardTitle>
            <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-900">
              {leads.filter((lead: Lead) => lead.status === 'converted').length}
            </div>
            <p className="text-xs text-green-700">
              Clients acquis
            </p>
            {leads.filter((lead: Lead) => lead.status === 'converted').length > 0 && (
              <div className="mt-2 space-y-1 hidden md:block">
                {leads.filter((lead: Lead) => lead.status === 'converted').slice(0, 2).map((lead) => (
                  <div key={lead.id} className="text-xs text-green-800 truncate">
                    ✅ {lead.clientName} - {lead.projectType}
                  </div>
                ))}
                {leads.filter((lead: Lead) => lead.status === 'converted').length > 2 && (
                  <div className="text-xs text-green-600">
                    +{leads.filter((lead: Lead) => lead.status === 'converted').length - 2} autres...
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par client, sujet ou message..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="devis">Devis</SelectItem>
                <SelectItem value="information">Information</SelectItem>
                <SelectItem value="urgence">Urgence</SelectItem>
                <SelectItem value="suivi">Suivi</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="new">Nouveau</SelectItem>
                <SelectItem value="contacted">Contacté</SelectItem>
                <SelectItem value="converted">Converti</SelectItem>
                <SelectItem value="lost">Perdu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les demandes</CardTitle>
          <CardDescription>
            Liste de toutes vos demandes et communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune demande trouvée.</p>
              </div>
            ) : (
              filteredLeads.map((lead: Lead) => {
                const leadType = determineType(lead);
                
                return (
                  <div key={lead.id} className="border rounded-lg hover:bg-muted/50 transition-colors">
                    {/* Version Desktop */}
                    <div className="hidden md:flex items-start justify-between p-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{lead.clientName}</h3>
                            {getTypeBadge(leadType)}
                            {getStatusBadge(lead.status)}
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">{lead.projectType}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{lead.notes || 'Aucune description fournie'}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{lead.clientEmail}</span>
                            <span>•</span>
                            <span>{lead.clientPhone}</span>
                            <span>•</span>
                            <span>{formatDate(lead.createdAt)}</span>
                            {lead.city && (
                              <>
                                <span>•</span>
                                <span>{lead.city}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Voir les détails"
                          onClick={() => handleViewLead(lead)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Appeler le client"
                          onClick={() => window.open(`tel:${lead.clientPhone}`, '_self')}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Envoyer un email"
                          onClick={() => handleSendEmail(lead)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Version Mobile */}
                    <div className="md:hidden p-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{lead.clientName}</h3>
                          <p className="text-xs text-muted-foreground truncate">{lead.projectType}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-2 flex-shrink-0"
                          onClick={() => handleViewLead(lead)}
                        >
                          Voir
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {getTypeBadge(leadType)}
                        {getStatusBadge(lead.status)}
                      </div>
                      
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="truncate">{lead.clientEmail}</div>
                        <div className="truncate">{lead.clientPhone}</div>
                        <div className="flex items-center justify-between">
                          <span>{formatDate(lead.createdAt)}</span>
                          {lead.city && <span>{lead.city}</span>}
                        </div>
                      </div>
                      
                      {lead.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-2 bg-gray-50 p-2 rounded">
                          {lead.notes}
                        </p>
                      )}
                      
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => handleSendEmail(lead)}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => window.open(`tel:${lead.clientPhone}`, '_self')}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Appeler
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Drawer pour voir les détails d'un lead */}
      <Sheet open={isLeadDetailOpen} onOpenChange={setIsLeadDetailOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="pb-6">
            <SheetTitle>Détails de la demande</SheetTitle>
            <SheetDescription>
              Informations complètes du client et du projet
            </SheetDescription>
          </SheetHeader>
          {selectedLead && (
            <>
              <div className="space-y-6 px-6">
                {/* Informations client */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 border-b pb-2">Informations client</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nom du client</Label>
                      <p className="text-base font-medium mt-1">{selectedLead.clientName}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="text-sm mt-1 break-all">{selectedLead.clientEmail}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                        <p className="text-sm mt-1">{selectedLead.clientPhone || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations projet */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 border-b pb-2">Détails du projet</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type de projet</Label>
                      <p className="text-sm mt-1">{selectedLead.projectType || 'Non renseigné'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Ville</Label>
                        <p className="text-sm mt-1">{selectedLead.city || 'Non renseignée'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                        <p className="text-sm mt-1">{selectedLead.budget || 'Non renseigné'}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-muted-foreground">Notes / Description</Label>
                        {!editingNotes ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingNotes(true);
                              setNotesValue(selectedLead.notes || "");
                            }}
                            className="text-xs h-6 px-2"
                          >
                            Modifier
                          </Button>
                        ) : (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateNotes(selectedLead.id, notesValue)}
                              className="text-xs h-6 px-2 text-green-600"
                            >
                              Sauver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingNotes(false);
                                setNotesValue(selectedLead.notes || "");
                              }}
                              className="text-xs h-6 px-2 text-red-600"
                            >
                              Annuler
                            </Button>
                          </div>
                        )}
                      </div>
                      {editingNotes ? (
                        <Textarea
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          placeholder="Ajoutez vos notes ici..."
                          className="mt-1 min-h-[80px]"
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm mt-1 whitespace-pre-wrap bg-slate-50 p-3 rounded-md min-h-[80px]">
                          {selectedLead.notes || 'Aucune note'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gestion */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 border-b pb-2">Gestion</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                      <Select
                        value={selectedLead.status}
                        onValueChange={(value) => handleUpdateStatus(selectedLead.id, value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nouveau</SelectItem>
                          <SelectItem value="contacted">Contacté</SelectItem>
                          <SelectItem value="converted">Converti</SelectItem>
                          <SelectItem value="lost">Perdu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Source</Label>
                        <p className="text-sm mt-1 capitalize">{selectedLead.source}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Date de création</Label>
                        <p className="text-sm mt-1">{formatDate(selectedLead.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-4 px-6">
                <Button 
                  onClick={() => handleSendEmail(selectedLead)}
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open(`tel:${selectedLead.clientPhone}`, '_self')}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Modale pour envoyer un email */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Envoyer un email</DialogTitle>
            <DialogDescription>
              {selectedLead && `Envoyer un email à ${selectedLead.clientName} (${selectedLead.clientEmail})`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Message d'état */}
            {emailMessage && (
              <div className={`p-3 rounded-md text-sm ${
                emailMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {emailMessage.text}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="emailSubject">Objet</Label>
              <Input
                id="emailSubject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                placeholder="Objet de l'email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailContent">Message</Label>
              <Textarea
                id="emailContent"
                value={emailForm.content}
                onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                placeholder="Votre message..."
                rows={8}
              />
            </div>
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

        </TabsContent>

        {/* Onglet Appels d'offres */}
        <TabsContent value="bought" className="space-y-6">
          {loadingBought ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Chargement des appels d'offres...</p>
              </div>
            </div>
          ) : boughtLeads.length === 0 ? (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun appel d'offres
                </h3>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore répondu à d'appels d'offres via la bourse au travail.
                </p>
                <Button asChild>
                  <a href="/dashboard/marketplace">
                    Voir la bourse au travail
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {boughtLeads.map((lead) => (
                <div key={lead.id} className="border rounded-lg hover:bg-muted/50 transition-colors">
                  {/* Version Desktop */}
                  <div className="hidden md:flex items-start justify-between p-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{lead.clientName || 'Client anonyme'}</h3>
                          <Badge className="bg-orange-100 text-orange-800">
                            Appel d'offres
                          </Badge>
                          <Badge className={
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {lead.status === 'new' ? 'Nouveau' :
                             lead.status === 'contacted' ? 'Contacté' :
                             lead.status === 'converted' ? 'Converti' : 'Perdu'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{lead.projectType}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{lead.notes || 'Aucune note'}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{lead.clientEmail}</span>
                          <span>•</span>
                          <span>{lead.clientPhone}</span>
                          <span>•</span>
                          <span>{lead.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}</span>
                          {lead.city && (
                            <>
                              <span>•</span>
                              <span>{lead.city}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Appeler le client"
                        onClick={() => window.open(`tel:${lead.clientPhone}`, '_self')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Envoyer un email"
                        onClick={() => window.open(`mailto:${lead.clientEmail}`, '_blank')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleUpdateBoughtLeadStatus(lead.id, value as "new" | "contacted" | "converted" | "lost")}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Nouveau</SelectItem>
                          <SelectItem value="contacted">Contacté</SelectItem>
                          <SelectItem value="converted">Converti</SelectItem>
                          <SelectItem value="lost">Perdu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Version Mobile */}
                  <div className="md:hidden p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{lead.clientName || 'Client anonyme'}</h3>
                        <p className="text-sm text-muted-foreground">{lead.projectType}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          Appel d'offres
                        </Badge>
                        <Badge className={
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {lead.status === 'new' ? 'Nouveau' :
                           lead.status === 'contacted' ? 'Contacté' :
                           lead.status === 'converted' ? 'Converti' : 'Perdu'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{lead.clientEmail}</div>
                      <div>{lead.clientPhone}</div>
                      <div>{lead.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'} {lead.city && `• ${lead.city}`}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(`tel:${lead.clientPhone}`, '_self')}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Appeler
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(`mailto:${lead.clientEmail}`, '_blank')}
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                    
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleUpdateBoughtLeadStatus(lead.id, value as "new" | "contacted" | "converted" | "lost")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nouveau</SelectItem>
                        <SelectItem value="contacted">Contacté</SelectItem>
                        <SelectItem value="converted">Converti</SelectItem>
                        <SelectItem value="lost">Perdu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
