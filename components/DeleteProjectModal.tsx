"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteProjectModalProps {
  project: {
    id: string;
    title: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectId: string) => Promise<void>;
}

export default function DeleteProjectModal({ project, isOpen, onClose, onConfirm }: DeleteProjectModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!project) return;

    try {
      setIsDeleting(true);
      await onConfirm(project.id);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Supprimer le projet
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="mt-3 text-sm text-gray-500">
            Êtes-vous sûr de vouloir supprimer le projet <strong>"{project.title}"</strong> ?
            <br />
            <br />
            Cette action est <strong>irréversible</strong> et supprimera définitivement :
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Le projet et sa description</li>
              <li>Toutes les images associées</li>
              <li>Les statistiques (j'aime, commentaires)</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Suppression...
              </>
            ) : (
              'Supprimer définitivement'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
