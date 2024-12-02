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
            abortNavigation()
            return navigateTo('/')
        }

    }

    
})
