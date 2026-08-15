const nl = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 });

/** Rondt de optelsom van decimale punten af, zodat 0,2 × 3 niet 0,6000000000000001 wordt. */
export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatPoints(value: number): string {
  return nl.format(round(value));
}

/** Met expliciet plusteken — voor het log en de puntenbadges bij de acties. */
export function formatSigned(value: number): string {
  const rounded = round(value);
  return rounded > 0 ? `+${nl.format(rounded)}` : nl.format(rounded);
}

const time = new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" });

export function formatWhen(ts: number, now: number): string {
  const seconds = Math.round((now - ts) / 1000);
  if (seconds < 45) return "net";
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const date = new Date(ts);
  const sameDay = new Date(now).toDateString() === date.toDateString();
  return sameDay ? time.format(date) : `${date.getDate()}/${date.getMonth() + 1}`;
}

/** Zet Nederlandse invoer met een komma om naar een getal ("0,2" → 0.2). */
export function parseDutchNumber(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (!normalized || !/^-?\d*\.?\d*$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
