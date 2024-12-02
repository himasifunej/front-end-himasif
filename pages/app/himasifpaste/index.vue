<template>
    <div
        class="bg-bg-primary dark:bg-bg-primary-dark text-text-primary dark:text-text-primary-dark pb-20 md:min-h-screen">

        <AppBackgroundHeader background-image="feature/sif-paste.webp" />

        <AppContentArea class="-mt-[25vh] lg:-mt-[75vh] z-20">

            <AppContainer class="lg:flex justify-between">
                <FeatureTitle class="w-full text-center lg:text-left lg:w-1/3">HIMASIF PASTE!</FeatureTitle>

                <form class="mt-14 w-full lg:w-2/5" v-show="!result.paste.url" @submit.prevent="paste()">
                    <div class="mb-4">
                        <input type="text" id="input" v-model="formData.title"
                            class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary-dark rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
                            placeholder="Isikan judul paste-mu" required>
                    </div>

                    <textarea id="message" rows="4" v-model="formData.text"
                        class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary-dark rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
                        placeholder="Isikan teks paste-mu" required></textarea>

                    <div class="flex justify-center md:justify-start mt-4">
                        <AppButtonSecondary type="submit" :disabled="formData.title == '' || formData.text == ''">Paste!
                        </AppButtonSecondary>
                    </div>
                </form>

                <form class="mt-14 w-full lg:w-2/5" v-show="result.paste.url && !result.shortedLink"
                    @submit.prevent="createShorten()">
                    <div class="mb-4">
                        <input type="text" id="paste" v-model="result.paste.url" readonly
                            class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary-dark rounded-lg focus:border-border-primary focus:ring-0 block w-full px-4 py-2.5"
                            placeholder="Link paste" required>
                    </div>

                    <div class="mb-4">
                        <div class="gap-4">
                            <div class="flex gap-4 justify-center lg:justify-normal">
                                <div>
                                    <input type="radio" id="auto" name="short-type" value="auto" class="hidden peer"
                                        required v-model="formData.shortTypePicked" checked>
                                    <label for="auto"
                                        class="inline-flex text-deskripsi-sm md:text-deskripsi items-center justify-center px-4 py-2.5 bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-secondary dark:text-secondary-dark rounded-lg cursor-pointer peer-checked:bg-card-pressed dark:peer-checked:bg-card-pressed-dark peer-checked:text-text-primary dark:peer-checked:text-text-primary-dark">
                                        Auto
                                    </label>
                                </div>

                                <div>
                                    <input type="radio" id="custom" name="short-type" value="custom" class="hidden peer"
                                        v-model="formData.shortTypePicked">
                                    <label for="custom"
                                        class="inline-flex text-deskripsi-sm md:text-deskripsi items-center justify-center px-4 py-2.5 bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-secondary dark:text-secondary-dark rounded-lg cursor-pointer peer-checked:bg-card-pressed dark:peer-checked:bg-card-pressed-dark peer-checked:text-text-primary dark:peer-checked:text-text-primary-dark">
                                        Custom
                                    </label>
                                </div>
                            </div>

                            <div class="flex w-full mt-4" v-show="formData.shortTypePicked == 'custom'">
                                <span
                                    class="inline-flex items-center px-4 py-2.5 text-deskripsi-sm md:text-deskripsi text-text-primary dark:text-text-primary-dark bg-border-primary dark:bg-border-primary-dark border border-r-0 border-border-primary dark:border-border-primary-dark rounded-l-lg">
                                    himasif.id/
                                </span>
                                <input type="text" id="website-admin" v-model="formData.url_key"
                                    :disabled="formData.shortTypePicked == 'auto'"
                                    class="rounded-none rounded-r-lg px-4 py-2.5 text-deskripsi-sm md:text-deskripsi bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark placeholder-text-secondary dark:placeholder-text-secondary-dark focus:border-border-primary focus:ring-0 block flex-1 min-w-0 w-full disabled:cursor-not-allowed"
                                    placeholder="Isikan shorten link custom">
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-center lg:justify-normal">
                        <AppButtonSecondary type="submit" :disabled="result.paste.url == ''">
                            Shorten</AppButtonSecondary>
                    </div>
                </form>


                <div class="mt-14 w-full lg:w-2/5" v-show="result.shortedLink">
                    <div class="relative mb-4">
                        <input type="text" id="generatedLink"
                            class="bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark text-text-primary dark:text-text-primary-dark text-deskripsi-sm md:text-deskripsi placeholder-text-secondary dark:placeholder-text-secondary-dark rounded-lg focus:border-border-primary dark:focus:border-border-primary-dark focus:ring-0 block w-full px-4 py-2.5"
                            readonly required v-model="result.shortedLink">

                        <div
                            class="absolute inset-y-0 right-0 flex items-center pr-6">
                            <img data-tooltip-target="tooltip-copy" src="/icon/Iconly/Light/paste.svg" class="w-4 h-4 cursor-pointer" alt="copy link"
                                @click="copyToClipboard()">
                           
                        </div>

                        <div id="tooltip-copy" role="tooltip"
                                class="hidden md:block absolute z-20 invisible px-2.5 py-2 text-deskripsi text-text-primary dark:text-text-primary-dark bg-card-primary dark:bg-card-primary-dark rounded-lg opacity-0 tooltip border border-border-primary dark:border-border-primary-dark">
                                Salin
                            </div>



                    </div>

                    <div class="flex justify-center space-x-4 lg:justify-normal">
                        <AppButtonSecondary @click="generateQr(result.shortedLink)">Generate QR Code
                        </AppButtonSecondary>
                        <AppButtonSecondary @click="resetForm">Paste Another</AppButtonSecondary>
                    </div>

                    <section class="mt-4 z-10" v-show="qr">
                        <div class="w-36 h-36 mx-auto lg:m-0">
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
import { AppAlertSuccess, AppAlertError } from '#components'

useHead({
    title: 'Paste!'
})

const qr = ref('')

const baseFormData = {
    title: '',
    text: '',
    shortTypePicked: 'auto',
    url_key: ''
}

const formData = ref({
    title: '',
    text: '',
    shortTypePicked: 'auto',
    url_key: ''
})

const result = ref({
    paste: '',
    shortedLink: ''
})

const paste = async () => {
    const { data: data, error } = await useAPI('paste', {
        method: 'POST',
        query: {
            title: formData.value.title,
            text: formData.value.text
        }
    })

    if (data.value.code === 200) {
        useAlertsStore().openModal({
            component: AppAlertSuccess,
            props: {
                text: data.value.message
            }
        })
        result.value.paste = data.value.result
    }

    if (error.value) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: error.value.message
            }
        })
    }
}


const createShorten = async function () {
    const bodyData = createFormData({
        destination_url: result.value.paste.url,
        url_key: formData.value.url_key
    })

    const { data: data, error } = await useAPI('shorten', {
        method: 'POST',
        body: bodyData
    })

    if (data.value.code === 200) {
        result.value.shortedLink = data.value.result.short_link
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

const generateQr = async (link) => {
    const qrcode = await createQrCode(link)
    qr.value = qrcode
}

const resetForm = () => {
    formData.value = baseFormData
    result.value.paste = '',
        result.value.shortedLink = ''
    qr.value = ''
}

onMounted(() => {
    initTooltips()
})
</script>