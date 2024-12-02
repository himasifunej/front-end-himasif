<template>
    <div class="">
        <input type="radio" name="category" :value="option.id" :id="createID" class="hidden"
            @change="$parent.$emit('update:modelValue', $event.target.value)" :checked="isChecked" required />
        <label :for="createID" class="py-2 px-4 rounded-lg cursor-pointer text-deskripsi-sm md:text-deskripsi" :class="getCheckStyle">
            {{ option.title || option.name }}
        </label>
    </div>
</template>

<script setup>

const createID = computed(() => {
    const token = Array.from(Array(10), () => Math.floor(Math.random() * 36).toString(36)).join('')
    return props.option.id + '-' + token
})

const getCheckStyle = computed(() => {
    return props.isChecked ? 'bg-card-pressed dark:bg-card-pressed-dark text-text-primary dark:text-text-primary-dark' : 'hover:bg-card-hover hover:text-text-primary text-text-secondary bg-card-primary dark:hover:bg-card-hover-dark dark:hover:text-text-primary-dark dark:text-text-secondary-dark dark:bg-card-primary-dark'
})

const props = defineProps({
    option: {
        required: true,
        type: Object
    },
    isChecked: {
        type: Boolean
    },
})

defineEmits(['update:modelValue'])
</script>