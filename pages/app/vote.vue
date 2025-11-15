<template>
  <div class="relative w-full min-h-[160vh] bg-primary-950 text-white overflow-hidden">

    <!-- BACKGROUND IMAGE (LOWEST LAYER) -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <NuxtImg
        src="/vote.jpeg"
        class="w-full h-full object-cover"
        alt="background vote"
      />
      <div class="absolute inset-0 bg-black/40"></div>
    </div>

    <!-- FOREGROUND CONTENT -->
    <div class="relative z-20">
      <AppContentArea class="pt-10 lg:pt-16 pb-20">
        <!-- HEADER TEXT + IMAGE SEJARAH -->
        <AppContainer class="w-11/12 lg:w-2/3 mx-auto pb-6">
          <div class="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6">
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
            <div class="flex-shrink-0">
              <NuxtImg
                src="/vote-icon.png"
                alt="vote icon"
                class="w-36 h-36 lg:w-48 lg:h-48 object-contain"
              />
            </div>
          </div>
        </AppContainer>

        <!-- COUNTDOWN -->
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

        <!-- VOTE SECTION -->
        <AppContainer
          v-if="isVoteTime"
          class="w-11/12 lg:w-2/3 mx-auto pb-10 text-white"
        >
          <!-- Title -->
          <div class="text-center mb-6 lg:mb-10">
            <h3 class="text-title-2">
              PEMILIHAN KETUA UMUM <br />
              HIMPUNAN MAHASISWA SISTEM INFORMASI <br />
              UNIVERSITAS JEMBER <br />
              PERIODE 2025/2026
            </h3>
          </div>

          <!-- Cards -->
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
                  <div class="absolute inset-0 opacity-20 pointer-events-none">
                    <img
                      :src="getImageUrl(ketua.image)"
                      :alt="ketua.name + ' bg'"
                      class="w-full h-full object-cover blur-sm"
                    />
                  </div>
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
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center mt-8">
            <AppButton
              class="border border-primary-800 flex items-center"
              :disabled="selectedOption == -1"
              @click="submitVote"
              variant="secondary"
            >
              Kirim Pilihan Saya
            </AppButton>
          </div>
        </AppContainer>
      </AppContentArea>
    </div>
  </div>
</template>
