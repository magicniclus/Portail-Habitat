"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: string | number;
  onSave: (value: string | number) => Promise<void>;
  type?: 'text' | 'email' | 'number' | 'textarea';
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export default function EditableField({
  label,
  value,
  onSave,
  type = 'text',
  placeholder,
  disabled = false,
  rows = 3
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const handleValueChange = (newValue: string | number) => {
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
      // Remettre la valeur originale en cas d'erreur
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      if (hasChanged) {
        handleSave();
      }
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            {type === 'textarea' ? (
              <Textarea
                value={currentValue}
                onChange={(e) => handleValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={rows}
                autoFocus
              />
            ) : (
              <Input
                type={type}
                value={currentValue}
                onChange={(e) => handleValueChange(
                  type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                )}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoFocus
              />
            )}
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
          className={`min-h-[40px] p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
            disabled ? 'cursor-not-allowed bg-gray-100' : ''
          }`}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder || 'Cliquez pour modifier'}
          </span>
        </div>
      )}
    </div>
  );
}
