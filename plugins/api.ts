export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const $api = $fetch.create({
    baseURL: config.public.API_BASE,
    headers: {
      "Accept": "application/json",
      "x-api-key": "909ec9ce33dc2513ba86b0892c48d0"
    },
  });

  return {
    provide: {
      api: $api,
    },
  };
});
