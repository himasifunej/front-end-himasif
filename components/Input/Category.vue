<template>
    <div class="flex flex-row space-x-2 items-center justify-center">
        <slot></slot>
        <CategoryItem class="flex-shrink-0" v-for="option in options" :option="option" :key="option.id" :isChecked="modelValue == option.id"></CategoryItem>
    </div>
</template>

<script setup>
import CategoryItem from './CategoryItem.vue';

const props = defineProps({
    options: {
        required: true,
        type: Object
    },
    modelValue: {
        type: String
    }
})

</script>