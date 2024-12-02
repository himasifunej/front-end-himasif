<template>
    <div
        class="bg-bg-primary text-text-primary dark:bg-bg-primary-dark dark:text-text-primary-dark pb-20 md:min-h-screen">

        <AppBackgroundHeader background-image="feature/shorten.webp" />

        <AppContentArea class="-mt-[25vh] lg:-mt-[75vh] z-20">
            <AppContainer class="lg:flex justify-between">
                <FeatureTitle class="w-full text-center lg:text-left lg:w-1/3">SHORTEN LINK</FeatureTitle>

                <form class="mt-14 w-full lg:w-2/5" v-show="!generatedLink" @submit.prevent="createShorten()">
                    <div class="mb-4">
                        <input type="text" id="inputLink" v-model="formData.destination_url"
                            class="bg-card-primary border border-border-primary text-text-primary text-deskripsi-sm md:text-deskripsi placeholder-text-secondary rounded-lg focus:border-primary-600 focus:ring-0 block w-full px-4 py-2.5 dark:bg-card-primary-dark dark:text-text-primary-dark dark:border-border-primary-dark dark:placeholder-text-secondary-dark"
                            placeholder="Masukkan link yang akan di shorten" required>
                    </div>


                    <div class="flex gap-4 justify-center lg:justify-normal">
                        <div>
                            <input type="radio" id="auto" name="short-type" value="auto" class="hidden peer" required
                                v-model="formData.shortTypePicked" checked>
                            <label for="auto"
                                class="inline-flex text-deskripsi-sm md:text-deskripsi items-center justify-center px-4 py-2.5 bg-card-primary border border-border-primary dark:bg-card-primary-dark dark:border-border-primary-dark text-text-secondary dark:text-text-secondary-dark rounded-lg cursor-pointer peer-checked:bg-card-pressed dark:peer-checked:bg-card-pressed-dark peer-checked:text-text-primary dark:peer-checked:text-text-primary-dark">
                                Auto
                            </label>
                        </div>

                        <div>
                            <input type="radio" id="custom" name="short-type" value="custom" class="hidden peer"
                                v-model="formData.shortTypePicked">
                            <label for="custom"
                                class="inline-flex text-deskripsi-sm md:text-deskripsi items-center justify-center px-4 py-2.5 bg-card-primary border border-border-primary dark:bg-card-primary-dark dark:border-border-primary-dark text-text-secondary dark:text-text-secondary-dark rounded-lg cursor-pointer peer-checked:bg-card-pressed dark:peer-checked:bg-card-pressed-dark peer-checked:text-text-primary dark:peer-checked:text-text-primary-dark">
                                Custom
                            </label>
                        </div>
                    </div>


                    <div class="flex w-full mt-4" v-if="formData.shortTypePicked == 'custom'">
                        <span
                            class="inline-flex items-center px-4 py-2.5 text-deskripsi-sm md:text-deskripsi bg-border-primary border border-r-0 border-border-primary dark:bg-border-primary-dark dark:border-border-primary-dark rounded-l-lg">
                            himasif.id/
                        </span>
                        <input type="text" id="website-admin" v-model="formData.url_key"
                            :disabled="formData.shortTypePicked == 'auto'"
                            class="rounded-none rounded-r-lg px-4 py-2.5 text-deskripsi-sm md:text-deskripsi bg-card-primary border border-border-primary placeholder-text-secondary dark:bg-card-primary-dark dark:border-border-primary-dark dark:placeholder-text-secondary focus:border-primary-600 focus:ring-0 block flex-1 min-w-0 w-full disabled:cursor-not-allowed"
                            placeholder="Isikan shorten link custom">
                    </div>

                    <div class="flex mt-4 justify-center lg:justify-normal">
                        <AppButtonSecondary variant="secondary" type="submit"
                            :disabled="formData.destination_url == ''">
                            Shorten</AppButtonSecondary>
                    </div>
                </form>

                <div class="mt-14 w-full lg:w-2/5" v-show="generatedLink">


                    <div class="relative mb-4">
                        <input type="text" id="generatedLink"
                            class="bg-card-primary border border-border-primary placeholder-text-secondary dark:bg-card-primary-dark dark:border-border-primary-dark dark:placeholder-text-secondary text-deskripsi-sm md:text-deskripsi rounded-lg focus:border-border-primary dark:focus:border-border-primary-dark focus:ring-0 block w-full pl-4 py-2.5 pr-12"
                            readonly required v-model="generatedLink">

                        <div data-tooltip-target="tooltip-copy"
                            class="absolute inset-y-0 right-0 flex items-center pr-4">
                            <img src="/icon/Iconly/Light/paste.svg" class="w-5 h-5 cursor-pointer invert dark:invert-0"
                                alt="copy link" @click="copyToClipboard()">

                            <div id="tooltip-copy" role="tooltip"
                                class="hidden md:block absolute z-20 invisible px-2.5 py-2 text-deskripsi text-text-primary dark:text-text-primary-dark bg-card-primary dark:bg-card-primary-dark rounded-lg opacity-0 tooltip border border-border-primary dark:border-border-primary-dark">
                                Salin
                            </div>

                        </div>



                    </div>

                    <div class="flex space-x-4 justify-center lg:justify-normal">
                        <AppButtonSecondary @click="generateQr(generatedLink)">Generate QR Code
                        </AppButtonSecondary>
                        <AppButtonSecondary @click="resetForm">Shorten Another</AppButtonSecondary>
                    </div>

                    <section class="mt-4 z-10" v-if="qr">
                        <div class="w-40 h-40 md:w-36 md;h-36 mx-auto lg:m-0">
                            <img :src="qr" alt="qrcode" class="w-full rounded-lg">
                        </div>
                    </section>
                </div>





            </AppContainer>
        </AppContentArea>
    </div>
</template>

<script setup>
import { initTooltips } from 'flowbite';
import { AppAlertSuccess, AppAlertError } from '#components';

useHead({
    title: 'Shorten Link'
})

//STATE / DATA AREA

//Set base form data structure
const baseFormData = {
    destination_url: '',
    url_key: '',
    shortTypePicked: 'auto'
}

// state for storing data/result
const generatedLink = ref('')
const qr = ref()
const formData = ref({
    destination_url: '',
    url_key: '',
    shortTypePicked: 'auto'
})


// METHODS AREA

// call API shorten using useFetch (im making it composable so it can be reusable, and easy to call)
const createShorten = async function () {
    const bodyData = createFormData({
        destination_url: formData.value.destination_url,
        url_key: formData.value.url_key
    })

    const { data: data, error } = await useAPI('/shorten', {
        method: 'POST',
        body: bodyData
    })

    if (data.value.code === 200) {
        generatedLink.value = data.value.result.short_link
        useAlertsStore().openModal({
            component: AppAlertSuccess,
            props: {
                text: data.value.message
            }
        })
    }

    if (error.value) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: error.value
            }
        })
    }
}

// copying generated link to user clipboard, if success/failed showing alert
const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(generatedLink.value)
        useAlertsStore().openModal({
            component: AppAlertSuccess,
            props: {
                text: 'Berhasil menyalin'
            }
        })
    } catch (error) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: error
            }
        })
    }
}

// generate qr, using qr package. createQRCode is composable from some qr package script
// See /composables/createQrCode.js
const generateQr = async (link) => {
    const qrcode = await createQrCode(link)
    qr.value = qrcode
}

// reseting form to base form data structure
// also reseting the result from the state
const resetForm = () => {
    formData.value = baseFormData
    generatedLink.value = ''
    qr.value = ''
}

onMounted(() => {
    initTooltips()
})
</script>