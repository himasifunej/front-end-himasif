<template>
  <div v-if="target" :class="compact ? 'text-left sm:text-right' : 'text-center'">
    <p class="text-xs uppercase tracking-wider text-white/60">{{ label }}</p>
    <div
      class="font-bold tabular-nums"
      :class="compact ? 'text-xl md:text-2xl' : 'mt-2 grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto'"
      aria-live="off"
    >
      <template v-if="compact">
        <span v-if="parts.d">{{ parts.d }}h </span>{{ pad(parts.h) }}:{{ pad(parts.m) }}:{{ pad(parts.s) }}
      </template>
      <template v-else>
        <div v-for="u in units" :key="u.k" class="rounded-xl bg-white/5 py-3">
          <div class="text-3xl md:text-5xl">{{ pad(parts[u.k]) }}</div>
          <div class="text-[11px] md:text-xs font-normal text-white/60 mt-1">{{ u.label }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
// Hitung mundur ringan. Di SSR tampil 00 lalu berjalan di browser (hindari selisih hidrasi).
const props = defineProps({
  target: { type: Date, default: null },
  label: { type: String, default: "" },
  compact: { type: Boolean, default: false },
});

const units = [
  { k: "d", label: "Hari" },
  { k: "h", label: "Jam" },
  { k: "m", label: "Menit" },
  { k: "s", label: "Detik" },
];
const now = ref(null);
let t;
onMounted(() => {
  now.value = Date.now();
  t = setInterval(() => (now.value = Date.now()), 1000);
});
onBeforeUnmount(() => clearInterval(t));

const parts = computed(() => {
  if (!props.target || now.value === null) return { d: 0, h: 0, m: 0, s: 0 };
  const diff = Math.max(0, props.target.getTime() - now.value);
  const s = Math.floor(diff / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
});
const pad = (n) => String(n).padStart(2, "0");
</script>
