import { NextRequest, NextResponse } from "next/server";

// API gouvernementale française — publique, sans clé
const SIRET_API = "https://recherche-entreprises.api.gouv.fr/search";

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameSimilar(a: string, b: string): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (na === nb) return true;
  // Vérification si l'un contient l'autre (gère "SARL DUPONT" vs "Dupont")
  if (na.includes(nb) || nb.includes(na)) return true;
  // Jeu de mots significatifs en commun (≥ 60% de tokens partagés)
  const tokensA = new Set(na.split(" ").filter((t) => t.length > 2));
  const tokensB = nb.split(" ").filter((t) => t.length > 2);
  if (tokensA.size === 0 || tokensB.length === 0) return false;
  const shared = tokensB.filter((t) => tokensA.has(t)).length;
  return shared / Math.max(tokensA.size, tokensB.length) >= 0.6;
}

export async function POST(request: NextRequest) {
  try {
    const { siret, companyName } = await request.json();

    if (!siret) {
      return NextResponse.json({ error: "SIRET requis" }, { status: 400 });
    }

    // Validation format : 14 chiffres
    const cleaned = siret.replace(/\s/g, "");
    if (!/^\d{14}$/.test(cleaned)) {
      return NextResponse.json(
        { error: "Le SIRET doit contenir exactement 14 chiffres." },
        { status: 400 }
      );
    }

    // Appel API gouvernementale
    const res = await fetch(
      `${SIRET_API}?q=${cleaned}&mtm_campaign=portail-habitat`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Impossible de vérifier ce SIRET. Réessayez dans quelques instants." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const results: any[] = data.results || [];

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Aucune entreprise trouvée pour ce numéro SIRET." },
        { status: 404 }
      );
    }

    // Trouver l'établissement qui correspond exactement au SIRET
    const match = results.find((r: any) => {
      const sirets: string[] = r.matching_etablissements?.map((e: any) => e.siret) || [];
      return sirets.includes(cleaned) || r.siren === cleaned.slice(0, 9);
    }) || results[0];

    const officialName: string =
      match.nom_complet ||
      match.nom_raison_sociale ||
      match.matching_etablissements?.[0]?.denomination_usuelle ||
      "";

    const etat: string = match.etat_administratif || "";
    if (etat === "F") {
      return NextResponse.json(
        { error: "Cette entreprise est radiée du registre." },
        { status: 400 }
      );
    }

    // Vérification nom entreprise si fourni
    if (companyName && officialName) {
      const similar = nameSimilar(companyName, officialName);
      if (!similar) {
        return NextResponse.json(
          {
            error: `Le nom de l'entreprise ne correspond pas. Nom officiel : "${officialName}".`,
            officialName,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      valid: true,
      siret: cleaned,
      officialName,
      siren: cleaned.slice(0, 9),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("verify-siret error:", message);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du SIRET." },
      { status: 500 }
    );
  }
}
