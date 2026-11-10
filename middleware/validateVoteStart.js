// Halaman voting hanya disembunyikan bila vote setting belum dipublikasikan.
// Fase lain (belum dibuka / dibuka / ditutup / diumumkan) ditangani di halaman.
export default defineNuxtRouteMiddleware(async () => {
  const { data } = await useAPI(VOTING_ENDPOINTS.setting, { key: "vote-setting" });
  if (normalizeVoteSetting(data.value).phase === "unpublished") {
    return navigateTo("/");
  }
});
