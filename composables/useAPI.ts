import type { UseFetchOptions } from "nuxt/app";

// BE (Laravel paginator) mengembalikan URL absolut, mis. next_page_url
// "https://v2.himasif.id/api/nimchecker?page=2". Ubah jadi path relatif
// supaya tetap lewat proxy /api/be (yang menambahkan x-api-key di server).
function toProxyPath(url: string): string {
  if (!/^https?:\/\//i.test(url)) return url;
  try {
    const u = new URL(url);
    const i = u.pathname.indexOf("/api/");
    if (i === -1) return url;
    return u.pathname.slice(i + "/api".length) + u.search;
  } catch {
    return url;
  }
}

export function useAPI<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const resolved =
    typeof url === "function" ? () => toProxyPath(url()) : toProxyPath(url);
  return useFetch(resolved, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
}
