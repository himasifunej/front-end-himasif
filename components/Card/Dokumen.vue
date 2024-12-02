<template>
    <div
        class="px-4 py-2.5 rounded-lg flex items-center space-x-4 border border-border-primary dark:border-border-primary-dark bg-card-primary hover:bg-card-hover active:bg-card-pressed dark:bg-card-primary-dark dark:hover:bg-card-hover-dark dark:active:bg-card-pressed-dark cursor-pointer">
        <NuxtImg src="/icon/Iconly/Light/Paper.svg" width="24" height="24" class="w-6 h-6" alt="" />
        
        <p class="w-full truncate">
            <slot></slot>
        </p>
    </div>
</template>