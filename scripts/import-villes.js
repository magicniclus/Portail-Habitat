#!/usr/bin/env node
/**
 * Script d'import de la collection `villes` depuis le fichier officiel data.gouv.fr
 *
 * SOURCE : https://www.data.gouv.fr/fr/datasets/communes-de-france/
 * Télécharger le fichier CSV "communes-departement-region.csv" depuis :
 *   https://raw.githubusercontent.com/nicovell3/france/master/data/communes.csv
 * OU depuis l'API IGN/INSEE :
 *   https://geo.api.gouv.fr/communes?fields=code,nom,codeDepartement,codeRegion,centre,population&format=json&geometry=centre
 *
 * UTILISATION :
 *   node scripts/import-villes.js [--min-pop=5000] [--dry-run]
 *
 * OPTIONS :
 *   --min-pop=N    Population minimale (défaut: 5000)
 *   --dry-run      Affiche le nombre de villes sans écrire en base
 *   --batch=N      Taille des batches Firestore (défaut: 400)
 *
 * PRÉREQUIS :
 *   npm install firebase-admin node-fetch
 *   Variables d'environnement (ou .env) :
 *     FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */

const https = require("https");

// ─── Configuration ─────────────────────────────────────────────────────────────

const MIN_POPULATION = parseInt(
  process.argv.find((a) => a.startsWith("--min-pop="))?.split("=")[1] ?? "5000"
);
const DRY_RUN = process.argv.includes("--dry-run");
const BATCH_SIZE = parseInt(
  process.argv.find((a) => a.startsWith("--batch="))?.split("=")[1] ?? "400"
);

// ─── Firebase init ─────────────────────────────────────────────────────────────

const { db } = require("./_firebase-init");

// ─── Normalisation slug ────────────────────────────────────────────────────────

const HOMONYMES = new Map(); // slug -> count

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildUniqueSlug(nom, depCode, existingSlugs) {
  const base = toSlug(nom);
  if (!existingSlugs.has(base)) {
    existingSlugs.add(base);
    return base;
  }
  // Suffixer avec le code département pour les homonymes
  const withDep = `${base}-${depCode}`;
  if (!existingSlugs.has(withDep)) {
    existingSlugs.add(withDep);
    return withDep;
  }
  // Cas extrême : ajouter un compteur
  let i = 2;
  while (existingSlugs.has(`${base}-${i}`)) i++;
  const withCount = `${base}-${i}`;
  existingSlugs.add(withCount);
  return withCount;
}

// ─── Données département ───────────────────────────────────────────────────────

const DEPARTEMENTS = {
  "01": { nom: "Ain", slug: "ain", region: "Auvergne-Rhône-Alpes" },
  "02": { nom: "Aisne", slug: "aisne", region: "Hauts-de-France" },
  "03": { nom: "Allier", slug: "allier", region: "Auvergne-Rhône-Alpes" },
  "04": { nom: "Alpes-de-Haute-Provence", slug: "alpes-de-haute-provence", region: "Provence-Alpes-Côte d'Azur" },
  "05": { nom: "Hautes-Alpes", slug: "hautes-alpes", region: "Provence-Alpes-Côte d'Azur" },
  "06": { nom: "Alpes-Maritimes", slug: "alpes-maritimes", region: "Provence-Alpes-Côte d'Azur" },
  "07": { nom: "Ardèche", slug: "ardeche", region: "Auvergne-Rhône-Alpes" },
  "08": { nom: "Ardennes", slug: "ardennes", region: "Grand Est" },
  "09": { nom: "Ariège", slug: "ariege", region: "Occitanie" },
  "10": { nom: "Aube", slug: "aube", region: "Grand Est" },
  "11": { nom: "Aude", slug: "aude", region: "Occitanie" },
  "12": { nom: "Aveyron", slug: "aveyron", region: "Occitanie" },
  "13": { nom: "Bouches-du-Rhône", slug: "bouches-du-rhone", region: "Provence-Alpes-Côte d'Azur" },
  "14": { nom: "Calvados", slug: "calvados", region: "Normandie" },
  "15": { nom: "Cantal", slug: "cantal", region: "Auvergne-Rhône-Alpes" },
  "16": { nom: "Charente", slug: "charente", region: "Nouvelle-Aquitaine" },
  "17": { nom: "Charente-Maritime", slug: "charente-maritime", region: "Nouvelle-Aquitaine" },
  "18": { nom: "Cher", slug: "cher", region: "Centre-Val de Loire" },
  "19": { nom: "Corrèze", slug: "correze", region: "Nouvelle-Aquitaine" },
  "2A": { nom: "Corse-du-Sud", slug: "corse-du-sud", region: "Corse" },
  "2B": { nom: "Haute-Corse", slug: "haute-corse", region: "Corse" },
  "21": { nom: "Côte-d'Or", slug: "cote-d-or", region: "Bourgogne-Franche-Comté" },
  "22": { nom: "Côtes-d'Armor", slug: "cotes-d-armor", region: "Bretagne" },
  "23": { nom: "Creuse", slug: "creuse", region: "Nouvelle-Aquitaine" },
  "24": { nom: "Dordogne", slug: "dordogne", region: "Nouvelle-Aquitaine" },
  "25": { nom: "Doubs", slug: "doubs", region: "Bourgogne-Franche-Comté" },
  "26": { nom: "Drôme", slug: "drome", region: "Auvergne-Rhône-Alpes" },
  "27": { nom: "Eure", slug: "eure", region: "Normandie" },
  "28": { nom: "Eure-et-Loir", slug: "eure-et-loir", region: "Centre-Val de Loire" },
  "29": { nom: "Finistère", slug: "finistere", region: "Bretagne" },
  "30": { nom: "Gard", slug: "gard", region: "Occitanie" },
  "31": { nom: "Haute-Garonne", slug: "haute-garonne", region: "Occitanie" },
  "32": { nom: "Gers", slug: "gers", region: "Occitanie" },
  "33": { nom: "Gironde", slug: "gironde", region: "Nouvelle-Aquitaine" },
  "34": { nom: "Hérault", slug: "herault", region: "Occitanie" },
  "35": { nom: "Ille-et-Vilaine", slug: "ille-et-vilaine", region: "Bretagne" },
  "36": { nom: "Indre", slug: "indre", region: "Centre-Val de Loire" },
  "37": { nom: "Indre-et-Loire", slug: "indre-et-loire", region: "Centre-Val de Loire" },
  "38": { nom: "Isère", slug: "isere", region: "Auvergne-Rhône-Alpes" },
  "39": { nom: "Jura", slug: "jura", region: "Bourgogne-Franche-Comté" },
  "40": { nom: "Landes", slug: "landes", region: "Nouvelle-Aquitaine" },
  "41": { nom: "Loir-et-Cher", slug: "loir-et-cher", region: "Centre-Val de Loire" },
  "42": { nom: "Loire", slug: "loire", region: "Auvergne-Rhône-Alpes" },
  "43": { nom: "Haute-Loire", slug: "haute-loire", region: "Auvergne-Rhône-Alpes" },
  "44": { nom: "Loire-Atlantique", slug: "loire-atlantique", region: "Pays de la Loire" },
  "45": { nom: "Loiret", slug: "loiret", region: "Centre-Val de Loire" },
  "46": { nom: "Lot", slug: "lot", region: "Occitanie" },
  "47": { nom: "Lot-et-Garonne", slug: "lot-et-garonne", region: "Nouvelle-Aquitaine" },
  "48": { nom: "Lozère", slug: "lozere", region: "Occitanie" },
  "49": { nom: "Maine-et-Loire", slug: "maine-et-loire", region: "Pays de la Loire" },
  "50": { nom: "Manche", slug: "manche", region: "Normandie" },
  "51": { nom: "Marne", slug: "marne", region: "Grand Est" },
  "52": { nom: "Haute-Marne", slug: "haute-marne", region: "Grand Est" },
  "53": { nom: "Mayenne", slug: "mayenne", region: "Pays de la Loire" },
  "54": { nom: "Meurthe-et-Moselle", slug: "meurthe-et-moselle", region: "Grand Est" },
  "55": { nom: "Meuse", slug: "meuse", region: "Grand Est" },
  "56": { nom: "Morbihan", slug: "morbihan", region: "Bretagne" },
  "57": { nom: "Moselle", slug: "moselle", region: "Grand Est" },
  "58": { nom: "Nièvre", slug: "nievre", region: "Bourgogne-Franche-Comté" },
  "59": { nom: "Nord", slug: "nord", region: "Hauts-de-France" },
  "60": { nom: "Oise", slug: "oise", region: "Hauts-de-France" },
  "61": { nom: "Orne", slug: "orne", region: "Normandie" },
  "62": { nom: "Pas-de-Calais", slug: "pas-de-calais", region: "Hauts-de-France" },
  "63": { nom: "Puy-de-Dôme", slug: "puy-de-dome", region: "Auvergne-Rhône-Alpes" },
  "64": { nom: "Pyrénées-Atlantiques", slug: "pyrenees-atlantiques", region: "Nouvelle-Aquitaine" },
  "65": { nom: "Hautes-Pyrénées", slug: "hautes-pyrenees", region: "Occitanie" },
  "66": { nom: "Pyrénées-Orientales", slug: "pyrenees-orientales", region: "Occitanie" },
  "67": { nom: "Bas-Rhin", slug: "bas-rhin", region: "Grand Est" },
  "68": { nom: "Haut-Rhin", slug: "haut-rhin", region: "Grand Est" },
  "69": { nom: "Rhône", slug: "rhone", region: "Auvergne-Rhône-Alpes" },
  "70": { nom: "Haute-Saône", slug: "haute-saone", region: "Bourgogne-Franche-Comté" },
  "71": { nom: "Saône-et-Loire", slug: "saone-et-loire", region: "Bourgogne-Franche-Comté" },
  "72": { nom: "Sarthe", slug: "sarthe", region: "Pays de la Loire" },
  "73": { nom: "Savoie", slug: "savoie", region: "Auvergne-Rhône-Alpes" },
  "74": { nom: "Haute-Savoie", slug: "haute-savoie", region: "Auvergne-Rhône-Alpes" },
  "75": { nom: "Paris", slug: "paris", region: "Île-de-France" },
  "76": { nom: "Seine-Maritime", slug: "seine-maritime", region: "Normandie" },
  "77": { nom: "Seine-et-Marne", slug: "seine-et-marne", region: "Île-de-France" },
  "78": { nom: "Yvelines", slug: "yvelines", region: "Île-de-France" },
  "79": { nom: "Deux-Sèvres", slug: "deux-sevres", region: "Nouvelle-Aquitaine" },
  "80": { nom: "Somme", slug: "somme", region: "Hauts-de-France" },
  "81": { nom: "Tarn", slug: "tarn", region: "Occitanie" },
  "82": { nom: "Tarn-et-Garonne", slug: "tarn-et-garonne", region: "Occitanie" },
  "83": { nom: "Var", slug: "var", region: "Provence-Alpes-Côte d'Azur" },
  "84": { nom: "Vaucluse", slug: "vaucluse", region: "Provence-Alpes-Côte d'Azur" },
  "85": { nom: "Vendée", slug: "vendee", region: "Pays de la Loire" },
  "86": { nom: "Vienne", slug: "vienne", region: "Nouvelle-Aquitaine" },
  "87": { nom: "Haute-Vienne", slug: "haute-vienne", region: "Nouvelle-Aquitaine" },
  "88": { nom: "Vosges", slug: "vosges", region: "Grand Est" },
  "89": { nom: "Yonne", slug: "yonne", region: "Bourgogne-Franche-Comté" },
  "90": { nom: "Territoire de Belfort", slug: "territoire-de-belfort", region: "Bourgogne-Franche-Comté" },
  "91": { nom: "Essonne", slug: "essonne", region: "Île-de-France" },
  "92": { nom: "Hauts-de-Seine", slug: "hauts-de-seine", region: "Île-de-France" },
  "93": { nom: "Seine-Saint-Denis", slug: "seine-saint-denis", region: "Île-de-France" },
  "94": { nom: "Val-de-Marne", slug: "val-de-marne", region: "Île-de-France" },
  "95": { nom: "Val-d'Oise", slug: "val-d-oise", region: "Île-de-France" },
  "971": { nom: "Guadeloupe", slug: "guadeloupe", region: "Guadeloupe" },
  "972": { nom: "Martinique", slug: "martinique", region: "Martinique" },
  "973": { nom: "Guyane", slug: "guyane", region: "Guyane" },
  "974": { nom: "La Réunion", slug: "la-reunion", region: "La Réunion" },
  "976": { nom: "Mayotte", slug: "mayotte", region: "Mayotte" },
};

// ─── Fetch depuis l'API Geo.api.gouv.fr ───────────────────────────────────────

async function fetchCommunes() {
  const url =
    "https://geo.api.gouv.fr/communes?fields=code,nom,codeDepartement,centre,population&format=json&geometry=centre";

  console.log("📡 Téléchargement des communes depuis geo.api.gouv.fr...");

  return new Promise((resolve, reject) => {
    const data = [];
    https
      .get(url, (res) => {
        res.on("data", (chunk) => data.push(chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(data).toString()));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

// ─── Import principal ─────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🏙  Import villes — population ≥ ${MIN_POPULATION}${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  let communes;
  try {
    communes = await fetchCommunes();
  } catch (e) {
    console.error("❌ Impossible de télécharger les communes :", e.message);
    console.log(
      "\n💡 Alternative : téléchargez manuellement le fichier JSON depuis\n" +
      "   https://geo.api.gouv.fr/communes?fields=code,nom,codeDepartement,centre,population&format=json\n" +
      "   et placez-le dans scripts/communes.json, puis relancez le script.\n"
    );
    process.exit(1);
  }

  // Filtrage par population
  const filtered = communes.filter(
    (c) => c.population >= MIN_POPULATION && c.codeDepartement
  );

  console.log(
    `✅ ${filtered.length} communes retenues sur ${communes.length} (pop ≥ ${MIN_POPULATION})`
  );

  if (DRY_RUN) {
    console.log("\n[DRY RUN] — aucune écriture en base.");
    process.exit(0);
  }

  // Build des documents Firestore
  const existingSlugs = new Set();
  const docs = filtered.map((c) => {
    const depCode = c.codeDepartement;
    const dep = DEPARTEMENTS[depCode] ?? {
      nom: `Département ${depCode}`,
      slug: `dep-${depCode}`,
      region: "France",
    };

    const slug = buildUniqueSlug(c.nom, depCode, existingSlugs);
    const centre = c.centre?.coordinates ?? [0, 0];

    return {
      id: c.code, // code INSEE = doc ID
      data: {
        nom: c.nom,
        slug,
        departement_code: depCode,
        departement_nom: dep.nom,
        departement_slug: dep.slug,
        region: dep.region,
        population: c.population ?? 0,
        lat: centre[1],
        lng: centre[0],
      },
    };
  });

  // Écriture par batches (limite Firestore : 500 ops/batch)
  let written = 0;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const { id, data } of chunk) {
      batch.set(db.collection("villes").doc(id), data, { merge: true });
    }
    await batch.commit();
    written += chunk.length;
    process.stdout.write(`\r  ${written}/${docs.length} villes importées...`);
  }

  console.log(`\n\n✅ Import terminé : ${written} villes dans Firestore.`);
  console.log("💡 Pensez à créer les index Firestore nécessaires (voir README).\n");
  process.exit(0);
}

main().catch((e) => {
  console.error("Erreur fatale :", e);
  process.exit(1);
});
