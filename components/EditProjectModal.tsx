"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, X, Loader2 } from "lucide-react";

// Composant pour gérer le chargement des images avec skeleton
function ImageWithSkeleton({ 
  src, 
  alt, 
  onRemove, 
  className = "w-full h-24 object-cover rounded-lg" 
}: { 
  src: string; 
  alt: string; 
  onRemove: () => void; 
  className?: string; 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative group">
      {isLoading && (
        <Skeleton className="w-full h-24 rounded-lg absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {hasError && (
        <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-500">Erreur de chargement</span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

interface EditProjectModalProps {
  project: {
    id: string;
    title: string;
    description: string;
    city: string;
    projectType: string;
    photos: string[];
    isPubliclyVisible: boolean;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectId: string, projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    newPhotos: File[];
    existingPhotos: string[];
  }) => Promise<void>;
}

export default function EditProjectModal({ project, isOpen, onClose, onSave }: EditProjectModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    projectType: "",
    isPubliclyVisible: true,
  });
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

  // Initialiser le formulaire quand le projet change
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        city: project.city,
        projectType: project.projectType,
        isPubliclyVisible: project.isPubliclyVisible,
      });
      setExistingPhotos(project.photos);
    }
  }, [project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Certains fichiers ont été ignorés (format non supporté ou taille > 5MB)');
    }

    // Limiter le total à 10 images
    const totalPhotos = existingPhotos.length + newFiles.length + validFiles.length;
    const allowedNewFiles = totalPhotos <= 10 ? validFiles : validFiles.slice(0, 10 - existingPhotos.length - newFiles.length);
    
    if (allowedNewFiles.length !== validFiles.length) {
      alert('Limite de 10 images atteinte');
    }

    const updatedNewFiles = [...newFiles, ...allowedNewFiles];
    setNewFiles(updatedNewFiles);

    // Créer les URLs de prévisualisation pour les nouvelles images
    const newUrls = updatedNewFiles.map(file => URL.createObjectURL(file));
    // Nettoyer les anciennes URLs
    newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setNewPreviewUrls(newUrls);
  };

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    const newFilesUpdated = newFiles.filter((_, i) => i !== index);
    const newUrlsUpdated = newPreviewUrls.filter((_, i) => i !== index);
    
    // Nettoyer l'URL supprimée
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    setNewFiles(newFilesUpdated);
    setNewPreviewUrls(newUrlsUpdated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project || !formData.title.trim() || !formData.description.trim()) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (existingPhotos.length === 0 && newFiles.length === 0) {
      alert('Veuillez conserver ou ajouter au moins une image.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(project.id, {
        ...formData,
        newPhotos: newFiles,
        existingPhotos: existingPhotos
      });
      
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Nettoyer les URLs de prévisualisation
    newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setNewPreviewUrls([]);
    setNewFiles([]);
    onClose();
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre projet
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Titre du projet *
            </label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Rénovation complète d'une salle de bain"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Description *
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez les travaux réalisés, les matériaux utilisés, les défis rencontrés..."
              rows={4}
              required
            />
          </div>

          {/* Ville et Type de projet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ville
              </label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ex: Paris"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Type de projet
              </label>
              <Input
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                placeholder="Ex: Rénovation salle de bain"
              />
            </div>
          </div>

          {/* Images existantes */}
          {existingPhotos.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Images actuelles
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingPhotos.map((url, index) => (
                  <ImageWithSkeleton
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    onRemove={() => removeExistingPhoto(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ajouter de nouvelles images */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ajouter de nouvelles images (max {10 - existingPhotos.length - newFiles.length} images)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="edit-project-photos"
                disabled={existingPhotos.length + newFiles.length >= 10}
              />
              <label
                htmlFor="edit-project-photos"
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  existingPhotos.length + newFiles.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {existingPhotos.length + newFiles.length >= 10 ? 'Limite atteinte' : 'Cliquez pour ajouter des images'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP - Max 5MB par image
                </span>
              </label>
            </div>

            {/* Prévisualisation des nouvelles images */}
            {newPreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {newPreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Nouvelle image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visibilité publique */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="editIsPubliclyVisible"
              checked={formData.isPubliclyVisible}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isPubliclyVisible: checked as boolean }))
              }
            />
            <label
              htmlFor="editIsPubliclyVisible"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Rendre ce projet visible sur ma fiche publique
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                'Sauvegarder les modifications'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
