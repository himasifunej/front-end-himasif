<template>
  <div
    ref="root"
    class="fixed inset-0 z-50 bg-black/90 flex items-stretch sm:items-center justify-center"
    role="dialog"
    aria-modal="true"
    :aria-label="`Perkenalan calon nomor ${candidate.order}, ${candidate.name}`"
    @click.self="onBackdrop"
  >
    <div
      class="intro-panel w-full h-full sm:h-auto sm:w-[480px] lg:w-[880px] bg-[#0b0b0b] sm:bg-[#161616] sm:border sm:border-white/10 sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-8 text-white"
    >
      <!-- bar atas (HP & tablet): progres + Lewati/Tutup -->
      <div class="flex items-center gap-3 lg:hidden">
        <div class="flex-1 h-[3px] rounded bg-white/15 overflow-hidden" aria-hidden="true">
          <i ref="progA" class="block h-full w-full bg-[#FF6D00] origin-left" style="transform: scaleX(0)"></i>
        </div>
        <button ref="skipA" type="button" class="intro-skip" :aria-label="skipLabel" @click="onSkip">{{ done ? "Tutup" : "Lewati" }}</button>
      </div>

      <!-- panggung -->
      <div ref="stage" class="intro-stage relative overflow-hidden bg-black rounded-2xl w-full flex-1 min-h-0 sm:flex-none sm:h-[560px] lg:w-[384px] lg:h-[640px] lg:shrink-0">
        <video
          v-if="full"
          ref="vid"
          class="intro-media opacity-0"
          :src="videoSrc"
          muted
          playsinline
          preload="auto"
          aria-hidden="true"
          @playing="videoPlaying = true"
          @waiting="videoPlaying = false"
          @error="videoFailed = true"
        ></video>
        <template v-if="full">
          <img v-for="(f, i) in frames" :key="f" :ref="(el) => (frameEls[i] = el)" class="intro-media opacity-0" :src="f" alt="" aria-hidden="true" />
        </template>
        <div ref="dim" class="absolute inset-0 bg-black opacity-0 pointer-events-none"></div>
        <img ref="official" class="intro-media opacity-0" :src="photo" :alt="`Foto resmi ${candidate.name}`" @error="onImageError" />
        <div class="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/85 to-transparent pointer-events-none"></div>
        <div ref="flash" class="absolute inset-0 bg-white opacity-0 pointer-events-none"></div>
        <svg ref="num" class="intro-num" viewBox="0 0 100 130" aria-hidden="true">
          <text ref="numText" x="50" y="112" text-anchor="middle">{{ candidate.order }}</text>
        </svg>
        <div ref="plate" class="absolute left-4 right-4 bottom-4 opacity-0 lg:hidden">
          <p class="text-xs tracking-[0.2em] text-[#FF6D00] font-semibold uppercase">Calon nomor {{ candidate.order }}</p>
          <h2 class="text-[22px] leading-7 font-bold uppercase break-words">{{ candidate.name }}</h2>
          <p v-if="candidate.year_of_study" class="text-xs text-white/70">Sistem Informasi {{ yy }}</p>
        </div>
      </div>

      <!-- kolom kanan (desktop) / tombol (HP & tablet) -->
      <div class="flex flex-col gap-3 lg:gap-6 lg:flex-1 lg:min-w-0">
        <div class="hidden lg:flex items-center gap-3">
          <div class="flex-1 h-[3px] rounded bg-white/15 overflow-hidden" aria-hidden="true">
            <i ref="progB" class="block h-full w-full bg-[#FF6D00] origin-left" style="transform: scaleX(0)"></i>
          </div>
          <button ref="skipB" type="button" class="intro-skip" :aria-label="skipLabel" @click="onSkip">{{ done ? "Tutup" : "Lewati" }}</button>
        </div>
        <div class="hidden lg:block">
          <p class="text-xs tracking-[0.2em] text-[#FF6D00] font-semibold uppercase">Calon Ketua Umum · nomor {{ candidate.order }}</p>
          <h2 class="mt-2 text-[32px] leading-10 font-bold uppercase break-words">{{ candidate.name }}</h2>
          <p v-if="candidate.year_of_study" class="mt-1 text-white/70">Sistem Informasi {{ yy }}</p>
        </div>
        <div class="hidden lg:block lg:flex-1"></div>
        <div ref="ctl" class="flex flex-col gap-2 opacity-0">
          <button v-if="canPick" ref="pickBtn" type="button" class="intro-btn bg-[#FF6D00] hover:bg-[#FF7E1D] text-black" @click="$emit('pick', candidate)">
            Pilih calon ini
          </button>
          <p v-else class="text-sm text-white/70 text-center">{{ pickHint }}</p>
          <button type="button" class="intro-btn border border-white/30 hover:bg-white/10" @click="$emit('detail', candidate)">Lihat visi &amp; misi</button>
          <button type="button" class="min-h-[44px] text-sm text-white/70 underline underline-offset-4" @click="replay">Putar ulang perkenalan</button>
        </div>
        <p class="hidden lg:block text-xs text-white/55">Esc: {{ done ? "tutup" : "lewati" }}<template v-if="canPick"> · Enter di tombol: pilih calon ini</template></p>
      </div>
    </div>
    <p class="sr-only" aria-live="polite">{{ done ? `Calon nomor ${candidate.order}, ${candidate.name}.` : "" }}</p>
  </div>
</template>

<script setup>
/*
 * Perkenalan calon (entrance) — desain canvas enowX 349454e4e4f1. Timeline dari API (election.intro.timeline),
 * sama untuk semua calon. Logika yang sama dipakai pratinjau CMS (BE public/cms/js/intro-player.js).
 *  full   : video 6 dtk → angka nomor urut → burst 6 frame (kilatan berjarak 600 ms) → angka ke pojok → foto resmi
 *  simple : tanpa media (atau pemilihan tanpa media lengkap): angka + fade foto resmi
 *  reduced: prefers-reduced-motion / "Kurangi animasi": tanpa video, burst, kilatan; foto resmi fade 200 ms
 */
const props = defineProps({
  candidate: { type: Object, required: true },
  intro: { type: Object, default: null }, // election.intro
  photo: { type: String, default: "" },
  videoSrc: { type: String, default: "" }, // blob URL hasil preload, atau URL asli
  reduced: { type: Boolean, default: false },
  startDone: { type: Boolean, default: false }, // sudah pernah diputar: langsung keadaan akhir
  canPick: { type: Boolean, default: false },
  pickHint: { type: String, default: "" },
});
const emit = defineEmits(["close", "pick", "detail", "played"]);

const DEFAULT_T = {
  video_end: 6000, dim: [4600, 5600], number_draw: [4700, 5600], number_fill: [5500, 5950], burst_start: 6000, burst_step: 200,
  flashes: [6000, 6600, 7200], flash_ms: 120, flash_max_opacity: 0.6, freeze: 7200, number_to_corner: [7300, 7800],
  photo_fade: [7450, 7850], plate: [7650, 8000], controls: [7900, 8300], end: 8400, reduced_fade_ms: 200,
};
const DEFAULT_S = { number_draw: [0, 400], number_fill: [300, 500], number_to_corner: [600, 900], photo_fade: [500, 900], plate: [700, 1000], controls: [900, 1200], end: 1200 };
const T = computed(() => ({ ...DEFAULT_T, ...(props.intro?.timeline || {}) }));
const S = computed(() => ({ ...DEFAULT_S, ...(props.intro?.simple_timeline || {}) }));
const frames = computed(() => props.candidate.intro?.frames || []);
const full = computed(() => !props.reduced && props.intro?.mode === "full" && !!props.candidate.intro?.video_url && frames.value.length > 0);
const yy = computed(() => String(props.candidate.year_of_study || "").slice(-2));

const root = ref(null), stage = ref(null), vid = ref(null), dim = ref(null), official = ref(null), flash = ref(null);
const num = ref(null), numText = ref(null), plate = ref(null), ctl = ref(null), progA = ref(null), progB = ref(null);
const skipA = ref(null), skipB = ref(null), pickBtn = ref(null);
const frameEls = [];
const done = ref(false);
const videoPlaying = ref(false); // video benar-benar berputar (bukan masih memuat)
const videoFailed = ref(false);
const skipLabel = computed(() => (done.value ? "Tutup perkenalan, kembali ke surat suara" : "Lewati perkenalan"));

const cl = (x) => Math.max(0, Math.min(1, x));
const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
const eio = (x) => { x = cl(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const span = (t, a) => (t - a[0]) / (a[1] - a[0]);
const onImageError = (e) => (e.target.src = "/img/logo/himasif-white.png");

function endMs() {
  return props.reduced ? T.value.reduced_fade_ms : full.value ? T.value.end : S.value.end;
}
function doneMs() {
  return props.reduced ? T.value.reduced_fade_ms : (full.value ? T.value : S.value).photo_fade[1];
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
  num.value.style.width = nw + "px";
  num.value.style.opacity = red || t >= TL.number_draw[0] ? 1 : 0;
  num.value.style.left = x + "px";
  num.value.style.top = y + "px";
  num.value.style.transform = `translate(-50%,-50%) scale(${sc})`;
  numText.value.style.strokeDashoffset = String(600 * (1 - draw));
  numText.value.style.fillOpacity = String(fill);

  if (isFull) {
    const vOn = t < Tl.video_end;
    const v = vid.value;
    // video baru tampil setelah benar-benar berputar; selama memuat (jaringan lambat) atau gagal, segmen video memakai frame
    const useVideo = vOn && videoPlaying.value && !videoFailed.value;
    if (v) {
      v.style.opacity = useVideo ? 1 : 0;
      v.style.transform = `scale(${1.06 - 0.06 * cl(t / Tl.video_end)})`;
      if (!vOn && !v.paused) v.pause();
    }
    dim.value.style.opacity = t < Tl.burst_start ? 0.55 * eo(span(t, Tl.dim)) : 0.25 * (1 - eo((t - Tl.number_to_corner[0]) / 400));
    let idx = t < Tl.burst_start ? -1 : Math.min(frameEls.length - 1, Math.floor((t - Tl.burst_start) / Tl.burst_step));
    // video belum siap / gagal: segmen video memakai 3 frame pelan (perlakuan sama untuk calon mana pun)
    if (vOn && !useVideo) idx = Math.min(frameEls.length - 1, Math.floor(t / (Tl.video_end / 3)));
    const local = t < Tl.freeze ? ((t - Tl.burst_start) % Tl.burst_step) / Tl.burst_step : 1;
    frameEls.forEach((f, i) => {
      if (!f) return;
      f.style.opacity = i === idx ? 1 : 0;
      f.style.transform = i === idx && t >= Tl.burst_start && t < Tl.freeze ? `scale(${1.06 - 0.06 * eo(local)})` : "scale(1)";
    });
    let fl = 0;
    for (const a of Tl.flashes) {
      const k = (t - a) / Tl.flash_ms;
      if (k >= 0 && k < 1) fl = Math.max(fl, Tl.flash_max_opacity * (1 - k));
    }
    flash.value.style.opacity = String(fl);
  }
  official.value.style.opacity = red ? cl(t / Tl.reduced_fade_ms) : eio(span(t, TL.photo_fade));
  const pp = red ? 1 : eo(span(t, TL.plate));
  plate.value.style.opacity = pp;
  plate.value.style.transform = `translateY(${12 * (1 - pp)}px)`;
  const p = cl(t / doneMs());
  for (const b of [progA.value, progB.value]) if (b) b.style.transform = `scaleX(${p})`;
  const cc = red ? 1 : eo(span(t, TL.controls));
  ctl.value.style.opacity = cc;
  ctl.value.style.transform = `translateY(${8 * (1 - cc)}px)`;
  if (t >= doneMs() && !done.value) finish();
}

let raf = 0, t0 = 0;
function loop(now) {
  const t = now - t0;
  render(t);
  if (t < endMs()) raf = requestAnimationFrame(loop);
}

function focusSkip() {
  const b = window.matchMedia("(min-width: 1024px)").matches ? skipB.value : skipA.value;
  b?.focus();
}

function finish() {
  done.value = true;
  emit("played", props.candidate.id);
  // fokus pindah dari Lewati ke "Pilih calon ini"
  const a = document.activeElement;
  if (!a || a === skipA.value || a === skipB.value || a === document.body) nextTick(() => (pickBtn.value || skipA.value)?.focus());
}

function play() {
  cancelAnimationFrame(raf);
  done.value = false;
  videoFailed.value = false;
  videoPlaying.value = false;
  const v = vid.value;
  if (v && full.value) {
    try { v.currentTime = 0; } catch (e) {}
    const pr = v.play();
    if (pr && pr.catch) pr.catch(() => (videoFailed.value = true));
  }
  t0 = performance.now();
  raf = requestAnimationFrame(loop);
}

function skip() {
  cancelAnimationFrame(raf);
  vid.value?.pause();
  render(endMs() + 1);
  if (!done.value) finish();
}

function replay() {
  play();
  nextTick(focusSkip);
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
  }
  if (e.key === "Tab") {
    // jebakan fokus sederhana di dalam dialog
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
    nextTick(() => (pickBtn.value || skipA.value)?.focus());
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
  left: 50%;
  top: 44%;
  height: auto;
  opacity: 0;
  pointer-events: none;
  overflow: visible;
  transform-origin: 50% 50%;
}
.intro-num text {
  font: 800 120px/1 Poppins, system-ui, sans-serif;
  fill: #ff6d00;
  fill-opacity: 0;
  stroke: #ff6d00;
  stroke-width: 3;
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  paint-order: stroke;
}
.intro-skip {
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
.intro-btn {
  min-height: 44px;
  width: 100%;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.15s;
}
.intro-panel button:focus-visible {
  outline: 2px solid #ff6d00;
  outline-offset: 2px;
}
</style>
