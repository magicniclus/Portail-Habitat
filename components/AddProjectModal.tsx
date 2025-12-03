"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface AddProjectModalProps {
  onSave: (projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    photos: File[];
  }) => Promise<void>;
}

export default function AddProjectModal({ onSave }: AddProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    projectType: "",
    isPubliclyVisible: true,
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

    // Limiter à 10 images maximum
    const newFiles = [...selectedFiles, ...validFiles].slice(0, 10);
    setSelectedFiles(newFiles);

    // Créer les URLs de prévisualisation
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    // Nettoyer les anciennes URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls(newUrls);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Nettoyer l'URL supprimée
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || selectedFiles.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires et ajouter au moins une image.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        ...formData,
        photos: selectedFiles
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        city: "",
        projectType: "",
        isPubliclyVisible: true,
      });
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      city: "",
      projectType: "",
      isPubliclyVisible: true,
    });
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ajouter un projet</h3>
            <p className="text-sm text-gray-500">Partagez vos réalisations</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau projet</DialogTitle>
          <DialogDescription>
            Partagez vos réalisations avec vos clients potentiels
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

          {/* Upload d'images */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Photos du projet * (max 10 images)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="project-photos"
              />
              <label
                htmlFor="project-photos"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Cliquez pour ajouter des images
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP - Max 5MB par image
                </span>
              </label>
            </div>

            {/* Prévisualisation des images */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Aperçu ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
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
              id="isPubliclyVisible"
              checked={formData.isPubliclyVisible}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isPubliclyVisible: checked as boolean }))
              }
            />
            <label
              htmlFor="isPubliclyVisible"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Rendre ce projet visible sur ma fiche publique
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
                'Ajouter le projet'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
