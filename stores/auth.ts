import { defineStore } from "pinia";
import { AppAlertError, AppAlertSuccess, AppAlertConfirm } from "#components";

interface UserPayloadInterface {
  email: string;
  password: string;
  remember_me: string;
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    authenticated: false,
    loading: false,
  }),
  actions: {

    async authenticateUser({
      email,
      password,
      remember_me,
    }: UserPayloadInterface) {
      const formData = createFormData({ email, password, remember_me });
      const {
        data: userData,
        pending,
        error,
      }: any = await useAPI("/login", {
        method: "POST",
        body: formData,
      });
      this.loading = pending;

      if (error.value) {
        this.authenticated = false;
        useAlertsStore().openModal({
          component: AppAlertError,
          props: {
            text: "Login gagal",
          },
        });
      }

      const token = useCookie("token");
      const username = useCookie("username");
      const isVote = useCookie("is-vote");

      token.value = userData.value.token;
      username.value = userData.value.data.username;
      isVote.value = userData.value.data.vote_status == 0 ? 'false' : 'true';
      
      useAlertsStore().openModal({
        component: AppAlertSuccess,
        props: {
          text: userData.value.info,
        },
      });
      this.authenticated = true;
    },


    async logUserOut() {
      await useAlertsStore()
        .openModal({
          component: markRaw(AppAlertConfirm),
          props: {
            text: "Apakah kamu yakin ingin logout??",
          },
        })
        .then(async () => {
          const token = useCookie("token");
          const username = useCookie("username");
          const isVote = useCookie("is-vote");
          this.authenticated = false;
          token.value = null;
          username.value = null;
          isVote.value = null;

          useAlertsStore().openModal({
            component: AppAlertSuccess,
            props: {
              text: "Kamu telah berhasil logout",
            },
          });
          // await remove()
          useRouter().push({path: '/'})
        });
    },
  },
});
