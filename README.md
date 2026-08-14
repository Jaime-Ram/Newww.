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
4. Deploy opnieuw. De gele waarschuwing verdwijnt.

Maakte je de store tóch via de Vercel Marketplace, dan heten de variabelen
`KV_REST_API_URL` en `KV_REST_API_TOKEN`; die worden ook herkend.

### Verbruik

Blijft de app onder het gratis quotum? De telefoons vragen elke 5 seconden of er
iets veranderd is, maar sturen daarbij het versienummer mee dat ze al hebben. Is
er niets nieuws, dan kost dat één commando in plaats van de vier van een
volledige uitlezing. Veertien mensen die drie uur lang met het scherm aan staan
komen zo op ongeveer 30.000 commando's — een toernooidag of tien per maand past
er dus makkelijk in.

### Gelijktijdig bewerken

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

| Pad            | Wat het doet                                              |
| -------------- | --------------------------------------------------------- |
| `/api/state`   | `GET` — de hele stand, of `?rev=` voor alleen een controle |
| `/api/events`  | `POST` punten geven · `DELETE ?id=` terugdraaien           |
| `/api/players` | `PUT` — spelerslijst opslaan                               |
| `/api/rules`   | `PUT` — regels opslaan                                     |

De browsers pollen elke 5 seconden, dus wat de een invoert staat binnen een paar
tellen op ieders telefoon. Bij `?rev=` leest de server eerst het versienummer en
pas daarna de gegevens — andersom zou een wijziging die net tijdens het lezen
binnenkomt gemist worden.

Bij het geven van punten bepaalt de server het puntenaantal aan de hand van de
opgeslagen regel; wat de browser meestuurt wordt genegeerd.
