import { AppAlertError } from "#components";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: vote_settings } = await useAPI("/vote_setting", {
    pick: ["result"],
  });

  if (vote_settings.value?.result.is_published === 0) {
    abortNavigation();
    return navigateTo("/");
  }

  if (
    new Date().getTime() >
    new Date(vote_settings.value?.result.end_at).getTime()
  ) {
    if (process.client) {
      abortNavigation();
      useAlertsStore().openModal({
        component: AppAlertError,
        props: {
          text: "Halo Sisforians, Maaf vote telah ditutup",
        },
      });
      return navigateTo("/");
    }

    if (process.server) {
      abortNavigation();
      return navigateTo("/");
    }
  }
});
