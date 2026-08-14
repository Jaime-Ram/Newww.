"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 30_000;

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, TICK_MS);
  return () => clearInterval(timer);
}

// Afgerond op hele tikken, zodat React tussen twee tikken dezelfde waarde ziet.
function snapshot() {
  return Math.floor(Date.now() / TICK_MS) * TICK_MS;
}

function serverSnapshot() {
  return null;
}

/**
 * De klok als externe bron. Op de server levert dit `null`, zodat de HTML van
 * server en client gelijk blijft; na hydratie loopt de tijd mee.
 */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
