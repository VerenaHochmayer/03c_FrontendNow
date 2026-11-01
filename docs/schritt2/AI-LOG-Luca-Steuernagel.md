# AI-LOG – Luca Steuernagel (Schritt 2)

Gemeinsame Aufgabe: A (Rendering-ADR) --> Wurde zusammen bearbeitet, ich habe die Logs in meinen Log übernommen

Eigene Aufgabe:
B (Session-Übersicht mit Filterung)
D (Speaker-Profilseiten)


### 1
- **Datum:** 29.10.2026
- **Tool:** Claude
- **Prompt:** „Was ist der Unterschied zwischen SSG,CSR, SSR oder ISR und wann ist es sinnvoll, welches der Protokolle zu nutzen?“
- **Zweck:** Grundlagen für das Rendering-ADR (A) verstehen, um pro Anwendungsteil echte Alternativen abwägen zu können.

### 2
- **Datum:** 29.10.2026
- **Tool:** Claude Code
- **Prompt:** „Überprüfe, ob unser ADR so mit den anderen ADRs kompatibel ist“
- **Zweck:** Prüfen der Logik unseres ADRs, anschließende Anpassung der Auffälligkeiten

### 3
- **Datum:** 29.10.2026
- **Tool:** Claude Code
- **Prompt:** „Wie funktioniert ISR: 60 mit Nuxt?“
- **Zweck:** ISR umsetzung in Nuxt verstehen

### 4
- **Datum:** 29.10.2026
- **Tool:** Claude Code
- **Prompt:** „Was wäre nötig, um useConferenceData() zur echten Implementierung auszubauen?“
- **Zweck:** Prüfen, ob die Datenschicht aus Schritt 1 für die Features reicht und ob sie zum Rendering-ADR passt (Konsistenz ADR ↔ Umsetzung).

### 5
- **Datum:** 29.10.2026
- **Tool:** Claude Code
- **Prompt:** „An welcher stelle genau kommen die Daten herein? Wo finde ich das und kann das anpassen?“
- **Zweck:** Richtige Stelle finden, um die Daten aus useConferenceData() nur an einer Stelle zugänglich zu machen

### 6
- **Datum:** 31.10.2026
- **Tool:** Claude Code
- **Prompt:** „Prüfe, ob use useConferenceData() so den Voraussetzungen entspricht“
- **Zweck:** `useConferenceData()` ausbauen: eine einzige Datenquelle, schreibgeschützte Daten, neue Abfragen und die Datumsformatierung mit Zeitzone.

### 7
- **Datum:** 31.10.2026
- **Tool:** Claude
- **Prompt:** „Wie verhält sich Nuxts Router bei reinen Query-Änderungen?“
- **Zweck:** Klären, ob die Seite beim Filtern nach oben springt, wenn der Filterzustand in der URL-Query gespeichert wird (B).

### 8
- **Datum:** 31.10.2026
- **Tool:** Claude
- **Prompt:** „Wie horizontalen Scroll für mobile Ansicht ausschalten?“
- **Zweck:** Das Timetable-Raster (B) soll auf dem Handy ohne seitliches Scrollen funktionieren.

### 9
- **Datum:** 31.10.2026
- **Tool:** Claude
- **Prompt:** „Wie kombiniert man filter?“
- **Zweck:** Umsetzung der UND-Verknüpfung mehrerer Filter in der Session-Übersicht (B).

### 10
- **Datum:** 01.11.2026
- **Tool:** Claude Code
- **Prompt:** „Wie kann ich meine Filterung verbessern?“
- **Zweck:** Filterbare Session-Übersicht umsetzen, inklusive der Rendering-Entscheidung aus A.

### 11
- **Datum:** 01.11.2026
- **Tool:** Claude Code
- **Prompt:** „Bitte prüfe noch einmal, ob der Code sich nach allen Architektur-ADRs richtet“
- **Zweck:** Konsistenz zwischen ADRs und Umsetzung sicherstellen (Bewertungskriterium).

### 12
- **Datum:** 01.11.2026
- **Tool:** Claude Code
- **Prompt:** „Erkläre mir den Fehler in Basecard“
- **Zweck:** Eine gefundene Abweichung vom Architektur-ADR beheben (Basecard)

### 13
- **Datum:** 01.11.2026
- **Tool:** Claude Code
- **Prompt:** „Ich habe gerade commit aber meinen commit falsch benannt. Wie nenne ich ihn richtig?“
- **Zweck:** Falsche Commit-Nachricht korrigieren, bevor gepusht wird.

