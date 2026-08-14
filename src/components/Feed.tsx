"use client";

import { formatSigned, formatWhen } from "@/lib/format";
import type { Player, ScoreEvent } from "@/lib/types";
import { useNow } from "@/lib/useNow";

export function Feed({
  events,
  players,
  onDelete,
}: {
  events: ScoreEvent[];
  players: Player[];
  onDelete: (id: string) => void;
}) {
  const now = useNow();

  const naam = (id: string) => players.find((p) => p.id === id)?.name ?? "Onbekende speler";

  if (events.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
        Nog geen punten uitgedeeld. Tik iemand aan in de ranglijst.
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {events.map((event) => {
        const totaal = event.points * event.qty;

        return (
          <li
            key={event.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-panel px-3 py-2.5"
          >
            <span className="w-14 shrink-0 text-right">
              <span
                className={`block text-lg font-extrabold tabular-nums ${
                  totaal > 0 ? "text-grass" : totaal < 0 ? "text-clay" : "text-muted"
                }`}
              >
                {formatSigned(totaal)}
              </span>
              {event.qty > 1 ? (
                <span className="block text-[11px] text-muted tabular-nums">
                  {event.qty}× {formatSigned(event.points)}
                </span>
              ) : null}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{naam(event.playerId)}</span>
              <span className="line-clamp-2 block text-xs leading-snug text-muted">
                {event.label}
              </span>
              {event.note ? (
                <span className="line-clamp-1 block text-xs text-muted/70 italic">
                  {event.note}
                </span>
              ) : null}
            </span>

            <span className="shrink-0 text-[11px] whitespace-nowrap text-muted">
              {now === null ? "" : formatWhen(event.ts, now)}
            </span>

            <button
              onClick={() => onDelete(event.id)}
              aria-label="Verwijderen"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-clay/15 hover:text-clay"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
