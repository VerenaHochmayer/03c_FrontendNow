# PWA-Setup

**Tooling:** Wir nutzen das Modul `@vite-pwa/nuxt`. Es erzeugt Manifest und Service Worker
(Workbox) direkt aus der `nuxt.config.ts` und schreibt die Precache-Liste beim Build
automatisch, inklusive aller vorgerenderten Seiten und `_payload.json`. Ein manueller
Service Worker müsste diese Liste nach jedem Build von Hand pflegen. Mit
`registerType: 'autoUpdate'` ersetzt ein neuer Build die alte Version beim nächsten
Netzkontakt.

**Manifest:** Name und Kurzname `FrontendNow`, `display: "standalone"`, `lang: "de"`. Die
`start_url` ist `/mein-programm`, weil Besucher\*innen vor Ort vor allem ihren eigenen
Zeitplan öffnen.

**Farben:** `background_color` `#f5f0f6` entspricht `--color-surface`, damit der
Startbildschirm nahtlos in die App übergeht. `theme_color` `#222222` entspricht
`--color-primary`, unserer Textfarbe.

**Icons:** Das ClubMates-Logo auf Violett (`--color-accent-secondary`) in 192 × 192 für den
Startbildschirm und 512 × 512 für Installationsdialog und Splash-Screen.
