const basicState = { component: null, props: {}}

export const useAlertsStore = defineStore('alerts', {
    state: () => ({
        modalState: basicState,
        resolvePromise: undefined,
        rejectPromise: undefined
    }),
    actions: {
        onConfirm() {
            this.closeModal()
            this.resolvePromise(true)
        },
        onReject() {
            this.closeModal()
            this.rejectPromise(new Error)
        },
        openModal(payload) {
            const { props, component } = payload;
            const body = document.body

            if (body) body.style.overflow = "hidden";
            
            this.modalState = { component: markRaw(component), props: props || {} };

            return new Promise((resolve, reject) => {
                this.resolvePromise = resolve
                this.rejectPromise = reject
            })
        },
        closeModal() {
            this.modalState = basicState;
            const body = document.body

            if (body) body.style.overflow = "auto";
          },
      
    },
    getters: {

    }
})