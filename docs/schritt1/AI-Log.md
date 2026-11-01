# AI-Log

Übersicht über den Einsatz von AI (Claude Code).

### Prompt: Wie gehen wir mit Akzentfarben aus unserer Farbpalette um, die durch den WCAG-AA-Kontrast-Test durchfallen?
**Übernommen:** Kontrasttabelle, abgedunkelte Varianten für Violett und Koralle, Regel „auf Akzentflächen steht immer `#222222`“

**Verstanden:** Unterschied zwischen 4,5 : 1 (normaler Text), 3 : 1 (großer Text und UI-Elemente) und warum Akzentfarben oft nur als Fläche, nicht als Textfarbe taugen. Die Werte haben wir zusätzlich mit dem WebAIM Contrast Checker überprüft.

### Prompt: Wie trennen wir primitive und semantische Tokens so, dass ein späterer Dark Mode ohne Strukturbruch möglich ist, und wie verbinden wir das mit Tailwind?
**Übernommen:** Aufbau von `tokens/tokens.css` (Primitive in `:root`, semantische Tokens in `@theme`, kommentierte Vorlage für ein weiteres Theme), Entfernen der Tailwind-Standardwerte
**Verstanden:** Komponenten dürfen nur semantische Tokens kennen. Ein Theme-Wechsel überschreibt dann nur die Zuordnungen und nicht die Komponenten. Tailwind v4 liest seine Konfiguration direkt aus CSS-Variablen.

### Prompt: Welche Optionen gibt es für die Komponenten- und Ordnerstruktur unseres Projektes? Was ist der Unterschied zwischen Headless und nicht-headless, und wann lohnt es sich?
**Übernommen:** Optionen-Abwägung (flach, konsequent headless, Schichten mit Composables) und Headless-Prüfung im Architektur-ADR

**Verstanden:** Headless lohnt sich, wenn dieselbe Logik in mehreren Darstellungen gebraucht wird („Zu Mein Programm hinzufügen“). Bei nur einer Darstellung (Filterleiste) reicht ein einfaches Composable.

### Prompt: Wie benennen wir Komponenten so, dass „Programmübersicht“ und „Mein Programm“ nicht verwechselt werden, und wie setzt Nuxt Komponentennamen zusammen?
**Übernommen:** Präfixe `Sessions…` und `MyProgram…`, Umbenennung zu `MyProgramToggle`, Registrierung von `components/features/` als eigenes Verzeichnis in der `nuxt.config.ts`

**Verstanden:** Nuxt bildet Komponentennamen aus dem Ordnerpfad. Eindeutige Begriffe in Code und Oberfläche verhindern Missverständnisse im Team.

### Prompt: Sollen wir Nuxt oder Vue + Vite + vue-router verwenden? Welche Kriterien sind für die Größe unseres Projektes wirklich relevant?
**Übernommen:** Kriterien (Routing-Bedarf, Team-Erfahrung, spätere Anforderungen, Konfigurationsaufwand) und Optionen-Vergleich im Technologie-ADR, Tooling-Tabelle

**Verstanden:** Auch bei wenig Daten können mehrere Seitentypen und spätere Anforderungen (Rendering, PWA) für ein Meta-Framework sprechen. Ehrliche Nachteile der gewählten Option gehören ebenfalls ins ADR.

### Prompt: Wie modellieren wir den geteilten Datensatz und den persönlichen Zustand „Mein Programm“? Sollen wir IDs oder ganze Objekte im localStorage speichern?
**Übernommen:** Konzept mit `useConferenceData()` und `useMyProgram()`, Speicherung nur der Session-IDs, Rehydration über ein Client-Plugin, Sequenzdiagramm

**Verstanden:** Nur IDs zu speichern vermeidet doppelte Daten und hält „Mein Programm“ aktuell, wenn sich eine Session ändert. Filterzustand (URL) und persönlicher Zustand (`localStorage`) sollten getrennt bleiben.

### Prompt: Wie richten wir Nuxt 4 mit einem `src/`-Ordner statt `app/` ein und binden Tailwind und unsere Design Tokens ein?
**Übernommen:** `srcDir: 'src/'`, Ordnerstruktur nach dem Architektur-ADR, `main.css` mit Tailwind und Token-Import, Platzhalter-Layout und -Seiten als Funktionsnachweis

**Verstanden:** Unterschied zwischen den Aliassen `~` (Quellordner) und `~~` (Projekt-Root), und warum die `conference-data.json` bewusst außerhalb von `src/` liegt

### Prompt: Wie richten wir ESLint für Nuxt ein, und was gehört in eine Setup-Anleitung?
**Übernommen:** `@nuxt/eslint` mit Lint-Skripten, README mit Voraussetzungen, Befehlen und Projektstruktur

**Verstanden:** Die benötigte Node-Version ergibt sich aus der installierten Nuxt-Version. Ein gemeinsamer Linter sorgt bei zwei Personen für einen einheitlichen Code-Stil.
