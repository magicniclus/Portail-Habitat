"use client";

import { useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadPostPhotos } from "@/lib/storage";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Upload } from "lucide-react";

interface CreateArtisanProjectDialogProps {
  artisanId: string;
  disabled?: boolean;
  onCreated?: () => void;
}

export default function CreateArtisanProjectDialog({ artisanId, disabled = false, onCreated }: CreateArtisanProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [projectType, setProjectType] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isPubliclyVisible, setIsPubliclyVisible] = useState(true);

  const [files, setFiles] = useState<File[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (disabled) return false;
    if (!title.trim()) return false;
    if (!description.trim()) return false;
    if (!city.trim()) return false;
    if (!projectType.trim()) return false;
    return true;
  }, [disabled, title, description, city, projectType]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setCity("");
    setProjectType("");
    setIsPublished(false);
    setIsPubliclyVisible(true);
    setFiles([]);
    setError(null);
  };

  const handleCreate = async () => {
    if (!canSubmit) return;

    setError(null);
    setIsSaving(true);
    try {
      // 1) Create post document in artisans/{artisanId}/posts
      const postRef = await addDoc(collection(db, "artisans", artisanId, "posts"), {
        title: title.trim(),
        description: description.trim(),
        city: city.trim(),
        projectType: projectType.trim(),
        isPublished,
        isPubliclyVisible,
        photos: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2) Upload photos (optional) -> updates photos[] itself (lib/storage.ts)
      if (files.length > 0) {
        await uploadPostPhotos(artisanId, postRef.id, files);
      } else {
        // Ensure updatedAt is set even without photos
        await updateDoc(doc(db, "artisans", artisanId, "posts", postRef.id), {
          updatedAt: serverTimestamp(),
        });
      }

      setOpen(false);
      reset();
      onCreated?.();
    } catch (e: any) {
      setError(e?.message || "Impossible de créer le projet");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        setOpen(v);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un projet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un projet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} disabled={disabled || isSaving} />
            </div>
            <div className="space-y-2">
              <Label>Type de projet</Label>
              <Input value={projectType} onChange={(e) => setProjectType(e.target.value)} disabled={disabled || isSaving} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ville</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} disabled={disabled || isSaving} />
            </div>
            <div className="space-y-2">
              <Label>Photos</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                disabled={disabled || isSaving}
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={disabled || isSaving} rows={5} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Publié</div>
                <div className="text-xs text-muted-foreground">Visible dans les listes de chantiers si utilisé.</div>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} disabled={disabled || isSaving} />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Visible publiquement</div>
                <div className="text-xs text-muted-foreground">Contrôle d'affichage public du post.</div>
              </div>
              <Switch checked={isPubliclyVisible} onCheckedChange={setIsPubliclyVisible} disabled={disabled || isSaving} />
            </div>
          </div>

          {files.length > 0 && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {files.length} fichier(s) sélectionné(s)
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
            Fermer
          </Button>
          <Button onClick={handleCreate} disabled={!canSubmit || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              "Créer le projet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
