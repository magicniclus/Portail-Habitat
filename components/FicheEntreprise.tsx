"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Eye,
  Send,
  Building,
  Camera,
  Upload,
  Loader2,
  Edit,
  Check,
  X,
  Image as ImageIcon
} from "lucide-react";
import ZoneInterventionMap from "./ZoneInterventionMap";
import PrestationsDrawer from "./PrestationsDrawer";
import CertificationsDrawer from "./CertificationsDrawer";
import AddProjectModal from "./AddProjectModal";
import ProjectCard from "./ProjectCard";

interface FicheEntrepriseProps {
  entreprise: {
    id: string;
    nom: string;
    logo?: string;
    banniere?: string;
    specialites: string[];
    description: string;
    telephone: string;
    email: string;
    adresse: string;
    ville: string;
    note: number;
    nombreAvis: number;
    certifications: string[];
    zoneIntervention: string[];
    averageQuoteMin?: number;
    averageQuoteMax?: number;
  };
  showContactForm?: boolean;
  isPreview?: boolean;
  canEdit?: boolean;
  onCoverChange?: (file: File) => Promise<void>;
  onLogoChange?: (file: File) => Promise<void>;
  onDescriptionChange?: (description: string) => Promise<void>;
  onPrestationsChange?: (prestations: string[]) => Promise<void>;
  onQuoteRangeChange?: (min: number, max: number) => Promise<void>;
  onCertificationsChange?: (certifications: string[]) => Promise<void>;
  projects?: any[];
  onAddProject?: (projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    photos: File[];
  }) => Promise<void>;
  onProjectVisibilityToggle?: (projectId: string, isVisible: boolean) => Promise<void>;
  onEditProject?: (projectId: string, projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    newPhotos: File[];
    existingPhotos: string[];
  }) => Promise<void>;
  onDeleteProject?: (projectId: string) => Promise<void>;
}

export default function FicheEntreprise({ 
  entreprise, 
  showContactForm = true, 
  isPreview = false,
  canEdit = false,
  onCoverChange,
  onLogoChange,
  onDescriptionChange,
  onPrestationsChange,
  onQuoteRangeChange,
  onCertificationsChange,
  projects = [],
  onAddProject,
  onProjectVisibilityToggle,
  onEditProject,
  onDeleteProject
}: FicheEntrepriseProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(entreprise.description);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [isCoverLoading, setIsCoverLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isEditingQuoteRange, setIsEditingQuoteRange] = useState(false);
  const [tempQuoteMin, setTempQuoteMin] = useState(entreprise.averageQuoteMin || 0);
  const [tempQuoteMax, setTempQuoteMax] = useState(entreprise.averageQuoteMax || 0);
  const [isSavingQuoteRange, setIsSavingQuoteRange] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Mettre à jour la description temporaire quand la description de l'entreprise change
  useEffect(() => {
    setTempDescription(entreprise.description);
  }, [entreprise.description]);

  // Mettre à jour les prix temporaires quand les prix de l'entreprise changent
  useEffect(() => {
    setTempQuoteMin(entreprise.averageQuoteMin || 0);
    setTempQuoteMax(entreprise.averageQuoteMax || 0);
  }, [entreprise.averageQuoteMin, entreprise.averageQuoteMax]);


  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    description: ""
  });

  const handlePhoneClick = () => {
    if (!showPhone) {
      setShowPhone(true);
    } else {
      window.location.href = `tel:${entreprise.telephone}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire soumis:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverClick = () => {
    if (canEdit && coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onCoverChange) return;

    // Vérifications du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }

    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux. Taille maximale : 5MB.');
      return;
    }

    try {
      setIsUploadingCover(true);
      await onCoverChange(file);
    } catch (error) {
      console.error('Erreur lors du changement de couverture:', error);
      alert('Erreur lors du changement de couverture. Veuillez réessayer.');
    } finally {
      setIsUploadingCover(false);
      // Reset input pour permettre de sélectionner le même fichier
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }
    }
  };

  const handleLogoClick = () => {
    if (canEdit && logoInputRef.current) {
      logoInputRef.current.click();
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onLogoChange) return;

    // Vérifications du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }

    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux. Taille maximale : 5MB.');
      return;
    }

    try {
      setIsUploadingLogo(true);
      await onLogoChange(file);
    } catch (error) {
      console.error('Erreur lors du changement de logo:', error);
      alert('Erreur lors du changement de logo. Veuillez réessayer.');
    } finally {
      setIsUploadingLogo(false);
      // Reset input pour permettre de sélectionner le même fichier
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const handleDescriptionClick = () => {
    if (canEdit && !isEditingDescription) {
      setIsEditingDescription(true);
      setTempDescription(entreprise.description);
    }
  };

  const handleDescriptionSave = async () => {
    if (!onDescriptionChange || tempDescription.trim() === entreprise.description) {
      setIsEditingDescription(false);
      return;
    }

    try {
      setIsSavingDescription(true);
      await onDescriptionChange(tempDescription.trim());
      setIsEditingDescription(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la description:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleDescriptionCancel = () => {
    setTempDescription(entreprise.description);
    setIsEditingDescription(false);
  };

  const handleQuoteRangeClick = () => {
    if (canEdit && !isEditingQuoteRange) {
      setIsEditingQuoteRange(true);
      setTempQuoteMin(entreprise.averageQuoteMin || 0);
      setTempQuoteMax(entreprise.averageQuoteMax || 0);
    }
  };

  const handleQuoteRangeSave = async () => {
    if (!onQuoteRangeChange || (tempQuoteMin === (entreprise.averageQuoteMin || 0) && tempQuoteMax === (entreprise.averageQuoteMax || 0))) {
      setIsEditingQuoteRange(false);
      return;
    }

    if (tempQuoteMin >= tempQuoteMax) {
      alert('Le prix minimum doit être inférieur au prix maximum');
      return;
    }

    try {
      setIsSavingQuoteRange(true);
      await onQuoteRangeChange(tempQuoteMin, tempQuoteMax);
      setIsEditingQuoteRange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des prix:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSavingQuoteRange(false);
    }
  };

  const handleQuoteRangeCancel = () => {
    setTempQuoteMin(entreprise.averageQuoteMin || 0);
    setTempQuoteMax(entreprise.averageQuoteMax || 0);
    setIsEditingQuoteRange(false);
  };


  const getStarRating = (note: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Input files cachés */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleCoverFileChange}
        className="hidden"
      />
      <input
        ref={logoInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleLogoFileChange}
        className="hidden"
      />

      {/* Bannière */}
      <div 
        className={`relative h-64 ${canEdit ? 'cursor-pointer group' : ''}`}
        onClick={handleCoverClick}
      >
        {entreprise.banniere ? (
          <>
            {isCoverLoading && (
              <div className="w-full h-full absolute inset-0 bg-gray-300 animate-pulse" style={{ animationDuration: '2s' }} />
            )}
            <img
              src={entreprise.banniere}
              alt="Bannière entreprise"
              className="w-full h-full object-cover"
              onLoad={() => setIsCoverLoading(false)}
              onError={() => setIsCoverLoading(false)}
              style={{ display: isCoverLoading ? 'none' : 'block' }}
            />
          </>
        ) : null}

        {/* Overlay pour l'édition */}
        {canEdit && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-3">
              {isUploadingCover ? (
                <Loader2 className="h-6 w-6 text-gray-700 animate-spin" />
              ) : (
                <Camera className="h-6 w-6 text-gray-700" />
              )}
            </div>
          </div>
        )}

        {/* Spinner de chargement pour la bannière */}
        {isUploadingCover && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-4">
              <Loader2 className="h-8 w-8 text-gray-700 animate-spin" />
            </div>
          </div>
        )}

        {/* Badge aperçu */}
        {isPreview && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-gray-800">
              <Eye className="h-3 w-3 mr-1" />
              Aperçu
            </Badge>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="relative px-6 pb-6">
        {/* Logo entreprise (chevauchant la bannière) */}
        <div className="relative -mt-12 mb-6">
          <div 
            className={`w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center relative ${canEdit ? 'cursor-pointer group' : ''}`}
            onClick={handleLogoClick}
          >
            {entreprise.logo ? (
              <>
                {isLogoLoading && (
                  <div className="w-20 h-20 rounded-full bg-gray-300 animate-pulse" style={{ animationDuration: '2s' }} />
                )}
                <img
                  src={entreprise.logo}
                  alt={`Logo ${entreprise.nom}`}
                  className="w-20 h-20 rounded-full object-cover"
                  onLoad={() => setIsLogoLoading(false)}
                  onError={() => setIsLogoLoading(false)}
                  style={{ display: isLogoLoading ? 'none' : 'block' }}
                />
              </>
            ) : (
              <Building className="h-12 w-12 text-gray-400" />
            )}
            
            {/* Overlay pour l'édition du logo */}
            {canEdit && !isUploadingLogo && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center rounded-full">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                  <Camera className="h-4 w-4 text-gray-700" />
                </div>
              </div>
            )}

            {/* Spinner de chargement pour le logo */}
            {isUploadingLogo && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Partie gauche - Informations entreprise */}
          <div className="lg:col-span-2 space-y-10">
            {/* Nom et spécialités */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {entreprise.nom ? (
                  <h1 className="text-3xl font-bold text-gray-900">
                    {entreprise.nom}
                  </h1>
                ) : (
                  <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-gray-400">
                      Nom de l'entreprise non défini
                    </h1>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                      Aller aux paramètres
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {entreprise.specialites.map((specialite, index) => (
                  <Badge key={index} variant="secondary" className="text-sm group relative">
                    {specialite}
                    {canEdit && (
                      <button
                        onClick={() => {
                          const newSpecialites = entreprise.specialites.filter((_, i) => i !== index);
                          onPrestationsChange?.(newSpecialites);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {canEdit && onPrestationsChange && (
                  <PrestationsDrawer
                    currentPrestations={entreprise.specialites}
                    onSave={onPrestationsChange}
                  />
                )}
              </div>

              {/* Note et avis */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Avis clients</h3>
                    <p className="text-sm text-gray-600">
                      Découvrez les retours de nos clients satisfaits
                    </p>
                  </div>
                  {entreprise.nombreAvis === 0 && (
                    <div className="text-sm text-gray-500">
                      Soyez le premier à laisser votre avis
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {getStarRating(entreprise.note)}
                      <span className="font-medium ml-2 text-lg">{entreprise.note}/5</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({entreprise.nombreAvis} avis)
                    </span>
                  </div>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                    >
                      Demander des avis
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">À propos</h3>
                  {canEdit && !isEditingDescription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDescriptionClick}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {isEditingDescription ? (
                  <div className="space-y-3">
                    <Textarea
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="min-h-[100px] resize-none"
                      placeholder="Décrivez votre entreprise..."
                      disabled={isSavingDescription}
                    />
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={handleDescriptionSave}
                        disabled={isSavingDescription || tempDescription.trim() === entreprise.description}
                      >
                        {isSavingDescription ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Sauvegarder
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDescriptionCancel}
                        disabled={isSavingDescription}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p 
                      className={`text-gray-600 leading-relaxed ${canEdit ? 'cursor-pointer hover:bg-gray-50 p-2 rounded' : ''}`}
                      onClick={handleDescriptionClick}
                    >
                      {entreprise.description ? (
                        entreprise.description.length > 300 && !isDescriptionExpanded ? (
                          <>
                            {entreprise.description.substring(0, 300)}...
                          </>
                        ) : (
                          entreprise.description
                        )
                      ) : (
                        "Cliquez pour ajouter une description..."
                      )}
                    </p>
                    {entreprise.description && entreprise.description.length > 300 && (
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 flex items-center"
                      >
                        {isDescriptionExpanded ? (
                          <>
                            Voir moins
                            <svg className="w-4 h-4 ml-1 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Voir plus
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Informations et Devis moyen */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                {/* Informations */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Informations</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {(() => {
                          const fullAddress = `${entreprise.adresse}, ${entreprise.ville}`;
                          return fullAddress.startsWith(', ') ? fullAddress.substring(2) : fullAddress;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{entreprise.email}</span>
                    </div>
                  </div>
                </div>

                {/* Devis moyen */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Devis moyen</h3>
                    {canEdit && !isEditingQuoteRange && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleQuoteRangeClick}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {isEditingQuoteRange ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500">Min (€)</label>
                          <Input
                            type="number"
                            value={tempQuoteMin === 0 ? '' : tempQuoteMin}
                            onChange={(e) => setTempQuoteMin(e.target.value === '' ? 0 : Number(e.target.value))}
                            onFocus={(e) => {
                              if (e.target.value === '0') {
                                e.target.value = '';
                              }
                            }}
                            placeholder="Prix min"
                            disabled={isSavingQuoteRange}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Max (€)</label>
                          <Input
                            type="number"
                            value={tempQuoteMax === 0 ? '' : tempQuoteMax}
                            onChange={(e) => setTempQuoteMax(e.target.value === '' ? 0 : Number(e.target.value))}
                            onFocus={(e) => {
                              if (e.target.value === '0') {
                                e.target.value = '';
                              }
                            }}
                            placeholder="Prix max"
                            disabled={isSavingQuoteRange}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={handleQuoteRangeSave}
                          disabled={isSavingQuoteRange || tempQuoteMin >= tempQuoteMax}
                        >
                          {isSavingQuoteRange ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Sauvegarder
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleQuoteRangeCancel}
                          disabled={isSavingQuoteRange}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`text-gray-600 ${canEdit ? 'cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors' : ''}`}
                      onClick={handleQuoteRangeClick}
                    >
                      {((entreprise.averageQuoteMin || 0) > 0 && (entreprise.averageQuoteMax || 0) > 0) ? (
                        <span className="font-medium text-gray-900">
                          {(entreprise.averageQuoteMin || 0).toLocaleString()}€ - {(entreprise.averageQuoteMax || 0).toLocaleString()}€
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          {canEdit ? "Cliquez pour ajouter vos tarifs..." : "Non renseigné"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications & Labels */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Certifications & Labels</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {entreprise.certifications.map((certification, index) => (
                    <Badge key={index} variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 group relative">
                      {certification}
                      {canEdit && (
                        <button
                          onClick={() => {
                            const newCertifications = entreprise.certifications.filter((_, i) => i !== index);
                            onCertificationsChange?.(newCertifications);
                          }}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {canEdit && onCertificationsChange && (
                    <CertificationsDrawer
                      currentCertifications={entreprise.certifications}
                      onSave={onCertificationsChange}
                    />
                  )}
                </div>
              </div>

              {/* Zone d'intervention */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Zone d'intervention</h3>
                
                {/* Petite carte Mapbox */}
                <ZoneInterventionMap 
                  zones={entreprise.zoneIntervention}
                  centerCity={entreprise.ville}
                />
                
                <div className="flex flex-wrap gap-2">
                  {entreprise.zoneIntervention.map((zone, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {zone}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Projets réalisés */}
              <div className="space-y-6 mt-8">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Projets réalisés</h3>
                      <p className="text-sm text-gray-600">
                        Découvrez nos dernières réalisations et notre savoir-faire
                      </p>
                    </div>
                  </div>

                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(showAllProjects ? projects : projects.slice(0, 6)).map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={{
                              ...project,
                              createdAt: project.createdAt?.toDate ? project.createdAt.toDate() : new Date(project.createdAt)
                            }}
                            canEdit={canEdit}
                            onVisibilityToggle={onProjectVisibilityToggle}
                            onEdit={onEditProject}
                            onDelete={onDeleteProject}
                          />
                        ))}
                        {canEdit && onAddProject && (
                          <AddProjectModal onSave={onAddProject} />
                        )}
                      </div>
                      
                      {projects.length > 6 && (
                        <div className="text-center">
                          <Button
                            variant="outline"
                            onClick={() => setShowAllProjects(!showAllProjects)}
                            className="mt-4"
                          >
                            {showAllProjects ? (
                              <>
                                Voir moins
                                <svg className="w-4 h-4 ml-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </>
                            ) : (
                              <>
                                Voir plus ({projects.length - 6} projets)
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {canEdit && onAddProject ? (
                        <div className="max-w-sm mx-auto">
                          <AddProjectModal onSave={onAddProject} />
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm">Aucun projet publié pour le moment</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Partie droite - Formulaire de contact */}
          {showContactForm && (
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Demander un devis</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Input
                          name="prenom"
                          placeholder="Prénom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          name="nom"
                          placeholder="Nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <Input
                      name="telephone"
                      type="tel"
                      placeholder="Téléphone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                    />
                    
                    <Textarea
                      name="description"
                      placeholder="Description de votre projet..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[100px] resize-none"
                      required
                    />
                    
                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer ma demande
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handlePhoneClick}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {showPhone ? entreprise.telephone : "Voir le numéro de téléphone"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
