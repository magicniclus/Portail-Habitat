/**
 * Initialisation Firebase Admin partagée pour tous les scripts Node.
 * Gère les deux formats de FIREBASE_PRIVATE_KEY rencontrés en pratique :
 *  1. Clé avec séquences d'échappement `\n` (format Netlify / CI)
 *  2. Clé copiée depuis la console Firebase avec espaces à la place des sauts de ligne
 */

const admin = require("firebase-admin");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

/**
 * Normalise une clé privée PEM quelle que soit sa mise en forme d'origine.
 * Gère :
 *  - `\n` littéraux (escape sequences) → vrais sauts de ligne
 *  - Clé sur une seule ligne avec espaces entre les blocs base64
 */
function normalizePrivateKey(raw) {
  if (!raw) throw new Error("FIREBASE_PRIVATE_KEY est absent de .env.local");

  // 1. Remplacer les séquences d'échappement \n par de vrais sauts de ligne
  let key = raw.replace(/\\n/g, "\n");

  // 2. Si la clé est toujours sur une seule ligne (pas de \n réel)
  if (!key.includes("\n")) {
    // Extraire le contenu entre les headers PEM (en ignorant les espaces autour)
    const pemContent = key
      .replace(/-----BEGIN PRIVATE KEY-----\s*/, "")
      .replace(/\s*-----END PRIVATE KEY-----/, "")
      .replace(/\s+/g, ""); // supprimer tous les espaces/sauts

    // Reconstituer un PEM standard avec des lignes de 64 caractères
    const lines = pemContent.match(/.{1,64}/g) ?? [];
    key = [
      "-----BEGIN PRIVATE KEY-----",
      ...lines,
      "-----END PRIVATE KEY-----",
      "", // newline final
    ].join("\n");
  }

  return key;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY ?? ""),
    }),
  });
}

module.exports = {
  db: admin.firestore(),
  admin,
};
