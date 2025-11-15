<!-- Kandidat harus berada di depan background -->
<div class="relative z-20 flex justify-center mt-10">
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
          <!-- Background Image (di belakang card) -->
          <div class="absolute inset-0 opacity-20">
            <img
              :src="getImageUrl(ketua.image)"
              :alt="ketua.name + ' background'"
              class="w-full h-full object-cover blur-sm"
            />
          </div>

          <!-- Content card -->
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

    <!-- Modal -->
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

                    <div class="h-20 flex items-center justify-center break-words">
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
  </template>
</div>
