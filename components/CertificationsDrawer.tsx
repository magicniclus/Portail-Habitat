"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, X, Loader2 } from "lucide-react";

interface CertificationsDrawerProps {
  currentCertifications: string[];
  onSave: (certifications: string[]) => Promise<void>;
}

const PREDEFINED_CERTIFICATIONS = [
  "RGE",
  "Qualibat", 
  "Garantie décennale",
  "Garantie biennale",
  "Éco-artisan",
  "QualiPV",
  "QualiBois",
  "QualiSol",
  "Handibat",
  "Pros de la performance énergétique",
  "Certifié NF Service",
  "Label Flamme Verte",
  "Certification CSTB",
  "Agrément Préfectoral",
  "Certification ACERMI"
];

export default function CertificationsDrawer({ currentCertifications, onSave }: CertificationsDrawerProps) {
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>(currentCertifications);
  const [newCertification, setNewCertification] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCertificationToggle = (certification: string) => {
    setSelectedCertifications(prev => 
      prev.includes(certification)
        ? prev.filter(p => p !== certification)
        : [...prev, certification]
    );
  };

  const handleAddNewCertification = () => {
    if (newCertification.trim() && !selectedCertifications.includes(newCertification.trim())) {
      setSelectedCertifications(prev => [...prev, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (certification: string) => {
    setSelectedCertifications(prev => prev.filter(p => p !== certification));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(selectedCertifications);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des certifications:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedCertifications(currentCertifications);
    setNewCertification("");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">
          <Plus className="h-3 w-3" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="px-6 py-4">
          <SheetTitle>Gérer les certifications & labels</SheetTitle>
          <SheetDescription>
            Sélectionnez vos certifications et labels professionnels
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {/* Certifications prédéfinies */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-900">Certifications disponibles</h4>
            <div className="space-y-2">
              {PREDEFINED_CERTIFICATIONS.map((certification) => (
                <div key={certification} className="flex items-center space-x-2">
                  <Checkbox
                    id={certification}
                    checked={selectedCertifications.includes(certification)}
                    onCheckedChange={() => handleCertificationToggle(certification)}
                  />
                  <label
                    htmlFor={certification}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {certification}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Ajouter une nouvelle certification */}
          <div className="space-y-4 mt-6">
            <h4 className="font-medium text-sm text-gray-900">Ajouter une certification personnalisée</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Nom de la certification..."
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewCertification();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddNewCertification}
                disabled={!newCertification.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Certifications sélectionnées */}
          {selectedCertifications.length > 0 && (
            <div className="space-y-4 mt-6">
              <h4 className="font-medium text-sm text-gray-900">Certifications sélectionnées ({selectedCertifications.length})</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCertifications.map((certification) => (
                  <Badge key={certification} variant="secondary" className="text-sm">
                    {certification}
                    <button
                      onClick={() => handleRemoveCertification(certification)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="px-6 py-4">
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                'Sauvegarder'
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
