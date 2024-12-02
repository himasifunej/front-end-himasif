<template>
    <div class="bg-primary-950 text-white min-h-screen">

        <div>
            <img src="/img/banner/feature/sif-doc.webp" sizes="1000" class="object-cover h-screen w-full absolute top-0 left-0" alt="profile image" />
        
            <div class="h-3/4 w-full bg-gradient-to-t from-primary-950 to-transparent absolute bottom-0 left-0"></div>
          </div>

        <AppContentArea class="pt-52">
            <AppContainer class="pb-16">
                <FeatureTitle>himasif.doc</FeatureTitle>

                <form class="mt-14 w-3/4 mx-auto" @submit.prevent="search">
                    <div class="mb-8">
                        <input type="text" id="input" v-model="input"
                            class="bg-primary-900 px-6 py-4 border border-primary-600 text-white placeholder-primary-600 rounded-lg focus:border-primary-600 focus:ring-0 block w-full"
                            placeholder="Cari dokumen" required>
                    </div>

                    <div class="flex justify-center">
                        <AppButton variant="secondary" :disabled="input == ''" type="submit">Cari</AppButton>
                    </div>
                </form>

                <div class="grid grid-cols-4 gap-2 mx-auto mt-20">
                    <CardDokumen v-for="document in documents.data" :data-tooltip-target="document.id"
                        @click="navigateTo(document.url, { open: { target: '_blank' } })">
                        {{ document.title }}

                        <template #tooltip>
                            <div :id="document.id" role="tooltip"
                                class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm opacity-0 tooltip ">
                                {{ document.title }}
                                <div class="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </template>
                    </CardDokumen>
                </div>

                <div class="flex justify-center mt-8">
                    <AppButton class="py-4 bg-primary-900 border border-primary-700">Lebih banyak</AppButton>
                </div>


            </AppContainer>
        </AppContentArea>
    </div>
</template>

<script setup>
import { initTooltips } from 'flowbite';

useHead({
    title: 'Document'
})

const { data: documents } = await useAPI('/dokumen', {
    pick: ['data']
})

const input = ref('')

const search = async () => {
    const { data: searchDocument } = await useAPI('/dokumen', {
        query: {
            'search': input.value
        },
        pick: ['data']
    })

    documents.value = searchDocument.value
}

onMounted(() => {
    initTooltips()
})
</script>