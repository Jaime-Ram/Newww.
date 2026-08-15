export type Rol = "speler" | "coach" | "assistent";

export type Player = {
  id: string;
  name: string;
  rol: Rol;
};

export type Rule = {
  id: string;
  label: string;
  /** Mag negatief of decimaal zijn. */
  points: number;
  /** Korte toelichting onder de actie. */
  hint?: string;
};

export type ScoreEvent = {
  id: string;
  playerId: string;
  ruleId: string;
  /** Kopie van naam en punten, zodat de stand klopt na het aanpassen van een actie. */
  label: string;
  points: number;
  ts: number;
};

export type Backend = "postgres" | "redis" | "file" | "memory";

/** Rugnummers los van de vaste namen: playerId → nummer. */
export type Numbers = Record<string, string>;

export type State = {
  rules: Rule[];
  numbers: Numbers;
  events: ScoreEvent[];
  /** Hoogt op bij elke wijziging; hiermee ziet een poll goedkoop of er nieuws is. */
  rev: number;
  backend: Backend;
};
