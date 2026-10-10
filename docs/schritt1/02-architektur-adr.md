# B. Architekturentscheidung: Komponenten- & Ordnerstruktur (ADR)

## Kontext

Wir (Team ClubMates) bauen mit Vue und Nuxt die Konferenzseite für die
fiktive zweitägige Konferenz **FrontendNow**. Die Funktionen sind vorgegeben:

- Sessions durchsuchen und filtern (nach Track, Tag, Level, Speaker)
- Speaker-Profile ansehen
- Persönlichen Zeitplan zusammenstellen („Mein Programm“)
- Zeitplan offline verfügbar (das Konferenz-WLAN ist unzuverlässig → PWA)
- Dark Mode (die Vortragssäle sind abgedunkelt)

Einschränkungen: Es gibt kein Backend. Alle Daten kommen aus der statischen
`conference-data.json` (20 Sessions, 18 Speaker, 4 Tracks, 4 Räume). „Mein Programm“
wird nur clientseitig im `localStorage` gespeichert. Detailseiten sollen statisch
generiert werden (SSG), „Mein Programm“ läuft clientseitig (CSR).

Unsere Marke setzt auf **Übersichtlichkeit statt Dekoration** und auf einen schnell
zusammengestellten Timetable. Die wichtigste Interaktion, „Zu Mein Programm
hinzufügen“, kommt an mehreren Stellen in unterschiedlicher Darstellung vor:
Session-Karte, Session-Detail, Speaker-Profil und im Timetable. Wir brauchen eine Struktur, in der diese Logik nur einmal existiert und
die für beide Teammitglieder (und später im Peer-Review) gut verständlich ist.

## Optionen

### Option 1: Flache Struktur, Logik direkt in den Komponenten

- **Vorteile:** Schnell aufgesetzt, wenig Dateien.
- **Nachteile:** Die Logik von „Mein Programm“ und der Datenzugriff würden mehrfach
  kopiert. Zugriffe auf `localStorage`, verstreut über Komponenten, sind
  fehleranfällig bei SSG.
- **Warum abgelehnt:** Unser Kernfeature würde sich nicht überall gleich verhalten.
  Das widerspricht direkt unserem Markenversprechen.

### Option 2: Konsequent headless für alle Interaktionen

- **Vorteile:** Maximale Austauschbarkeit der Darstellung.
- **Nachteile:** Viel Abstraktion für Interaktionen, die nur einmal vorkommen.
- **Warum abgelehnt:** Widerspricht unserem Grundsatz „übersichtlich statt aufwendig“.

### Option 3: Schichten (Base / Layout / Feature) mit Composables für die Kernlogik

- **Vorteile:** Die Logik von „Mein Programm“ und der Datenzugriff existieren nur
  einmal. Klare Zuständigkeiten pro Schicht. Nutzt die Nuxt-Konventionen
  (Auto-Import, dateibasiertes Routing). Die Schicht ist am Komponentennamen erkennbar.
- **Nachteile:** Mehr Dateien und etwas mehr Struktur am Anfang. Die Regeln für die
  Schichten müssen eingehalten werden.
- **Warum gewählt:** Unser Kernfeature verhält sich überall gleich, und die Struktur
  ist so übersichtlich wie unsere Oberfläche. Das passt am besten zu unserem
  Markenversprechen.

## Entscheidung

Wir werden Option 3 wählen und die Komponenten in **drei Schichten** aufteilen (Base, Layout, Feature)
und die fachliche Logik in **Composables** auslagern. Dabei nutzen wir die
Nuxt-Konventionen (dateibasiertes Routing, Auto-Import).

```
src/
├── assets/styles/      # Design Tokens, Light/Dark
├── components/
│   ├── base/           # generisch, ohne Fachlogik (nur Props/Slots)
│   ├── layout/         # Seitengerüst
│   └── features/       # sessions/, speakers/, program/
├── composables/        # Logik ohne Markup
├── layouts/default.vue
├── pages/              # setzen nur zusammen
├── types/conference.ts
├── data/conference-data.json   # bewusst außerhalb von src/ (Rohdaten, nicht App-Code)
└── public/                     # PWA-Icons, Manifest-Assets
```

**Regeln:** `base/` kennt keine Konferenzdaten. `features/` greift nur über
Composables auf Daten oder `localStorage` zu. `pages/` enthält kaum eigene Logik.

**Headless-Prüfung:**
- **„Zu Mein Programm hinzufügen“ → Headless.** `useMyProgram()` stellt `toggle`,
  `isInProgram(id)`, die Erkennung von Zeitkonflikten und die Speicherung im
  `localStorage` bereit. Die Darstellung übernehmen verschiedene Komponenten.
  Begründung: Es verhält sich überall gleich, es gibt nur einen Zugriff auf
  `localStorage` (SSG-sicher, offline-fähig), und die Logik ist ohne UI testbar.
- **Session-Filterung → nur ein einfaches Composable.** `useSessionFilter()` bündelt
  die Filterlogik und synchronisiert sie mit der URL-Query. Weil es nur eine
  Darstellung gibt (`SessionsFilterBar`), wäre eine vollständig headless Komponente
  mit austauschbaren Renderern Overengineering.

## Konsequenzen

### Positiv

- „Mein Programm“ verhält sich überall gleich und ist an einer Stelle testbar.
- Die Trennung passt zu den Rendering-Strategien: Inhalte aus
  `useConferenceData()` können per SSG generiert werden. Alles, was
  `useMyProgram()` nutzt, wird erst im Browser aktiv. Das gilt für das Dashboard und
  für den Merken-Button auf den statischen Detailseiten.
- Die Schicht ist am Komponentennamen erkennbar (`components/base/Button.vue` →
  `<BaseButton>`), was das Peer-Review erleichtert.

### Negativ

- Mehr Dateien und etwas mehr Einarbeitung als bei einer flachen Struktur.
- Die Regeln für die Schichten müssen im Team konsequent eingehalten werden.

### Risiken

- Fachlogik schleicht sich in `base/`-Komponenten ein. → gegenseitige
  Code-Reviews mit Blick auf die Regeln.
- Ein zu großes `useMyProgram()` wird unübersichtlich. → Die
  Konflikterkennung bei Bedarf in eine eigene Hilfsfunktion auslagern.

## Komponentenübersicht


| Schicht     | Komponenten                                                                                                                                                                                                     |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Base        | `BaseButton`, `BaseIconButton`, `BaseTag`, `BaseCard`, `BaseSelect`, `BaseSearchInput`                                                                                                                          |
| Layout      | `LayoutHeader`, `LayoutNavigation`, `LayoutThemeToggle`, `LayoutOfflineBadge`, `LayoutFooter`                                                                                                                   |
| Feature     | `SessionsList`, `SessionsCard`, `SessionsFilterBar`, `SessionsDetail`, `SpeakersList`, `SpeakersCard`, `SpeakersProfile`, `ProgramToggleButton`, `ProgramTimetable`, `ProgramConflictHint`, `ProgramEmptyState` |
| Composables | `useConferenceData()`, `useMyProgram()`, `useSessionFilter()`, `useTheme()`                                                                                                                                     |
