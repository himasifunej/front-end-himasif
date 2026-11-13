<template>
  <div
    ref="root"
    class="fixed inset-0 z-50 bg-black/85 flex items-stretch sm:items-center justify-center"
    role="dialog"
    aria-modal="true"
    :aria-label="`Calon nomor ${candidate.order}, ${candidate.name}`"
    @click.self="onBackdrop"
  >
    <div
      class="intro-panel w-full h-full sm:h-auto sm:max-h-[92vh] sm:w-[560px] lg:w-[960px] overflow-y-auto lg:overflow-hidden bg-bg-primary-dark sm:bg-card-primary-dark sm:border sm:border-border-primary-dark sm:rounded-lg text-text-primary-dark flex flex-col lg:flex-row"
    >
      <!-- Panggung (media perkenalan) -->
      <div class="p-4 sm:p-6 lg:pr-0 flex flex-col gap-3 lg:w-[432px] lg:shrink-0">
        <div class="flex items-center gap-2 lg:hidden">
          <div class="flex-1 h-[3px] rounded bg-white/15 overflow-hidden" aria-hidden="true">
            <i ref="progA" class="block h-full w-full bg-div-mediatek origin-left" style="transform: scaleX(0)"></i>
          </div>
          <button type="button" class="intro-icon" :title="'Putar ulang perkenalan'" aria-label="Putar ulang perkenalan" @click="replay">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
          </button>
          <button ref="skipA" type="button" class="intro-skip" :aria-label="skipLabel" @click="onSkip">{{ done ? "Tutup" : "Lewati" }}</button>
        </div>

        <div ref="stage" class="intro-stage relative overflow-hidden bg-black rounded-lg w-full h-[440px] sm:h-[420px] lg:h-[640px]">
          <video
            v-if="full"
            ref="vid"
            class="intro-media"
            style="opacity: 0"
            :src="videoSrc"
            muted
            playsinline
            preload="auto"
            aria-hidden="true"
            @playing="onPlaying"
            @error="onVideoError"
          ></video>
          <template v-if="full">
            <img
              v-for="(f, i) in frames"
              :key="f"
              :ref="(el) => (frameEls[i] = el)"
              class="intro-media"
              style="opacity: 0"
              :src="f"
              alt=""
              aria-hidden="true"
              decoding="async"
            />
          </template>
          <div ref="dim" class="absolute inset-0 bg-black pointer-events-none" style="opacity: 0"></div>
          <img ref="official" class="intro-media" style="opacity: 0" :src="photo" :alt="`Foto resmi ${candidate.name}`" @error="onImageError" />
          <div class="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
          <div ref="flash" class="absolute inset-0 bg-white pointer-events-none" style="opacity: 0"></div>
          <svg ref="num" class="intro-num" viewBox="0 0 100 130" aria-hidden="true">
            <text ref="numText" x="50" y="112" text-anchor="middle">{{ candidate.order }}</text>
          </svg>
          <p v-if="waiting" class="absolute left-3 bottom-3 text-xs text-white/70" aria-hidden="true">Memuat video…</p>
        </div>

        <!-- Nama + aksi (HP & tablet). Selalu terlihat & bisa dipakai selama perkenalan berjalan. -->
        <div class="lg:hidden">
          <p class="text-xs tracking-[0.2em] text-div-mediatek font-semibold uppercase">Calon nomor {{ candidate.order }}</p>
          <h2 class="text-title-4-sm leading-8 font-semibold uppercase break-words">{{ candidate.name }}</h2>
          <p v-if="candidate.year_of_study" class="text-sm text-text-secondary-dark">Sistem Informasi {{ yy }}</p>
        </div>
        <div class="lg:hidden">
          <button v-if="canPick" ref="pickA" type="button" class="intro-pick" @click="pick">Pilih calon ini</button>
          <p v-else class="text-sm text-text-secondary-dark">{{ pickHint }}</p>
        </div>
      </div>

      <!-- Kolom kanan (desktop) / bawah (HP & tablet): visi & misi dalam modal yang sama -->
      <div class="p-4 pt-0 sm:p-6 sm:pt-0 lg:p-8 flex flex-col gap-4 lg:flex-1 lg:min-w-0 lg:max-h-[92vh]">
        <div class="hidden lg:flex items-center gap-2">
          <div class="flex-1 h-[3px] rounded bg-white/15 overflow-hidden" aria-hidden="true">
            <i ref="progB" class="block h-full w-full bg-div-mediatek origin-left" style="transform: scaleX(0)"></i>
          </div>
          <button type="button" class="intro-icon" title="Putar ulang perkenalan" aria-label="Putar ulang perkenalan" @click="replay">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
          </button>
          <button ref="skipB" type="button" class="intro-skip" :aria-label="skipLabel" @click="onSkip">{{ done ? "Tutup" : "Lewati" }}</button>
        </div>
        <div class="hidden lg:block">
          <p class="text-xs tracking-[0.2em] text-div-mediatek font-semibold uppercase">Calon Ketua Umum · nomor {{ candidate.order }}</p>
          <h2 class="mt-1 text-title-3-sm leading-[44px] font-semibold uppercase break-words">{{ candidate.name }}</h2>
          <p v-if="candidate.year_of_study" class="text-deskripsi text-text-secondary-dark">Sistem Informasi {{ yy }}</p>
        </div>

        <section ref="visiMisi" class="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-2 space-y-5 border-t border-border-primary-dark pt-4" aria-label="Visi dan misi" tabindex="-1">
          <div>
            <h3 class="text-title-4 mb-2">Visi</h3>
            <div class="text-sm md:text-base text-text-secondary-dark intro-rich" v-html="candidate.visi"></div>
          </div>
          <div>
            <h3 class="text-title-4 mb-2">Misi</h3>
            <div class="text-sm md:text-base text-text-secondary-dark intro-rich" v-html="candidate.misi"></div>
          </div>
        </section>

        <div class="hidden lg:flex flex-col gap-2">
          <button v-if="canPick" ref="pickB" type="button" class="intro-pick" @click="pick">Pilih calon ini</button>
          <p v-else class="text-sm text-text-secondary-dark">{{ pickHint }}</p>
          <p class="text-xs text-text-secondary-dark">
            <template v-if="canPick">Enter: pilih calon ini · 1–{{ count }}: pilih calon lain · </template>Esc: {{ done ? "tutup" : "lewati" }}
          </p>
        </div>
      </div>
    </div>
    <p class="sr-only" aria-live="polite">{{ done ? `Calon nomor ${candidate.order}, ${candidate.name}.` : "" }}</p>
  </div>
</template>

<script setup>
/*
 * Perkenalan + detail calon dalam SATU modal (desain canvas enowX 349454e4e4f1, revisi owner 13 Nov).
 * Timeline dari API (election.intro.timeline), sama untuk semua calon.
 *  full   : video 6 dtk → angka nomor urut → burst 6 frame (kilatan berjarak 600 ms) → angka ke pojok → foto resmi
 *  simple : tanpa media (atau pemilihan tanpa media lengkap): angka + fade foto resmi
 *  reduced: prefers-reduced-motion / tombol "Kurangi animasi": tanpa video, burst, kilatan; foto resmi langsung
 *
 * Kelancaran: selama segmen video, jam timeline = video.currentTime (video yang memimpin, bukan sebaliknya);
 * video tidak diberi transform/filter; gaya hanya ditulis bila nilainya berubah. Bila video belum berputar
 * dalam 2,5 dtk (jaringan lambat), segmen video dilewati: langsung angka → burst → foto resmi (burst tetap di akhir).
 * Tombol pilih dan visi-misi tidak ikut animasi: selalu terlihat dan bisa dipakai.
 */
const props = defineProps({
  candidate: { type: Object, required: true },
  intro: { type: Object, default: null }, // election.intro
  photo: { type: String, default: "" },
  videoSrc: { type: String, default: "" },
  reduced: { type: Boolean, default: false },
  startDone: { type: Boolean, default: false }, // sudah pernah diputar (atau dibuka lewat "Lihat visi & misi")
  focusVisi: { type: Boolean, default: false },
  canPick: { type: Boolean, default: false },
  pickHint: { type: String, default: "" },
  count: { type: Number, default: 3 },
});
const emit = defineEmits(["close", "pick", "played", "number"]);

const DEFAULT_T = {
  video_end: 6000, dim: [4600, 5600], number_draw: [4700, 5600], number_fill: [5500, 5950], burst_start: 6000, burst_step: 200,
  flashes: [6000, 6600, 7200], flash_ms: 120, flash_max_opacity: 0.6, freeze: 7200, number_to_corner: [7300, 7800],
  photo_fade: [7450, 7850], plate: [7650, 8000], controls: [7900, 8300], end: 8400, reduced_fade_ms: 200,
};
const DEFAULT_S = { number_draw: [0, 400], number_fill: [300, 500], number_to_corner: [600, 900], photo_fade: [500, 900], plate: [700, 1000], controls: [900, 1200], end: 1200 };
const VIDEO_WAIT_MS = 2500;
const T = computed(() => ({ ...DEFAULT_T, ...(props.intro?.timeline || {}) }));
const S = computed(() => ({ ...DEFAULT_S, ...(props.intro?.simple_timeline || {}) }));
const frames = computed(() => props.candidate.intro?.frames || []);
const full = computed(() => !props.reduced && props.intro?.mode === "full" && !!props.candidate.intro?.video_url && frames.value.length > 0);
const yy = computed(() => String(props.candidate.year_of_study || "").slice(-2));

const root = ref(null), stage = ref(null), vid = ref(null), dim = ref(null), official = ref(null), flash = ref(null);
const num = ref(null), numText = ref(null), progA = ref(null), progB = ref(null), visiMisi = ref(null);
const skipA = ref(null), skipB = ref(null), pickA = ref(null), pickB = ref(null);
const frameEls = [];
const done = ref(false);
const waiting = ref(false);
const skipLabel = computed(() => (done.value ? "Tutup, kembali ke surat suara" : "Lewati perkenalan"));

const cl = (x) => Math.max(0, Math.min(1, x));
const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
const eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const span = (t, a) => (t - a[0]) / (a[1] - a[0]);
const onImageError = (e) => (e.target.src = "/img/logo/himasif-white.png");
const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

// tulis gaya hanya bila berubah (hemat kerja main thread selama video berputar)
function put(el, prop, val) {
  if (!el) return;
  const c = el.__iv || (el.__iv = {});
  if (c[prop] === val) return;
  c[prop] = val;
  el.style[prop] = val;
}
const r3 = (x) => Math.round(x * 1000) / 1000;

function doneMs() {
  return props.reduced ? 0 : (full.value ? T.value : S.value).photo_fade[1];
}
function endMs() {
  return props.reduced ? 0 : full.value ? T.value.end : S.value.end;
}

function render(t) {
  const st = stage.value;
  if (!st) return;
  const Tl = T.value, TL = full.value ? Tl : S.value, red = props.reduced, isFull = full.value;
  const W = st.clientWidth, H = st.clientHeight;

  // nomor urut: digambar → terisi → (burst: garis luar) → mengecil ke pojok kanan atas
  const draw = red ? 1 : eio(span(t, TL.number_draw));
  const m = red ? 1 : eio(span(t, TL.number_to_corner));
  let fill = red ? 1 : eo(span(t, TL.number_fill));
  if (isFull && t >= Tl.burst_start) fill = t < Tl.number_to_corner[0] ? 0 : m;
  const nw = W * 0.56, nh = nw * 1.3, ts = 0.24;
  const x = W / 2 + (W - 16 - (nw * ts) / 2 - W / 2) * m;
  const y = H * 0.44 + (16 + (nh * ts) / 2 - H * 0.44) * m;
  let sc = 1 - (1 - ts) * m;
  if (isFull && t >= Tl.burst_start && t < Tl.freeze) sc *= 1.05 - 0.05 * eo(((t - Tl.burst_start) % Tl.burst_step) / Tl.burst_step);
  put(num.value, "width", Math.round(nw) + "px");
  put(num.value, "opacity", red || t >= TL.number_draw[0] ? "1" : "0");
  put(num.value, "transform", `translate(${Math.round(x - nw / 2)}px,${Math.round(y - nh / 2)}px) scale(${r3(sc)})`);
  put(numText.value, "strokeDashoffset", String(Math.round(600 * (1 - draw))));
  put(numText.value, "fillOpacity", String(r3(fill)));

  if (isFull) {
    put(vid.value, "opacity", t < Tl.video_end && phase === "video" ? "1" : "0");
    put(dim.value, "opacity", String(r3(t < Tl.burst_start ? 0.55 * eo(span(t, Tl.dim)) : 0.25 * (1 - eo((t - Tl.number_to_corner[0]) / 400)))));
    // burst HANYA setelah video
    const idx = t < Tl.burst_start ? -1 : Math.min(frameEls.length - 1, Math.floor((t - Tl.burst_start) / Tl.burst_step));
    const local = t < Tl.freeze ? ((t - Tl.burst_start) % Tl.burst_step) / Tl.burst_step : 1;
    frameEls.forEach((f, i) => {
      put(f, "opacity", i === idx ? "1" : "0");
      put(f, "transform", i === idx && t >= Tl.burst_start && t < Tl.freeze ? `scale(${r3(1.06 - 0.06 * eo(local))})` : "none");
    });
    let fl = 0;
    for (const a of Tl.flashes) {
      const k = (t - a) / Tl.flash_ms;
      if (k >= 0 && k < 1) fl = Math.max(fl, Tl.flash_max_opacity * (1 - k));
    }
    put(flash.value, "opacity", String(r3(fl)));
  }
  put(official.value, "opacity", String(r3(red ? 1 : eio(span(t, TL.photo_fade)))));
  const p = red ? 1 : cl(t / Math.max(1, doneMs()));
  for (const b of [progA.value, progB.value]) put(b, "transform", `scaleX(${r3(p)})`);
  if (t >= doneMs() && !done.value) finish();
}

// ---- jam timeline: menunggu video → jam = video.currentTime → jam dinding setelah video
let raf = 0, phase = "idle", base = 0, waitStart = 0;
function clock(now) {
  const Tl = T.value;
  if (phase === "waiting") {
    if (now - waitStart > VIDEO_WAIT_MS) {
      // video belum siap: lewati segmen video (langsung angka), burst tetap di akhir
      phase = "post";
      waiting.value = false;
      vid.value?.pause();
      base = now - Tl.dim[0];
    } else {
      return 0;
    }
  }
  if (phase === "video") {
    const v = vid.value;
    const t = v ? v.currentTime * 1000 : Tl.video_end;
    if (!v || v.ended || t >= Tl.video_end - 20) {
      phase = "post";
      base = now - Math.min(t, Tl.video_end);
      v?.pause();
      return now - base;
    }
    base = now - t; // tetap selaras bila video tersendat
    return t;
  }
  return now - base;
}
function loop(now) {
  const t = clock(now);
  render(t);
  if (phase !== "done" && t < endMs()) raf = requestAnimationFrame(loop);
}
function onPlaying() {
  if (phase === "waiting") {
    phase = "video";
    waiting.value = false;
  }
}
function onVideoError() {
  if (phase === "waiting" || phase === "video") {
    phase = "post";
    waiting.value = false;
    base = performance.now() - T.value.dim[0];
  }
}

function focusSkip() {
  (isDesktop() ? skipB.value : skipA.value)?.focus();
}
function pickButton() {
  return isDesktop() ? pickB.value : pickA.value;
}

function finish() {
  done.value = true;
  emit("played", props.candidate.id);
  const a = document.activeElement;
  if (!a || a === skipA.value || a === skipB.value || a === document.body) nextTick(() => (pickButton() || (isDesktop() ? skipB.value : skipA.value))?.focus());
}

function play() {
  cancelAnimationFrame(raf);
  done.value = false;
  if (props.reduced) {
    render(0);
    finish();
    return;
  }
  if (full.value && vid.value) {
    const v = vid.value;
    phase = "waiting";
    waiting.value = true;
    waitStart = performance.now();
    try { v.currentTime = 0; } catch (e) {}
    const pr = v.play();
    if (pr && pr.catch) pr.catch(() => onVideoError());
  } else {
    phase = "post";
    base = performance.now();
  }
  render(0);
  raf = requestAnimationFrame(loop);
}

function skip() {
  cancelAnimationFrame(raf);
  vid.value?.pause();
  phase = "done";
  waiting.value = false;
  render(endMs() + 1);
  if (!done.value) finish();
}
function replay() {
  play();
  nextTick(focusSkip);
}
function pick() {
  vid.value?.pause();
  emit("pick", props.candidate);
}
function onSkip() {
  if (done.value) emit("close");
  else skip();
}
function onBackdrop() {
  if (done.value) emit("close");
}
function onKey(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    onSkip();
    return;
  }
  if (/^[1-9]$/.test(e.key) && !e.altKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    emit("number", Number(e.key));
    return;
  }
  if (e.key === "Enter" && props.canPick) {
    const a = document.activeElement;
    // Enter di tombol lain (Lewati/Putar ulang) tetap menjalankan tombol itu
    if (!a || a.tagName !== "BUTTON" || a === pickA.value || a === pickB.value) {
      e.preventDefault();
      pick();
    }
    return;
  }
  if (e.key === "Tab") {
    const f = [...root.value.querySelectorAll("button")].filter((b) => b.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKey);
  document.documentElement.style.overflow = "hidden";
  if (props.startDone) {
    skip();
    nextTick(() => {
      if (props.focusVisi && visiMisi.value) {
        visiMisi.value.scrollIntoView({ block: "start" });
        visiMisi.value.focus({ preventScroll: true });
      } else {
        (pickButton() || (isDesktop() ? skipB.value : skipA.value))?.focus();
      }
    });
  } else {
    play();
    nextTick(focusSkip);
  }
});
onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener("keydown", onKey);
  document.documentElement.style.overflow = "";
  vid.value?.pause();
});
</script>

<style scoped>
/* panggung = lapisan compositor sendiri: video tidak ikut digambar ulang saat panel (kontainer scroll
   bersudut) berubah, sehingga pemutaran tetap di fps asli di semua ukuran */
.intro-stage {
  will-change: transform;
  transform: translateZ(0);
  contain: paint;
}
.intro-stage :deep(.intro-media) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 25%;
}
.intro-num {
  position: absolute;
  left: 0;
  top: 0;
  height: auto;
  opacity: 0;
  pointer-events: none;
  overflow: visible;
  transform-origin: 50% 50%;
  will-change: transform;
}
.intro-num text {
  font: 700 120px/1 Poppins, system-ui, sans-serif;
  fill: #ff6d00;
  fill-opacity: 0;
  stroke: #ff6d00;
  stroke-width: 3;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  paint-order: stroke;
}
.intro-skip {
  min-height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid #494949;
  background: #1a1a1a;
  color: #fff;
  font-size: 14px;
  flex-shrink: 0;
}
.intro-skip:hover,
.intro-icon:hover {
  background: #242424;
}
.intro-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #494949;
  background: #1a1a1a;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.intro-pick {
  min-height: 44px;
  width: 100%;
  border-radius: 8px;
  background: #ff6d00;
  color: #000;
  font-weight: 600;
  font-size: 15px;
}
.intro-pick:hover {
  background: #ff7e1d;
}
.intro-panel button:focus-visible,
.intro-panel section:focus-visible {
  outline: 2px solid #ff6d00;
  outline-offset: 2px;
}
.intro-rich :deep(ol) {
  list-style: decimal;
  padding-left: 1.25rem;
}
.intro-rich :deep(ul) {
  list-style: disc;
  padding-left: 1.25rem;
}
.intro-rich :deep(p + p),
.intro-rich :deep(li + li) {
  margin-top: 0.35rem;
}
</style>
