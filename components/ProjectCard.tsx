"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Eye, 
  EyeOff, 
  MapPin, 
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
import ProjectLightbox from "./ProjectLightbox";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    city: string;
    projectType: string;
    photos: string[];
    isPubliclyVisible: boolean;
    createdAt: Date;
    likesCount: number;
    commentsCount: number;
  };
  canEdit?: boolean;
  onVisibilityToggle?: (projectId: string, isVisible: boolean) => Promise<void>;
  onEdit?: (projectId: string, projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    newPhotos: File[];
    existingPhotos: string[];
  }) => Promise<void>;
  onDelete?: (projectId: string) => Promise<void>;
}

export default function ProjectCard({ 
  project, 
  canEdit = false, 
  onVisibilityToggle,
  onEdit,
  onDelete 
}: ProjectCardProps) {
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Gérer l'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVisibilityToggle = async (checked: boolean) => {
    if (!onVisibilityToggle) return;
    
    try {
      setIsUpdatingVisibility(true);
      await onVisibilityToggle(project.id, checked);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow p-0">
      {/* Image principale - tout en haut */}
      {project.photos.length > 0 && (
        <div className="aspect-video relative overflow-hidden">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          <img
            src={project.photos[0]}
            alt={project.title}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            style={{ display: isImageLoading ? 'none' : 'block' }}
          />
          {project.photos.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              +{project.photos.length - 1} photos
            </div>
          )}
          
          {/* Boutons en haut à droite */}
          {canEdit && (
            <div className="absolute top-2 right-2 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              {/* Switch Public */}
              {onVisibilityToggle && (
                <div className="flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                  <span className="text-xs text-gray-700">Public</span>
                  <Switch
                    checked={project.isPubliclyVisible}
                    onCheckedChange={handleVisibilityToggle}
                    disabled={isUpdatingVisibility}
                  />
                </div>
              )}
              
              {/* Menu 3 petits points */}
              {isMounted && (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </div>
          )}
        </div>
      )}

      <CardContent className="p-4">
        {/* Titre */}
        <h3 
          className="font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:underline transition-all"
          onClick={() => setIsLightboxOpen(true)}
        >
          {project.title}
        </h3>

        {/* Type de projet */}
        {project.projectType && (
          <Badge variant="outline" className="text-xs mb-3">
            {project.projectType}
          </Badge>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {project.description}
        </p>

        {/* Métadonnées */}
        <div className="space-y-2 mb-3">
          {project.city && (
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {project.city}
            </div>
          )}
          <div className="hidden sm:flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(project.createdAt)}
          </div>
        </div>

        {/* Date en bas à droite sur mobile uniquement */}
        <div className="sm:hidden flex justify-end pt-2 border-t">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(project.createdAt)}
          </div>
        </div>
      </CardContent>

      {/* Modals */}
      <EditProjectModal
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={onEdit || (async () => {})}
      />

      <DeleteProjectModal
        project={{ id: project.id, title: project.title }}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDelete || (async () => {})}
      />

      <ProjectLightbox
        project={project}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </Card>
  );
}
