"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatSigned, round } from "@/lib/format";
import { ROSTER } from "@/lib/roster";
import type { Numbers, Player, Rule, ScoreEvent, State } from "@/lib/types";
import { Acties } from "./Acties";
import { ActieSheet } from "./ActieSheet";
import { Log } from "./Log";
import { NummerSheet } from "./NummerSheet";
import { Stand, type Rij } from "./Stand";

type Tab = "stand" | "log" | "acties";
type Melding = { fout?: boolean; tekst: string; onUndo?: () => void };

const TABS: { key: Tab; label: string }[] = [
  { key: "stand", label: "Stand" },
  { key: "log", label: "Log" },
  { key: "acties", label: "Acties" },
];

async function jsonOf(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function foutTekst(body: Record<string, unknown>, fallback: string) {
  return typeof body.error === "string" ? body.error : fallback;
}

export function Scorebord({ initial }: { initial: State }) {
  const [state, setState] = useState<State>(initial);
  const [tab, setTab] = useState<Tab>("stand");
  const [actief, setActief] = useState<Player | null>(null);
  const [nummerVoor, setNummerVoor] = useState<Player | null>(null);
  const [melding, setMelding] = useState<Melding | null>(null);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const tijdelijk = useRef(0);

  // In een ref, zodat de poll-lus niet opnieuw opgebouwd wordt bij elke wijziging.
  const revRef = useRef(initial.rev);
  useEffect(() => {
    revRef.current = state.rev;
  }, [state.rev]);

  const refresh = useCallback(async () => {
    try {
      // We sturen mee welke versie we al hebben. Is er niets veranderd, dan
      // antwoordt de server met `unchanged` en kost het maar één Redis-opvraging.
      const res = await fetch(`/api/state?rev=${revRef.current}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const body = (await res.json()) as State | { unchanged: true };
      if (!("unchanged" in body)) setState(body);
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }, []);

  // Meelezen met de telefoons van de rest. Staat iemand bij Acties te typen,
  // dan pauzeren we, zodat een binnenkomende update zijn invoer niet overschrijft.
  useEffect(() => {
    if (tab === "acties") return;
    const tik = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = setInterval(tik, 5000);
    document.addEventListener("visibilitychange", tik);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tik);
    };
  }, [tab, refresh]);

  useEffect(() => {
    if (!melding) return;
    const timer = setTimeout(() => setMelding(null), 6000);
    return () => clearTimeout(timer);
  }, [melding]);

  const rijen = useMemo<Rij[]>(() => {
    const totalen = new Map<string, { total: number; count: number }>();
    for (const event of state.events) {
      const vorige = totalen.get(event.playerId) ?? { total: 0, count: 0 };
      totalen.set(event.playerId, {
        total: vorige.total + event.points,
        count: vorige.count + 1,
      });
    }

    const gesorteerd = ROSTER.map((player) => {
      const cel = totalen.get(player.id);
      return { player, total: round(cel?.total ?? 0), count: cel?.count ?? 0 };
    }).sort((a, b) => b.total - a.total || a.player.name.localeCompare(b.player.name, "nl"));

    // Gelijke stand = gedeelde plek (1, 2, 2, 4).
    const uitslag: Rij[] = [];
    for (const [index, rij] of gesorteerd.entries()) {
      const vorige = uitslag[index - 1];
      const rank = vorige && vorige.total === rij.total ? vorige.rank : index + 1;
      uitslag.push({ ...rij, rank });
    }
    return uitslag;
  }, [state.events]);

  const verwijderPunt = useCallback(
    async (id: string) => {
      setMelding(null);
      setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
      try {
        const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      } catch {
        setMelding({ fout: true, tekst: "Verwijderen mislukt." });
        void refresh();
      }
    },
    [refresh],
  );

  async function score(ruleId: string) {
    const speler = actief;
    const rule = state.rules.find((r) => r.id === ruleId);
    if (!speler || !rule) return;
    setActief(null);

    const tempId = `temp-${++tijdelijk.current}`;
    const optimistisch: ScoreEvent = {
      id: tempId,
      playerId: speler.id,
      ruleId,
      label: rule.label,
      points: rule.points,
      ts: Date.now(),
    };
    setState((s) => ({ ...s, events: [optimistisch, ...s.events] }));

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: speler.id, ruleId }),
      });
      const body = await jsonOf(res);
      if (!res.ok) throw new Error(foutTekst(body, "Opslaan mislukt."));

      const bewaard = body.event as ScoreEvent;
      setState((s) => ({ ...s, events: s.events.map((e) => (e.id === tempId ? bewaard : e)) }));
      setMelding({
        tekst: `${formatSigned(bewaard.points)} voor ${speler.name}`,
        onUndo: () => void verwijderPunt(bewaard.id),
      });
    } catch (err) {
      setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== tempId) }));
      setMelding({ fout: true, tekst: err instanceof Error ? err.message : "Opslaan mislukt." });
    }
  }

  async function bewaarNummer(nummer: string) {
    const speler = nummerVoor;
    if (!speler) return;
    setNummerVoor(null);

    const vorige = state.numbers;
    const volgende: Numbers = { ...vorige };
    if (nummer) volgende[speler.id] = nummer;
    else delete volgende[speler.id];
    setState((s) => ({ ...s, numbers: volgende }));

    try {
      const res = await fetch("/api/numbers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: volgende }),
      });
      if (!res.ok) throw new Error(foutTekst(await jsonOf(res), "Opslaan mislukt."));
    } catch (err) {
      setState((s) => ({ ...s, numbers: vorige }));
      setMelding({ fout: true, tekst: err instanceof Error ? err.message : "Opslaan mislukt." });
    }
  }

  async function bewaarActies(rules: Rule[]) {
    setBusy(true);
    try {
      const res = await fetch("/api/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      const data = await jsonOf(res);
      if (!res.ok) throw new Error(foutTekst(data, "Opslaan mislukt."));
      setState((s) => ({ ...s, rules: data.rules as Rule[] }));
      setMelding({ tekst: "Acties opgeslagen." });
      return true;
    } catch (err) {
      setMelding({ fout: true, tekst: err instanceof Error ? err.message : "Opslaan mislukt." });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function wisPunten() {
    if (!window.confirm("Alle punten wissen? Dit kan niet ongedaan gemaakt worden.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/events?id=all", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setState((s) => ({ ...s, events: [] }));
      setMelding({ tekst: "Alle punten gewist." });
    } catch {
      setMelding({ fout: true, tekst: "Wissen mislukt." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <header className="sticky top-0 z-30 bg-ink">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <Image
            src="/kinheim-wordmark.png"
            alt="Kinheim"
            width={708}
            height={330}
            priority
            className="h-8 w-auto"
          />
          <span className="text-sm font-semibold text-paper">
            {offline ? "geen verbinding" : "Scorebord"}
          </span>
        </div>

        <div className="flex">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 border-b-2 px-3 pb-2.5 font-display text-base tracking-wide ${
                tab === key ? "border-rood text-paper" : "border-transparent text-paper/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4 pb-28">
        {state.backend === "memory" ? (
          <p className="mb-4 rounded-lg border border-rood bg-paper px-3 py-2.5 text-sm text-ink">
            Er is nog geen database gekoppeld, dus punten kunnen verdwijnen. Zie de README.
          </p>
        ) : null}

        {tab === "stand" ? (
          <Stand
            rijen={rijen}
            numbers={state.numbers}
            onKies={setActief}
            onNummer={setNummerVoor}
          />
        ) : null}
        {tab === "log" ? <Log events={state.events} onDelete={verwijderPunt} /> : null}
        {tab === "acties" ? (
          <Acties
            rules={state.rules}
            onSave={bewaarActies}
            onWisPunten={wisPunten}
            busy={busy}
          />
        ) : null}
      </main>

      {melding ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div
            role="status"
            className={`pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${
              melding.fout ? "bg-rood text-white" : "bg-ink text-paper"
            }`}
          >
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{melding.tekst}</span>
            {melding.onUndo ? (
              <button
                onClick={melding.onUndo}
                className="shrink-0 text-sm font-bold underline underline-offset-2"
              >
                Ongedaan maken
              </button>
            ) : (
              <button onClick={() => setMelding(null)} aria-label="Sluiten" className="shrink-0">
                ✕
              </button>
            )}
          </div>
        </div>
      ) : null}

      <NummerSheet
        player={nummerVoor}
        huidig={nummerVoor ? (state.numbers[nummerVoor.id] ?? "") : ""}
        onOpslaan={bewaarNummer}
        onClose={() => setNummerVoor(null)}
      />

      <ActieSheet
        player={actief}
        rules={state.rules}
        total={rijen.find((r) => r.player.id === actief?.id)?.total ?? 0}
        onScore={score}
        onClose={() => setActief(null)}
      />
    </div>
  );
}
