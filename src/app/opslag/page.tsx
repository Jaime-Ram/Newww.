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

export default async function OpslagPage() {
  const d = await diagnose();

  const heeftRest =
    d.variabelen.UPSTASH_REDIS_REST_URL ||
    d.variabelen.UPSTASH_REDIS_REST_TOKEN ||
    d.variabelen.KV_REST_API_URL ||
    d.variabelen.KV_REST_API_TOKEN;
  const heeftVerkeerde = d.variabelen.REDIS_URL || d.variabelen.KV_URL;
  const werkt = d.verbinding === "ok";

  return (
    <main className="mx-auto max-w-lg p-4">
      <h1 className="font-display text-2xl">Opslag controleren</h1>

      <p
        className={`mt-3 rounded-lg px-4 py-3 font-semibold ${
          werkt ? "bg-ink text-paper" : "bg-rood text-white"
        }`}
      >
        {werkt ? "De database werkt. Je bent klaar." : "De database is nog niet aangesloten."}
      </p>

      <h2 className="mt-6 font-semibold">Wat de server ziet</h2>
      <ul className="mt-2 rounded-lg border border-rule bg-paper px-3">
        <Regel naam="UPSTASH_REDIS_REST_URL" aan={d.variabelen.UPSTASH_REDIS_REST_URL} />
        <Regel naam="UPSTASH_REDIS_REST_TOKEN" aan={d.variabelen.UPSTASH_REDIS_REST_TOKEN} />
        <Regel naam="KV_REST_API_URL" aan={d.variabelen.KV_REST_API_URL} />
        <Regel naam="KV_REST_API_TOKEN" aan={d.variabelen.KV_REST_API_TOKEN} />
        <Regel naam="REDIS_URL (werkt hier niet)" aan={d.variabelen.REDIS_URL} />
        <Regel naam="KV_URL (werkt hier niet)" aan={d.variabelen.KV_URL} />
      </ul>
      <p className="mt-2 text-xs text-soft">
        Alleen of ze bestaan — de waarden zelf worden nooit getoond.
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
            De variabelen staan er wél, maar de database antwoordt niet goed. {d.reden} Controleer
            of de URL en het token bij dezelfde database horen.
          </p>
        ) : heeftVerkeerde && !heeftRest ? (
          <>
            <p className="font-semibold">Je hebt de verkeerde regels gekopieerd.</p>
            <p>
              Upstash toont meerdere blokken. Dat met <code>REDIS_URL</code> is voor een andere
              manier van verbinden en werkt hier niet. Je hebt het blok onder <b>REST API</b> nodig,
              met deze twee namen:
            </p>
            <pre className="overflow-x-auto rounded bg-canvas p-3 text-xs">
              UPSTASH_REDIS_REST_URL{"\n"}UPSTASH_REDIS_REST_TOKEN
            </pre>
            <p>Zet die erbij in Vercel en deploy daarna opnieuw.</p>
          </>
        ) : heeftRest ? (
          <p>
            Er staat er maar één van de twee. Je hebt altijd een <b>URL</b> én een <b>token</b> uit
            dezelfde database nodig. Vul de ontbrekende aan en deploy opnieuw.
          </p>
        ) : (
          <>
            <p>De server ziet geen enkele variabele. Dat betekent één van tweeën:</p>
            <p>
              Ze staan nog niet in <b>dit</b> project (let op: elk Vercel-project heeft zijn eigen
              lijst — die van een ander project tellen niet mee).
            </p>
            <p>
              Of ze staan er wel, maar er is daarna niet opnieuw gedeployd. Vercel neemt nieuwe
              variabelen pas mee bij een nieuwe deploy. Ga naar Deployments, tik op de bovenste, en
              kies Redeploy.
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-xs text-soft">
        Draait op {d.opVercel ? "Vercel" : "een eigen server"} · opslag nu:{" "}
        {d.backend === "redis" ? "database" : d.backend === "file" ? "lokaal bestand" : "tijdelijk geheugen"}
      </p>
    </main>
  );
}
