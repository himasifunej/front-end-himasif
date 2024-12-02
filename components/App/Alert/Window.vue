<template>
  <Teleport to="body">

    <Transition name="modal-fade">
      <div class="fixed top-0 left-0 z-50 w-screen h-screen bg-[#151515]/75 backdrop-blur-[30px] grid place-items-center" @click.self="store.closeModal" v-if="store.modalState?.component" aria-modal="true" role="dialog" tabindex="-1">
        <component :is="store.modalState?.component" v-bind="store.modalState?.props"></component>
      </div>
    </Transition>

  </Teleport>
</template>

<script setup>
const store = useAlertsStore()

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      store.closeModal()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      store.closeModal()
    }
  })
})
</script>

<style scoped>
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: 0.25s ease all;
}
</style>
