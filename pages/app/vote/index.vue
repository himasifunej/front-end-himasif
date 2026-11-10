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
          </header>

          <!-- BUKTI MEMILIH -->
          <section
            v-if="hasVoted && (state.phase === 'open' || state.phase === 'closed')"
            class="rounded-2xl border border-[#3BC541]/60 bg-[#00BF08]/15 backdrop-blur-md p-5 md:p-6 flex gap-4 items-start"
            aria-live="polite"
          >
            <div class="shrink-0 w-11 h-11 rounded-full bg-[#00BF08] flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="space-y-1">
              <h2 class="text-lg md:text-xl font-bold">Suaramu sudah tercatat</h2>
              <p v-if="votedAt" class="text-sm md:text-base text-white/80">
                {{ formatWib(votedAt) }}
              </p>
              <p class="text-xs md:text-sm text-white/60">
                Pilihanmu bersifat rahasia dan tidak ditampilkan di sini. Terima kasih sudah ikut memilih.
              </p>
            </div>
          </section>

          <!-- BELUM DIBUKA -->
          <section v-if="state.phase === 'upcoming'" class="space-y-5">
            <div class="rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-5 md:p-8 text-center space-y-5">
              <h2 class="text-lg md:text-2xl font-bold">Voting belum dibuka</h2>
              <VoteTimer :target="state.startAt" label="Dibuka dalam" />
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div class="rounded-xl bg-white/5 p-4">
                  <dt class="text-xs uppercase tracking-wider text-white/60">Dibuka</dt>
                  <dd class="mt-1 text-sm md:text-base font-semibold">{{ formatWib(state.startAt) }}</dd>
                </div>
                <div class="rounded-xl bg-white/5 p-4">
                  <dt class="text-xs uppercase tracking-wider text-white/60">Ditutup</dt>
                  <dd class="mt-1 text-sm md:text-base font-semibold">{{ formatWib(state.endAt) }}</dd>
                </div>
              </dl>
              <p class="text-xs md:text-sm text-white/60">
                Tautan masuk dikirim ke email UNEJ kamu (NIM@mail.unej.ac.id). Sambil menunggu, kenali calonnya di bawah.
              </p>
            </div>
          </section>

          <!-- DIBUKA: info sesi -->
          <section v-if="state.phase === 'open'" class="space-y-4">
            <div class="rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <p class="text-xs uppercase tracking-wider text-[#FF6D00] font-semibold">Voting dibuka</p>
                <p class="text-sm md:text-base">Ditutup {{ formatWib(state.endAt) }}</p>
              </div>
              <VoteTimer :target="state.endAt" label="Sisa waktu" compact />
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
          <section v-if="state.phase === 'closed'">
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
          <section v-if="state.phase === 'announced' && state.winner">
            <div class="rounded-2xl bg-black/60 backdrop-blur-md border border-[#FF6D00]/40 p-6 md:p-10 text-center space-y-5">
              <p class="text-xs md:text-sm uppercase tracking-[0.2em] text-[#FF6D00] font-semibold">Ketua Umum terpilih</p>
              <img
                :src="candidateImage(state.winner)"
                :alt="state.winner.name"
                class="mx-auto w-48 h-60 md:w-64 md:h-80 object-cover rounded-2xl border border-white/10 shadow-2xl"
                @error="onImageError"
              />
              <div>
                <h2 class="text-2xl md:text-4xl font-bold uppercase">{{ state.winner.name }}</h2>
                <p v-if="state.winner.year_of_study" class="mt-1 text-white/70">
                  Sistem Informasi {{ state.winner.year_of_study }}
                </p>
              </div>
              <p class="text-sm text-white/70 max-w-md mx-auto">
                Selamat! Terima kasih untuk semua calon dan Sisforians yang sudah memilih.
              </p>
            </div>
          </section>

          <!-- DAFTAR CALON (belum dibuka & dibuka) -->
          <section v-if="showCandidates" class="space-y-4">
            <h2 class="text-lg md:text-xl font-bold">Calon Ketua Umum</h2>
            <p v-if="canVote" class="text-sm text-white/70 -mt-2">Ketuk kartu calon untuk memilih, lalu kirim pilihanmu.</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              <article
                v-for="c in candidateList"
                :key="c.id"
                class="rounded-2xl border overflow-hidden transition duration-200 bg-primary-900"
                :class="selected === c.id ? 'border-[#3BC541] ring-2 ring-[#3BC541]' : 'border-primary-800'"
              >
                <button
                  type="button"
                  class="w-full text-left flex sm:block disabled:cursor-default"
                  :disabled="!canVote"
                  :aria-pressed="selected === c.id"
                  @click="selected = c.id"
                >
                  <div class="relative w-32 sm:w-full shrink-0">
                    <img
                      :src="candidateImage(c)"
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
            <img :src="candidateImage(detail)" :alt="detail.name" class="w-20 h-24 object-cover rounded-xl shrink-0" @error="onImageError" />
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
import { AppAlertConfirm, AppAlertSuccess, AppAlertError } from "#components";

definePageMeta({ middleware: ["validate-vote-start"] });
useHead({ title: "Vote" });

const alertStore = useAlertsStore();
const { authenticated } = storeToRefs(useAuthStore());
const { hasVoted, votedAt, record, markVoted } = useVoteReceipt();
const { settings } = storeToRefs(useMySettingsStore());

const { data: voteSetting, refresh: refreshSetting } = await useAPI(VOTING_ENDPOINTS.setting, { key: "vote-setting" });
const { data: candidates } = await useAPI(VOTING_ENDPOINTS.candidates, {
  query: { sort: "order" },
  pick: ["data"],
});

// Jam sekarang (diperbarui tiap detik di browser) → fase ikut berganti tanpa reload.
const now = ref(new Date());
const state = computed(() => normalizeVoteSetting(voteSetting.value, now.value));

const title = computed(() => {
  const r = voteSetting.value?.result ?? {};
  return r.title || r.name || "Pemilihan Ketua Umum HIMASIF";
});
const instagramUrl = computed(() => {
  const s = settings.value?.instagram;
  return typeof s === "string" && /^https?:\/\//.test(s) ? s : HIMASIF_INSTAGRAM;
});

const candidateList = computed(() => candidates.value?.data || []);
const showCandidates = computed(() => ["upcoming", "open"].includes(state.value.phase) && candidateList.value.length > 0);
const canVote = computed(() => state.value.phase === "open" && authenticated.value && !hasVoted.value);

const selected = ref(null);
const selectedCandidate = computed(() => candidateList.value.find((c) => c.id === selected.value) || null);
const detail = ref(null);
const voteLoading = ref(false);

const onImageError = (e) => (e.target.src = "/img/logo/himasif-white.png");

function openLogin() {
  document.querySelector('[data-modal-toggle="authentication-modal"]')?.click();
}

let timer;
let lastPhase = state.value.phase;
onMounted(async () => {
  timer = setInterval(() => {
    now.value = new Date();
    if (state.value.phase !== lastPhase) {
      lastPhase = state.value.phase;
      refreshSetting();
    }
  }, 1000);

  // Sinkronkan status sudah/belum memilih dengan BE (cookie bisa basi / perangkat lain).
  const token = useCookie("token").value;
  if (token && state.value.phase !== "unpublished") {
    try {
      const res = await useNuxtApp().$api(VOTING_ENDPOINTS.status, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const r = res?.result ?? {};
      if (r.voting_status === true || r.has_voted === true) markVoted(r.voted_at);
    } catch (e) {
      if (e?.status === 401) {
        // Token kedaluwarsa: minta masuk lagi.
        useCookie("token").value = null;
        authenticated.value = false;
      }
    }
  }
});
onBeforeUnmount(() => clearInterval(timer));

const submitVote = async () => {
  if (!selectedCandidate.value || state.value.phase !== "open") return;

  const ok = await alertStore.openModal({
    component: markRaw(AppAlertConfirm),
    props: { text: `Kirim pilihan untuk ${selectedCandidate.value.name}? Pilihan tidak bisa diubah.` },
  });
  if (!ok) return;

  voteLoading.value = true;
  try {
    const res = await useNuxtApp().$api(VOTING_ENDPOINTS.vote, {
      method: "POST",
      headers: { Authorization: `Bearer ${useCookie("token").value}` },
      body: createFormData({ voting_candidate_id: selectedCandidate.value.id }),
    });
    if (res?.code === 200) {
      record(res?.result?.voted_at ?? res?.result?.created_at);
      selected.value = null;
      window.scrollTo({ top: 0, behavior: "smooth" });
      alertStore.openModal({ component: markRaw(AppAlertSuccess), props: { text: "Suaramu sudah tercatat" } });
    } else {
      if (/sudah memilih/i.test(res?.message || "")) markVoted(res?.result?.voted_at);
      alertStore.openModal({ component: markRaw(AppAlertError), props: { text: res?.message || "Gagal mengirim pilihan" } });
    }
  } catch (e) {
    const msg = e?.status === 401 ? "Sesi berakhir, silakan masuk lagi." : e?.data?.message || "Gagal mengirim pilihan";
    alertStore.openModal({ component: markRaw(AppAlertError), props: { text: msg } });
  } finally {
    voteLoading.value = false;
  }
};
</script>
