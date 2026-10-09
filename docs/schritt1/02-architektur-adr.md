# B. Architekturentscheidung: Komponenten- & Ordnerstruktur (ADR)

## Kontext

FrontendNow ist eine Konferenz-Plattform für eine zweitägige Web-Frontend-Konferenz.
Die Funktionalität ist durch das Szenario vorgegeben:

- Sessions durchsuchen und filtern (nach Track, Tag, Level, Speaker)
- Speaker-Profile ansehen
- Persönlichen Zeitplan zusammenstellen („Mein Programm“)
- Zeitplan offline verfügbar (PWA)
- Dark Mode

Unsere Markenidentität setzt auf **Übersichtlichkeit statt Dekoration** und auf einen
schnell zusammengestellten, offline verfügbaren Timetable. Die Struktur soll daher
genauso übersichtlich sein wie die Oberfläche: Jede Komponente hat eine klare Aufgabe.

## Optionen

**Option A: Flache Struktur, Logik in den Komponenten**
Alle Komponenten liegen in `components/`, Daten werden direkt in Seiten und
Komponenten gelesen.

- ✅ Schnell aufgesetzt
- ❌ Die „Mein Programm“-Logik und der Zugriff auf `conference-data.json` würden
  mehrfach kopiert
- ❌ Bei 4 Filterkriterien, Detailseiten und Dashboard wird es schnell unübersichtlich

**Option B: Schichten (Base / Layout / Feature) + Composables für die Kernlogik**
Komponenten werden nach ihrer Aufgabe getrennt, die fachliche Logik liegt in
Composables. Die Seiten in `pages/` setzen nur noch zusammen.

- ✅ Eine zentrale Stelle für Daten und Personalisierung
- ✅ Nutzt die Nuxt-Konventionen (Auto-Import, dateibasiertes Routing)
- ❌ Etwas mehr Struktur am Anfang

## Entscheidung

Wir nehmen **Option B** mit der Nuxt-Ordnerstruktur:

```
src/
├── assets/
│   └── styles/            # Design Tokens (primitiv + semantisch), Light/Dark
├── components/
│   ├── base/              # Generische Bausteine ohne Fachlogik
│   ├── layout/            # Seitengerüst
│   └── features/          # Fachliche Komponenten
│       ├── sessions/
│       ├── speakers/
│       └── program/       # „Mein Programm“
├── composables/           # Logik (headless), wiederverwendbar
├── layouts/
│   └── default.vue
├── pages/                 # Dateibasiertes Routing
│   ├── index.vue
│   ├── sessions/
│   │   ├── index.vue      # Übersicht + Filter
│   │   └── [id].vue       # Detail (SSG)
│   ├── speakers/
│   │   ├── index.vue
│   │   └── [id].vue       # Profil (SSG)
│   └── mein-programm.vue  # Dashboard (CSR)
└── types/
│   └── conference.ts      # Typen passend zum Datenschema
├── data/
│   ├── conference-data.json   # Geteilter, schreibgeschützter Datensatz
├── public/                    # PWA-Icons, Manifest-Assets
```

**Regeln für die Schichten:**

- `base/` kennt keine Konferenzdaten, sondern nur Props und Slots.
- `features/` holt Daten nur über Composables, nie direkt aus der JSON oder dem `localStorage`.
- `pages/` setzt Feature-Komponenten zusammen und enthält kaum eigene Logik.
- `Layout/` Komponenten für Aufbau der Oberfläche

**Prüfung der Headless-Aufteilung (Logik als Composable, Darstellung austauschbar)**

Bei einer Headless-Aufteilung liegt die Logik einer Interaktion (Zustand, Regeln,
Speicherung) in einem Composable ohne eigenes Markup. Die Komponenten, die sie
nutzen, kümmern sich nur um die Darstellung und können frei gestaltet oder
ausgetauscht werden. Wir haben das für zwei zentrale Interaktionen bewusst geprüft:

### 1. „Zu Mein Programm hinzufügen“

„Mein Programm“ ist mit unser Kernfeature und erscheint an mehreren Stellen mit unterschiedlicher Darstellung. 
Durch die Headless-Aufteilung verhält es sich überall gleich, was direkt zu unserem Fokus auf Benutzer\*innenfreundlichkeit
passt. Außerdem gibt es nur eine Stelle, die auf `localStorage` zugreift. Damit bleiben die SSG-Seiten unproblematisch,
der Plan ist offline verfügbar, und die Logik lässt sich ohne UI testen.
Ohne Headless wäre die Logik mit in der Darstellungskomponente. Diese Komponente müste dann für mehre Darstellungsversionen
viele Varianten-Props bekommen und die Logik würde kopiert. 

### 2. Session-Filterung

Bei der Session-Filterung bietet sich eine Trennung von Logik und Darstellung ebenfalls an (also ein Headless
Verfahren), da die Filterlogik dann als Composable an anderer Stelle (bspw. in "Meinem Programm")
wiederverwendet werden kann. Ebenfalls kann so die Darstellung ersetzt werden, ohne dass
die Filterlogik neu geschrieben werden muss.

## Konsequenzen

-  Die Logik von „Mein Programm“ gibt es nur einmal. Dadurch verhält sich dieses Element überall gleich, was direkt auf unser Ziel der Benutzer\*innenfreundlichkeit eingeht.
-  Die Trennung passt zu den Rendering-Strategien: Seiten, die nur `useConferenceData()` nutzen, können statisch generiert werden (SSG). Alles, was `useMyProgram()` braucht, läuft clientseitig.
- Der Datenzugriff ist an einer Stelle gebündelt (`useConferenceData()`). Ein späterer Wechsel von der lokalen JSON zu einem Fetch per URL betrifft nur diese Datei. Das hilft auch bei der Offline-Strategie
- Die klaren Schichten erleichtern das Peer Review.
- Es muss aufgepasst werden, dass keine Fachlogik in `base/` und kein direkter Zugriff auf `localStorage` in Komponenten eingebaut werden.
- Man hat mehr Dateien als bei Option A.

## Komponentenübersicht

**Base/UI** (generisch, ohne Fachlogik)
- `BaseButton`
- `BaseIconButton`
- `BaseTag`
- `BaseCard`
- `BaseSelect`
- `BaseSearchInput`

**Layout**
- `LayoutHeader` 
- `LayoutNavigation`
- `LayoutThemeToggle` (Dark Mode)
- `LayoutOfflineBadge`
- `LayoutFooter`

**Feature**
- *sessions*: `SessionsList`, `SessionsCard`, `SessionsFilterBar`
- *speakers*: `SpeakersList`, `SpeakersCard`, `SpeakersProfile`
- *program*: `ProgramTimetable`, `ProgramConflictHint`,

**Composables**
- `useConferenceData()`: lädt `conference-data.json`
- `useMyProgram()`: verwaltet „Mein Programm“, speichert in `localStorage`, erkennt Zeitkonflikte
- `useSessionFilter()`: Filter nach Track, Tag, Level und Speaker plus Suche, synchronisiert mit der URL-Query
- `useTheme()`: Light/Dark, gespeichert in `localStorage`, berücksichtigt `prefers-color-scheme`

**Pages**
- `index`, `sessions/index`, `sessions/[id]`, `speakers/index`, `speakers/[id]`, `mein-programm`

```
conference-data.json
        │
useConferenceData() ─────────────┬──────────────────────┐
        │                        │                      │
sessions/index.vue        sessions/[id].vue      speakers/[id].vue
  ├─ SessionsFilterBar ─ useSessionFilter()             │
  └─ SessionsList                │                      │
       └─ SessionsCard     SessionsDetail        SpeakersProfile
            └─ ProgramToggleButton ──┴───────────────────┘
                     │
               useMyProgram() ⇄ localStorage
                     │
          mein-programm.vue (CSR)
            └─ ProgramTimetable ─ ProgramConflictHint
```
