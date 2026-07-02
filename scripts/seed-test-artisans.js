#!/usr/bin/env node
/**
 * Script de seed de test — 5 artisans fictifs pour valider le système SEO
 *
 * UTILISATION :
 *   node scripts/seed-test-artisans.js [--cleanup]
 *
 * OPTIONS :
 *   --cleanup  Supprime les artisans de test (ceux dont l'ID commence par "test-")
 *
 * CE QUE LE SEED VALIDE :
 * 1. Création automatique des pages_seo ville + département via Cloud Function
 * 2. Compteurs nb_artisans corrects
 * 3. noindex quand on désactive le dernier artisan
 * 4. Couverture multi-départements (artisan avec grand rayon)
 */

const { db, admin } = require("./_firebase-init");
const CLEANUP = process.argv.includes("--cleanup");

const TEST_ARTISANS = [
  {
    id: "test-plombier-lyon",
    data: {
      companyName: "Plomberie Dupont",
      firstName: "Jean",
      lastName: "Dupont",
      email: "test-plombier@portail-habitat.fr",
      phone: "0600000001",
      city: "Lyon",
      postalCode: "69001",
      coordinates: { lat: 45.7640, lng: 4.8357 },
      profession: "plombier",
      professions: ["plomberie", "dépannage fuite"],
      description: "Artisan plombier à Lyon depuis 10 ans. Dépannage urgent, installation sanitaire.",
      averageRating: 4.8,
      reviewCount: 12,
      averageQuoteMin: 80,
      averageQuoteMax: 250,
      rayon_km: 30,
      // communes_couvertes sera calculé par la Cloud Function
      communes_couvertes: ["69123", "69003", "69002"],
      departement_code: "69",
      privacy: { profileVisible: true, showPhone: true, showEmail: false, allowDirectContact: true },
      premiumFeatures: { isPremium: true, showTopArtisanBadge: true },
      certifications: ["Qualibat"],
      ficheComplete: true,
      slug: "jean-dupont-plombier-69-test",
      siret: "12345678901234",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
  {
    id: "test-electricien-paris",
    data: {
      companyName: "Élec Pro Paris",
      firstName: "Marie",
      lastName: "Bernard",
      email: "test-electricien@portail-habitat.fr",
      phone: "0600000002",
      city: "Paris",
      postalCode: "75011",
      coordinates: { lat: 48.8566, lng: 2.3522 },
      profession: "electricien",
      professions: ["électricité", "tableau électrique", "domotique"],
      description: "Électricienne certifiée à Paris. Mise aux normes, installation, domotique.",
      averageRating: 4.9,
      reviewCount: 28,
      averageQuoteMin: 120,
      averageQuoteMax: 400,
      rayon_km: 25,
      communes_couvertes: ["75056", "92007", "93001"],
      departement_code: "75",
      privacy: { profileVisible: true, showPhone: true, showEmail: false, allowDirectContact: true },
      premiumFeatures: { isPremium: false, showTopArtisanBadge: false },
      ficheComplete: true,
      slug: "marie-bernard-electricien-75-test",
      siret: "23456789012345",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
  {
    id: "test-macon-marseille",
    data: {
      companyName: "Maçonnerie Sud",
      firstName: "Pierre",
      lastName: "Martin",
      email: "test-macon@portail-habitat.fr",
      phone: "0600000003",
      city: "Marseille",
      postalCode: "13001",
      coordinates: { lat: 43.2965, lng: 5.3698 },
      profession: "macon",
      professions: ["maçonnerie", "gros œuvre", "extension maison"],
      description: "Maçon à Marseille. Extension, rénovation, murs porteurs.",
      averageRating: 4.5,
      reviewCount: 8,
      averageQuoteMin: 200,
      averageQuoteMax: 800,
      rayon_km: 50,
      communes_couvertes: ["13055", "13039", "83137"],
      departement_code: "13",
      privacy: { profileVisible: true, showPhone: true, showEmail: true, allowDirectContact: true },
      premiumFeatures: { isPremium: false, showTopArtisanBadge: false },
      ficheComplete: true,
      slug: "pierre-martin-macon-13-test",
      siret: "34567890123456",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
  {
    id: "test-couvreur-bordeaux",
    data: {
      companyName: "Toitures Gironde",
      firstName: "Luc",
      lastName: "Girard",
      email: "test-couvreur@portail-habitat.fr",
      phone: "0600000004",
      city: "Bordeaux",
      postalCode: "33000",
      coordinates: { lat: 44.8378, lng: -0.5792 },
      profession: "couvreur",
      professions: ["couverture", "toiture", "zinguerie"],
      description: "Couvreur à Bordeaux. Réparation toiture, tuiles, ardoises, zinguerie.",
      averageRating: 4.7,
      reviewCount: 15,
      averageQuoteMin: 300,
      averageQuoteMax: 1500,
      rayon_km: 40,
      communes_couvertes: ["33063", "33227", "33199"],
      departement_code: "33",
      privacy: { profileVisible: true, showPhone: true, showEmail: false, allowDirectContact: true },
      premiumFeatures: { isPremium: true, showTopArtisanBadge: false },
      ficheComplete: true,
      slug: "luc-girard-couvreur-33-test",
      siret: "45678901234567",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
  {
    id: "test-isolation-rennes",
    data: {
      companyName: "Iso Bretagne",
      firstName: "Sophie",
      lastName: "Lebrun",
      email: "test-isolation@portail-habitat.fr",
      phone: "0600000005",
      city: "Rennes",
      postalCode: "35000",
      coordinates: { lat: 48.1173, lng: -1.6778 },
      profession: "isolation",
      professions: ["isolation combles", "ITE", "isolation thermique"],
      description: "Spécialiste isolation à Rennes. ITE, combles, murs. Certifiée RGE.",
      averageRating: 4.9,
      reviewCount: 22,
      averageQuoteMin: 150,
      averageQuoteMax: 600,
      rayon_km: 45,
      communes_couvertes: ["35238", "35047", "35206"],
      departement_code: "35",
      privacy: { profileVisible: true, showPhone: true, showEmail: false, allowDirectContact: true },
      premiumFeatures: { isPremium: false, showTopArtisanBadge: false },
      certifications: ["RGE", "Qualibat"],
      ficheComplete: true,
      slug: "sophie-lebrun-isolation-35-test",
      siret: "56789012345678",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
];

async function cleanup() {
  console.log("🧹 Suppression des artisans de test...\n");
  for (const { id } of TEST_ARTISANS) {
    await db.collection("artisans").doc(id).delete();
    console.log(`  ✅ Supprimé : ${id}`);
  }

  // Nettoyer aussi les pages_seo de test
  const snap = await db.collection("pages_seo").get();
  let deleted = 0;
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.nb_artisans === 0 && d.statut === "noindex") {
      await doc.ref.delete();
      deleted++;
    }
  }
  console.log(`\n  🗑  ${deleted} pages_seo noindex supprimées.\n`);
  process.exit(0);
}

async function main() {
  if (CLEANUP) return cleanup();

  console.log("\n🧪 Seed artisans de test\n");
  for (const { id, data } of TEST_ARTISANS) {
    await db.collection("artisans").doc(id).set(data, { merge: true });
    console.log(`  ✅ ${data.companyName} (${id})`);
  }

  console.log(`
✅ ${TEST_ARTISANS.length} artisans de test créés.

⏳ PROCHAINES ÉTAPES :
1. Attendez ~30s que la Cloud Function se déclenche sur chaque artisan
2. Vérifiez les docs dans pages_seo/{metier}__national, pages_seo/{metier}__dep__*
3. Visitez http://localhost:3000/plombier/lyon pour voir la page SEO
4. Lancez : curl -s http://localhost:3000/plombier/lyon | grep -E '<h1|<title|application/ld'
5. Pour nettoyer : node scripts/seed-test-artisans.js --cleanup
`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
