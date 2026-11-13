/*
 * Satu elemen <video> per calon, dipakai ulang setiap kartu calon itu aktif lagi (panah, ←/→, geser, buka ulang).
 * Data yang sudah di-buffer/didekode tetap ada di elemen → kembali ke kartu tidak mengunduh ulang dan
 * langsung mulai dari frame 0 tanpa tersendat. (Storage BE tanpa CORS, jadi video tidak bisa dijadikan blob.)
 * Hanya ±3 calon, jadi tiga elemen video kecil di memori.
 */
const pool = new Map(); // calonId -> { el, src }

/** Elemen video untuk calon ini (dibuat sekali; preload penuh, bisu, inline). */
export function introVideoEl(key, src) {
  if (!import.meta.client || !src) return null;
  let e = pool.get(key);
  if (!e || e.src !== src) {
    const el = document.createElement("video");
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("aria-hidden", "true");
    el.preload = "auto";
    el.className = "intro-vid";
    el.style.opacity = "0";
    el.src = src;
    e = { el, src };
    pool.set(key, e);
  }
  return e.el;
}

/** Siapkan video + frame burst calon tetangga supaya pindah kartu langsung jalan. */
export function warmIntro(candidate) {
  const src = candidate?.intro?.video_url;
  if (!import.meta.client || !src) return;
  introVideoEl(candidate.id, src);
  for (const f of candidate.intro?.frames || []) {
    const i = new Image();
    i.decoding = "async";
    i.src = f;
  }
}

/** Kartu ditinggalkan: hentikan dan kembalikan ke frame 0; lepas dari DOM setelah animasi geser selesai. */
export function releaseIntroVideo(el, slot) {
  if (!el) return;
  try {
    el.pause();
    el.currentTime = 0;
  } catch (e) {}
  setTimeout(() => {
    if (slot && el.parentNode === slot) slot.removeChild(el);
  }, 400);
}

/** Untuk tes/diagnosa. */
export function introVideoPoolSize() {
  return pool.size;
}
