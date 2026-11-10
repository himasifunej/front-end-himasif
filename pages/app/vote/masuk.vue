<template>
  <div class="bg-[#111111] text-white min-h-screen relative">
    <div class="absolute inset-0 z-0">
      <AppBackgroundHeader background-image="vote.jpeg" />
    </div>

    <div class="relative z-20 px-4 pt-10 pb-16">
      <div class="w-full max-w-md mx-auto rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 p-6 md:p-8 space-y-5 text-center">
        <NuxtImg src="/img/logo/himasif-white.png" alt="Logo HIMASIF" width="72" class="mx-auto" />

        <template v-if="status === 'ready'">
          <h1 class="text-xl md:text-2xl font-bold">Masuk ke E-Voting HIMASIF</h1>
          <p class="text-sm text-white/70">
            Tautan ini hanya untuk kamu dan hanya bisa dipakai sekali. Jangan teruskan email voting ke orang lain.
          </p>
          <button
            type="button"
            class="w-full px-5 py-3 rounded-lg font-semibold bg-[#FF6D00] hover:bg-[#FF7E1D] text-black transition"
            @click="exchange"
          >
            Masuk &amp; buka halaman voting
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
          <h1 class="text-xl md:text-2xl font-bold">Tautan tidak bisa dipakai</h1>
          <p class="text-sm text-white/70">{{ errorText }}</p>
          <div class="space-y-2">
            <button
              type="button"
              class="w-full px-5 py-3 rounded-lg font-semibold border border-[#FF6D00] hover:bg-[#FF6D00] hover:text-black transition"
              @click="openLogin"
            >
              Masuk dengan NIM &amp; password
            </button>
            <NuxtLink to="/app/vote" class="block text-sm text-white/70 underline">Lihat halaman voting</NuxtLink>
          </div>
          <p class="text-xs text-white/50">
            Butuh tautan baru? Hubungi panitia lewat Instagram
            <a :href="HIMASIF_INSTAGRAM" target="_blank" rel="noopener" class="underline">@himasif</a>.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
// Magic link dari email: /app/vote/masuk?token=...
// - Token TIDAK ditukar saat halaman dibuka (SSR/GET), hanya setelah pemilih menekan tombol,
//   supaya pemindai tautan di email (Outlook Safe Links, dll.) tidak menghabiskan token sekali-pakai.
// - Token dihapus dari address bar begitu halaman dimuat (tidak tersimpan di riwayat/Referer).
useHead({ title: "Masuk Voting", meta: [{ name: "robots", content: "noindex, nofollow" }] });

const route = useRoute();
const authStore = useAuthStore();

const token = ref(typeof route.query.token === "string" ? route.query.token : "");
const status = ref(token.value ? "ready" : "error");
const errorText = ref(token.value ? "" : "Tautan masuk tidak lengkap. Buka lagi tautan dari email voting kamu.");

onMounted(() => {
  if (route.query.token) {
    history.replaceState(history.state, "", route.path);
  }
});

function openLogin() {
  document.querySelector('[data-modal-toggle="authentication-modal"]')?.click();
}

async function exchange() {
  status.value = "loading";
  try {
    const res = await useNuxtApp().$api(VOTING_ENDPOINTS.magicLogin, {
      method: "POST",
      body: { token: token.value },
    });
    // {{Assumption}} bentuk respons sama dengan /login: { token, data: { username, vote_status } }.
    const sessionToken = res?.token ?? res?.result?.token;
    if (!sessionToken) throw { data: res };
    authStore.setSession(sessionToken, res?.data ?? res?.result?.user ?? {});
    token.value = "";
    await navigateTo("/app/vote", { replace: true });
  } catch (e) {
    status.value = "error";
    const code = e?.status;
    errorText.value =
      e?.data?.message ||
      e?.data?.info ||
      (code === 410 || code === 401
        ? "Tautan sudah dipakai atau kedaluwarsa."
        : code === 429
          ? "Terlalu banyak percobaan. Coba lagi beberapa menit lagi."
          : "Tautan sudah dipakai, kedaluwarsa, atau tidak valid.");
  }
}
</script>
