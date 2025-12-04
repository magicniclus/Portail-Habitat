"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, query, where, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { uploadLogoPhoto } from "@/lib/storage";

export default function ProfilPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [artisanData, setArtisanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    siret: "",
    city: "",
    postalCode: "",
    fullAddress: "",
    profession: "",
    averageQuoteMin: 0,
    averageQuoteMax: 0
  });

  // Récupérer l'utilisateur connecté et ses données artisan
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
            setFormData({
              companyName: data.companyName || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              phone: data.phone || "",
              email: data.email || "",
              siret: data.siret || "",
              city: data.city || "",
              postalCode: data.postalCode || "",
              fullAddress: data.fullAddress || "",
              profession: data.profession || "",
              averageQuoteMin: data.averageQuoteMin || 0,
              averageQuoteMax: data.averageQuoteMax || 0
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données artisan:', error);
        }
      } else {
        setCurrentUser(null);
        setArtisanData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (field: string) => {
    if (!artisanData?.id) return;
    
    setIsSaving(true);
    try {
      const artisanRef = doc(db, 'artisans', artisanData.id);
      await updateDoc(artisanRef, {
        [field]: formData[field as keyof typeof formData],
        updatedAt: new Date()
      });
      
      setArtisanData((prev: any) => ({
        ...prev,
        [field]: formData[field as keyof typeof formData]
      }));
      
      setIsEditing(null);
      setSaveMessage({ type: 'success', text: 'Modification enregistrée avec succès' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
    setIsSaving(false);
  };

  const handleSaveQuoteRange = async () => {
    if (!artisanData?.id) return;
    
    setIsSaving(true);
    try {
      const artisanRef = doc(db, 'artisans', artisanData.id);
      await updateDoc(artisanRef, {
        averageQuoteMin: formData.averageQuoteMin,
        averageQuoteMax: formData.averageQuoteMax,
        updatedAt: new Date()
      });
      
      setArtisanData((prev: any) => ({
        ...prev,
        averageQuoteMin: formData.averageQuoteMin,
        averageQuoteMax: formData.averageQuoteMax
      }));
      
      setIsEditing(null);
      setSaveMessage({ type: 'success', text: 'Fourchette de prix mise à jour' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
    setIsSaving(false);
  };

  const handleLogoUpload = async (file: File) => {
    if (!artisanData?.id) return;
    
    setIsUploadingLogo(true);
    try {
      const logoUrl = await uploadLogoPhoto(artisanData.id, file);
      
      const artisanRef = doc(db, 'artisans', artisanData.id);
      await updateDoc(artisanRef, {
        logoUrl: logoUrl,
        updatedAt: new Date()
      });
      
      setArtisanData((prev: any) => ({
        ...prev,
        logoUrl: logoUrl
      }));
      
      setSaveMessage({ type: 'success', text: 'Logo mis à jour avec succès' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'upload du logo:', error);
      setSaveMessage({ type: 'error', text: 'Erreur lors de l\'upload du logo' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
    setIsUploadingLogo(false);
  };

  const renderEditableField = (
    field: string,
    label: string,
    value: string | number,
    type: 'text' | 'email' | 'tel' | 'number' | 'textarea' = 'text',
    placeholder?: string
  ) => {
    const isCurrentlyEditing = isEditing === field;
    
    return (
      <div className="space-y-2">
        <Label htmlFor={field}>{label}</Label>
        <div className="flex items-center space-x-2">
          {isCurrentlyEditing ? (
            <div className="flex-1 flex items-center space-x-2">
              {type === 'textarea' ? (
                <Textarea
                  id={field}
                  value={formData[field as keyof typeof formData] as string}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                />
              ) : (
                <Input
                  id={field}
                  type={type}
                  value={formData[field as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field, type === 'number' ? Number(e.target.value) : e.target.value)}
                  placeholder={placeholder}
                />
              )}
              <Button
                size="sm"
                onClick={() => handleSave(field)}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(null);
                  setFormData(prev => ({
                    ...prev,
                    [field]: artisanData[field] || ""
                  }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-gray-900">
                {value || <span className="text-gray-400 italic">Non renseigné</span>}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(field)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !artisanData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Vous devez être connecté pour voir votre profil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et professionnelles
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
        {/* Informations entreprise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Informations entreprise</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo */}
            <div className="space-y-2">
              <Label>Logo de l'entreprise</Label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {artisanData.logoUrl ? (
                    <img
                      src={artisanData.logoUrl}
                      alt="Logo"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={isUploadingLogo}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Changer le logo
                  </Button>
                </div>
              </div>
            </div>

            {renderEditableField('companyName', 'Nom de l\'entreprise', artisanData.companyName)}
            {renderEditableField('siret', 'SIRET', artisanData.siret, 'text', '12345678901234')}
            {renderEditableField('profession', 'Métier principal', artisanData.profession)}
          </CardContent>
        </Card>

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderEditableField('firstName', 'Prénom', artisanData.firstName)}
            {renderEditableField('lastName', 'Nom', artisanData.lastName)}
            {renderEditableField('email', 'Email', artisanData.email, 'email')}
            {renderEditableField('phone', 'Téléphone', artisanData.phone, 'tel', '06 12 34 56 78')}
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Adresse</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderEditableField('fullAddress', 'Adresse complète', artisanData.fullAddress, 'text', '123 rue de la République')}
            {renderEditableField('postalCode', 'Code postal', artisanData.postalCode, 'text', '33000')}
            {renderEditableField('city', 'Ville', artisanData.city)}
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card>
          <CardHeader>
            <CardTitle>Fourchette de prix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing === 'quoteRange' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quoteMin">Prix minimum (€)</Label>
                    <Input
                      id="quoteMin"
                      type="number"
                      value={formData.averageQuoteMin}
                      onChange={(e) => handleInputChange('averageQuoteMin', Number(e.target.value))}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quoteMax">Prix maximum (€)</Label>
                    <Input
                      id="quoteMax"
                      type="number"
                      value={formData.averageQuoteMax}
                      onChange={(e) => handleInputChange('averageQuoteMax', Number(e.target.value))}
                      placeholder="5000"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSaveQuoteRange}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(null);
                      setFormData(prev => ({
                        ...prev,
                        averageQuoteMin: artisanData.averageQuoteMin || 0,
                        averageQuoteMax: artisanData.averageQuoteMax || 0
                      }));
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  {artisanData.averageQuoteMin && artisanData.averageQuoteMax ? (
                    <p className="text-lg font-medium">
                      {artisanData.averageQuoteMin}€ - {artisanData.averageQuoteMax}€
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Fourchette non renseignée</p>
                  )}
                  <p className="text-sm text-gray-600">Fourchette de prix pour vos devis</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing('quoteRange')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {artisanData.reviewCount || 0}
              </div>
              <div className="text-sm text-gray-600">Avis clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {artisanData.averageRating ? artisanData.averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {artisanData.totalLeads || 0}
              </div>
              <div className="text-sm text-gray-600">Demandes totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {artisanData.publishedPostsCount || 0}
              </div>
              <div className="text-sm text-gray-600">Projets publiés</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
