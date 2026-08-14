import { NextResponse } from "next/server";

import { getState } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await getState();
    return NextResponse.json(state, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[state] laden mislukt", err);
    return NextResponse.json(
      { error: "Kon het scorebord niet laden." },
      { status: 502 },
    );
  }
}
