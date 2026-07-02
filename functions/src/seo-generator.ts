/**
 * Cloud Function Firebase — Génération automatique des pages SEO
 *
 * DÉCLENCHEURS :
 * 1. onArtisanUpdated : déclenché quand un artisan modifie privacy.profileVisible,
 *    profession, ou communes_couvertes
 * 2. onArtisanDeleted : déclenché quand un artisan est supprimé
 *
 * LOGIQUE :
 * - Artisan activé (profileVisible = true) → créer/incrémenter les pages SEO
 *   pour chaque (métier × commune couverte)
 * - Artisan désactivé → décrémenter, passer en noindex si nb_artisans = 0
 *
 * DÉPLOIEMENT :
 *   cd functions && npm install && npx firebase deploy --only functions
 *
 * VARIABLES D'ENVIRONNEMENT (Firebase Functions config) :
 *   firebase functions:config:set openai.key="sk-..."
 *   firebase functions:config:set netlify.revalidate_url="https://..."
 *   firebase functions:config:set netlify.revalidate_secret="..."
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";
import fetch from "node-fetch";
import { METIERS } from "../../lib/metiers";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ─── Helpers géo ──────────────────────────────────────────────────────────────

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function computeCommunesCouvertes(
  lat: number,
  lng: number,
  rayonKm: number
): Promise<string[]> {
  const MAX_COMMUNES = 80;
  const snap = await db.collection("villes").get();
  const result: string[] = [];

  for (const doc of snap.docs) {
    if (result.length >= MAX_COMMUNES) break;
    const v = doc.data();
    if (!v.lat || !v.lng) continue;
    const dist = haversineKm(lat, lng, v.lat, v.lng);
    if (dist <= rayonKm) result.push(doc.id);
  }

  return result;
}

// ─── Génération contenu IA ────────────────────────────────────────────────────

const PROMPT_TEMPLATES = [
  (m: string, syn: string, v: string, dep: string, pop: number) =>
    `Tu es rédacteur pour un annuaire d'artisans vérifiés. Rédige pour la ville de ${v} (${dep}, ${pop} hab.) une fiche pour le métier "${m}" (synonymes : ${syn}).
Produis un JSON strict avec :
- "intro": texte naturel de 80-100 mots mentionnant ${v} 1-2 fois max, tissant 2-3 synonymes naturellement, sans superlatifs ni promesses invérifiables
- "h2_synonyme": titre H2 pour une section sur les synonymes principaux
- "paragraphe_synonyme": paragraphe de 40-60 mots sur ces synonymes
- "faq": tableau de 4 objets {q, r} avec des questions/réponses locales factuelles (prix en fourchettes prudentes, aides type MaPrimeRénov si applicable, délais, choix de l'artisan)
Réponds UNIQUEMENT avec le JSON, sans markdown ni commentaire.`,

  (m: string, syn: string, v: string, dep: string, pop: number) =>
    `Rédacteur pour portail-habitat.fr, annuaire d'artisans. Ville : ${v} (${dep}, ~${pop} habitants). Métier : ${m}. Termes associés : ${syn}.
Génère un JSON :
{
  "intro": "80 à 110 mots, ton informatif, ${v} cité naturellement, 2-3 synonymes intégrés",
  "h2_synonyme": "Titre de section sur les appellations alternatives du métier",
  "paragraphe_synonyme": "45-55 mots expliquant les différentes appellations",
  "faq": [{"q": "...", "r": "..."}, ...] // 4 Q/R locales avec fourchettes de prix prudentes
}
Renvoie uniquement le JSON valide.`,

  (m: string, syn: string, v: string, dep: string, pop: number) =>
    `Contexte : page de résultats "${m} à ${v}" sur un annuaire d'artisans. Département : ${dep}. Population : ${pop}. Synonymes courants : ${syn}.
Retourne un objet JSON (sans balises markdown) avec :
intro (85-105 mots, concis, professionnel, ${v} mentionné avec sobriété, synonymes naturels),
h2_synonyme (titre accrocheur),
paragraphe_synonyme (50 mots max),
faq (4 questions pratiques avec réponses courtes et fourchettes de prix honnêtes).`,

  (m: string, syn: string, v: string, dep: string, pop: number) =>
    `Tu rédiges une introduction et une FAQ pour la page "${m} à ${v}" (${dep}). Population de ${v} : environ ${pop} habitants. Synonymes du métier : ${syn}.
Format attendu : JSON pur, sans explications.
Champs : intro (80-120 mots, naturel, 1-2 mentions de ${v}), h2_synonyme (court titre H2), paragraphe_synonyme (40-60 mots), faq (4 Q/R, prix en fourchettes larges, ton neutre).`,
];

async function generateContenIA(
  metierNom: string,
  synonymes: string[],
  villeNom: string,
  depNom: string,
  population: number,
  pageId: string
): Promise<{ intro: string; h2_synonyme: string; paragraphe_synonyme: string; faq: { q: string; r: string }[] }> {
  const templateIdx = Math.abs(hashCode(pageId)) % PROMPT_TEMPLATES.length;
  const prompt = PROMPT_TEMPLATES[templateIdx](
    metierNom,
    synonymes.slice(0, 5).join(", "),
    villeNom,
    depNom,
    population
  );

  const openai = new OpenAI({ apiKey: functions.config().openai?.key ?? process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 900,
  });

  const text = response.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(text);

  return {
    intro: parsed.intro ?? "",
    h2_synonyme: parsed.h2_synonyme ?? "",
    paragraphe_synonyme: parsed.paragraphe_synonyme ?? "",
    faq: Array.isArray(parsed.faq) ? parsed.faq.slice(0, 5) : [],
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash;
}

// ─── Core : upsert page SEO ───────────────────────────────────────────────────

async function upsertPageSeo(
  metierSlug: string,
  metierNom: string,
  metierId: number,
  metierSynonymes: string[],
  codeInsee: string,
  delta: 1 | -1
) {
  const villeDoc = await db.collection("villes").doc(codeInsee).get();
  if (!villeDoc.exists) return;
  const ville = villeDoc.data()!;

  const pageId = `${metierSlug}__${ville.slug}`;
  const depPageId = `${metierSlug}__dep__${ville.departement_slug}`;
  const nationalPageId = `${metierSlug}__national`;

  const pageRef = db.collection("pages_seo").doc(pageId);
  const depRef = db.collection("pages_seo").doc(depPageId);

  const pageSnap = await pageRef.get();

  if (delta === 1 && !pageSnap.exists) {
    // Créer la page ville
    const contenu_ia = await generateContenIA(
      metierNom,
      metierSynonymes,
      ville.nom,
      ville.departement_nom,
      ville.population ?? 0,
      pageId
    );

    await pageRef.set({
      type: "ville",
      metier_id: metierId,
      metier_slug: metierSlug,
      metier_nom: metierNom,
      ville_code_insee: codeInsee,
      ville_slug: ville.slug,
      ville_nom: ville.nom,
      departement_code: ville.departement_code,
      departement_slug: ville.departement_slug,
      departement_nom: ville.departement_nom,
      statut: "publiee",
      nb_artisans: 1,
      contenu_ia,
      date_creation: admin.firestore.FieldValue.serverTimestamp(),
      date_maj: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else if (pageSnap.exists) {
    const current = pageSnap.data()!;
    const newCount = Math.max(0, (current.nb_artisans ?? 0) + delta);
    await pageRef.update({
      nb_artisans: newCount,
      statut: newCount > 0 ? "publiee" : "noindex",
      date_maj: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Département : upsert simplifié (pas de contenu IA riche)
  const depSnap = await depRef.get();
  if (delta === 1 && !depSnap.exists) {
    await depRef.set({
      type: "departement",
      metier_id: metierId,
      metier_slug: metierSlug,
      metier_nom: metierNom,
      departement_code: ville.departement_code,
      departement_slug: ville.departement_slug,
      departement_nom: ville.departement_nom,
      statut: "publiee",
      nb_artisans: 1,
      contenu_ia: {
        intro: `Trouvez un ${metierNom.toLowerCase()} en ${ville.departement_nom}. Artisans vérifiés, avis clients et devis gratuit.`,
        faq: [],
      },
      date_creation: admin.firestore.FieldValue.serverTimestamp(),
      date_maj: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else if (depSnap.exists) {
    const current = depSnap.data()!;
    const newCount = Math.max(0, (current.nb_artisans ?? 0) + delta);
    await depRef.update({
      nb_artisans: newCount,
      statut: newCount > 0 ? "publiee" : "noindex",
      date_maj: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Revalider les pages Netlify/Next.js si configuré
  await revalidateSeoPage(pageId);
  await revalidateSeoPage(depPageId);
  await revalidateSeoPage(nationalPageId);
}

async function revalidateSeoPage(pageId: string) {
  const revalidateUrl = functions.config().netlify?.revalidate_url;
  const revalidateSecret = functions.config().netlify?.revalidate_secret;
  if (!revalidateUrl || !revalidateSecret) return;

  try {
    await fetch(`${revalidateUrl}/api/seo/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${revalidateSecret}`,
      },
      body: JSON.stringify({ pageId }),
    });
  } catch {
    // Non bloquant
  }
}

// ─── Cloud Function : onArtisanUpdated ───────────────────────────────────────

export const onArtisanUpdated = functions.firestore
  .document("artisans/{artisanId}")
  .onWrite(async (change, context) => {
    const before = change.before.data() ?? {};
    const after = change.after.data();

    const wasVisible = before.privacy?.profileVisible === true;
    const isVisible = after?.privacy?.profileVisible === true;
    const professionAfter: string = after?.profession ?? "";

    if (!change.after.exists) {
      // Artisan supprimé
      if (!wasVisible) return;
      const communes: string[] = before.communes_couvertes ?? [];
      const m = METIERS.find((x) => x.slug === before.profession);
      if (!m) return;
      for (const c of communes) {
        await upsertPageSeo(m.slug, m.nom, m.id, m.synonymes, c, -1);
      }
      return;
    }

    const communesBefore: string[] = before.communes_couvertes ?? [];
    const communesAfter: string[] = after?.communes_couvertes ?? [];
    const metierBefore: string = before.profession ?? "";
    const coords = after?.coordinates;

    // Recalculer communes si rayon ou coordonnées changent
    if (isVisible && coords?.lat && coords?.lng) {
      const rayonKm = after?.rayon_km ?? 30;
      const newCommunes = await computeCommunesCouvertes(coords.lat, coords.lng, rayonKm);
      if (JSON.stringify(newCommunes.sort()) !== JSON.stringify(communesAfter.sort())) {
        await change.after.ref.update({ communes_couvertes: newCommunes });
        return; // Le trigger se redéclenchera avec les nouvelles communes
      }
    }

    const metier = METIERS.find((x) => x.slug === professionAfter);
    if (!metier) return;

    // Cas 1 : Artisan activé (passé visible)
    if (!wasVisible && isVisible) {
      for (const c of communesAfter) {
        await upsertPageSeo(metier.slug, metier.nom, metier.id, metier.synonymes, c, 1);
      }
    }

    // Cas 2 : Artisan désactivé
    else if (wasVisible && !isVisible) {
      const m = METIERS.find((x) => x.slug === metierBefore) ?? metier;
      for (const c of communesBefore) {
        await upsertPageSeo(m.slug, m.nom, m.id, m.synonymes, c, -1);
      }
    }

    // Cas 3 : Changement de communes (même artisan visible, rayon changé)
    else if (isVisible) {
      const added = communesAfter.filter((c) => !communesBefore.includes(c));
      const removed = communesBefore.filter((c) => !communesAfter.includes(c));
      for (const c of added) {
        await upsertPageSeo(metier.slug, metier.nom, metier.id, metier.synonymes, c, 1);
      }
      for (const c of removed) {
        await upsertPageSeo(metier.slug, metier.nom, metier.id, metier.synonymes, c, -1);
      }
    }
  });
