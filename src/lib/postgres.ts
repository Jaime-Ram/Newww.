import { neon } from "@neondatabase/serverless";

import { DEFAULT_RULES } from "./defaults";
import type { Numbers, Rule, ScoreEvent } from "./types";

/**
 * Neon (en Vercel Postgres) zetten de verbindingsreeks onder wisselende namen
 * neer, afhankelijk van hoe de database gekoppeld is. We accepteren ze allemaal.
 */
export function postgresUrl(): string | null {
  const url = (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  ).trim();
  return url || null;
}

/**
 * Alle SQL op één plek, met parameters in plaats van geplakte waarden.
 * Zo kunnen precies deze regels ook tegen een echte Postgres getest worden.
 */
export const SQL = {
  maakKv: `create table if not exists hb_kv (
    k text primary key,
    v jsonb not null
  )`,
  maakEvents: `create table if not exists hb_events (
    id text primary key,
    player_id text not null,
    rule_id text not null,
    label text not null,
    points double precision not null,
    ts bigint not null
  )`,
  // Eén rij die bij elke wijziging ophoogt; daarmee kan een poll met één vraag
  // zien of er iets veranderd is.
  maakRev: `create table if not exists hb_rev (
    id int primary key,
    rev bigint not null
  )`,
  zaaiRev: `insert into hb_rev (id, rev) values (1, 0) on conflict (id) do nothing`,
  leesRev: `select rev from hb_rev where id = 1`,
  hoogRevOp: `update hb_rev set rev = rev + 1 where id = 1`,
  leesKv: `select v from hb_kv where k = $1`,
  schrijfKv: `insert into hb_kv (k, v) values ($1, $2::jsonb)
              on conflict (k) do update set v = excluded.v`,
  leesEvents: `select id, player_id, rule_id, label, points, ts from hb_events`,
  voegEventToe: `insert into hb_events (id, player_id, rule_id, label, points, ts)
                 values ($1, $2, $3, $4, $5, $6)
                 on conflict (id) do nothing`,
  wisEvent: `delete from hb_events where id = $1`,
  wisAlleEvents: `delete from hb_events`,
} as const;

type Rij = Record<string, unknown>;
type Neon = ReturnType<typeof neon>;

const globalPg = globalThis as unknown as {
  __honkbalSql?: Neon;
  __honkbalKlaar?: Promise<void>;
};

function client(): Neon {
  const url = postgresUrl();
  if (!url) throw new Error("Postgres is niet geconfigureerd");
  globalPg.__honkbalSql ??= neon(url);
  return globalPg.__honkbalSql;
}

async function q(tekst: string, params: unknown[] = []): Promise<Rij[]> {
  return (await client().query(tekst, params)) as unknown as Rij[];
}

/**
 * Maakt de tabellen aan als ze nog niet bestaan. Gebeurt één keer per proces,
 * zodat er niemand handmatig SQL hoeft te draaien.
 */
function klaarzetten(): Promise<void> {
  globalPg.__honkbalKlaar ??= (async () => {
    await q(SQL.maakKv);
    await q(SQL.maakEvents);
    await q(SQL.maakRev);
    await q(SQL.zaaiRev);
  })().catch((err) => {
    // Niet blijven hangen op een mislukte poging; een volgende aanvraag mag het
    // opnieuw proberen.
    globalPg.__honkbalKlaar = undefined;
    throw err;
  });

  return globalPg.__honkbalKlaar;
}

export async function pgRevision(): Promise<number> {
  await klaarzetten();
  const rijen = await q(SQL.leesRev);
  return Number(rijen[0]?.rev ?? 0);
}

export async function pgGetState(): Promise<{
  rules: Rule[];
  numbers: Numbers;
  events: ScoreEvent[];
  rev: number;
}> {
  await klaarzetten();

  // De revisie eerst, net als bij Redis: een wijziging die tijdens het lezen
  // binnenkomt krijgt dan een hoger nummer en wordt de volgende poll opgehaald.
  const rev = await pgRevision();
  const [regelRijen, nummerRijen, eventRijen] = await Promise.all([
    q(SQL.leesKv, ["rules"]),
    q(SQL.leesKv, ["numbers"]),
    q(SQL.leesEvents),
  ]);

  return {
    rules: (regelRijen[0]?.v as Rule[]) ?? DEFAULT_RULES,
    numbers: (nummerRijen[0]?.v as Numbers) ?? {},
    rev,
    events: eventRijen.map((r) => ({
      id: String(r.id),
      playerId: String(r.player_id),
      ruleId: String(r.rule_id),
      label: String(r.label),
      points: Number(r.points),
      // bigint komt als tekst terug uit Postgres.
      ts: Number(r.ts),
    })),
  };
}

export async function pgSaveRules(rules: Rule[]): Promise<void> {
  await klaarzetten();
  await q(SQL.schrijfKv, ["rules", JSON.stringify(rules)]);
  await q(SQL.hoogRevOp);
}

export async function pgSaveNumbers(numbers: Numbers): Promise<void> {
  await klaarzetten();
  await q(SQL.schrijfKv, ["numbers", JSON.stringify(numbers)]);
  await q(SQL.hoogRevOp);
}

/** Elk punt is een eigen rij, dus twee mensen die tegelijk scoren botsen niet. */
export async function pgAddEvent(e: ScoreEvent): Promise<void> {
  await klaarzetten();
  await q(SQL.voegEventToe, [e.id, e.playerId, e.ruleId, e.label, e.points, e.ts]);
  await q(SQL.hoogRevOp);
}

export async function pgDeleteEvent(id: string): Promise<void> {
  await klaarzetten();
  await q(SQL.wisEvent, [id]);
  await q(SQL.hoogRevOp);
}

export async function pgResetEvents(): Promise<void> {
  await klaarzetten();
  await q(SQL.wisAlleEvents);
  await q(SQL.hoogRevOp);
}

/** Lichte controle voor de diagnosepagina. */
export async function pgPing(): Promise<void> {
  await klaarzetten();
  await pgRevision();
}
