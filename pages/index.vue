<template>
    <div class="bg-bg-primary text-text-primary dark:bg-bg-primary-dark dark:text-text-primary-dark">
        <section id="banner">
            <div
                class="relative h-[calc(100vh*2/3)] md:h-[90vh] overflow-hidden flex text-center items-end justify-center">

                <div
                    class="h-1/2 w-full bg-gradient-to-t from-bg-primary to-transparent -bottom-1 absolute z-10 dark:from-bg-primary-dark">
                </div>

                <video playsinline autoplay loop poster="" :muted="!bannerSound"
                    class="object-cover absolute top-0 left-0 h-screen w-screen" ref="bannerVideo">
                    <source :src="banner.data[0].video[0].url" type="video/mp4">
                    Your browser does not support the video tag.
                </video>

                <div data-tooltip-target="tooltip-audio" @click="toggleSound"
                    class="absolute top-20 right-10 md:right-20 md:top-auto md:bottom-44 cursor-pointer backdrop-blur-[20px] md:backdrop-blur-none z-[999] bg-color-blur-15 dark:bg-color-blur-15-dark border border-color-blur-30 dark:border-color-blur-30 rounded-full p-2 md:bg-transparent md:dark:bg-transparent md:border-0 md:dark:border-0">
                    <NuxtImg src="/icon/Iconly/Light/volume-up.svg" width="24" height="24" class="w-6 h-6" alt=""
                        v-show="bannerSound" />
                    <NuxtImg src="/icon/Iconly/Light/volume-off.svg" width="24" height="24" class="w-6 h-6" alt=""
                        v-show="!bannerSound" />
                </div>

                <div id="tooltip-audio" role="tooltip"
                    class="hidden md:block absolute z-10 invisible px-2.5 py-2 text-deskripsi text-white bg-card-primary dark:bg-card-primary-dark rounded-lg opacity-0 tooltip border border-border-primary dark:border-border-primary-dark">
                    {{ bannerSound ? 'Mute Video' : 'Unmute Video' }}
                </div>

                <NuxtImg :src="banner.data[0].image_behind[0].url" sizes="1000"
                    class="absolute top-0 left-0 transition ease-in duration-300 w-full object-cover h-full"
                    :class="isPlayVideo ? 'opacity-0' : 'opacity-100'" alt="" />

                <AppContainer class="relative z-10 pb-5 text-white dark:text-white">
                    <NuxtImg :src="banner.data[0].image_front[0].url" width="700" class="mx-auto" alt="" />

                    <div class="flex justify-center gap-4 relative mb-4">
                        <template v-for="ctas in banner.data[0].ctas">
                            <nuxt-link :to="ctas.url">

                                <AppButtonBanner>
                                    <img src="/icon/play-button.svg" v-if="ctas.type == 'video'" class="w-4 mr-3"
                                        alt="">
                                    {{ ctas.title }}
                                </AppButtonBanner>

                            </nuxt-link>
                        </template>
                    </div>

                    <p
                        class="hidden lg:block text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-deskripsi">
                        {{
                            banner.data[0].description }}</p>
                </AppContainer>

            </div>
        </section>

        <section id="program" class="mb-10">
            <ProgramWindow />

            <AppContainer class="md:py-12 space-y-5">
                <h3 class="text-title-2 text-center hidden md:block dark:text-title-2-dark">Program Kerja</h3>

                <div class="grid grid-cols-3 md:grid-cols-6 gap-2.5">
                    <div v-for="program in eventPrograms.data.slice(0, 6)" @mouseenter="playVideo"
                        @mouseleave="stopVideo" @click="selectProgram(program.id)"
                        class="bg-card-primary border border-border-primary relative rounded-lg p-4  aspect-[3/2] flex items-center justify-center group/program cursor-pointer dark:bg-card-primary-dark dark:border-border-primary-dark">
                        <video playsinline muted loop
                            class="object-cover absolute top-0 left-0 h-full w-full rounded-lg">
                            <source :src="program.video[0]?.url || 'https://www.w3schools.com/html/mov_bbb.mp4'"
                                type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div
                            class="absolute w-full h-full top-0 left-0 bg-card-primary dark:bg-card-primary-dark group-hover/program:bg-black group-hover/program:bg-opacity-0 transition ease-in-out duration-500 rounded-lg">
                        </div>
                        <NuxtImg :src="program.logo[0].url" sizes="100"
                            class="w-full max-w-[140px] max-h-20 object-contain z-10 aspect-[3/2]" />
                    </div>
                </div>

                <div class="flex justify-center">
                    <AppButtonPrimary
                        @click="$router.push({ path: '/app/program' }), useNavbarStore().setActiveNav('/program')">
                        Program
                        Kerja
                        Lainnya</AppButtonPrimary>
                </div>
            </AppContainer>
        </section>

        <section id="highst" class="mb-10">
            <AppContainer>
                <div
                    class="relative rounded-[24px] bg-[#101010] dark:bg-[#101010] flex justify-between border border-border-primary dark:border-border-primary-dark">
                    <NuxtImg src="/img/highst/left.png" width="400" class="w-[300px] rounded-[24px] hidden md:block">
                    </NuxtImg>

                    <div class="text-center p-4 space-y-8 top-0 left-0 m-auto items-center w-full">
                        <NuxtImg src="/img/logo/higsht-white.png" class="m-auto w-[200px]" width="400" alt=""></NuxtImg>

                        <p class="m-auto text-deskripsi hidden md:block text-text-primary-dark">Temukan produk terbaik
                            di
                            HighSt. dengan
                            harga
                            yang terjangkau oleh
                            Mahasiswa dengan tetap mengutamakan kualitas</p>

                        <AppButtonSecondary
                            @click="$router.push({ path: '/app/store' }), useNavbarStore().setActiveNav('/store')">
                            Belanja
                            Sekarang
                        </AppButtonSecondary>
                    </div>

                    <NuxtImg src="/img/highst/right.png" width="400" class="w-[300px] rounded-[24px] hidden md:block">
                    </NuxtImg>

                </div>
            </AppContainer>
        </section>

        <section id="blog">
            <AppContainer class="space-y-8">

                <h3 class="text-title-2 text-center">Blog</h3>

                <div class="hidden lg:grid grid-cols-4 gap-5">
                    <CardBlog v-for="blog in blogs.data.slice(0, 4)" :key="blog.id" :data="blog"
                        :category="getBlogCategory(blog.blog_category_id)"
                        @click="$router.push({ path: `/app/blog/${blog.id}` })" />
                </div>

                <!-- For medium (md) screens: display 3 blogs -->
                <div class="hidden md:grid lg:hidden grid-cols-3 gap-5">
                    <CardBlog v-for="blog in blogs.data.slice(0, 3)" :key="blog.id" :data="blog"
                        :category="getBlogCategory(blog.blog_category_id)"
                        @click="$router.push({ path: `/app/blog/${blog.id}` })" />
                </div>

                <!-- For small (sm) screens: display 2 blogs -->
                <div class="grid grid-cols-2 gap-5 md:hidden">
                    <CardBlog v-for="blog in blogs.data.slice(0, 2)" :key="blog.id" :data="blog"
                        :category="getBlogCategory(blog.blog_category_id)"
                        @click="$router.push({ path: `/app/blog/${blog.id}` })" />
                </div>

                <div class="flex justify-center">
                    <AppButtonPrimary
                        @click="$router.push({ path: '/app/blog' }), useNavbarStore().setActiveNav('/app/blog')">
                        Blog
                        Lainnya
                    </AppButtonPrimary>
                </div>

            </AppContainer>
        </section>

        <section class="pb-9">
            <AppContainer>
                <div class="rounded-lg grid mt-10 h-fit grid-cols-2 lg:grid-cols-4">
                    <template v-for="(feature, index) in features" :key="index">
                        <div class="group cursor-pointer relative px-3 h-full flex justify-center items-end" :class="{
                            'lg:rounded-l-[32px]': index === 0, // First item on lg screen (left rounded)
                            'rounded-br-[32px] lg:rounded-r-[32px]': index === features.length - 1, // Last item on lg screen (right rounded)
                            'rounded-tl-[32px]': index === 0, // First item on md or lower (top-left rounded)
                            'rounded-tr-[32px] lg:rounded-tr-none': index === 1, // Second item on md or lower (top-right rounded)
                            'rounded-bl-[32px] lg:rounded-bl-none': index === 2, // Third item on md or lower (bottom-left rounded)
                        }" @click="$router.push(feature.link); useNavbarStore().setActiveNav(feature.link)">
                            <!-- Image -->
                            <NuxtImg :src="`/img/banner/feature/${feature.image}`"
                                class="object-cover h-[200px] lg:h-[350px] w-full absolute top-0 left-0" :class="{
                                    'lg:rounded-l-[32px]': index === 0,
                                    'rounded-br-[32px] lg:rounded-r-[32px]': index === features.length - 1,
                                    'rounded-tl-[32px]': index === 0,
                                    'rounded-tr-[32px] lg:rounded-tr-none': index === 1,
                                    'rounded-bl-[32px] lg:rounded-bl-none': index === 2,
                                }" alt="" />
                            <!-- Overlay -->
                            <div class="absolute top-0 left-0 w-full h-[200px] lg:h-[350px] bg-black bg-opacity-75 transition ease-in duration-150 group-hover:bg-opacity-60"
                                :class="{
                                    'lg:rounded-l-[32px]': index === 0,
                                    'rounded-br-[32px] lg:rounded-r-[32px]': index === features.length - 1,
                                    'rounded-tl-[32px]': index === 0,
                                    'rounded-tr-[32px] lg:rounded-tr-none': index === 1,
                                    'rounded-bl-[32px] lg:rounded-bl-none': index === 2,
                                }"></div>
                            <!-- Content -->
                            <div class="relative text-center flex flex-col items-center justify-center h-[200px] lg:h-[350px]">
                                <h3
                                    class="text-title-1 font-bold uppercase transition ease-in translate-y-full group-hover:translate-y-0 text-text-primary-dark">
                                    {{ feature.title }}
                                </h3>
                                <div class="h-15">
                                    <p
                                        class="opacity-0 transition ease-in group-hover:opacity-100 line-clamp-2 text-deskripsi text-text-primary-dark">
                                        {{ feature.description }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </AppContainer>
        </section>
    </div>
</template>

<script setup>
import { initTooltips } from 'flowbite';

const { authenticated } = storeToRefs(useAuthStore())
const { settings } = useMySettingsStore()
const programStore = useProgramsStore()
const features = [
    {
        title: "shorten link",
        link: "/app/shorten",
        image: "shorten.webp",
        description: "Kamu bisa custom shorten link sesuai keinginanmu"
    },
    {
        title: "nim checker",
        link: "/app/nimchecker",
        image: "nim.webp",
        description: "Kamu bisa cari NIM/nama teman yang ingin kamu tahu"
    },
    {
        title: "himasif paste",
        link: "/app/himasifpaste",
        image: "sif-paste.webp",
        description: "Kamu bisa mengirimkan pesan rahasia ke temenmu dengan HIMASIF Paste"
    },
    {
        title: "himasif qr",
        link: "/app/qr",
        image: "sif-doc.webp",
        description: "Kamu bisa generate QR Codemu dengan HIMASIF QR"
    },

]
const isPlayVideo = ref(false)
const bannerVideo = ref()
const bannerSound = ref(false)
const selectedYear = ref(settings['current-year'])


const { data: banner, error } = await useAPI('/banner', {
    query: {
        "filter[slug]": "banner-home",
        "include": "ctas"
    },
    pick: ['data']
})

if (error.value) {
    console.log(error.value)
}

const { data: eventPrograms } = await useAPI('/work_program', {
    query: {
        "filter[is_highlight]": "1",
        "filter[is_event]": "1"
    },
    pick: ['data']
})

const { data: blogs } = await useAPI('/blog', {
    query: {
        'filter[is_published]': 1
    },
    pick: ['data']
})

const { data: blogCategory } = await useAPI('/blog_category', {
    pick: ['result']
})


const getBlogCategory = (blogId) => {
    return blogCategory.value.result.find((el) => el.id === blogId).title
}


const selectProgram = async function (id) {
    await useRouter().push({
        query: {
            'modal': 'open',
            'selectedProgram': id,
            'year': selectedYear.value
        }
    })

    programStore.openModal(program)
}

const playVideo = (e) => {
    setTimeout(() => {
        e.target.firstChild.play()
    }, 200)
}
const stopVideo = (e) => {
    setTimeout(() => {
        e.target.firstChild.load()
    }, 200)
}

const toggleSound = () => {
    bannerSound.value = !bannerSound.value
}

onMounted(() => {
    initTooltips()

    setTimeout(() => {
        isPlayVideo.value = true
        bannerVideo.value.load();
    }, 8000)
})

</script>

<style scoped></style>