// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  // PRIVAT (hanya server). Jangan pindahkan ke `public`: key akan ikut bundle JS.
  // Di Vercel: NUXT_BE_API_KEY (wajib), NUXT_BE_API_BASE (opsional, menimpa
  // API_BASE_URL saat runtime), NUXT_BE_PROXY_SECRET (opsional, lihat docs/api-proxy.md).
  runtimeConfig: {
    beApiKey: "",
    beApiBase: process.env.API_BASE_URL || "https://v2.himasif.id/api",
    beProxySecret: "",
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