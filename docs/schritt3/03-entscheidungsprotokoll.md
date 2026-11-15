# Entscheidungsprotokoll: Offline & Caching

Grundlage ist das Konzept in [02-offline-strategie-konzept.md](02-offline-strategie-konzept.md),
umgesetzt in `nuxt.config.ts` (Abschnitt `pwa.workbox`). Belege zu den Szenarien liegen in
[04-verifikations-nachweis.md](04-verifikations-nachweis.md).

## 1. Sessions- und Speaker-Daten

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
- Änderungen (z. B. eine späte Raumänderung) erscheinen erst mit einem neuen Build, den `autoUpdate` beim nächsten Netzkontakt lädt.
- Würden die Daten zur Laufzeit von einer URL geladen (ISR-Ausbaupfad), wäre Stale-While-Revalidate nötig. Network-First scheidet aus, weil bei schwachem WLAN jede Seite erst nach dem Timeout erschiene.

## 2. „Mein Programm“

### Kontext

Die gemerkten Sessions liegen im `localStorage`, brauchen also keinen Cache. Die Seite
`/mein-programm` wird aber nur im Browser gerendert (CSR) und ist die `start_url` der
installierten App. Ohne vorab gespeicherte Hülle startet die App offline gar nicht.

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

## 3. Statische Assets (App-Shell, Icons, Token-CSS, Fonts)

### Kontext

JavaScript, CSS (inkl. Design Tokens) und Icons ändern sich nur mit einem neuen Build und
haben Hash-Dateinamen. Die Schrift IBM Plex wird von Google Fonts geladen, also von einem
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
- Ein anfänglicher Fehler durch eine undurchsichtige Antwort (Status 0) im Font-Cache wurde mit `crossorigin` am Stylesheet-Link behoben. Seitdem werden Font-CSS und Schriftdateien als lesbare Antworten (Status 200) gecacht (siehe Szenario ii).

## Testszenarien

Getestet mit dem gebauten Stand (`npm run generate`, `npx serve .output/public`) im
Chrome-DevTools-Offline-Modus. Vor jedem Test zeigte Application → Service Workers
„activated and is running“.

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
Versuch scheiterte offline das Google-Fonts-CSS, weil noch eine veraltete Antwort im Cache
lag. Beim nächsten Online-Besuch wurde sie ersetzt, danach trat der Fehler nicht mehr auf.
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
