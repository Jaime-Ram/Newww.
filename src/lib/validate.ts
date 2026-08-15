import { ROSTER } from "./roster";
import type { Numbers, Rule } from "./types";

export const MAX_RULES = 60;

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

export function id(value: unknown, field: string): string {
  const raw = text(value, field, 64);
  if (!/^[A-Za-z0-9_-]+$/.test(raw)) throw new BadRequest(`${field} is ongeldig`);
  return raw;
}

export function rules(value: unknown): Rule[] {
  if (!Array.isArray(value)) throw new BadRequest("Acties moeten een lijst zijn");
  if (value.length > MAX_RULES) throw new BadRequest(`Maximaal ${MAX_RULES} acties toegestaan`);

  const parsed = value.map((raw) => {
    const r = raw as Record<string, unknown>;
    const label = text(r.label, "Actie", 120);
    if (!label) throw new BadRequest("Elke actie heeft een omschrijving nodig");
    const hint = text(r.hint ?? "", "Toelichting", 200);
    return {
      id: id(r.id, "Actie-id"),
      label,
      points: points(r.points, "Punten"),
      ...(hint ? { hint } : {}),
    };
  });

  if (new Set(parsed.map((r) => r.id)).size !== parsed.length) {
    throw new BadRequest("Dubbele actie-ids gevonden");
  }
  return parsed;
}

export function numbers(value: unknown): Numbers {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new BadRequest("Rugnummers moeten een object zijn");
  }

  const uit: Numbers = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!ROSTER.some((p) => p.id === key)) throw new BadRequest("Onbekende speler");
    const nummer = text(raw, "Rugnummer", 3);
    // Leeg betekent "geen nummer"; die slaan we niet op.
    if (!nummer) continue;
    if (!/^\d{1,3}$/.test(nummer)) throw new BadRequest("Een rugnummer is 1 tot 3 cijfers");
    uit[key] = nummer;
  }
  return uit;
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
