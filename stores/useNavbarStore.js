export const useNavbarStore = defineStore({
  id: 'navbarStore',
  state: () => {
    return {
      activeNav: '/',
      navItems: [
        {
          title: "Beranda",
          link: "/",
          icon: "Home.svg",
        },
        {
          title: "Profil",
          link: "/app/profil",
          icon: "Profil.svg",
        },
        {
          title: "Program",
          link: "/app/program",
          icon: "Program.svg",
        },
        {
          title: "Store",
          link: "/app/store",
          icon: "Store.svg",
        },
        {
          title: "Blog",
          link: "/app/blog",
          icon: "Blog.svg",
        },
      ],

      fiturDropdownItems: [
        {
          title: "Shorten Link",
          link: "/app/shorten",
          icon: "shorten.svg"
        },
        {
          title: "NIM Checker",
          link: "/app/nimchecker",
          icon: "nim.svg"
        },
        {
          title: "HIMASIF Paste",
          link: "/app/himasifpaste",
          icon: "paste.svg"
        },
        {
          title: "QR Code",
          link: "/app/qr",
          icon: "qr.svg"
        }
      ]
    }
  },
  getters: {
    isFiturActive: (state) => {
      return state.fiturDropdownItems.some(el => el.link == state.activeNav)
    }
  },
  actions: {
    setActiveNav(item) {
      this.activeNav = item
    },
  }
})
