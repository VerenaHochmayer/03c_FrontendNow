// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'src/app',
  serverDir: 'src/server',
  dir: {
    public: 'src/public',
    modules: 'src/modules',
    shared: 'src/shared',
  }
})
