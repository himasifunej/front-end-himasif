<template>
    <div class="cursor-pointer">
        <AppBlogPicture :imageUrl="data.image[0]?.url" :publishedDate="data.published_date" />
        <AppBlogContent :title="data.title" :category="category" />
    </div>
</template>

<script setup>

const props = defineProps({
    data: Object,
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