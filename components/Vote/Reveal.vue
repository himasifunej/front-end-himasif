<template>
  <div>
    <!-- ADEGAN 1–2: tombol bergaris tipis dengan kilau (opsi C) -->
    <button type="button" class="rv-trigger group" :disabled="open" @click="start">
      <span class="rv-cbtn">
        <i aria-hidden="true"></i>
        Buka pengumuman
      </span>
    </button>
    <audio ref="audio" :src="AUDIO_SRC" preload="auto" playsinline @ended="onEnded"></audio>

    <!-- ADEGAN 3–5: layar penuh -->
    <Teleport to="body">
      <div
        v-if="open"
        ref="root"
        class="rv"
        :class="{ 'rv-rm': reduced, 'rv-leaving': leaving, 'rv-done': done }"
        role="dialog"
        aria-modal="true"
        aria-label="Pengumuman Ketua Umum HIMASIF"
      >
        <!-- layar putih: celah cahaya melebar, lalu tipografi -->
        <div class="rv-white">
          <div class="rv-light" aria-hidden="true"></div>
          <span class="rv-big rv-b1">KETUA UMUM</span>
          <span class="rv-big rv-b2">HIMASIF</span>
          <div class="rv-ln" aria-hidden="true"></div>
          <div class="rv-yr">{{ period }}</div>
          <div class="rv-bars" aria-hidden="true"><i class="rv-bar1"></i><i class="rv-bar2"></i><i class="rv-bar3"></i></div>
        </div>
        <!-- iris ke hitam, tepat di klimaks -->
        <div class="rv-iris" aria-hidden="true"></div>

        <!-- reveal: foto + nama, ditahan sampai Lanjut -->
        <div class="rv-rev" aria-live="polite">
          <div class="rv-pf">
            <img :src="photo" :alt="`Foto ${winner.name}`" @error="onImgError" />
          </div>
          <div class="rv-txt">
            <p class="rv-who">Ketua Umum HIMASIF</p>
            <h2 class="rv-nm">{{ winner.name }}</h2>
            <div class="rv-rule" aria-hidden="true"></div>
            <p class="rv-per">Periode {{ period }}</p>
            <button type="button" class="rv-next" :tabindex="done ? 0 : -1" @click="next">
              Lanjut ke beranda
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <!-- kontrol -->
        <div class="rv-ctl" :class="{ 'rv-ctl-dark': !onBlack }">
          <button type="button" :aria-label="muted ? 'Nyalakan suara' : 'Bisukan'" :title="muted ? 'Nyalakan suara' : 'Bisukan'" @click="toggleMute">
            <svg v-if="!muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="m16 9 5 6M21 9l-5 6" />
            </svg>
          </button>
          <button type="button" aria-label="Ulangi" title="Ulangi" @click="replay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
            </svg>
            <span class="rv-lbl">Ulangi</span>
          </button>
          <button v-if="!done" type="button" @click="skip"><span>Lewati</span></button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
// Opsi C "sinematik minimal" (canvas 43c0d3086c59), disinkronkan ke musik:
// setiap frame membaca audio.currentTime (requestAnimationFrame), bukan setTimeout.
import TL from "~/assets/vote/reveal-timeline.json";

const props = defineProps({
  winner: { type: Object, required: true },
  period: { type: String, default: "" },
});

const AUDIO_SRC = "/audio/reveal-opener.mp3";
const C = TL.cues;
const SKIP_TO = C.next.at - 0.3; // langsung ke hit terakhir: foto + nama sudah tampil
const DONE_AT = C.next.at;

const audio = ref(null);
const root = ref(null);
const open = ref(false);
const leaving = ref(false);
const done = ref(false);
const onBlack = ref(false);
const muted = ref(false);
const reduced = ref(false);

const photo = computed(() => candidatePhoto(props.winner));
const onImgError = (e) => (e.target.src = "/img/logo/himasif-white.png");

// Jam animasi: audio bila diputar; jam cadangan bila audio gagal dimuat/diputar.
let raf = 0;
let useFallback = false;
let t0 = 0;
let fallbackTimer = 0;

function now() {
  const a = audio.value;
  if (!useFallback && a) return a.ended ? TL.duration : a.currentTime;
  return (performance.now() - t0) / 1000;
}

const clamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const inOut = (p) => (p < 0.5 ? 8 * p ** 4 : 1 - 8 * (1 - p) ** 4); // ≈ cubic-bezier(.7,0,.2,1)
const out = (p) => 1 - (1 - p) ** 3;
// cubic-bezier(x1,y1,x2,y2) seperti CSS (Newton + bisection), untuk naiknya layar putih.
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (u) => ((ax * u + bx) * u + cx) * u;
  const Y = (u) => ((ay * u + by) * u + cy) * u;
  const dX = (u) => (3 * ax * u + 2 * bx) * u + cx;
  return (x) => {
    let u = x;
    for (let i = 0; i < 6; i++) {
      const e = X(u) - x;
      const d = dX(u);
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    if (u < 0 || u > 1 || Math.abs(X(u) - x) > 1e-4) {
      let lo = 0, hi = 1;
      u = x;
      for (let i = 0; i < 30; i++) {
        if (X(u) < x) lo = u;
        else hi = u;
        u = (lo + hi) / 2;
      }
    }
    return Y(u);
  };
}
const soft = bezier(0.2, 0, 0, 1);
const prog = (cue, t, ease = inOut) => ease(clamp((t - cue.at) / cue.dur));

function render() {
  const t = now();
  const el = root.value;
  if (el) {
    const v = {
      veil: prog(C.veil, t, out),
      rise: prog(C.rise, t, soft),
      light: prog(C.light, t, (p) => p),
      kIn: prog(C.ketuaIn, t),
      kOut: prog(C.ketuaOut, t),
      kPush: clamp((t - C.ketuaIn.at) / (C.ketuaOut.at - C.ketuaIn.at)),
      hIn: prog(C.himasifIn, t),
      hOut: prog(C.himasifOut, t),
      line: prog(C.line, t),
      year: prog(C.year, t, out),
      bar1: prog(C.bang1, t, out),
      bar2: prog(C.bang2, t, out),
      bar3: prog(C.bang3, t, out),
      iris: prog(C.iris, t),
      photo: prog(C.photo, t, out),
      kb: clamp((t - C.photo.at) / 8),
      name: prog(C.name, t),
      rule: prog(C.rule, t),
      meta: prog(C.meta, t, out),
      next: prog(C.next, t, out),
    };
    for (const k in v) el.style.setProperty(`--${k}`, v[k].toFixed(4));
    onBlack.value = t >= C.iris.at + C.iris.dur * 0.5;
    if (!done.value && t >= DONE_AT) done.value = true;
  }
  raf = requestAnimationFrame(render);
}

function lockScroll(on) {
  document.documentElement.style.overflow = on ? "hidden" : "";
}

async function playFrom(sec) {
  const a = audio.value;
  done.value = sec >= DONE_AT;
  useFallback = false;
  clearTimeout(fallbackTimer);
  if (!a) {
    useFallback = true;
    t0 = performance.now() - sec * 1000;
    return;
  }
  a.muted = muted.value;
  a.volume = 1;
  try {
    a.currentTime = sec;
  } catch {}
  // Audio lambat/terblokir: setelah 1,5 dtk jalan dengan jam cadangan supaya animasi tidak macet.
  fallbackTimer = setTimeout(() => {
    if (a.paused) {
      useFallback = true;
      t0 = performance.now() - sec * 1000;
    }
  }, 1500);
  try {
    await a.play();
  } catch {
    useFallback = true;
    t0 = performance.now() - sec * 1000;
  }
}

async function start() {
  // Dipanggil dari klik: browser mengizinkan audio diputar.
  open.value = true;
  leaving.value = false;
  lockScroll(true);
  await nextTick();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(render);
  playFrom(0);
  window.addEventListener("keydown", onKey);
}

function replay() {
  playFrom(0);
}

function skip() {
  playFrom(SKIP_TO);
}

function toggleMute() {
  muted.value = !muted.value;
  if (audio.value) audio.value.muted = muted.value;
}

function onEnded() {
  // Tahan adegan terakhir sampai Lanjut diklik.
  if (!useFallback) {
    useFallback = true;
    t0 = performance.now() - TL.duration * 1000;
  }
}

function fadeAudio(ms) {
  const a = audio.value;
  if (!a || a.paused) return;
  const v0 = a.volume;
  const s = performance.now();
  const step = () => {
    const p = clamp((performance.now() - s) / ms);
    a.volume = v0 * (1 - p);
    if (p < 1) requestAnimationFrame(step);
    else a.pause();
  };
  requestAnimationFrame(step);
}

async function next() {
  leaving.value = true;
  fadeAudio(800);
  setTimeout(async () => {
    close();
    useToast().info(`Ketua Umum HIMASIF ${props.period}`, props.winner.name);
    await navigateTo("/");
  }, 850);
}

function close() {
  cancelAnimationFrame(raf);
  clearTimeout(fallbackTimer);
  audio.value?.pause();
  open.value = false;
  lockScroll(false);
  window.removeEventListener("keydown", onKey);
}

function onKey(e) {
  if (e.key === "Escape") {
    if (done.value) next();
    else skip();
  }
}

let mq;
const onMq = () => (reduced.value = !!mq?.matches);
onMounted(() => {
  mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  onMq();
  mq.addEventListener?.("change", onMq);
});
onBeforeUnmount(() => {
  mq?.removeEventListener?.("change", onMq);
  if (open.value) close();
});

defineExpose({ start });
</script>

<style scoped>
/* ---------- pemicu (adegan 1–2) ---------- */
.rv-trigger {
  background: none;
  border: 0;
  padding: 0;
  color: inherit;
  cursor: pointer;
  border-radius: 999px;
}
.rv-trigger:focus-visible {
  outline: 2px solid #f0a35e;
  outline-offset: 6px;
}
.rv-cbtn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 14px 28px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  transition:
    border-color 0.35s ease,
    background-color 0.35s ease;
}
.rv-cbtn::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;
  left: -60%;
  background: linear-gradient(90deg, transparent, rgba(255, 236, 210, 0.35), transparent);
  animation: rv-sweep 3.6s ease-in-out infinite;
}
.rv-cbtn i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9661a;
  box-shadow: 0 0 0 4px rgba(217, 102, 26, 0.25);
}
.rv-trigger:hover .rv-cbtn,
.rv-trigger:focus-visible .rv-cbtn {
  border-color: #f0a35e;
  background: rgba(217, 102, 26, 0.12);
}
.rv-trigger:hover .rv-cbtn::after {
  animation-duration: 1s;
}
@keyframes rv-sweep {
  0% {
    left: -60%;
  }
  60%,
  100% {
    left: 130%;
  }
}

/* ---------- layar penuh ---------- */
.rv {
  --ink: #0f0f12;
  position: fixed;
  inset: 0;
  z-index: 70;
  /* latar gelap memudar masuk dulu (tidak ada kedip), lalu layar putih naik dari bawah */
  background: rgb(15 15 18 / var(--veil, 0));
  color: #fff;
  overflow: hidden;
  font-family: Poppins, system-ui, sans-serif;
  transition: opacity 0.8s ease;
}
.rv-leaving {
  opacity: 0;
}

.rv-white {
  position: absolute;
  inset: 0;
  background: #fff;
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate3d(0, calc((1 - var(--rise, 0)) * 100%), 0);
  will-change: transform;
}
.rv-light {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30%;
  left: calc(-40% + var(--light, 0) * 180%);
  background: linear-gradient(90deg, transparent, rgba(240, 163, 94, 0.35), transparent);
  opacity: calc(var(--light, 0) * (1 - var(--light, 0)) * 4);
}
.rv-big {
  position: absolute;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  white-space: nowrap;
  font-size: clamp(2.4rem, 11.5vw, 11rem);
}
.rv-b1 {
  clip-path: inset(0 calc((1 - var(--kIn, 0)) * 100%) 0 calc(var(--kOut, 0) * 100%));
  transform: scale(calc(0.96 + var(--kPush, 0) * 0.06));
}
.rv-b2 {
  clip-path: inset(0 calc((1 - var(--hIn, 0)) * 100%) 0 calc(var(--hOut, 0) * 100%));
}
.rv-ln {
  position: absolute;
  top: calc(50% + clamp(1.6rem, 6.5vw, 6.2rem));
  height: 1px;
  width: min(80vw, 720px);
  background: var(--ink);
  transform: scaleX(calc(var(--line, 0) * (1 - var(--hOut, 0))));
}
.rv-yr {
  position: absolute;
  top: calc(50% + clamp(2.4rem, 8.5vw, 7.6rem));
  font-weight: 300;
  font-size: clamp(0.9rem, 2.6vw, 1.6rem);
  letter-spacing: calc(0.3em + var(--year, 0) * 0.2em);
  color: #5a5a62;
  opacity: calc(var(--year, 0) * (1 - var(--hOut, 0)));
}
.rv-bars {
  position: absolute;
  display: flex;
  gap: clamp(18px, 4vw, 52px);
}
.rv-bars i {
  width: clamp(16px, 2.4vw, 34px);
  height: clamp(120px, 22vw, 260px);
  background: #d9661a;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.rv-bars i::after {
  content: "";
  display: block;
  height: 20%;
  background: #fff;
  margin-bottom: 8%;
}
.rv-bar1 {
  clip-path: inset(calc((1 - var(--bar1, 0)) * 100%) 0 0 0);
}
.rv-bar2 {
  clip-path: inset(calc((1 - var(--bar2, 0)) * 100%) 0 0 0);
}
.rv-bar3 {
  clip-path: inset(calc((1 - var(--bar3, 0)) * 100%) 0 0 0);
}
.rv-iris {
  position: absolute;
  inset: 0;
  background: var(--ink);
  clip-path: circle(calc(var(--iris, 0) * 75%) at 50% 50%);
}

/* reveal */
.rv-rev {
  position: absolute;
  inset: 0;
  opacity: var(--photo, 0);
  pointer-events: none;
}
.rv-done .rv-rev {
  pointer-events: auto;
}
.rv-pf {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 46%;
  overflow: hidden;
}
.rv-pf img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(calc(1.08 - var(--kb, 0) * 0.08));
}
.rv-pf::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 55%, var(--ink));
}
.rv-txt {
  position: absolute;
  left: 52%;
  right: clamp(24px, 5vw, 72px);
  top: 50%;
  transform: translateY(-50%);
}
.rv-who {
  color: #f0a35e;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: var(--meta, 0);
}
.rv-nm {
  margin-top: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.02;
  font-size: clamp(2rem, 5.6vw, 5.6rem);
  text-transform: uppercase;
  text-wrap: balance;
  clip-path: inset(-0.1em calc((1 - var(--name, 0)) * 100%) -0.1em 0);
}
.rv-rule {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 24px 0;
  transform-origin: left;
  transform: scaleX(var(--rule, 0));
}
.rv-per {
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.08em;
  opacity: var(--meta, 0);
}
.rv-next {
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: none;
  color: #fff;
  font-weight: 600;
  opacity: var(--next, 0);
  transform: translateY(calc((1 - var(--next, 0)) * 8px));
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}
.rv-next:hover,
.rv-next:focus-visible {
  border-color: #f0a35e;
  background: rgba(217, 102, 26, 0.15);
}
.rv-next svg {
  width: 18px;
  height: 18px;
}

/* kontrol */
.rv-ctl {
  position: absolute;
  top: max(16px, env(safe-area-inset-top));
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 2;
}
.rv-ctl button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  min-width: 40px;
  justify-content: center;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(15, 15, 18, 0.55);
  color: #fff;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
  transition: border-color 0.3s ease;
}
.rv-ctl-dark button {
  border-color: rgba(15, 15, 18, 0.25);
  background: rgba(255, 255, 255, 0.6);
  color: #0f0f12;
}
.rv-ctl button:hover {
  border-color: #f0a35e;
}
.rv-ctl svg {
  width: 18px;
  height: 18px;
}

/* HP: foto di atas, teks di bawah */
@media (max-width: 767px) {
  .rv-pf {
    width: 100%;
    bottom: auto;
    height: 56%;
  }
  .rv-pf::after {
    background: linear-gradient(180deg, transparent 50%, var(--ink));
  }
  .rv-txt {
    left: 24px;
    right: 24px;
    top: auto;
    bottom: max(32px, env(safe-area-inset-bottom));
    transform: none;
    text-align: center;
  }
  .rv-rule {
    transform-origin: center;
  }
  .rv-nm {
    font-size: clamp(1.8rem, 9vw, 3rem);
  }
  .rv-next {
    margin-top: 1.25rem;
  }
  .rv-ctl .rv-lbl {
    display: none;
  }
}

/* Gerak dikurangi: urutan & waktu tetap mengikuti musik, tapi hanya memudar (tanpa wipe/zoom/iris besar). */
.rv-rm .rv-white {
  clip-path: none;
  transform: none;
  opacity: var(--rise, 0);
}
.rv-rm .rv-light {
  display: none;
}
.rv-rm .rv-b1 {
  clip-path: none;
  transform: none;
  opacity: calc(var(--kIn, 0) * (1 - var(--kOut, 0)));
}
.rv-rm .rv-b2 {
  clip-path: none;
  opacity: calc(var(--hIn, 0) * (1 - var(--hOut, 0)));
}
.rv-rm .rv-ln {
  transform: none;
  opacity: calc(var(--line, 0) * (1 - var(--hOut, 0)));
}
.rv-rm .rv-yr {
  letter-spacing: 0.4em;
}
.rv-rm .rv-bar1,
.rv-rm .rv-bar2,
.rv-rm .rv-bar3 {
  clip-path: none;
}
.rv-rm .rv-bar1 {
  opacity: var(--bar1, 0);
}
.rv-rm .rv-bar2 {
  opacity: var(--bar2, 0);
}
.rv-rm .rv-bar3 {
  opacity: var(--bar3, 0);
}
.rv-rm .rv-iris {
  clip-path: none;
  opacity: var(--iris, 0);
}
.rv-rm .rv-pf img {
  transform: none;
}
.rv-rm .rv-nm {
  clip-path: none;
  opacity: var(--name, 0);
}
.rv-rm .rv-rule {
  transform: none;
  opacity: var(--rule, 0);
}
.rv-rm .rv-next {
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .rv-cbtn::after {
    animation: none;
  }
}
</style>
