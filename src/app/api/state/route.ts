import { NextRequest, NextResponse } from "next/server";

import { getRevision, getState } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET(req: NextRequest) {
  try {
    // De telefoons pollen elke paar seconden. Sturen ze de revisie mee die ze al
    // hebben, dan kost een ongewijzigde stand maar één opvraging in plaats van
    // de hele lijst — dat scheelt een factor vier op het Redis-quotum.
    const bekend = req.nextUrl.searchParams.get("rev");
    if (bekend !== null) {
      const rev = await getRevision();
      if (String(rev) === bekend) {
        return NextResponse.json({ unchanged: true, rev }, { headers: noStore });
      }
    }

    return NextResponse.json(await getState(), { headers: noStore });
  } catch (err) {
    console.error("[state] laden mislukt", err);
    return NextResponse.json(
      { error: "Kon het scorebord niet laden." },
      { status: 502 },
    );
  }
}
