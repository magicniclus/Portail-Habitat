"use client";

import { useState, useEffect } from "react";
import { renovationPrestations } from "@/lib/renovation-suggestions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Loader2 } from "lucide-react";

interface PrestationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfessions: string[];
  onSave: (selectedProfessions: string[]) => Promise<void>;
  disabled?: boolean;
}

export default function PrestationsModal({
  isOpen,
  onClose,
  currentProfessions,
  onSave,
  disabled = false
}: PrestationsModalProps) {
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialiser les prestations sélectionnées
  useEffect(() => {
    if (isOpen) {
      setSelectedPrestations([...currentProfessions]);
      setSearchTerm("");
    }
  }, [isOpen, currentProfessions]);

  // Filtrer les prestations selon la recherche
  const filteredPrestations = renovationPrestations.filter(prestation =>
    prestation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prestation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouper les prestations par catégorie (première partie du slug)
  const groupedPrestations = filteredPrestations.reduce((groups, prestation) => {
    const category = prestation.slug.split('-')[0];
    const categoryName = getCategoryName(category);
    
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(prestation);
    return groups;
  }, {} as Record<string, typeof renovationPrestations>);

  function getCategoryName(category: string): string {
    const categoryNames: Record<string, string> = {
      'renovation': 'Rénovation',
      'pose': 'Pose & Installation',
      'installation': 'Installation',
      'peinture': 'Peinture',
      'isolation': 'Isolation',
      'ravalement': 'Façade & Extérieur',
      'charpente': 'Charpente & Toiture',
      'couverture': 'Couverture',
      'zinguerie': 'Zinguerie',
      'creation': 'Création',
      'reparation': 'Réparation',
      'remplacement': 'Remplacement'
    };
    return categoryNames[category] || 'Autres';
  }

  const handleTogglePrestation = (slug: string) => {
    setSelectedPrestations(prev => 
      prev.includes(slug)
        ? prev.filter(p => p !== slug)
        : [...prev, slug]
    );
  };

  const handleSelectAll = () => {
    const allSlugs = filteredPrestations.map(p => p.slug);
    setSelectedPrestations(prev => {
      const newSet = new Set([...prev, ...allSlugs]);
      return Array.from(newSet);
    });
  };

  const handleDeselectAll = () => {
    const filteredSlugs = filteredPrestations.map(p => p.slug);
    setSelectedPrestations(prev => 
      prev.filter(slug => !filteredSlugs.includes(slug))
    );
  };

  const handleSave = async () => {
    if (disabled) return;
    
    setIsSaving(true);
    try {
      await onSave(selectedPrestations);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedPrestations([...currentProfessions]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Prestations de l'artisan</span>
            <Badge variant="outline">
              {selectedPrestations.length} sélectionnée(s)
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Barre de recherche */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une prestation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSelectAll}
            disabled={filteredPrestations.length === 0}
          >
            Tout sélectionner
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDeselectAll}
            disabled={filteredPrestations.length === 0}
          >
            Tout désélectionner
          </Button>
        </div>

        {/* Liste des prestations */}
        <div className="flex-1 border rounded-lg overflow-y-auto min-h-0">
          <div className="p-4 space-y-6">
              {Object.entries(groupedPrestations).map(([categoryName, prestations]) => (
                <div key={categoryName}>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    {categoryName}
                    <Badge variant="secondary">
                      {prestations.filter(p => selectedPrestations.includes(p.slug)).length}/{prestations.length}
                    </Badge>
                  </h3>
                  
                  <div className="space-y-1">
                    {prestations.map((prestation, index) => {
                      const isSelected = selectedPrestations.includes(prestation.slug);
                      
                      return (
                        <div
                          key={`${categoryName}-${index}-${prestation.slug}`}
                          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleTogglePrestation(prestation.slug)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleTogglePrestation(prestation.slug)}
                          />
                          <span className="text-sm text-gray-900">
                            {prestation.nom}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {Object.keys(groupedPrestations).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'Aucune prestation trouvée' : 'Aucune prestation disponible'}
                </div>
              )}
            </div>
          </div>

        <DialogFooter className="flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            {selectedPrestations.length} prestation(s) sélectionnée(s) sur {renovationPrestations.length}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={disabled || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
