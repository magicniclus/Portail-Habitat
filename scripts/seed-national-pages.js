#!/usr/bin/env node
/**
 * Script de seed : crée les 36 pages SEO nationales (une par métier officiel).
 * À exécuter UNE FOIS au déploiement initial.
 *
 * UTILISATION :
 *   node scripts/seed-national-pages.js [--dry-run]
 *
 * Le contenu IA des pages nationales est un template générique
 * qui peut être enrichi via l'interface admin.
 */

const { db, admin } = require("./_firebase-init");
const DRY_RUN = process.argv.includes("--dry-run");

// Import de la liste des métiers (transpilé ou inline)
const METIERS = [
  { id: 1, nom: "Plombier", slug: "plombier", synonymes: ["plomberie", "dépannage plomberie", "fuite d'eau"] },
  { id: 2, nom: "Électricien", slug: "electricien", synonymes: ["électricité", "mise aux normes électrique", "tableau électrique"] },
  { id: 3, nom: "Chauffagiste", slug: "chauffagiste", synonymes: ["chauffage", "installateur chaudière"] },
  { id: 4, nom: "Serrurier", slug: "serrurier", synonymes: ["serrurerie", "ouverture de porte", "blindage"] },
  { id: 5, nom: "Maçon", slug: "macon", synonymes: ["maçonnerie", "gros œuvre", "extension maison"] },
  { id: 6, nom: "Peintre en bâtiment", slug: "peintre", synonymes: ["peinture", "rafraîchissement peinture"] },
  { id: 7, nom: "Couvreur", slug: "couvreur", synonymes: ["couverture", "toiture", "fuite toiture", "zingueur"] },
  { id: 8, nom: "Menuisier", slug: "menuisier", synonymes: ["menuiserie", "agencement", "placard sur mesure"] },
  { id: 9, nom: "Carreleur", slug: "carreleur", synonymes: ["carrelage", "pose carrelage", "faïence"] },
  { id: 10, nom: "Jardinier-paysagiste", slug: "paysagiste", synonymes: ["jardinier", "entretien jardin", "élagage"] },
  { id: 11, nom: "Installateur de climatisation", slug: "climatisation", synonymes: ["clim", "climatiseur", "gainable"] },
  { id: 12, nom: "Installateur pompe à chaleur", slug: "pompe-a-chaleur", synonymes: ["PAC", "pac air eau", "pac air air"] },
  { id: 13, nom: "Entreprise d'isolation", slug: "isolation", synonymes: ["isolation combles", "ITE", "isolation extérieure"] },
  { id: 14, nom: "Installateur de fenêtres", slug: "fenetres", synonymes: ["pose fenêtre", "double vitrage", "baie vitrée"] },
  { id: 15, nom: "Entreprise de rénovation", slug: "renovation", synonymes: ["rénovation complète", "travaux tous corps d'état"] },
  { id: 16, nom: "Plaquiste", slug: "plaquiste", synonymes: ["placo", "faux plafond", "plâtrier", "ba13"] },
  { id: 17, nom: "Charpentier", slug: "charpentier", synonymes: ["charpente", "charpente bois"] },
  { id: 18, nom: "Façadier", slug: "facadier", synonymes: ["ravalement de façade", "enduit façade", "crépi"] },
  { id: 19, nom: "Terrassier", slug: "terrassement", synonymes: ["terrassement", "nivellement", "viabilisation"] },
  { id: 20, nom: "Cuisiniste", slug: "cuisiniste", synonymes: ["pose cuisine", "cuisine équipée"] },
  { id: 21, nom: "Pisciniste", slug: "pisciniste", synonymes: ["construction piscine", "entretien piscine"] },
  { id: 22, nom: "Vitrier", slug: "vitrier", synonymes: ["vitrerie", "remplacement vitre", "miroiterie"] },
  { id: 23, nom: "Solier / poseur de sols", slug: "poseur-de-sol", synonymes: ["pose parquet", "sol souple", "béton ciré"] },
  { id: 24, nom: "Étancheur", slug: "etancheite", synonymes: ["étanchéité toit terrasse", "infiltration"] },
  { id: 25, nom: "Installateur panneaux solaires", slug: "panneaux-solaires", synonymes: ["photovoltaïque", "panneau solaire"] },
  { id: 26, nom: "Installateur poêle & cheminée", slug: "poele-cheminee", synonymes: ["poêle à granulés", "poêle à bois", "insert"] },
  { id: 27, nom: "Salle de bain clé en main", slug: "salle-de-bain", synonymes: ["rénovation salle de bain", "douche italienne"] },
  { id: 28, nom: "Poseur de portails & clôtures", slug: "portail-cloture", synonymes: ["pose portail", "clôture", "portail motorisé"] },
  { id: 29, nom: "Entreprise d'assainissement", slug: "assainissement", synonymes: ["fosse septique", "débouchage canalisation"] },
  { id: 30, nom: "Métallier-ferronnier", slug: "metallier", synonymes: ["ferronnerie", "garde-corps", "escalier métallique"] },
  { id: 31, nom: "Entreprise de démolition", slug: "demolition", synonymes: ["démolition intérieure", "curage"] },
  { id: 32, nom: "Ramoneur", slug: "ramoneur", synonymes: ["ramonage", "ramonage cheminée"] },
  { id: 33, nom: "Poseur de stores & pergolas", slug: "store-pergola", synonymes: ["pergola bioclimatique", "store banne"] },
  { id: 34, nom: "Cordiste / travaux en hauteur", slug: "travaux-hauteur", synonymes: ["cordiste", "travaux acrobatiques"] },
  { id: 35, nom: "Nettoyage après travaux", slug: "nettoyage-chantier", synonymes: ["nettoyage fin de chantier"] },
  { id: 36, nom: "Diagnostiqueur immobilier", slug: "diagnostic-immobilier", synonymes: ["DPE", "diagnostic avant vente", "audit énergétique"] },
];

function buildNationalFaq(metierNom) {
  const m = metierNom.toLowerCase();
  return [
    {
      q: `Comment trouver un bon ${m} ?`,
      r: `Vérifiez les avis clients, les certifications (Qualibat, RGE…) et demandez plusieurs devis. Sur Portail Habitat, tous les artisans ont leur SIRET vérifié.`,
    },
    {
      q: `Quel est le prix moyen d'un ${m} ?`,
      r: `Les tarifs varient selon la région, la complexité et les matériaux. Demandez des devis comparatifs gratuits pour obtenir une fourchette adaptée à votre projet.`,
    },
    {
      q: `Comment vérifier qu'un ${m} est qualifié ?`,
      r: `Demandez son numéro SIRET, ses assurances (décennale, responsabilité civile) et ses éventuelles certifications. Sur Portail Habitat, le SIRET est vérifié pour chaque artisan.`,
    },
    {
      q: `Combien de temps faut-il pour trouver un ${m} ?`,
      r: `En utilisant Portail Habitat, vous pouvez recevoir des devis sous 24 à 48 heures selon la disponibilité des artisans de votre zone.`,
    },
    {
      q: `Faut-il signer un devis avant les travaux ?`,
      r: `Oui, un devis signé constitue un engagement contractuel. Il doit préciser les prestations, les matériaux, les délais et le prix total TTC.`,
    },
  ];
}

async function main() {
  console.log(`\n🌐 Seed des 36 pages SEO nationales${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let created = 0;
  let skipped = 0;

  for (const m of METIERS) {
    const id = `${m.slug}__national`;
    const ref = db.collection("pages_seo").doc(id);
    const snap = await ref.get();

    if (snap.exists) {
      console.log(`  ⏭  ${m.nom} — existe déjà`);
      skipped++;
      continue;
    }

    const doc = {
      type: "national",
      metier_id: m.id,
      metier_slug: m.slug,
      metier_nom: m.nom,
      statut: "publiee",
      nb_artisans: 0,
      contenu_ia: {
        intro: `Trouvez un ${m.nom.toLowerCase()} vérifié partout en France sur Portail Habitat. Comparez les artisans, consultez leurs avis clients et demandez vos devis gratuitement. Tous les ${m.nom.toLowerCase()}s référencés ont leur SIRET vérifié.`,
        h2_synonyme: `${m.nom} : les différentes appellations du métier`,
        paragraphe_synonyme: `Le métier de ${m.nom.toLowerCase()} est connu sous plusieurs appellations selon les régions et les spécialités : ${m.synonymes.slice(0, 3).join(", ")}. Quelle que soit la terminologie, vous trouverez sur Portail Habitat des professionnels qualifiés pour votre projet.`,
        faq: buildNationalFaq(m.nom),
      },
      date_creation: admin.firestore.FieldValue.serverTimestamp(),
      date_maj: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!DRY_RUN) {
      await ref.set(doc);
    }

    console.log(`  ✅ ${m.nom} → ${id}`);
    created++;
  }

  console.log(`\n✅ ${created} pages créées, ${skipped} ignorées (existaient déjà).`);
  if (DRY_RUN) console.log("[DRY RUN] — aucune écriture en base.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
