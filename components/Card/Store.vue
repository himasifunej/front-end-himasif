<template>
  <nuxt-link :to="item.link == '-' ? 'https://www.tokopedia.com/highst-official' : item.link" target="_blank">
    <div
      class="border border-border-primary bg-bg-card space-y-2 rounded-2xl h-full bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark"
      :class="isOutOfStock ? 'cursor-not-allowed' : 'hover:bg-card-hover active:bg-card-pressed dark:hover:bg-card-hover-dark dark:active:bg-card-pressed-dark'">
      <div class="relative">
        <span
          class="absolute bottom-2 left-1/2 transform -translate-x-1/2 mx-auto p-1 text-[18px] leading-[18px] md:text-[10px] md:leading-[10px] bg-bg-secondary dark:bg-bg-secondary-dark rounded z-20 capitalize"
          v-if="!isOutOfStock">{{
            item.status }}
        </span>

        <span
          class="absolute top-2 left-1/2 transform -translate-x-1/2 mx-auto p-1 text-[18px] leading-[18px] md:text-[10px] md:leading-[10px] bg-bg-secondary dark:bg-bg-secondary-dark rounded z-20 capitalize">

        </span>

        <div>
          <NuxtImg :src="item.image[0].url" alt="" sizes="250" height="208"
            class="rounded-t-2xl w-full h-52 object-cover" :class="isOutOfStock ? 'grayscale opacity-50' : ''">
          </NuxtImg>
        </div>
      </div>

      <div class="space-y-[5px] p-3">
        <h4 class="text-title-blog-sm md:text-title-blog line-clamp-2"
          :class="isOutOfStock ? 'text-text-secondary dark:text-text-secondary-dark' : ''" v-html="item?.title"></h4>
        <h3 class="text-title-4-sm md:text-title-4"
          :class="isOutOfStock ? 'text-text-secondary dark:text-text-secondary-dark' : ''">Rp{{ getPrice(item?.price) }}
        </h3>
      </div>

    </div>
  </nuxt-link>
</template>

<script setup>
const props = defineProps({
  item: Object,
  category: String
})

const getPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(price);
}

const isOutOfStock = computed(() => {
  // return true
  return props.item.status.toLowerCase() == 'out of stock'
})
</script>

<style></style>
