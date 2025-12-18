import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function recomputeArtisanReviewStats(artisanId: string): Promise<{
  averageRating: number;
  reviewCount: number;
}> {
  const reviewsRef = collection(db, "artisans", artisanId, "reviews");
  const reviewsSnapshot = await getDocs(reviewsRef);

  let totalRating = 0;
  let reviewCount = 0;

  reviewsSnapshot.forEach((reviewDoc) => {
    const data = reviewDoc.data() as any;
    const rating = typeof data.rating === "number" ? data.rating : Number(data.rating);
    const displayed = data.displayed !== false;

    if (!displayed) return;
    if (!Number.isFinite(rating) || rating <= 0) return;

    totalRating += rating;
    reviewCount++;
  });

  const averageRating = reviewCount > 0 ? Math.round((totalRating / reviewCount) * 10) / 10 : 0;

  const artisanRef = doc(db, "artisans", artisanId);
  await updateDoc(artisanRef, {
    averageRating,
    reviewCount,
    updatedAt: new Date(),
  });

  return { averageRating, reviewCount };
}
