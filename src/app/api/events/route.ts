import { NextRequest, NextResponse } from "next/server";

import { ROSTER } from "@/lib/roster";
import { addEvent, deleteEvent, getState, resetEvents } from "@/lib/store";
import type { ScoreEvent } from "@/lib/types";
import * as v from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(err: unknown) {
  if (err instanceof v.BadRequest) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  console.error("[events]", err);
  return NextResponse.json({ error: "Er ging iets mis. Probeer opnieuw." }, { status: 502 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await v.readJson(req);

    const playerId = v.id(body.playerId, "Speler");
    if (!ROSTER.some((p) => p.id === playerId)) {
      throw new v.BadRequest("Deze speler staat niet in de selectie.");
    }

    // Naam en punten komen van de server, zodat het log niet te vervalsen is
    // met een afwijkend puntenaantal in de aanvraag.
    const ruleId = v.id(body.ruleId, "Actie");
    const { rules } = await getState();
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) throw new v.BadRequest("Deze actie bestaat niet meer.");

    const event: ScoreEvent = {
      id: crypto.randomUUID(),
      playerId,
      ruleId,
      label: rule.label,
      points: rule.points,
      ts: Date.now(),
    };

    await addEvent(event);
    return NextResponse.json({ event }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id === "all") {
      await resetEvents();
      return NextResponse.json({ ok: true });
    }
    await deleteEvent(v.id(id, "Punt-id"));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
