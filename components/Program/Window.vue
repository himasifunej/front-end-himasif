<template>
  <Teleport to="body">
    <Transition name="fade">
      <div class="fixed top-0 left-0 z-50 w-screen h-screen bg-black/80 grid place-content-end justify-center"
        @click.self="programStore.closeModal()" v-if="programStore.modalState" aria-modal="true" role="dialog"
        tabindex="-1">
        <Transition name="slide">
          <ProgramModal v-if="programStore.isMounted"/>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const programStore = useProgramsStore()

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      programStore.closeModal()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      programStore.closeModal()
    }
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-leave-active,
.slide-enter-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
</style>

