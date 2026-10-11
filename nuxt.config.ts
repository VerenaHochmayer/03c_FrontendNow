// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],

  // Quellordner src/ statt app/ (Vorgabe, siehe Technologie-ADR)
  srcDir: 'src/',
  serverDir: 'src/server',
  dir: {
    public: 'src/public',
    modules: 'src/modules',
    shared: 'src/shared',
  },

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
