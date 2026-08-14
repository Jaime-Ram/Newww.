"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatPoints, formatSigned, round } from "@/lib/format";
import type { Player, Rule, ScoreEvent, State } from "@/lib/types";
import { Beheer } from "./Beheer";
import { Feed } from "./Feed";
import { PuntenSheet, type ScorePayload } from "./PuntenSheet";
import { Ranglijst, type Standing } from "./Ranglijst";

type Tab = "ranglijst" | "feed" | "beheer";
type Toast = { tone: "ok" | "fout"; text: string; onUndo?: () => void };

const TABS: { key: Tab; label: string }[] = [
  { key: "ranglijst", label: "Ranglijst" },
  { key: "feed", label: "Feed" },
  { key: "beheer", label: "Beheer" },
];

async function jsonOf(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function errorText(body: Record<string, unknown>, fallback: string) {
  return typeof body.error === "string" ? body.error : fallback;
}

export function Scorebord({ initial }: { initial: State }) {
  const [state, setState] = useState<State>(initial);
  const [tab, setTab] = useState<Tab>("ranglijst");
  const [actief, setActief] = useState<Player | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const tijdelijk = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setState((await res.json()) as State);
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }, []);

  // Meelezen met de telefoons van de rest. Staat iemand in Beheer te typen,
  // dan pauzeren we, zodat een binnenkomende update zijn invoer niet overschrijft.
  useEffect(() => {
    if (tab === "beheer") return;
    const tick = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = setInterval(tick, 5000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [tab, refresh]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  const standings = useMemo<Standing[]>(() => {
    const totalen = new Map<string, { total: number; count: number }>();
    for (const event of state.events) {
      const vorige = totalen.get(event.playerId) ?? { total: 0, count: 0 };
      totalen.set(event.playerId, {
        total: vorige.total + event.points * event.qty,
        count: vorige.count + 1,
      });
    }

    const rijen = state.players
      .map((player) => {
        const cel = totalen.get(player.id);
        return { player, total: round(cel?.total ?? 0), count: cel?.count ?? 0 };
      })
      .sort((a, b) => b.total - a.total || a.player.name.localeCompare(b.player.name, "nl"));

    // Gelijke stand = gedeelde plek (1, 2, 2, 4).
    const uitslag: Standing[] = [];
    for (const [index, rij] of rijen.entries()) {
      const vorige = uitslag[index - 1];
      const rank = vorige && vorige.total === rij.total ? vorige.rank : index + 1;
      uitslag.push({ ...rij, rank });
    }
    return uitslag;
  }, [state.events, state.players]);

  const koploper = standings.find((s) => s.count > 0 && s.rank === 1) ?? null;

  const verwijderPunt = useCallback(
    async (id: string) => {
      setToast(null);
      setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) }));
      try {
        const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      } catch {
        setToast({ tone: "fout", text: "Verwijderen mislukt." });
        void refresh();
      }
    },
    [refresh],
  );

  async function score(payload: ScorePayload) {
    const speler = state.players.find((p) => p.id === payload.playerId);
    const tempId = `temp-${++tijdelijk.current}`;
    const optimistisch: ScoreEvent = {
      id: tempId,
      playerId: payload.playerId,
      ruleId: payload.ruleId,
      label: payload.label,
      points: payload.points,
      qty: payload.qty,
      ...(payload.note ? { note: payload.note } : {}),
      ts: Date.now(),
    };
    setState((s) => ({ ...s, events: [optimistisch, ...s.events] }));

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: payload.playerId,
          ruleId: payload.ruleId,
          label: payload.label,
          points: payload.points,
          qty: payload.qty,
          note: payload.note,
        }),
      });
      const body = await jsonOf(res);
      if (!res.ok) throw new Error(errorText(body, "Opslaan mislukt."));

      const bewaard = body.event as ScoreEvent;
      setState((s) => ({
        ...s,
        events: s.events.map((e) => (e.id === tempId ? bewaard : e)),
      }));
      setToast({
        tone: "ok",
        text: `${formatSigned(bewaard.points * bewaard.qty)} voor ${speler?.name ?? "speler"}`,
        onUndo: () => void verwijderPunt(bewaard.id),
      });
    } catch (err) {
      setState((s) => ({ ...s, events: s.events.filter((e) => e.id !== tempId) }));
      setToast({ tone: "fout", text: err instanceof Error ? err.message : "Opslaan mislukt." });
    }
  }

  async function bewaar(pad: "players" | "rules", body: object, succes: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/${pad}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await jsonOf(res);
      if (!res.ok) throw new Error(errorText(data, "Opslaan mislukt."));
      setState((s) => ({ ...s, ...data }));
      setToast({ tone: "ok", text: succes });
      return true;
    } catch (err) {
      setToast({ tone: "fout", text: err instanceof Error ? err.message : "Opslaan mislukt." });
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function resetPunten() {
    if (!window.confirm("Alle uitgedeelde punten wissen? Dit kan niet ongedaan gemaakt worden.")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/events?id=all", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setState((s) => ({ ...s, events: [] }));
      setToast({ tone: "ok", text: "Alle punten gewist." });
    } catch {
      setToast({ tone: "fout", text: "Wissen mislukt." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-night/90 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-[0.18em] text-clay uppercase">
              Honkbaltoernooi
            </p>
            <h1 className="text-xl leading-tight font-extrabold tracking-tight">Het Scorebord</h1>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
              offline
                ? "border-clay/40 bg-clay/10 text-clay"
                : "border-grass/30 bg-grass/10 text-grass"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${offline ? "bg-clay" : "animate-pulse bg-grass"}`}
            />
            {offline ? "offline" : "live"}
          </span>
        </div>

        <div className="flex gap-1 px-2 pb-2">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
                tab === key ? "bg-raised text-cream" : "text-muted hover:text-cream"
              }`}
            >
              {label}
              {key === "feed" && state.events.length > 0 ? (
                <span className="ml-1.5 text-xs font-semibold text-muted tabular-nums">
                  {state.events.length}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-32">
        {state.backend === "memory" ? (
          <p className="mb-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-xs leading-relaxed text-gold">
            <span className="font-bold">Nog geen database gekoppeld.</span> De punten worden nu
            alleen tijdelijk bewaard en kunnen elk moment verdwijnen. Koppel een Redis-store in
            Vercel (zie de README) om ze echt vast te leggen.
          </p>
        ) : null}

        {tab === "ranglijst" ? (
          <div className="hb-rise space-y-4">
            {koploper ? (
              <div className="flex items-center gap-4 rounded-2xl border border-line bg-gradient-to-br from-panel to-night px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold tracking-[0.14em] text-gold uppercase">
                    Aan kop
                  </p>
                  <p className="truncate text-2xl font-extrabold tracking-tight">
                    {koploper.player.name}
                  </p>
                </div>
                <p className="shrink-0 text-4xl font-extrabold text-gold tabular-nums">
                  {formatPoints(koploper.total)}
                </p>
              </div>
            ) : (
              <p className="rounded-2xl border border-line bg-panel px-4 py-4 text-sm text-muted">
                Tik een speler aan om punten uit te delen.
              </p>
            )}

            <Ranglijst standings={standings} onPick={setActief} />
          </div>
        ) : null}

        {tab === "feed" ? (
          <div className="hb-rise">
            <Feed events={state.events} players={state.players} onDelete={verwijderPunt} />
          </div>
        ) : null}

        {tab === "beheer" ? (
          <div className="hb-rise">
            <Beheer
              players={state.players}
              rules={state.rules}
              busy={busy}
              onSavePlayers={(players: Player[]) =>
                bewaar("players", { players }, "Spelers opgeslagen.")
              }
              onSaveRules={(rules: Rule[]) => bewaar("rules", { rules }, "Regels opgeslagen.")}
              onResetPunten={resetPunten}
            />
          </div>
        ) : null}
      </main>

      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div
            role="status"
            className={`hb-rise pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
              toast.tone === "ok"
                ? "border-line bg-raised text-cream"
                : "border-clay/50 bg-clay/15 text-cream"
            }`}
          >
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{toast.text}</span>
            {toast.onUndo ? (
              <button
                onClick={toast.onUndo}
                className="shrink-0 text-sm font-bold text-clay underline underline-offset-2"
              >
                Ongedaan maken
              </button>
            ) : (
              <button
                onClick={() => setToast(null)}
                aria-label="Melding sluiten"
                className="shrink-0 text-muted"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ) : null}

      <PuntenSheet
        player={actief}
        rules={state.rules}
        total={standings.find((s) => s.player.id === actief?.id)?.total ?? 0}
        onScore={(payload) => void score(payload)}
        onClose={() => setActief(null)}
      />
    </div>
  );
}
