/**
 * Lapisan data voting: satu tempat yang menerjemahkan respons BE ke bentuk
 * yang dipakai halaman /app/vote. Kalau kontrak BE voting v2 berubah, cukup
 * sesuaikan file ini (endpoint + normalisasi), bukan halamannya.
 */

export type VotePhase = "unpublished" | "upcoming" | "open" | "closed" | "announced";

export interface VoteCandidate {
  id: number;
  name: string;
  order?: number;
  year_of_study?: number | string;
  visi?: string;
  misi?: string;
  image?: { url?: string }[] | string | null;
}

export interface VoteState {
  phase: VotePhase;
  startAt: Date | null;
  endAt: Date | null;
  winner: VoteCandidate | null;
}

export const VOTING_ENDPOINTS = {
  setting: "/vote_setting",
  candidates: "/voting_candidate",
  status: "/vote-status",
  vote: "/vote",
  // {{Assumption}} sampai docs/handoff/voting-api-v2.md di repo BE tersedia.
  magicLogin: "/voting/magic-login",
} as const;

export const HIMASIF_INSTAGRAM = "https://www.instagram.com/himasif/";

/**
 * Jam di CMS diisi dalam WIB tanpa zona waktu ("2026-12-12T19:30:00").
 * Parse eksplisit sebagai +07:00 supaya SSR (Vercel = UTC) dan browser di
 * zona lain menghasilkan waktu yang sama.
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

const KNOWN_PHASES: VotePhase[] = ["unpublished", "upcoming", "open", "closed", "announced"];

/** Respons vote setting (v1 sekarang, v2 nanti) → VoteState. */
export function normalizeVoteSetting(raw: any, now: Date = new Date()): VoteState {
  const r = raw?.result ?? raw ?? {};
  const startAt = parseWib(r.start_at);
  const endAt = parseWib(r.end_at);
  const winner = (r.winner ?? r.elected ?? null) as VoteCandidate | null;

  // v2: BE boleh mengirim status eksplisit.
  const explicit = String(r.status ?? r.phase ?? "").toLowerCase() as VotePhase;
  let phase: VotePhase;
  if (KNOWN_PHASES.includes(explicit)) {
    phase = explicit;
  } else if (Number(r.is_published) === 0) {
    phase = "unpublished";
  } else if (winner || r.is_announced == 1 || r.announced_at) {
    phase = "announced";
  } else if (startAt && now < startAt) {
    phase = "upcoming";
  } else if (endAt && now >= endAt) {
    phase = "closed";
  } else {
    phase = "open";
  }
  if (phase === "announced" && !winner) phase = "closed";

  return { phase, startAt, endAt, winner };
}

export function candidateImage(c: VoteCandidate | null | undefined): string {
  const img = c?.image;
  if (typeof img === "string" && img) return img;
  if (Array.isArray(img) && img[0]?.url) return img[0].url as string;
  return "/img/logo/himasif-white.png";
}

/** Bukti memilih tersimpan di cookie supaya tetap tampil setelah reload. */
export function useVoteReceipt() {
  const votedAt = useCookie<string | null>("voted-at", {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
  const isVote = useCookie<string | boolean | null>("is-vote");
  const hasVoted = computed(() => isVote.value === true || isVote.value === "true");
  /** Tandai sudah memilih. `at` = waktu dari BE (kalau ada), selain itu jam sekarang. */
  function record(at?: unknown) {
    const d = parseWib(at) ?? new Date();
    votedAt.value = d.toISOString();
    isVote.value = "true";
  }
  /** Sudah memilih tapi waktunya tidak diketahui (mis. memilih di perangkat lain). */
  function markVoted(at?: unknown) {
    const d = parseWib(at);
    if (d) votedAt.value = d.toISOString();
    isVote.value = "true";
  }
  return {
    hasVoted,
    votedAt: computed(() => (votedAt.value ? new Date(votedAt.value) : null)),
    record,
    markVoted,
  };
}
