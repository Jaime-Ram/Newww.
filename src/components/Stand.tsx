"use client";

import { formatPoints } from "@/lib/format";
import { ROL_LABEL } from "@/lib/roster";
import type { Player } from "@/lib/types";
import { Kroon } from "./ui";

export type Rij = {
  player: Player;
  total: number;
  count: number;
  rank: number;
};

export function Stand({ rijen, onKies }: { rijen: Rij[]; onKies: (p: Player) => void }) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-paper">
      {rijen.map(({ player, total, count, rank }, i) => (
        <button
          key={player.id}
          onClick={() => onKies(player)}
          className={`flex w-full items-center gap-3 px-3 py-3 text-left active:bg-canvas ${
            i > 0 ? "border-t border-rule" : ""
          }`}
        >
          <span className="w-6 shrink-0 text-center text-sm font-semibold text-soft tabular-nums">
            {rank}
          </span>

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
            className={`shrink-0 text-xl font-bold tabular-nums ${
              total < 0 ? "text-rood" : total === 0 ? "text-soft" : "text-ink"
            }`}
          >
            {formatPoints(total)}
          </span>
        </button>
      ))}
    </div>
  );
}
