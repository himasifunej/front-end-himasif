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
            v-if="hasVoted && (phase === 'open' || phase === 'closed')"
            class="rounded-2xl border border-[#3BC541]/60 bg-[#00BF08]/15 backdrop-blur-md p-5 md:p-6 flex gap-4 items-start"
            aria-live="polite"
          >
            <div class="shrink-0 w-11 h-11 rounded-full bg-[#00BF08] flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="space-y-1 flex-1 min-w-0">
              <h2 class="text-lg md:text-xl font-bold">Kamu sudah memilih</h2>
              <p class="text-sm md:text-base text-white/80">
                <template v-if="receipt?.recorded_at">pada {{ formatWib(parseWib(receipt.recorded_at)) }}. </template>Suaramu sudah tercatat dan tidak bisa diubah.
              </p>
              <p v-if="receipt?.receipt_code" class="text-sm">
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

          <!-- DAFTAR CALON (belum dibuka & dibuka): gaya himasif.id, semua calon setara -->
          <section v-if="showCandidates" class="space-y-4" aria-labelledby="calon-title">
            <div class="relative">
              <h2 id="calon-title" class="text-title-3-sm md:text-title-3 text-center">Calon Ketua Umum</h2>
              <!-- tombol kecil di pojok: kurangi animasi (prefers-reduced-motion tetap dihormati) -->
              <button
                type="button"
                class="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg border border-border-primary-dark bg-card-primary-dark hover:bg-card-hover-dark inline-flex items-center justify-center text-text-secondary-dark"
                :class="lessMotion ? 'text-div-mediatek border-div-mediatek' : ''"
                :aria-pressed="lessMotion || prefersReduced"
                :disabled="prefersReduced"
                :title="prefersReduced ? 'Animasi dikurangi (pengaturan perangkat)' : lessMotion ? 'Animasi dikurangi — ketuk untuk menyalakan lagi' : 'Kurangi animasi'"
                :aria-label="prefersReduced ? 'Animasi dikurangi oleh pengaturan perangkat' : 'Kurangi animasi'"
                @click="lessMotion = !lessMotion"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-text-secondary-dark -mt-2 text-center">
              Ketuk kartu untuk melihat perkenalan serta visi &amp; misi calon<template v-if="canVote">, lalu pilih dan kirim pilihanmu</template>.
              <span v-if="canVote" class="hidden md:inline"> Keyboard: tekan 1–{{ candidateList.length }} untuk memilih.</span>
            </p>
            <p class="sr-only" aria-live="polite">{{ selectedCandidate ? `Calon nomor ${selectedCandidate.order}, ${selectedCandidate.name} dipilih.` : "" }}</p>

            <div class="vote-ballot pt-2" :style="{ '--cols': Math.min(candidateList.length, 3) }">
              <article
                v-for="c in candidateList"
                :key="c.id"
                class="vote-card relative rounded-lg border bg-card-primary-dark overflow-hidden transition-colors"
                :class="selected === c.id ? 'border-div-mediatek ring-1 ring-div-mediatek' : 'border-border-primary-dark hover:bg-card-hover-dark'"
              >
                <button
                  type="button"
                  class="w-full text-left flex sm:block"
                  :aria-pressed="selected === c.id"
                  :aria-label="`Calon nomor ${c.order}, ${c.name}. Buka perkenalan serta visi dan misi${canVote ? ', lalu pilih' : ''}.`"
                  @click="openIntro(c, $event)"
                >
                  <div class="relative w-32 sm:w-full shrink-0">
                    <img
                      :src="candidatePhoto(c)"
                      :alt="c.name"
                      loading="lazy"
                      class="w-full h-full min-h-[160px] sm:h-72 object-cover object-[50%_20%]"
                      @error="onImageError"
                    />
                    <span
                      v-if="c.order"
                      class="absolute top-2 left-2 w-9 h-9 rounded-lg bg-bg-primary-dark/90 border border-border-primary-dark text-text-primary-dark font-semibold flex items-center justify-center"
                    >{{ c.order }}</span>
                  </div>
                  <div class="p-4 flex flex-col justify-center gap-1 min-w-0">
                    <p class="text-xs tracking-wide text-text-secondary-dark">CALON KETUA UMUM</p>
                    <h3 class="text-title-4 md:text-base font-semibold uppercase leading-snug break-words">{{ c.name }}</h3>
                    <p v-if="c.year_of_study" class="text-xs text-text-secondary-dark">SISTEM INFORMASI {{ c.year_of_study }}</p>
                    <p v-if="selected === c.id" class="text-xs font-semibold text-div-mediatek inline-flex items-center gap-1">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                      Dipilih
                    </p>
                  </div>
                </button>
                <div class="px-4 pb-4">
                  <button
                    type="button"
                    class="w-full px-4 py-2.5 rounded-lg border border-border-primary-dark bg-card-primary-dark hover:bg-card-hover-dark active:bg-card-pressed-dark text-sm"
                    @click="openIntro(c, $event, true)"
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
          class="shrink-0 px-5 py-3 rounded-lg font-semibold bg-div-mediatek hover:bg-[#FF7E1D] text-black disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="!selectedCandidate || voteLoading"
          @click="openReview"
        >
          <svg v-if="voteLoading" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity=".3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" />
          </svg>
          Tinjau pilihan
        </button>
      </div>
    </div>

    <!-- PERKENALAN + VISI & MISI CALON (satu modal): perkenalan sekali per calon, bisa dilewati -->
    <Teleport to="body">
      <Transition :name="introTransition">
      <LazyVoteIntro
        v-if="introFor"
        :key="introFor.id"
        :candidate="introFor"
        :intro="election?.intro"
        :photo="candidatePhoto(introFor)"
        :video-src="introFor.intro?.video_url || ''"
        :reduced="reducedMotion"
        :start-done="introVisi"
        :focus-visi="introVisi"
        :can-pick="canVote"
        :pick-hint="pickHint"
        :count="candidateList.length"
        :prev="introNeighbor(-1)"
        :next="introNeighbor(1)"
        :nav-from="introNavFrom"
        @played="(id) => (introSeen[id] = true)"
        @close="closeIntro"
        @pick="pickFromIntro"
        @number="selectByNumber"
        @nav="navIntro"
      />
      </Transition>
    </Teleport>

    <!-- KONFIRMASI PILIHAN: ringkasan + klik terpisah "Kirim pilihan" (insiden 13 Nov: ketukan ganda/Enter kedua) -->
    <Teleport to="body">
      <Transition name="vc">
        <div
          v-if="confirming && selectedCandidate"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vote-confirm-title"
          aria-describedby="vote-confirm-desc"
          @click.self="onConfirmBackdrop"
        >
          <div class="vc-panel w-full max-w-sm bg-card-primary-dark border border-border-primary-dark rounded-lg p-6 text-center text-white shadow-2xl">
            <p class="text-xs uppercase tracking-[0.2em] text-div-mediatek font-semibold">Ringkasan pilihan</p>
            <img
              :src="candidatePhoto(selectedCandidate)"
              :alt="selectedCandidate.name"
              class="mt-3 mx-auto w-36 h-44 sm:w-40 sm:h-[200px] object-cover object-[50%_20%] rounded-lg border-2 border-div-mediatek"
              @error="onImageError"
            />
            <h3 id="vote-confirm-title" class="mt-3 text-lg font-bold uppercase leading-snug break-words">
              <template v-if="selectedCandidate.order">{{ selectedCandidate.order }}. </template>{{ selectedCandidate.name }}
            </h3>
            <p id="vote-confirm-desc" class="mt-2 text-sm text-white/70">
              Periksa lagi. Suara yang sudah dikirim <b class="text-white">tidak bisa diubah</b>. Tekan <b class="text-white">Kirim pilihan</b> bila sudah yakin.
            </p>
            <p v-if="confirmError" class="mt-3 text-sm text-red-300" role="alert">{{ confirmError }}</p>
            <div class="mt-6 grid grid-cols-2 gap-3">
              <button ref="cancelBtn" type="button" class="py-3 rounded-lg border border-border-primary-dark bg-card-primary-dark hover:bg-card-hover-dark font-semibold transition" @click="answerConfirm(false)">
                Batal
              </button>
              <button
                ref="confirmBtn"
                type="button"
                class="py-3 rounded-lg bg-div-mediatek hover:bg-[#FF7E1D] text-black font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="!confirmToken || !confirmArmed"
                :aria-disabled="!confirmToken || !confirmArmed"
                @pointerdown="onFinalPointerDown"
                @keydown="onFinalKeyDown"
                @click="onFinalClick"
              >
                Kirim pilihan
              </button>
            </div>
          </div>
        </div>
      </Transition>
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
// Layar untuk pemilih yang sudah masuk: surat suara / "Kamu sudah memilih" / alasan (lihat voterScreen).
const screen = computed(() => (authenticated.value ? voterScreen(phase.value, voter.value?.election, !!receipt.value) : "wait"));
const hasVoted = computed(() => screen.value === "voted");
const showCandidates = computed(
  () => ["upcoming", "open"].includes(phase.value) && candidateList.value.length > 0 && !hasVoted.value,
);
const canVote = computed(() => authenticated.value && screen.value === "ballot");

const selected = ref(null);
const selectedCandidate = computed(() => candidateList.value.find((c) => c.id === selected.value) || null);

// Perkenalan + visi-misi calon dalam satu modal → "Pilih calon ini" → kartu ditandai + bar Kirim pilihan.
const prefersReduced = ref(false);
const lessMotion = ref(false);
const reducedMotion = computed(() => prefersReduced.value || lessMotion.value);
const introFor = ref(null);
const introVisi = ref(false);
const introSeen = reactive({});
let introOrigin = null;
const pickHint = computed(() => {
  if (phase.value !== "open") return "Voting belum dibuka.";
  if (!authenticated.value) return "Masuk dulu lewat tautan di email voting untuk memilih.";
  return reasonText.value || "Akun ini tidak bisa memilih di pemilihan ini.";
});
function openIntro(c, ev, visi = false) {
  introOrigin = ev?.currentTarget || null;
  introNavFrom.value = "";
  introVisi.value = visi;
  introFor.value = c;
}
function closeIntro() {
  introNavFrom.value = ""; // tutup tanpa animasi geser
  introFor.value = null;
  introVisi.value = false;
  nextTick(() => introOrigin?.focus());
}
// Pindah calon di dalam modal (panah, ←/→, geser). Berputar 3 → 1. HANYA mengganti calon yang ditampilkan:
// tidak menyentuh `selected`, tidak membuka ringkasan, tidak mengirim apa pun.
const introNavFrom = ref("");
const introTransition = computed(() =>
  !introNavFrom.value ? "intro-open" : reducedMotion.value ? "intro-fade" : `intro-${introNavFrom.value}`,
);
function introNeighbor(dir) {
  const list = candidateList.value;
  const j = neighborIndex(list.length, list.indexOf(introFor.value), dir);
  return j < 0 ? null : list[j];
}
function navIntro(dir) {
  const list = candidateList.value;
  const j = neighborIndex(list.length, list.indexOf(introFor.value), dir);
  if (j < 0) return;
  introNavFrom.value = dir > 0 ? "next" : "prev";
  introVisi.value = false;
  introFor.value = list[j];
  // saat ditutup, fokus kembali ke kartu calon yang terakhir dilihat
  introOrigin = document.querySelectorAll(".vote-card")[j]?.querySelector("button") || introOrigin;
}
function pickFromIntro(c) {
  selected.value = c.id;
  closeIntro();
}
/** Tombol angka 1–9: langsung memilih calon bernomor itu (di surat suara maupun di dalam modal). */
function selectByNumber(n) {
  if (!canVote.value) return;
  const c = candidateList.value.find((x) => Number(x.order) === n);
  if (!c) return;
  selected.value = c.id;
  if (introFor.value) closeIntro();
  nextTick(() => document.querySelectorAll(".vote-card")[candidateList.value.indexOf(c)]?.querySelector("button")?.focus());
}
watch(lessMotion, (v) => {
  try { localStorage.setItem("vote-less-motion", v ? "1" : "0"); } catch (e) {}
});
const { run: runPreload } = useIntroPreload();
watch(
  () => showCandidates.value && candidateList.value.length > 0,
  (ready) => {
    if (!ready || !import.meta.client) return;
    // preload hanya untuk yang bisa memilih (pengunjung biasa tidak menarik video)
    if (canVote.value) runPreload(candidateList.value, election.value?.intro, candidatePhoto);
  },
);
watch(canVote, (v) => {
  if (v && showCandidates.value) runPreload(candidateList.value, election.value?.intro, candidatePhoto);
});
const voteLoading = ref(false);

// Konfirmasi memilih memakai modal sendiri (bukan confirm() / modal generik).
const confirming = ref(false);
const confirmBtn = ref(null);
const cancelBtn = ref(null);
// Pengaman konfirmasi: jeda 500 ms, gerakan harus dimulai di tombol final, dan token sekali pakai dari server.
const confirmGuard = createConfirmGuard(500);
const confirmToken = ref(null);
const confirmArmed = ref(false);
const confirmError = ref("");
let armTimer = null;
let confirmResolve = null;
function askConfirm() {
  confirming.value = true;
  confirmError.value = "";
  confirmToken.value = null;
  confirmArmed.value = false;
  confirmGuard.open(performance.now());
  clearTimeout(armTimer);
  armTimer = setTimeout(() => (confirmArmed.value = true), 500);
  // fokus awal ke Batal: suara tidak bisa diubah, jadi Enter/Spasi yang tak sengaja tidak boleh langsung mengirim
  nextTick(() => cancelBtn.value?.focus());
  // token dari server: suara hanya diterima bila layar ringkasan ini benar-benar dibuka untuk calon ini
  const id = election.value.id, cid = selectedCandidate.value.id;
  useNuxtApp()
    .$api(VOTING_API.confirm(id), { method: "POST", headers: voterAuthHeader(), body: { candidate_id: cid } })
    .then((r) => { if (confirming.value && selectedCandidate.value?.id === cid) confirmToken.value = r?.data?.confirm_token || null; })
    .catch((e) => (confirmError.value = apiError(e).message || "Ringkasan tidak bisa dibuka. Coba lagi."));
  return new Promise((res) => (confirmResolve = res));
}
function answerConfirm(ok) {
  confirming.value = false;
  clearTimeout(armTimer);
  confirmResolve?.(ok);
  confirmResolve = null;
}
function onFinalPointerDown() {
  confirmGuard.pointerDown(performance.now());
}
function onFinalKeyDown(e) {
  confirmGuard.keyDown(e, performance.now());
}
/** Tombol final: hanya klik/tekanan yang disengaja (lihat createConfirmGuard). */
function onFinalClick(e) {
  if (!confirmToken.value || !confirmGuard.allowClick(e, performance.now())) {
    e.preventDefault();
    return;
  }
  answerConfirm(true);
}
function onConfirmBackdrop() {
  // ketukan ganda di tombol bar tidak boleh langsung menutup ringkasan
  if (confirmGuard.ready(performance.now())) answerConfirm(false);
}
function onKey(e) {
  if (introFor.value) return; // modal calon menangani Esc/Enter/angka sendiri
  if (e.key === "Escape") {
    if (confirming.value) answerConfirm(false);
    return;
  }
  // surat suara: 1–9 langsung memilih calon bernomor itu (bukan saat mengetik di kolom isian)
  const tag = (e.target && e.target.tagName) || "";
  if (!confirming.value && /^[1-9]$/.test(e.key) && !e.altKey && !e.ctrlKey && !e.metaKey && !/INPUT|TEXTAREA|SELECT/.test(tag)) {
    selectByNumber(Number(e.key));
  }
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
  try {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReduced.value = mq.matches;
    mq.addEventListener?.("change", (e) => (prefersReduced.value = e.matches));
    lessMotion.value = localStorage.getItem("vote-less-motion") === "1";
  } catch (e) {}
  if (canVote.value && showCandidates.value) runPreload(candidateList.value, election.value?.intro, candidatePhoto);
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
  if (!v) {
    voter.value = null;
    receipt.value = null;
  }
});
// Tiap sesi baru (juga login ulang saat sudah berada di halaman ini): muat ulang status pemilih lalu tampilkan
// surat suara atau "Kamu sudah memilih". Tidak boleh diam saja.
watch(
  () => authStore.sessionVersion,
  async () => {
    voter.value = null;
    receipt.value = null;
    selected.value = null;
    if (!election.value) await refreshElection();
    await loadVoter();
    if (import.meta.client) window.scrollTo({ top: 0, behavior: "smooth" });
  },
);

function showReceipt(r) {
  receipt.value = r;
  selected.value = null;
  if (voter.value?.election) voter.value.election.has_voted = true;
  useCookie("is-vote").value = "true";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Tombol bar "Tinjau pilihan": hanya membuka ringkasan. Suara dikirim dari tombol "Kirim pilihan" di ringkasan. */
const openReview = async () => {
  if (!selectedCandidate.value || !canVote.value || voteLoading.value || confirming.value) return;
  if (!(await askConfirm())) return;

  voteLoading.value = true;
  const id = election.value.id;
  try {
    const res = await useNuxtApp().$api(VOTING_API.vote(id), {
      method: "POST",
      headers: voterAuthHeader(),
      body: { candidate_id: selectedCandidate.value.id, confirm_token: confirmToken.value },
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
    if (err.code === "confirm_required") err.message = "Buka ringkasan pilihan lagi, lalu tekan Kirim pilihan.";
    toast.error("Suara belum terkirim", err.message);
  } finally {
    voteLoading.value = false;
    confirmToken.value = null;
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
/* Surat suara: kartu setara (HP bertumpuk, ≥ 640px satu baris sama lebar; 4+ calon: grid 2/3 kolom) */
.vote-ballot {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 640px) {
  .vote-ballot {
    grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
    gap: 16px;
  }
}
@media (min-width: 1024px) {
  .vote-ballot {
    gap: 24px;
    max-width: calc(var(--cols, 3) * 300px + (var(--cols, 3) - 1) * 24px);
    margin-inline: auto;
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
}
</style>
