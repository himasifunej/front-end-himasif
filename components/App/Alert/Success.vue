<template>
  <div
    class="px-4 bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark rounded-[20px] text-text-primary dark:text-text-primary-dark divide-y divide-border-primary dark:divide-border-primary-dark max-w-sm text-center">

    <div class="pb-4 py-4">
      <h2 class="text-title-4-sm md:text-title-5">Berhasil</h2>
      <p class="text-deskripsi-sm mt-2 text-text-secondary dark:text-text-secondary-dark md:text-deskripsi">{{ text }}
      </p>
    </div>
    <div class="py-2">
      <button
        class="text-div-mediatek text-title-4-sm block w-full py-2 rounded-lg md:text-button hover:bg-card-hover dark:hover:bg-card-hover-dark active:bg-card-pressed dark:active:bg-card-pressed-dark"
        @click="alertStore.closeModal">OK</button>
    </div>

  </div>
</template>





<script setup>
const alertStore = useAlertsStore()
const props = defineProps({
  text: String,
})
</script>

<style></style>