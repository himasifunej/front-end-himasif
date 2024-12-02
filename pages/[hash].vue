<template>
  <div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
})

const route = useRoute();


onMounted(async () => {

  await navigateTo(`https://www.api.himasif.id/${route.params.hash}`, {
    external: true
  })

})

</script>

<style></style>