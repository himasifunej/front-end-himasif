<template>
  <div class="bg-primary-950 text-white min-h-screen pb-20">

    <!-- ====================== HEADER 2 KOLOM ====================== -->
    <div class="flex flex-col lg:flex-row items-start justify-between w-full px-10 pt-16">

      <!-- TEKS KIRI -->
      <div class="flex-1 space-y-4">
        <h1 class="text-4xl lg:text-6xl font-bold leading-tight">
          HIMASIF
        </h1>

        <h2 class="text-3xl lg:text-5xl font-semibold">
          Vote Pemilihan Ketua Umum
        </h2>

        <p class="text-text-secondary text-lg lg:text-xl">
          Pilih calon terbaik untuk masa depan HIMASIF.
        </p>
      </div>

      <!-- KANAN: LIST CALON -->
      <div class="flex-1 mt-10 lg:mt-0">

        <div class="flex space-x-4 justify-center lg:justify-end">

          <div v-for="ketua in candidates.data" :key="ketua.id" class="w-[200px] relative z-30">

            <!-- CARD -->
            <div
              @click="selectOption(ketua.id)"
              class="cursor-pointer rounded-2xl border text-center"
              :class="selectedOption == ketua.id
                ? 'bg-[#007A05] border-[#71C475]'
                : 'border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark hover:bg-card-hover dark:hover:bg-card-hover-dark'"
            >
              <h4 class="text-title-2 py-5">{{ ketua.order }}</h4>

              <NuxtImg
                :src="'https://placehold.co/600x400?text=Not+Found'"
                height="250"
                class="w-full object-cover h-[300px]"
              />

              <div class="p-4 space-y-2">
                <p
                  class="text-deskripsi"
                  :class="selectedOption == ketua.id
                    ? 'text-text-primary-dark'
                    : 'text-text-secondary dark:text-text-secondary-dark'"
                >
                  CALON KETUA UMUM
                </p>

                <div class="h-16 flex items-center justify-center break-words" lang="de">
                  <h5
                    class="text-title-4 uppercase"
                    :class="selectedOption == ketua.id
                      ? 'text-text-primary-dark'
                      : 'text-text-primary dark:text-text-primary-dark'"
                  >
                    {{ ketua.name }}
                  </h5>
                </div>

                <p
                  class="text-deskripsi"
                  :class="selectedOption == ketua.id
                    ? 'text-text-primary-dark'
                    : 'text-text-secondary dark:text-text-secondary-dark'"
                >
                  SISTEM INFORMASI {{ ketua.year_of_study }}
                </p>
              </div>
            </div>

            <!-- BUTTON VISI MISI -->
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

      </div>
    </div>

    <!-- ==================== BUTTON KIRIM ==================== -->
    <div class="flex justify-center mt-12">
      <AppButtonSecondary
        class="border border-primary-800 flex items-center dark:border-primary-700"
        :disabled="selectedOption == -1"
        @click="submitVote"
        variant="secondary"
      >
        <div role="status" v-if="voteLoading">
          <svg aria-hidden="true" class="w-4 h-4 text-text-primary dark:text-text-primary-dark animate-spin fill-mediatek mr-2"
            viewBox="0 0 100 101">
          </svg>
        </div>
        Kirim Pilihan Saya
      </AppButtonSecondary>
    </div>


    <!-- ====================== MODAL VISI MISI ====================== -->
    <Teleport to="body">

      <div
        id="visimisi-modal"
        tabindex="-1"
        aria-hidden="true"
        class="hidden overflow-y-auto fixed top-0 right-0 left-0 z-40 justify-center items-center h-screen bg-black/80"
      >
        <div class="relative p-4 w-full max-w-6xl mx-0">

          <div class="relative bg-bg-primary dark:bg-bg-primary-dark border border-border-primary dark:border-border-primary-dark rounded-2xl shadow">
            <div class="p-8 flex justify-between">

              <!-- FOTO -->
              <div class="w-1/3 hidden md:block">
                <div class="w-full rounded-[10px]">
                  <div class="relative">

                    <h4 class="text-title-1 top-0 left-0 p-5 absolute">{{ infoKetua?.order }}</h4>

                    <NuxtImg
                      :src="'https://placehold.co/600x400?text=Not+Found'"
                      height="400"
                      width="400"
                      class="h-[400px] w-full object-cover"
                    />

                    <div class="p-4 absolute bottom-0">
                      <p class='text-deskripsi text-text-secondary dark:text-text-secondary-dark'>
                        CALON KETUA UMUM
                      </p>
                      <div class="break-words" lang="de">
                        <h5 class="text-title-5 uppercase text-text-primary dark:text-text-primary-dark">
                          {{ infoKetua?.name }}
                        </h5>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <!-- VISI MISI -->
              <div class="md:w-3/5 space-y-6 flex flex-col justify-center">

                <!-- Mobile -->
                <div class="block md:hidden">
                  <h4 class="text-[60px] font-semibold leading-[55px] text-text-primary dark:text-text-primary-dark">
                    {{ infoKetua?.order }}
                  </h4>

                  <div class="py-2 text-left">
                    <p class='text-deskripsi text-text-secondary dark:text-text-secondary-dark'>CALON KETUA UMUM</p>
                    <div class="break-words" lang="de">
                      <h5 class="text-title-5 uppercase text-text-primary dark:text-text-primary-dark">
                        {{ infoKetua?.name }}
                      </h5>
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
                <span class="absolute top-1/2 left-1/2 w-[15px] h-[2px] bg-bg-primary-dark transform -translate-x-1/2 -translate-y-1/2 rotate-45"></span>
                <span class="absolute top-1/2 left-1/2 w-[15px] h-[2px] bg-bg-primary-dark transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></span>
              </span>
            </AppButtonCircle>
          </div>

        </div>
      </div>

    </Teleport>

  </div>
</template>
