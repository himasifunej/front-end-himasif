<template>
  <div class="bg-[#111111] text-white min-h-screen relative">
    <div class="absolute inset-0 z-0">
      <AppBackgroundHeader background-image="vote.jpeg" />
    </div>

    <!-- Kartu di tengah layar, di bawah navbar (tidak tertimpa), pas di semua lebar. -->
    <div class="relative z-20 min-h-[100svh] flex items-center justify-center px-4 pt-28 pb-12 md:pt-32">
      <div class="w-full max-w-md rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 p-6 md:p-8 flex flex-col items-center gap-5 text-center">
        <NuxtImg src="/img/logo/himasif-white.png" alt="Logo HIMASIF" width="72" class="mx-auto" />

        <template v-if="status === 'session'">
          <h1 class="text-xl md:text-2xl font-bold">Kamu sudah masuk di perangkat ini</h1>
          <p class="text-sm text-white/70">
            Lanjutkan dari sesi yang sudah ada. Tautan di email tetap bisa dipakai di perangkat lain sampai kamu memilih.
          </p>
          <NuxtLink
            :to="afterLogin"
            class="w-full flex items-center justify-center px-5 py-3 rounded-lg font-semibold bg-[#FF6D00] hover:bg-[#FF7E1D] text-black transition"
          >
            Lanjut ke halaman voting
          </NuxtLink>
          <button v-if="token" type="button" class="text-sm text-white/70 underline" @click="status = 'ready'">Masuk dengan tautan ini</button>
        </template>

        <template v-else-if="status === 'ready'">
          <h1 class="text-xl md:text-2xl font-bold">Masuk ke E-Voting HIMASIF</h1>
          <p class="text-sm text-white/70">
            Tautan ini hanya untuk kamu dan bisa dibuka lagi sampai kamu memilih. Jangan teruskan email voting ke orang lain.
          </p>
          <button
            type="button"
            class="w-full flex items-center justify-center px-5 py-3 rounded-lg font-semibold bg-[#FF6D00] hover:bg-[#FF7E1D] text-black transition"
            @click="exchange"
          >
            Masuk &amp; pilih
          </button>
        </template>

        <template v-else-if="status === 'loading'">
          <h1 class="text-xl font-bold">Memeriksa tautan…</h1>
          <svg class="w-8 h-8 animate-spin mx-auto" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity=".3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" />
          </svg>
        </template>

        <template v-else>
          <h1 class="text-xl md:text-2xl font-bold">{{ errorCode === "magic_link_voted" ? "Kamu sudah memilih" : "Tautan tidak bisa dipakai" }}</h1>
          <p class="text-sm text-white/70">{{ errorText }}</p>
          <p v-if="errorCode === 'magic_link_invalid' || errorCode === 'magic_link_used'" class="text-xs text-white/60 text-left w-full rounded-lg border border-white/10 p-3">
            Cara masuk lagi: isi NIM dan password 5 karakter yang tertulis di email voting
            (di bawah tombol "Masuk &amp; pilih"). Pakai password di email kredensial <b class="text-white">terbaru</b>.
          </p>
          <!-- form masuk langsung di layar ini (tidak bergantung modal navbar) -->
          <form class="w-full space-y-3 text-left" @submit.prevent="loginWithPassword">
            <label class="block text-sm">
              NIM
              <input v-model="nim" type="text" inputmode="numeric" autocomplete="username" required
                class="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2.5 text-white focus:outline-none focus:border-[#FF6D00]" />
            </label>
            <label class="block text-sm">
              Password dari email voting
              <input v-model="password" type="password" autocomplete="current-password" required
                class="mt-1 w-full rounded-lg bg-white/5 border border-white/20 px-3 py-2.5 text-white focus:outline-none focus:border-[#FF6D00]" />
            </label>
            <p v-if="loginError" class="text-sm text-red-300" role="alert">{{ loginError }}</p>
            <button
              type="submit"
              :disabled="loggingIn || !nim || !password"
              class="w-full flex items-center justify-center px-5 py-3 rounded-lg font-semibold bg-[#FF6D00] hover:bg-[#FF7E1D] text-black transition disabled:opacity-50"
            >
              {{ loggingIn ? "Memeriksa…" : "Masuk dengan NIM & password" }}
            </button>
          </form>
          <div class="w-full space-y-2">
            <NuxtLink :to="afterLogin" class="block text-sm text-white/70 underline">Lihat halaman voting</NuxtLink>
          </div>
          <div v-if="canResend" class="dark w-full border-t border-white/10 pt-4">
            <VoteResendLink :election-id="electionId" />
          </div>
          <p class="text-xs text-white/50">
            Masih belum bisa masuk? Hubungi panitia lewat Instagram
            <a :href="HIMASIF_INSTAGRAM" target="_blank" rel="noopener" class="underline">@himasif</a>.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
// Magic link dari email: /app/vote/masuk?t=<token>&election=<id> (kontrak v2).
// - Token TIDAK ditukar saat halaman dibuka, hanya setelah pemilih menekan tombol (pemindai tautan email).
// - Token dipindah dari address bar ke sessionStorage tab ini (tidak tersimpan di riwayat/Referer), jadi refresh,
//   atau kembali dari halaman "Kenali Calon", tidak menghilangkannya.
// - Token berlaku sampai pemilih memilih atau pemilihan ditutup (BE), bisa dipakai lagi di perangkat lain.
// - Klik sebelum voting dibuka → /app/vote?election=ID (Kenali Calon); token tetap tersimpan.
useHead({ title: "Masuk Voting", meta: [{ name: "robots", content: "noindex, nofollow" }] });

const route = useRoute();
const authStore = useAuthStore();
const electionId = ref(electionIdFromQuery(route.query.election));
// Tautan email membawa ?election=ID: setelah masuk, tampilkan pemilihan itu (bukan "pemilihan berjalan" apa pun).
const afterLogin = computed(() => votePath(electionId.value));

const q = route.query.t ?? route.query.token;
const token = ref(typeof q === "string" ? q : "");
// SSR tidak melihat sessionStorage: tanpa ?t, tunggu onMounted sebelum menyatakan tautan tidak lengkap.
const status = ref(token.value ? "ready" : "loading");
const errorText = ref("");
const errorCode = ref("");
const canResend = computed(() => !["magic_link_voted", "magic_link_expired", "account_inactive"].includes(errorCode.value));

onMounted(async () => {
  if (token.value) {
    saveMagicToken(token.value, electionId.value);
    history.replaceState(history.state, "", electionId.value ? `${route.path}?election=${electionId.value}` : route.path);
  } else {
    const saved = loadMagicToken(electionId.value);
    if (saved) {
      token.value = saved.t;
      electionId.value = electionId.value ?? saved.election;
    }
  }
  status.value = token.value ? "ready" : "error";
  if (!token.value) errorText.value = "Tautan masuk tidak lengkap. Buka lagi tautan dari email voting kamu.";
  // Sudah masuk di perangkat ini: tawarkan lanjut dari sesi yang ada.
  if (useCookie("token").value) {
    try {
      const me = await useNuxtApp().$api(VOTING_API.me, { headers: voterAuthHeader() });
      if (me?.data) status.value = "session";
    } catch (e) {
      // sesi kedaluwarsa: biarkan tautan dipakai seperti biasa
    }
  }
});

// Masuk dengan NIM & password langsung dari layar ini, lalu ke halaman voting.
const nim = ref("");
const password = ref("");
const loggingIn = ref(false);
const loginError = ref("");
async function loginWithPassword() {
  loggingIn.value = true;
  loginError.value = "";
  try {
    const res = await useNuxtApp().$api(VOTING_API.login, { method: "POST", body: loginBody(nim.value, password.value) });
    const d = res?.data ?? {};
    if (!d.token) throw { data: res };
    authStore.setSession(d.token, d.voter, d.expires_at);
    await navigateTo(afterLogin.value, { replace: true });
  } catch (e) {
    loginError.value = apiError(e).message || "NIM atau password salah.";
  } finally {
    loggingIn.value = false;
  }
}

const MESSAGES = {
  magic_link_invalid: "Tautan ini tidak berlaku lagi: kamu sudah memilih, atau sudah ada 3 tautan yang lebih baru. Masuk dengan NIM dan password, atau minta link masuk baru di bawah.",
  magic_link_used: "Tautan ini sudah tidak berlaku. Masuk dengan NIM dan password dari email voting.",
  magic_link_voted: "Suaramu sudah tercatat, jadi tautan masuk tidak berlaku lagi. Masuk dengan NIM dan password untuk melihat bukti memilih.",
  magic_link_expired: "Tautan ini sudah tidak berlaku karena pemilihannya sudah ditutup.",
  account_inactive: "Akunmu tidak aktif. Hubungi panitia lewat Instagram @himasif.",
};

async function exchange() {
  status.value = "loading";
  try {
    const res = await useNuxtApp().$api(VOTING_API.magicLink, {
      method: "POST",
      body: { token: token.value },
    });
    const d = res?.data ?? {};
    if (!d.token) throw { data: res };
    authStore.setSession(d.token, d.voter, d.expires_at);
    electionId.value = electionId.value ?? d.voter?.election?.id ?? null;
    clearMagicToken(); // sesi sudah ada; tautan di email tetap bisa dibuka lagi bila perlu
    token.value = "";
    await navigateTo(afterLogin.value, { replace: true });
  } catch (e) {
    const err = apiError(e);
    const eid = electionIdFromQuery(err.body?.election_id) ?? electionId.value;
    if (err.code === "election_not_open") {
      // Token tidak hangus dan tetap tersimpan di tab ini: tampilkan para calon sambil menunggu.
      saveMagicToken(token.value, eid);
      await navigateTo(votePath(eid), { replace: true });
      return;
    }
    if (MAGIC_DEAD_CODES.includes(err.code)) clearMagicToken();
    if (eid) electionId.value = eid;
    status.value = "error";
    errorCode.value = err.code || "";
    errorText.value = MESSAGES[err.code] || err.message || "Tautan tidak bisa dipakai.";
  }
}
</script>
