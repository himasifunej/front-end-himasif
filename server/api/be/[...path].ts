/**
 * Proxy browser -> BE Laravel.
 *
 * Browser memanggil /api/be/<path> di domain FE. Server Nuxt meneruskan ke
 * `${beApiBase}/<path>` dengan header x-api-key dari runtimeConfig PRIVAT
 * (NUXT_BE_API_KEY), jadi key tidak pernah masuk bundle JS publik.
 *
 * - Hanya path + method di ALLOWLIST yang diteruskan (lainnya 404).
 * - Authorization (Bearer token pemilih) diteruskan apa adanya.
 * - IP asli pengunjung dikirim lewat X-Forwarded-For supaya rate limit BE
 *   tetap per IP. BE baru memercayainya bila TrustProxies menerima proxy ini
 *   (lihat docs/api-proxy.md).
 */
import type { H3Event } from "h3";

type Rule = { methods: string[]; pattern: RegExp };

const SEG = "[A-Za-z0-9_-]{1,100}";

// Daftar rute yang memang dipakai FE (grep useAPI di pages/, components/, stores/).
const ALLOWLIST: Rule[] = [
  // Konten publik (GET, boleh /{id})
  {
    methods: ["GET"],
    pattern: new RegExp(
      `^(banner|division|work_program|years_of_management|year_has_work_program|setting|pengurus|dokumen|vote_setting|voting_candidate|product_categories|product|blog_category|blog)(/${SEG})?$`
    ),
  },
  // NIM checker (BE mewajibkan kata kunci >= 3 karakter)
  { methods: ["GET"], pattern: /^nimchecker$/ },
  // Baca paste / resolve link pendek
  { methods: ["GET"], pattern: new RegExp(`^(paste|shorten)/${SEG}$`) },
  // Tulis-data publik (BE: throttle public-write per IP)
  { methods: ["POST"], pattern: /^(paste|shorten|criticism_n_suggestion)$/ },
  // Pemilih
  { methods: ["POST"], pattern: /^login$/ },
  { methods: ["POST"], pattern: /^vote$/ },
  { methods: ["GET"], pattern: /^(vote-status|logout)$/ },
];

const MAX_BODY_BYTES = 2 * 1024 * 1024;

function isAllowed(method: string, path: string): boolean {
  return ALLOWLIST.some(
    (r) => r.methods.includes(method) && r.pattern.test(path)
  );
}

/** IP pengunjung. Di Vercel, x-real-ip / x-forwarded-for diisi ulang oleh edge Vercel. */
function clientIp(event: H3Event): string | undefined {
  const real = getRequestHeader(event, "x-real-ip")?.trim();
  if (real) return real;
  const xff = getRequestHeader(event, "x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  if (first) return first;
  return event.node.req.socket?.remoteAddress || undefined;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const method = event.method.toUpperCase();
  const path = String(getRouterParam(event, "path") || "").replace(/^\/+|\/+$/g, "");

  if (!isAllowed(method, path)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  if (!config.beApiKey) {
    console.error("[api/be] NUXT_BE_API_KEY belum di-set");
    throw createError({ statusCode: 503, statusMessage: "API belum dikonfigurasi" });
  }

  const base = String(config.beApiBase).replace(/\/+$/, "");
  const search = getRequestURL(event).search;
  const target = `${base}/${path}${search}`;

  const headers: Record<string, string> = {
    accept: "application/json",
    "x-api-key": String(config.beApiKey),
  };
  const auth = getRequestHeader(event, "authorization");
  if (auth) headers.authorization = auth;
  const contentType = getRequestHeader(event, "content-type");
  if (contentType) headers["content-type"] = contentType;
  const ip = clientIp(event);
  if (ip) headers["x-forwarded-for"] = ip;
  if (config.beProxySecret) headers["x-himasif-proxy"] = String(config.beProxySecret);

  let body: Buffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const len = Number(getRequestHeader(event, "content-length") || 0);
    if (len > MAX_BODY_BYTES) {
      throw createError({ statusCode: 413, statusMessage: "Payload Too Large" });
    }
    body = (await readRawBody(event, false)) || undefined;
    if (body && body.length > MAX_BODY_BYTES) {
      throw createError({ statusCode: 413, statusMessage: "Payload Too Large" });
    }
  }

  return sendProxy(event, target, {
    headers,
    fetchOptions: { method, body, redirect: "manual" },
  });
});
