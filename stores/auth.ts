import { defineStore } from "pinia";
import { AppAlertError, AppAlertSuccess, AppAlertConfirm } from "#components";

interface UserPayloadInterface {
  email: string;
  password: string;
  remember_me: string;
}

/** Pemilih boleh mengetik NIM saja; BE login memakai email <NIM>@mail.unej.ac.id. */
export function nimToEmail(input: string): string {
  const v = String(input || "").trim();
  return /^\d{8,20}$/.test(v) ? `${v}@mail.unej.ac.id` : v;
}

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    authenticated: false,
    loading: false,
  }),
  actions: {

    /** Simpan sesi pemilih (dipakai login password dan magic link). */
    setSession(token: string, user: { username?: string; vote_status?: any } = {}) {
      const opts = { maxAge: 60 * 60 * 24 * 7, sameSite: "lax" as const, secure: !import.meta.dev };
      useCookie("token", opts).value = token;
      useCookie("username", opts).value = user.username || "Pemilih";
      useCookie("is-vote", opts).value =
        user.vote_status == 1 || user.vote_status === true ? "true" : "false";
      this.authenticated = true;
    },

    async authenticateUser({
      email,
      password,
      remember_me,
    }: UserPayloadInterface) {
      const formData = createFormData({ email: nimToEmail(email), password, remember_me });
      const {
        data: userData,
        pending,
        error,
      }: any = await useAPI("/login", {
        method: "POST",
        body: formData,
      });
      this.loading = pending;

      if (error.value || !userData.value?.token) {
        this.authenticated = false;
        useAlertsStore().openModal({
          component: AppAlertError,
          props: {
            text: error.value?.data?.info || userData.value?.info || "Login gagal",
          },
        });
        return false;
      }

      this.setSession(userData.value.token, userData.value.data || {});

      useAlertsStore().openModal({
        component: AppAlertSuccess,
        props: {
          text: userData.value.info,
        },
      });
      return true;
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
