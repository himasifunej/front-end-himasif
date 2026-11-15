<template>
  <form class="w-full space-y-2 text-left" @submit.prevent="send">
    <p v-if="!done" class="text-sm opacity-90">
      Tidak menemukan email voting? Isi NIM kamu, link masuk baru dikirim ke email UNEJ (NIM@mail.unej.ac.id).
      Password tidak berubah.
    </p>
    <div v-if="!done" class="flex gap-2">
      <label class="sr-only" :for="inputId">NIM</label>
      <input
        :id="inputId"
        v-model="nim"
        type="text"
        inputmode="numeric"
        autocomplete="username"
        placeholder="NIM, mis. 232410101001"
        maxlength="20"
        class="min-w-0 flex-1 rounded-lg bg-white dark:bg-white/5 border border-black/25 dark:border-white/25 px-3 py-2.5 text-[#0D0D0D] dark:text-white placeholder:text-black/45 dark:placeholder:text-white/50 focus:outline-none focus:border-[#FF6D00] focus:ring-1 focus:ring-[#FF6D00]"
      />
      <button
        type="submit"
        :disabled="sending || !validNim"
        class="shrink-0 rounded-lg bg-[#FF6D00] hover:bg-[#FF7E1D] text-black px-3 py-2.5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6D00] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
      >
        {{ sending ? "Mengirim…" : "Kirim ulang link masuk" }}
      </button>
    </div>
    <p v-if="error" class="text-sm text-red-700 dark:text-red-300" role="alert">{{ error }}</p>
    <div v-if="done" class="rounded-lg border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 p-3 text-sm" role="status">
      <p>{{ message }}</p>
      <button type="button" class="mt-2 text-xs underline opacity-80" :disabled="cooldown > 0" @click="reset">
        {{ cooldown > 0 ? `Bisa minta lagi dalam ${cooldown} detik` : "Kirim untuk NIM lain" }}
      </button>
    </div>
  </form>
</template>

<script setup>
// "Kirim ulang link masuk" (POST /v2/auth/magic-link/resend). BE selalu menjawab sama apa pun NIM-nya
// dan membatasi kiriman (1 per 10 menit, 3 per hari per NIM), jadi di sini cukup jeda tombol 60 detik.
const props = defineProps({ electionId: { type: Number, default: null } });

const inputId = `resend-nim-${Math.random().toString(36).slice(2, 8)}`;
const nim = ref("");
const sending = ref(false);
const done = ref(false);
const message = ref("");
const error = ref("");
const cooldown = ref(0);
let tick;

const validNim = computed(() => /^\d{10,15}$/.test(nim.value.replace(/\s+/g, "")));

async function send() {
  if (!validNim.value || sending.value) return;
  sending.value = true;
  error.value = "";
  try {
    const body = { nim: nim.value.replace(/\s+/g, "") };
    if (props.electionId) body.election = props.electionId;
    const res = await useNuxtApp().$api(VOTING_API.resendLink, { method: "POST", body });
    message.value = res?.data?.message || "Kalau NIM itu terdaftar, link masuk baru dikirim ke email UNEJ kamu.";
    done.value = true;
    cooldown.value = 60;
    clearInterval(tick);
    tick = setInterval(() => {
      cooldown.value = Math.max(0, cooldown.value - 1);
      if (!cooldown.value) clearInterval(tick);
    }, 1000);
  } catch (e) {
    error.value = apiError(e).message;
  } finally {
    sending.value = false;
  }
}

function reset() {
  done.value = false;
  nim.value = "";
}

onBeforeUnmount(() => clearInterval(tick));
</script>
