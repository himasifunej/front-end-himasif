<template>
  <div class="bg-primary-950 text-white min-h-screen">
    <AppBackgroundHeader background-image="vote.jpeg" />

    <AppContentArea class="pt-4">
      <AppContainer
        class="pb-5 text-white h-[500px] flex flex-col justify-center w-2/3 space-y-10"
        v-if="!isVoteTime"
      >
        <h1 class="text-title-1 text-center">Countdown :</h1>
        <AppCountdown
          :end="vote_settings.result.start_at"
          class="p-8 bg-black/75 rounded"
          v-if="!isVoteTime"
        ></AppCountdown>
      </AppContainer>

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

        <div class="flex justify-center">

        </div>

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
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
            Kirim Pilihan Saya
          </AppButton>
        </div>
      </AppContainer>
    </AppContentArea>
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

var d = new Date();
d.setSeconds(d.getSeconds() + 10);

const { data: vote_settings } = await useAPI("/vote_setting", {
  pick: ["result"],
});

const { data: candidates } = await useAPI("/voting_candidate", {
  query: {
    sort: "order",
  },
  pick: ["data"],
});

const now = ref(new Date());

const updateDate = () => {
  now.value = new Date();
};
setInterval(updateDate, 1000);

const isVoteTime = computed(() => {
  return now.value > new Date(vote_settings.value.result.start_at).getTime();
});

// Helper function to safely get image URL
const getImageUrl = (imageArray) => {
  if (
    imageArray &&
    Array.isArray(imageArray) &&
    imageArray.length > 0 &&
    imageArray[0]?.url
  ) {
    return imageArray[0].url;
  }
  return "https://placehold.co/600x400?text=No+Image";
};

// Handle image loading errors
const handleImageError = (event) => {
  console.error("Image failed to load:", event.target.src);
  event.target.src = "https://placehold.co/600x400?text=Image+Error";
};

const getInfoKetua = (ketua) => {
  infoKetua.value = ketua;
};

const selectOption = function (i) {
  if (isVote.value) {
    alertStore.openModal({
      component: markRaw(AppAlertError),
      props: {
        text: "Anda sudah melakukan voting",
      },
    });
    return;
  }

  if (!isVote.value) {
    selectedOption.value = i;
  }
};

const submitVote = async function () {
  if (now.value > new Date(vote_settings.value.result.end_at)) {
    alertStore.openModal({
      component: markRaw(AppAlertError),
      props: {
        text: "Halo Sisforians, Maaf vote telah ditutup",
      },
    });
    return;
  }

  await alertStore
    .openModal({
      component: markRaw(AppAlertConfirm),
      props: {
        text: "Apakah kamu yakin dengan pilihanmu?",
      },
    })
    .then(async (res) => {
      if (res) {
        voteLoading.value = true;
        const formData = createFormData({
          voting_candidate_id: selectedOption.value,
        });
        const { data: vote } = await useAPI("/vote", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
          },
          body: formData,
        });

        selectedOption.value = -1;

        if (vote.value.code !== 200) {
          alertStore.openModal({
            component: markRaw(AppAlertError),
            props: {
              text: vote.value.message,
            },
          });
          voteLoading.value = false;
          return;
        }

        alertStore.openModal({
          component: markRaw(AppAlertSuccess),
          props: {
            text: vote.value.message,
          },
        });
        useCookie("is-vote").value = true;
        isVote.value = true;
        voteLoading.value = false;
      }
    })
    .catch(() => {});
};

onMounted(() => {
  initModals();
});
</script>

<style></style>
