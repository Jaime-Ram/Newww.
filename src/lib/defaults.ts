import type { Player, Rule } from "./types";

/**
 * 14 plekken. Namen zijn ter plekke aan te passen in het tabblad "Spelers".
 */
export const DEFAULT_PLAYERS: Player[] = [
  { id: "p1", name: "Jaime", number: "" },
  { id: "p2", name: "Jurre", number: "" },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `p${i + 3}`,
    name: `Speler ${i + 3}`,
    number: "",
  })),
];

export const DEFAULT_RULES: Rule[] = [
  { id: "r-homerun", label: "Home run", points: 25 },
  { id: "r-secret", label: "Secret missie voltooid", points: 20 },
  {
    id: "r-honkslag-3",
    label: "Honkslag slaan en doorrennen naar 3",
    points: 6,
  },
  {
    id: "r-switch-hit",
    label: "Switchhitter mét honkslag of meer",
    points: 5,
  },
  {
    id: "r-honk-terug",
    label: "Een honk teruggeven",
    points: 3,
    hint: "Bijv. terug van 2 naar 1. Puntenaantal nog niet afgesproken — pas gerust aan.",
  },
  {
    id: "r-box-diep",
    label: "Box geven aan de catcher — diep in de wedstrijd",
    points: 1,
    unit: "inning",
    hint: "1 punt per inning dat je al bezig bent.",
  },
  {
    id: "r-batflip",
    label: "Batflip op fly out vóórdat de bal gevangen is",
    points: 1,
  },
  {
    id: "r-te-laat",
    label: "Net te laat op het eerste honk, maar doen alsof je op tijd was",
    points: 1,
  },
  {
    id: "r-positiewissel",
    label: "Tijdens de inning van positie wisselen",
    points: 1,
    hint: "Allebei de spelers krijgen een punt — dus twee keer invoeren.",
  },
  { id: "r-switchhitter", label: "Switchhitter", points: 1 },
  { id: "r-dingetje", label: "Een dingetje proberen", points: 1 },
  { id: "r-biertje", label: "Biertje halen voor de coach", points: 0.2 },
  {
    id: "r-box-eerste",
    label: "Box geven aan de catcher — eerste slagman van de wedstrijd",
    points: 0,
    hint: "0 punten, want je bent gewoon een lieve jongen.",
  },
  { id: "r-tekens", label: "Luisteren naar tekens", points: -1 },
  { id: "r-riem", label: "Riem vergeten", points: -1 },
  { id: "r-kledingstuk", label: "Kledingstuk vergeten", points: -3 },
];
