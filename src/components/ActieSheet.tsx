"use client";

import { formatPoints, formatSigned } from "@/lib/format";
import type { Player, Rule } from "@/lib/types";
import { Sheet } from "./ui";

export function ActieSheet({
  player,
  rules,
  total,
  onScore,
  onClose,
}: {
  player: Player | null;
  rules: Rule[];
  total: number;
  onScore: (ruleId: string) => void;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={player !== null}
      onClose={onClose}
      title={player?.name ?? ""}
      subtitle={`Staat op ${formatPoints(total)} — tik een actie aan`}
    >
      <div className="overflow-hidden rounded-lg border border-rule">
        {rules.map((rule, i) => (
          <button
            key={rule.id}
            onClick={() => {
              if (player) onScore(rule.id);
            }}
            className={`flex w-full items-center gap-3 px-3 py-3 text-left active:bg-canvas ${
              i > 0 ? "border-t border-rule" : ""
            }`}
          >
            <span
              className={`w-11 shrink-0 font-display text-right text-lg tabular-nums ${
                rule.points < 0 ? "text-rood" : rule.points === 0 ? "text-soft" : "text-ink"
              }`}
            >
              {formatSigned(rule.points)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm leading-snug font-medium">{rule.label}</span>
              {rule.hint ? (
                <span className="mt-0.5 block text-xs leading-snug text-soft">{rule.hint}</span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      {rules.length === 0 ? (
        <p className="py-8 text-center text-sm text-soft">
          Nog geen acties. Voeg ze toe bij Acties.
        </p>
      ) : null}
    </Sheet>
  );
}
