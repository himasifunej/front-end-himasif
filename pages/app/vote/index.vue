<template>
  <div class="bg-[#111111] text-white min-h-screen relative">
    <div class="absolute inset-0 z-0">
      <AppBackgroundHeader background-image="vote.jpeg" />
    </div>

    <div class="relative z-20">
      <AppContentArea class="pt-6 pb-28 px-4 md:px-8 lg:px-12">
        <div class="w-full max-w-5xl mx-auto space-y-6 md:space-y-8">
          <!-- JUDUL -->
          <header class="text-center px-4 py-5 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10">
            <p class="text-xs md:text-sm tracking-[0.2em] text-[#FF6D00] font-semibold">E-VOTING HIMASIF</p>
            <h1 class="mt-2 text-xl md:text-3xl font-bold leading-snug">
              {{ title }}
            </h1>
            <p class="mt-1 text-sm md:text-base text-white/70">
              Himpunan Mahasiswa Sistem Informasi · Universitas Jember
            </p>
            <span v-if="election?.round >= 2" class="inline-block mt-3 px-3 py-1 rounded-full bg-[#FF6D00] text-black text-xs font-bold">
              PUTARAN {{ election.round }}
            </span>
          </header>

          <!-- BELUM ADA / GAGAL MEMUAT -->
          <section v-if="phase === 'none' || loadError" class="rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-6 md:p-10 text-center space-y-4">
            <h2 class="text-xl md:text-2xl font-bold">{{ loadError ? "Data pemilihan gagal dimuat" : "Belum ada pemilihan" }}</h2>
            <p class="text-sm text-white/70">Pantau info terbaru di Instagram <a :href="instagramUrl" target="_blank" rel="noopener" class="underline">@himasif</a>.</p>
            <button v-if="loadError" type="button" class="px-4 py-2 rounded-lg border border-white/30" @click="refreshElection()">Coba lagi</button>
          </section>

          <!-- BUKTI MEMILIH -->
          <section
            v-if="receipt && (phase === 'open' || phase === 'closed')"
            class="rounded-2xl border border-[#3BC541]/60 bg-[#00BF08]/15 backdrop-blur-md p-5 md:p-6 flex gap-4 items-start"
            aria-live="polite"
          >
            <div class="shrink-0 w-11 h-11 rounded-full bg-[#00BF08] flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="space-y-1 flex-1 min-w-0">
              <h2 class="text-lg md:text-xl font-bold">Suaramu sudah tercatat</h2>
              <p class="text-sm md:text-base text-white/80">
                {{ formatWib(parseWib(receipt.recorded_at)) }}
              </p>
              <p class="text-sm">
                Kode bukti:
                <span class="font-mono font-bold tracking-wider select-all">{{ receipt.receipt_code }}</span>
              </p>
              <p class="text-xs md:text-sm text-white/60">
                Pilihanmu bersifat rahasia dan tidak ditampilkan di sini. Terima kasih sudah ikut memilih.
              </p>
              <div class="pt-3 border-t border-white/10 mt-3 space-y-3">
                <p class="text-sm md:text-base text-white/90">
                  Stay tune di Instagram <span class="font-semibold">@himasif</span> untuk pengumuman Ketua Umum terpilih.
                </p>
                <div class="flex flex-col sm:flex-row gap-2">
                  <a
                    :href="instagramUrl"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF6D00] hover:bg-[#FF7E1D] text-black font-semibold transition"
                  >
                    <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                    </svg>
                    Stay tune di @himasif
                  </a>
                  <NuxtLink
                    to="/"
                    class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/30 hover:bg-white/10 font-semibold transition"
                  >
                    Jelajahi himasif.id
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </section>

          <!-- BELUM DIBUKA -->
          <section v-if="phase === 'upcoming'" class="space-y-5">
            <div class="rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-5 md:p-8 text-center space-y-5">
              <h2 class="text-lg md:text-2xl font-bold">Voting belum dibuka</h2>
              <VoteTimer :target="startAt" :offset="offset" label="Dibuka dalam" />
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div class="rounded-xl bg-white/5 p-4">
                  <dt class="text-xs uppercase tracking-wider text-white/60">Dibuka</dt>
                  <dd class="mt-1 text-sm md:text-base font-semibold">{{ formatWib(startAt) }}</dd>
                </div>
                <div class="rounded-xl bg-white/5 p-4">
                  <dt class="text-xs uppercase tracking-wider text-white/60">Ditutup</dt>
                  <dd class="mt-1 text-sm md:text-base font-semibold">{{ formatWib(endAt) }}</dd>
                </div>
              </dl>
              <p class="text-xs md:text-sm text-white/60">
                Tautan masuk dikirim ke email UNEJ kamu (NIM@mail.unej.ac.id). Sambil menunggu, kenali calonnya di bawah.
              </p>
            </div>
          </section>

          <!-- DIBUKA: info sesi -->
          <section v-if="phase === 'open'" class="space-y-4">
            <div class="rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <p class="text-xs uppercase tracking-wider text-[#FF6D00] font-semibold">Voting dibuka</p>
                <p class="text-sm md:text-base">Ditutup {{ formatWib(endAt) }}</p>
              </div>
              <VoteTimer :target="endAt" :offset="offset" label="Sisa waktu" compact />
            </div>

            <div
              v-if="authenticated && reasonText"
              class="rounded-2xl border border-white/20 bg-white/5 p-4 md:p-5 text-sm md:text-base"
              role="status"
            >
              {{ reasonText }}
            </div>

            <div
              v-if="!authenticated"
              class="rounded-2xl border border-[#FF6D00]/50 bg-[#FF6D00]/10 p-4 md:p-5 space-y-3"
            >
              <h2 class="font-bold text-base md:text-lg">Masuk untuk memilih</h2>
              <p class="text-sm text-white/80">
                Buka <span class="font-semibold">tautan masuk</span> di email voting yang dikirim ke email UNEJ kamu.
                Tidak menemukan emailnya? Masuk dengan NIM dan password.
              </p>
              <AppButton class="border border-[#FF6D00] px-4 py-2 rounded-lg hover:bg-[#FF6D00] transition" @click="openLogin">
                Masuk dengan NIM &amp; password
              </AppButton>
            </div>
          </section>

          <!-- DITUTUP -->
          <section v-if="phase === 'closed'">
            <div class="rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-6 md:p-10 text-center space-y-4">
              <h2 class="text-2xl md:text-3xl font-bold">Voting ditutup</h2>
              <p class="text-sm md:text-base text-white/80 max-w-md mx-auto">
                Terima kasih untuk semua Sisforians yang sudah memilih. Pantau pengumuman Ketua Umum terpilih di
                Instagram <span class="font-semibold">@himasif</span>.
              </p>
              <a
                :href="instagramUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FF6D00] hover:bg-[#FF7E1D] text-black font-semibold transition"
              >
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
                Buka Instagram @himasif
              </a>
            </div>
          </section>

          <!-- DIUMUMKAN -->
          <section v-if="revealWinner">
            <div class="rounded-2xl bg-black/60 backdrop-blur-md border border-[#FF6D00]/40 px-6 py-10 md:p-14 text-center flex flex-col items-center gap-5">
              <span v-if="previewMode" class="px-3 py-1 rounded-full border border-white/30 text-xs text-white/80">
                Pratinjau staging · {{ previewSource }}
              </span>
              <p class="text-xs md:text-sm uppercase tracking-[0.2em] text-[#FF6D00] font-semibold">Hasil pemilihan</p>
              <h2 class="text-2xl md:text-4xl font-bold leading-tight max-w-xl">
                Ketua Umum HIMASIF {{ revealPeriod }} sudah diumumkan
              </h2>
              <p class="text-sm text-white/70 max-w-md">Nyalakan suara, lalu buka pengumumannya.</p>
              <LazyVoteReveal class="mt-2" :winner="revealWinner" :period="revealPeriod" />
              <button type="button" class="text-sm text-white/60 underline underline-offset-4" @click="showStatic = !showStatic">
                {{ showStatic ? "Sembunyikan" : "Lihat tanpa animasi" }}
              </button>

              <div v-if="showStatic" class="w-full pt-6 border-t border-white/10 space-y-4">
                <img
                  :src="candidatePhoto(revealWinner)"
                  :alt="revealWinner.name"
                  class="mx-auto w-48 h-60 md:w-64 md:h-80 object-cover rounded-2xl border border-white/10 shadow-2xl"
                  @error="onImageError"
                />
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-[#FF6D00] font-semibold">Ketua Umum HIMASIF {{ revealPeriod }}</p>
                  <h3 class="mt-1 text-2xl md:text-4xl font-bold uppercase">{{ revealWinner.name }}</h3>
                  <p v-if="revealWinner.year_of_study" class="mt-1 text-white/70">Sistem Informasi {{ revealWinner.year_of_study }}</p>
                </div>
                <p class="text-sm text-white/70 max-w-md mx-auto">
                  Selamat! Terima kasih untuk semua calon dan Sisforians yang sudah memilih.
                </p>
              </div>
            </div>
          </section>

          <!-- DAFTAR CALON (belum dibuka & dibuka) -->
          <section v-if="showCandidates" class="space-y-4">
            <h2 class="text-lg md:text-xl font-bold text-center">Calon Ketua Umum</h2>
            <p v-if="canVote" class="text-sm text-white/70 -mt-2 text-center">Ketuk kartu calon untuk memilih, lalu kirim pilihanmu.</p>

            <!-- flex-wrap + justify-center: 1–2 calon tetap rata tengah -->
            <div class="flex flex-wrap justify-center gap-4 md:gap-6 pt-2">
              <article
                v-for="c in candidateList"
                :key="c.id"
                class="vote-card relative w-full sm:w-[calc(50%-0.75rem)] lg:w-[300px] rounded-2xl border overflow-hidden bg-primary-900"
                :class="selected === c.id ? 'is-selected border-[#3BC541] ring-2 ring-[#3BC541]' : 'border-primary-800'"
              >
                <span v-if="selected === c.id" class="vote-sweep" aria-hidden="true"></span>
                <button
                  type="button"
                  class="w-full text-left flex sm:block disabled:cursor-default"
                  :disabled="!canVote"
                  :aria-pressed="selected === c.id"
                  @click="selected = c.id"
                >
                  <div class="relative w-32 sm:w-full shrink-0">
                    <img
                      :src="candidatePhoto(c)"
                      :alt="c.name"
                      loading="lazy"
                      class="w-full h-full min-h-[160px] sm:h-72 object-cover"
                      @error="onImageError"
                    />
                    <span
                      v-if="c.order"
                      class="absolute top-2 left-2 w-9 h-9 rounded-full bg-white text-black font-bold flex items-center justify-center shadow"
                    >{{ c.order }}</span>
                  </div>
                  <div class="p-4 flex flex-col justify-center gap-1 min-w-0">
                    <p class="text-xs" :class="selected === c.id ? 'text-[#B8E3B9]' : 'text-secondary'">CALON KETUA UMUM</p>
                    <h3 class="text-base md:text-lg font-bold uppercase leading-snug break-words">{{ c.name }}</h3>
                    <p v-if="c.year_of_study" class="text-xs" :class="selected === c.id ? 'text-[#B8E3B9]' : 'text-secondary'">
                      SISTEM INFORMASI {{ c.year_of_study }}
                    </p>
                    <p v-if="selected === c.id" class="text-xs font-semibold text-[#3BC541]">✓ Dipilih</p>
                  </div>
                </button>
                <div class="px-4 pb-4">
                  <button
                    type="button"
                    class="w-full text-sm border border-primary-800 rounded-lg py-2 hover:bg-[#FF7E1D] hover:text-black transition"
                    @click="detail = c"
                  >
                    Lihat visi &amp; misi
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>
      </AppContentArea>
    </div>

    <!-- TOMBOL KIRIM (menempel di bawah, nyaman di HP) -->
    <div
      v-if="canVote"
      class="fixed bottom-0 inset-x-0 z-40 bg-[#111111]/95 backdrop-blur border-t border-white/10 px-4 py-3"
    >
      <div class="max-w-5xl mx-auto flex items-center gap-3">
        <p class="flex-1 text-sm truncate">
          <template v-if="selectedCandidate">Pilihan: <span class="font-semibold">{{ selectedCandidate.name }}</span></template>
          <template v-else><span class="text-white/60">Belum ada calon dipilih</span></template>
        </p>
        <button
          type="button"
          class="shrink-0 px-5 py-3 rounded-lg font-semibold bg-[#00BF08] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="!selectedCandidate || voteLoading"
          @click="submitVote"
        >
          <svg v-if="voteLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity=".3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" />
          </svg>
          Kirim pilihan
        </button>
      </div>
    </div>

    <!-- KONFIRMASI PILIHAN (modal sendiri, bukan dialog bawaan / generik) -->
    <Teleport to="body">
      <Transition name="vc">
        <div
          v-if="confirming && selectedCandidate"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vote-confirm-title"
          @click.self="answerConfirm(false)"
        >
          <div class="vc-panel w-full sm:max-w-sm bg-[#161616] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-center text-white shadow-2xl">
            <img
              :src="candidatePhoto(selectedCandidate)"
              :alt="selectedCandidate.name"
              class="mx-auto w-24 h-28 object-cover rounded-2xl border-2 border-[#3BC541]"
              @error="onImageError"
            />
            <p class="mt-4 text-xs uppercase tracking-[0.2em] text-[#FF6D00] font-semibold">Konfirmasi pilihan</p>
            <h3 id="vote-confirm-title" class="mt-1 text-lg font-bold uppercase leading-snug break-words">
              <template v-if="selectedCandidate.order">{{ selectedCandidate.order }}. </template>{{ selectedCandidate.name }}
            </h3>
            <p class="mt-2 text-sm text-white/70">Suara yang sudah dikirim tidak bisa diubah.</p>
            <div class="mt-6 grid grid-cols-2 gap-3">
              <button type="button" class="py-3 rounded-xl border border-white/20 hover:bg-white/10 font-semibold transition" @click="answerConfirm(false)">
                Batal
              </button>
              <button
                ref="confirmBtn"
                type="button"
                class="py-3 rounded-xl bg-[#00BF08] hover:bg-[#13d11c] text-white font-semibold transition"
                @click="answerConfirm(true)"
              >
                Ya, kirim
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL VISI & MISI -->
    <Teleport to="body">
      <div
        v-if="detail"
        class="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        @click.self="detail = null"
      >
        <div class="bg-primary-950 text-white w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 md:p-8">
          <div class="flex items-start gap-4">
            <img :src="candidatePhoto(detail)" :alt="detail.name" class="w-20 h-24 object-cover rounded-xl shrink-0" @error="onImageError" />
            <div class="flex-1 min-w-0">
              <p class="text-xs text-secondary">CALON KETUA UMUM {{ detail.order ? `NO. ${detail.order}` : "" }}</p>
              <h3 class="text-lg md:text-xl font-bold uppercase break-words">{{ detail.name }}</h3>
            </div>
            <button type="button" class="w-9 h-9 rounded-full border border-white/20 shrink-0" aria-label="Tutup" @click="detail = null">✕</button>
          </div>
          <div class="mt-6 space-y-6 text-sm md:text-base">
            <div>
              <h4 class="text-title-3 mb-2">Visi</h4>
              <div class="text-secondary prose-invert" v-html="detail.visi"></div>
            </div>
            <div>
              <h4 class="text-title-3 mb-2">Misi</h4>
              <div class="text-secondary prose-invert" v-html="detail.misi"></div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
useHead({ title: "Vote" });

const toast = useToast();
const authStore = useAuthStore();
const { authenticated } = storeToRefs(authStore);
const { settings } = storeToRefs(useMySettingsStore());

// 1) Pemilihan berjalan (publik). 404 no_election → "Belum ada pemilihan".
const { data: currentRes, error: currentErr, refresh: refreshElection } = await useAPI(VOTING_API.current, {
  key: "election-current",
});
const election = computed(() => currentRes.value?.data ?? null);
const notFound = computed(() => !!currentErr.value && apiError(currentErr.value).status === 404);
const loadError = computed(() => !!currentErr.value && !notFound.value);
const phase = computed(() => (election.value ? election.value.phase : notFound.value ? "none" : "loading"));
const startAt = computed(() => parseWib(election.value?.start_at));
const endAt = computed(() => parseWib(election.value?.end_at));
const winner = computed(() => election.value?.result?.winner ?? null);
const candidateList = computed(() => election.value?.candidates ?? []);

const title = computed(() => election.value?.name || "Pemilihan Ketua Umum HIMASIF");

// Pengumuman beranimasi (fase DIUMUMKAN) + pratinjau khusus non-production:
// /app/vote?preview-reveal=1[&election=ID] → data hasil pemilihan ID (yang sudah diumumkan) atau data dummy.
const route = useRoute();
const requestHost = useRequestURL().hostname;
const previewMode = computed(
  () =>
    !!useRuntimeConfig().public.revealPreview &&
    route.query["preview-reveal"] !== undefined &&
    !/^(www\.)?himasif\.id$/i.test(requestHost),
);
const previewResult = ref(null);
const DUMMY_WINNER = { name: "Dummy A", photo_url: null, year_of_study: 2024 };
const previewSource = computed(() =>
  phase.value === "announced" && winner.value
    ? `pemilihan #${election.value.id}`
    : previewResult.value
      ? `hasil pemilihan #${route.query.election}`
      : "data dummy",
);
const revealWinner = computed(() => {
  if (phase.value === "announced" && winner.value) return winner.value;
  if (!previewMode.value) return null;
  return previewResult.value?.winner ?? DUMMY_WINNER;
});
const revealPeriod = computed(() => electionPeriod(previewResult.value ? { ...election.value, result: previewResult.value } : election.value) || "2026–2027");
const showStatic = ref(false);
const instagramUrl = computed(() => {
  const s = settings.value?.instagram;
  return typeof s === "string" && /^https?:\/\//.test(s) ? s : HIMASIF_INSTAGRAM;
});

// Jam server: hitung mundur memakai server_time, bukan jam HP.
const offset = ref(0);
watch(
  () => election.value?.server_time,
  (t) => {
    if (import.meta.client && t) offset.value = clockOffset(t);
  },
  { immediate: true },
);

// 2) Pemilih yang sedang masuk.
const voter = ref(null);
const receipt = ref(null);

async function loadReceipt() {
  if (!election.value) return;
  try {
    const res = await useNuxtApp().$api(VOTING_API.receipt(election.value.id), { headers: voterAuthHeader() });
    receipt.value = res?.data ?? null;
  } catch (e) {
    if (apiError(e).status === 401) authStore.clearSession();
  }
}

async function loadVoter() {
  if (!authenticated.value || !election.value) return;
  try {
    const res = await useNuxtApp().$api(VOTING_API.me, { headers: voterAuthHeader() });
    voter.value = res?.data ?? null;
    if (voter.value?.election?.has_voted) await loadReceipt();
  } catch (e) {
    if (apiError(e).status === 401) {
      authStore.clearSession();
      voter.value = null;
    }
  }
}

const reasonText = computed(() => {
  const ve = voter.value?.election;
  if (!ve || ve.eligible || ve.has_voted || phase.value !== "open") return "";
  return REASON_TEXT[ve.reason] || "Kamu tidak bisa memilih pada pemilihan ini.";
});
const showCandidates = computed(
  () => ["upcoming", "open"].includes(phase.value) && candidateList.value.length > 0 && !receipt.value,
);
const canVote = computed(
  () => phase.value === "open" && authenticated.value && !!voter.value?.election?.eligible && !receipt.value,
);

const selected = ref(null);
const selectedCandidate = computed(() => candidateList.value.find((c) => c.id === selected.value) || null);
const detail = ref(null);
const voteLoading = ref(false);

// Konfirmasi memilih memakai modal sendiri (bukan confirm() / modal generik).
const confirming = ref(false);
const confirmBtn = ref(null);
let confirmResolve = null;
function askConfirm() {
  confirming.value = true;
  nextTick(() => confirmBtn.value?.focus());
  return new Promise((res) => (confirmResolve = res));
}
function answerConfirm(ok) {
  confirming.value = false;
  confirmResolve?.(ok);
  confirmResolve = null;
}
function onKey(e) {
  if (e.key !== "Escape") return;
  if (confirming.value) answerConfirm(false);
  else if (detail.value) detail.value = null;
}

const onImageError = (e) => (e.target.src = "/img/logo/himasif-white.png");

function openLogin() {
  document.querySelector('[data-modal-toggle="authentication-modal"]')?.click();
}

// Saat hitung mundur habis, minta fase baru ke BE (jangan menebak sendiri).
let timer;
let lastRefresh = 0;
onMounted(async () => {
  window.addEventListener("keydown", onKey);
  const pid = Number(route.query.election);
  if (previewMode.value && pid > 0) {
    useNuxtApp()
      .$api(VOTING_API.result(pid))
      .then((r) => (previewResult.value = r?.data?.winner ? r.data : null))
      .catch(() => {});
  }
  await refreshElection(); // server_time segar untuk offset jam di browser
  await loadVoter();
  timer = setInterval(async () => {
    const now = Date.now() + offset.value;
    const boundary = phase.value === "upcoming" ? startAt.value : phase.value === "open" ? endAt.value : null;
    if (boundary && now >= boundary.getTime() && Date.now() - lastRefresh > 10000) {
      lastRefresh = Date.now();
      await refreshElection();
      await loadVoter();
    }
  }, 1000);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener("keydown", onKey);
});

// Masuk dari navbar → muat status pemilih; keluar → bersihkan.
watch(authenticated, (v) => {
  if (v) loadVoter();
  else {
    voter.value = null;
    receipt.value = null;
  }
});

function showReceipt(r) {
  receipt.value = r;
  selected.value = null;
  if (voter.value?.election) voter.value.election.has_voted = true;
  useCookie("is-vote").value = "true";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const submitVote = async () => {
  if (!selectedCandidate.value || !canVote.value || voteLoading.value) return;
  if (!(await askConfirm())) return;

  voteLoading.value = true;
  const id = election.value.id;
  try {
    const res = await useNuxtApp().$api(VOTING_API.vote(id), {
      method: "POST",
      headers: voterAuthHeader(),
      body: { candidate_id: selectedCandidate.value.id },
    });
    showReceipt(res.data);
    toast.success("Suaramu sudah tercatat", "Terima kasih sudah ikut memilih.");
  } catch (e) {
    const err = apiError(e);
    if (err.code === "already_voted" && err.body?.receipt_code) {
      showReceipt({ receipt_code: err.body.receipt_code, recorded_at: err.body.recorded_at });
      toast.info("Kamu sudah memilih sebelumnya", "Ini bukti suaramu.");
      return;
    }
    if (err.status === 0) {
      // Jaringan putus: pastikan dulu apakah suara sudah masuk sebelum mencoba lagi.
      await loadReceipt();
      if (receipt.value) return showReceipt(receipt.value);
    }
    if (err.status === 401) {
      authStore.clearSession();
      err.message = "Sesi berakhir, silakan masuk lagi.";
    }
    if (err.status === 423) await refreshElection();
    toast.error("Suara belum terkirim", err.message);
  } finally {
    voteLoading.value = false;
  }
};
</script>

<style scoped>
/* Kartu calon: maju halus saat hover, "pop" saat dipilih, kilau cahaya berulang pada yang terpilih. */
.vote-card {
  transition:
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 300ms ease;
  will-change: transform;
}
@media (hover: hover) {
  .vote-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 22px 44px -18px rgba(0, 0, 0, 0.85);
  }
}
.vote-card.is-selected {
  transform: translateY(-8px) scale(1.04);
  box-shadow:
    0 28px 56px -18px rgba(0, 0, 0, 0.9),
    0 0 36px -6px rgba(59, 197, 65, 0.45);
  animation: vote-pop 560ms cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1;
}
@keyframes vote-pop {
  0% {
    transform: translateY(0) scale(1);
  }
  55% {
    transform: translateY(-10px) scale(1.065);
  }
  100% {
    transform: translateY(-8px) scale(1.04);
  }
}
.vote-sweep {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}
.vote-sweep::before {
  content: "";
  position: absolute;
  top: -20%;
  bottom: -20%;
  left: 0;
  width: 45%;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.08) 35%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.08) 65%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-160%) skewX(-18deg);
  animation: vote-sweep 2.8s cubic-bezier(0.45, 0, 0.25, 1) 0.45s infinite;
}
@keyframes vote-sweep {
  0% {
    transform: translateX(-160%) skewX(-18deg);
  }
  55%,
  100% {
    transform: translateX(360%) skewX(-18deg);
  }
}

/* Modal konfirmasi */
.vc-enter-active,
.vc-leave-active {
  transition: opacity 280ms ease;
}
.vc-enter-active .vc-panel,
.vc-leave-active .vc-panel {
  transition:
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 280ms ease;
}
.vc-enter-from,
.vc-leave-to {
  opacity: 0;
}
.vc-enter-from .vc-panel,
.vc-leave-to .vc-panel {
  transform: translateY(24px) scale(0.97);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .vote-card,
  .vote-card.is-selected,
  .vc-enter-active .vc-panel,
  .vc-leave-active .vc-panel {
    animation: none;
    transition:
      border-color 150ms linear,
      opacity 150ms linear;
  }
  .vote-card:hover,
  .vote-card.is-selected,
  .vc-enter-from .vc-panel,
  .vc-leave-to .vc-panel {
    transform: none;
  }
  .vote-sweep {
    display: none;
  }
}
</style>
