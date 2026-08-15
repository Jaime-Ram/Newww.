import type { Rule } from "./types";

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

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new BadRequest("Ongeldige aanvraag");
  }
}
