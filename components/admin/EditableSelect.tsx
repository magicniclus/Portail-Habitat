"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Loader2 } from "lucide-react";

interface EditableSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  renderValue?: (value: string) => React.ReactNode;
}

export default function EditableSelect({
  label,
  value,
  options,
  onSave,
  placeholder,
  disabled = false,
  renderValue
}: EditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const handleValueChange = (newValue: string) => {
    setCurrentValue(newValue);
    setHasChanged(newValue !== value);
  };

  const handleSave = async () => {
    if (!hasChanged || isSaving) return;

    try {
      setIsSaving(true);
      await onSave(currentValue);
      setIsEditing(false);
      setHasChanged(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setCurrentValue(value);
      setHasChanged(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
    setHasChanged(false);
  };

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const getDisplayValue = () => {
    if (renderValue) {
      return renderValue(value);
    }
    const option = options.find(opt => opt.value === value);
    return option ? option.label : (placeholder || 'Non défini');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select value={currentValue} onValueChange={handleValueChange}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {hasChanged && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          className={`min-h-[40px] p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors flex items-center ${
            disabled ? 'cursor-not-allowed bg-gray-100' : ''
          }`}
        >
          {getDisplayValue()}
        </div>
      )}
    </div>
  );
}
