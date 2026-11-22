import { AppAlertError } from "#components"

export default defineNuxtRouteMiddleware((to, from) => {

    const { authenticated } = storeToRefs(useAuthStore())
    const token = useCookie('token')

    const privateRoutes = [
        'app-himasifdoc',
        // 'app-vote',
    ]

    if (token.value) {
        authenticated.value = true
    }

    // Dialihkan dari halaman privat saat render server: tampilkan alasannya di browser, lalu bersihkan query.
    if (process.client && to.query['perlu-masuk'] !== undefined) {
        useAlertsStore().openModal({
            component: AppAlertError,
            props: {
                text: "Halo Sisforians, Silahkan login terlebih dahulu"
            }
        }).catch(() => {})
        const query = { ...to.query }
        delete query['perlu-masuk']
        return navigateTo({ path: to.path, query, hash: to.hash }, { replace: true })
    }

    if (!token.value && privateRoutes.includes(to.name)) {

        if (process.client) {
            abortNavigation()
            useAlertsStore().openModal({
                component: AppAlertError,
                props: {
                    text: "Halo Sisforians, Silahkan login terlebih dahulu"
                }
            })
            return navigateTo('/')

        }

        if (process.server) {
            // Tanpa penjelasan di server: alihkan dengan penanda, modal "login dulu" muncul di browser.
            return navigateTo({ path: '/', query: { 'perlu-masuk': '1' } })
        }

    }

    
})
