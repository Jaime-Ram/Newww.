import { NextRequest, NextResponse } from "next/server";

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
    const state = await getState();

    const playerId = v.id(body.playerId, "Speler");
    if (!state.players.some((p) => p.id === playerId)) {
      throw new v.BadRequest("Deze speler bestaat niet (meer).");
    }

    const quantity = v.qty(body.qty);
    const note = v.text(body.note ?? "", "Notitie", 140);

    // Regelpunten komen van de server, zodat de feed niet te vervalsen is
    // met een afwijkend puntenaantal in de aanvraag.
    let ruleId: string | null = null;
    let label: string;
    let points: number;

    if (body.ruleId == null || body.ruleId === "") {
      label = v.text(body.label, "Omschrijving", 120);
      if (!label) throw new v.BadRequest("Geef een omschrijving voor de losse punten.");
      points = v.points(body.points, "Punten");
    } else {
      ruleId = v.id(body.ruleId, "Regel");
      const rule = state.rules.find((r) => r.id === ruleId);
      if (!rule) throw new v.BadRequest("Deze regel bestaat niet (meer).");
      label = rule.label;
      points = rule.points;
    }

    const event: ScoreEvent = {
      id: crypto.randomUUID(),
      playerId,
      ruleId,
      label,
      points,
      qty: quantity,
      ...(note ? { note } : {}),
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
