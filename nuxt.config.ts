// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@vite-pwa/nuxt'],
  // PWA: Manifest + Service Worker (Caching-Konzept: docs/schritt3/01-caching-strategie.md)
  pwa: {
    // autoUpdate, weil wir automatisch updaten wollen, sobald wieder Internet da ist.
    // Konzept B, Abschnitt 2: So werden gecachte Seiten nach einem neuen Build ersetzt
    // (Folge aus dem Rendering-ADR: „refresh HTML when possible“).
    registerType: 'autoUpdate',
    manifest: {
      "name": 'FrontendNow',
      "short_name": 'FrontendNow',
      "description": 'Zwei Tage Web-Frontend, ohne Buzzword-Bingo',
      "lang": 'de',
      "start_url": '/mein-programm',
      "display": 'standalone',
      "background_color": '#f5f0f6',
      "theme_color": '#222222',
      "icons": [
        {src: '/Logo_512x512.png', sizes: '512x512', type: 'image/png'},
        {src: '/Logo_192x192.png', sizes: '192x192', type: 'image/png'}
      ]
    },
    // Im Dev-Modus aus: Der Dev-Service-Worker cacht nur die Startseite und verfälscht
    // Offline-Tests. Getestet wird mit dem Build (npm run generate + npx serve .output/public).
    devOptions: {
      enabled: false,
    },
    workbox: {
      // Konzept B, Abschnitt 1 + 2: Cache-First per Precache. Beim Installieren des
      // Service Workers werden App-Shell (JS, CSS inkl. Tokens), Icons und alle
      // vorgerenderten Seiten (Programm, Infokarten, Speaker) vorab gespeichert.
      // Die _payload.json-Dateien (Seitendaten) ergänzt das Modul automatisch.
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],

      // Konzept B, Abschnitt 3: Jede Seite muss offline starten, auch die start_url
      // /mein-programm. Findet der Service Worker keine passende Seite im Precache,
      // liefert er die App-Hülle aus (Nuxt erzeugt sie als 200.html, im Precache heißt
      // sie „200“). Die App rendert dann im Browser die richtige Seite, die Daten
      // stecken im Bundle.
      navigateFallback: '/200',

      // Filter stehen in der URL (?day=…), wirken aber nur im Browser (Rendering-ADR).
      // Diese Parameter werden beim Abgleich mit dem Precache ignoriert, damit gefilterte
      // Links offline die vorgerenderte Seite bekommen statt der leeren App-Hülle.
      // Die ersten beiden Einträge sind die Standardwerte von Workbox, die dritte Zeile
      // enthält die FILTER_KEYS aus useSessionFilter.ts.
      ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/,
        /^(day|time|room|track|level|speaker)$/,
      ],

      // Caches alter Versionen nach einem Update löschen
      cleanupOutdatedCaches: true,

      runtimeCaching: [
        // Konzept B, Fonts: Das Google-Fonts-CSS ist klein und kann sich ändern
        // → sofort aus dem Cache, im Hintergrund aktualisieren
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        // Konzept B, Fonts: Schriftdateien ändern sich nie
        // → Cache-First, ohne sie fiele die App offline auf Systemschriften zurück
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Jahr
            },
          },
        },
      ]
    }
  },

  // Quellordner src/ statt app/ (Vorgabe, siehe Technologie-ADR)
  srcDir: 'src/',
  serverDir: 'src/server',
  dir: {
    public: 'src/public',
    modules: 'src/modules',
    shared: 'src/shared',
  },

  // Rendering-Strategie pro Route (siehe docs/schritt2/01-rendering-strategie-adr.md)
  routeRules: {
    '/': { prerender: true },
    '/sessions': { prerender: true }, // SSG, Filter wirken im Browser
    '/sessions/**': { prerender: true }, // SSG, ISR als Ausbaupfad
    '/speakers/**': { prerender: true }, // SSG
    '/mein-programm': { ssr: false }, // CSR, Daten nur im localStorage
  },
  // Ladehinweis für CSR-Seiten statt eines leeren Zustands (siehe Rendering-ADR)
  spaLoadingTemplate: 'spa-loading-template.html',

  // Design Tokens + Tailwind (siehe tokens/tokens.css)
  css: ['~/assets/styles/main.css'],

  // Komponenten-Schichten (siehe Architektur-ADR):
  // features/ wird zuerst registriert, damit der Ordner "features" nicht im Namen landet:
  //   features/sessions/Card.vue → <SessionsCard>
  //   base/Button.vue           → <BaseButton>
  components: [
    { path: '~/components/features' },
    { path: '~/components' },
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'FrontendNow',
      meta: [
        { name: 'description', content: 'Zwei Tage Web-Frontend, ohne Buzzword-Bingo' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap',
          // CORS-Anfrage: Der Service Worker bekommt eine lesbare Antwort (Status 200)
          // statt einer undurchsichtigen (Status 0) und kann sie zuverlässig cachen.
          crossorigin: '',
        },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
