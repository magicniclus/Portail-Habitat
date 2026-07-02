import { NextRequest, NextResponse } from "next/server";

export interface SiretSuggestion {
  siret: string;
  siren: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  actif: boolean;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const res = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(q)}&per_page=6`,
      { headers: { Accept: "application/json" }, next: { revalidate: 0 } }
    );

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data = await res.json();
    const results: SiretSuggestion[] = [];

    for (const r of data.results || []) {
      const nom: string =
        r.nom_complet || r.nom_raison_sociale || "";
      const etat: string = r.etat_administratif || "A";
      const actif = etat !== "F";

      // Récupérer le SIRET du premier établissement correspondant
      const etabs: any[] = r.matching_etablissements || r.siege ? [r.siege] : [];
      const etab = etabs[0];
      const siret: string = etab?.siret || (r.siren ? r.siren + "00000" : "");
      const adresse: string = etab?.adresse || r.siege?.adresse || "";
      const codePostal: string = etab?.code_postal || r.siege?.code_postal || "";
      const ville: string = etab?.libelle_commune || r.siege?.libelle_commune || "";

      if (nom && siret.length >= 9) {
        results.push({ siret, siren: r.siren || siret.slice(0, 9), nom, adresse, codePostal, ville, actif });
      }
    }

    return NextResponse.json({ suggestions: results.slice(0, 6) });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
