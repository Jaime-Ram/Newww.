import type { Player } from "./types";

/** Vaste selectie. Aanpassen doe je hier, niet in de app. */
export const ROSTER: Player[] = [
  { id: "sander", name: "Sander", rol: "coach" },
  { id: "joost", name: "Joost", rol: "assistent" },
  { id: "kraats", name: "Kraats", rol: "speler" },
  { id: "ids", name: "Ids", rol: "speler" },
  { id: "jaime", name: "Jaime", rol: "speler" },
  { id: "rens", name: "Rens", rol: "speler" },
  { id: "sem", name: "Sem", rol: "speler" },
  { id: "ollie", name: "Ollie", rol: "speler" },
  { id: "jurre", name: "Jurre", rol: "speler" },
  { id: "tristan", name: "Tristan", rol: "speler" },
  { id: "hein", name: "Hein", rol: "speler" },
  { id: "ronald", name: "Ronald", rol: "speler" },
];

export const ROL_LABEL: Record<Player["rol"], string> = {
  speler: "",
  coach: "Coach",
  assistent: "Assistent-coach",
};

export function speler(id: string): Player | undefined {
  return ROSTER.find((p) => p.id === id);
}
