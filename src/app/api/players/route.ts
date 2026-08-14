import { NextRequest, NextResponse } from "next/server";

import { savePlayers } from "@/lib/store";
import * as v from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const body = await v.readJson(req);
    const players = v.players(body.players);
    await savePlayers(players);
    return NextResponse.json({ players }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof v.BadRequest) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[players]", err);
    return NextResponse.json({ error: "Opslaan mislukt. Probeer opnieuw." }, { status: 502 });
  }
}
