import { Scorebord } from "@/components/Scorebord";
import { DEFAULT_PLAYERS, DEFAULT_RULES } from "@/lib/defaults";
import { getState } from "@/lib/store";
import type { State } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let initial: State;
  try {
    initial = await getState();
  } catch (err) {
    // Liever een leeg bord dan een foutpagina; de client haalt zelf opnieuw op.
    console.error("[page] state laden mislukt", err);
    initial = {
      players: DEFAULT_PLAYERS,
      rules: DEFAULT_RULES,
      events: [],
      backend: "memory",
    };
  }

  return <Scorebord initial={initial} />;
}
