/**
 * Lapisan data voting v2 (kontrak: himasif-id-v2-be docs/handoff/voting-api-v2.md).
 * Semua panggilan lewat proxy /api/be (x-api-key ditambahkan di server).
 */

export type VotePhase = "none" | "upcoming" | "open" | "closed" | "announced";

export interface Candidate {
  id: number;
  order?: number;
  name: string;
  year_of_study?: number | string;
  visi?: string;
  misi?: string;
  photo_url?: string | null;
}

export interface Winner {
  name: string;
  photo_url?: string | null;
  year_of_study?: number | string;
}

export interface Election {
  id: number;
  name: string;
  round: number;
  phase: Exclude<VotePhase, "none">;
  start_at: string;
  end_at: string;
  server_time: string;
  voter_years?: number[];
  candidates: Candidate[];
  result: { announced_at?: string; winner: Winner } | null;
}

export interface Voter {
  name: string;
  nim: string;
  year?: number;
  election: { id: number; eligible: boolean; has_voted: boolean; reason: string | null } | null;
}

export interface Receipt {
  receipt_code: string;
  recorded_at: string;
}

export const VOTING_API = {
  current: "/v2/elections/current",
  election: (id: number) => `/v2/elections/${id}`,
  result: (id: number) => `/v2/elections/${id}/result`,
  magicLink: "/v2/auth/magic-link",
  login: "/v2/auth/login",
  logout: "/v2/auth/logout",
  me: "/v2/me",
  confirm: (id: number) => `/v2/elections/${id}/confirm`,
  vote: (id: number) => `/v2/elections/${id}/vote`,
  receipt: (id: number) => `/v2/elections/${id}/receipt`,
} as const;

export const HIMASIF_INSTAGRAM = "https://www.instagram.com/himasif/";

export const REASON_TEXT: Record<string, string> = {
  not_in_roster: "NIM kamu tidak ada di daftar pemilih resmi. Hubungi panitia bila ini keliru.",
  year_out_of_range: "Angkatanmu tidak termasuk pemilih pada pemilihan ini.",
  account_inactive: "Akunmu tidak aktif. Hubungi panitia.",
  election_not_open: "Pemungutan suara belum dibuka.",
  election_closed: "Pemungutan suara sudah ditutup.",
  already_voted: "Kamu sudah memilih.",
};

/**
 * Waktu BE v2 sudah ber-offset (+07:00). Untuk jaga-jaga, waktu tanpa zona
 * dibaca sebagai WIB (bukan zona server/HP) supaya SSR di Vercel (UTC) sama.
 */
export function parseWib(value: unknown): Date | null {
  if (!value) return null;
  let s = String(value).trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += "T00:00:00";
  if (!/(Z|[+-]\d{2}:?\d{2})$/i.test(s)) s += "+07:00";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatWib(d: Date | null, withDay = true): string {
  if (!d) return "-";
  const date = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    ...(withDay ? { weekday: "long" } : {}),
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(d)
    .replace(":", ".");
  return `${date} pukul ${time} WIB`;
}

/** Galat API v2 → bentuk seragam. FE memutuskan dari `code`, bukan teks. */
export interface ApiErr {
  status: number;
  code: string;
  message: string;
  body: any;
  retryAfter: number | null;
}

export function apiError(e: any): ApiErr {
  const status = Number(e?.status ?? e?.statusCode ?? e?.response?.status ?? 0);
  const body = e?.data ?? null;
  const err = body?.error ?? {};
  const ra = Number(e?.response?.headers?.get?.("retry-after") ?? err.retry_after);
  const retryAfter = Number.isFinite(ra) && ra > 0 ? ra : null;
  let message: string = err.message || body?.message || "";
  if (status === 429) {
    message = `Terlalu banyak percobaan, coba lagi dalam ${retryAfter ?? 60} detik.`;
  } else if (!message) {
    message = status ? "Terjadi kesalahan. Coba lagi." : "Koneksi terputus. Periksa internetmu lalu coba lagi.";
  }
  return { status, code: err.code || (status === 429 ? "too_many_attempts" : ""), message, body: err, retryAfter };
}

/**
 * Periode kepengurusan untuk pengumuman. API v2 belum mengirim field periode
 * ({{Assumption}}): pakai result.period bila ada, lalu "2026–2027"/"2026/2027" di nama
 * pemilihan, lalu tahun di nama/start_at → "Y–(Y+1)".
 */
export function electionPeriod(e: { name?: string; start_at?: string; result?: any } | null | undefined): string {
  const explicit = e?.result?.period;
  if (typeof explicit === "string" && explicit.trim()) return explicit.trim().replace(/\s*[-/]\s*/, "–");
  const name = String(e?.name ?? "");
  const range = name.match(/(20\d{2})\s*[–\-/]\s*(20\d{2})/);
  if (range) return `${range[1]}–${range[2]}`;
  const y = Number(name.match(/20\d{2}/)?.[0] ?? parseWib(e?.start_at)?.getUTCFullYear() ?? NaN);
  return Number.isFinite(y) ? `${y}–${y + 1}` : "";
}

export function candidatePhoto(c: { photo_url?: string | null } | null | undefined): string {
  return c?.photo_url || "/img/logo/himasif-white.png";
}

/** Selisih jam server − jam perangkat (ms), supaya hitung mundur tidak ikut jam HP yang salah. */
export function clockOffset(serverTime: unknown, receivedAt = Date.now()): number {
  const d = parseWib(serverTime);
  return d ? d.getTime() - receivedAt : 0;
}

/** Pemilih boleh mengetik NIM atau email UNEJ. */
export function loginBody(id: string, password: string) {
  const v = String(id || "").trim();
  return /^\d{8,20}$/.test(v) ? { nim: v, password } : { email: v, password };
}

/** Header Bearer dari cookie sesi pemilih. */
export function voterAuthHeader(): Record<string, string> {
  const t = useCookie("token").value;
  return t ? { Authorization: `Bearer ${t}` } : {};
}


/**
 * Pengaman tombol final "Kirim pilihan" (insiden 13 Nov: ketukan ganda / Enter kedua mengirim suara tanpa niat).
 * - Semua klik dalam `minMs` sejak dialog terbuka diabaikan.
 * - Klik mouse/sentuh (event.detail > 0) hanya sah bila pointerdown-nya terjadi di tombol ini SETELAH jeda
 *   (ketukan kedua dari ketukan ganda, atau klik yang dimulai sebelum dialog muncul, ditolak).
 * - Klik dari keyboard (detail 0) hanya sah bila ada keydown Enter/Spasi BARU (bukan auto-repeat) di tombol ini
 *   setelah jeda; Enter yang ditahan/terbawa dari tombol sebelumnya ditolak. Pintasan global tidak pernah mengirim.
 */
export function createConfirmGuard(minMs = 500) {
  let openedAt = Number.NEGATIVE_INFINITY;
  let pointerArmed = false;
  let keyArmed: string | null = null;
  return {
    open(now: number) {
      openedAt = now;
      pointerArmed = false;
      keyArmed = null;
    },
    ready(now: number) {
      return now - openedAt >= minMs;
    },
    pointerDown(now: number) {
      pointerArmed = now - openedAt >= minMs;
    },
    keyDown(e: { key: string; repeat?: boolean }, now: number) {
      keyArmed = !e.repeat && (e.key === "Enter" || e.key === " ") && now - openedAt >= minMs ? e.key : null;
    },
    allowClick(e: { detail?: number }, now: number) {
      if (now - openedAt < minMs) return false;
      if ((e.detail ?? 0) > 0) return pointerArmed;
      return keyArmed !== null;
    },
  };
}
