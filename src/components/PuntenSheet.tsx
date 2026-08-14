"use client";

import { useMemo, useState } from "react";

import { describeRule, formatSigned, parseDutchNumber, pointsLabel } from "@/lib/format";
import type { Player, Rule } from "@/lib/types";
import { Field, PrimaryButton, Sheet, Stepper } from "./ui";

export type ScorePayload = {
  playerId: string;
  ruleId: string | null;
  label: string;
  points: number;
  qty: number;
  note: string;
};

type Detail = { kind: "rule"; rule: Rule } | { kind: "los" } | null;

function pointsTone(points: number) {
  if (points > 0) return "bg-grass/15 text-grass";
  if (points < 0) return "bg-clay/15 text-clay";
  return "bg-raised text-muted";
}

export function PuntenSheet({
  player,
  rules,
  total,
  onScore,
  onClose,
}: {
  player: Player | null;
  rules: Rule[];
  total: number;
  onScore: (payload: ScorePayload) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Detail>(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [losLabel, setLosLabel] = useState("");
  const [losPoints, setLosPoints] = useState("");

  const zichtbaar = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rules;
    return rules.filter((r) => r.label.toLowerCase().includes(q));
  }, [rules, query]);

  function close() {
    setQuery("");
    setDetail(null);
    setQty(1);
    setNote("");
    setLosLabel("");
    setLosPoints("");
    onClose();
  }

  function openDetail(next: Detail) {
    setQty(1);
    setNote("");
    setDetail(next);
  }

  function scoreRule(rule: Rule, quantity: number, notitie: string) {
    if (!player) return;
    onScore({
      playerId: player.id,
      ruleId: rule.id,
      label: rule.label,
      points: rule.points,
      qty: quantity,
      note: notitie,
    });
    close();
  }

  function scoreLos() {
    if (!player) return;
    const parsed = parseDutchNumber(losPoints);
    if (!losLabel.trim() || parsed === null) return;
    onScore({
      playerId: player.id,
      ruleId: null,
      label: losLabel.trim(),
      points: parsed,
      qty,
      note: note.trim(),
    });
    close();
  }

  const losGeldig = losLabel.trim().length > 0 && parseDutchNumber(losPoints) !== null;

  return (
    <Sheet
      open={player !== null}
      onClose={close}
      title={player?.name ?? ""}
      subtitle={
        detail
          ? "Aantal en toelichting"
          : `Staat op ${pointsLabel(total).replace("+", "")} · tik een regel aan`
      }
      footer={
        detail?.kind === "rule" ? (
          <PrimaryButton onClick={() => scoreRule(detail.rule, qty, note.trim())}>
            {pointsLabel(detail.rule.points * qty)} voor {player?.name}
          </PrimaryButton>
        ) : detail?.kind === "los" ? (
          <PrimaryButton onClick={scoreLos} disabled={!losGeldig}>
            Punten toekennen
          </PrimaryButton>
        ) : null
      }
    >
      {detail === null ? (
        <div className="space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek een regel…"
            className="w-full rounded-xl border border-line bg-night px-3.5 py-2.5 text-sm outline-none placeholder:text-muted/60 focus:border-clay"
          />

          <ul className="space-y-1.5">
            {zichtbaar.map((rule) => (
              <li key={rule.id} className="flex items-stretch gap-1.5">
                <button
                  onClick={() =>
                    rule.unit ? openDetail({ kind: "rule", rule }) : scoreRule(rule, 1, "")
                  }
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-raised px-3 py-3 text-left transition active:scale-[0.99] hover:border-clay/50"
                >
                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-sm font-extrabold tabular-nums ${pointsTone(rule.points)}`}
                  >
                    {formatSigned(rule.points)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug font-semibold">{rule.label}</span>
                    {rule.unit || rule.hint ? (
                      <span className="mt-0.5 block text-xs leading-snug text-muted">
                        {rule.unit ? `per ${rule.unit}` : rule.hint}
                      </span>
                    ) : null}
                  </span>
                </button>

                <button
                  onClick={() => openDetail({ kind: "rule", rule })}
                  aria-label={`Aantal kiezen voor ${rule.label}`}
                  className="grid w-11 shrink-0 place-items-center rounded-xl border border-line bg-raised text-muted transition hover:text-cream"
                >
                  <span className="text-xs font-bold">×n</span>
                </button>
              </li>
            ))}
          </ul>

          {zichtbaar.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Geen regel gevonden.</p>
          ) : null}

          <button
            onClick={() => openDetail({ kind: "los" })}
            className="w-full rounded-xl border border-dashed border-line px-4 py-3 text-sm font-semibold text-muted transition hover:border-clay hover:text-cream"
          >
            + Losse punten (buiten de regels om)
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {detail.kind === "rule" ? (
            <div className="rounded-xl border border-line bg-raised px-4 py-3">
              <p className="text-sm font-semibold">{detail.rule.label}</p>
              <p className="mt-0.5 text-xs text-muted">
                {describeRule(detail.rule.points, detail.rule.unit)}
              </p>
              {detail.rule.hint ? (
                <p className="mt-2 text-xs text-muted italic">{detail.rule.hint}</p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-3">
              <Field
                label="Waarvoor?"
                value={losLabel}
                onChange={(e) => setLosLabel(e.target.value)}
                placeholder="Bijv. wc-bril laten staan"
                maxLength={120}
              />
              <Field
                label="Punten"
                value={losPoints}
                onChange={(e) => setLosPoints(e.target.value)}
                placeholder="Bijv. 2 of -1,5"
                inputMode="text"
              />
            </div>
          )}

          <div>
            <span className="mb-2 block text-[11px] font-bold tracking-[0.12em] text-muted uppercase">
              Aantal
            </span>
            <Stepper
              value={qty}
              onChange={setQty}
              unit={detail.kind === "rule" ? detail.rule.unit : undefined}
            />
          </div>

          <Field
            label="Notitie (optioneel)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bijv. 4e inning"
            maxLength={140}
          />

          <button
            onClick={() => setDetail(null)}
            className="text-sm font-semibold text-muted transition hover:text-cream"
          >
            ← Terug naar de regels
          </button>
        </div>
      )}
    </Sheet>
  );
}
