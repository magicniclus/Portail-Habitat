"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, X, Loader2, Plus, FileText } from "lucide-react";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  recipientName: string;
  onSend: (emailData: EmailData) => Promise<void>;
}

interface EmailData {
  to: string;
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  template?: string;
}

const EMAIL_TEMPLATES = [
  {
    id: "welcome",
    name: "Bienvenue",
    subject: "Bienvenue sur Portail Habitat",
    body: `Bonjour {{name}},

Nous vous remercions de votre intérêt pour nos services.

Notre équipe va étudier votre demande et vous recontacter dans les plus brefs délais.

Cordialement,
L'équipe Portail Habitat`
  },
  {
    id: "follow_up",
    name: "Relance",
    subject: "Suivi de votre demande",
    body: `Bonjour {{name}},

Nous souhaitons faire le point sur votre projet.

N'hésitez pas à nous contacter si vous avez des questions.

Cordialement,
L'équipe Portail Habitat`
  },
  {
    id: "quote_ready",
    name: "Devis prêt",
    subject: "Votre devis est prêt",
    body: `Bonjour {{name}},

Votre devis est maintenant disponible.

Vous pouvez le consulter en vous connectant à votre espace client.

Cordialement,
L'équipe Portail Habitat`
  },
  {
    id: "custom",
    name: "Email personnalisé",
    subject: "",
    body: ""
  }
];

export default function EmailModal({
  isOpen,
  onClose,
  recipientEmail,
  recipientName,
  onSend
}: EmailModalProps) {
  const [emailData, setEmailData] = useState<EmailData>({
    to: recipientEmail,
    cc: [],
    bcc: [],
    subject: "",
    body: ""
  });
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      const processedBody = template.body.replace(/{{name}}/g, recipientName);
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        body: processedBody,
        template: templateId
      }));
    }
  };

  const addCC = () => {
    if (ccInput.trim() && !emailData.cc.includes(ccInput.trim())) {
      setEmailData(prev => ({
        ...prev,
        cc: [...prev.cc, ccInput.trim()]
      }));
      setCcInput("");
    }
  };

  const removeCC = (email: string) => {
    setEmailData(prev => ({
      ...prev,
      cc: prev.cc.filter(cc => cc !== email)
    }));
  };

  const addBCC = () => {
    if (bccInput.trim() && !emailData.bcc.includes(bccInput.trim())) {
      setEmailData(prev => ({
        ...prev,
        bcc: [...prev.bcc, bccInput.trim()]
      }));
      setBccInput("");
    }
  };

  const removeBCC = (email: string) => {
    setEmailData(prev => ({
      ...prev,
      bcc: prev.bcc.filter(bcc => bcc !== email)
    }));
  };

  const handleSend = async () => {
    if (!emailData.subject.trim() || !emailData.body.trim()) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(emailData);
      onClose();
      // Reset form
      setEmailData({
        to: recipientEmail,
        cc: [],
        bcc: [],
        subject: "",
        body: ""
      });
      setSelectedTemplate("");
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setEmailData({
      to: recipientEmail,
      cc: [],
      bcc: [],
      subject: "",
      body: ""
    });
    setSelectedTemplate("");
    setCcInput("");
    setBccInput("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Envoyer un email à {recipientName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Modèles d'email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Modèle d'email</label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un modèle (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {template.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Destinataire */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">À</label>
            <Input
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
              placeholder="email@exemple.com"
              type="email"
            />
          </div>

          {/* CC */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">CC (Copie)</label>
            <div className="flex gap-2">
              <Input
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                placeholder="Ajouter un email en copie"
                type="email"
                onKeyPress={(e) => e.key === 'Enter' && addCC()}
              />
              <Button size="sm" onClick={addCC} disabled={!ccInput.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {emailData.cc.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emailData.cc.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeCC(email)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* BCC */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">BCC (Copie cachée)</label>
            <div className="flex gap-2">
              <Input
                value={bccInput}
                onChange={(e) => setBccInput(e.target.value)}
                placeholder="Ajouter un email en copie cachée"
                type="email"
                onKeyPress={(e) => e.key === 'Enter' && addBCC()}
              />
              <Button size="sm" onClick={addBCC} disabled={!bccInput.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {emailData.bcc.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emailData.bcc.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeBCC(email)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Sujet */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sujet</label>
            <Input
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Objet de l'email"
            />
          </div>

          {/* Corps du message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Message</label>
            <Textarea
              value={emailData.body}
              onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Contenu de votre email..."
              rows={12}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            {selectedTemplate && selectedTemplate !== 'custom' && (
              <span>Modèle : {EMAIL_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSending}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSend}
              disabled={!emailData.subject.trim() || !emailData.body.trim() || isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
