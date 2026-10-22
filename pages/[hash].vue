<template>
  <div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
})

const route = useRoute()
const key = String(route.params.hash || '')

/**
 * Link pendek: himasif.id/{key}
 * - key valid  -> 301 permanen ke tujuan (server-side, tanpa JS)
 * - key tidak ada -> kembali ke homepage (bukan 301, biar tidak ter-cache permanen)
 */
const { data } = await useAPI(`/shorten/${encodeURIComponent(key)}`)

const destination = data.value?.code === 200 ? data.value?.result?.destination_url : null

if (destination) {
  await navigateTo(destination, { external: true, redirectCode: 301 })
} else {
  await navigateTo('/', { redirectCode: 302 })
}
</script>

<style></style>
