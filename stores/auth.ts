import { defineStore } from "pinia";
import { AppAlertConfirm } from "#components";

interface UserPayloadInterface {
  /** NIM atau email UNEJ */
  email: string;
  password: string;
  remember_me?: string | number;
}

const SESSION_COOKIES = ["token", "username", "is-vote"] as const;

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    authenticated: false,
    loading: false,
    /** Naik tiap kali sesi baru dibuat (login/magic link), supaya halaman voting memuat ulang status pemilih. */
    sessionVersion: 0,
  }),
  actions: {
    /** Simpan sesi pemilih (login NIM+password dan magic link). Kontrak v2: { token, expires_at, voter }. */
    setSession(token: string, voter: Partial<Voter> | null = null, expiresAt?: string | null) {
      const exp = parseWib(expiresAt);
      const maxAge = exp
        ? Math.max(60, Math.floor((exp.getTime() - Date.now()) / 1000))
        : 60 * 60 * 12;
      const opts = { maxAge, sameSite: "lax" as const, secure: !import.meta.dev };
      useCookie("token", opts).value = token;
      useCookie("username", opts).value = voter?.name || "Pemilih";
      useCookie("is-vote", opts).value = voter?.election?.has_voted ? "true" : "false";
      this.authenticated = true;
      this.sessionVersion++;
    },

    clearSession() {
      for (const c of SESSION_COOKIES) useCookie(c).value = null;
      this.authenticated = false;
    },

    async authenticateUser({ email, password }: UserPayloadInterface) {
      this.loading = true;
      try {
        const res: any = await useNuxtApp().$api(VOTING_API.login, {
          method: "POST",
          body: loginBody(email, password),
        });
        const d = res?.data ?? {};
        if (!d.token) throw { data: res };
        this.setSession(d.token, d.voter, d.expires_at);
        useToast().success(`Halo, ${d.voter?.name || "Sisforian"}!`, "Kamu sudah masuk.");
        return true;
      } catch (e) {
        this.authenticated = false;
        useToast().error("Gagal masuk", apiError(e).message || "Periksa NIM/email dan password.");
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logUserOut() {
      // openModal(Confirm) me-reject saat dibatalkan.
      try {
        await useAlertsStore().openModal({
          component: markRaw(AppAlertConfirm),
          props: { text: "Yakin ingin keluar?" },
        });
      } catch {
        return;
      }

      // Cabut token di BE (abaikan galat: sesi lokal tetap dihapus).
      const headers = voterAuthHeader();
      if (headers.Authorization) {
        useNuxtApp().$api(VOTING_API.logout, { method: "POST", headers }).catch(() => {});
      }
      this.clearSession();

      useToast().info("Kamu sudah keluar");
      useRouter().push({ path: "/" });
    },
  },
});
