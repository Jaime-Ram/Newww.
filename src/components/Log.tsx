"use client";

import { formatSigned, formatWhen } from "@/lib/format";
import { speler } from "@/lib/roster";
import type { ScoreEvent } from "@/lib/types";
import { useNow } from "@/lib/useNow";
import { Prullenbak } from "./ui";

export function Log({
  events,
  onDelete,
}: {
  events: ScoreEvent[];
  onDelete: (id: string) => void;
}) {
  const now = useNow();

  if (events.length === 0) {
    return (
      <p className="rounded-lg border border-rule bg-paper px-4 py-10 text-center text-sm text-soft">
        Nog geen punten uitgedeeld.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-paper">
      {events.map((event, i) => (
        <div
          key={event.id}
          className={`flex items-center gap-3 px-3 py-2.5 ${i > 0 ? "border-t border-rule" : ""}`}
        >
          <span
            className={`w-11 shrink-0 font-display text-right text-lg tabular-nums ${
              event.points < 0 ? "text-rood" : event.points === 0 ? "text-soft" : "text-ink"
            }`}
          >
            {formatSigned(event.points)}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {speler(event.playerId)?.name ?? "Onbekend"}
            </span>
            <span className="block truncate text-xs text-soft">{event.label}</span>
          </span>

          <span className="shrink-0 text-xs whitespace-nowrap text-soft">
            {now === null ? "" : formatWhen(event.ts, now)}
          </span>

          <button
            onClick={() => onDelete(event.id)}
            aria-label="Verwijderen"
            className="grid h-8 w-8 shrink-0 place-items-center rounded text-soft active:bg-canvas hover:text-rood"
          >
            <Prullenbak className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
