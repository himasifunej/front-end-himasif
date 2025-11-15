<template>
  <div class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark min-h-screen">

    <AppBackgroundHeader background-image="vote.jpeg" />

    <AppContentArea class="-mt-[45vh] lg:-mt-[85vh] z-20 relative">

      <AppContainer
        class="pb-5 text-text-primary dark:text-text-primary-dark h-[500px] flex flex-col justify-center w-2/3 space-y-10"
        v-if="!isVoteTime">
        <h1 class="text-title-1 text-center">Countdown :</h1>
        <AppCountdown :end="vote_settings.result.start_at" class="p-8 bg-black/75 dark:bg-black/75 rounded"
          v-if="!isVoteTime">
        </AppCountdown>
      </AppContainer>

      <AppContainer class="pb-5 lg:flex justify-between" v-if="isVoteTime">
        <div>
          <FeatureTitle class="w-full text-center lg:text-left lg:w-1/3">VOTE</FeatureTitle>
          <h3 class="text-title-4 hidden md:text-center md:block lg:text-left">
            PEMILIHAN KETUA UMUM <br>
            HIMPUNAN MAHASISWA SISTEM INFORMASI <br>
            UNIVERSITAS JEMBER <br>
            2024
          </h3>
        </div>

        <!-- =================== LIST CALON ==================== -->
        <div class="mt-10 lg:mt-0" v-if="isVote == 0">
          <div class="flex space-x-4 justify-center lg:justify-normal">

            <div v-for="ketua in candidates.data" class="w-[200px] relative z-30 mt-[-50px]">

              <div @click="selectOption(ketua.id)" class="cursor-pointer rounded-2xl border text-center"
                :class="selectedOption == ketua.id ? 'bg-[#007A05] border-[#71C475]' :
                'border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark hover:bg-card-hover dark:hover:bg-card-hover-dark'">

                <h4 class="text-title-2 py-5">{{ ketua.order }}</h4>

                <NuxtImg :src="'https://placehold.co/600x400?text=Not+Found'" height="250"
                  class="w-full object-cover h-[300px]" />

                <div class="p-4 space-y-2">
                  <p class="text-deskripsi"
                    :class="selectedOption == ketua.id ? 'text-text-primary-dark' : 'text-text-secondary dark:text-text-secondary-dark'">
                    CALON KETUA UMUM
                  </p>

                  <div class="h-16 flex items-center justify-center break-words" lang="de">
                    <h5 class="text-title-4 uppercase"
                      :class="selectedOption == ketua.id ? 'text-text-primary-dark' : 'text-text-primary dark:text-text-primary-dark'">
                      {{ ketua.name }}</h5>
                  </div>

                  <p class="text-deskripsi"
                    :class="selectedOption == ketua.id ? 'text-text-primary-dark' : 'text-text-secondary dark:text-text-secondary-dark'">
                    SISTEM INFORMASI {{ ketua.year_of_study }}
                  </p>
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <AppButtonPrimary data-modal-target="visimisi-modal" data-modal-toggle="visimisi-modal"
                  @click="getInfoKetua(ketua)">Visi & Misi</AppButtonPrimary>
              </div>
            </div>
          </div>

          <!-- =================== MODAL VISI MISI ==================== -->
          <Teleport to="body">

            <div id="visimisi-modal" tabindex="-1" aria-hidden="true"
              class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-40 justify-center items-center md:inset-0 h-screen bg-black/80">
              <div class="relative p-4 w-full max-w-6xl max-h-full mx-0">

                <div
                  class="relative bg-bg-primary dark:bg-bg-primary-dark border border-border-primary dark:border-border-primary-dark rounded-2xl shadow">
                  <div class="p-8 flex justify-between">

                    <div class="w-1/3 hidden md:block">
                      <div class="w-full rounded-[10px]">
                        <div class="relative">
                          <h4 class="text-title-1 top-0 left-0 p-5 absolute">{{ infoKetua?.order }}</h4>

                          <NuxtImg :src="'https://placehold.co/600x400?text=Not+Found'" height="400" width="400"
                            class="h-[400px] w-full object-cover" />

                          <div class="p-4 absolute bottom-0">
                            <p class='text-deskripsi text-text-secondary dark:text-text-secondary-dark'>CALON KETUA UMUM
                            </p>
                            <div class="break-words" lang="de">
                              <h5 class="text-title-5 uppercase text-text-primary dark:text-text-primary-dark">
                                {{ infoKetua?.name }}</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="md:w-3/5 space-y-6 flex flex-col justify-center">

                      <div class="block md:hidden">
                        <h4
                          class="text-[60px] font-semibold leading-[55px] text-text-primary dark:text-text-primary-dark">
                          {{ infoKetua?.order }}</h4>

                        <div class="py-2 text-left">
                          <p class='text-deskripsi text-text-secondary dark:text-text-secondary-dark'>CALON KETUA UMUM
                          </p>
                          <div class="break-words" lang="de">
                            <h5 class="text-title-5 uppercase text-text-primary dark:text-text-primary-dark">
                              {{ infoKetua?.name }}</h5>
                          </div>
                        </div>
                      </div>

                      <div class="space-y-4">
                        <h3 class="text-title-2 text-text-secondary dark:text-text-secondary-dark">Visi</h3>
                        <div class="text-text-primary dark:text-text-primary-dark" v-html="infoKetua?.visi"></div>
                      </div>

                      <div class="space-y-4">
                        <h3 class="text-title-2 text-text-secondary dark:text-text-secondary-dark">Misi</h3>
                        <div class="text-text-primary dark:text-text-primary-dark" v-html="infoKetua?.misi"></div>
                      </div>

                    </div>
                  </div>
                </div>

                <div class="flex justify-center mt-5">
                  <AppButtonCircle data-modal-hide="visimisi-modal" class="rounded-full">
                    <span class="relative block w-[30px] h-[30px]">
                      <span
                        class="absolute top-1/2 left-1/2 w-[15px] h-[2px] bg-bg-primary-dark dark:bg-bg-primary transform -translate-x-1/2 -translate-y-1/2 rotate-45"></span>
                      <span
                        class="absolute top-1/2 left-1/2 w-[15px] h-[2px] bg-bg-primary-dark dark:bg-bg-primary transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></span>
                    </span>
                  </AppButtonCircle>
                </div>

              </div>
            </div>

          </Teleport>

          <!-- =================== BUTTON KIRIM ==================== -->
          <div class="flex justify-center mt-4">
            <AppButtonSecondary class="border border-primary-800 flex items-center dark:border-primary-700"
              :disabled="selectedOption == -1" @click="submitVote" variant="secondary">
              <div role="status" v-if="voteLoading">
                <svg aria-hidden="true"
                  class="w-4 h-4 text-text-primary dark:text-text-primary-dark animate-spin fill-mediatek mr-2"
                  viewBox="0 0 100 101">
                </svg>
              </div>
              Kirim Pilihan Saya
            </AppButtonSecondary>
          </div>

        </div>

        <!-- =================== HASIL VOTE ==================== -->
        <div v-if="isVote == 1" class="mt-60 lg:mt-40">
          <div class="flex gap-8 justify-center">
            <div v-for="ketuaResult in candidates.data" class="w-[200px] relative z-30 mt-[-50px]">

              <div class="relative">
                <div class="absolute bottom-1/2 left-1/2 transform -translate-x-1/2">
                  <div class="h-[200px] rounded-xl w-20 p-4 text-center"
                    :class="ketuaResult.order < 2 ? 'bg-[#007A05] border border-[#71C475]' :
                    'bg-text-secondary dark:bg-text-secondary-dark border border-text-primary dark:border-text-primary-dark'">
                    <h3 class="text-white text-title-4">99</h3>
                    <p class="text-white text-deskripsi">Suara</p>
                  </div>
                </div>

                <NuxtImg :src="'https://placehold.co/600x400?text=Not+Found'" height="250"
                  class="w-full object-cover h-[300px]" />

                <div class="p-2 text-center">
                  <div class="flex items-center justify-center break-words" lang="de">
                    <h5 class="text-title-4 uppercase text-primary dark:text-text-primary-dark">
                      {{ ketuaResult.name }}</h5>
                  </div>
                  <p class="text-deskripsi text-text-secondary dark:text-text-secondary-dark">
                    SISTEM INFORMASI {{ ketuaResult.year_of_study }}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

      </AppContainer>

    </AppContentArea>
  </div>
</template>

<script setup>
import { AppAlertConfirm, AppAlertSuccess, AppAlertError } from '#components';
import { initModals } from 'flowbite';

definePageMeta({ middleware: [] });

useHead({ title: 'Vote' })

const alertStore = useAlertsStore()
const selectedOption = ref(-1)
const isVote = ref(useCookie('is-vote').value)
const infoKetua = ref()
const voteLoading = ref(false)

const { data: vote_settings } = await useAPI('/vote_setting', {
  pick: ['result']
})

const { data: candidates } = await useAPI('/voting_candidate', {
  query: { sort: 'order' },
  pick: ['data']
})

const now = ref(new Date())
const updateDate = () => now.value = new Date()

const isVoteTime = computed(() =>
  now.value > new Date(vote_settings.value.result.start_at).getTime()
)

const getInfoKetua = (ketua) => infoKetua.value = ketua

const selectOption = (i) => {
  if (isVote.value) {
    alertStore.openModal({
      component: markRaw(AppAlertError),
      props: { text: "Anda sudah melakukan voting" }
    })
    return
  }
  selectedOption.value = i
}

const submitVote = async () => {

  if (now.value > new Date(vote_settings.value.result.end_at)) {
    alertStore.openModal({
      component: markRaw(AppAlertError),
      props: { text: "Halo Sisforians, Maaf vote telah ditutup" }
    })
  }

  await alertStore.openModal({
    component: markRaw(AppAlertConfirm),
    props: { text: "Apakah kamu yakin dengan pilihanmu?" }
  })
    .then(async (res) => {
      if (res) {
        voteLoading.value = true

        const formData = createFormData({ voting_candidate_id: selectedOption.value })
        const { data: vote } = await useAPI('/vote', {
          method: 'POST',
          headers: { Authorization: `Bearer ${useCookie('token').value}` },
          body: formData
        })

        selectedOption.value = -1

        if (vote.value.code !== 200) {
          alertStore.openModal({
            component: markRaw(AppAlertError),
            props: { text: vote.value.message }
          })
          voteLoading.value = false
          return
        }

        alertStore.openModal({
          component: markRaw(AppAlertSuccess),
          props: { text: vote.value.message }
        })
        useCookie('is-vote').value = 1
        isVote.value = 1
        voteLoading.value = false
      }
    })
    .catch(() => {})
}

onMounted(() => initModals())
</script>

<style></style>
