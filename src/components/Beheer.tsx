"use client";

import { useState } from "react";

import { formatSigned, parseDutchNumber } from "@/lib/format";
import type { Player, Rule } from "@/lib/types";
import { GhostButton, PrimaryButton } from "./ui";

type RuleDraft = { id: string; label: string; points: string; unit: string; hint: string };

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function toDraft(rule: Rule): RuleDraft {
  return {
    id: rule.id,
    label: rule.label,
    points: String(rule.points).replace(".", ","),
    unit: rule.unit ?? "",
    hint: rule.hint ?? "",
  };
}

const inputClass =
  "rounded-lg border border-line bg-night px-3 py-2 text-sm outline-none placeholder:text-muted/60 focus:border-clay";

export function Beheer({
  players,
  rules,
  onSavePlayers,
  onSaveRules,
  onResetPunten,
  busy,
}: {
  players: Player[];
  rules: Rule[];
  onSavePlayers: (players: Player[]) => Promise<boolean>;
  onSaveRules: (rules: Rule[]) => Promise<boolean>;
  onResetPunten: () => void;
  busy: boolean;
}) {
  const [sub, setSub] = useState<"spelers" | "regels">("spelers");

  // `null` betekent: geen lokale bewerking, dus volg gewoon wat de server stuurt.
  // Zodra er iets is gewijzigd houdt de draft die wijziging vast, ook als er
  // ondertussen een update van een andere telefoon binnenkomt.
  const [spelerDraft, setSpelerDraft] = useState<Player[] | null>(null);
  const [regelDraft, setRegelDraft] = useState<RuleDraft[] | null>(null);
  const [regelFout, setRegelFout] = useState<string | null>(null);
  // Regels tonen standaard alleen punten + omschrijving; de rest op verzoek.
  const [uitgeklapt, setUitgeklapt] = useState<string | null>(null);

  const spelers = spelerDraft ?? players;
  const regels = regelDraft ?? rules.map(toDraft);
  const spelerVuil = spelerDraft !== null;
  const regelVuil = regelDraft !== null;

  function wijzigSpeler(id: string, patch: Partial<Player>) {
    setSpelerDraft((list) => (list ?? players).map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function wijzigRegel(id: string, patch: Partial<RuleDraft>) {
    setRegelDraft((list) =>
      (list ?? rules.map(toDraft)).map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }

  async function bewaarSpelers() {
    const schoon = spelers
      .map((p) => ({ ...p, name: p.name.trim(), number: p.number.trim() }))
      .filter((p) => p.name.length > 0);
    if (await onSavePlayers(schoon)) setSpelerDraft(null);
  }

  async function bewaarRegels() {
    const uit: Rule[] = [];
    for (const draft of regels) {
      const label = draft.label.trim();
      if (!label) continue;
      const points = parseDutchNumber(draft.points);
      if (points === null) {
        setRegelFout(`"${label}" heeft geen geldig puntenaantal.`);
        return;
      }
      uit.push({
        id: draft.id,
        label,
        points,
        ...(draft.unit.trim() ? { unit: draft.unit.trim() } : {}),
        ...(draft.hint.trim() ? { hint: draft.hint.trim() } : {}),
      });
    }
    setRegelFout(null);
    if (await onSaveRules(uit)) setRegelDraft(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 rounded-xl border border-line bg-panel p-1">
        {(["spelers", "regels"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setSub(key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold capitalize transition ${
              sub === key ? "bg-raised text-cream" : "text-muted"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Iedereen mag alles aanpassen. Slaat er iemand anders tegelijk op, dan wint de laatste die
        op <span className="font-semibold text-cream">Opslaan</span> tikt.
      </p>

      {sub === "spelers" ? (
        <div className="space-y-2">
          {spelers.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-2 rounded-xl border border-line bg-panel p-2"
            >
              <input
                value={player.number}
                onChange={(e) => wijzigSpeler(player.id, { number: e.target.value })}
                placeholder="#"
                maxLength={4}
                aria-label={`Rugnummer van ${player.name}`}
                className={`${inputClass} w-14 shrink-0 text-center`}
              />
              <input
                value={player.name}
                onChange={(e) => wijzigSpeler(player.id, { name: e.target.value })}
                placeholder="Naam"
                maxLength={40}
                aria-label="Naam"
                className={`${inputClass} w-full min-w-0 flex-1 font-semibold`}
              />
              <button
                onClick={() => {
                  setSpelerDraft((list) =>
                    (list ?? players).filter((p) => p.id !== player.id),
                  );
                }}
                aria-label={`${player.name} verwijderen`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-clay/15 hover:text-clay"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
                </svg>
              </button>
            </div>
          ))}

          <GhostButton
            className="w-full"
            onClick={() => {
              setSpelerDraft((list) => {
                const huidig = list ?? players;
                return [
                  ...huidig,
                  { id: newId("p"), name: `Speler ${huidig.length + 1}`, number: "" },
                ];
              });
            }}
          >
            + Speler toevoegen
          </GhostButton>

          <p className="pt-1 text-xs text-muted">
            {spelers.length} {spelers.length === 1 ? "speler" : "spelers"}. Een speler
            verwijderen laat zijn punten in de feed staan.
          </p>

          <PrimaryButton onClick={bewaarSpelers} disabled={!spelerVuil || busy}>
            {spelerVuil ? "Spelers opslaan" : "Opgeslagen"}
          </PrimaryButton>
        </div>
      ) : (
        <div className="space-y-2">
          {regels.map((rule) => {
            const open = uitgeklapt === rule.id || rule.unit !== "" || rule.hint !== "";

            return (
              <div key={rule.id} className="rounded-xl border border-line bg-panel p-2.5">
                <div className="flex items-start gap-2">
                  <input
                    value={rule.points}
                    onChange={(e) => wijzigRegel(rule.id, { points: e.target.value })}
                    placeholder="0"
                    aria-label="Punten"
                    className={`${inputClass} w-16 shrink-0 text-center font-bold tabular-nums`}
                  />
                  <textarea
                    value={rule.label}
                    onChange={(e) => wijzigRegel(rule.id, { label: e.target.value })}
                    placeholder="Waar krijg je punten voor?"
                    rows={2}
                    maxLength={120}
                    aria-label="Omschrijving"
                    className={`${inputClass} w-full min-w-0 flex-1 resize-none leading-snug font-semibold`}
                  />
                  <button
                    onClick={() => {
                      setRegelDraft((list) =>
                        (list ?? rules.map(toDraft)).filter((r) => r.id !== rule.id),
                      );
                    }}
                    aria-label="Regel verwijderen"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-clay/15 hover:text-clay"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" />
                    </svg>
                  </button>
                </div>

                {open ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      value={rule.unit}
                      onChange={(e) => wijzigRegel(rule.id, { unit: e.target.value })}
                      placeholder="per… (bijv. inning)"
                      maxLength={20}
                      aria-label="Eenheid"
                      className={`${inputClass} w-36 shrink-0`}
                    />
                    <input
                      value={rule.hint}
                      onChange={(e) => wijzigRegel(rule.id, { hint: e.target.value })}
                      placeholder="Toelichting"
                      maxLength={200}
                      aria-label="Toelichting"
                      className={`${inputClass} w-full min-w-0 flex-1`}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setUitgeklapt(rule.id)}
                    className="mt-1.5 ml-[4.5rem] text-xs font-semibold text-muted transition hover:text-cream"
                  >
                    + eenheid of toelichting
                  </button>
                )}
              </div>
            );
          })}

          <GhostButton
            className="w-full"
            onClick={() => {
              setRegelDraft((list) => [
                ...(list ?? rules.map(toDraft)),
                { id: newId("r"), label: "", points: "1", unit: "", hint: "" },
              ]);
            }}
          >
            + Regel toevoegen
          </GhostButton>

          {regelFout ? <p className="text-sm font-semibold text-clay">{regelFout}</p> : null}

          <p className="pt-1 text-xs text-muted">
            Punten mogen negatief of met een komma ({formatSigned(-1)} of 0,2). Al uitgedeelde
            punten veranderen niet als je een regel aanpast.
          </p>

          <PrimaryButton onClick={bewaarRegels} disabled={!regelVuil || busy}>
            {regelVuil ? "Regels opslaan" : "Opgeslagen"}
          </PrimaryButton>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-clay/30 bg-clay/5 p-4">
        <p className="text-sm font-bold">Nieuwe wedstrijd</p>
        <p className="mt-1 mb-3 text-xs text-muted">
          Wist alle uitgedeelde punten. Spelers en regels blijven staan.
        </p>
        <GhostButton
          onClick={onResetPunten}
          className="border-clay/40 text-clay hover:bg-clay/10"
          disabled={busy}
        >
          Alle punten wissen
        </GhostButton>
      </div>
    </div>
  );
}
