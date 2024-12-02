<template>
    <div
        class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark pb-20 md:min-h-screen">

        <AppBackgroundHeader background-image="feature/nim.webp" />

        <AppContentArea class="-mt-[25vh] lg:-mt-[75vh] z-20">

            <AppContainer class="lg:flex justify-between">
                <FeatureTitle class="w-full text-center lg:text-left lg:w-1/3">NIM CHECKER</FeatureTitle>

                <div class="mt-14 w-full pb-20 lg:pb-0 lg:w-2/5">
                    <form @submit.prevent="search()">
                        <div class="mb-4">
                            <input type="text" id="input" v-model="input"
                                class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary rounded-lg focus:border-primary-600 focus:ring-0 block w-full px-4 py-2.5"
                                placeholder="Masukkan NIM atau nama yang dicari" required>
                        </div>

                        <div class="flex mt-4 justify-center lg:justify-normal">
                            <AppButtonSecondary type="submit" :disabled="input == ''">Cari</AppButtonSecondary>
                        </div>
                    </form>

                    <section class="relative mx-auto mt-4" v-if="searchData">
                        <div
                            class="rounded-lg border border-border-primary dark:border-border-primary-dark bg-card-primary dark:bg-card-primary-dark px-2">
                            <table
                                class="w-full text-left text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                                <thead
                                    class="capitalize border-b border-b-text-placeholder dark:border-b-text-placeholder-dark">
                                    <tr>
                                        <th scope="col" class="font-normal px-4 py-2.5">
                                            NIM
                                        </th>
                                        <th scope="col" class="font-normal px-4 py-2.5">
                                            Nama
                                        </th>
                                        <th scope="col" class="font-normal px-4 py-2.5">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-text-placeholder dark:divide-text-placeholder-dark">
                                    <template v-for="data in searchData?.data">
                                        <tr class="text-text-primary dark:text-text-primary-dark w-full"
                                            :class="searchData[searchData.length - 1] ? 'border-b border-b-border-primary dark:border-b-border-primary-dark' : ''">
                                            <td class="px-4 py-2.5 text-deskripsi-sm md:text-deskripsi  max-w-[100px]">
                                                {{ data.nim }}
                                            </td>
                                            <td
                                                class="px-4 py-2.5 capitalize text-deskripsi-sm md:text-deskripsi truncate max-w-[110px]">
                                                {{ data.nama }}
                                            </td>
                                            <td class="px-4 py-2.5 capitalize text-deskripsi-sm md:text-deskripsi truncate max-w-[100px]"
                                                :class="getStatusColor(data.status)">
                                                {{ data.status }}
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>

                        <nav class="pt-4" aria-label="Table navigation">
                            <div class="text-deskripsi-sm md:text-deskripsi mb-3">
                                Menampilkan
                                <span class="font-semibold">{{ searchData?.from }} - {{ searchData?.to }}</span>
                                dari
                                <span class="font-semibold">{{ searchData?.total }}</span>
                            </div>

                            <div class="overflow-x-auto -mx-8 pl-8 pr-4 no-scrollbar">
                                <ul
                                    class="inline-flex -space-x-px text-deskripsi-sm md:text-deskripsi bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark rounded-lg p-1 w-fit">
                                    <li @click="prevPagination()">
                                        <a href="#"
                                            class="flex items-center justify-center w-full px-4 py-2.5 ml-0 rounded-lg hover:bg-card-hover dark:hover:bg-card-hover-dark">
                                            &laquo; Sebelumnya
                                        </a>
                                    </li>
                                    <li v-for="(link, index) in searchData?.links.slice(1, -1)"
                                        @click="goToPagination(link.url)">
                                        <a href="#"
                                            class="flex items-center justify-center px-4 py-2.5 hover:bg-card-hover dark:hover:bg-card-hover-dark rounded-lg"
                                            :class="searchData.current_page == link.label ? 'text-text-primary dark:text-text-primary-dark' : 'text-text-secondary dark:text-text-secondary-dark'">
                                            {{ link.label }}
                                        </a>
                                    </li>
                                    <li @click="nextPagination()">
                                        <a href="#"
                                            class="flex items-center justify-center px-4 py-2.5 rounded-lg hover:bg-card-hover dark:hover:bg-card-hover-dark">Selanjutnya
                                            &raquo;</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>


                    </section>
                </div>
            </AppContainer>

        </AppContentArea>
    </div>
</template>

<script setup>
import { AppAlertError } from '#components';

useHead({
    title: 'NIM Checker'
})

const input = ref('')
const searchData = ref()

const search = async function () {

    const { data: searchResult, error } = await useAPI('/nimchecker', {
        query: {
            search: input.value
        }
    })

    if (error.value) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: error.value.message
            }
        })
    }

    searchData.value = searchResult.value
}

const nextPagination = async function () {
    const { data: searchResult, error } = await useAPI(searchData.value.next_page_url)

    if (error.value) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: error.value.message
            }
        })
    }

    searchData.value = searchResult.value
}

const prevPagination = async function () {
    const { data: searchResult, error } = await useAPI(searchData.value.prev_page_url)

    if (error.value) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: error.value.message
            }
        })
    }

    searchData.value = searchResult.value
}

const getStatusColor = (statusName) => {
    switch (statusName) {
        case 'lulus':
            return 'text-[#00A707] dark:text-[#00A707]';
        case 'tidak diketahui':
            return 'text-text-primary dark:text-text-primary-dark';
        case 'aktif':
            return 'text-[#FF6D00] dark:text-[#FF6D00]';
        default:
            return 'text-text-secondary dark:text-text-secondary-dark'; // Default fallback
    }
}

const goToPagination = async function (url) {
    const { data: searchResult, error } = await useAPI(url)

    if (error.value) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: error.value.message
            }
        })
    }

    searchData.value = searchResult.value
}



</script>