<template>
    <div class="relative rounded-lg aspect-[3/5] flex justify-center items-end group/pengurus z-0 w-full"
        @mouseenter="playVideo" @mouseleave="stopVideo">
        <video playsinline muted loop poster="" class="object-cover absolute top-0 left-0 h-full w-[full] rounded-lg">
            <source :src="data.video[0]?.url" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        <NuxtImg :src="data.image[0]?.url" sizes="250"
            class="h-full w-[200px] object-cover group-hover/pengurus:opacity-0 transition ease-in-out duration-500 z-10 rounded-lg absolute top-0 left-0"
            alt="" />
        <div
            class="absolute w-full h-3/4 bottom-0 left-0 bg-gradient-to-t from-text-primary-dark dark:from-text-primary to-transparent rounded-lg z-10">
        </div>
        <div class="z-20 p-4 text-start space-y-2 w-full text-text-primary dark:text-text-primary-dark">
            <div class="flex items-center">
                <div class="rounded mr-2 w-[30px] h-[30px] flex items-center justify-center"
                    :class="getBackgroundDivisionColor">
                    <NuxtImg :src="division.logo[0].url" width="22" class="w-[22px]" alt="" />
                </div>
                <p class="uppercase text-xl leading-[30px] tracking-widest md:text-xs md:leading-[18px] md:tracking-wide">— {{ data.position }}</p>
            </div>
            <div class="flex items-center md:h-14">
                <p class="text-title-4-sm md:text-title-4 line-clamp-2">{{ data.name }}</p>
            </div>
            <p class="text-deskripsi-sm md:text-deskripsi text-text-secondary dark:text-text-secondary-dark group-hover/pengurus:text-text-primary dark:group-hover/pengurus:text-text-primary-dark">{{ data.hometown }} · SI’{{ data.year_of_study }} ·
                HMSF’{{ data.year_in_hima }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: Object,
    division: Object
})

const getBackgroundDivisionColor = computed(() => ({
    "bg-psdm": props.division.id === 1,
    'bg-primary-900': props.division.id === 2,
    "bg-kaderisasi": props.division.id === 3,
    "bg-litbang": props.division.id === 4,
    "bg-mediatek": props.division.id === 6,
    "bg-humas": props.division.id === 5,
}));

const playVideo = function (e) {
    e.target.firstChild.load();
    e.target.firstChild.play();
};
const stopVideo = function (e) {
    e.target.firstChild.pause();
};
</script>
