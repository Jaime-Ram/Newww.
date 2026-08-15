"use client";

import { useState } from "react";

import type { Player } from "@/lib/types";
import { KnopZwart, Sheet } from "./ui";

export function NummerSheet({
  player,
  huidig,
  onOpslaan,
  onClose,
}: {
  player: Player | null;
  huidig: string;
  onOpslaan: (nummer: string) => void;
  onClose: () => void;
}) {
  const [waarde, setWaarde] = useState(huidig);
  // De speler wisselt terwijl het paneel dicht is; dan is de vorige waarde niet meer relevant.
  const [voorSpeler, setVoorSpeler] = useState(player?.id ?? null);
  if (player && player.id !== voorSpeler) {
    setVoorSpeler(player.id);
    setWaarde(huidig);
  }

  const geldig = waarde === "" || /^\d{1,3}$/.test(waarde);

  return (
    <Sheet
      open={player !== null}
      onClose={onClose}
      title={`Rugnummer van ${player?.name ?? ""}`}
      subtitle="Leeg laten mag ook"
    >
      <div className="space-y-4">
        <input
          value={waarde}
          onChange={(e) => setWaarde(e.target.value.replace(/\D/g, "").slice(0, 3))}
          inputMode="numeric"
          autoFocus
          placeholder="—"
          aria-label="Rugnummer"
          className="w-full rounded-lg border border-rule bg-paper py-4 text-center font-display text-4xl tabular-nums outline-none focus:border-ink"
        />

        <KnopZwart onClick={() => onOpslaan(waarde)} disabled={!geldig}>
          Opslaan
        </KnopZwart>
      </div>
    </Sheet>
  );
}
