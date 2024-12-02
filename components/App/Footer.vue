<template>
    <div class="bg-bg-secondary dark:bg-bg-secondary-dark">
        <AppContainer class="py-12">

            <NuxtImg src="/img/logo/himasif-white.png" sizes="90" class="w-24" alt="" />
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-between text-text-primary dark:text-text-primary-dark mt-10 gap-5">
                <div class="space-y-4 relative z-0">
                    <h5 class="text-title-4-sm md:text-title-4">HIMASIF</h5>
                    <p class="text-deskripsi-sm md:text-deskripsi text-text-secondary dark:text-text-secondary-dark w-4/5">{{ settings.alamat }}</p>
                </div>

                <div class="hidden lg:block">
                    <h5 class="text-title-4-sm md:text-title-4 mb-4">Program Kerja</h5>
                    <div class="border-b border-b-text-placeholder dark:border-b-text-placeholder-dark mb-4"></div>

                    <AppButtonFooter>Serigala Sistem Informasi</AppButtonFooter>
                    <AppButtonFooter>ISIC</AppButtonFooter>
                    <AppButtonFooter>IT Convert</AppButtonFooter>
                    <AppButtonFooter>Highst</AppButtonFooter>
                </div>

                <div class="">
                    <h5 class="text-title-4-sm md:text-title-4 mb-4">Media Sosial</h5>
                    <div class="border-b border-b-text-placeholder dark:border-b-text-placeholder-dark mb-4"></div>

                    <NuxtLink :to="settings.instagram" target="_blank">
                        <AppButtonFooter>Instagram</AppButtonFooter>
                    </NuxtLink>

                    <NuxtLink :to="settings.youtube" target="_blank">
                        <AppButtonFooter>Youtube</AppButtonFooter>
                    </NuxtLink>

                    <NuxtLink :to="settings.tiktok" target="_blank">
                        <AppButtonFooter>TikTok</AppButtonFooter>
                    </NuxtLink>
                </div>

                <div class="">
                    <h5 class="text-title-4-sm md:text-title-4 mb-4">Hubungi</h5>
                    <div class="border-b border-b-text-placeholder dark:border-b-text-placeholder-dark mb-4"></div>

                    <NuxtLink :to="settings['e-mail']" target="_blank">
                        <AppButtonFooter>Email</AppButtonFooter>
                    </NuxtLink>

                    <NuxtLink :to="settings.whatsapp" target="_blank">
                        <AppButtonFooter>Whatsapp</AppButtonFooter>
                    </NuxtLink>
                </div>
            </div>

            <p class="text-deskripsi-sm md:text-deskripsi text-text-secondary dark:border-b-text-placeholder-dark mt-10">© 2024 HIMASIF </p>


        </AppContainer>
    </div>
</template>

<script setup>
import { AppAlertSuccess, AppAlertError } from '#components';
const { settings } = useMySettingsStore()

const criticism_n_suggestion = ref('')

const submitKritikSaran = async () => {
    const formData = createFormData({ criticism_n_suggestion: criticism_n_suggestion.value })
    const { data, error } = await useAPI('/criticism_n_suggestion', {
        method: 'POST',
        body: formData
    })

    if (data.value.code !== 200 || error.value) {
        criticism_n_suggestion.value = ''
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: data.value.message || error.value
            }
        })
    }

    criticism_n_suggestion.value = ''
    useAlertsStore().openModal({
        component: AppAlertSuccess,
        props: {
            text: data.value.message
        }
    })
}

</script>