<template>
    <div class="bg-bg-primary text-text-primary dark:bg-bg-primary-dark dark:text-text-primary-dark">
        <section class="">
            <div class="w-full h-[50vh] lg:h-[70vh] relative overflow-hidden flex">
                <div
                    class="h-3/4 w-full bg-gradient-to-t from-bg-primary dark:from-bg-primary-dark to-transparent bottom-0 absolute z-10">
                </div>
                <NuxtImg src="/img/banner/blog.webp" sizes="1000"
                    class="object-cover absolute top-0 left-0 h-full w-full" alt="profile image" />

                <AppContainer
                    class="relative z-10 pb-5 text-text-primary dark:text-text-primary-dark h-full flex flex-col justify-end">

                    <h1
                        class="text-[55px] font-extrabold leading-[48px] md:text-[48px] lg:text-[64px] xl:text-[80px] mb-12">
                        HIMASIF Blog</h1>

                    <form @submit.prevent="searchBlog">
                        <InputSearch placeholder="Cari" v-model="searchValue" class="w-full md:w-1/3 mb-5">
                        </InputSearch>
                    </form>

                    <div class="overflow-auto -mx-8 pl-8 pr-4 no-scrollbar">
                        <div
                            class="border border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark rounded-xl pt-3 md:pt-2 pb-3 px-[70px] md:px-2 w-fit">
                            <InputCategory :options="blogCategory.result" v-model="selectedCategory">
                                <div class="flex-shrink-0">
                                    <input type="radio" name="category" value="all" id="all" class="hidden"
                                        :checked="true" v-model="selectedCategory" required />
                                    <label for="all"
                                        class="py-2 px-4 rounded-lg cursor-pointer text-deskripsi-sm md:text-deskripsi"
                                        :class="selectedCategory == 'all' ? 'bg-card-pressed text-text-primary dark:bg-card-pressed-dark dark:text-text-primary-dark' : 'hover:bg-card-hover hover:text-text-primary text-text-secondary bg-card-primary dark:hover:bg-card-hover-dark dark:hover:text-text-primary-dark dark:text-text-secondary-dark dark:bg-card-primary-dark'">
                                        Semua
                                    </label>
                                </div>
                            </InputCategory>
                        </div>
                    </div>

                </AppContainer>
            </div>
        </section>

        <section v-if="blogs.data.length == 0">
            <AppContainer class="pt-6 pb-8 space-y-6 h-56 flex items-center justify-center">

                <h3 class="text-title-3">Maaf blog masih belum tersedia</h3>

            </AppContainer>
        </section>

        <section id="content" v-if="blogs.data.length != 0">
            <AppContainer class="pt-6 pb-8 space-y-6 ">

                <div class="grid grid-cols-1 md:grid-cols-2">
                    <div @click="goToDetail(blogs.data[0].id)" class="cursor-pointer space-y-2">

                        <AppBlogPicture :image-url="blogs.data[0].image[0].url" :isLatest="true">

                        </AppBlogPicture>


                        <div class="py-1 space-y-2">

                            <AppBlogContent :title="blogs.data[0].title"
                                :category="getBlogCategory(blogs.data[0].blog_category_id)"></AppBlogContent>
                        </div>
                    </div>

                    <div class="space-y-4 pl-6 hidden md:block" v-if="blogs.data.length > 1">
                        <div v-for="i in 3" @click="goToDetail(blogs.data[i].id)"
                            class="cursor-pointer space-y-2 space-x-3 flex">
                            <AppBlogPicture :image-url="blogs.data[i].image[0].url" :hide-date="true"
                                class="md:w-[150px] lg:w-[250px]">

                            </AppBlogPicture>

                            <div class="space-y-2">
                                <div class="bg-bg-secondary dark:bg-bg-secondary-dark rounded w-fit text-deskripsi p-1">
                                    {{ getPublishedperBlogDay(blogs.data[i].published_date) }}
                                </div>

                                <AppBlogContent :title="blogs.data[i].title"
                                    :category="getBlogCategory(blogs.data[i].blog_category_id)"></AppBlogContent>
                            </div>
                        </div>
                    </div>

                </div>
            </AppContainer>

        </section>

        <section v-if="blogs.data.length > 3">
            <AppContainer class="pb-20 space-y-6">
                <h3 class="text-title-4">Lainnya</h3>

                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    <CardBlog v-for="blog in blogs.data.slice(4)" :data="blog"
                        :category="getBlogCategory(blog.blog_category_id)" @click="goToDetail(blog.id)"></CardBlog>
                </div>

            </AppContainer>
        </section>
    </div>
</template>

<script setup>

useHead({
    title: 'Blog'
})
const route = useRoute();
const selectedCategory = ref('all')
const searchValue = ref('')

searchValue.value = route.query.search

const { data: blogs } = await useAPI('/blog', {
    query: {
        'filter[is_published]': 1,
        "search": searchValue.value,
    },
    pick: ['data']
})

const { data: blogCategory } = await useAPI('/blog_category', {
    pick: ['result']
})

const getBlogCategory = (blogId) => {
    return blogCategory.value.result.find((el) => el.id === blogId).title
}

const searchBlog = async function () {
    const { data: searchedBlog } = await useAPI('/blog', {
        query: {
            "filter[is_published]": 1,
            "search": searchValue.value,
            "filter[blog_category_id]": selectedCategory.value == 'all' ? '' : selectedCategory.value
        },
        pick: ['data']
    })

    blogs.value = searchedBlog.value
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

const goToDetail = function (id) {
    navigateTo(`/app/blog/${id}`)
}

watch(selectedCategory, async (newVal, oldVal) => {
    if (newVal == 'all') {
        const { data: newBlogs } = await useAPI('/blog', {
            query: {
                "search": searchValue.value,
                'filter[is_published]': 1
            },
            pick: ['data']
        })

        blogs.value = newBlogs.value
    } else {
        const { data: newBlogs } = await useAPI('/blog', {
            query: {
                'filter[is_published]': 1,
                "search": searchValue.value,
                'filter[blog_category_id]': newVal
            },
            pick: ['data']
        })

        blogs.value = newBlogs.value
    }
})

onMounted(() => {
})




</script>