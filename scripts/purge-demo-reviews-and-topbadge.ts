import dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';

dotenv.config({ path: '.env' });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = getFirestore();

type PurgeStats = {
  demoArtisansCount: number;
  artisansWithTopBadge: number;
  totalReviewsFound: number;
  totalReviewsDeleted: number;
  artisansUpdated: number;
};

async function countAndOptionallyDeleteReviews(params: {
  artisanId: string;
  apply: boolean;
}): Promise<{ found: number; deleted: number }> {
  const reviewsRef = adminDb.collection('artisans').doc(params.artisanId).collection('reviews');

  let found = 0;
  let deleted = 0;

  // Pagination par batches de 500 (limite batch Firestore)
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | undefined;

  while (true) {
    let q: FirebaseFirestore.Query = reviewsRef.orderBy(FieldPath.documentId()).limit(500);
    if (lastDoc) q = q.startAfter(lastDoc);

    const snap = await q.get();
    if (snap.empty) break;

    found += snap.size;

    if (params.apply) {
      const batch = adminDb.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      deleted += snap.size;
    }

    lastDoc = snap.docs[snap.docs.length - 1];
  }

  return { found, deleted };
}

async function purgeDemoReviewsAndTopBadge(opts: { apply: boolean }): Promise<PurgeStats> {
  const stats: PurgeStats = {
    demoArtisansCount: 0,
    artisansWithTopBadge: 0,
    totalReviewsFound: 0,
    totalReviewsDeleted: 0,
    artisansUpdated: 0,
  };

  const demoArtisansSnap = await adminDb.collection('artisans').where('accountType', '==', 'demo').get();
  stats.demoArtisansCount = demoArtisansSnap.size;

  if (demoArtisansSnap.empty) {
    console.log('✅ Aucun artisan demo trouvé');
    return stats;
  }

  console.log(`🎭 Artisans demo trouvés: ${demoArtisansSnap.size}`);
  console.log(opts.apply ? '⚠️  MODE APPLY: suppression/updates réelles' : '🧪 MODE DRY-RUN: aucune suppression/maj');

  for (const artisanDoc of demoArtisansSnap.docs) {
    const artisanId = artisanDoc.id;
    const data = artisanDoc.data() as any;

    const companyLabel = data.companyName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || artisanId;

    const hasTopBadge = !!data?.premiumFeatures?.showTopArtisanBadge;
    if (hasTopBadge) stats.artisansWithTopBadge += 1;

    const { found, deleted } = await countAndOptionallyDeleteReviews({ artisanId, apply: opts.apply });
    stats.totalReviewsFound += found;
    stats.totalReviewsDeleted += deleted;

    const needsUpdate = hasTopBadge || (data?.reviewCount ?? 0) !== 0 || (data?.averageRating ?? 0) !== 0 || data?.isPriority;

    if (needsUpdate) {
      if (opts.apply) {
        await artisanDoc.ref.update({
          'premiumFeatures.showTopArtisanBadge': false,
          isPriority: false,
          reviewCount: 0,
          averageRating: 0,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      stats.artisansUpdated += 1;
    }

    console.log(
      `${opts.apply ? '✅' : '🔎'} ${companyLabel} | reviews: ${found}${opts.apply ? ` (deleted ${deleted})` : ''} | topBadge: ${hasTopBadge ? 'ON' : 'off'}${needsUpdate ? (opts.apply ? ' (updated)' : ' (would update)') : ''}`
    );
  }

  return stats;
}

const isDirectRun = (() => {
  try {
    // En ESM, on compare le fichier courant à argv[1]
    const current = new URL(import.meta.url).pathname;
    const invoked = process.argv[1] || '';
    return invoked.endsWith(current);
  } catch {
    return false;
  }
})();

if (isDirectRun) {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');

  purgeDemoReviewsAndTopBadge({ apply })
    .then((s) => {
      console.log('\n--- RÉCAP ---');
      console.log(`Artisans demo: ${s.demoArtisansCount}`);
      console.log(`Avec top badge: ${s.artisansWithTopBadge}`);
      console.log(`Reviews trouvées: ${s.totalReviewsFound}`);
      console.log(`Reviews supprimées: ${s.totalReviewsDeleted}`);
      console.log(`Artisans (would) updated: ${s.artisansUpdated}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erreur:', err);
      process.exit(1);
    });
}
