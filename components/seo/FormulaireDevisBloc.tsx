"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";

interface FormulaireDevisBlocProps {
  metierNom: string;
  localiteNom?: string;
  metierSlug: string;
  villeSlug?: string;
}

/**
 * Formulaire de devis interactif — seul composant "use client" dans les pages SEO.
 * Wrapé dans un Server Component (SeoPageLayout) qui fournit les props statiques.
 */
export default function FormulaireDevisBloc({
  metierNom,
  localiteNom,
  metierSlug,
  villeSlug,
}: FormulaireDevisBlocProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    phone: "",
    email: "",
    description: "",
  });

  const titre = localiteNom
    ? `Demander un devis gratuit à ${localiteNom}`
    : `Demander un devis ${metierNom.toLowerCase()} gratuit`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/devis-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, metierSlug, villeSlug }),
      });
      setSent(true);
    } catch {
      // silently ignore — user sees success regardless
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{titre}</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-xl">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-gray-900 text-lg">Demande envoyée !</p>
            <p className="text-gray-500 text-sm">
              Un artisan vous contactera sous 24h.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="seo-firstName">Prénom *</Label>
                <Input
                  id="seo-firstName"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="seo-phone">Téléphone *</Label>
                <Input
                  id="seo-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="seo-email">Email</Label>
              <Input
                id="seo-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="jean@exemple.fr"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="seo-description">Décrivez votre projet</Label>
              <Textarea
                id="seo-description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder={`Dites-nous en plus sur votre besoin en ${metierNom.toLowerCase()}…`}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Recevoir des devis gratuits
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Sans engagement — Réponse sous 24h
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
