<template>
  <Teleport to="body">
    <div
      class="fixed z-[60] inset-x-0 top-4 sm:top-auto sm:bottom-6 sm:right-6 sm:left-auto px-4 sm:px-0 flex flex-col items-center sm:items-end gap-2 pointer-events-none"
      aria-live="polite"
    >
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto w-full max-w-sm flex items-start gap-3 rounded-2xl border bg-[#161616]/95 backdrop-blur-md px-4 py-3 text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
          :class="BORDER[t.kind]"
          :role="t.kind === 'error' ? 'alert' : 'status'"
        >
          <span class="mt-0.5 shrink-0 w-7 h-7 rounded-full flex items-center justify-center" :class="ICON_BG[t.kind]">
            <svg v-if="t.kind === 'success'" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="t.kind === 'error'" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
              <path d="M12 7v6M12 17h.01" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
              <path d="M12 11v6M12 7h.01" stroke-linecap="round" />
            </svg>
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold leading-snug">{{ t.title }}</p>
            <p v-if="t.text" class="mt-0.5 text-xs text-white/70 leading-relaxed">{{ t.text }}</p>
          </div>
          <button type="button" class="shrink-0 -mr-1 w-7 h-7 rounded-full text-white/50 hover:text-white hover:bg-white/10" aria-label="Tutup" @click="dismiss(t.id)">
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { toasts, dismiss } = useToast();
const BORDER = { success: "border-[#3BC541]/50", error: "border-[#FF5A4E]/50", info: "border-[#FF6D00]/50" };
const ICON_BG = { success: "bg-[#00BF08] text-white", error: "bg-[#FF5A4E] text-white", info: "bg-[#FF6D00] text-black" };
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
}
@media (min-width: 640px) {
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(12px) scale(0.98);
  }
}
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.2s linear;
  }
  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }
}
</style>
