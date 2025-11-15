<template>
  <div class="bg-primary-950 text-white min-h-screen relative">
    <!-- BACKGROUND HEADER -->
    <div class="absolute inset-0 z-0">
      <AppBackgroundHeader background-image="vote.jpeg" />
    </div>

    <!-- MAIN CONTENT -->
    <div class="relative z-20">
      <AppContentArea class="pt-6 px-4 md:px-8 lg:px-12">

        <!-- COUNTDOWN SECTION -->
        <AppContainer
          v-if="vote_settings?.result && !isVoteTime"
          class="pb-10 text-white min-h-[500px] flex flex-col justify-center items-center space-y-10 w-full max-w-3xl mx-auto"
        >
          <h1 class="text-title-1 text-center">Countdown :</h1>
          <AppCountdown
            :end="vote_settings.result.start_at"
            class="p-6 md:p-8 bg-black/70 rounded-xl w-full"
          />
        </AppContainer>

        <!-- VOTE SECTION -->
        <AppContainer
          v-if="vote_settings?.result && isVoteTime"
          class="pb-10 text-white w-full max-w-[1400px] mx-auto space-y-12"
        >
          <!-- TITLE + IMAGE ROW -->
          <div class="flex flex-col lg:flex-row justify-between items-center gap-10">
            <!-- LEFT TEXT -->
            <div class="text-left w-full lg:w-1/2">
              <h3 class="text-title-3 font-bold leading-relaxed text-center lg:text-left">
                PEMILIHAN KETUA UMUM <br />
                HIMPUNAN MAHASISWA SISTEM INFORMASI <br />
                UNIVERSITAS JEMBER <br />
                PERIODE 2025/2026
              </h3>
            </div>

            <!-- RIGHT: CANDIDATES LIST -->
            <div class="w-full lg:w-1/2 space-y-6">
              <div class="flex justify-center relative z-30 overflow-x-auto pb-2">
                <div class="flex space-x-5 max-w-full px-2">
                  <div
                    v-for="ketua in candidates?.data || []"
                    :key="ketua.id"
                    class="w-[260px] md:w-[300px] flex-shrink-0"
                  >
                    <div
                      @click="selectOption(ketua.id)"
                      class="cursor-pointer rounded-xl border relative overflow-hidden transition duration-200"
                      :class="selectedOption == ketua.id ? 'bg-[#00BF08] border-[#3BC541]' : 'bg-primary-900 border-primary-800'"
                    >
                      <!-- Card background blur -->
                      <div class="absolute inset-0 opacity-20">
                        <img :src="getImageUrl(ketua.image)" class="w-full h-full object-cover blur-sm" />
                      </div>

                      <!-- Card content -->
                      <div class="relative z-10">
                        <h4 class="text-title-2 py-4 text-center">{{ ketua.order }}</h4>

                        <div class="flex justify-center px-4">
                          <img
                            :src="getImageUrl(ketua.image)"
                            :alt="ketua.name"
                            class="w-full object-cover h-[260px] md:h-[300px] rounded-lg"
                            @error="handleImageError"
                          />
                        </div>

                        <div class="p-4 space-y-1 text-center">
                          <p :class="selectedOption == ketua.id ? 'text-[#B8E3B9]' : 'text-secondary'">CALON KETUA UMUM</p>

                          <h5 class="text-lg md:text-xl font-bold uppercase min-h-[50px] flex items-center justify-center">
                            {{ ketua.name }}
                          </h5>

                          <p :class="selectedOption == ketua.id ? 'text-[#B8E3B9]' : 'text-secondary'">
                            SISTEM INFORMASI {{ ketua.year_of_study }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- VISI MISI BUTTON -->
                    <div class="flex justify-center mt-4">
                      <AppButton
                        class="border border-primary-800 text-white hover:bg-[#FF7E1D] hover:text-black transition-colors duration-200 px-4 py-2 rounded-lg"
                        data-modal-target="visimisi-modal"
                        data-modal-toggle="visimisi-modal"
                        @click="getInfoKetua(ketua)"
                      >
                        Visi & Misi
                      </AppButton>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SUBMIT BUTTON -->
              <div class="flex justify-center">
                <AppButton
                  class="border text-white border-primary-800 px-6 py-3 rounded-lg flex items-center hover:bg-primary-700 transition"
                  :disabled="selectedOption == -1"
                  @click="submitVote"
                  variant="secondary"
                >
                  <div role="status" v-if="voteLoading">
                    <svg class="w-4 h-4 animate-spin mr-2" viewBox="0 0 100 101"></svg>
                  </div>
                  Kirim Pilihan Saya
                </AppButton>
              </div>
            </div>
          </div>
        </AppContainer>

      </AppContentArea>
    </div>
  </div>
</template>

<script setup>
import { AppAlertConfirm, AppAlertSuccess, AppAlertError } from "#components";
import { initModals } from "flowbite";

definePageMeta({ middleware: ["validate-vote-start"] });
useHead({ title: "Vote" });

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
setInterval(() => (now.value = new Date()), 1000);

const isVoteTime = computed(() => {
  if (!vote_settings?.value?.result) return false;
  return now.value > new Date(vote_settings.value.result.start_at).getTime();
});

const getImageUrl = (imageArray) => {
  if (
    imageArray &&
    Array.isArray(imageArray) &&
    imageArray.length > 0 &&
    imageArray[0]?.url
  )
    return imageArray[0].url;
  return "https://placehold.co/600x400?text=No+Image";
};
const handleImageError = (e) => {
  e.target.src = "https://placehold.co/600x400?text=Image+Error";
};
const getInfoKetua = (ketua) => (infoKetua.value = ketua);

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

  await alertStore
    .openModal({
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
