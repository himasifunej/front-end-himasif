import { defineStore } from "pinia";
type TransformedResult = { [key: string]: string };

export const useMySettingsStore = defineStore({
  id: "settings",
  state: () => ({
    settings: {},
  }),
  actions: {
    async getSettings() {
      const { data } = await useAPI("/setting", {
        pick: ["result", "code"],
      });
      if (data?.value?.code === 200) {

        const transformArrayToObject = (
          array: Array<{ key: string; value: string }>
        ): TransformedResult =>
          array.reduce((obj: any, item) => {
            obj[item.key.toLowerCase()] = item.value;
            return obj;
          }, {});

        const transformedResult: TransformedResult = transformArrayToObject(
          data.value.result
        );

        this.settings = transformedResult;
      }
    },
  },
});
