# Entscheidungsprotokoll: Rendering, Offline & Caching

Das Protokoll deckt beide Schritte ab: die Rendering-Entscheidungen aus Schritt 2
(ausführlich im [Rendering-ADR](../schritt2/01-rendering-strategie-adr.md), umgesetzt in den
`routeRules` der `nuxt.config.ts`) und die Offline-/Caching-Entscheidungen aus Schritt 3
(Konzept in [02-offline-strategie-konzept.md](02-offline-strategie-konzept.md), umgesetzt in
`nuxt.config.ts` unter `pwa.workbox`). Belege zu den Szenarien liegen in
[04-verifikations-nachweis.md](04-verifikations-nachweis.md).

# Teil A: Rendering (Schritt 2)

Gemeinsame Ausgangslage: Die Daten aus `conference-data.json` stecken im Build, es gibt kein
Backend, und die App muss bei unzuverlässigem Konferenz-WLAN funktionieren.

## R1. Speaker-Profile (`/speakers`, `/speakers/[id]`)

### Kontext

18 Profile, für alle gleich, die sich nur mit einem neuen Build ändern, realistisch vor der
Konferenz. Sie sollen schnell laden, in Suchmaschinen auffindbar sein und offline funktionieren.

### Optionen

- **SSG:** alle Profile beim Build als HTML erzeugen.
- **SSR:** pro Anfrage auf dem Server rendern. Bringt keine aktuelleren Daten, braucht aber einen Server.
- **CSR:** erst im Browser rendern. Leeres HTML für Suchmaschinen, langsamerer erster Aufbau.

### Entscheidung

**SSG** (`prerender: true`). Nur der persönliche Merken-Button wird in `<ClientOnly>` erst im
Browser gerendert, damit das statische HTML keinen geratenen Zustand enthält.

### Konsequenzen

- Schnellste Auslieferung, statisches Hosting, gut offline cachebar (siehe C1).
- Jede Änderung braucht einen neuen Build.

## R2. Session-Infokarten (`/sessions/[id]`)

### Kontext

20 Infokarten. Uhrzeit und Raum ändern sich bei einer Konferenz am ehesten kurzfristig.
Unsere Daten liegen aber im Repository, jede Änderung ist ein neuer Build.

### Optionen

- **SSG:** alle Seiten vorab erzeugen.
- **ISR:** vorab erzeugen und regelmäßig neu erzeugen. Hilft nur bei Daten, die zur Laufzeit geladen werden.
- **SSR:** immer aktuell, aber Server pro Anfrage und nicht offlinefähig.

### Entscheidung

**SSG.** Weil eine Programmänderung bei uns immer ein neuer Build ist, wäre ISR nicht aktueller,
nur aufwendiger. ISR bleibt der Ausbaupfad, falls die Daten später von einer URL kommen.

### Konsequenzen

- Schnell und offlinefähig.
- Gecachte Seiten zeigen bis zum nächsten Netzkontakt den alten Stand. Die Offline-Strategie
muss sie deshalb aktualisieren, sobald es möglich ist (umgesetzt mit `autoUpdate`, siehe C1).

## R3. Session-Übersicht mit Filtern (`/sessions`)

### Kontext

Timetable aller 20 Sessions mit sechs Filtern, Filterzustand in der URL. Die meistgenutzte
Seite vor Ort, Offline-Fähigkeit ist hier am wichtigsten.

### Optionen

- **SSR:** pro Anfrage auf dem Server filtern. Jeder Filterwechsel braucht das Netz.
- **ISR:** Übersicht regelmäßig neu erzeugen, im Browser filtern. Braucht einen ISR-fähigen Host.
- **SSG + Filtern im Browser:** einmal vorab erzeugen, `useSessionFilter()` filtert im Browser.

### Entscheidung

**SSG + Filtern im Browser.** Bewusste **Abweichung** vom Szenario-Vorschlag SSR/ISR: Der
Vorteil von SSR, frische Daten pro Anfrage, entfällt bei gebündelten Daten, und 20 Einträge
lassen sich im Browser sofort filtern, auch offline. Könnte sich das Programm zur Laufzeit
ändern, wäre ISR besser als SSR, weil alle dieselben Inhalte sehen.

### Konsequenzen

- Filter reagieren sofort und funktionieren offline (siehe Szenario i).
- Ein geteilter gefilterter Link zeigt zuerst alle Sessions, der Filter greift nach dem Laden.

## R4. „Mein Programm“ (`/mein-programm`)

### Kontext

Zeigt die gemerkten Sessions. Die IDs liegen nur im `localStorage` des Browsers, den ein
Server nicht lesen kann. Die Seite ist privat, muss aber offline funktionieren.

### Optionen

- **CSR:** nur im Browser rendern.
- **SSR:** Der Server kennt die IDs nicht, rendert ein leeres Programm, und der Browser ersetzt es
(Hydration-Fehler, Flackern).
- **SSG:** vorab erzeugte Hülle zeigt kurz fälschlich „nichts gemerkt“.

### Entscheidung

**CSR** (`ssr: false`), mit neutralem Ladehinweis (`spaLoadingTemplate`) statt Leerzustand.

### Konsequenzen

- Kein Server nötig, `localStorage` wird sicher nur in `useMyProgram()` gelesen.
- Ohne JavaScript erscheint nichts. Offline ist die Seite nur erreichbar, wenn ihre Hülle
gecacht ist (siehe C2 und Szenario ii).

# Teil B: Offline & Caching (Schritt 3)

## C1. Sessions- und Speaker-Daten

### Kontext

Das Programm (20 Sessions, 18 Speaker) wird einmal veröffentlicht und ändert sich danach
in der Regel nicht mehr. Besucher\*innen nutzen es vor Ort, oft bei überlastetem
Konferenz-WLAN oder im Flugmodus zwischen zwei Sessions. Die Daten kommen aus
`conference-data.json`, das statisch ins JS-Bundle importiert wird. Die Übersicht sowie alle
Session- und Speaker-Seiten sind vorgerendert (SSG laut Rendering-ADR).

### Optionen

- **Cache-First (Precache):** Alles wird beim Installieren des Service Workers gespeichert und danach ohne Netz ausgeliefert.
- **Stale-While-Revalidate:** Antwort aus dem Cache, gleichzeitig im Hintergrund aktualisieren.
- **Network-First:** Zuerst das Netz, Cache nur bei Fehler.

### Entscheidung

**Cache-First über den Precache.** Bundle, vorgerenderte Seiten und die zugehörigen
`_payload.json` stehen in der Precache-Liste. Eine eigene `runtimeCaching`-Regel ist nicht
nötig, weil der Precache vorher antwortet. Damit die Seitendaten offline gefunden werden,
ignoriert der Service Worker den Parameter `_b` (Build-ID), den Nuxt an `_payload.json` anhängt.
Aus demselben Grund ignoriert er die sechs Filter-Parameter (`day`, `time`, `room`, `track`,
`level`, `speaker`). Filter wirken laut Rendering-ADR nur im Browser, ein gefilterter Link wie
`/sessions?day=2026-09-16` bekommt offline deshalb dieselbe vorgerenderte Seite wie `/sessions`.

### Konsequenzen

- Das Programm erscheint sofort und vollständig, auch ganz ohne Netz.
- Damit Besucher\*innen wissen, dass sie einen gespeicherten Stand sehen, zeigt der `LayoutOfflineBadge` ohne Verbindung einen Hinweis im Header.
- Änderungen (z. B. eine späte Raumänderung) erscheinen erst mit einem neuen Build, den `autoUpdate` beim nächsten Netzkontakt lädt.
- Würden die Daten zur Laufzeit von einer URL geladen (ISR-Ausbaupfad), wäre Stale-While-Revalidate nötig. Network-First scheidet aus, weil bei schwachem WLAN jede Seite erst nach dem Timeout erschiene.

## C2. „Mein Programm“

### Kontext

„Mein Programm“ wird vor allem zwischen zwei Sessions geöffnet, um schnell nachzusehen,
wohin es als Nächstes geht, oft im Flugmodus oder im überlasteten WLAN. Die gemerkten
Sessions liegen im `localStorage`, brauchen also keinen Cache. Die Seite `/mein-programm`
wird aber nur im Browser gerendert (CSR) und ist die `start_url` der installierten App.
Ohne vorab gespeicherte Hülle startet die App offline gar nicht.

### Optionen

- **Hülle im Precache plus `navigateFallback`:** Die App-Hülle (`200.html`) wird vorab gespeichert und für jede Navigation ohne eigenen Precache-Eintrag ausgeliefert.
- **Nur Laufzeit-Caching der Seite:** Die Seite wird erst gespeichert, wenn sie einmal online geöffnet wurde.

### Entscheidung

**Hülle im Precache, `navigateFallback: '/200'`.** Die Seite ist damit nach dem ersten
Besuch der App offline erreichbar, auch wenn `/mein-programm` selbst nie online geöffnet wurde.

### Konsequenzen

- Die installierte App startet offline direkt in „Mein Programm“.
- Merken und Entfernen funktionieren offline, weil kein Server abgeglichen werden muss.
- Gelöschte Browserdaten löschen auch das persönliche Programm.

## C3. Statische Assets (App-Shell, Icons, Token-CSS, Fonts)

### Kontext

Im Vortragssaal muss die App ohne eine einzige Netzanfrage starten. Fehlt auch nur eine
Datei der App-Shell, bleibt der Bildschirm bei überlastetem WLAN leer. JavaScript, CSS
(inkl. Design Tokens) und Icons ändern sich nur mit einem neuen Build und haben
Hash-Dateinamen. Die Schrift IBM Plex wird von Google Fonts geladen, also von einem
fremden Server.

### Optionen

- **Cache-First (Precache)** für eigene Dateien.
- **Laufzeit-Caching** für fremde Dateien: Cache-First für Schriftdateien, Stale-While-Revalidate für das Font-CSS.
- **Schriften selbst hosten**, damit sie ebenfalls im Precache landen.

### Entscheidung

**Eigene Dateien im Precache, Google Fonts zur Laufzeit** (Font-CSS mit
Stale-While-Revalidate, Schriftdateien mit Cache-First).

### Konsequenzen

- App-Shell, Tokens und Icons sind nach der Installation vollständig offline verfügbar.
- Schriften sind erst nach dem ersten Online-Besuch offline verfügbar, vorher greift eine Systemschrift. Selbst hosten wäre die robustere Lösung.
- Anfangs fehlte am Stylesheet-Link `crossorigin`, das Font-CSS wurde deshalb als undurchsichtige Antwort (Status 0) gecacht. Nach dem Fix passte diese alte Antwort nicht mehr, bis der nächste Online-Besuch sie ersetzte (siehe Szenario ii). Seitdem werden Font-CSS und Schriftdateien als lesbare Antworten (Status 200) gecacht.

# Testszenarien

Jedes Szenario prüft mehrere Entscheidungen zugleich: **i** prüft R2, R3, C1 und C3,
**ii** prüft R4, C2 und C3, **iii** zeigt die Grenze von C1–C3 beim Erstbesuch.

Getestet mit dem gebauten Stand (`npm run generate`, `npx serve .output/public`) im
DevTools-Offline-Modus, unabhängig voneinander auf zwei Systemen: Chrome unter Windows 11
(Person 2) und Brave unter macOS (Person 1). Vor jedem Test zeigte Application → Service
Workers „activated and is running“. Den Flugmodus haben wir bewusst über die DevTools
nachgestellt: Ein echter Flugmodus kappt bei einem lokalen Test nur das WLAN, `localhost`
bleibt aber erreichbar, und die Seite käme weiter vom Server statt aus dem Cache.

### i. Programm online geladen, dann Flugmodus, Session-Übersicht erneut geöffnet

- **Ausgangslage:** Die App wurde online geöffnet, der Service Worker ist aktiv und der
Precache vollständig.
- **Aktion:** Im Network-Tab auf „Offline“ geschaltet, `/sessions` mit F5 neu geladen, danach
eine Session und einen Speaker angeklickt.
- **Beobachtetes Verhalten:** Die Übersicht lädt vollständig mit allen 20 Sessions und
funktionierenden Filtern. Das Dokument `sessions` kommt mit Status 200 aus dem Service
Worker, übertragen werden 0 kB. Detailseiten und ihre `_payload.json` antworten ebenfalls
mit 200 aus dem Precache. Vor dem `_b`-Fix schlugen genau diese Payload-Anfragen offline mit
`ERR_CONNECTION_REFUSED` fehl, die Seiten wurden trotzdem angezeigt.
- **Ergebnis Person 2:** bestanden.
- **Ergebnis Person 1:** Funktioniert vollständig. Cache-First über den Precache wirkt wie im Konzept beschrieben, auch beim Weiterklicken und Filtern.

### ii. „Mein Programm“ offline öffnen, nachdem Sessions hinzugefügt wurden

- **Ausgangslage:** Online wurden zwei Sessions mit ☆ gemerkt, der Service Worker ist aktiv.
- **Aktion:** Auf „Offline“ geschaltet und `/mein-programm` mit F5 neu geladen.
- **Beobachtetes Verhalten:** Die Seite zeigt „2 von 2 gemerkten Sessions“, sortiert nach
Tag und Uhrzeit. Alle Anfragen kommen mit 200 aus dem Service Worker, 0 kB übertragen. Die
Seiten-Hülle stammt aus dem Precache, die gemerkten IDs aus dem `localStorage`. Beim ersten
Versuch scheiterte offline das Google-Fonts-CSS: Im Cache lag noch eine undurchsichtige
Antwort aus der Zeit vor dem `crossorigin`-Fix. Beim nächsten Online-Besuch wurde sie
ersetzt, danach trat der Fehler nicht mehr auf.
- **Ergebnis Person 2:** bestanden.
- **Ergebnis Person 1:** bestätigt (Brave, Offline-Emulation). Zusätzlich offline eine Session 
entfernt und neu geladen, die Änderung bleibt erhalten.

### iii. Erstbesuch ohne vorheriges Online-Laden (Grenzfall)

- **Ausgangslage:** Kein Service Worker und kein Cache (Inkognito-Fenster bzw. leeres Browserprofil).
- **Aktion:** (a) Offline geschaltet, dann `/sessions` geöffnet. (b) Online geöffnet, sofort
offline geschaltet und neu geladen. (c) Gegenprobe: online gewartet, bis der Service Worker
aktiv war, dann offline neu geladen.
- **Beobachtetes Verhalten:** Bei a und b erscheint die Browser-Fehlerseite
(`ERR_INTERNET_DISCONNECTED`), weil der Precache (112 Dateien, ca. 550 kB) noch nicht
vollständig installiert ist. Bei c lädt die Übersicht vollständig.
- **Bewertung:** Akzeptabel, denn ein Service Worker antwortet erst nach einem vollständigen
Online-Besuch. Die App sollte daher vor der Konferenz bei stabilem Netz geöffnet werden.
- **Ergebnis Person 2:** bestätigt (Chrome, auch über gedrosseltes 3G).
- **Ergebnis Person 1:** bestätigt (Brave).
