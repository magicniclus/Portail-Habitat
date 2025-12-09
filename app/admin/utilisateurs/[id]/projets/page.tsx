"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCurrentAdmin, hasPermission, ADMIN_PERMISSIONS } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  MapPin, 
  Calendar,
  Image as ImageIcon,
  Eye,
  Edit,
  Trash2,
  Loader2
} from "lucide-react";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  city: string;
  projectType: string;
  isPublished: boolean;
  isPubliclyVisible: boolean;
  photos: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: any;
}

interface Artisan {
  companyName: string;
  firstName: string;
  lastName: string;
}

export default function ArtisanProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const artisanId = params.id as string;
  const returnTo = searchParams.get('returnTo');
  const tab = searchParams.get('tab');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    if (artisanId) {
      loadData();
    }
  }, [artisanId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Vérifier les permissions
      const canEditContent = await hasPermission(ADMIN_PERMISSIONS.MANAGE_CONTENT);
      setCanEdit(canEditContent);

      // Charger les infos de l'artisan
      const artisanDoc = await getDoc(doc(db, "artisans", artisanId));
      if (artisanDoc.exists()) {
        setArtisan(artisanDoc.data() as Artisan);
      }

      // Charger les projets
      const projectsQuery = query(
        collection(db, "artisans", artisanId, "posts"),
        orderBy("createdAt", "desc")
      );
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => {
            if (returnTo && tab) {
              router.push(`${returnTo}?tab=${tab}`);
            } else if (returnTo) {
              router.push(returnTo);
            } else {
              router.back();
            }
          }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Projets de {artisan?.companyName || `${artisan?.firstName} ${artisan?.lastName}`}
            </h1>
            <p className="text-gray-600">{projects.length} projets au total</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={showImages ? "default" : "outline"} 
            onClick={() => setShowImages(!showImages)}
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {showImages ? 'Masquer les images' : 'Afficher les images'}
          </Button>
        </div>
      </div>

      {/* Grille des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            {/* Image principale - conditionnelle */}
            {showImages && project.photos && project.photos.length > 0 && (
              <div className="relative h-48 w-full">
                <Image
                  src={project.photos[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                {project.photos.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    +{project.photos.length - 1} photos
                  </div>
                )}
              </div>
            )}
            
            {/* Placeholder quand les images sont masquées */}
            {!showImages && project.photos && project.photos.length > 0 && (
              <div className="h-48 w-full bg-gray-100 flex items-center justify-center border-b">
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{project.photos.length} photo{project.photos.length > 1 ? 's' : ''}</p>
                  <p className="text-xs">Cliquez sur "Afficher les images"</p>
                </div>
              </div>
            )}
            
            {/* Placeholder si pas d'images */}
            {(!project.photos || project.photos.length === 0) && (
              <div className="h-48 w-full bg-gray-50 flex items-center justify-center border-b">
                <div className="text-center text-gray-400">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Aucune image</p>
                </div>
              </div>
            )}
            
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Titre et statut */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                  <Badge variant={project.isPublished ? 'default' : 'secondary'}>
                    {project.isPublished ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>

                {/* Métadonnées */}
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {project.city} • {project.projectType}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {project.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {project.photos?.length || 0} photos
                    </span>
                    <span>👍 {project.likesCount || 0}</span>
                    <span>💬 {project.commentsCount || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedProject(project)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  {canEdit && (
                    <>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de détail du projet */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <Button variant="outline" onClick={() => setSelectedProject(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Fermer
                </Button>
              </div>

              {/* Galerie photos */}
              {selectedProject.photos && selectedProject.photos.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Photos du projet</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowImages(!showImages)}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {showImages ? 'Masquer' : 'Afficher'} les photos
                    </Button>
                  </div>
                  
                  {showImages ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProject.photos.map((photo, index) => (
                        <div key={index} className="relative h-64 w-full">
                          <Image
                            src={photo}
                            alt={`${selectedProject.title} - Photo ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 bg-gray-50 rounded-lg text-center">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">
                        {selectedProject.photos.length} photo{selectedProject.photos.length > 1 ? 's' : ''} disponible{selectedProject.photos.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Cliquez sur "Afficher les photos" pour les voir
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Détails */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Localisation</h4>
                    <p className="text-sm text-gray-600">{selectedProject.city}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Type de projet</h4>
                    <p className="text-sm text-gray-600">{selectedProject.projectType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Statut</h4>
                    <Badge variant={selectedProject.isPublished ? 'default' : 'secondary'}>
                      {selectedProject.isPublished ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">Visibilité</h4>
                    <Badge variant={selectedProject.isPubliclyVisible ? 'default' : 'secondary'}>
                      {selectedProject.isPubliclyVisible ? 'Public' : 'Privé'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>👍 {selectedProject.likesCount || 0} j'aime</span>
                  <span>💬 {selectedProject.commentsCount || 0} commentaires</span>
                  <span>📅 {selectedProject.createdAt?.toDate?.()?.toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet</h3>
          <p className="text-gray-600">Cet artisan n'a pas encore publié de projets.</p>
        </div>
      )}
    </div>
  );
}
