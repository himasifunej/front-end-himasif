<template>
    <div>
        <NuxtLoadingIndicator color="white"/>
        <AppNavbar class="w-full"></AppNavbar>
        <slot></slot>

        <AppFooter></AppFooter>
        <AppAlertWindow />
    </div>
</template>
  
<script setup>
const settings = useMySettingsStore()
const navbarStore = useNavbarStore()

await settings.getSettings()

watch(() => getRouteLink(), (newVal, oldVal) => {
    navbarStore.setActiveNav(newVal)
})

onMounted(() => {

    // alert('Still develop, working on incomplete or miss styling until tuesday. Deploy the latest so theres an update for the pages. Feel free to note me on trello for major miss styling, while im fixing the minor miss. Thanks')
})
</script>
  