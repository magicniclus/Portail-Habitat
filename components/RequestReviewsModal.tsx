"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, X, Plus, CheckCircle, AlertCircle } from "lucide-react";

interface RequestReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisanId: string;
  artisanName: string;
}

export default function RequestReviewsModal({
  isOpen,
  onClose,
  artisanId,
  artisanName
}: RequestReviewsModalProps) {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState(`Votre avis sur les services de ${artisanName}`);
  const [message, setMessage] = useState(`Bonjour,

J'espère que vous êtes satisfait(e) des travaux que j'ai réalisés pour vous.

Votre avis est très important pour moi et m'aiderait beaucoup à développer mon activité. Pourriez-vous prendre quelques minutes pour laisser un commentaire sur la qualité de mes services ?

Merci beaucoup pour votre confiance !

Cordialement,
${artisanName}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const addEmail = () => {
    const email = emailInput.trim();
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmailInput("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage("");
    setErrorMessage("");
    
    if (emails.length === 0) {
      setErrorMessage("Veuillez ajouter au moins une adresse email.");
      return;
    }

    if (!subject.trim() || !message.trim()) {
      setErrorMessage("Veuillez remplir le sujet et le message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-review-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artisanId,
          artisanName,
          emails,
          subject,
          message
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des demandes d\'avis');
      }

      setSuccessMessage(`${emails.length} demande(s) d'avis envoyée(s) avec succès !`);
      
      // Reset form après 2 secondes et fermer la modal
      setTimeout(() => {
        setEmails([]);
        setEmailInput("");
        setSubject(`Votre avis sur les services de ${artisanName}`);
        setMessage(`Bonjour,

J'espère que vous êtes satisfait(e) des travaux que j'ai réalisés pour vous.

Votre avis est très important pour moi et m'aiderait beaucoup à développer mon activité. Pourriez-vous prendre quelques minutes pour laisser un commentaire sur la qualité de mes services ?

Merci beaucoup pour votre confiance !

Cordialement,
${artisanName}`);
        setSuccessMessage("");
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur est survenue lors de l\'envoi des demandes d\'avis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Demander des avis clients
          </DialogTitle>
        </DialogHeader>

        {/* Messages de succès et d'erreur */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ emails */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Adresses email des clients
            </label>
            
            {/* Emails ajoutés */}
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                {emails.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Input pour ajouter des emails */}
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Tapez un email et appuyez sur Espace pour l'ajouter"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleEmailKeyPress}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addEmail}
                disabled={!emailInput.trim() || !isValidEmail(emailInput.trim()) || isSubmitting}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              Tapez une adresse email et appuyez sur Espace pour l'ajouter à la liste
            </p>
          </div>

          {/* Sujet */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Sujet de l'email
            </label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sujet de l'email"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Message personnalisé
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message aux clients"
              className="min-h-[200px] resize-none"
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-gray-500">
              Un lien vers la page d'avis sera automatiquement ajouté à la fin du message
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || emails.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer {emails.length > 0 && `(${emails.length})`}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
