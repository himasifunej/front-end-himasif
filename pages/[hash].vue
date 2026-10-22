<template>
  <div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
})

const route = useRoute();

// Link pendek (himasif.id/{key}) → resolve di backend (v2.himasif.id), server-side 301.
// Catatan: himasif.id/{key} dulu diarahkan ke www.api.himasif.id (host lama) yang
// membuat redirect bergantung pada JS + host terpisah.
await navigateTo(`https://v2.himasif.id/${route.params.hash}`, {
  external: true,
  redirectCode: 301,
})
</script>

<style></style>
