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

### 6
- **Datum:** 01.11.2026
- **Tool:** Claude
- **Prompt:** „Wie ist der localStorage in unserem Projekt aufgebaut?“
- **Zweck:** Das Speicherkonzept für die Session-IDs im persönlichen Programm nachvollziehen (E).

### 7
- **Datum:** 01.11.2026
- **Tool:** Claude
- **Prompt:** „Ich habe schon einen Commit erstellt. Warum verlangt Git jetzt noch einen Merge-Commit, und wie geht es ohne?“
- **Zweck:** Die Git-Meldung verstehen und die eigenen Änderungen ohne zusätzlichen Merge-Commit mit dem gemeinsamen Stand zusammenführen.

### 8
- **Datum:** 01.11.2026
- **Tool:** Claude
- **Prompt:** „Wie funktioniert das Hinzufügen und Entfernen einer Session in Mein Programm?“
- **Zweck:** Die Funktionen von useMyProgram() und den gemeinsamen Zustand der Merken-Buttons verstehen (E).

### 9
- **Datum:** 01.11.2026
- **Tool:** Claude
- **Prompt:** „Wie werden meine gespeicherten Sessions nach dem Neuladen wieder angezeigt?“
- **Zweck:** Das Einlesen der Session-IDs aus dem localStorage und die Wiederherstellung des persönlichen Programms verstehen (E).

### 10
- **Datum:** 01.11.2026
- **Tool:** Claude
- **Prompt:** „Wie verschiebe ich das AI-Log nach docs/schritt1 und halte die neue Ordnerstruktur in einem eigenen Commit fest?“
- **Zweck:** Das AI-Log dem richtigen Projektschritt zuordnen und die Verschiebung in einem separaten Commit dokumentieren.