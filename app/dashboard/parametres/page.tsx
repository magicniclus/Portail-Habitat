"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Key,
  Mail,
  Globe
} from "lucide-react";
import { onAuthStateChanged, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, query, where, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getArtisanPreferencesWithDefaults } from "@/lib/artisan-preferences";

export default function ParametresPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [artisanData, setArtisanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [emailData, setEmailData] = useState({
    newEmail: "",
    password: ""
  });

  const [notifications, setNotifications] = useState({
    emailLeads: true,
    emailReviews: true,
    emailMarketing: false,
    pushNotifications: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showPhone: true,
    showEmail: false,
    allowDirectContact: true
  });

  // Récupérer l'utilisateur connecté et ses données
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          // Chercher l'artisan correspondant à cet utilisateur
          const artisansRef = collection(db, 'artisans');
          const q = query(artisansRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const artisanDoc = querySnapshot.docs[0];
            const data = { id: artisanDoc.id, ...artisanDoc.data() } as any;
            setArtisanData(data);
            
            // Charger les préférences avec les valeurs par défaut si elles n'existent pas
            const preferences = getArtisanPreferencesWithDefaults(data);
            setNotifications(preferences.notifications);
            setPrivacy(preferences.privacy);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      } else {
        setCurrentUser(null);
        setArtisanData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      setSaveMessage({ type: 'error', text: 'Veuillez saisir votre mot de passe actuel' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setSaving(true);
    try {
      if (currentUser) {
        // Ré-authentifier l'utilisateur avec son mot de passe actuel
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          passwordData.currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
        
        // Maintenant changer le mot de passe
        await updatePassword(currentUser, passwordData.newPassword);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setSaveMessage({ type: 'success', text: 'Mot de passe modifié avec succès. Redirection...' });
        
        // Attendre un peu pour que l'utilisateur voie le message de succès
        setTimeout(async () => {
          // Déconnecter l'utilisateur
          await signOut(auth);
          // Rediriger vers la page de connexion
          router.push('/connexion-pro');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      if (error.code === 'auth/wrong-password') {
        setSaveMessage({ type: 'error', text: 'Mot de passe actuel incorrect' });
      } else if (error.code === 'auth/weak-password') {
        setSaveMessage({ type: 'error', text: 'Le nouveau mot de passe est trop faible' });
      } else {
        setSaveMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' });
      }
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }
    setSaving(false);
    // Ne pas supprimer le message de succès car on va rediriger
  };

  // Vérifier si les mots de passe correspondent et sont valides
  const isPasswordValid = passwordData.currentPassword !== "" &&
                         passwordData.newPassword.length >= 6 && 
                         passwordData.newPassword === passwordData.confirmPassword &&
                         passwordData.newPassword !== "";

  const handleChangeEmail = async () => {
    if (!emailData.newEmail || !emailData.password) {
      setSaveMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    setSaving(true);
    try {
      if (currentUser) {
        await updateEmail(currentUser, emailData.newEmail);
        
        // Mettre à jour l'email dans Firestore aussi
        if (artisanData?.id) {
          const artisanRef = doc(db, 'artisans', artisanData.id);
          await updateDoc(artisanRef, {
            email: emailData.newEmail,
            updatedAt: new Date()
          });
        }
        
        setEmailData({ newEmail: "", password: "" });
        setSaveMessage({ type: 'success', text: 'Email modifié avec succès' });
      }
    } catch (error) {
      console.error('Erreur lors du changement d\'email:', error);
      setSaveMessage({ type: 'error', text: 'Erreur lors du changement d\'email' });
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleSaveNotifications = async () => {
    if (!artisanData?.id) return;
    
    setSaving(true);
    try {
      const artisanRef = doc(db, 'artisans', artisanData.id);
      await updateDoc(artisanRef, {
        notifications: notifications,
        updatedAt: new Date()
      });
      
      setSaveMessage({ type: 'success', text: 'Préférences de notifications sauvegardées' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleSavePrivacy = async () => {
    if (!artisanData?.id) return;
    
    setSaving(true);
    try {
      const artisanRef = doc(db, 'artisans', artisanData.id);
      await updateDoc(artisanRef, {
        privacy: privacy,
        updatedAt: new Date()
      });
      
      setSaveMessage({ type: 'success', text: 'Paramètres de confidentialité sauvegardés' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !artisanData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Vous devez être connecté pour accéder aux paramètres.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences de compte et de sécurité
        </p>
      </div>

      {/* Message de sauvegarde */}
      {saveMessage && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          saveMessage.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Sécurité</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Changement de mot de passe */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Changer le mot de passe</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Votre mot de passe actuel"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Minimum 6 caractères"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Retapez le nouveau mot de passe"
                  />
                </div>
                <Button 
                  onClick={handleChangePassword}
                  disabled={isSaving || !isPasswordValid}
                  className="w-full"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Changer le mot de passe
                </Button>
              </div>
            </div>

            {/* Changement d'email */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="font-medium flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Changer l'email</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <Label>Email actuel</Label>
                  <Input value={currentUser.email} disabled />
                </div>
                <div>
                  <Label htmlFor="newEmail">Nouvel email</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                    placeholder="nouveau@email.com"
                  />
                </div>
                <Button 
                  onClick={handleChangeEmail}
                  disabled={isSaving || !emailData.newEmail}
                  className="w-full"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Changer l'email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailLeads">Nouvelles demandes</Label>
                  <p className="text-sm text-gray-600">Recevoir un email pour chaque nouvelle demande</p>
                </div>
                <Switch
                  id="emailLeads"
                  checked={notifications.emailLeads}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailLeads: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailReviews">Nouveaux avis</Label>
                  <p className="text-sm text-gray-600">Recevoir un email pour chaque nouvel avis</p>
                </div>
                <Switch
                  id="emailReviews"
                  checked={notifications.emailReviews}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailReviews: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailMarketing">Emails marketing</Label>
                  <p className="text-sm text-gray-600">Conseils, nouveautés et offres spéciales</p>
                </div>
                <Switch
                  id="emailMarketing"
                  checked={notifications.emailMarketing}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailMarketing: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Notifications push</Label>
                  <p className="text-sm text-gray-600">Notifications dans le navigateur</p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>
            </div>

            <Button 
              onClick={handleSaveNotifications}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sauvegarder les préférences
            </Button>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Confidentialité</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profileVisible">Profil visible</Label>
                  <p className="text-sm text-gray-600">Votre profil apparaît dans les recherches</p>
                </div>
                <Switch
                  id="profileVisible"
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showPhone">Afficher le téléphone</Label>
                  <p className="text-sm text-gray-600">Les clients peuvent voir votre numéro</p>
                </div>
                <Switch
                  id="showPhone"
                  checked={privacy.showPhone}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showPhone: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showEmail">Afficher l'email</Label>
                  <p className="text-sm text-gray-600">Les clients peuvent voir votre email</p>
                </div>
                <Switch
                  id="showEmail"
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showEmail: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowDirectContact">Contact direct</Label>
                  <p className="text-sm text-gray-600">Autoriser le contact direct sans formulaire</p>
                </div>
                <Switch
                  id="allowDirectContact"
                  checked={privacy.allowDirectContact}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowDirectContact: checked }))}
                />
              </div>
            </div>

            <Button 
              onClick={handleSavePrivacy}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sauvegarder les paramètres
            </Button>
          </CardContent>
        </Card>

        {/* Abonnement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Abonnement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Statut de l'abonnement</Label>
                <div className="mt-1">
                  <Badge variant={artisanData.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                    {artisanData.subscriptionStatus === 'active' ? 'Actif' : 
                     artisanData.subscriptionStatus === 'canceled' ? 'Annulé' :
                     artisanData.subscriptionStatus === 'past_due' ? 'En retard' : 'Inactif'}
                  </Badge>
                </div>
              </div>

              {artisanData.monthlySubscriptionPrice && (
                <div>
                  <Label>Prix mensuel</Label>
                  <p className="text-lg font-semibold">{artisanData.monthlySubscriptionPrice}€/mois</p>
                </div>
              )}

              {artisanData.currentPeriodEnd && (
                <div>
                  <Label>Prochaine facturation</Label>
                  <p className="text-gray-900">
                    {new Date(artisanData.currentPeriodEnd.toDate()).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}

              <div>
                <Label>Site premium</Label>
                <div className="mt-1">
                  <Badge variant={artisanData.hasPremiumSite ? 'default' : 'secondary'}>
                    {artisanData.hasPremiumSite ? 'Activé' : 'Non activé'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
