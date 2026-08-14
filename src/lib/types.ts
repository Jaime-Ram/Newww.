export type Player = {
  id: string;
  name: string;
  /** Rugnummer, vrij in te vullen. */
  number: string;
};

export type Rule = {
  id: string;
  label: string;
  /** Punten per eenheid. Mag negatief of decimaal zijn. */
  points: number;
  /** Extra uitleg onder de regel. */
  hint?: string;
  /**
   * Naam van de eenheid als de regel per stuk telt ("inning" → "1 punt per inning").
   * Leeg betekent dat het aantal gewoon "x keer" is.
   */
  unit?: string;
};

export type ScoreEvent = {
  id: string;
  playerId: string;
  /** Null bij een losse, handmatig ingevoerde correctie. */
  ruleId: string | null;
  /** Snapshot van de regelnaam, zodat oude punten kloppen na het aanpassen van een regel. */
  label: string;
  /** Snapshot van de punten per eenheid. */
  points: number;
  qty: number;
  note?: string;
  ts: number;
};

export type Backend = "redis" | "file" | "memory";

export type State = {
  players: Player[];
  rules: Rule[];
  events: ScoreEvent[];
  backend: Backend;
};
