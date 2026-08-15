"use client";

import { useState } from "react";

import { parseDutchNumber } from "@/lib/format";
import type { Rule } from "@/lib/types";
import { KnopLijn, KnopZwart, Prullenbak } from "./ui";

type Draft = { id: string; label: string; points: string };

function toDraft(rule: Rule): Draft {
  return { id: rule.id, label: rule.label, points: String(rule.points).replace(".", ",") };
}

const veld = "rounded-lg border border-rule bg-paper px-3 py-2 text-sm outline-none focus:border-ink";

export function Acties({
  rules,
  onSave,
  onWisPunten,
  busy,
}: {
  rules: Rule[];
  onSave: (rules: Rule[]) => Promise<boolean>;
  onWisPunten: () => void;
  busy: boolean;
}) {
  // `null` betekent: geen lokale bewerking, dus volg gewoon wat de server stuurt.
  const [draft, setDraft] = useState<Draft[] | null>(null);
  const [fout, setFout] = useState<string | null>(null);

  const lijst = draft ?? rules.map(toDraft);
  const gewijzigd = draft !== null;

  function wijzig(id: string, patch: Partial<Draft>) {
    setDraft((d) => (d ?? rules.map(toDraft)).map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function verwijder(id: string) {
    setDraft((d) => (d ?? rules.map(toDraft)).filter((r) => r.id !== id));
  }

  function voegToe() {
    setDraft((d) => [
      ...(d ?? rules.map(toDraft)),
      { id: `r-${Math.random().toString(36).slice(2, 10)}`, label: "", points: "1" },
    ]);
  }

  async function bewaar() {
    const uit: Rule[] = [];
    for (const r of lijst) {
      const label = r.label.trim();
      if (!label) continue;
      const points = parseDutchNumber(r.points);
      if (points === null) {
        setFout(`"${label}" heeft geen geldig puntenaantal.`);
        return;
      }
      // Toelichtingen blijven staan; die bewerk je hier niet.
      const bestaand = rules.find((x) => x.id === r.id);
      uit.push({ id: r.id, label, points, ...(bestaand?.hint ? { hint: bestaand.hint } : {}) });
    }
    setFout(null);
    if (await onSave(uit)) setDraft(null);
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-rule bg-paper">
        {lijst.map((rule, i) => (
          <div
            key={rule.id}
            className={`flex items-center gap-2 px-2.5 py-2 ${i > 0 ? "border-t border-rule" : ""}`}
          >
            <input
              value={rule.points}
              onChange={(e) => wijzig(rule.id, { points: e.target.value })}
              aria-label="Punten"
              className={`${veld} w-14 shrink-0 text-center font-bold tabular-nums`}
            />
            <input
              value={rule.label}
              onChange={(e) => wijzig(rule.id, { label: e.target.value })}
              placeholder="Waarvoor?"
              maxLength={120}
              aria-label="Actie"
              className={`${veld} w-full min-w-0 flex-1`}
            />
            <button
              onClick={() => verwijder(rule.id)}
              aria-label={`${rule.label || "Actie"} verwijderen`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded text-soft active:bg-canvas hover:text-rood"
            >
              <Prullenbak className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <KnopLijn className="w-full" onClick={voegToe}>
        Actie toevoegen
      </KnopLijn>

      {fout ? <p className="text-sm font-semibold text-rood">{fout}</p> : null}

      <KnopZwart onClick={bewaar} disabled={!gewijzigd || busy}>
        {gewijzigd ? "Opslaan" : "Opgeslagen"}
      </KnopZwart>

      <p className="pt-2 text-xs text-soft">
        Punten mogen negatief of met een komma (-3 of 0,2). Al uitgedeelde punten veranderen niet
        als je een actie aanpast.
      </p>

      <div className="pt-6">
        <button
          onClick={onWisPunten}
          disabled={busy}
          className="text-sm font-semibold text-rood underline underline-offset-4 disabled:opacity-35"
        >
          Alle punten wissen
        </button>
      </div>
    </div>
  );
}
