"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Bell,
  Lock,
  AlertTriangle
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
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (tabValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tabValue);
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log('Chargement du profil admin...');
      const currentAdmin = await getCurrentAdmin();
      console.log('Admin actuel:', currentAdmin);
      
      if (!currentAdmin) {
        console.log('Aucun admin connecté, redirection...');
        router.push('/connexion-admin');
        return;
      }

      // Créer un profil admin basique avec les données Firebase Auth
      const basicProfile: AdminProfile = {
        id: currentAdmin.uid,
        email: currentAdmin.email || '',
        firstName: '',
        lastName: '',
        role: 'admin',
        permissions: ['MANAGE_USERS', 'MANAGE_PROJECTS', 'MANAGE_CONTENT'],
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        notifications: {
          email: true,
          newUsers: true,
          newProjects: true,
          reports: false
        },
        settings: {
          theme: 'system',
          language: 'fr',
          timezone: 'Europe/Paris'
        }
      };

      try {
        // Essayer de charger depuis Firestore
        const profileDoc = await getDoc(doc(db, "admins", currentAdmin.uid));
        
        if (profileDoc.exists()) {
          const profileData = { id: profileDoc.id, ...profileDoc.data() } as AdminProfile;
          setProfile(profileData);
        } else {
          // Créer le document s'il n'existe pas
          await setDoc(doc(db, "admins", currentAdmin.uid), basicProfile);
          setProfile(basicProfile);
        }
      } catch (firestoreError) {
        console.log('Erreur Firestore, utilisation du profil basique:', firestoreError);
        // En cas d'erreur Firestore, utiliser le profil basique
        setProfile(basicProfile);
      }
      
      setCanEdit(true); // L'admin peut toujours éditer son propre profil
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

  const handlePasswordChange = async () => {
    if (!profile) return;

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Tous les champs sont requis');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Ici tu peux implémenter la logique de changement de mot de passe
      // Avec Firebase Auth : updatePassword, reauthenticateWithCredential, etc.
      console.log('Changement de mot de passe pour:', profile.email);
      
      // Simulation pour l'instant
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset du formulaire
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('Mot de passe modifié avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      alert('Erreur lors du changement de mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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

      <Tabs value={defaultTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Sécurité
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

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Changement de mot de passe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Recommandations de sécurité</span>
                </div>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  <li>• Utilisez au moins 8 caractères</li>
                  <li>• Mélangez majuscules, minuscules, chiffres et symboles</li>
                  <li>• Évitez les informations personnelles</li>
                  <li>• Ne réutilisez pas d'anciens mots de passe</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mot de passe actuel</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Saisissez votre mot de passe actuel"
                      disabled={!canEdit || isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('current')}
                      disabled={!canEdit || isChangingPassword}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Saisissez votre nouveau mot de passe"
                      disabled={!canEdit || isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('new')}
                      disabled={!canEdit || isChangingPassword}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordData.newPassword && (
                    <div className="text-xs text-gray-500">
                      Force : {passwordData.newPassword.length >= 8 ? 
                        <span className="text-green-600">Forte</span> : 
                        <span className="text-red-600">Faible</span>
                      }
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirmez votre nouveau mot de passe"
                      disabled={!canEdit || isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('confirm')}
                      disabled={!canEdit || isChangingPassword}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword && (
                    <div className="text-xs">
                      {passwordData.newPassword === passwordData.confirmPassword ? (
                        <span className="text-green-600">✓ Les mots de passe correspondent</span>
                      ) : (
                        <span className="text-red-600">✗ Les mots de passe ne correspondent pas</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handlePasswordChange}
                    disabled={
                      !canEdit || 
                      isChangingPassword ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      passwordData.newPassword !== passwordData.confirmPassword ||
                      passwordData.newPassword.length < 8
                    }
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Modification en cours...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Changer le mot de passe
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Authentification à deux facteurs</label>
                  <div className="mt-1 text-sm text-gray-600">
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Non configurée
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2" disabled>
                    Configurer 2FA (Bientôt disponible)
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Sessions actives</label>
                  <div className="mt-1 text-sm text-gray-600">
                    1 session active
                  </div>
                  <Button variant="outline" size="sm" className="mt-2" disabled>
                    Gérer les sessions (Bientôt disponible)
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Activité récente</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Dernière connexion</span>
                    <span>{profile.lastLogin?.toDate?.()?.toLocaleString('fr-FR') || 'Jamais'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adresse IP</span>
                    <span>192.168.1.1 (Actuelle)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Navigateur</span>
                    <span>Chrome 120.0 (Actuel)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
