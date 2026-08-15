# Kinheim — Scorebord

Puntentelling voor het toernooi. Iedereen die de link heeft kan punten uitdelen
en de acties aanpassen. Er is geen login: de link ís de toegang.

## Hoe het werkt

- **Stand** — de selectie op punten. Tik iemand aan, tik een actie aan, klaar.
  Eén tik is één keer; twee keer hetzelfde tik je gewoon twee keer aan.
- **Log** — alles wat is uitgedeeld, nieuwste bovenaan, met een prullenbak per
  regel. Vlak na het scoren kun je ook op "Ongedaan maken" tikken.
- **Acties** — punten en omschrijvingen aanpassen, acties toevoegen of
  weghalen. De lijst staat altijd op punten gesorteerd, hoog naar laag; een
  nieuwe actie schuift na het opslaan vanzelf op zijn plek. Onderaan staat het
  wissen van alle punten.

Uitgedeelde punten bewaren hun eigen puntenaantal. Verander je later een actie
van 25 naar 30, dan blijft die eerdere home run gewoon 25 waard.

De acties komen uit de groepsapp. Bij "Een honk teruggeven" was geen aantal
afgesproken; daar staat nu **+3** als plaatshouder.

## De selectie

De namen staan vast in `src/lib/roster.ts`, inclusief wie coach is (die krijgen
een kroontje). Iemand toevoegen of hernoemen doe je daar, niet in de app.

Rugnummers wél: tik in de stand op het hokje links van een naam en vul het in.
Die worden in de database bewaard, los van de namen.

## Opslag instellen (belangrijk)

Op Vercel heeft de app een gedeelde database nodig. Zonder database bewaart de
site punten alleen tijdelijk in het geheugen van één server: dan zien niet alle
telefoons hetzelfde en verdwijnt alles bij de volgende deploy. De app laat in
dat geval zelf een waarschuwing zien.

Ga hiervoor **rechtstreeks naar upstash.com**, niet via de Vercel Marketplace.
Die marketplace-route loopt via Vercel-facturering en toont alleen betaalde
plannen; bij Upstash zelf is er een permanent gratis plan (256 MB, 500.000
commando's per maand).

1. Maak een account op [upstash.com](https://upstash.com) → **Redis** →
   **Create Database**. Kies een regio in Europa.
2. Scroll op de databasepagina naar **REST API** en kopieer
   `UPSTASH_REDIS_REST_URL` en `UPSTASH_REDIS_REST_TOKEN`.
3. Zet die twee in Vercel onder **Settings → Environment Variables**, voor alle
   omgevingen.
4. Deploy opnieuw. De waarschuwing verdwijnt.

Maakte je de store tóch via de Vercel Marketplace, dan heten de variabelen
`KV_REST_API_URL` en `KV_REST_API_TOKEN`; die worden ook herkend.

### Een bestaande database hergebruiken

Heb je al een Redis/Upstash-database voor een ander project, dan kun je die
gewoon delen: alle sleutels van het scorebord beginnen met `hb:`, dus ze botsen
niet met andere gegevens. Kopieer dezelfde twee variabelen naar dit project.

### Verbruik

De telefoons vragen elke 5 seconden of er iets veranderd is, maar sturen daarbij
het versienummer mee dat ze al hebben. Is er niets nieuws, dan kost dat één
commando in plaats van de drie van een volledige uitlezing. Twaalf mensen die
drie uur lang met het scherm aan staan komen zo op ongeveer 26.000 commando's —
een toernooidag of tien per maand past er dus makkelijk in.

### Gelijktijdig bewerken

Punten worden per stuk weggeschreven (een Redis-hash), dus twee mensen die
tegelijk scoren overschrijven elkaar niet. De acties zijn één lijst: slaan twee
mensen tegelijk op, dan wint de laatste.

## Lokaal draaien

```bash
npm install
npm run dev
```

Zonder Redis-variabelen bewaart de app lokaal alles in `.data/scorebord.json`
(niet in git). Verwijder dat bestand om opnieuw met de standaardlijst te
beginnen.

```bash
npm run build   # productiebuild
npm run lint    # eslint
```

## Techniek

Next.js 16 (App Router, Turbopack) met React 19 en Tailwind v4. Geen verdere
dependencies — Redis gaat via de REST API met `fetch`.

| Pad           | Wat het doet                                              |
| ------------- | --------------------------------------------------------- |
| `/api/state`  | `GET` — acties en punten, of `?rev=` voor alleen een check |
| `/api/events` | `POST` punten geven · `DELETE ?id=` terugdraaien           |
| `/api/rules`  | `PUT` — acties opslaan (gesorteerd terug)                  |
| `/api/numbers`| `PUT` — rugnummers opslaan                                 |

Bij `?rev=` leest de server eerst het versienummer en pas daarna de gegevens —
andersom zou een wijziging die net tijdens het lezen binnenkomt gemist worden.

Bij het geven van punten bepaalt de server het puntenaantal aan de hand van de
opgeslagen actie; wat de browser meestuurt wordt genegeerd.

Het woordmerk in `public/` is dat van de vereniging.
