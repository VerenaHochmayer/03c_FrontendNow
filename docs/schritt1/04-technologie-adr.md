# D. Technologieentscheidung: Projekt-Setup (ADR)

## Kontext

Trotz der kleinen Datenmenge braucht die Anwendung **mehrere Seitentypen**:

- **Übersichten:** Sessions (mit Filter nach Track, Tag, Level, Speaker) und Speaker
- **Detailseiten:** eine pro Session (20) und eine pro Speaker (18), mit eigenen URLs
- **Personalisierter Timetable:** „Mein Programm“
- **Startseite**

Daraus ergeben sich die Kriterien für die Wahl des Setups:

1. **Routing-Bedarf:** ca. 6 Routen, davon 2 dynamische (`/sessions/[id]`, `/speakers/[id]`)
2. **Team-Erfahrung:** Vue-Grundlagen sind vorhanden, Zeit für Einarbeitung ist knapp
3. **Spätere Anforderungen:** In Schritt 2 soll pro Seitentyp eine Rendering-Strategie
   gewählt werden, in Schritt 3 kommt PWA/Offline dazu. Das Setup darf diese
   Entscheidungen nicht verbauen.
4. **Aufwand für Konfiguration:** Bei 2 Personen und wenigen Wochen Laufzeit soll
   möglichst wenig Zeit in Tooling fließen.

## Alternativen

### Option A: Nuxt (gewählt)

- **Vorteile:**
  - Dateibasiertes Routing: Die ~6 Seiten inklusive der dynamischen Detailseiten
    entstehen einfach durch Dateien in `pages/` (`sessions/[id].vue`), ohne eigene
    Router-Konfiguration.
  - Auto-Import von Komponenten und Composables. Das passt zu unserer
    Schichtstruktur (`components/base/Button.vue` → `<BaseButton>`, siehe
    Architektur-ADR).
  - Layouts (`layouts/default.vue`) für Header, Navigation und Footer sind eingebaut.
  - Alle Rendering-Modi sind vorhanden und lassen sich pro Route festlegen. Die
    Rendering-Entscheidung bleibt dadurch offen.
  - Offizielle Module für spätere Anforderungen, z. B. für PWA und Dark Mode.
  - Von der LV empfohlen.
- **Nachteile:**
  - Mehr „Magie“ (Auto-Imports, Konventionen), die man erst verstehen muss.
  - Bei Seiten, die nicht nur im Browser laufen, muss man aufpassen, wann
    `localStorage` verfügbar ist.
  - Für ca. 40 Detailseiten und eine JSON-Datei eigentlich ein großes Framework.

### Option B: Vue + Vite + vue-router

- **Vorteile:**
  - Schlankes Setup mit wenig Abstraktion. Man sieht genau, was passiert.
  - Für eine Anwendung mit ~6 Routen und ohne Backend völlig ausreichend.
  - `localStorage` ist immer verfügbar, weil alles im Browser läuft.
- **Nachteile:**
  - Die Routen müssen von Hand in einer Router-Datei gepflegt werden. Bei 6 Routen
    ist das machbar, aber Doppelarbeit gegenüber der Ordnerstruktur.
  - Komponenten und Composables müssen überall manuell importiert werden.
  - Layouts, Seitentitel und Meta-Tags müssen selbst gebaut werden.
  - Nur clientseitiges Rendering. Für den Vergleich von Rendering-Strategien
    in Schritt 2 bräuchten wir zusätzliche Plugins (z. B. `vite-ssg`), die wir
    selbst zusammenstellen und konfigurieren müssten.
<br> → Für die Seitentypen reicht es heute, aber bei Schritt 2 und 3
  müssten wir genau das nachbauen, was Nuxt schon mitbringt.

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

- Neue Seiten entstehen einfach durch Dateien in `pages/`. Die Navigation entspricht
  der Ordnerstruktur.
- Wenig Konfigurationsaufwand. Die Zeit fließt in Funktion und Übersichtlichkeit,
  passend zu unserer Marke.
- Schritt 2 (Rendering) und Schritt 3 (PWA) lassen sich ohne Wechsel des Setups umsetzen.

**Negativ**

- Einarbeitung in die Nuxt-Konventionen (Auto-Imports, `srcDir`, Ordnernamen).
- Das Framework ist größer, als es die reine Datenmenge erfordern würde.

**Risiken**

- Zugriffe auf `localStorage` außerhalb des Browsers führen zu Fehlern.
  *→* Zugriff nur in `useMyProgram()` und `useTheme()` kapseln (siehe
  Architektur-ADR).
- Auto-Imports verschleiern, woher eine Funktion kommt.
  *→* klare Namenskonventionen (`use…` für Composables, Präfix nach
  Schicht für Komponenten).
