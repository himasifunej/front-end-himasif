<template>
  <div class="bg-primary-950 text-white min-h-screen relative">

    <!-- BACKGROUND HEADER (belakang) -->
    <div class="absolute inset-0 z-0">
      <AppBackgroundHeader background-image="vote.jpeg" />
    </div>

    <!-- CONTENT AREA (di depan background) -->
    <div class="relative z-20">
      <AppContentArea class="pt-4">

        <!-- COUNTDOWN (jika belum waktunya vote) -->
        <AppContainer
          class="pb-5 text-white h-[500px] flex flex-col justify-center w-2/3 space-y-10"
          v-if="!isVoteTime"
        >
          <h1 class="text-title-1 text-center">Countdown :</h1>
          <AppCountdown
            :end="vote_settings.result.start_at"
            class="p-8 bg-black/75 rounded"
            v-if="!isVoteTime"
          />
        </AppContainer>

        <!-- VOTE SECTION (kalau sudah waktu vote) -->
        <AppContainer
          class="pb-5 text-white h-full flex flex-col justify-center w-2/3 space-y-10"
          v-if="isVoteTime"
        >
          <h3 class="text-title-2 text-center">
            PEMILIHAN KETUA UMUM <br />
            HIMPUNAN MAHASISWA SISTEM INFORMASI <br />
            UNIVERSITAS JEMBER <br />
            PERIODE 2025/2026
          </h3>

          <!-- LIST KANDIDAT DI DEPAN BACKGROUND -->
          <div class="flex justify-center relative z-30">
            <div class="flex space-x-4">

              <div
                v-for="ketua in candidates.data"
                :key="ketua.id"
                class="w-[300px]"
              >
                <div
                  @click="selectOption(ketua.id)"
                  class="cursor-pointer rounded-[10px] border overflow-hidden relative"
                  :class="selectedOption == ketua.id
                    ? 'bg-[#00BF08] border-[#3BC541]'
                    : 'bg-primary-900 border-primary-800'"
                >

                  <!-- Background kecil untuk card -->
                  <div class="absolute inset-0 opacity-20">
                    <img
                      :src="getImageUrl(ketua.image)"
                      :alt="ketua.name + ' background'"
                      class="w-full h-full object-cover blur-sm"
                    />
                  </div>

                  <!-- Content depan -->
                  <div class="relative z-10">
                    <h4 class="text-title-2 py-5 text-center">
                      {{ ketua.order }}
                    </h4>

                    <div class="flex justify-center px-4">
                      <img
                        :src="getImageUrl(ketua.image)"
                        :alt="ketua.name"
                        class="w-full object-cover h-[300px] rounded-lg"
                        @error="handleImageError"
                      />
                    </div>

                    <div class="p-4 space-y-2 text-center">
                      <p :class="selectedOption == ketua.id ? 'text-[#B8E3B9]' : 'text-secondary'">
                        CALON KETUA UMUM
                      </p>

                      <div class="h-20 flex items-center justify-center break-words" lang="de">
                        <h5 class="text-xl font-bold uppercase">
                          {{ ketua.name }}
                        </h5>
                      </div>

                      <p :class="selectedOption == ketua.id ? 'text-[#B8E3B9]' : 'text-secondary'">
                        SISTEM INFORMASI {{ ketua.year_of_study }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- BUTTON VISI MISI -->
                <div class="flex justify-center mt-4">
                  <AppButton
                    class="border border-primary-800"
                    data-modal-target="visimisi-modal"
                    data-modal-toggle="visimisi-modal"
                    @click="getInfoKetua(ketua)"
                  >
                    Visi & Misi
                  </AppButton>
                </div>
              </div>
            </div>

            <!-- MODAL VISI MISI -->
            <div
              id="visimisi-modal"
              tabindex="-1"
              aria-hidden="true"
              class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-black/80"
            >
              <div class="relative p-4 w-full max-w-6xl max-h-full mx-0">
                <div class="relative bg-primary-950 rounded-2xl shadow">
                  <div class="p-8 flex">

                    <!-- KIRI (foto kandidat) -->
                    <div class="w-1/4">
                      <div
                        class="w-[220px] rounded-[10px] border text-center bg-primary-900 border-primary-800 overflow-hidden relative"
                      >

                        <div class="absolute inset-0 opacity-20">
                          <img
                            :src="getImageUrl(infoKetua?.image)"
                            :alt="infoKetua?.name + ' background'"
                            class="w-full h-full object-cover blur-sm"
                          />
                        </div>

                        <div class="relative z-10">
                          <h4 class="text-title-2 py-5">
                            {{ infoKetua?.order }}
                          </h4>
                          <img
                            :src="getImageUrl(infoKetua?.image)"
                            :alt="infoKetua?.name"
                            class="object-cover w-full h-[200px] object-center"
                            @error="handleImageError"
                          />

                          <div class="p-4 space-y-2">
                            <p class="text-secondary">CALON KETUA UMUM</p>

                            <div class="h-20 flex items-center justify-center break-words" lang="de">
                              <h5 class="text-xl font-bold uppercase">
                                {{ infoKetua?.name }}
                              </h5>
                            </div>

                            <p class="text-secondary">
                              SISTEM INFORMASI {{ infoKetua?.year_of_study }}
                            </p>

                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- KANAN (visi misi) -->
                    <div class="w-3/4 space-y-6 flex flex-col justify-center">
                      <div class="space-y-4">
                        <h3 class="text-title-2">Visi</h3>
                        <div class="text-secondary" v-html="infoKetua?.visi"></div>
                      </div>

                      <div class="space-y-4">
                        <h3 class="text-title-2">Misi</h3>
                        <div class="text-secondary" v-html="infoKetua?.misi"></div>
                      </div>
                    </div>

                  </div>
                </div>

                <div class="flex justify-center mt-5">
                  <AppButton data-modal-hide="visimisi-modal">Tutup</AppButton>
                </div>
              </div>
            </div>

          </div>

          <!-- BUTTON KIRIM -->
          <div class="flex justify-center">
            <AppButton
              class="border border-primary-800 flex items-center"
              :disabled="selectedOption == -1"
              @click="submitVote"
              variant="secondary"
            >
              <div role="status" v-if="voteLoading">
                <svg
                  aria-hidden="true"
                  class="w-4 h-4 text-white animate-spin fill-mediatek mr-2"
                  viewBox="0 0 100 101"
                >
                </svg>
              </div>
              Kirim Pilihan Saya
            </AppButton>
          </div>

        </AppContainer>
      </AppContentArea>
    </div>

  </div>
</template>

<script setup>
import { AppAlertConfirm, AppAlertSuccess, AppAlertError } from "#components";
import { initModals } from "flowbite";

definePageMeta({
  middleware: ["validate-vote-start"],
});

useHead({
  title: "Vote",
});

const alertStore = useAlertsStore();
const selectedOption = ref(-1);
const isVote = ref(useCookie("is-vote").value);
const infoKetua = ref();
const voteLoading = ref(false);

const { data: vote_settings } = await useAPI("/vote_setting", {
  pick: ["result"],
});

const { data: candidates } = await useAPI("/voting_candidate", {
  query: { sort: "order" },
  pick: ["data"],
});

const now = ref(new Date());
setInterval(() => now.value = new Date(), 1000);

const isVoteTime = computed(() => {
  return now.value > new Date(vote_settings.value.result.start_at).getTime();
});

const getImageUrl = (imageArray) => {
  if (imageArray && Array.isArray(imageArray) && imageArray.length > 0 && imageArray[0]?.url) {
    return imageArray[0].url;
  }
  return "https://placehold.co/600x400?text=No+Image";
};

const handleImageError = (e) => {
  e.target.src = "https://placehold.co/600x400?text=Image+Error";
};

const getInfoKetua = (ketua) => infoKetua.value = ketua;

const selectOption = (i) => {
  if (isVote.value) {
    alertStore.openModal({
      component: markRaw(AppAlertError),
      props: { text: "Anda sudah melakukan voting" },
    });
    return;
  }
  selectedOption.value = i;
};

const submitVote = async () => {
  if (now.value > new Date(vote_settings.value.result.end_at)) {
    alertStore.openModal({
      component: markRaw(AppAlertError),
      props: { text: "Vote telah ditutup" },
    });
    return;
  }

  await alertStore.openModal({
    component: markRaw(AppAlertConfirm),
    props: { text: "Apakah kamu yakin dengan pilihanmu?" },
  })
    .then(async (res) => {
      if (res) {
        voteLoading.value = true;

        const formData = createFormData({
          voting_candidate_id: selectedOption.value,
        });

        const { data: vote } = await useAPI("/vote", {
          method: "POST",
          headers: { Authorization: `Bearer ${useCookie("token").value}` },
          body: formData,
        });

        selectedOption.value = -1;

        if (vote.value.code !== 200) {
          alertStore.openModal({
            component: markRaw(AppAlertError),
            props: { text: vote.value.message },
          });
          voteLoading.value = false;
          return;
        }

        alertStore.openModal({
          component: markRaw(AppAlertSuccess),
          props: { text: vote.value.message },
        });

        useCookie("is-vote").value = true;
        isVote.value = true;
        voteLoading.value = false;
      }
    });
};

onMounted(() => initModals());
</script>

<style></style>
