"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Play, Loader2 } from "lucide-react";
import { uploadBannerVideo, removeBannerVideo } from "@/lib/storage";
import { toast } from "@/hooks/useToast";

interface BannerVideoManagerProps {
  entreprise: {
    id: string;
    nom: string;
    premiumFeatures?: {
      bannerVideo?: string;
    };
  };
  canEdit?: boolean;
  onUpdate?: (updatedEntreprise: any) => void;
}

export default function BannerVideoManager({ 
  entreprise, 
  canEdit = false,
  onUpdate
}: BannerVideoManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [localBannerVideo, setLocalBannerVideo] = useState<string | null>(
    entreprise.premiumFeatures?.bannerVideo || null
  );

  const bannerVideo = localBannerVideo || entreprise.premiumFeatures?.bannerVideo;

  // Synchroniser l'état local avec les props
  useEffect(() => {
    const propsBannerVideo = entreprise.premiumFeatures?.bannerVideo;
    setLocalBannerVideo(propsBannerVideo || null);
  }, [entreprise.premiumFeatures?.bannerVideo]);


  const handleVideoUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      const videoUrl = await uploadBannerVideo(entreprise.id, file);
      
      // Mettre à jour l'entreprise
      const updatedEntreprise = {
        ...entreprise,
        premiumFeatures: {
          ...entreprise.premiumFeatures,
          bannerVideo: videoUrl
        }
      };

      // Mettre à jour l'état local immédiatement
      setLocalBannerVideo(videoUrl);

      if (onUpdate) {
        onUpdate(updatedEntreprise);
      }

      // Forcer un re-render même si onUpdate ne fonctionne pas
      setTimeout(() => {
        setLocalBannerVideo(videoUrl);
      }, 100);

      toast({
        title: "Vidéo ajoutée",
        description: "La vidéo de présentation a été ajoutée avec succès.",
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload de la vidéo:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur d'upload",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoRemove = async () => {
    try {
      setIsRemoving(true);
      
      await removeBannerVideo(entreprise.id);
      
      // Mettre à jour l'état local immédiatement
      setLocalBannerVideo(null);

      // Mettre à jour l'entreprise
      const updatedEntreprise = {
        ...entreprise,
        premiumFeatures: {
          ...entreprise.premiumFeatures,
          bannerVideo: null
        }
      };

      if (onUpdate) {
        onUpdate(updatedEntreprise);
      }

      toast({
        title: "Vidéo supprimée",
        description: "La vidéo de présentation a été supprimée avec succès.",
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la vidéo:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur de suppression",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const triggerFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/ogg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleVideoUpload(file);
      }
    };
    input.click();
  };

  // Si pas de vidéo
  if (!bannerVideo) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Vidéo de présentation</h3>
        
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">
                  Ajoutez une vidéo de présentation
                </h4>
                <p className="text-sm text-gray-500">
                  Présentez votre entreprise et vos services avec une vidéo
                </p>
                <p className="text-xs text-gray-400">
                  MP4, WebM ou OGG • Max 50MB
                </p>
              </div>

              {canEdit && (
                <Button
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  variant="outline"
                  className="mt-4"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Ajouter une vidéo
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si vidéo présente
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Vidéo de présentation</h3>
      
      <div className="relative group">
        {isVideoLoading && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          </div>
        )}
        <video
          src={bannerVideo}
          controls
          className="w-full h-80 object-contain bg-black rounded-lg shadow-sm"
          poster=""
          onLoadedData={() => setIsVideoLoading(false)}
          onError={() => setIsVideoLoading(false)}
          style={{ display: isVideoLoading ? 'none' : 'block' }}
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>

        {/* Boutons d'action */}
        {canEdit && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              onClick={triggerFileInput}
              disabled={isUploading || isRemoving}
              className="bg-white/90 hover:bg-white"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleVideoRemove}
              disabled={isUploading || isRemoving}
              className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
            >
              {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {/* Overlay de chargement */}
        {(isUploading || isRemoving) && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="bg-white rounded-xl p-4 text-center shadow-xl">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                {isUploading ? 'Upload en cours...' : 'Suppression...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
