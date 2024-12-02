export const useProgramsStore = defineStore({
  id: 'useProgramsStore',
  state: () => ({
    isMounted: false,
    modalState: false,
  }),
  actions: {
    openModal(program) {
      const body = document.body

      if (body) body.style.overflow = "hidden";

      this.modalState = true
      setTimeout(() => {
        this.isMounted = true
      }, 75)
    },
    closeModal() {
      useRouter().replace({
        query: {
          'modal' : undefined,
          'selectedProgram' : undefined
        }
      })
      
      this.isMounted = false

      setTimeout(() => {
        this.modalState = false;
      },300)

      const body = document.body

      if (body) body.style.overflow = "auto";
    },
  }
})
