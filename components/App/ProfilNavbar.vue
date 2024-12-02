<template>
    <nav class="z-20">
        <!-- <div class="pb-4 flex flex-wrap items-center justify-center border-b border-b-primary-600">
            <div class="items-center justify-between flex" id="navbar-sticky">
                <ul class="flex font-medium text-white space-x-8 items-center">
                    <li v-for="(navItem, index) in navbarItems">
                        <nuxt-link :to="navItem.link" class="font-bold text-lg leading-6"
                            :class="activeItem == index ? 'text-primary-100' : 'text-secondary'"
                            :aria-current="activeItem == index">{{ navItem.title }}
                        </nuxt-link>
                    </li>
                </ul>
            </div>
        </div> -->

        <div class="px-4.5 py-3">
            <h3 class="text-text-primary dark:text-text-primary-dark font-medium leading-[15px] text-[10px]">HIMASIF {{ years }}
            </h3>
        </div>

        <hr class="border-t border-border-primary dark:border-border-primary-dark">

        <ul class="text-[10px] text-secondary p-1.5">
            <template v-for="(navItem, index) in navbarItems">
                <nuxt-link :to="navItem.link" :aria-current="activeItem == index">
                    <li class="rounded py-2 px-3 hover:bg-card-hover dark:hover:bg-card-hover-dark"
                        :class="activeItem == index ? 'text-text-primary bg-card-pressed dark:text-text-primary-dark dark:bg-card-pressed-dark' : 'bg-card-primary text-text-secondary dark:bg-card-primary-dark dark:text-text-secondary-dark'">
                        {{ navItem.title }}
                    </li>
                </nuxt-link>
            </template>

        </ul>
    </nav>
</template>

<script setup>
const { y } = useWindowScroll()
const navbarItems = ref([
    {
        title: "Visi & Misi",
        link: "#vismis"
    },
    {
        title: "Divisi",
        link: "#divisi"
    },
    {
        title: "Program",
        link: "#program"
    },
    {
        title: "Pengurus",
        link: "#pengurus"
    },
    {
        title: "Dokumen",
        link: "#dokumen"
    }
])

const activeItem = ref(0)

const props = defineProps({
    elpos: Array,
    years: String
})

watch(y, (newY, oldY) => {
    if (newY >= props.elpos[0] && newY <= props.elpos[1] - 20) {
        activeItem.value = 0
    } else if (newY >= props.elpos[1] - 20 && newY <= props.elpos[2]) {
        activeItem.value = 1
    } else if (newY >= props.elpos[2] && newY <= props.elpos[3]) {
        activeItem.value = 2
    } else if (newY >= props.elpos[3] && newY <= props.elpos[4]) {
        activeItem.value = 3
    } else if (newY >= props.elpos[4]) {
        activeItem.value = 4
    }
})

</script>