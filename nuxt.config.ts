// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@vite-pwa/nuxt'],
  // PWA Manifest
  pwa: {
    /* PWA options */
    //autoupdate, weil wir automatisch updaten wollen, sobald wieder Internet da ist.
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
    devOptions: {
      enabled: true
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
