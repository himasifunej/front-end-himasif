<template>
    <div class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark">
        <ProgramWindow />

        <section class="">
            <div class="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] relative overflow-hidden flex">
                <div
                    class="h-3/4 w-full bg-gradient-to-t from-bg-primary dark:from-bg-primary-dark to-transparent -bottom-1 absolute z-10">
                </div>
                <NuxtImg src="/img/banner/program.webp" sizes="1000"
                    class="object-cover absolute top-0 left-0 h-full w-full" alt="profile image" />

                <AppContainer class="relative z-10 pb-10 text-white h-full flex flex-col space-y-14 justify-end">

                    <!-- <NuxtImg src="/img/logo/banner/program.png" width="1000" class="w-[1000px]" alt=""> </NuxtImg> -->
                    <h1
                        class="text-[55px] font-extrabold leading-[48px] md:text-[48px] lg:text-[64px] xl:text-[80px] text-text-primary dark:text-text-primary-dark">
                        PROGRAM KERJA!</h1>

                    <div class="overflow-auto -mx-8 pl-8 pr-4 no-scrollbar">
                        <div
                            class="border border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark rounded-xl pt-3 md:pt-2 pb-3 px-2 w-fit">
                            <InputCategory :options="divisions.data" v-model="selectedDivision">
                                <div class="flex-shrink-0">
                                    <input type="radio" name="category" value="all" id="all" class="hidden"
                                        :checked="true" v-model="selectedDivision" required />
                                    <label for="all"
                                        class="py-2 px-4 rounded-lg cursor-pointer text-deskripsi-sm md:text-deskripsi"
                                        :class="selectedDivision == 'all' ? 'bg-card-pressed text-text-primary dark:bg-card-pressed-dark dark:text-text-primary-dark' : 'hover:bg-card-hover hover:text-text-primary text-text-secondary bg-card-primary dark:hover:bg-card-hover-dark dark:hover:text-text-primary-dark dark:text-text-secondary-dark dark:bg-card-primary-dark'">
                                        Semua
                                    </label>
                                </div>
                            </InputCategory>
                        </div>
                    </div>


                </AppContainer>
            </div>
        </section>

        <section>
            <AppContainer class="pb-12">
                <div class="my-8">
                    <h3 class="text-title-4-sm md:text-title-4 mb-1">Event</h3>
                    <p class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                        Program Event ini
                        merupakan program
                        yang
                        dapat diikuti
                        oleh
                        seluruh anggota
                        HIMASIF. Anggota HIMASIF dapat mengikuti program ini sebagai panitia, peserta,
                        atau
                        lain sebagainya.
                    </p>

                    <div class="overflow-x-auto -mx-4  px-4 no-scrollbar">
                        <div class="grid grid-flow-col lg:grid-flow-row lg:grid-cols-5 xl:grid-cols-6 gap-4.5 mt-8">
                            <template v-for="program in programs.data">
                                <CardProgram :program="program.work_programs" :status="program.status"
                                    :implementation="program.implementation"
                                    @click="selectProgram(program.work_programs.id)"
                                    v-if="program.work_programs.is_event == 1"></CardProgram>
                            </template>
                        </div>
                    </div>

                </div>

                <div>
                    <h3 class="text-title-4-sm md:text-title-4 mb-1">Non-Event</h3>
                    <p class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                        Program Non-event
                        ini merupakan
                        program
                        yang
                        diselenggarakan
                        oleh tiap divisi
                        untuk mengembangkan HIMASIF dalam bentuk program kerja internal HIMASIF.</p>

                    <div class="overflow-x-auto -mx-4 px-4 no-scrollbar">
                        <div class="w-fit">
                            <div class="grid grid-flow-col lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 gap-4.5 mt-8">
                                <template v-for="program in programs.data">
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

    </div>
</template>

<script setup>
useHead({
    title: 'Program'
})

const { settings } = useMySettingsStore()
const programStore = useProgramsStore()
const selectedDivision = ref("all")

const { data: divisions } = await useAPI('/division', {
    query: {
        sort: "order",
        "filter[isHighlight]": 1
    },
    pick: ['data']
})

const { data: programs } = await useAPI('/year_has_work_program', {
    query: {
        "filter[year_of_management_id]": settings['current-year'],
        "include": "work_programs"
    },
    pick: ['data']
})


const selectProgram = async function (id) {
    await useRouter().push({
        query: {
            'modal': 'open',
            'selectedProgram': id,
            'year': settings['current-year']
        }
    })

    programStore.openModal()
}

// TO DO :
// 1. need to filter by division id
watch(selectedDivision, async (newDiv, oldDiv) => {
    if (newDiv === "all") {
        const { data: newPrograms } = await useAPI('/year_has_work_program', {
            query: {
                "filter[year_of_management_id]": settings['current-year'],
                "include": "work_programs"
            },
            pick: ['data']
        })

        programs.value = newPrograms.value
    } else {
        const { data: newPrograms } = await useAPI('/year_has_work_program', {
            query: {
                "filter[year_of_management_id]": settings['current-year'],
                "filter[division_id]": newDiv,
                "include": "work_programs"
            },
            pick: ['data']
        })
        programs.value = newPrograms.value

    }
})

</script>