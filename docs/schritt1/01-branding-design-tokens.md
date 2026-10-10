# A. Branding-Konzept & Design-Tokens-Set

## Teamname + Markenkonzept
### ClubMates

**FrontendNow** stellt nicht die Inszenierung in den Mittelpunkt, sondern die 
Besucher\*innen: Statt einer dekorativen Eventseite bieten wir ein klares, 
übersichtliches Werkzeug, mit dem man sich schnell im Programm und bei den 
Speaker*innen zurechtfindet. Was uns von einer generischen Konferenz-Website 
unterscheidet, ist der persönliche Timetable: Talks lassen sich mit wenigen 
Klicks zu einem eigenen Zeitplan zusammenstellen, der auch offline 
verfügbar ist, also genau dann, wenn das Konferenz-WLAN mal wieder streikt. 
Übersichtlichkeit geht bei uns vor übermäßigen Verzierungen, schließlich sollen sich 
die Besucher\*innen schnell orientieren können, um keinen Programmpunkt zu verpassen.


## Design-Tokens-Set:

Die Tokens liegen als CSS Custom Properties in
[`tokens/tokens.css`](../../tokens/tokens.css) und werden über
Tailwind v4 (`@theme`) als Klassen bereitgestellt, z. B. `bg-surface` oder `text-primary`.

### Farbpalette (WCAG-AA-Kontrastprüfung für Text/Hintergrund-Paare)

Die Basis bildet ein ruhiges, helles Mauve (`#F5F0F6`) mit fast schwarzer Schrift
(`#222222`). Die drei kräftigen Farben setzen wir nur gezielt als Akzent und
Highlight ein, damit sie Orientierung geben statt zu dekorieren. Koralle warnt bei
Zeitkonflikten.

Geprüft mit dem WebAIM Contrast Checker. Grenzwerte nach WCAG 2.1 (1.4.3 Contrast
Minimum): **4,5 : 1** für normalen Text, **3 : 1** für großen Text (ab 24 px bzw.
18,5 px fett) und für UI-Elemente (1.4.11).

| Vordergrund              | Hintergrund           | Kontrast        | Ergebnis         | Verwendung                           |
|--------------------------|-----------------------|-----------------|------------------|--------------------------------------|
| `#222222` Schrift        | `#F5F0F6` Hintergrund | 14,15 : 1       | ✅ AA / AAA      | Fließtext, Überschriften             |
| `#222222` Schrift        | `#FFFFFF` Karte       | 15,91 : 1       | ✅ AA / AAA      | Text auf Karten                      |
| `#6B6470` gedämpft       | `#F5F0F6`             | 5,07 : 1        | ✅ AA            | Uhrzeiten, Raum, Metadaten           |
| `#222222`                | `#B6FF56` Lime        | 13,20 : 1       | ✅ AA / AAA      | Text auf Highlight-Fläche            |
| `#222222`                | `#EE6352` Koralle     | 4,96 : 1        | ✅ AA            | Text im Konflikthinweis              |
| `#222222`                | `#907AD6` Violett     | 4,50 : 1        | ✅ AA (knapp)    | Text auf Tags                        |
| `#6C5BA0` Violett dunkel | `#F5F0F6`             | 5,13 : 1        | ✅ AA            | Links, Fokusrahmen                   |
| `#B24A3D` Koralle dunkel | `#F5F0F6`             | 4,74 : 1        | ✅ AA            | Warntext                             |
| `#8C8491` Rahmen         | `#F5F0F6`             | 3,21 : 1        | ✅ UI (3 : 1)    | Rahmen von Formularfeldern           |
| `#B6FF56` Lime           | `#F5F0F6`             | 1,07 : 1        | ❌               | nie als Text, nur als Fläche         |
| `#EE6352` Koralle        | `#F5F0F6`             | 2,85 : 1        | ❌               | nie als Text, nur als Fläche         |
| `#907AD6` Violett        | `#F5F0F6`             | 3,14 : 1        | ⚠️ nur groß / UI | nicht für Fließtext                  |
| `#FFFFFF`                | `#EE6352` / `#907AD6` | 3,21 / 3,53 : 1 | ⚠️ nur groß      | weiße Schrift auf Akzenten vermeiden |

**Konsequenz:** Auf Akzentflächen steht immer `#222222`. Für Text in Akzentfarbe auf
hellem Grund verwenden wir abgedunkelte Varianten (`coral-700`, `violet-700`).

### Spacing-Skala

4-px-Raster, bewusst mit Lücken, damit Abstände einheitlich bleiben:

| Token | `1`  | `2`  | `3`   | `4`   | `6`   | `8`   | `12`  | `16`  |
|-------|------|------|-------|-------|-------|-------|-------|-------|
| Wert  | 4 px | 8 px | 12 px | 16 px | 24 px | 32 px | 48 px | 64 px |

### Typografie-Skala

- **Überschriften:** IBM Plex Mono. Wirkt technisch wie Code und passt zu einer
  Frontend-Konferenz. Die festen Zeichenbreiten eignen sich auch gut für Uhrzeiten
  im Timetable.
- **Fließtext:** IBM Plex Sans. Gehört zur selben Schriftfamilie, ist dadurch
  stimmig zum Mono und gut lesbar.

Basis 16 px, Faktor 1,25 (große Terz):

| Token      | `xs`  | `sm`  | `base` | `lg`  | `xl`  | `2xl` | `3xl` |
|------------|-------|-------|--------|-------|-------|-------|-------|
| Größe      | 12 px | 14 px | 16 px  | 20 px | 25 px | 31 px | 39 px |
| Zeilenhöhe | 1,5   | 1,5   | 1,6    | 1,4   | 1,3   | 1,2   | 1,15  |

## Token-Architektur:

### primitive Tokens

Alle Rohwerte ohne Bedeutung, auch Schriftgrößen, Zeilenhöhen und Abstände, z. B.
`--palette-mauve-50`, `--palette-violet-700`, `--palette-size-16`,
`--palette-space-16`. Sie werden **nie** direkt in Komponenten verwendet.

### semantische Tokens

Beschreiben den Verwendungszweck und verweisen auf Primitive:

| Semantischer Token                     | Primitive (Light)         |
|----------------------------------------|---------------------------|
| `color-surface`                        | `mauve-50`                |
| `color-surface-raised`                 | `white`                   |
| `color-primary` (Text)                 | `ink-900`                 |
| `color-muted` (Text)                   | `mauve-600`               |
| `color-on-accent`                      | `ink-900`                 |
| `color-accent-primary`                 | `lime-400`                |
| `color-accent-secondary`               | `violet-500`              |
| `color-accent-alert`                   | `coral-500`               |
| `color-link`, `color-focus`            | `violet-700`              |
| `color-border` / `color-border-strong` | `mauve-200` / `mauve-400` |
| `font-heading` / `font-body`           | `font-mono` / `font-sans` |

Semantische Tokens enthalten keine Rohwerte, sondern nur Verweise auf Primitive.
Ein späteres Theme (Dark Mode) ist vorbereitet, aber noch nicht umgesetzt: Die
Datei beschreibt in einem Kommentar, dass ein Theme nur die semantischen
Farb-Tokens in einem eigenen Selektor (`.dark`) überschreibt.

## Begründung der Tokens-Architektur

1. **Theming-Erweiterbarkeit:** Komponenten kennen nur semantische Namen wie
   `bg-surface`. Für den Dark Mode werden nur die Zuordnungen in `.dark` geändert,
   ohne dass eine Komponente angepasst werden muss. Ein Beispiel: Lime, Koralle und
   Violett sind auf dunklem Grund direkt als Text lesbar, `color-link` zeigt dann
   einfach auf `violet-500` statt `violet-700`.
2. **Wartbarkeit:** Jeder Farbwert existiert genau einmal als Primitive. Soll ein
   Ton angepasst werden, ändert man eine Zeile, und alle Verwendungen ziehen mit.
3. **Konsistenz:** Weil die Standardwerte von Tailwind entfernt sind
   (`--color-*: initial`), stehen nur unsere Tokens als Klassen zur Verfügung.
   Willkürliche Farben oder Abstände wie `bg-red-500` oder `p-5` sind gar nicht möglich.
4. **Barrierefreiheit:** Die Kontrastregeln stecken in den semantischen Tokens:
   `color-on-accent` ist immer `#222222`, Akzent-Text nutzt immer die geprüften
   dunklen Varianten. Wer die Tokens verwendet, hält WCAG AA automatisch ein.
