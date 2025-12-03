"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Plus, Save } from "lucide-react";

interface PrestationsDrawerProps {
  currentPrestations: string[];
  onSave: (prestations: string[]) => Promise<void>;
}

// Liste des prestations disponibles par défaut
const PRESTATIONS_DISPONIBLES = [
  "Aménagement pour personne à mobilité réduite",
  "Bâtiment basse consommation",
  "Boiserie murale",
  "Briqueterie",
  "Conception et construction de quai",
  "Construction de balcon",
  "Construction de béton",
  "Construction de carport",
  "Construction de cheminée",
  "Construction de cuisine extérieure",
  "Construction de fondations de maison",
  "Construction de garage",
  "Construction de mur de soutènement",
  "Construction de pergola",
  "Construction de terrasse",
  "Construction de Tiny House",
  "Construction écologique",
  "Démolition",
  "Désamiantage",
  "Entreprises générales de bâtiment",
  "Estimation travaux maison avant achat",
  "Étanchéité",
  "Étanchéité de cave",
  "Extension de maison",
  "Ignifugation",
  "Installation d'éclairage",
  "Installation d'allée carrossable en béton",
  "Isolation des combles",
  "Isolation par l'extérieur",
  "Isolation phonique et acoustique",
  "Isolation projetée",
  "Maçonnerie",
  "Maison d'architecte",
  "Maison préfabriquée",
  "Maîtrise d'œuvre",
  "Nivellement du sol",
  "Parement de brique",
  "Plafonds tendus",
  "Plan de masse pour permis de construire",
  "Plans de chantier",
  "Pose d'isolation",
  "Pose de baignoire",
  "Pose de carrelage",
  "Préparation de chantier",
  "Ragréage et terrassement",
  "Ravalement de façade",
  "Rénovation complète",
  "Rénovation d'appartement",
  "Rénovation de combles",
  "Rénovation de cuisine",
  "Rénovation de luxe",
  "Rénovation de salle d'eau",
  "Rénovation de salle de bain",
  "Rénovation de toilettes",
  "Restauration après dégât des eaux",
  "Sablage",
  "Surélévation",
  "Traitement de l'humidité",
];

export default function PrestationsDrawer({ currentPrestations, onSave }: PrestationsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>(currentPrestations);
  const [newPrestation, setNewPrestation] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handlePrestationToggle = (prestation: string) => {
    setSelectedPrestations(prev => 
      prev.includes(prestation)
        ? prev.filter(p => p !== prestation)
        : [...prev, prestation]
    );
  };

  const handleAddNewPrestation = () => {
    if (newPrestation.trim() && !selectedPrestations.includes(newPrestation.trim())) {
      setSelectedPrestations(prev => [...prev, newPrestation.trim()]);
      setNewPrestation("");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(selectedPrestations);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedPrestations(currentPrestations);
    }
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 rounded-full"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Gérer les prestations</SheetTitle>
          <SheetDescription>
            Sélectionnez les prestations que vous proposez ou ajoutez-en de nouvelles.
          </SheetDescription>
        </SheetHeader>
        
        <div className="px-6 py-6 space-y-6">
          {/* Liste des prestations disponibles */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Prestations disponibles</Label>
            <div className="grid gap-3 max-h-80 overflow-y-auto">
              {PRESTATIONS_DISPONIBLES.map((prestation) => (
                <div key={prestation} className="flex items-center space-x-2">
                  <Checkbox
                    id={prestation}
                    checked={selectedPrestations.includes(prestation)}
                    onCheckedChange={() => handlePrestationToggle(prestation)}
                  />
                  <Label
                    htmlFor={prestation}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {prestation}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Ajouter une nouvelle prestation */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Ajouter une prestation personnalisée</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Nom de la prestation..."
                value={newPrestation}
                onChange={(e) => setNewPrestation(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddNewPrestation();
                  }
                }}
              />
              <Button
                onClick={handleAddNewPrestation}
                disabled={!newPrestation.trim()}
                variant="outline"
              >
                Ajouter
              </Button>
            </div>
          </div>

          {/* Prestations personnalisées ajoutées */}
          {selectedPrestations.some(p => !PRESTATIONS_DISPONIBLES.includes(p)) && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Prestations personnalisées</Label>
              <div className="grid gap-3">
                {selectedPrestations
                  .filter(p => !PRESTATIONS_DISPONIBLES.includes(p))
                  .map((prestation) => (
                    <div key={prestation} className="flex items-center space-x-2">
                      <Checkbox
                        id={`custom-${prestation}`}
                        checked={true}
                        onCheckedChange={() => handlePrestationToggle(prestation)}
                      />
                      <Label
                        htmlFor={`custom-${prestation}`}
                        className="text-sm font-normal cursor-pointer flex-1 text-blue-600"
                      >
                        {prestation}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Résumé des sélections */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">
              {selectedPrestations.length} prestation{selectedPrestations.length > 1 ? 's' : ''} sélectionnée{selectedPrestations.length > 1 ? 's' : ''}
            </Label>
          </div>
        </div>

        <SheetFooter className="px-6 pb-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les prestations
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
