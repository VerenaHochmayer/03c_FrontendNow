# Caching-Strategie pro Datentyp

## Nutzungssituation

Besucher\*innen öffnen FrontendNow vor allem vor Ort: im abgedunkelten Vortragssaal mit
überlastetem Konferenz-WLAN oder im Flugmodus zwischen zwei Sessions. Die App muss dann
sofort starten und alle Programminhalte zeigen, ohne auf das Netz zu warten.

## Strategien im Vergleich

| Strategie | Ablauf | Stärke | Schwäche |
|---|---|---|---|
| **Cache-First** | Antwort aus dem Cache, Netz nur, wenn nichts im Cache ist | Sofort da, offline vollständig | Änderungen erscheinen erst mit einer neuen Version |
| **Stale-While-Revalidate** | Antwort aus dem Cache, gleichzeitig im Hintergrund aktualisieren | Schnell und meist aktuell | Zeigt einmal die alte Version, verbraucht Datenvolumen |
| **Network-First** | Zuerst das Netz, Cache nur bei Fehler | Immer aktuell, wenn online | Bei schwachem WLAN langsam, bis der Timeout greift |

## Entscheidung pro Datentyp

### 1. Statische Assets (App-Shell, JavaScript, CSS mit Tokens, Icons) → Cache-First (Precache)

Diese Dateien ändern sich nur mit einem neuen Build. Ihre Dateinamen enthalten einen
Hash, eine neue Version hat also einen neuen Namen. Der Service Worker legt sie bei der
Installation vorab in den Cache (Precache). Weil wir `registerType: 'autoUpdate'`
verwenden, lädt er nach einem neuen Deployment die neue Version, sobald wieder Netz da
ist.

**Fonts:** IBM Plex kommt derzeit von Google Fonts, einem fremden Server. Wir cachen die
Schriftdateien Cache-First zur Laufzeit. Sie ändern sich nie, und ohne sie fiele die App
offline auf Systemschriften zurück.

### 2. Programmdaten (Sessions, Speaker) → Cache-First (Precache)

Die Daten aus `conference-data.json` stecken laut State-Management-Konzept im
JavaScript-Bundle. Alle Übersichten und Infokarten sind laut Rendering-ADR vorab erzeugte
HTML-Seiten. Beides wird mit dem Precache gespeichert. Nach der Veröffentlichung des
Programms ändern sich die Inhalte in der Regel nicht mehr. Eine Netzanfrage brächte
deshalb nur Wartezeit, aber keine neuen Daten.

Das erfüllt auch die Folge aus dem Rendering-ADR, dass gecachte HTML-Seiten
aktualisiert werden müssen, sobald es möglich ist: Eine Programmänderung bedeutet bei
uns immer einen neuen Build. Dessen Seiten lädt der Service Worker dank `autoUpdate` beim
nächsten Kontakt mit dem Netz und ersetzt damit die alten im Cache.

**Wann Stale-While-Revalidate nötig wäre:** wenn sich Uhrzeit oder Raum kurzfristig
ändern können *und* die Daten zur Laufzeit von einer URL geladen werden (der ISR-Ausbaupfad
aus dem Rendering-ADR). Dann würden wir HTML und Daten Stale-While-Revalidate ausliefern.
Besucher\*innen sähen eine Raumänderung spätestens beim nächsten Öffnen der Seite, ohne
offline etwas zu verlieren. Network-First wäre dafür ungeeignet: Im überlasteten WLAN
würde jede Seite erst nach dem Timeout erscheinen.

### 3. „Mein Programm“ → Daten im `localStorage`, App-Shell im Precache

Die gemerkten Session-IDs liegen schon im `localStorage` und brauchen keinen Cache. Die
Seite `/mein-programm` wird aber nur im Browser gerendert (CSR). Ohne Netz ist sie nur
erreichbar, wenn ihre HTML-Hülle und das JavaScript vorab gecacht sind. Das ist besonders
wichtig, weil `/mein-programm` die `start_url` der installierten App ist. Fehlt die Hülle
im Cache, startet die App offline gar nicht.

## Schlimmster Fall: Verbindungsabbruch mitten in der Nutzung

Weil alle Seiten und Daten im Precache liegen, funktioniert die gesamte Navigation weiter:
Programm, Infokarten, Speaker und Filter. Merken und Entfernen läuft ohnehin nur im
Browser, es gibt nichts, das mit einem Server abgeglichen werden müsste. Verloren geht
höchstens eine neue Version, die erst beim nächsten Kontakt mit dem Netz geladen wird.
Damit Besucher\*innen wissen, dass sie gerade offline sind und eventuell einen älteren
Stand sehen, zeigt der im Architektur-ADR geplante `LayoutOfflineBadge` einen Hinweis
im Header an.

Ohne Service Worker, etwa beim allerersten Besuch ohne Netz, bleibt die App unerreichbar.
Deshalb sollte die Installation vor der Konferenz erfolgen, solange es noch zuverlässiges
Netz gibt.

## Übersicht

| Datentyp | Strategie | Grund |
|---|---|---|
| App-Shell, JS, CSS, Icons | Cache-First (Precache) | Ändert sich nur mit neuem Build |
| Fonts (Google Fonts) | Cache-First (Laufzeit) | Ändern sich nie, offline sonst Systemschrift |
| Sessions und Speaker (HTML + Bundle) | Cache-First (Precache), SWR bei Laufzeitdaten | Nach Veröffentlichung stabil |
| „Mein Programm“ | Daten im `localStorage`, Hülle im Precache | Start-URL muss offline erreichbar sein |
