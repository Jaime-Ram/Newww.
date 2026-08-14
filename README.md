# Het Scorebord — honkbaltoernooi

Live puntentelling voor het toernooi. Iedereen die de link heeft kan punten
uitdelen, terugdraaien, spelers hernoemen en de regels aanpassen. Er is geen
login: de link ís de toegang.

## Hoe het werkt

- **Ranglijst** — alle spelers op punten. Tik iemand aan om punten te geven.
- **Feed** — alles wat er is uitgedeeld, nieuwste bovenaan, met een prullenbak
  per regel. Vlak na het scoren kun je ook op "Ongedaan maken" tikken.
- **Beheer** — namen, rugnummers en de regels aanpassen, en aan het eind alle
  punten wissen voor een nieuwe wedstrijd.

Twee dingen zijn bewust zo gebouwd:

- Regels met een eenheid (`per inning`) vragen om een aantal, zodat "box geven
  diep in de wedstrijd" 4 punten oplevert in de 4e inning.
- Uitgedeelde punten bewaren hun eigen puntenaantal. Verander je later een regel
  van 25 naar 30, dan blijft die eerdere home run gewoon 25 waard.

De regels komen uit de groepsapp. Bij "Een honk teruggeven" was geen aantal
afgesproken; daar staat nu **+3** als plaatshouder — pas het aan in Beheer.

## Opslag instellen (belangrijk)

Op Vercel heeft de app een gedeelde database nodig. Zonder database bewaart de
site punten alleen tijdelijk in het geheugen van één server: dan zien niet alle
telefoons hetzelfde en verdwijnt alles bij de volgende deploy. De app laat in
dat geval zelf een gele waarschuwing zien.

Eenmalig instellen:

1. Vercel → je project → **Storage** → **Marketplace** → **Upstash for Redis**.
2. Maak een (gratis) store aan en koppel hem aan dit project.
3. Vercel zet `KV_REST_API_URL` en `KV_REST_API_TOKEN` er automatisch bij.
4. Deploy opnieuw. De gele waarschuwing verdwijnt.

`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` worden ook herkend.

Punten worden per stuk weggeschreven (een Redis-hash), dus twee mensen die
tegelijk scoren overschrijven elkaar niet. Spelers en regels zijn één lijst:
slaan twee mensen tegelijk op, dan wint de laatste.

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

| Pad            | Wat het doet                                     |
| -------------- | ------------------------------------------------ |
| `/api/state`   | `GET` — spelers, regels en alle punten           |
| `/api/events`  | `POST` punten geven · `DELETE ?id=` terugdraaien |
| `/api/players` | `PUT` — spelerslijst opslaan                     |
| `/api/rules`   | `PUT` — regels opslaan                           |

De browsers halen elke 5 seconden de stand op, dus wat de een invoert staat
binnen een paar tellen op ieders telefoon.

Bij het geven van punten bepaalt de server het puntenaantal aan de hand van de
opgeslagen regel; wat de browser meestuurt wordt genegeerd.
