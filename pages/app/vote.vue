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
          <template>
            <div class="flex space-x-4">
              <div
                v-for="ketua in candidates.data"
                :key="ketua.id"
                class="w-[300px]"
              >
                <div
                  @click="selectOption(ketua.id)"
                  class="cursor-pointer rounded-[10px] border overflow-hidden relative"
                  :class="
                    selectedOption == ketua.id
                      ? 'bg-[#00BF08] border-[#3BC541]'
                      : 'bg-primary-900 border-primary-800'
                  "
                >
                  <div class="absolute inset-0 opacity-20">
                    <img
                      :src="getImageUrl(ketua.image)"
                      :alt="ketua.name + ' background'"
                      class="w-full h-full object-cover blur-sm"
                    />
                  </div>
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
                      <p
                        :class="
                          selectedOption == ketua.id
                            ? 'text-[#B8E3B9]'
                            : 'text-secondary'
                        "
                      >
                        CALON KETUA UMUM
                      </p>
                      <div
                        class="h-20 flex items-center justify-center break-words"
                        lang="de"
                      >
                        <h5 class="text-xl font-bold uppercase">
                          {{ ketua.name }}
                        </h5>
                      </div>
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
            <div
              id="visimisi-modal"
              tabindex="-1"
              aria-hidden="true"
              class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full bg-black/80"
            >
              <div class="relative p-4 w-full max-w-6xl max-h-full mx-0">
                <div class="relative bg-primary-950 rounded-2xl shadow">
                  <div class="p-8 flex">
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
                            <div
                              class="h-20 flex items-center justify-center break-words"
                              lang="de"
                            >
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
                    <div
                      class="w-3/4 space-y-6 flex flex-col justify-center"
                    >
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
          </template>
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