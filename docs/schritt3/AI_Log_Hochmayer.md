# AI-LOG – Verena Hochmayer (Schritt 3)
Gemeinsame Aufgaben: B & D

Eigene Aufgaben:
C für Sessions-/Speaker-Daten-Caching 
E (Verifikations-Nachweis, Lighthouse-Audit)

### 1
- **Datum:** 14.11.2026
- **Tool:** Claude
- **Prompt:** „Wie teste ich den Offline-Modus richtig, damit nach einer Änderung am Service Worker beim Neuladen die Seiten nicht plötzlich weg sind?“
- **Zweck:** Verstehen, warum die Seiten offline manchmal nicht mehr erreichbar waren, und einen sauberen Testablauf finden: mit dem Build statt `npm run dev` testen, nach einem neuen Build einmal online neu laden und warten, bis der neue Service Worker aktiv ist, und unter Application → Service Workers „Bypass for network“ und „Update on reload“ nicht anhaken (C, E).

### 2
- **Datum:** 14.11.2026
- **Tool:** Claude
- **Prompt:** „Was ist der Unterschied zwischen 3G und No throttling im Network-Tab, und warum ging die Seite im Inkognito-Fenster mit 3G offline nicht, obwohl ich sie vorher online geöffnet hatte?“
- **Zweck:** Verstehen, wie die Netzwerkgeschwindigkeit den Offline-Test beeinflusst (E, Szenario iii). „No throttling“ nutzt die volle Geschwindigkeit der eigenen Verbindung. „3G“ bremst sie künstlich auf ein langsames Mobilnetz mit hoher Verzögerung, ähnlich wie überlastetes Konferenz-WLAN. Beim ersten Besuch lädt der Service Worker den kompletten Precache (ca. 550 kB) im Hintergrund. Das dauert mit 3G deutlich länger als die Seite selbst. Wird vorher offline geschaltet, verwirft Workbox die Installation (alles oder nichts), und es bleibt nur die Browser-Fehlerseite. Erst wenn unter Application → Service Workers „activated and is running“ steht, funktioniert die App offline. Das bestätigt die Empfehlung aus Konzept B, die App vor der Konferenz mit stabilem Netz zu öffnen.

### 3
- **Datum:** 14.11.2026
- **Tool:** Claude
- **Prompt:** „Warum zeigt die Console offline rote Fehler bei der Google-Schrift, obwohl die Seite selbst funktioniert?“
- **Zweck:** Die Fehlermeldungen beim Offline-Test einordnen (E). Die Schrift liegt auf den Servern von Google und wird nicht vorab, sondern erst zur Laufzeit gecacht. Gespeichert wird nur, was online schon einmal geladen wurde: Beim allerersten Besuch lädt die Seite die Schrift, bevor der Service Worker aktiv ist, und Google teilt die Schrift in Teildateien auf, von denen nur die benötigten geladen werden. Fehlt eine davon offline, nutzt der Browser eine Systemschrift, die Inhalte bleiben vollständig lesbar. Ergebnis: eine dokumentierte Lücke für den Nachweis. Die Lösung wäre, die Schriften selbst zu hosten, damit sie im Precache landen (Hinweis an Person 1).

### 4
- **Datum:** 14.11.2026
- **Tool:** Claude
- **Prompt:** „Kannst du mir den Lighthouse-PWA-Bericht erklären? Was bedeuten die einzelnen Prüfungen und die roten Markierungen?“
- **Zweck:** Das Ergebnis des Lighthouse-Audits einordnen (E). Die App ist installierbar: Manifest und Service Worker erfüllen alle Bedingungen. Zwei Punkte sind nur Feinschliff und betreffen nicht das Offline-Caching: Es fehlt ein `<meta name="theme-color">` im HTML (die Farbe steht bisher nur im Manifest), und es gibt kein „maskable“ Icon, das Android sauber zuschneiden kann. Außerdem gelernt: Die PWA-Kategorie gibt es nur noch in Lighthouse 11, deshalb wurde der Audit über `npx lighthouse@11` ausgeführt.

### 5
- **Datum:** 14.11.2026
- **Tool:** Claude
- **Prompt:** „Warum taucht beim Lighthouse-Audit kurz ein eigenes Chrome-Fenster auf und verschwindet wieder? Kann man das fixen?“
- **Zweck:** Verstehen, wie Lighthouse über die Kommandozeile testet (E). Lighthouse startet für jeden Audit einen eigenen, sauberen Chrome ohne Cache und ohne Service Worker, lädt darin die Seite, misst und schließt das Fenster wieder. Das ist kein Fehler und muss nicht behoben werden. Der Vorteil: Das Ergebnis hängt nicht von den eigenen Cache-Daten ab, und der Service Worker im normalen Chrome bleibt für die Offline-Tests erhalten. Der Bericht wird als HTML-Datei gespeichert und kann danach beliebig lange geöffnet werden.