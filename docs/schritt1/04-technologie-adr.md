# D. Technologieentscheidung: Projekt-Setup (ADR)

## Kontext

Trotz der kleinen Datenmenge braucht die Anwendung **mehrere Seitentypen**:

- **Übersichten:** Sessions (Filter nach Track, Tag, Level, Speaker) und Speaker
- **Detailseiten:** pro Session (20) und eine pro Speaker (18), mit eigenen URLs
- **Personalisierter Timetable:** „Mein Programm“
- **Startseite**

Daraus ergeben sich die Kriterien für die Wahl des Setups:

1. **Routing-Bedarf:** ca. 6 Routen, davon 2 dynamische (`/sessions/[id]`, `/speakers/[id]`)
2. **Team-Erfahrung:** Vue-Grundlagen vorhanden, Einarbeitungszeit knapp.
3. **Spätere Anforderungen:** Rendering-Entscheidung in Schritt 2, PWA/Offline in Schritt 3.
   Das Setup darf diese späteren Entscheidungen nicht unnötig verbauen.
4. **Aufwand für Konfiguration:** Möglichst wenig Zeit für Tooling bei 2 Personen

## Alternativen

### Option A: Nuxt (gewählt)

- **Vorteile:**
  - Dateibasiertes Routing durch Dateien in `pages/` (`sessions/[id].vue`), ohne eigene
    Router-Konfiguration.
  - Auto-Import von Komponenten und Composables.
  - Layouts (`layouts/default.vue`) für Header, Navigation und Footer sind eingebaut.
  - Die Rendering-Entscheidung bleibt offen, konkrete Strategien werden erst in Schritt 2 festgelegt.
  - Von der LV empfohlen.
- **Nachteile:**
  - Mehr „Magie“ (Auto-Imports, Konventionen), die man erst verstehen muss.
  - `localStorage` darf nur im Browser angesprochen werden.
  - Für ca. 40 Detailseiten und eine JSON-Datei ein großes Framework.

### Option B: Vue + Vite + vue-router

- **Vorteile:**
  - Schlankes Setup mit wenig Abstraktion. Man sieht genau, was passiert.
  - Für ~6 Routen ohne Backend ausreichend.
- **Nachteile:**
  - Routen müssen von Hand in einer Router-Datei gepflegt werden.
  - Komponenten und Composables müssen überall manuell importiert werden.
  - Layouts, Seitentitel und Meta-Tags müssen selbst gebaut werden.
  - Weitere Rendering-Strategien erfordern zusätzliche Werkzeuge und Konfiguration.

## Entscheidung

Wir verwenden **Nuxt** (Option A) mit folgendem Tooling:

| Bereich       | Wahl                                       | Begründung                                                                                                                                                                                                                      |
|---------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Framework     | Nuxt 4 (Vue 3)                             | Dateibasiertes Routing, Layouts und Auto-Import passen zu unseren Seitentypen und zur Komponentenstruktur                                                                                                                       |
| Quellordner   | `src/` statt `app/` (`srcDir: 'src/'`)     | Vorgabe der Aufgabe                                                                                                                                                                                                             |
| Sprache       | TypeScript                                 | Typen passend zum Datenschema der `conference-data.json` fangen Tippfehler bei Feldern wie `trackId` oder `speakerIds` ab                                                                                                       |
| Code-Qualität | ESLint über `@nuxt/eslint`                 | Einheitlicher Stil für 2 Personen, ohne eigene Konfiguration                                                                                                                                                                    |
| Styling       | Tailwind CSS v4 (über `@tailwindcss/vite`) | Unsere semantischen Design Tokens werden per `@theme` als Tailwind-Klassen bereitgestellt (z. B. `bg-surface`). Die Standardpalette wird entfernt, damit nur Token-Werte nutzbar sind. Dark Mode läuft über eine `.dark`-Klasse |
| State         | Composables + `useState` von Nuxt          | Für einen kleinen, klar umrissenen Zustand wie „Mein Programm“ reicht das, Pinia wäre zusätzlicher Aufwand                                                                                                                      |
| Paketmanager  | npm                                        | Ist bei Node.js dabei, keine Zusatzinstallation                                                                                                                                                                                 |

Module für PWA und Dark Mode werden erst in den jeweiligen Schritten ergänzt.

## Konsequenzen

**Positiv**

- Neue Seiten entstehen einfach durch Dateien in `pages/`.
- Wenig Konfigurationsaufwand schafft Zeit für Funktionen und Übersichtlichkeit,
  passend zu unserer Marke.
- Schritt 2 und Schritt 3 lassen sich ohne Wechsel des Setups umsetzen.

**Negativ**

- Einarbeitung in die Nuxt-Konventionen (Auto-Imports, `srcDir`, Ordnernamen).
- Framework größer als für die Datenmenge nötig.

**Risiken**

- Zugriffe auf `localStorage` außerhalb des Browsers führen zu Fehlern.
  *→* Zugriff nur in `useMyProgram()` und `useTheme()` kapseln (siehe
  Architektur-ADR).
- Auto-Imports verschleiern, woher eine Funktion kommt.
  *→* klare Namenskonventionen (`use…` für Composables, Präfix nach
  Schicht für Komponenten).
