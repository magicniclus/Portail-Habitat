"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, arrayRemove, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { recordMarketplacePurchase, initializeMarketplaceStructure, removeMarketplacePurchase, syncAssignmentsToMarketplace } from "@/lib/marketplace-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EditableField from "./EditableField";
import { 
  Search, 
  Plus, 
  X, 
  User, 
  Euro,
  Check,
  Loader2
} from "lucide-react";

interface Artisan {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  profession: string;
  city: string;
  email: string;
}

interface Assignment {
  artisanId: string;
  artisanName: string;
  artisanCompany?: string;
  assignedAt: any; // Date ou Timestamp Firestore
  price?: number;
}

interface ArtisanAssignmentProps {
  estimationId: string;
  currentAssignments: Assignment[];
  onAssignmentsUpdate: (assignments: Assignment[]) => void;
  onMarketplaceUpdate?: () => void; // Callback pour recharger la marketplace
  disabled?: boolean;
}

export default function ArtisanAssignment({ 
  estimationId, 
  currentAssignments, 
  onAssignmentsUpdate,
  onMarketplaceUpdate,
  disabled = false 
}: ArtisanAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Artisan[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Recherche d'artisans (simplifiée pour éviter les problèmes d'index)
  const searchArtisans = async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const artisansRef = collection(db, "artisans");
      
      // Récupérer tous les artisans et filtrer côté client
      // (Plus simple mais moins performant - à optimiser plus tard avec des index)
      const snapshot = await getDocs(query(artisansRef, limit(100)));
      const allArtisans = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Artisan[];

      // Filtrer côté client
      const searchTermLower = term.toLowerCase();
      const filteredArtisans = allArtisans.filter(artisan => {
        const firstName = (artisan.firstName || '').toLowerCase();
        const lastName = (artisan.lastName || '').toLowerCase();
        const companyName = (artisan.companyName || '').toLowerCase();
        const profession = (artisan.profession || '').toLowerCase();
        
        return firstName.includes(searchTermLower) ||
               lastName.includes(searchTermLower) ||
               companyName.includes(searchTermLower) ||
               profession.includes(searchTermLower);
      });

      // Filtrer les artisans déjà assignés
      const assignedIds = currentAssignments.map(a => a.artisanId);
      const finalResults = filteredArtisans.filter(artisan => !assignedIds.includes(artisan.id));

      setSearchResults(finalResults.slice(0, 10)); // Limiter à 10 résultats
    } catch (error) {
      console.error("Erreur lors de la recherche d'artisans:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Effet pour la recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && showSearch) {
        searchArtisans(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, showSearch, currentAssignments]);

  // Assigner un artisan
  const assignArtisan = async (artisan: Artisan) => {
    setIsUpdating(true);
    try {
      const newAssignment: Assignment = {
        artisanId: artisan.id,
        artisanName: `${artisan.firstName} ${artisan.lastName}`,
        artisanCompany: artisan.companyName,
        assignedAt: new Date()
      };

      // Mettre à jour Firestore - Estimation
      await updateDoc(doc(db, "estimations", estimationId), {
        assignments: arrayUnion(newAssignment),
        updatedAt: new Date()
      });

      // Mettre à jour Firestore - Artisan (ajouter le lead)
      await updateDoc(doc(db, "artisans", artisan.id), {
        assignedLeads: arrayUnion({
          estimationId,
          assignedAt: new Date()
        }),
        updatedAt: new Date()
      });

      // Initialiser la structure marketplace et synchroniser les compteurs
      // IMPORTANT: Synchronise les compteurs SANS toucher à isPublished
      try {
        await initializeMarketplaceStructure(estimationId);
        await syncAssignmentsToMarketplace(estimationId);
        console.log("Compteurs marketplace mis à jour (isPublished inchangé)");
      } catch (marketplaceError) {
        console.log("Erreur synchronisation marketplace:", marketplaceError);
      }

      // Mettre à jour l'état local
      const updatedAssignments = [...currentAssignments, newAssignment];
      onAssignmentsUpdate(updatedAssignments);

      // Notifier la mise à jour marketplace avec un délai
      if (onMarketplaceUpdate) {
        setTimeout(() => {
          onMarketplaceUpdate();
        }, 300);
      }

      // Réinitialiser la recherche
      setSearchTerm("");
      setShowSearch(false);
      setSearchResults([]);

    } catch (error) {
      console.error("Erreur lors de l'attribution:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Supprimer une attribution
  const removeAssignment = async (assignment: Assignment) => {
    setIsUpdating(true);
    try {
      // Mettre à jour Firestore - Estimation
      await updateDoc(doc(db, "estimations", estimationId), {
        assignments: arrayRemove(assignment),
        updatedAt: new Date()
      });

      // Mettre à jour Firestore - Artisan (retirer le lead)
      await updateDoc(doc(db, "artisans", assignment.artisanId), {
        assignedLeads: arrayRemove({
          estimationId,
          assignedAt: assignment.assignedAt
        }),
        updatedAt: new Date()
      });

      // Retirer l'achat de la marketplace pour mettre à jour les compteurs
      // IMPORTANT: Met à jour les compteurs SANS toucher à isPublished
      try {
        await removeMarketplacePurchase(estimationId, assignment.artisanId);
        console.log("Compteurs marketplace mis à jour après suppression (isPublished inchangé)");
      } catch (marketplaceError) {
        console.log("Erreur mise à jour compteurs marketplace:", marketplaceError);
      }

      // Mettre à jour l'état local
      const updatedAssignments = currentAssignments.filter(a => a.artisanId !== assignment.artisanId);
      onAssignmentsUpdate(updatedAssignments);

      // Notifier la mise à jour marketplace
      if (onMarketplaceUpdate) {
        onMarketplaceUpdate();
      }

    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Mettre à jour le prix d'une attribution
  const updateAssignmentPrice = async (artisanId: string, price: number) => {
    try {
      const assignment = currentAssignments.find(a => a.artisanId === artisanId);
      if (!assignment) return;

      const updatedAssignments = currentAssignments.map(assignment => 
        assignment.artisanId === artisanId 
          ? { ...assignment, price }
          : assignment
      );

      // Mettre à jour Firestore - Assignments
      await updateDoc(doc(db, "estimations", estimationId), {
        assignments: updatedAssignments,
        updatedAt: new Date()
      });

      // Enregistrer l'achat pour mettre à jour les compteurs marketplace
      // IMPORTANT: Met à jour les compteurs SANS toucher à isPublished
      if (price >= 0) {
        try {
          await initializeMarketplaceStructure(estimationId);
          await recordMarketplacePurchase(estimationId, {
            artisanId,
            artisanName: assignment.artisanName,
            purchasedAt: new Date(),
            price: price || 0,
            paymentId: `manual-assignment-${Date.now()}`
          });
          console.log("Compteurs marketplace mis à jour avec nouveau prix (isPublished inchangé)");
        } catch (marketplaceError) {
          console.log("Erreur mise à jour compteurs marketplace:", marketplaceError);
        }
      }

      // Mettre à jour l'état local
      onAssignmentsUpdate(updatedAssignments);

      // Notifier la mise à jour marketplace
      if (onMarketplaceUpdate) {
        onMarketplaceUpdate();
      }

    } catch (error) {
      console.error("Erreur lors de la mise à jour du prix:", error);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Artisans assignés ({currentAssignments.length})
          </div>
          {!disabled && (
            <Button 
              size="sm" 
              onClick={() => setShowSearch(!showSearch)}
              disabled={isUpdating}
            >
              <Plus className="h-4 w-4 mr-2" />
              Assigner
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche d'artisans */}
        {showSearch && !disabled && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-blue-900">Rechercher un artisan</h4>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tapez le nom, entreprise ou métier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
                autoFocus
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>

            {/* Résultats de recherche */}
            {searchResults.length > 0 && (
              <div className="bg-white border rounded-lg max-h-60 overflow-y-auto shadow-sm">
                <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">
                  {searchResults.length} artisan(s) trouvé(s)
                </div>
                {searchResults.map((artisan) => (
                  <div
                    key={artisan.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                    onClick={() => assignArtisan(artisan)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {artisan.firstName} {artisan.lastName}
                        </div>
                        {artisan.companyName && (
                          <div className="text-sm text-blue-600 font-medium">{artisan.companyName}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {artisan.profession} • {artisan.city}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-600">Cliquer pour assigner</span>
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-4 text-gray-500">
                Aucun artisan trouvé
              </div>
            )}
          </div>
        )}

        {/* Liste des artisans assignés */}
        <div className="space-y-4">
          {currentAssignments.map((assignment) => (
            <div key={assignment.artisanId} className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{assignment.artisanName}</span>
                  <Badge className="bg-blue-100 text-blue-800">Assigné</Badge>
                </div>
                {assignment.artisanCompany && (
                  <div className="text-sm text-blue-600 font-medium">{assignment.artisanCompany}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  📅 Assigné le {assignment.assignedAt?.toDate?.()?.toLocaleDateString('fr-FR') || 
                             new Date(assignment.assignedAt).toLocaleDateString('fr-FR')}
                </div>
                {assignment.price && (
                  <div className="text-sm font-medium text-green-600 mt-1">
                    💰 Prix: {assignment.price}€
                  </div>
                )}
              </div>

              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Prix (€)</label>
                  <div className="mt-1">
                    <EditableField
                      label=""
                      value={assignment.price || ''}
                      onSave={(value) => updateAssignmentPrice(assignment.artisanId, Number(value))}
                      type="number"
                      placeholder="0"
                      disabled={disabled}
                    />
                  </div>
                </div>

                {!disabled && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeAssignment(assignment)}
                    disabled={isUpdating}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 mb-0"
                  >
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          ))}

          {currentAssignments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              Aucun artisan assigné à ce projet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
