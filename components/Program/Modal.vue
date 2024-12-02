<template>
    <div class="w-[90vw] md:w-[70vw] mx-auto space-y-6 text-text-primary dark:text-text-primary translate-y-0">
        <div class="absolute bg-bg-primary border border-border-primary dark:bg-bg-primary-dark dark:border-border-primary-dark rounded-full w-[60px] h-[60px] md:w-[30px] md:h-[30px] top-0 right-0 flex items-center justify-center cursor-pointer"
            @click="programStore.closeModal()">
            <svg width="30px" height="30px" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg"
                class="cf-icon-svg w-[30px] h-[30px] md:w-[15px] md:h-[15px] fill-text-primary dark:fill-text-primary-dark">
                <path
                    d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
            </svg>
        </div>

        <div class="text-center lg:text-left lg:flex lg:items-center lg:justify-center lg:space-x-14 text-text-primary-dark">
            <NuxtImg :src="program.result.logo[0]?.url || 'https://placehold.co/600x400?text=Not+Found'" width="160"
                class="w-40 max-h-32 object-contain mx-auto lg:m-0" alt="" v-if="program.result.is_event === 1" />
            <div class="max-w-sm mx-auto mt-4" :class="program.result.is_event === 1 ? '' : 'text-center'">
                <h3 class="uppercase text-title-1">{{ program.result.title }}</h3>
                <div class="hidden lg:inline">
                    <p class="uppercase text-deskripsi-sm md:text-deskripsi mb-1 tracking-wide">Dari <span
                            :class="getTextDivisionColor">{{
                                getDivisionName() }}</span></p>
                    <p class="capitalize text-deskripsi-sm md:text-deskripsi">
                        {{ programInformation.data[0].implementation }} · {{
                            getStatusTitle
                        }}
                    </p>
                </div>

                <div class="lg:hidden">
                    <p class="uppercase text-deskripsi-sm md:text-deskripsi">Dari
                        <span :class="getTextDivisionColor">{{
                            getDivisionName() }}
                        </span>
                        <span class="capitalize">
                            · {{ programInformation.data[0].implementation }} · {{
                                getStatusTitle
                            }}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <div class="h-[65vh] lg:h-[70vh] overflow-auto no-scrollbar bg-card-primary text-text-primary dark:bg-card-primary-dark dark:text-text-primary-dark rounded-t-2xl w-fit">
            <section
                class="w-full z-0 fixed ">
                <nav class="w-full px-10 pb-6 bg-card-primary dark:bg-card-primary-dark rounded-t-2xl border border-b-0 border-border-primary dark:border-border-primary-dark">
                    <div
                        class="flex flex-wrap items-center py-4 w-full border-b border-b-border-primary dark:border-b-border-primary-dark justify-between">
                        
                        <h3 class="text-title-4"
                            :class="option == 'detail' ? 'text-text-primary dark:text-text-primary-dark' : 'text-[#494949]'" @click="option = 'detail'">
                            Detail Program</h3>

                        <div v-if="program.result.is_event === 1" class="flex gap-2">
                            <nuxt-link>
                                <AppButtonPrimary>
                                    <div class="flex space-x-2">
                                        <NuxtImg src="/icon/world.svg" class="w-4"></NuxtImg>
                                        <p class="hidden md:block">link</p>
                                    </div>
                                </AppButtonPrimary>
                            </nuxt-link>

                            <nuxt-link>
                                <AppButtonPrimary>
                                    <div class="flex space-x-2">
                                        <NuxtImg src="/icon/camera.svg" class="w-4"></NuxtImg>
                                        <p class="hidden md:block">link</p>
                                    </div>
                                </AppButtonPrimary>
                            </nuxt-link>
                        </div>
                    </div>
                </nav>
            </section>


            <div class="px-10 pt-24 h-full text-deskripsi-sm md:text-deskripsi bg-card-primary dark:bg-card-primary-dark border border-y-0 border-border-primary dark:border-border-primary-dark" v-show="option == 'detail'"
                v-html="program.result.program_detail">
            </div>
        </div>
    </div>
</template>

<script setup>
const programStore = useProgramsStore()
const route = useRoute();

// console.log(route.query);

const { data: program } = await useAPI(`/work_program/${route.query.selectedProgram}`, { pick: ['result'] })
const { data: programInformation } = await useAPI('year_has_work_program', {
    query: {
        'filter[work_program_id]': route.query.selectedProgram,
        'filter[year_of_management_id]': route.query.year
    },
    pick: ['data']
})

// const isMounted = ref(false)
const option = ref('detail')
const selectedEvent = ref("Lupin")
const content = ref()

const eventOptions = ref([
    "Lupin",
    "Lycan",
    "Sharingala 1.0",
    "Pembinaan Gemastik 2023",
    "Sharingala 2.0",
    "Pembinaan ITCC Udayana",
])
const isRegistered = ref(false)
const formData = ref({
    nama: "",
    nim: "",
    wa: "",
    angkatan: "",
    motivasi: "",
    sie_1: "",
    sie_2: "",
    alasan_1: "",
    alasan_2: "",
    portofolio: ""
})

// const getTextDivisionColor = computed(() => ({
//     "text-psdm": selectedProgram.value.div === "psdm",
//     "text-kaderisasi": selectedProgram.value.div === "kaderisasi",
//     "text-litbang": selectedProgram.value.div === "litbang",
//     "text-mediatek": selectedProgram.value.div === "mediatek",
//     "text-humas": selectedProgram.value.div === "humas",
// }));

const getStatusTitle = computed(() => {
    if (programInformation.value.data[0].status === "ongoing") {
        return "Sedang Berjalan";
    } else if (programInformation.value.data[0].status === "done") {
        return "Selesai";
    } else if (programInformation.value.data[0].status === "coming soon") {
        return "Segera Datang";
    } else {
        return "Unknown";
    }
})


const getTextDivisionColor = computed(() => ({
    "text-div-psdm": program.value.result.division_id === 1,
    "text-div-kader": program.value.result.division_id === 3,
    "text-div-litbang": program.value.result.division_id === 4,
    "text-div-mediatek": program.value.result.division_id === 6,
    "text-div-humas": program.value.result.division_id === 5,
}));

const getDivisionName = () => {
    if (program.value.result.division_id === 1) {
        return "psdm";
    } else if (program.value.result.division_id === 3) {
        return "kaderisasi";
    } else if (program.value.result.division_id === 4) {
        return "litbang";
    } else if (program.value.result.division_id === 6) {
        return "mediatek";
    } else if (program.value.result.division_id === 5) {
        return "humas";
    } else {
        return "unknown"; // Return empty string for invalid division IDs
    }
}

const createEventRegisterForm = function () {
    isRegistered.value = true
    alert(formData.value)
}

watch(option, () => {
    content.value.scrollTop = 0
})

onMounted(() => {
    // detailContent.value =  detailContent.value
    // daftarContent.value =  daftarContent.value
})

</script>

<style scoped></style>