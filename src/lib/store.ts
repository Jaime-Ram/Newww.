import { DEFAULT_PLAYERS, DEFAULT_RULES } from "./defaults";
import type { Backend, Player, Rule, ScoreEvent, State } from "./types";

const PLAYERS_KEY = "hb:players";
const RULES_KEY = "hb:rules";
const EVENTS_KEY = "hb:events";
/** Loopt bij elke wijziging één op, zodat een poll met één commando kan zien of er iets veranderd is. */
const REV_KEY = "hb:rev";

/**
 * Vercel KV en Upstash zetten hun REST-credentials onder verschillende namen neer,
 * afhankelijk van hoe de store is aangemaakt. We accepteren ze allebei.
 */
function redisConfig() {
  const url = (
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    ""
  ).trim();
  const token = (
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
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

type Snapshot = { players: Player[]; rules: Rule[]; events: ScoreEvent[]; rev: number };

const FILE_PATH = "./.data/scorebord.json";

function emptySnapshot(): Snapshot {
  return {
    players: structuredClone(DEFAULT_PLAYERS),
    rules: structuredClone(DEFAULT_RULES),
    events: [],
    rev: 0,
  };
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
    const raw = await readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Snapshot;
    // Bestanden van vóór de revisieteller hebben nog geen `rev`.
    return { ...parsed, rev: parsed.rev ?? 0 };
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
  if (redisConfig()) return "redis";
  // Serverless heeft geen schrijfbare projectmap en geen gedeelde instantie:
  // zonder Redis is het daar per definitie wegwerpgeheugen.
  if (process.env.VERCEL) return "memory";
  return globalMemory.__honkbalFileBroken ? "memory" : "file";
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
  if (activeBackend() === "redis") return toNumber(await redis(`GET`, REV_KEY));
  const snapshot = (await readFileSnapshot()) ?? memorySnapshot();
  return snapshot.rev;
}

export async function getState(): Promise<State> {
  if (activeBackend() === "redis") {
    // De revisie wordt vóór de gegevens gelezen. Komt er tijdens het lezen een
    // wijziging binnen, dan hoort daar een hoger nummer bij dan wat wij
    // teruggeven en haalt de volgende poll hem alsnog op. Andersom zou een
    // wijziging juist gemist worden.
    const [revRaw, playersRaw, rulesRaw, eventsRaw] = await redisPipeline(
      ["GET", REV_KEY],
      ["GET", PLAYERS_KEY],
      ["GET", RULES_KEY],
      ["HVALS", EVENTS_KEY],
    );

    const events = Array.isArray(eventsRaw)
      ? eventsRaw
          .map((raw) => parseJson<ScoreEvent | null>(raw, null))
          .filter((e): e is ScoreEvent => e !== null)
      : [];

    return {
      players: parseJson(playersRaw, structuredClone(DEFAULT_PLAYERS)),
      rules: parseJson(rulesRaw, structuredClone(DEFAULT_RULES)),
      events: sortEvents(events),
      rev: toNumber(revRaw),
      backend: "redis",
    };
  }

  const snapshot = (await readFileSnapshot()) ?? memorySnapshot();
  return {
    players: snapshot.players,
    rules: snapshot.rules,
    events: sortEvents(snapshot.events),
    rev: snapshot.rev,
    backend: activeBackend(),
  };
}

/** Nieuwste eerst — de feed leest van boven naar beneden. */
function sortEvents(events: ScoreEvent[]): ScoreEvent[] {
  return [...events].sort((a, b) => b.ts - a.ts);
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

export async function savePlayers(players: Player[]): Promise<void> {
  if (activeBackend() === "redis") {
    await writeRedis(["SET", PLAYERS_KEY, JSON.stringify(players)]);
    return;
  }
  await mutateLocal((s) => {
    s.players = players;
  });
}

export async function saveRules(rules: Rule[]): Promise<void> {
  if (activeBackend() === "redis") {
    await writeRedis(["SET", RULES_KEY, JSON.stringify(rules)]);
    return;
  }
  await mutateLocal((s) => {
    s.rules = rules;
  });
}

/**
 * Punten gaan als losse velden in een hash. Twee mensen die tegelijk scoren
 * schrijven zo naar verschillende velden en overschrijven elkaar niet.
 */
export async function addEvent(event: ScoreEvent): Promise<void> {
  if (activeBackend() === "redis") {
    await writeRedis(["HSET", EVENTS_KEY, event.id, JSON.stringify(event)]);
    return;
  }
  await mutateLocal((s) => {
    s.events.push(event);
  });
}

export async function deleteEvent(id: string): Promise<void> {
  if (activeBackend() === "redis") {
    await writeRedis(["HDEL", EVENTS_KEY, id]);
    return;
  }
  await mutateLocal((s) => {
    s.events = s.events.filter((e) => e.id !== id);
  });
}

/** Wist alleen de punten; spelers en regels blijven staan. */
export async function resetEvents(): Promise<void> {
  if (activeBackend() === "redis") {
    await writeRedis(["DEL", EVENTS_KEY]);
    return;
  }
  await mutateLocal((s) => {
    s.events = [];
  });
}
