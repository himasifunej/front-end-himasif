<template>
  <div class="relative w-full min-h-screen bg-primary-950 text-white overflow-hidden">
    <!-- BACKGROUND IMAGE (LOWEST LAYER) -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <NuxtImg
        src="/vote.jpeg"
        class="w-full h-full object-cover"
        alt="background vote"
      />
      <!-- optional dark overlay -->
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <!-- FOREGROUND CONTENT (HIGHER Z) -->
    <div class="relative z-20">
      <AppContentArea class="pt-10 lg:pt-16 pb-20">

        <!-- HEADER: TEKS + IKON (SEJAJAR) -->
        <AppContainer class="w-11/12 lg:w-2/3 mx-auto pb-6">
          <div class="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6">
            <!-- TEXT LEFT -->
            <div class="text-center lg:text-left max-w-xl space-y-2">
              <p class="text-title-2 font-bold">
                PEMILIHAN KETUA UMUM
              </p>
              <p class="text-title-3 font-semibold">
                HIMPUNAN MAHASISWA SISTEM INFORMASI
              </p>
              <p class="text-title-3 font-semibold">
                UNIVERSITAS JEMBER
              </p>
              <p class="text-title-4 font-medium">
                PERIODE 2025/2026
              </p>
            </div>

            <!-- IMAGE RIGHT -->
            <div class="flex-shrink-0">
              <NuxtImg
                src="/vote-icon.png"
                alt="vote icon"
                class="w-36 h-36 lg:w-48 lg:h-48 object-contain"
              />
            </div>
          </div>
        </AppContainer>

        <!-- COUNTDOWN (if not started) -->
        <AppContainer
          v-if="!isVoteTime"
          class="w-11/12 lg:w-2/3 mx-auto pb-8 text-white h-[420px] flex flex-col justify-center"
        >
          <h1 class="text-title-1 text-center mb-4">Countdown :</h1>
          <AppCountdown
            :end="vote_settings.result.start_at"
            class="mx-auto p-8 bg-black/60 rounded"
          />
        </AppContainer>

        <!-- VOTE SECTION (if voting) -->
        <AppContainer
          v-if="isVoteTime"
          class="w-11/12 lg:w-2/3 mx-auto pb-10 text-white"
        >
          <!-- Title (centered above cards on small) -->
          <div class="text-center mb-6 lg:mb-10">
            <h3 class="text-title-2">
              PEMILIHAN KETUA UMUM <br />
              HIMPUNAN MAHASISWA SISTEM INFORMASI <br />
              UNIVERSITAS JEMBER <br />
              PERIODE 2025/2026
            </h3>
          </div>

          <!-- CARDS ROW: ensure z above background -->
          <div class="relative z-30">
            <div class="flex flex-wrap justify-center gap-6">
              <div
                v-for="ketua in candidates.data"
                :key="ketua.id"
                class="w-[300px] flex flex-col items-stretch"
              >
                <div
                  @click="selectOption(ketua.id)"
                  class="cursor-pointer rounded-xl border overflow-hidden relative shadow-lg"
                  :class="selectedOption == ketua.id
                    ? 'bg-[#00BF08] border-[#3BC541]'
                    : 'bg-primary-900 border-primary-800'"
                >
                  <!-- small bg inside card -->
                  <div class="absolute inset-0 opacity-20 pointer-events-none">
                    <img
                      :src="getImageUrl(ketua.image)"
                      :alt="ketua.name + ' bg'"
                      class="w-full h-full object-cover blur-sm"
                    />
                  </div>

                  <!-- content -->
                  <div class="relative z-10 p-0">
                    <h4 class="text-title-2 py-4 text-center">{{ ketua.order }}</h4>

                    <div class="px-4">
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

                      <div class="h-20 flex items-center justify-center break-words">
                        <h5 class="text-xl font-bold uppercase">{{ ketua.name }}</h5>
                      </div>

                      <p :class="selectedOption == ketua.id ? 'text-[#B8E3B9]' : 'text-secondary'">
                        SISTEM INFORMASI {{ ketua.year_of_study }}
                      </p>
                    </div>
                  </div>
                </div>

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
            <Teleport to="body">
              <div
                id="visimisi-modal"
                tabindex="-1"
                aria-hidden="true"
                class="hidden overflow-y-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              >
                <div class="w-full max-w-6xl">
                  <div class="bg-primary-950 rounded-2xl p-8 shadow-lg">
                    <div class="flex flex-col md:flex-row gap-6">
                      <div class="md:w-1/3">
                        <div class="relative rounded-lg overflow-hidden border">
                          <div class="absolute inset-0 opacity-20">
                            <img
                              :src="getImageUrl(infoKetua?.image)"
                              :alt="infoKetua?.name + ' bg'"
                              class="w-full h-full object-cover blur-sm"
                            />
                          </div>
                          <div class="relative z-10 p-4 text-center">
                            <h4 class="text-title-2 mb-4">{{ infoKetua?.order }}</h4>
                            <img
                              :src="getImageUrl(infoKetua?.image)"
                              :alt="infoKetua?.name"
                              class="w-full h-[220px] object-cover rounded"
                              @error="handleImageError"
                            />
                            <div class="mt-4">
                              <p class="text-secondary">CALON KETUA UMUM</p>
                              <h5 class="text-title-5 uppercase mt-2">{{ infoKetua?.name }}</h5>
                              <p class="text-secondary mt-1">SISTEM INFORMASI {{ infoKetua?.year_of_study }}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="md:w-2/3 flex flex-col justify-center">
                        <div class="mb-6">
                          <h3 class="text-title-2">Visi</h3>
                          <div class="text-secondary mt-2" v-html="infoKetua?.visi"></div>
                        </div>
                        <div>
                          <h3 class="text-title-2">Misi</h3>
                          <div class="text-secondary mt-2" v-html="infoKetua?.misi"></div>
                        </div>
                      </div>
                    </div>
                    <div class="flex justify-center mt-6">
                      <AppButton data-modal-hide="visimisi-modal">Tutup</AppButton>
                    </div>
                  </div>
                </div>
              </div>
            </Teleport>

            <!-- BUTTON SUBMIT -->
            <div class="flex justify-center mt-8">
              <AppButton
                class="border border-primary-800 flex items-center"
                :disabled="selectedOption == -1"
                @click="submitVote"
                variant="secondary"
              >
                <div role="status" v-if="voteLoading" class="mr-2">
                  <svg aria-hidden="true" class="w-4 h-4 animate-spin" viewBox="0 0 100 101">
                    <!-- svg simplified -->
                    <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="8" fill="none"></circle>
                  </svg>
                </div>
                Kirim Pilihan Saya
              </AppButton>
            </div>
          </div>
        </div>
      </AppContainer>
    </div>
  </div>
</template>

<script setup>
import { AppAlertConfirm, AppAlertSuccess, AppAlertError } from "#components";
import { initModals } from "flowbite";

definePageMeta({
  middleware: ["validate-vote-start"],
});

useHead({ title: "Vote" });

const alertStore = useAlertsStore();
const selectedOption = ref(-1);
const isVote = ref(useCookie("is-vote").value || 0);
const infoKetua = ref(null);
const voteLoading = ref(false);

const { data: vote_settings } = await useAPI("/vote_setting", { pick: ["result"] });
const { data: candidates } = await useAPI("/voting_candidate", { query: { sort: "order" }, pick: ["data"] });

const now = ref(new Date());
setInterval(() => (now.value = new Date()), 1000);

const isVoteTime = computed(() => {
  if (!vote_settings.value || !vote_settings.value.result) return false;
  return now.value > new Date(vote_settings.value.result.start_at).getTime();
});

const getImageUrl = (imageArray) => {
  if (!imageArray) return "https://placehold.co/600x400?text=No+Image";
  if (Array.isArray(imageArray) && imageArray.length > 0 && imageArray[0]?.url) return imageArray[0].url;
  if (typeof imageArray === "string") return imageArray;
  return "https://placehold.co/600x400?text=No+Image";
};

const handleImageError = (e) => {
  e.target.src = "https://placehold.co/600x400?text=Image+Error";
};

const getInfoKetua = (ketua) => {
  infoKetua.value = ketua;
};

const selectOption = (i) => {
  if (isVote.value) {
    alertStore.openModal({ component: markRaw(AppAlertError), props: { text: "Anda sudah melakukan voting" } });
    return;
  }
  selectedOption.value = i;
};

const submitVote = async () => {
  if (!vote_settings.value) {
    alertStore.openModal({ component: markRaw(AppAlertError), props: { text: "Pengaturan vote belum tersedia." } });
    return;
  }

  if (now.value > new Date(vote_settings.value.result.end_at)) {
    alertStore.openModal({ component: markRaw(AppAlertError), props: { text: "Vote telah ditutup" } });
    return;
  }

  const res = await alertStore.openModal({ component: markRaw(AppAlertConfirm), props: { text: "Apakah kamu yakin dengan pilihanmu?" } });
  if (!res) return;

  voteLoading.value = true;
  try {
    const formData = createFormData({ voting_candidate_id: selectedOption.value });
    const { data: vote } = await useAPI("/vote", {
      method: "POST",
      headers: { Authorization: `Bearer ${useCookie("token").value}` },
      body: formData,
    });

    selectedOption.value = -1;
    if (vote.value.code !== 200) {
      alertStore.openModal({ component: markRaw(AppAlertError), props: { text: vote.value.message } });
      voteLoading.value = false;
      return;
    }

    alertStore.openModal({ component: markRaw(AppAlertSuccess), props: { text: vote.value.message } });
    useCookie("is-vote").value = 1;
    isVote.value = 1;
  } catch (err) {
    console.error(err);
    alertStore.openModal({ component: markRaw(AppAlertError), props: { text: "Terjadi kesalahan. Coba lagi." } });
  } finally {
    voteLoading.value = false;
  }
};

onMounted(() => initModals());
</script>

<style></style>
