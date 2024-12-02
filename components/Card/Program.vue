<template>
    <div class="bg-card-primary hover:bg-card-hover border border-border-primary dark:bg-card-primary-dark dark:hover:bg-card-hover-dark dark:border-border-primary-dark p-3 rounded-lg cursor-pointer w-[250px] md:w-[175px] lg:w-full">
        <div class="h-40 flex items-center justify-center mb-4" v-if="program.is_event === 1">
            <NuxtImg :src="program.logo[0]?.url || 'https://placehold.co/600x400?text=Not+Found'"
                class="max-w-full max-h-full" sizes="150" alt="" />
        </div>

        <div class="text-start space-y-1">
            <div :class="program.is_event == 1 ? '' : 'h-36 flex items-center break-words'" lang="de">
                <h5 class="text-text-primary dark:text-text-primary-dark"
                    :class="program.is_event === 1 ? 'truncate text-[40px] font-bold leading-9 md:text-title-2' : 'text-[30px] font-bold leading-[40px] line-clamp-3 md:leading-relaxed md:text-xl'">
                    {{ program.title }}
                </h5>
            </div>

            <p class="text-text-primary dark:text-text-primary-dark uppercase text-lg leading-[30px] tracking-wide md:text-xs md:leading-[18px]">
                oleh <span :class="getTextDivisionColor">{{ getDivisionName() }}</span>
            </p>
            <p class="text-deskripsi-sm md:text-deskripsi text-text-secondary dark:text-text-secondary-dark">
                {{ implementation }}
            </p>

            <div class="flex items-center justify-center gap-3">
                <div class="w-3.5 h-3.5 md:w-2 md:h-2 rounded-full shrink-0" :class="getStatusColor"></div>
                <p class="text-deskripsi-sm md:text-deskripsi text-text-secondary dark:text-text-secondary-dark capitalize w-full">
                    {{ getStatusTitle }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    program: Object,
    status: String,
    implementation: String
});

const getStatusColor = computed(() => ({
    "bg-[#00A707]": props.status === "ongoing",
    "bg-[#0093A7]": props.status === "done",
    "bg-[#DAB100]": props.status === "coming soon",
}));

const getStatusTitle = computed(() => {
    if (props.status === "ongoing") {
        return "Sedang Berjalan";
    } else if (props.status === "done") {
        return "Selesai";
    } else if (props.status === "coming soon") {
        return "Segera Datang";
    } else {
        return "Unknown";
    }
})

const getTextDivisionColor = computed(() => ({
    "text-div-psdm": props.program?.division_id === 1,
    "text-div-kader": props.program?.division_id === 3,
    "text-div-litbang": props.program?.division_id === 4,
    "text-div-mediatek": props.program?.division_id === 6,
    "text-div-humas": props.program?.division_id === 5,
}));

const getDivisionName = () => {
    if (props.program?.division_id === 1) {
        return "psdm";
    } else if (props.program?.division_id === 3) {
        return "kaderisasi";
    } else if (props.program?.division_id === 4) {
        return "litbang";
    } else if (props.program?.division_id === 6) {
        return "mediatek";
    } else if (props.program?.division_id === 5) {
        return "humas";
    } else {
        return "unknown"; // Return empty string for invalid division IDs
    }
}
</script>
