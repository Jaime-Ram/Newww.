import type { Player, Rule } from "./types";

export const MAX_PLAYERS = 40;
export const MAX_RULES = 60;
export const MAX_QTY = 99;

export class BadRequest extends Error {}

export function text(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") throw new BadRequest(`${field} moet tekst zijn`);
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new BadRequest(`${field} mag maximaal ${maxLength} tekens zijn`);
  }
  return trimmed;
}

/** Punten mogen negatief en decimaal zijn (0,2 voor het biertje), maar niet absurd. */
export function points(value: unknown, field: string): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new BadRequest(`${field} moet een getal zijn`);
  if (Math.abs(n) > 1000) throw new BadRequest(`${field} moet tussen -1000 en 1000 liggen`);
  return Math.round(n * 100) / 100;
}

export function qty(value: unknown): number {
  const n = Math.round(Number(value ?? 1));
  if (!Number.isFinite(n) || n < 1 || n > MAX_QTY) {
    throw new BadRequest(`Aantal moet tussen 1 en ${MAX_QTY} liggen`);
  }
  return n;
}

export function id(value: unknown, field: string): string {
  const raw = text(value, field, 64);
  if (!/^[A-Za-z0-9_-]+$/.test(raw)) throw new BadRequest(`${field} is ongeldig`);
  return raw;
}

function list(value: unknown, field: string, max: number): unknown[] {
  if (!Array.isArray(value)) throw new BadRequest(`${field} moet een lijst zijn`);
  if (value.length > max) throw new BadRequest(`Maximaal ${max} ${field} toegestaan`);
  return value;
}

function assertUniqueIds(items: { id: string }[], field: string) {
  if (new Set(items.map((i) => i.id)).size !== items.length) {
    throw new BadRequest(`Dubbele ${field} gevonden`);
  }
}

export function players(value: unknown): Player[] {
  const parsed = list(value, "spelers", MAX_PLAYERS).map((raw) => {
    const p = raw as Record<string, unknown>;
    const name = text(p.name, "Naam", 40);
    if (!name) throw new BadRequest("Elke speler heeft een naam nodig");
    return { id: id(p.id, "Speler-id"), name, number: text(p.number ?? "", "Rugnummer", 4) };
  });
  assertUniqueIds(parsed, "speler-ids");
  return parsed;
}

export function rules(value: unknown): Rule[] {
  const parsed = list(value, "regels", MAX_RULES).map((raw) => {
    const r = raw as Record<string, unknown>;
    const label = text(r.label, "Regel", 120);
    if (!label) throw new BadRequest("Elke regel heeft een omschrijving nodig");
    const hint = text(r.hint ?? "", "Toelichting", 200);
    const unit = text(r.unit ?? "", "Eenheid", 20);
    return {
      id: id(r.id, "Regel-id"),
      label,
      points: points(r.points, "Punten"),
      ...(hint ? { hint } : {}),
      ...(unit ? { unit } : {}),
    };
  });
  assertUniqueIds(parsed, "regel-ids");
  return parsed;
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new BadRequest("Ongeldige aanvraag");
  }
}
