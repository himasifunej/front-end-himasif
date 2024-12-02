<template>
    <div class="gap-[5px] mt-[5px]">
        <div class="flex items-center">
            <h5
                class="text-title-blog-sm md:text-title-blog text-text-primary dark:text-text-primary-dark line-clamp-2 md:line-clamp-1">
                {{ title }}
            </h5>
        </div>

        <div class="py-1">
            <div
                class="p-1 rounded-md border border-border-primary dark:border-border-primary-dark justify-start items-center gap-[5px] inline-flex">
                
                <div
                    class="px-1 py-0 md:p-0.5 bg-text-placeholder dark:bg-text-placeholder-dark rounded flex-col justify-center items-center gap-2.5 inline-flex">
                    <div
                        class="text-white dark:text-white text-deskripsi-sm md:text-xs md:font-normal md:leading-3">
                        #
                    </div>
                </div>

                <div
                    class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-xs md:font-normal leading-none hover:text-text-primary dark:hover:text-text-primary-dark">
                    {{ category }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    category: String,
});
</script>

<style scoped>
#blog-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
