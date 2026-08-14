"use client";

import { formatPoints } from "@/lib/format";
import type { Player } from "@/lib/types";

export type Standing = {
  player: Player;
  total: number;
  count: number;
  rank: number;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return letters.toUpperCase();
}

const MEDALS = ["bg-gold text-night", "bg-cream text-night", "bg-clay/80 text-white"];

export function Ranglijst({
  standings,
  onPick,
}: {
  standings: Standing[];
  onPick: (player: Player) => void;
}) {
  if (standings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
        Nog geen spelers. Voeg ze toe bij <span className="font-semibold text-cream">Beheer</span>.
      </p>
    );
  }

  return (
    <ol className="space-y-2">
      {standings.map(({ player, total, count, rank }) => {
        const medal = rank <= 3 ? MEDALS[rank - 1] : "bg-raised text-muted";

        return (
          <li key={player.id}>
            <button
              onClick={() => onPick(player)}
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-panel px-3 py-3 text-left transition active:scale-[0.99] hover:border-line/80 hover:bg-raised sm:px-4"
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-extrabold tabular-nums ${medal}`}
              >
                {rank}
              </span>

              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-night text-xs font-bold text-muted">
                {initials(player.name)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold tracking-tight">
                  {player.name}
                  {player.number ? (
                    <span className="ml-1.5 text-xs font-semibold text-muted">#{player.number}</span>
                  ) : null}
                </span>
                <span className="block text-xs text-muted">
                  {count === 0 ? "nog niks gescoord" : `${count} ${count === 1 ? "actie" : "acties"}`}
                </span>
              </span>

              <span
                className={`shrink-0 text-2xl font-extrabold tabular-nums ${
                  total > 0 ? "text-cream" : total < 0 ? "text-clay" : "text-muted"
                }`}
              >
                {formatPoints(total)}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
