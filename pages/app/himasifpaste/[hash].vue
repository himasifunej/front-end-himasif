<template>
  <div class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark pb-20 md:min-h-screen">

    <AppBackgroundHeader background-image="feature/sif-paste.webp" />

    <AppContentArea class="-mt-[25vh] lg:-mt-[75vh] z-20">
      <AppContainer class="lg:flex justify-between">
        <FeatureTitle class="w-full text-center lg:text-left lg:w-1/3">HIMASIF PASTE!</FeatureTitle>

        <div class="mt-14 w-full lg:w-2/5">
          <div class="mb-4">
            <input type="text" id="input" :value="paste.title" readonly
              class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
              placeholder="Judul paste">
          </div>

          <textarea id="message" rows="12" :value="paste.text" readonly
            class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
            placeholder="Isi paste"></textarea>

          <div class="flex justify-center lg:justify-normal mt-4" v-show="paste.text">
            <AppButtonSecondary @click="copyToClipboard()">Salin teks</AppButtonSecondary>
          </div>
        </div>
      </AppContainer>
    </AppContentArea>
  </div>
</template>

<script setup>
import { AppAlertSuccess, AppAlertError } from '#components'

const route = useRoute()

useHead({
  title: 'HIMASIF Paste'
})

const paste = ref({
  title: '',
  text: '',
})

const notFound = ref(false)

const getPaste = async function () {
  const { data: data, error } = await useAPI(`/paste/${route.params.hash}`)

  if (error.value) {
    notFound.value = true
    useAlertsStore().openModal({
      component: AppAlertError,
      props: {
        text: 'Paste tidak ditemukan.'
      }
    })
    return
  }

  if (data.value?.code === 200) {
    paste.value.title = data.value.result.title
    paste.value.text = data.value.result.text
    useHead({ title: `${data.value.result.title} — HIMASIF Paste` })
    return
  }

  notFound.value = true
  useAlertsStore().openModal({
    component: AppAlertError,
    props: {
      text: data.value?.message || 'Paste tidak ditemukan.'
    }
  })
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(paste.value.text)
    useAlertsStore().openModal({
      component: AppAlertSuccess,
      props: {
        text: 'Berhasil menyalin'
      }
    })
  } catch (error) {
    useAlertsStore().openModal({
      component: AppAlertError,
      props: {
        text: 'Gagal menyalin, salin manual dari kotak teks.'
      }
    })
  }
}

getPaste()
</script>

<style></style>
