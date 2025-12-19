"use client";

import { useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Copy } from "lucide-react";

type CreateArtisanDialogProps = {
  onCreated?: () => void;
};

export default function CreateArtisanDialog({ onCreated }: CreateArtisanDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("identite");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<{ artisanId: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    siret: "",
    city: "",
    postalCode: "",
    fullAddress: "",
    lat: "",
    lng: "",
    profession: "",
    professions: "",
    description: "",
    profileVisible: true,
    showPhone: true,
    showEmail: false,
    allowDirectContact: true,
  });

  const isValid = useMemo(() => {
    return (
      form.companyName.trim() &&
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.city.trim() &&
      form.postalCode.trim() &&
      form.fullAddress.trim() &&
      form.profession.trim()
    );
  }, [form]);

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setActiveTab("identite");
      setIsSubmitting(false);
      setErrorMessage("");
      setSuccess(null);
      setCopied(false);
      setForm((prev) => ({
        ...prev,
        email: "",
        phone: "",
      }));
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccess(null);
    setCopied(false);

    if (!isValid) {
      setErrorMessage("Merci de remplir tous les champs obligatoires.");
      return;
    }

    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      setErrorMessage("Connexion admin requise.");
      return;
    }

    const latNum = form.lat.trim() ? Number(form.lat) : 0;
    const lngNum = form.lng.trim() ? Number(form.lng) : 0;

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      setErrorMessage("Latitude/longitude invalides.");
      return;
    }

    setIsSubmitting(true);

    try {
      const professions = form.professions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/artisans/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: form.companyName.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          siret: form.siret.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
          fullAddress: form.fullAddress.trim(),
          coordinates: { lat: latNum, lng: lngNum },
          profession: form.profession.trim(),
          professions: professions.length ? professions : [form.profession.trim()],
          description: form.description.trim(),
          privacy: {
            profileVisible: form.profileVisible,
            showPhone: form.showPhone,
            showEmail: form.showEmail,
            allowDirectContact: form.allowDirectContact,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json?.error || "Erreur lors de la création.");
        return;
      }

      setSuccess({ artisanId: json.artisanId, password: json.password });
      onCreated?.();
      setActiveTab("resultat");
    } catch (e) {
      setErrorMessage("Erreur lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCredentials = async () => {
    if (!success) return;
    try {
      await navigator.clipboard.writeText(`UID: ${success.artisanId}\nPassword: ${success.password}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Créer un artisan
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un compte artisan</DialogTitle>
          <DialogDescription>
            Le mot de passe est généré et affiché uniquement ici.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <Alert>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="identite">Identité</TabsTrigger>
            <TabsTrigger value="adresse">Adresse</TabsTrigger>
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="conf">Conf</TabsTrigger>
            <TabsTrigger value="resultat">Résultat</TabsTrigger>
          </TabsList>

          <TabsContent value="identite" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Entreprise *</Label>
                <Input value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>SIRET</Label>
                <Input value={form.siret} onChange={(e) => setForm((p) => ({ ...p, siret: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom *</Label>
                <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Téléphone *</Label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="adresse" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ville *</Label>
                <Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Code postal *</Label>
                <Input value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adresse complète *</Label>
              <Input value={form.fullAddress} onChange={(e) => setForm((p) => ({ ...p, fullAddress: e.target.value }))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input value={form.lat} onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input value={form.lng} onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profil" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Métier principal *</Label>
                <Input value={form.profession} onChange={(e) => setForm((p) => ({ ...p, profession: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Métiers secondaires (séparés par des virgules)</Label>
                <Input value={form.professions} onChange={(e) => setForm((p) => ({ ...p, professions: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>
          </TabsContent>

          <TabsContent value="conf" className="space-y-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">Profil visible</div>
                <div className="text-sm text-muted-foreground">Visible dans les recherches</div>
              </div>
              <Switch checked={form.profileVisible} onCheckedChange={(v) => setForm((p) => ({ ...p, profileVisible: v }))} />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">Afficher le téléphone</div>
                <div className="text-sm text-muted-foreground">Téléphone public</div>
              </div>
              <Switch checked={form.showPhone} onCheckedChange={(v) => setForm((p) => ({ ...p, showPhone: v }))} />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">Afficher l’email</div>
                <div className="text-sm text-muted-foreground">Email public</div>
              </div>
              <Switch checked={form.showEmail} onCheckedChange={(v) => setForm((p) => ({ ...p, showEmail: v }))} />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">Autoriser contact direct</div>
                <div className="text-sm text-muted-foreground">Contact sans formulaire</div>
              </div>
              <Switch checked={form.allowDirectContact} onCheckedChange={(v) => setForm((p) => ({ ...p, allowDirectContact: v }))} />
            </div>
          </TabsContent>

          <TabsContent value="resultat" className="space-y-4">
            {success ? (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Compte créé</div>
                    <div className="text-sm">UID: {success.artisanId}</div>
                    <div className="text-sm">Mot de passe: {success.password}</div>
                    <div>
                      <Button type="button" size="sm" variant="outline" onClick={copyCredentials}>
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? "Copié" : "Copier"}
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertDescription>Crée l’artisan pour afficher l’UID et le mot de passe.</AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Création...
              </>
            ) : (
              "Créer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
