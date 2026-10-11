# B. Architekturentscheidung: Komponenten- & Ordnerstruktur (ADR)

## Kontext

Wir (Team ClubMates) bauen mit Vue und Nuxt die Konferenzseite für die
fiktive zweitägige Konferenz **FrontendNow**. Die Funktionen sind vorgegeben:

- Sessions durchsuchen und filtern (nach Track, Tag, Level, Speaker, bei uns zusätzlich nach Raum und Uhrzeit)
- Speaker-Profile ansehen
- Persönlichen Zeitplan zusammenstellen („Mein Programm“)
- Zeitplan offline verfügbar (das Konferenz-WLAN ist unzuverlässig → PWA)
- Dark Mode (die Vortragssäle sind abgedunkelt)

Einschränkungen: Es gibt kein Backend. Alle Daten kommen aus der statischen
`conference-data.json` (20 Sessions, 18 Speaker, 4 Tracks, 4 Räume). „Mein Programm“
wird nur clientseitig im `localStorage` gespeichert. Detailseiten sollen statisch
generiert werden (SSG), „Mein Programm“ läuft clientseitig (CSR).

Unsere Marke setzt auf **Übersichtlichkeit statt Dekoration** und auf einen schnell
zusammengestellten Timetable. Die Programmübersicht ist selbst ein Timetable, in
dem die Events eingetragen sind. Ein Klick auf ein Event öffnet dessen Infokarte.
Außerdem gibt es eine Speaker-Liste mit einer Infokarte pro Speaker, die deren
Vorträge zeigt. Sowohl die Programmübersicht als auch „Mein Programm“ lassen sich
nach Raum, Tag, Track, Level, Uhrzeit und Speaker filtern.

Unsere wichtigste Interaktion, „Zu Mein Programm hinzufügen“, kommt an mehreren
Stellen in unterschiedlicher Darstellung vor: im Timetable der Programmübersicht,
auf der Infokarte eines Events und in der Vortragsliste auf der Infokarte eines
Speakers. Wir brauchen eine Struktur, in der diese Logik nur einmal existiert und
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

- **Vorteile:** Die Logik von „Mein Programm“, die Filterlogik und der Datenzugriff
  existieren nur einmal. Klare Zuständigkeiten pro Schicht. Nutzt die Nuxt-Konventionen
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
├── assets/styles/      # main.css: Tailwind + Import von /tokens
├── components/
│   ├── base/           # generisch, ohne Fachlogik (nur Props/Slots)
│   ├── layout/         # Seitengerüst
│   └── features/       # sessions/, speakers/, my-program/
├── composables/        # Logik ohne Markup
├── layouts/default.vue
├── pages/              # setzen nur zusammen
└── types/conference.ts
tokens/tokens.css           # Design Tokens (primitiv + semantisch)
data/conference-data.json   # bewusst außerhalb von src/ (Rohdaten, nicht App-Code)
public/                     # PWA-Icons, Manifest-Assets
```

**Regeln:** `base/` kennt keine Konferenzdaten. `features/` greift nur über
Composables auf Daten oder `localStorage` zu. `pages/` enthält kaum eigene Logik.

**Benennung:** Nuxt setzt beim Auto-Import standardmäßig alle Ordnernamen vor den
Komponentennamen. In der `nuxt.config.ts` stellen wir ein, dass `features/` dabei
übersprungen wird (`pathPrefix: false`). Aus `features/my-program/Toggle.vue` wird so
`<MyProgramToggle>` statt `<FeaturesMyProgramToggle>`. Die Präfixe sind eindeutig:
`Sessions…` steht für die Programmübersicht, `MyProgram…` für das persönliche
Programm.

**Headless-Prüfung:**
- **„Zu Mein Programm hinzufügen“ → Headless.** `useMyProgram()` stellt `toggle`,
  `isInProgram(id)`, die Erkennung von Zeitkonflikten und die Speicherung im
  `localStorage` bereit. Die Darstellung übernimmt `MyProgramToggle` in zwei Größen
  (kompakt im Timetable-Eintrag, mit Text auf den Infokarten) sowie
  `MyProgramTimetable` im persönlichen Programm.
  <br>**Begründung**: Es verhält sich überall gleich, es gibt nur einen Zugriff auf
  `localStorage` (SSG-sicher, offline-fähig), und die Logik ist ohne UI testbar.
- **Session-Filterung → Composable ja, austauschbare Darstellung nein.**
  `useSessionFilter(sessions)` bekommt eine Liste von Sessions übergeben und liefert
  die gefilterte Liste zurück (Raum, Tag, Track, Level, Uhrzeit als Zeitbereich,
  Speaker). Der Filterzustand wird mit der URL-Query synchronisiert. Die Logik
  wird an zwei Stellen gebraucht: in der Programmübersicht mit allen Sessions und
  in „Mein Programm“ mit den gemerkten Sessions. Das Composable ist deshalb
  sinnvoll. Dargestellt werden die Filter aber an beiden Stellen gleich, mit
  derselben `SessionsFilterBar`. Eine vollständig headless Komponente mit
  austauschbaren Renderern wäre daher Overengineering.

## Konsequenzen

### Positiv

- „Mein Programm“ verhält sich überall gleich und ist an einer Stelle testbar.
- Programmübersicht und „Mein Programm“ filtern mit derselben Logik und sehen dabei
  gleich aus. Das macht die Bedienung vorhersehbar.
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


| Schicht     | Komponenten                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Base        | `BaseButton`, `BaseIconButton`, `BaseTag`, `BaseCard`, `BaseSelect`, `BaseSearchInput`                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Layout      | `LayoutHeader`, `LayoutNavigation`, `LayoutThemeToggle`, `LayoutOfflineBadge`, `LayoutFooter`                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Feature     | **sessions/**: `SessionsTimetable` (Programmübersicht als Raster), `SessionsTimetableEntry` (ein Event im Raster, anklickbar), `SessionsFilterBar` (Raum, Tag, Track, Level, Uhrzeit, Speaker – auch in „Mein Programm“), `SessionsDetail` (Infokarte eines Events), `SessionsCard` (Vortrag in der Liste eines Speakers)<br>**speakers/**: `SpeakersList`, `SpeakersCard`, `SpeakersProfile` (Infokarte mit Vorträgen)<br>**my-program/**: `MyProgramToggle` (hinzufügen/entfernen), `MyProgramTimetable`, `MyProgramConflictHint`, `MyProgramEmptyState` |
| Composables | `useConferenceData()`, `useMyProgram()`, `useSessionFilter(sessions)`, `useTheme()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
