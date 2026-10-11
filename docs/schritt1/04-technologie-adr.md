# D. Technologieentscheidung: Projekt-Setup (ADR)

## Kontext

Trotz der kleinen Datenmenge braucht die Anwendung **mehrere Seitentypen**:
die Programmübersicht als Timetable, eine Speaker-Liste, Infokarten pro Event (20)
und Speaker (18) mit eigenen URLs, den personalisierten Timetable „Mein Programm“
und eine Startseite. Programmübersicht und „Mein Programm“ sind nach Raum, Tag,
Track, Level, Uhrzeit und Speaker filterbar.

Kriterien für die Wahl des Setups:

1. **Routing-Bedarf:** ca. 6 Routen, davon 2 dynamische (`/sessions/[id]`, `/speakers/[id]`)
2. **Team-Erfahrung:** Vue-Grundlagen vorhanden, Einarbeitungszeit knapp
3. **Spätere Anforderungen:** Rendering (Schritt 2) und PWA/Offline (Schritt 3) dürfen nicht verbaut werden
4. **Konfigurationsaufwand:** möglichst wenig Zeit für Tooling bei 2 Personen

## Alternativen

### Option A: Nuxt (gewählt)

- **Vorteile:** Dateibasiertes Routing über `pages/`, Auto-Import von Komponenten
  und Composables, eingebaute Layouts. Die Rendering-Entscheidung bleibt für
  Schritt 2 offen. Von der LV empfohlen.
- **Nachteile:** Konventionen und Auto-Imports müssen erst verstanden werden.
  `localStorage` darf nur im Browser angesprochen werden. Für ca. 40 Detailseiten
  eigentlich ein großes Framework.

### Option B: Vue + Vite + vue-router

- **Vorteile:** Schlankes Setup mit wenig Abstraktion, für ~6 Routen ausreichend.
- **Nachteile:** Routen, Imports, Layouts und Meta-Tags müssen von Hand gepflegt
  werden. Weitere Rendering-Strategien erfordern zusätzliche Werkzeuge.

## Entscheidung

Wir verwenden **Nuxt** (Option A) mit folgendem Tooling:

| Bereich       | Wahl                                   | Begründung                                                         |
|---------------|----------------------------------------|--------------------------------------------------------------------|
| Framework     | Nuxt 4 (Vue 3)                         | Routing, Layouts und Auto-Import passen zu unseren Seitentypen     |
| Quellordner   | `src/` statt `../../src/app` (`srcDir: 'src/'`) | Vorgabe der Aufgabe                                                |
| Sprache       | TypeScript                             | Typen zum Datenschema fangen Tippfehler (z. B. `trackId`) ab       |
| Code-Qualität | `@nuxt/eslint`                         | Einheitlicher Stil ohne eigene Konfiguration                       |
| Styling       | Tailwind CSS v4                        | Semantische Design Tokens werden per `@theme` zu Klassen           |
| State         | Composables + `useState`               | Reicht für „Mein Programm“, Pinia wäre zusätzlicher Aufwand        |
| Paketmanager  | npm                                    | Bei Node.js dabei                                                  |

Module für PWA und Dark Mode folgen in den jeweiligen Schritten.

## Konsequenzen

**Positiv**

- Neue Seiten entstehen durch Dateien in `pages/`.
- Wenig Konfiguration lässt Zeit für Funktionen und Übersichtlichkeit.
- Schritt 2 und 3 sind ohne Wechsel des Setups umsetzbar.

**Negativ**

- Einarbeitung in die Nuxt-Konventionen.
- Framework größer als für die Datenmenge nötig.

**Risiken**

- `localStorage`-Zugriffe außerhalb des Browsers führen zu Fehlern
  → nur in `useMyProgram()` und `useTheme()` kapseln.
- Auto-Imports verschleiern die Herkunft von Funktionen
  → klare Namenskonventionen (`use…`, Präfix nach Schicht).
