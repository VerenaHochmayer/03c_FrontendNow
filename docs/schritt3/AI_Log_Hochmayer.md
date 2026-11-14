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