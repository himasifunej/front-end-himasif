<template>
    <div class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark">
        <section id="banner" class="">
            <div class="w-full h-[40vh] md:h-[60vh] lg:h-[80vh] relative flex text-center justify-center">
                <div
                    class="h-3/4 w-full bg-gradient-to-t from-bg-primary dark:from-bg-primary-dark to-transparent -bottom-1 absolute z-10">
                </div>
                <NuxtImg :src="pageData.result.banners[0].image_behind[0].url" sizes="1000"
                    class="object-cover absolute top-0 left-0 h-full w-full" alt="profile image" />


                <!-- content here -->
                <div
                    class="relative -bottom-8 md:bottom-0 z-20 md:mb-0 md:pb-5 lg:container lg:px-8 text-text-primary dark:text-text-primary-dark h-full flex flex-col justify-end">

                    <div class="md:flex-grow pt-20">
                        <NuxtImg :src="pageData.result.banners[0].image_front[0].url" width="1000"
                            class="mx-auto w-[975px]" alt="">
                        </NuxtImg>

                        <button id="year-dropdown-trigger" data-dropdown-toggle="year-dropdown"
                            ref="yearDropdownTrigger"
                            class="hidden py-2 px-2.5 text-deskripsi-sm md:text-deskripsi text-text-primary dark:text-text-primary-dark rounded-lg focus:z-10 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#0D0D0D] dark:disabled:text-text-secondary-dark dark:disabled:bg-[#0D0D0D] disabled:text-text-secondary lg:inline-flex items-center text-center bg-card-hover dark:bg-card-hover-dark focus:bg-card-hover dark:focus:bg-card-hover-dark border-[0.5px] border-border-primary dark:border-border-primary-dark gap-2.5">
                            {{ getYearsName }}

                            <div class="px-[2px] py-1.5 rounded"
                                :class="isYearDropdownShow ? 'bg-card-pressed dark:bg-card-pressed-dark' : ''">
                                <NuxtImg src="/icon/Iconly/Light/ArrowDown.svg" class="w-[8px] invert dark:invert-0" />
                            </div>
                        </button>

                        <div id="year-dropdown" ref="yearDropdownContent"
                            class="z-10 hidden bg-card-primary dark:bg-card-primary-dark border-[0.5px] border-border-primary dark:border-border-primary-dark rounded-lg">
                            <ul class="p-2 text-deskripsi-sm md:text-deskripsi" aria-labelledby="dropdownDefaultButton">
                                <li v-for="year in years.data" class="cursor-pointer" @click="selectedYear = year.id">
                                    <span class="block px-2 py-1 hover:bg-bg-brand rounded">{{ year.years_of_management
                                        }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="flex justify-center gap-4 relative">
                        <nuxt-link :to="ctas.url" v-for="ctas in pageData.result.banners[0].ctas">
                            <AppButtonBanner>
                                <img src="/icon/play-button.svg" v-if="ctas.type == 'video'" class="w-4 mr-2 md:mr-0"
                                    alt="">
                                {{ ctas.title }}
                            </AppButtonBanner>
                        </nuxt-link>
                    </div>
                    <p
                        class="text-text-secondary mt-4 dark:text-text-secondary-dark hidden lg:block text-deskripsi lg:line-clamp-3">
                        {{ pageData.result.banners[0].description }}</p>
                </div>
            </div>
        </section>

        <div class="lg:flex">
            <AppContainer class="md:flex">

                <div class="flex-none w-44 pt-10 hidden lg:block">
                    <div
                        class="border border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark rounded-lg w-[150px] sticky top-24">
                        <AppProfilNavbar :elpos="navElPos" :years="getYearsName" />
                    </div>
                </div>

                <div class="pt-6 md:pt-0">
                    <!-- Main Content Here -->
                    <section id="vismis" class="scroll-mt-[50px] nav-el">
                        <AppContainer>
                            <div class="border-b border-b-border-primary dark:border-b-border-primary-dark pt-12 pb-6">
                                <h2 class="text-title-3-sm md:text-title-3 mb-4">Visi & Misi</h2>
                                <h3 class="text-title-4-sm md:text-title-4 mb-4">Visi</h3>
                                <div v-html="pageData.result.visi"
                                    class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                                </div>
                                <h3 class="text-title-4-sm md:text-title-4 mb-4 mt-4">Misi</h3>
                                <div v-html="pageData.result.misi"
                                    class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                                </div>
                            </div>
                        </AppContainer>
                    </section>

                    <section id="divisi" class="scroll-mt-[50px] nav-el">
                        <AppContainer>
                            <div class="py-6 border-b border-b-border-primary dark:border-b-border-primary-dark">
                                <h3 class="text-title-3-sm md:text-title-3">Divisi</h3>

                                <p
                                    class="text-deskripsi-sm md:text-deskripsi text-text-secondary dark:text-text-secondary-dark mt-1 mb-4">
                                    Kerangka Dasar Program Kerja HIMASIF merupakan gambaran umum tentang bentuk
                                    dan arah dari program kerja HIMASIF yang dijabarkan dengan prioritas dan
                                    kebutuhan. Terbentuklah 5 divisi dengan masing-masing tugas pokok dan fungsi untuk
                                    mewujudkan visi & misi yang maksimal.</p>



                                <div class="overflow-x-auto -mx-8 no-scrollbar px-8">

                                    <div
                                        class="grid grid-flow-col lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 gap-4.5">
                                        <template v-for="division in divisions.data">
                                            <div class="cursor-pointer rounded-lg shadow bg-card-primary border border-border-primary hover:bg-card-hover dark:bg-card-primary-dark dark:border-border-primary-dark dark:hover:bg-card-hover-dark w-fit"
                                                data-modal-target="divisi-modal" data-modal-toggle="divisi-modal"
                                                v-if="division.isHighlight === 1">
                                                <div class="px-7 py-6 w-[250px] md:w[200px] lg:w-full">
                                                    <NuxtImg class="w-[200px] lg:w-full" sizes="250"
                                                        :src="division.logo[0].url" alt="" />
                                                </div>
                                                <div class="py-6 px-6">

                                                    <h5 class="mb-2 text-title-4-sm md:text-title-4"
                                                        :class="getTextDivisionColor(division.id)">
                                                        {{ division.title }}
                                                    </h5>

                                                    <p
                                                        class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                                                        {{
                                                            division.description }}
                                                    </p>
                                                </div>
                                            </div>
                                        </template>
                                    </div>

                                    <div id="divisi-modal" tabindex="-1" aria-hidden="true"
                                        class="hidden overflow-y-auto overflow-x-hidden bg-black/80 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full">
                                        <div class="relative p-4 w-full max-w-2xl max-h-full">
                                            <!-- Modal content -->
                                            <div
                                                class="relative bg-card-primary dark:bg-card-primary-dark rounded-[32px] border border-border-primary dark:border-border-primary-dark p-8">
                                                <!-- Modal header -->
                                                <NuxtImg src="/img/background/divisi.png" sizes="600" class="w-full">
                                                </NuxtImg>

                                                <!-- Modal body -->
                                                <div class="p-4 md:p-5 space-y-4">
                                                    <p
                                                        class="text-deskripsi-sm md:text-deskripsi text-text-primary dark:text-text-primary-dark">
                                                        Divisi Pengembangan Sumber Daya Mahasiswa yang berorientasi pada
                                                        potensi
                                                        manajerial dan pengembangan kemampuan dalam bidang akademik.
                                                    </p>

                                                    <h3
                                                        class="text-title-5-sm md:text-title-5 text-text-secondary dark:text-text-secondary-dark">
                                                        Tugas
                                                        Pokok dan
                                                        Fungsi</h3>
                                                    <p class="text-deskripsi-sm md:text-deskripsi">
                                                        1. Melaksanakan program kerja organisasi sesuai porsi yang telah
                                                        ditetapkan dalam
                                                        rapat kerja HIMASIF.
                                                        2. Mengkoordinasikan setiap program kegiatan yang akan
                                                        dilaksanakan kepada
                                                        Ketua Umum HIMASIF.
                                                        3. Mengadakan kegiatan kemahasiswaan yang bersifat mengembangkan
                                                        sumber daya
                                                        mahasiswa di bidang akademik dengan tujuan akhir adalah
                                                        mahasiswa yang mampu
                                                        berprestasi dan berkompeten.
                                                        4. Mengadakan kegiatan kemahasiswaan bidang akademik yang
                                                        bersifat
                                                        pengembangan hardskill.
                                                        5. Menjadi koordinator kelompok minat yang dibentuk HIMASIF
                                                        serta memfasilitasi
                                                        kebutuhan kelompok minat tersebut.
                                                        6. Memberikan laporan pertanggungjawaban dari setiap kegiatan
                                                        yang telah
                                                        dilaksanakan kepada Ketua Umum HIMASIF.
                                                        7. Membuat laporan pertanggungjawaban selama satu periode
                                                        menjabat
                                                    </p>
                                                </div>
                                            </div>

                                            <div class="w-full flex justify-center">
                                                <button type="button"
                                                    class="bg-bg-primary border border-border-primary dark:bg-bg-primary-dark dark:border-border-primary-dark rounded-full w-12 h-12 mt-7 flex items-center justify-center cursor-pointer"
                                                    data-modal-hide="divisi-modal">
                                                    <svg width="30px" height="30px" fill="#fff" viewBox="-3.5 0 19 19"
                                                        xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg">
                                                        <path
                                                            d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
                                                    </svg>
                                                    <span class="sr-only">Close modal</span>

                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </AppContainer>
                    </section>

                    <section id="program" class="scroll-mt-[50px] nav-el">
                        <ProgramWindow />
                        <AppContainer>
                            <div class="py-6 border-b border-b-border-primary dark:border-b-border-primary-dark">
                                <h3 class="text-title-3-sm md:text-title-3">Program</h3>
                                <p
                                    class="text-deskripsi-sm md:text-deskripsi text-text-secondary dark:text-text-secondary-dark mt-1">
                                    HIMASIF
                                    berfungsi sebagai wadah
                                    komunikasi, pemersatu,
                                    penggali, dan
                                    pengembang potensi bagi para anggotanya untuk mewujudkan mahasiswa yang unggul
                                    dengan berasaskan
                                    Pancasila dan berlandaskan Tri Dharma Perguruan Tinggi. Fungsi tersebut
                                    diimplementasikan melalui
                                    program kerja berikut:</p>
                                <div class="my-4">
                                    <h3 class="text-title-4-sm md:text-title-4 mb-1">Event</h3>
                                    <p
                                        class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                                        Program
                                        Event ini
                                        merupakan program
                                        yang
                                        dapat diikuti
                                        oleh
                                        seluruh anggota
                                        HIMASIF. Anggota HIMASIF dapat mengikuti program ini sebagai panitia, peserta,
                                        atau
                                        lain sebagainya.
                                    </p>
                                    <div class="overflow-x-auto -mx-8 px-8 no-scrollbar">
                                        <div
                                            class="grid grid-flow-col lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 gap-4.5 mt-4">
                                            <template v-for="program in pageData.result.year_has_work_programs">
                                                <CardProgram :program="program.work_programs" class="w-3/4 md:w-full"
                                                    :status="program.status" :implementation="program.implementation"
                                                    @click="selectProgram(program.work_programs.id)"
                                                    v-if="program.work_programs.is_event == 1">
                                                </CardProgram>
                                            </template>
                                        </div>
                                    </div>

                                </div>

                                <div>
                                    <h3 class="text-title-4-sm md:text-title-4 mb-1">Non-Event</h3>
                                    <p
                                        class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                                        Program
                                        Non-event
                                        ini merupakan
                                        program
                                        yang
                                        diselenggarakan
                                        oleh tiap divisi
                                        untuk mengembangkan HIMASIF dalam bentuk program kerja internal HIMASIF.</p>

                                    <div class="overflow-x-auto -mx-8 px-8 no-scrollbar">
                                        <div
                                            class="grid grid-flow-col lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 gap-4.5 mt-4">
                                            <template v-for="program in pageData.result.year_has_work_programs">
                                                <CardProgram :program="program.work_programs" :status="program.status"
                                                    :implementation="program.implementation"
                                                    @click="selectProgram(program.work_programs.id)"
                                                    v-if="program.work_programs.is_event == 0"></CardProgram>
                                            </template>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </AppContainer>
                    </section>

                    <section id="pengurus" class="scroll-mt-[50px] nav-el">
                        <AppContainer class="z-0">
                            <div
                                class="space-y-4 py-6 border-b border-b-border-primary dark:border-b-border-primary-dark">
                                <div>
                                    <h3 class="text-title-3-sm md:text-title-3 mb-1">Pengurus</h3>
                                    <p
                                        class="text-deskripsi-sm md:text-deskripsi hidden md:block text-text-secondary dark:text-text-secondary-dark">
                                        Pengurus HIMASIF
                                        adalah mahasiswa Program
                                        Studi Sistem
                                        Informasi yang
                                        memenuhi kriteria sebagaimana telah diatur dalam Anggaran Rumah Tangga HIMASIF.
                                        Dimana banyaknya
                                        pengurus ditentukan oleh banyaknya program kerja, sehingga program kerja yang
                                        dijalankan dapat
                                        menghasilkan hasil yang maksimal. Yuk kenalan dengan pengurus HIMASIF periode
                                        ini
                                        yang nantinya dapat
                                        membantu kamu dalam menjalani kegiatan akademik maupun non-akademik di
                                        lingkungan
                                        program studi Sistem
                                        Informasi.</p>
                                </div>

                                <div class="flex">
                                    <div class="overflow-auto -mx-8 pl-8 no-scrollbar">
                                        <div
                                            class="border border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark rounded-xl pt-3 md:pt-2 pb-3 px-2 w-fit">
                                            <InputCategory :options="divisions.data" v-model="selectedDivisiPengurus"
                                                class="">
                                                <div class="flex-shrink-0">
                                                    <input type="radio" name="category" value="all" id="all"
                                                        class="hidden" :checked="true" v-model="selectedDivisiPengurus"
                                                        required />
                                                    <label for="all"
                                                        class="py-2 px-4 rounded-lg cursor-pointer text-deskripsi-sm md:text-deskripsi"
                                                        :class="selectedDivisiPengurus == 'all' ? 'bg-card-pressed text-text-primary dark:bg-card-pressed-dark dark:text-text-primary-dark' : 'hover:bg-card-hover hover:text-white text-text-secondary bg-card-primary dark:hover:bg-card-hover-dark dark:hover:text-white dark:text-text-secondary-dark dark:bg-card-primary-dark'">
                                                        SEMUA
                                                    </label>
                                                </div>
                                            </InputCategory>
                                        </div>
                                    </div>
                                </div>

                                <div class="overflow-x-auto -mx-8 px-8 no-scrollbar">
                                    <div
                                        class="grid grid-flow-col lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        <CardPengurus v-for="itemPengurus in pengurus.data" :data="itemPengurus"
                                            class="aspect-[3/5] w-full"
                                            :division="divisions.data.find((el) => el.id === itemPengurus.division_id)">
                                        </CardPengurus>
                                    </div>
                                </div>



                                <AppButtonPrimary @click="getMorePengurus()"
                                    v-if="pengurus.total > pengurus.data.length">Lebih
                                    Banyak
                                </AppButtonPrimary>
                            </div>
                        </AppContainer>
                    </section>

                    <section id="dokumen" class="scroll-mt-[50px] nav-el">
                        <AppContainer>
                            <div class="pt-6 space-y-4">
                                <div>
                                    <h3 class="text-title-4-sm md:text-title-4">Dokumen</h3>
                                    <p
                                        class="hidden md:block text-deskripsi text-text-secondary dark:text-text-secondary-dark">
                                        Dokumen
                                        dibawah
                                        merupakan dokumen yang
                                        dihasilkan maupun yang
                                        berlaku pada periode ini.</p>
                                </div>

                                <div class="grid grid-flow-col md:grid-flow-row md:grid-cols-3 gap-[10px] mx-auto"
                                    v-if="pageData.result.dokumen.length > 0">
                                    <CardDokumen v-for="document in pageData.result.dokumen"
                                        @click="navigateTo(document.url, { open: { target: '_blank' } })">
                                        {{ document.title }}
                                    </CardDokumen>
                                </div>

                                <div v-else class="text-center py-10 text-text-secondary dark:text-text-secondary-dark">
                                    Maaf, dokumen yang Kamu cari belum tersedia. Kami akan meng-update dokumen jika
                                    sudah tersedia.
                                </div>
                            </div>
                        </AppContainer>
                    </section>
                </div>
            </AppContainer>
        </div>
    </div>
</template>

<script setup>
import { initTooltips, Dropdown, initModals } from 'flowbite';
//head HTML settings
useHead({
    title: 'Profil'
})

//state zone
const programStore = useProgramsStore()
const { settings } = useMySettingsStore()
const selectedDivisiPengurus = ref("all")
const selectedYear = ref(settings['current-year'])
const navElPos = []
const isYearDropdownShow = ref(false)
const yearDropdown = ref(null)
const yearDropdownContent = ref(null)
const yearDropdownTrigger = ref(null)

//Fetching zone

const { data: years } = await useAPI('years_of_management', {
    query: {
        'sort': 'order'
    },
    pick: ['data']
})

const { data: pageData } = await useAPI(`/years_of_management/${selectedYear.value}`, {
    pick: ['result']
})


const { data: divisions } = await useAPI('/division', {
    query: {
        sort: "order"
    },
    pick: ['data']
})

const { data: pengurus } = await useAPI('/pengurus', {
    query: {
        "filter[year_of_management]": years.value.data.find((el) => el.id == selectedYear.value).years_of_management,
        'filter[is_active]': 1,
        " page[size]": 10
    },
    pick: ['data', 'total']
})

const toggleYearDropdown = () => {
    yearDropdown.value.toggle()
}

const getYearsName = computed(() => {
    return years.value.data.find((el) => el.id == selectedYear.value).years_of_management
})

const getTextDivisionColor = (id) => {
    if (id === 1) {
        return "text-div-psdm"
    } else if (id === 3) {
        return "text-div-kader"
    } else if (id === 4) {
        return "text-div-litbang"
    } else if (id === 6) {
        return "text-div-mediatek"
    } else if (id === 5) {
        return "text-div-humas"
    } else {
        return "text-white"
    }
};

const getMorePengurus = async function () {
    const { data: newPengurus } = await useAPI('/pengurus', {
        query: {
            "filter[year_of_management]": getYearsName,
            'filter[is_active]': 1,
            "page[size]": pengurus.value.data.length + 10
        },
        pick: ['data', 'total']

    })

    pengurus.value = newPengurus.value
}

const selectProgram = async function (id) {
    await useRouter().push({
        query: {
            'modal': 'open',
            'selectedProgram': id,
            'year': selectedYear.value
        }
    })

    programStore.openModal()
}

const showDropdown = () => {
    yearDropdown.value.show()
}

watch(selectedYear, async (newVal, oldVal) => {
    const { data: newPageData } = await useAPI(`/years_of_management/${newVal}`, {
        pick: ['result']
    })

    pageData.value = newPageData.value

    const { data: newPengurus } = await useAPI('/pengurus', {
        query: {
            "filter[year_of_management]": getYearsName.value,
            'filter[is_active]': 1,
            " page[size]": 10
        },
        pick: ['data', 'total']
    })

    pengurus.value = newPengurus.value
})

//watcher
watch(selectedDivisiPengurus, async (newDiv, oldDiv) => {
    if (newDiv === 'all') {
        const { data: filteredPengurus } = await useAPI('/pengurus', {
            query: {
                "filter[year_of_management]": getYearsName.value,
                'filter[is_active]': 1
            },
            pick: ['data', 'total']
        })

        pengurus.value = filteredPengurus.value
    } else {
        const { data: filteredPengurus } = await useAPI('/pengurus', {
            query: {
                'filter[is_active]': 1,
                "filter[year_of_management]": getYearsName.value,
                'filter[division_id]': selectedDivisiPengurus.value
            },
            pick: ['data', 'total']
        })

        pengurus.value = filteredPengurus.value
    }
})

// mounted
onMounted(() => {
    yearDropdown.value = new Dropdown(yearDropdownContent.value, yearDropdownTrigger.value, {
        onShow: () => {
            isYearDropdownShow.value = true
        },
        onHide: () => {
            isYearDropdownShow.value = false
        }
    })
    initModals()
    // initDropdowns()
    initTooltips()
    const navEl = document.querySelectorAll('.nav-el')

    navEl.forEach((el) => {
        // navElPos.push(el.offsetTop - 122.5)
        navElPos.push(el.offsetTop - 100)

    })

})
</script>