<template>
  <div class="bg-[#111111] text-white min-h-screen relative">
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
          <!-- TITLE -->
          <div class="flex justify-center w-full">
            <div
              class="inline-block px-6 py-4 bg-black/50 backdrop-blur-md rounded-lg text-center"
            >
              <h3 class="text-title-3 font-bold leading-relaxed">
                PEMILIHAN KETUA UMUM <br />
                HIMPUNAN MAHASISWA SISTEM INFORMASI <br />
                UNIVERSITAS JEMBER <br />
                PERIODE 2025/2026
              </h3>
            </div>
          </div>

          <!-- CANDIDATES LIST -->
          <div class="flex justify-center relative z-30 overflow-x-auto pb-2">
            <div class="flex space-x-5 max-w-full px-2">
              <div
                v-for="ketua in candidates?.data || []"
                :key="ketua.id"
                class="w-[260px] md:w-[300px] flex-shrink-0"
              >
                <!-- Candidate Card -->
                <div
                  @click="selectOption(ketua.id)"
                  class="cursor-pointer rounded-xl border relative overflow-hidden transition duration-200"
                  :class="
                    selectedOption == ketua.id
                      ? 'bg-[#00BF08] border-[#3BC541]'
                      : 'bg-primary-900 border-primary-800'
                  "
                >
                  <!-- Background blur -->
                  <div class="absolute inset-0 opacity-20">
                    <img
                      :src="getImageUrl(ketua.image)"
                      class="w-full h-full object-cover blur-sm"
                    />
                  </div>

<!-- Circle background dengan nomor urut -->
<div
  class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center z-20 shadow-lg"
>
  <span class="text-black font-bold text-xl">{{ ketua.order }}</span>
</div>

<!-- Content -->
                  <div class="relative z-10 mt-10">
                    <!-- tambah margin-top agar konten tidak tertutup lingkaran -->
                    <div class="flex justify-center px-4">
                      <img
                        :src="getImageUrl(ketua.image)"
                        :alt="ketua.name"
                        class="w-full object-cover h-[260px] md:h-[300px] rounded-lg"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="p-4 space-y-1 text-center">
                      <p
                        :class="
                          selectedOption == ketua.id
                            ? 'text-[#B8E3B9]'
                            : 'text-secondary'
                        "
                      >
                        CALON KETUA UMUM
                      </p>
                      <h5
                        class="text-lg md:text-xl font-bold uppercase min-h-[50px] flex items-center justify-center"
                      >
                        {{ ketua.name }}
                      </h5>
                      <p
                        :class="
                          selectedOption == ketua.id
                            ? 'text-[#B8E3B9]'
                            : 'text-secondary'
                        "
                      >
                        SISTEM INFORMASI {{ ketua.year_of_study }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Visi & Misi Button -->
                <div class="flex justify-center mt-4">
                  <AppButton
                    class="border border-primary-800 text-white hover:bg-[#FF7E1D] hover:text-black transition-colors duration-200 px-4 py-2 rounded-lg"
                    @click="openModal(ketua)"
                  >
                    Visi & Misi
                  </AppButton>
                </div>
              </div>
            </div>
          </div>

          <!-- SUBMIT VOTE BUTTON -->
          <div class="flex justify-center mt-8">
            <AppButton
              class="border text-white border-primary-800 px-6 py-3 rounded-lg flex items-center hover:bg-primary-700 transition"
              :disabled="selectedOption == -1"
              @click="submitVote"
              variant="secondary"
            >
              <div role="status" v-if="voteLoading">
                <svg
                  class="w-4 h-4 animate-spin mr-2"
                  viewBox="0 0 100 101"
                ></svg>
              </div>
              Kirim Pilihan Saya
            </AppButton>
          </div>
        </AppContainer>
      </AppContentArea>
    </div>
 
    <!-- MODAL VISI & MISI -->
    <div
      id="visimisi-modal"
      tabindex="-1"
      aria-hidden="true"
      class="hidden overflow-y-auto fixed inset-0 z-50 flex justify-center items-center bg-black/80"
    >
      <div class="relative p-4 w-full max-w-6xl max-h-full">
        <div
          class="relative bg-primary-950 rounded-2xl shadow-lg p-8 flex flex-col lg:flex-row gap-6"
        >
          <!-- KIRI: Foto kandidat -->
          <div class="w-full lg:w-1/4">
            <div
              class="w-full rounded-xl border relative overflow-hidden bg-primary-900 border-primary-800 text-center"
            >
              <div class="absolute inset-0 opacity-20">
                <img
                  :src="getImageUrl(infoKetua?.image)"
                  class="w-full h-full object-cover blur-sm"
                />
              </div>
              <div class="relative z-10">
                <h4 class="text-title-2 py-4">{{ infoKetua?.order }}</h4>
                <img
                  :src="getImageUrl(infoKetua?.image)"
                  class="w-full h-[200px] object-cover rounded-lg"
                />
                <div class="p-4 space-y-2">
                  <p class="text-secondary">CALON KETUA UMUM</p>
                  <h5 class="text-xl font-bold uppercase">
                    {{ infoKetua?.name }}
                  </h5>
                  <p class="text-secondary">
                    SISTEM INFORMASI {{ infoKetua?.year_of_study }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- KANAN: Visi & Misi -->
          <div class="w-full lg:w-3/4 flex flex-col justify-center gap-6">
            <div>
              <h3 class="text-title-2">Visi</h3>
              <div class="text-secondary" v-html="infoKetua?.visi"></div>
            </div>
            <div>
              <h3 class="text-title-2">Misi</h3>
              <div class="text-secondary" v-html="infoKetua?.misi"></div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-5">
          <AppButton @click="modalInstance.hide()">Tutup</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from "flowbite";
import { AppAlertConfirm, AppAlertSuccess, AppAlertError } from "#components";

definePageMeta({ middleware: ["validate-vote-start"] });
useHead({ title: "Vote" });

const alertStore = useAlertsStore();
const selectedOption = ref(-1);
const infoKetua = ref();
const voteLoading = ref(false);
const modalInstance = ref(null);

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
const handleImageError = (e) =>
  (e.target.src = "https://placehold.co/600x400?text=Image+Error");

const selectOption = (id) => {
  selectedOption.value = id;
};

// Buka modal & set kandidat
const openModal = (ketua) => {
  infoKetua.value = ketua;
  modalInstance.value.show();
};

onMounted(() => {
  const modalEl = document.getElementById("visimisi-modal");
  modalInstance.value = new Modal(modalEl, { placement: "center" });
});

const submitVote = async () => {
  if (!vote_settings?.value?.result) return;
  if (now.value > new Date(vote_settings.value.result.end_at)) {
    alertStore.openModal({
      component: markRaw(AppAlertError),
      props: { text: "Vote telah ditutup" },
    });
    return;
  }

  const res = await alertStore.openModal({
    component: markRaw(AppAlertConfirm),
    props: { text: "Apakah kamu yakin dengan pilihanmu?" },
  });

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
    voteLoading.value = false;

    if (vote.value.code === 200) {
      useCookie("is-vote").value = true;
      alertStore.openModal({
        component: markRaw(AppAlertSuccess),
        props: { text: vote.value.message },
      });
    } else {
      alertStore.openModal({
        component: markRaw(AppAlertError),
        props: { text: vote.value.message },
      });
    }
  }
};
</script>

<style>
/* tambahan kecil untuk overflow scroll horizontal kandidat */
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}
</style>
