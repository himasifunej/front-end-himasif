<template>
  <div class="w-full h-[50vh] lg:h-screen relative overflow-hidden flex">
    <div class="h-3/4 w-full bg-gradient-to-t from-bg-primary dark:from-bg-primary-dark to-transparent absolute bottom-0 left-0 z-10"></div>

    <NuxtImg :src="`/img/banner/${props.backgroundImage}`" sizes="1000"
      class="object-cover h-full w-full absolute top-0 left-0" alt="banner image" />

  </div>
</template>

<script setup>
const props = defineProps({
  backgroundImage: String,
})
</script>

<style></style>
