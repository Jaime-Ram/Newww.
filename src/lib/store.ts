import { DEFAULT_RULES } from "./defaults";
import {
  pgAddEvent,
  pgDeleteEvent,
  pgGetState,
  pgPing,
  pgResetEvents,
  pgRevision,
  pgSaveNumbers,
  pgSaveRules,
  postgresUrl,
} from "./postgres";
import type { Backend, Numbers, Rule, ScoreEvent, State } from "./types";

const RULES_KEY = "hb:rules";
const NUMBERS_KEY = "hb:numbers";
const EVENTS_KEY = "hb:events";
/** Loopt bij elke wijziging één op, zodat een poll met één commando kan zien of er iets veranderd is. */
const REV_KEY = "hb:rev";

/**
 * Upstash en Vercel KV zetten hun REST-credentials onder verschillende namen
 * neer, afhankelijk van hoe de store is aangemaakt. We accepteren ze allebei.
 */
function redisConfig() {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    ""
  ).trim();
  const token = (
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    ""
  ).trim();
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

type RedisReply = { result?: unknown; error?: string };
type Command = (string | number)[];

async function callRedis(path: string, body: unknown): Promise<unknown> {
  const cfg = redisConfig();
  if (!cfg) throw new Error("Redis is niet geconfigureerd");

  const res = await fetch(`${cfg.url}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Redis gaf ${res.status}: ${await res.text()}`);
  return res.json();
}

async function redis<T = unknown>(...command: Command): Promise<T> {
  const body = (await callRedis("", command.map(String))) as RedisReply;
  if (body.error) throw new Error(`Redis ${command[0]}: ${body.error}`);
  return body.result as T;
}

/** Meerdere commando's in één HTTP-aanvraag; ze draaien in volgorde. */
async function redisPipeline(...commands: Command[]): Promise<unknown[]> {
  const replies = (await callRedis(
    "/pipeline",
    commands.map((c) => c.map(String)),
  )) as RedisReply[];

  return replies.map((reply, i) => {
    if (reply.error) throw new Error(`Redis ${commands[i][0]}: ${reply.error}`);
    return reply.result;
  });
}

/* ── Lokale fallback ──────────────────────────────────────────────────────
   Zonder Redis draaien we op een JSON-bestand (lokale `next dev`), en als de
   schijf niet schrijfbaar is op puur geheugen. Geheugen overleeft geen
   serverless deploy — de UI waarschuwt daar zichtbaar voor.                */

type Snapshot = { rules: Rule[]; numbers: Numbers; events: ScoreEvent[]; rev: number };

const FILE_PATH = "./.data/scorebord.json";

function emptySnapshot(): Snapshot {
  return { rules: sortRules(structuredClone(DEFAULT_RULES)), numbers: {}, events: [], rev: 0 };
}

const globalMemory = globalThis as unknown as {
  __honkbalMemory?: Snapshot;
  __honkbalFileBroken?: boolean;
};

function memorySnapshot(): Snapshot {
  globalMemory.__honkbalMemory ??= emptySnapshot();
  return globalMemory.__honkbalMemory;
}

async function readFileSnapshot(): Promise<Snapshot | null> {
  if (globalMemory.__honkbalFileBroken) return null;
  try {
    const { readFile } = await import("node:fs/promises");
    const parsed = JSON.parse(await readFile(FILE_PATH, "utf8")) as Snapshot;
    return { ...parsed, numbers: parsed.numbers ?? {}, rev: parsed.rev ?? 0 };
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return emptySnapshot();
    globalMemory.__honkbalFileBroken = true;
    return null;
  }
}

async function writeFileSnapshot(snapshot: Snapshot): Promise<boolean> {
  if (globalMemory.__honkbalFileBroken) return false;
  try {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const { dirname } = await import("node:path");
    await mkdir(dirname(FILE_PATH), { recursive: true });
    await writeFile(FILE_PATH, JSON.stringify(snapshot, null, 2), "utf8");
    return true;
  } catch {
    globalMemory.__honkbalFileBroken = true;
    return false;
  }
}

export function activeBackend(): Backend {
  // Postgres eerst: wie een Neon-database koppelt bedoelt die ook te gebruiken,
  // ook als er nog oude Redis-variabelen blijven staan.
  if (postgresUrl()) return "postgres";
  if (redisConfig()) return "redis";
  // Serverless heeft geen schrijfbare projectmap en geen gedeelde instantie:
  // zonder Redis is het daar per definitie wegwerpgeheugen.
  if (process.env.VERCEL) return "memory";
  return globalMemory.__honkbalFileBroken ? "memory" : "file";
}

/**
 * Vertelt wat de server wél en niet ziet, zonder ooit een token te tonen.
 * Bedoeld om te kunnen zien waaróm de opslag niet werkt.
 */
export async function diagnose(): Promise<{
  backend: Backend;
  opVercel: boolean;
  variabelen: Record<string, boolean>;
  soort: "postgres" | "redis" | "geen";
  verbinding: "ok" | "mislukt" | "niet ingesteld";
  reden?: string;
}> {
  const namen = [
    // Neon / Vercel Postgres
    "DATABASE_URL",
    "POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
    // Upstash / Vercel KV
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
    // Deze werken NIET, maar worden vaak per ongeluk gekopieerd.
    "REDIS_URL",
    "KV_URL",
  ];
  const variabelen = Object.fromEntries(namen.map((n) => [n, Boolean(process.env[n]?.trim())]));

  const soort = postgresUrl() ? "postgres" : redisConfig() ? "redis" : "geen";
  const basis = {
    backend: activeBackend(),
    opVercel: Boolean(process.env.VERCEL),
    variabelen,
    soort,
  } as const;

  if (soort === "geen") return { ...basis, verbinding: "niet ingesteld" };

  try {
    if (soort === "postgres") await pgPing();
    else await redis("GET", REV_KEY);
    return { ...basis, verbinding: "ok" };
  } catch (err) {
    // Nooit de ruwe fout doorgeven: daar kan een wachtwoord in staan.
    const melding = err instanceof Error ? err.message : "";
    let reden = "Kon de database niet bereiken. Klopt het adres?";

    if (soort === "postgres") {
      if (/password|authentication/i.test(melding)) {
        reden = "De database weigert het wachtwoord uit de verbindingsreeks.";
      } else if (/does not exist|database .* not found/i.test(melding)) {
        reden = "Die database bestaat niet (meer) onder dat adres.";
      } else if (/permission|denied/i.test(melding)) {
        reden = "Deze gebruiker mag geen tabellen aanmaken in die database.";
      }
    } else {
      const status = /gaf (\d{3})/.exec(melding)?.[1];
      if (status === "401" || status === "403") {
        reden = "Het token wordt niet geaccepteerd. Hoort dit token bij deze database?";
      } else if (status) {
        reden = `De database antwoordde met foutcode ${status}.`;
      }
    }
    return { ...basis, verbinding: "mislukt", reden };
  }
}

/**
 * Welke versie er draait. Vercel zet deze bij elke deploy klaar; zo is van
 * buitenaf te zien of de nieuwste code al live staat.
 */
export function versie(): { sha: string; bericht: string; tak: string } {
  const sha = (process.env.VERCEL_GIT_COMMIT_SHA || "").trim();
  return {
    sha: sha ? sha.slice(0, 7) : "onbekend",
    bericht: (process.env.VERCEL_GIT_COMMIT_MESSAGE || "").trim().split("\n")[0],
    tak: (process.env.VERCEL_GIT_COMMIT_REF || "").trim(),
  };
}

/* ── Lezen ─────────────────────────────────────────────────────────────── */

function parseJson<T>(raw: unknown, fallback: T): T {
  if (typeof raw !== "string") return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toNumber(raw: unknown): number {
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Het versienummer alleen. Dit is wat de telefoons elke paar seconden opvragen:
 * één commando in plaats van de hele stand.
 */
export async function getRevision(): Promise<number> {
  const backend = activeBackend();
  if (backend === "postgres") return pgRevision();
  if (backend === "redis") return toNumber(await redis("GET", REV_KEY));
  const snapshot = (await readFileSnapshot()) ?? memorySnapshot();
  return snapshot.rev;
}

/** Acties staan altijd hoog naar laag; gelijk aantal punten op alfabet. */
function sortRules(rules: Rule[]): Rule[] {
  return [...rules].sort((a, b) => b.points - a.points || a.label.localeCompare(b.label, "nl"));
}

/** Nieuwste eerst — het log leest van boven naar beneden. */
function sortEvents(events: ScoreEvent[]): ScoreEvent[] {
  return [...events].sort((a, b) => b.ts - a.ts);
}

export async function getState(): Promise<State> {
  if (activeBackend() === "postgres") {
    const snapshot = await pgGetState();
    return {
      rules: sortRules(snapshot.rules),
      numbers: snapshot.numbers,
      events: sortEvents(snapshot.events),
      rev: snapshot.rev,
      backend: "postgres",
    };
  }

  if (activeBackend() === "redis") {
    // De revisie wordt vóór de gegevens gelezen. Komt er tijdens het lezen een
    // wijziging binnen, dan hoort daar een hoger nummer bij dan wat wij
    // teruggeven en haalt de volgende poll hem alsnog op. Andersom zou een
    // wijziging juist gemist worden.
    const [revRaw, rulesRaw, numbersRaw, eventsRaw] = await redisPipeline(
      ["GET", REV_KEY],
      ["GET", RULES_KEY],
      ["GET", NUMBERS_KEY],
      ["HVALS", EVENTS_KEY],
    );

    const events = Array.isArray(eventsRaw)
      ? eventsRaw
          .map((raw) => parseJson<ScoreEvent | null>(raw, null))
          .filter((e): e is ScoreEvent => e !== null)
      : [];

    return {
      rules: sortRules(parseJson(rulesRaw, DEFAULT_RULES)),
      numbers: parseJson<Numbers>(numbersRaw, {}),
      events: sortEvents(events),
      rev: toNumber(revRaw),
      backend: "redis",
    };
  }

  const snapshot = (await readFileSnapshot()) ?? memorySnapshot();
  return {
    rules: sortRules(snapshot.rules),
    numbers: snapshot.numbers,
    events: sortEvents(snapshot.events),
    rev: snapshot.rev,
    backend: activeBackend(),
  };
}

/* ── Schrijven ─────────────────────────────────────────────────────────── */

async function mutateLocal(fn: (snapshot: Snapshot) => void): Promise<void> {
  const fromFile = await readFileSnapshot();
  const snapshot = fromFile ?? memorySnapshot();
  fn(snapshot);
  snapshot.rev += 1;
  if (fromFile) {
    const ok = await writeFileSnapshot(snapshot);
    // Schijf viel weg tijdens het schrijven: bewaar de wijziging in geheugen.
    if (!ok) globalMemory.__honkbalMemory = snapshot;
  } else {
    globalMemory.__honkbalMemory = snapshot;
  }
}

/** Schrijft en hoogt de revisie op in één aanvraag. */
async function writeRedis(command: Command): Promise<void> {
  await redisPipeline(command, ["INCR", REV_KEY]);
}

export async function saveRules(input: Rule[]): Promise<Rule[]> {
  const rules = sortRules(input);
  if (activeBackend() === "postgres") {
    await pgSaveRules(rules);
    return rules;
  }
  if (activeBackend() === "redis") {
    await writeRedis(["SET", RULES_KEY, JSON.stringify(rules)]);
    return rules;
  }
  await mutateLocal((s) => {
    s.rules = rules;
  });
  return rules;
}

export async function saveNumbers(numbers: Numbers): Promise<void> {
  if (activeBackend() === "postgres") return pgSaveNumbers(numbers);
  if (activeBackend() === "redis") {
    await writeRedis(["SET", NUMBERS_KEY, JSON.stringify(numbers)]);
    return;
  }
  await mutateLocal((s) => {
    s.numbers = numbers;
  });
}

/**
 * Punten gaan als losse velden in een hash. Twee mensen die tegelijk scoren
 * schrijven zo naar verschillende velden en overschrijven elkaar niet.
 */
export async function addEvent(event: ScoreEvent): Promise<void> {
  if (activeBackend() === "postgres") return pgAddEvent(event);
  if (activeBackend() === "redis") {
    await writeRedis(["HSET", EVENTS_KEY, event.id, JSON.stringify(event)]);
    return;
  }
  await mutateLocal((s) => {
    s.events.push(event);
  });
}

export async function deleteEvent(id: string): Promise<void> {
  if (activeBackend() === "postgres") return pgDeleteEvent(id);
  if (activeBackend() === "redis") {
    await writeRedis(["HDEL", EVENTS_KEY, id]);
    return;
  }
  await mutateLocal((s) => {
    s.events = s.events.filter((e) => e.id !== id);
  });
}

/** Wist alleen de punten; de acties blijven staan. */
export async function resetEvents(): Promise<void> {
  if (activeBackend() === "postgres") return pgResetEvents();
  if (activeBackend() === "redis") {
    await writeRedis(["DEL", EVENTS_KEY]);
    return;
  }
  await mutateLocal((s) => {
    s.events = [];
  });
}
