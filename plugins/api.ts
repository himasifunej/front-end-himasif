// Semua panggilan ke BE lewat proxy server Nuxt (/api/be/...).
// x-api-key ditambahkan di server (server/api/be/[...path].ts) dari
// runtimeConfig privat, jadi tidak ada di bundle JS publik.
export default defineNuxtPlugin(() => {
  // Saat SSR, teruskan IP pengunjung ke proxy supaya rate limit BE tetap per IP.
  const forwarded = import.meta.server
    ? useRequestHeaders(["x-forwarded-for", "x-real-ip"])
    : {};

  const $api = $fetch.create({
    baseURL: "/api/be",
    headers: forwarded,
  });

  return {
    provide: {
      api: $api,
    },
  };
});
