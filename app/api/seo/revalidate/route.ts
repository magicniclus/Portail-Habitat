/**
 * Webhook de revalidation ISR — appelé par la Cloud Function Firebase
 * après chaque modification de page SEO.
 *
 * Sécurisé par un Bearer token (REVALIDATE_SECRET en env).
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pageId } = await req.json();
  if (!pageId) {
    return NextResponse.json({ error: "Missing pageId" }, { status: 400 });
  }

  // Résoudre le pageId vers un chemin de route
  const paths = resolvePageIdToPaths(pageId);
  for (const p of paths) {
    revalidatePath(p);
  }

  return NextResponse.json({ revalidated: paths });
}

function resolvePageIdToPaths(pageId: string): string[] {
  // "[metier]__national" → /[metier]
  if (pageId.endsWith("__national")) {
    const metier = pageId.replace("__national", "");
    return [`/${metier}`];
  }
  // "[metier]__dep__[dep_slug]" → /[metier]/[dep_slug]
  if (pageId.includes("__dep__")) {
    const [metier, depSlug] = pageId.split("__dep__");
    return [`/${metier}/${depSlug}`];
  }
  // "[metier]__[ville_slug]" → /[metier]/[ville_slug]
  const parts = pageId.split("__");
  if (parts.length === 2) {
    return [`/${parts[0]}/${parts[1]}`];
  }
  return [];
}
