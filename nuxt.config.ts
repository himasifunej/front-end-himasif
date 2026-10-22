// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  runtimeConfig: {
    public: {
      API_BASE: process.env.API_BASE_URL || "https://v2.himasif.id/api",
    },
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],

  // Halaman baca paste dirender backend Laravel (v2.himasif.id/paste/{hash}).
  // Proxy supaya address bar tetap di himasif.id/paste/{hash}.
  routeRules: {
    "/paste/**": { proxy: "https://v2.himasif.id/paste/**" },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/image",
    "@vueuse/nuxt",
  ],

  plugins: [
    // "~/plugins/countdown"
  ],

  compatibilityDate: "2024-11-02"
});