<template>
    <button :type="type"
        class="py-4 px-8 font-medium text-text-primary rounded-lg focus:z-10 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#0D0D0D] disabled:text-secondary"
        :class="[props.variant ? computedVariant : 'bg-primary-900 hover:bg-[#292929] focus:bg-primary-800']">
        <slot></slot>
    </button>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'button'
    },
    variant: {
        type: String,
        default: ''
    }
})

const variants = ref({
    primary: "bg-primary-900 hover:bg-[#292929] focus:bg-primary-800",
    secondary: "bg-mediatek hover:bg-[#FF7E1D] focus:bg-[#FF8E3A]",
    store: "bg-[#00A707] hover:bg-[#00A707] focus:bg-[#00A707]"
})

const computedVariant = computed(() => {
    return variants.value[props.variant]
})

</script>