# FrontendNow – Team ClubMates

Verena Hochmayer • Luca Steuernagel
<br>Repository: https://github.com/VerenaHochmayer/03c_FrontendNow


Konferenzseite für die fiktive zweitägige Web-Frontend-Konferenz **FrontendNow**.
Im Mittelpunkt stehen Übersichtlichkeit und ein persönlicher Timetable („Mein
Programm“), der auch offline verfügbar ist.

Umgesetzt mit Nuxt 4, TypeScript und Tailwind CSS v4. Die Daten kommen aus der
statischen Datei `data/conference-data.json`, ein Backend gibt es nicht.

## Voraussetzungen

- [Node.js](https://nodejs.org/) 22.22 / 24.15 oder neuer (von Nuxt 4.6 vorausgesetzt)
- npm (wird mit Node.js installiert)

## Setup

Abhängigkeiten installieren:

```bash
npm install
```

Dabei führt `postinstall` automatisch `nuxt prepare` aus und erzeugt die Typen in `.nuxt/`.

## Starten

Entwicklungsserver auf [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## Weitere Befehle

| Befehl | Zweck |
|---|---|
| `npm run generate` | Statische Seite erzeugen (Ausgabe in `.output/public`) |
| `npm run build` | Produktions-Build erstellen |
| `npm run preview` | Produktions-Build lokal ansehen |
| `npm run lint` | Code mit ESLint prüfen |
| `npm run lint:fix` | ESLint-Probleme automatisch beheben, soweit möglich |

## Projektstruktur

```
src/                        # Quellcode 
├── assets/styles/main.css  # Tailwind + Einbindung der Design Tokens
├── components/
│   ├── base/               # generische Bausteine (BaseTag …)
│   ├── layout/             # Seitengerüst (LayoutHeader, LayoutNavigation …)
│   └── features/           # sessions/, speakers/, my-program/
├── composables/            # Logik, z. B. useConferenceData()
├── layouts/                # default.vue
├── pages/                  # Routen
├── public/                 # statische Dateien
└── types/                  # TypeScript-Typen zum Datenschema
tokens/tokens.css           # Design Tokens (primitiv + semantisch)
data/conference-data.json   # Konferenzdaten (schreibgeschützt)
docs/schritt1/              # Branding, ADRs, State-Management-Konzept
```

Komponenten werden von Nuxt automatisch importiert. Der Name ergibt sich aus dem
Ordner, z. B. `components/base/Tag.vue` → `<BaseTag>` und
`components/features/sessions/Card.vue` → `<SessionsCard>`.

## Dokumentation

- [A. Branding & Design Tokens](docs/schritt1/01-branding-design-tokens.md)
- [B. Architektur-ADR: Komponenten- & Ordnerstruktur](docs/schritt1/02-architektur-adr.md)
- [C. State-Management-Konzept](docs/schritt1/03-state-management-konzept.md)
- [D. Technologie-ADR: Projekt-Setup](docs/schritt1/04-technologie-adr.md)
