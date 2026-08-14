import { NextRequest, NextResponse } from "next/server";

import { saveRules } from "@/lib/store";
import * as v from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const body = await v.readJson(req);
    const rules = v.rules(body.rules);
    await saveRules(rules);
    return NextResponse.json({ rules }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof v.BadRequest) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[rules]", err);
    return NextResponse.json({ error: "Opslaan mislukt. Probeer opnieuw." }, { status: 502 });
  }
}
