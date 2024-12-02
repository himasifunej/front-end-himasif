<template>
    <button 
        @click="toggleDarkMode" 
        :class="{
            'bg-card-pressed dark:bg-card-pressed-dark hover:bg-border-primary dark:hover:bg-border-primary-dark': isDarkMode,
            'bg-div-psdm': !isDarkMode,
        }" 
        class="inline-flex w-8 transition-colors duration-300 rounded">
            <span 
                :class="{
                'translate-x-0': isDarkMode,
                'translate-x-2': !isDarkMode,
                }" 
        
                class="p-1 transform transition-transform duration-300 bg-card-primary dark:bg-card-primary-dark rounded">

                <NuxtImg src="/icon/Iconly/Light/Moon.svg" width="16" class="w-4" v-show="isDarkMode"/>
                <NuxtImg src="/icon/Iconly/Light/Sun.svg" width="16" class="w-4" v-show="!isDarkMode"/>

            </span>
    </button>
</template>

<script setup>

import { useDarkMode } from '@/composables/useDarkMode';

const { isDarkMode, toggleDarkMode } = useDarkMode();

</script>

<style scoped>
/* Optional styling if you need to customize more */
</style>