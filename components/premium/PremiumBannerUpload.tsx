"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface PremiumBannerUploadProps {
  artisanId: string;
  currentPhotos: string[];
  currentVideo?: string;
  onPhotosChange: (photos: string[]) => void;
  onVideoChange: (video?: string) => void;
  maxPhotos?: number;
}

export default function PremiumBannerUpload({
  artisanId,
  currentPhotos,
  currentVideo,
  onPhotosChange,
  onVideoChange,
  maxPhotos = 5
}: PremiumBannerUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Upload d'une photo de bannière
  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validation
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide (JPG, PNG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert('L\'image ne doit pas dépasser 2MB');
      return;
    }

    if (currentPhotos.length >= maxPhotos) {
      alert(`Vous ne pouvez pas ajouter plus de ${maxPhotos} photos`);
      return;
    }

    setUploading(true);

    try {
      // Générer un nom unique pour la photo
      const photoIndex = currentPhotos.length + 1;
      const fileName = `banner_${photoIndex.toString().padStart(3, '0')}.jpg`;
      const storageRef = ref(storage, `artisans/${artisanId}/premium/banner_photos/${fileName}`);

      // Upload vers Firebase Storage
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Mettre à jour la liste des photos
      const newPhotos = [...currentPhotos, downloadURL];
      onPhotosChange(newPhotos);

    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setUploading(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  // Suppression d'une photo
  const handlePhotoDelete = async (photoUrl: string, index: number) => {
    try {
      // Supprimer de Firebase Storage
      const photoRef = ref(storage, photoUrl);
      await deleteObject(photoRef);

      // Mettre à jour la liste
      const newPhotos = currentPhotos.filter((_, i) => i !== index);
      onPhotosChange(newPhotos);

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la photo');
    }
  };

  // Upload d'une vidéo
  const handleVideoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validation
    if (!file.type.startsWith('video/')) {
      alert('Veuillez sélectionner une vidéo valide (MP4)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      alert('La vidéo ne doit pas dépasser 50MB');
      return;
    }

    setUploadingVideo(true);

    try {
      const storageRef = ref(storage, `artisans/${artisanId}/premium/banner_video/banner_video.mp4`);

      // Upload vers Firebase Storage
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      onVideoChange(downloadURL);

    } catch (error) {
      console.error('Erreur lors de l\'upload de la vidéo:', error);
      alert('Erreur lors de l\'upload de la vidéo');
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  // Suppression de la vidéo
  const handleVideoDelete = async () => {
    if (!currentVideo) return;

    try {
      const videoRef = ref(storage, currentVideo);
      await deleteObject(videoRef);
      onVideoChange(undefined);
    } catch (error) {
      console.error('Erreur lors de la suppression de la vidéo:', error);
      alert('Erreur lors de la suppression de la vidéo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Photos de bannière */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Photos de bannière
            <Badge variant="secondary">{currentPhotos.length}/{maxPhotos}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Grille des photos existantes */}
          {currentPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Bannière ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handlePhotoDelete(photo, index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 text-xs">
                    {index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Bouton d'ajout de photo */}
          {currentPhotos.length < maxPhotos && (
            <div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e.target.files)}
                className="hidden"
              />
              <Button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Ajouter une photo ({currentPhotos.length}/{maxPhotos})
                  </>
                )}
              </Button>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Formats acceptés : JPG, PNG • Taille max : 2MB par photo
          </p>
        </CardContent>
      </Card>

      {/* Vidéo de bannière */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Vidéo de bannière
            {currentVideo && <Badge variant="secondary">Vidéo ajoutée</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Vidéo existante */}
          {currentVideo && (
            <div className="relative">
              <video
                src={currentVideo}
                controls
                className="w-full h-48 rounded-lg border"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleVideoDelete}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Bouton d'ajout/remplacement de vidéo */}
          <div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleVideoUpload(e.target.files)}
              className="hidden"
            />
            <Button
              onClick={() => videoInputRef.current?.click()}
              disabled={uploadingVideo}
              variant="outline"
              className="w-full"
            >
              {uploadingVideo ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {currentVideo ? 'Remplacer la vidéo' : 'Ajouter une vidéo'}
                </>
              )}
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            Format accepté : MP4 • Taille max : 50MB • Lecture automatique en sourdine
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
