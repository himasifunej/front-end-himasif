<template>
  <div class="bg-bg-primary text-text-primary dark:bg-bg-primary-dark dark:text-text-primary-dark">
    <AppContainer class="pt-24 pb-20 space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">

        <section class="">
          <article class="">
            <div class="border border-border-primary dark:border-border-primary-dark rounded-xl">
              <NuxtImg :src="blogDetail.result.image[0].url" alt="" sizes="400"
                class="rounded-xl object-cover w-full h-[380px] flex-none">
              </NuxtImg>
            </div>

            <div class="py-1 space-y-1 mt-4">
              <p class="text-deskripsi-sm md:text-deskripsi">{{ getDatePublished }}</p>
              <h5 class="text-title-4-sm md:text-title-4">{{ blogDetail.result.title }}</h5>

              <div class="p-1 rounded-md border border-border-primary dark:border-border-primary-dark justify-start items-center gap-[5px] inline-flex">
                <div
                  class="w-6 md:w-3.5 p-0.5 bg-text-placeholder dark:bg-text-placeholder-dark rounded flex-col justify-center items-center gap-2.5 inline-flex">
                  <div class="w-5 md:w-2.5 text-text-primary-dark text-deskripsi-sm md:text-xs md:font-normal md:leading-3">#</div>
                </div>
                <div class="text-text-secondary dark:text-text-secondary-dark text-deskripsi-sm md:text-xs font-normal md:leading-none hover:text-text-primary dark:hover:text-text-primary-dark">{{
                  getBlogCategory(blogDetail.result.blog_category_id) }}</div>
              </div>
            </div>

            <div class="list-decimal mt-8 text-[18px] leading-[32px] md:text-xs font-normal md:leading-none" v-html="blogDetail.result.content"></div>
          </article>
        </section>


        <aside class="space-y-4 hidden lg:block">
          <h3 class="text-title-4">Blog serupa</h3>

          <div v-for="blog in blogs.data.slice(0, 3)" @click="$router.push({ path: `/app/blog/${blog.id}` })"
            class="cursor-pointer flex space-x-2.5">

            <div class="border border-border-primary dark:text-text-secondary-dark rounded-lg">
              <NuxtImg :src="blog.image[0].url" alt="" height="100" width="150"
                class="w-[150px] h-[100px] rounded-lg object-cover">
              </NuxtImg>
            </div>


            <div class="">
              <div class="bg-bg-secondary rounded w-fit text-deskripsi p-1">
                {{ getPublishedperBlogDay(blog.published_date) }}
              </div>
              <div class="p-1 rounded-md border border-border-primary dark:text-text-secondary-dark justify-start items-center gap-[5px] inline-flex">
                <div
                  class="w-3.5 p-0.5 bg-text-placeholder dark:bg-text-placeholder-dark rounded flex-col justify-center items-center gap-2.5 inline-flex">
                  <div class="w-2.5 text-text-primary-dark text-xs font-normal leading-3">#</div>
                </div>
                <div class="text-text-secondary dark:text-text-secondary-dark text-xs font-normal leading-none hover:text-text-primary dark:hover:text-text-primary-dark">{{
                  getBlogCategory(blog.blog_category_id) }}</div>
              </div>
              <h5 class="text-deskripsi">{{ blog.title }}</h5>
            </div>
          </div>
        </aside>
      </div>

    </AppContainer>
  </div>
</template>

<script setup>

const { data: blogDetail, error } = await useAPI(`/blog/${useRoute().params.id}`, {
  pick: ['result']
})

if (error.value) {
  console.log(error.value)
}

const { data: blogs } = await useAPI('/blog', {
  query: {
    'filter[is_published]': 1
  },
  pick: ['data']
})

const { data: blogCategory } = await useAPI('/blog_category', {
  pick: ['result']
})

const getBlogCategory = (blogId) => {
  return blogCategory.value.result.find((el) => el.id === blogId).title
}

const getPublishedperBlogDay = (dateInput) => {
  const date = new Date(dateInput)

  // Mendapatkan hari dalam format singkat
  const day = date.getDate();

  // Mendapatkan bulan dalam format singkat
  const month = date.getMonth();

  // Mendapatkan tahun
  const year = date.getFullYear();

  return day + "." + month + "." + year
}

const getDatePublished = computed(() => {
  const date = new Date(blogDetail.value.result.published_date);

  // Mendapatkan hari dalam format singkat
  const day = date.getDate();

  // Mendapatkan bulan dalam format singkat
  const month = date.getMonth();

  // Mendapatkan tahun
  const year = date.getFullYear();

  return day + "." + month + "." + year
})

</script>

<style></style>
