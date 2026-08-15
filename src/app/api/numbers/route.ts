import { NextRequest, NextResponse } from "next/server";

import { saveNumbers } from "@/lib/store";
import * as v from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const body = await v.readJson(req);
    const numbers = v.numbers(body.numbers);
    await saveNumbers(numbers);
    return NextResponse.json({ numbers }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof v.BadRequest) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("[numbers]", err);
    return NextResponse.json({ error: "Opslaan mislukt. Probeer opnieuw." }, { status: 502 });
  }
}
