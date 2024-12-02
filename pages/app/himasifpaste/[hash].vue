<template>
  <div class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark pb-20 md:min-h-screen">

    <AppBackgroundHeader background-image="feature/sif-paste.webp" />

    <AppContentArea class="-mt-[25vh] lg:-mt-[75vh] z-20">
      <AppContainer  class="lg:flex justify-between">
        <FeatureTitle class="w-full text-center lg:text-left lg:w-1/3">HIMASIF PASTE!</FeatureTitle>

        <form class="mt-14 w-full lg:w-2/5">
          <div class="mb-4">
            <input type="text" id="input" v-model="paste.title"
              class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary-dark rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
              placeholder="Isikan judul paste-mu" required>
          </div>

          <textarea id="message" rows="4" v-model="paste.text"
            class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary-dark rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
            placeholder="Isikan teks paste-mu" required></textarea>
        </form>
      </AppContainer>
    </AppContentArea>
  </div>
</template>

<script setup>
import { AppAlertSuccess, AppAlertError } from '#components'
const route = useRoute()

const paste = ref({
  title: '',
  text: '',
})

const getPaste = async function () {
  const { data: data, error } = await useAPI(`/paste/${route.params.hash}`)
  if (data.value.code === 400) {
    useAlertsStore().openModal({
      component: AppAlertError,
      props: {
        text: data.value.message
      }
    })
  }

  if (data.value.code === 200) {
    useAlertsStore().openModal({
      component: AppAlertSuccess,
      props: {
        text: data.value.message
      }
    })
    paste.value.title = data.value.result.title
    paste.value.text = data.value.result.text
  }
}

getPaste()
</script>

<style></style>
