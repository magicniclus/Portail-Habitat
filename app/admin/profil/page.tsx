"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditableField from "@/components/admin/EditableField";
import EditableSelect from "@/components/admin/EditableSelect";
import { 
  User,
  Mail,
  Shield,
  Settings,
  Calendar,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Key,
  Bell
} from "lucide-react";

interface AdminProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLogin?: any;
  createdAt: any;
  updatedAt?: any;
  // Préférences
  notifications?: {
    email: boolean;
    newUsers: boolean;
    newProjects: boolean;
    reports: boolean;
  };
  settings?: {
    theme: 'light' | 'dark' | 'system';
    language: 'fr' | 'en';
    timezone: string;
  };
}

const ADMIN_ROLES = [
  { value: 'super_admin', label: 'Super Administrateur' },
  { value: 'admin', label: 'Administrateur' },
  { value: 'moderator', label: 'Modérateur' }
];

const THEMES = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'system', label: 'Système' }
];

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' }
];

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const currentAdmin = await getCurrentAdmin();
      
      if (!currentAdmin) {
        router.push('/connexion-admin');
        return;
      }

      // Charger le profil complet depuis Firestore
      const profileDoc = await getDoc(doc(db, "admins", currentAdmin.uid));
      
      if (profileDoc.exists()) {
        const profileData = { id: profileDoc.id, ...profileDoc.data() } as AdminProfile;
        setProfile(profileData);
        
        // Vérifier les permissions d'édition
        const hasEditPermission = await hasPermission(ADMIN_PERMISSIONS.MANAGE_ADMINS);
        setCanEdit(hasEditPermission || profileData.id === currentAdmin.uid); // Peut toujours éditer son propre profil
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (field: string, value: any) => {
    if (!profile || !canEdit) return;

    try {
      await updateDoc(doc(db, "admins", profile.id), {
        [field]: value,
        updatedAt: new Date()
      });
      
      setProfile({
        ...profile,
        [field]: value,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const updateNestedField = async (parentField: string, childField: string, value: any) => {
    if (!profile || !canEdit) return;

    try {
      const updatedParent = {
        ...profile[parentField as keyof AdminProfile],
        [childField]: value
      };

      await updateDoc(doc(db, "admins", profile.id), {
        [parentField]: updatedParent,
        updatedAt: new Date()
      });
      
      setProfile({
        ...profile,
        [parentField]: updatedParent,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { label: "Super Admin", className: "bg-red-100 text-red-800" },
      admin: { label: "Admin", className: "bg-blue-100 text-blue-800" },
      moderator: { label: "Modérateur", className: "bg-green-100 text-green-800" }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || 
                   { label: role, className: "bg-gray-100 text-gray-800" };
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil non trouvé</h2>
        <Button onClick={() => router.push('/admin')}>
          Retour au dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>
        
        <div className="flex items-center gap-2">
          {getRoleBadge(profile.role)}
          {profile.isActive ? (
            <Badge className="bg-green-100 text-green-800">Actif</Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">Inactif</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField
                  label="Prénom"
                  value={profile.firstName || ''}
                  onSave={(value) => updateField('firstName', value)}
                  placeholder="Votre prénom"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Nom"
                  value={profile.lastName || ''}
                  onSave={(value) => updateField('lastName', value)}
                  placeholder="Votre nom"
                  disabled={!canEdit}
                />

                <EditableField
                  label="Email"
                  value={profile.email}
                  onSave={(value) => updateField('email', value)}
                  type="email"
                  placeholder="votre.email@exemple.com"
                  disabled={!canEdit}
                />

                <EditableSelect
                  label="Rôle"
                  value={profile.role}
                  options={ADMIN_ROLES}
                  onSave={(value) => updateField('role', value)}
                  placeholder="Sélectionner un rôle"
                  disabled={!canEdit}
                  renderValue={(value) => getRoleBadge(value)}
                />
              </CardContent>
            </Card>

            {/* Informations système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ID Administrateur</label>
                  <div className="mt-1 text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                    {profile.id}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Dernière connexion</label>
                  <div className="mt-1 text-sm text-gray-600">
                    {profile.lastLogin?.toDate?.()?.toLocaleString('fr-FR') || 'Jamais'}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Compte créé le</label>
                  <div className="mt-1 text-sm text-gray-600">
                    {profile.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                  </div>
                </div>

                {profile.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dernière modification</label>
                    <div className="mt-1 text-sm text-gray-600">
                      {profile.updatedAt?.toDate?.()?.toLocaleString('fr-FR')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Permissions */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permissions
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPermissions(!showPermissions)}
                >
                  {showPermissions ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Afficher
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {profile.permissions?.length || 0} permission(s)
                </Badge>
              </div>
              
              {showPermissions && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {profile.permissions?.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  )) || (
                    <p className="text-gray-500 col-span-full">Aucune permission spécifique</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notifications par email</label>
                    <p className="text-xs text-gray-500">Recevoir les notifications importantes par email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notifications?.email || false}
                    onChange={(e) => updateNestedField('notifications', 'email', e.target.checked)}
                    disabled={!canEdit}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nouveaux utilisateurs</label>
                    <p className="text-xs text-gray-500">Notification lors de l'inscription d'un nouvel utilisateur</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notifications?.newUsers || false}
                    onChange={(e) => updateNestedField('notifications', 'newUsers', e.target.checked)}
                    disabled={!canEdit}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nouveaux projets</label>
                    <p className="text-xs text-gray-500">Notification lors de la création d'un nouveau projet</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notifications?.newProjects || false}
                    onChange={(e) => updateNestedField('notifications', 'newProjects', e.target.checked)}
                    disabled={!canEdit}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rapports</label>
                    <p className="text-xs text-gray-500">Recevoir les rapports hebdomadaires et mensuels</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notifications?.reports || false}
                    onChange={(e) => updateNestedField('notifications', 'reports', e.target.checked)}
                    disabled={!canEdit}
                    className="rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres d'interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EditableSelect
                label="Thème"
                value={profile.settings?.theme || 'system'}
                options={THEMES}
                onSave={(value) => updateNestedField('settings', 'theme', value)}
                placeholder="Sélectionner un thème"
                disabled={!canEdit}
              />

              <EditableSelect
                label="Langue"
                value={profile.settings?.language || 'fr'}
                options={LANGUAGES}
                onSave={(value) => updateNestedField('settings', 'language', value)}
                placeholder="Sélectionner une langue"
                disabled={!canEdit}
              />

              <EditableField
                label="Fuseau horaire"
                value={profile.settings?.timezone || 'Europe/Paris'}
                onSave={(value) => updateNestedField('settings', 'timezone', value)}
                placeholder="Europe/Paris"
                disabled={!canEdit}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
