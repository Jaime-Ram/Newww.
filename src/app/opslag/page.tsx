import Link from "next/link";

import { diagnose } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Opslag controleren" };

function Regel({ naam, aan }: { naam: string; aan: boolean }) {
  return (
    <li className="flex items-center gap-2 border-t border-rule py-2 first:border-t-0">
      <span className={`font-bold ${aan ? "text-ink" : "text-soft"}`}>{aan ? "✓" : "—"}</span>
      <code className="min-w-0 flex-1 truncate text-xs">{naam}</code>
      <span className="shrink-0 text-xs text-soft">{aan ? "gevonden" : "niet gezet"}</span>
    </li>
  );
}

const POSTGRES = ["DATABASE_URL", "POSTGRES_URL", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING"];
const REDIS = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
];

export default async function OpslagPage() {
  const d = await diagnose();
  const v = d.variabelen;

  const werkt = d.verbinding === "ok";
  const heeftRedisDeel = REDIS.some((n) => v[n]);
  const alleenVerkeerde = (v.REDIS_URL || v.KV_URL) && !heeftRedisDeel && d.soort === "geen";

  return (
    <main className="mx-auto max-w-lg p-4">
      <h1 className="font-display text-2xl">Opslag controleren</h1>

      <p
        className={`mt-3 rounded-lg px-4 py-3 font-semibold ${
          werkt ? "bg-ink text-paper" : "bg-rood text-white"
        }`}
      >
        {werkt
          ? `De database werkt (${d.soort === "postgres" ? "Neon/Postgres" : "Redis"}). Je bent klaar.`
          : "De database is nog niet aangesloten."}
      </p>

      <h2 className="mt-6 font-semibold">Neon / Postgres</h2>
      <ul className="mt-2 rounded-lg border border-rule bg-paper px-3">
        {POSTGRES.map((n) => (
          <Regel key={n} naam={n} aan={v[n]} />
        ))}
      </ul>

      <h2 className="mt-4 font-semibold">Upstash / Redis</h2>
      <ul className="mt-2 rounded-lg border border-rule bg-paper px-3">
        {REDIS.map((n) => (
          <Regel key={n} naam={n} aan={v[n]} />
        ))}
        <Regel naam="REDIS_URL (werkt hier niet)" aan={v.REDIS_URL} />
        <Regel naam="KV_URL (werkt hier niet)" aan={v.KV_URL} />
      </ul>
      <p className="mt-2 text-xs text-soft">
        Alleen of ze bestaan — de waarden zelf worden nooit getoond. Eén van de twee soorten is
        genoeg; staan ze er allebei, dan wint Postgres.
      </p>

      <h2 className="mt-6 font-semibold">Wat je nu moet doen</h2>
      <div className="mt-2 space-y-3 rounded-lg border border-rule bg-paper p-4 text-sm leading-relaxed">
        {werkt ? (
          <p>
            Niets meer. Punten worden bewaard en iedereen ziet dezelfde stand.{" "}
            <Link href="/" className="font-semibold underline underline-offset-4">
              Terug naar het scorebord
            </Link>
            .
          </p>
        ) : d.verbinding === "mislukt" ? (
          <p>
            De gegevens staan er wél, maar de database antwoordt niet goed. {d.reden}
          </p>
        ) : alleenVerkeerde ? (
          <>
            <p className="font-semibold">Je hebt de verkeerde regel gekopieerd.</p>
            <p>
              <code>REDIS_URL</code> is voor een andere manier van verbinden en werkt hier niet.
              Neem uit Upstash het blok onder <b>REST API</b>, met{" "}
              <code>UPSTASH_REDIS_REST_URL</code> en <code>UPSTASH_REDIS_REST_TOKEN</code>.
            </p>
          </>
        ) : heeftRedisDeel ? (
          <p>
            Er staat er maar één van de twee. Redis heeft altijd een <b>URL</b> én een <b>token</b>{" "}
            uit dezelfde database nodig.
          </p>
        ) : (
          <>
            <p>De server ziet geen enkele instelling. Twee manieren om dat op te lossen:</p>
            <p>
              <b>Heb je al een Neon-database</b> in een ander Vercel-project? Ga naar Storage, open
              die database, en koppel hem ook aan dit project. Vercel zet <code>DATABASE_URL</code>{" "}
              er dan zelf bij. Dat is de kortste weg.
            </p>
            <p>
              Staat er wel iets maar zie je het hier niet, dan is er na het toevoegen niet opnieuw
              gedeployd. Vercel neemt nieuwe instellingen pas mee bij een nieuwe deploy:
              Deployments, bovenste, Redeploy.
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-soft">
        Draait op {d.opVercel ? "Vercel" : "een eigen server"} · opslag nu:{" "}
        {d.backend === "postgres"
          ? "Neon/Postgres"
          : d.backend === "redis"
            ? "Redis"
            : d.backend === "file"
              ? "lokaal bestand"
              : "tijdelijk geheugen"}
      </p>
    </main>
  );
}
