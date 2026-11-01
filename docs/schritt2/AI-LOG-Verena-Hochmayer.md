# AI-LOG – Verena Hochmayer (Schritt 2)

Gemeinsame Aufgabe: A (Rendering-ADR) --> Logs in AI-LOG – Luca Steuernagel

Eigene Aufgaben:
C (Session-Detailseiten)
E („Mein Programm“-Grundfunktion)

### 1
- **Datum:** 29.10.2026
- **Tool:** Claude
- **Prompt:** „Was bedeutet `[id]` im Dateinamen `pages/sessions/[id].vue`?“
- **Zweck:** Dynamische Routen verstehen: wie aus einer Datei 20 verschiedene Session-Detailseiten werden (C).

### 2
- **Datum:** 31.10.2026
- **Tool:** Claude
- **Prompt:** „Woher bekommt die Seite die Daten zu einer Session?“
- **Zweck:** Den Datenfluss über useConferenceData() zur Session-Detailseite nachvollziehen (C).

### 3
- **Datum:** 31.10.2026
- **Tool:** Claude
- **Prompt:** „Was macht `useSeoMeta`, und warum braucht jede Detailseite einen eigenen Titel?“
- **Zweck:** Verstehen, wie Titel und Beschreibung auf den vorab erzeugten Session-Detailseiten gesetzt werden (C).

### 4
- **Datum:** 31.10.2026
- **Tool:** Claude
- **Prompt:** „Was passiert, wenn jemand `/sessions/s99` aufruft?“
- **Zweck:** Die Fehlerbehandlung beim Aufruf einer unbekannten Session-ID verstehen (C).

### 5
- **Datum:** 31.10.2026
- **Tool:** Claude
- **Prompt:** „Folgt die Detailseite so der SSG Strategie?“
- **Zweck:** Prüfen, ob die Session-Detailseite entsprechend der festgelegten SSG-Strategie umgesetzt wurde (C).