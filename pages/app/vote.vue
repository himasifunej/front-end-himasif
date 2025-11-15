<template>
  <div class="relative w-full min-h-screen bg-primary-950 text-white overflow-hidden">
    <!-- BACKGROUND IMAGE -->
    <div class="absolute inset-0 z-0">
      <NuxtImg src="/vote.jpeg" class="w-full h-full object-cover opacity-40" />
    </div>

    <!-- FOREGROUND CONTENT -->
    <div class="relative z-20 pt-20 lg:pt-32 pb-10">
      <AppContainer>

        <!-- ================= HEADER ================= -->
        <div class="flex flex-col lg:flex-row justify-between items-center lg:items-start">
          
          <!-- TEXT -->
          <div class="text-center lg:text-left max-w-xl space-y-3">
            <h1 class="text-title-1">HIMASIF VOTE</h1>
            <h2 class="text-title-3">PEMILIHAN KETUA UMUM</h2>
          </div>

          <!-- IMAGE ON THE RIGHT -->
          <div class="mt-5 lg:mt-0 lg:ml-10">
            <NuxtImg src="/vote-icon.png" class="w-[200px] h-[200px] object-contain" />
          </div>

        </div>

        <!-- ================= KANDIDAT ================= -->
        <div class="mt-10 lg:mt-16" v-if="isVote == 0">

          <div class="flex flex-wrap gap-6 justify-center lg:justify-start">

            <div
              v-for="ketua in candidates.data"
              :key="ketua.id"
              class="w-[220px] relative z-30"
            >
              <div
                @click="selectOption(ketua.id)"
                class="cursor-pointer rounded-2xl border text-center"
                :class="
                  selectedOption === ketua.id
                    ? 'bg-[#007A05] border-[#71C475]'
                    : 'border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark hover:bg-card-hover dark:hover:bg-card-hover-dark'
                "
              >
                <h4 class="text-title-2 py-5">{{ ketua.order }}</h4>

                <NuxtImg
                  :src="'https://placehold.co/600x400?text=Not+Found'"
                  class="w-full object-cover h-[300px]"
                />

                <div class="p-4 space-y-2">
                  <p
                    class="text-deskripsi"
                    :class="selectedOption === ketua.id
                      ? 'text-text-primary-dark'
                      : 'text-text-secondary dark:text-text-secondary-dark'"
                  >
                    CALON KETUA UMUM
                  </p>

                  <div class="h-16 flex items-center justify-center break-words">
                    <h5
                      class="text-title-4 uppercase"
                      :class="selectedOption === ketua.id
                        ? 'text-text-primary-dark'
                        : 'text-text-primary dark:text-text-primary-dark'"
                    >
                      {{ ketua.name }}
                    </h5>
                  </div>

                  <p
                    class="text-deskripsi"
                    :class="selectedOption === ketua.id
                      ? 'text-text-primary-dark'
                      : 'text-text-secondary dark:text-text-secondary-dark'"
                  >
                    SISTEM INFORMASI {{ ketua.year_of_study }}
                  </p>
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <AppButtonPrimary
                  data-modal-target="visimisi-modal"
                  data-modal-toggle="visimisi-modal"
                  @click="getInfoKetua(ketua)"
                >
                  Visi & Misi
                </AppButtonPrimary>
              </div>
            </div>
          </div>

          <!-- ================= BUTTON KIRIM ================= -->
          <div class="flex justify-center mt-10">
            <AppButtonSecondary
              class="border border-primary-800 flex items-center dark:border-primary-700"
              :disabled="selectedOption === -1"
              @click="submitVote"
              variant="secondary"
            >
              <div role="status" v-if="voteLoading">
                <svg
                  aria-hidden="true"
                  class="w-4 h-4 text-text-primary dark:text-text-primary-dark animate-spin fill-mediatek mr-2"
                  viewBox="0 0 100 101"
                ></svg>
              </div>
              Kirim Pilihan Saya
            </AppButtonSecondary>
          </div>

        </div>

      </AppContainer>
    </div>

  </div>
</template>

<script setup>
// TARUH LOGIKA-MU DI SINI
</script>
