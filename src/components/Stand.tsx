"use client";

import { formatPoints } from "@/lib/format";
import { ROL_LABEL } from "@/lib/roster";
import type { Numbers, Player } from "@/lib/types";
import { Kroon } from "./ui";

export type Rij = {
  player: Player;
  total: number;
  count: number;
  rank: number;
};

export function Stand({
  rijen,
  numbers,
  onKies,
  onNummer,
}: {
  rijen: Rij[];
  numbers: Numbers;
  onKies: (p: Player) => void;
  onNummer: (p: Player) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-paper">
      {rijen.map(({ player, total, count, rank }, i) => {
        const nummer = numbers[player.id] ?? "";

        return (
          // Twee losse knoppen naast elkaar: een knop in een knop mag niet.
          <div
            key={player.id}
            className={`flex items-center ${i > 0 ? "border-t border-rule" : ""}`}
          >
            <span className="w-6 shrink-0 pl-2 text-center font-display text-base text-soft tabular-nums">
              {/* Voor het eerste punt is een plek nummeren betekenisloos. */}
              {count === 0 ? "·" : rank}
            </span>

            <button
              onClick={() => onNummer(player)}
              aria-label={
                nummer ? `Rugnummer ${nummer} van ${player.name} wijzigen` : `Rugnummer van ${player.name} invullen`
              }
              className={`mx-2 grid h-9 w-9 shrink-0 place-items-center rounded-md border font-display text-base tabular-nums active:bg-canvas ${
                nummer ? "border-ink bg-ink text-paper" : "border-dashed border-rule text-soft"
              }`}
            >
              {nummer || "+"}
            </button>

            <button
              onClick={() => onKies(player)}
              className="flex min-w-0 flex-1 items-center gap-3 py-3 pr-3 text-left active:bg-canvas"
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate font-semibold">{player.name}</span>
                  {player.rol !== "speler" ? (
                    <Kroon className="h-3.5 w-3.5 shrink-0 text-rood" />
                  ) : null}
                </span>
                <span className="block truncate text-xs text-soft">
                  {[ROL_LABEL[player.rol], count === 0 ? "nog niks" : `${count} keer`]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>

              <span
                className={`shrink-0 font-display text-2xl tabular-nums ${
                  total < 0 ? "text-rood" : total === 0 ? "text-soft" : "text-ink"
                }`}
              >
                {formatPoints(total)}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
