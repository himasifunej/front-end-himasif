<template>
    <div class="relative w-full overflow-hidden rounded-xl bg-card-primary dark:bg-card-primary-dark border border-border-primary dark:border-border-primary-dark hover:bg-card-hover dark:hover:bg-card-hover-dark group"
        style="aspect-ratio: 3 / 2">
        <NuxtImg :src="imageUrl" alt="" sizes="250"
            class="absolute inset-0 w-full h-full object-cover rounded-xl transition-transform duration-300 ease-in-out transform group-hover:scale-110" />

        <div v-show="!hideDate" :class="[isLatest ? 'left-2' : 'left-1/2 -translate-x-1/2']"
            class="hidden md:block absolute top-2  bg-bg-secondary dark:bg-bg-secondary-dark text-text-primary dark:text-text-primary-dark text-[10px] leading-[10px] p-2 rounded">
            {{ isLatest ? 'Blog Terbaru' : getDatePublished(publishedDate) }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    imageUrl: String,
    publishedDate: String,
    isLatest: Boolean,
    hideDate: Boolean
});

const getDatePublished = (publishedDate) => {
    const date = new Date(publishedDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};
</script>