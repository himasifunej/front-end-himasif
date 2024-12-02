<template>
    <div class="bg-bg-primary text-text-primary dark:text-text-primary-dark dark:bg-bg-primary-dark">
        <section class="">
            <div class="w-full h-[50vh] lg:h-[70vh] relative overflow-hidden flex">
                <div class="h-3/4 w-full bg-gradient-to-t from-bg-primary dark:from-bg-primary-dark to-transparent bottom-0 absolute z-10"></div>
                <NuxtImg src="/img/banner/store.webp" sizes="1000"
                    class="object-cover absolute top-0 left-0 h-full w-full" alt="profile image" />

                <AppContainer class="relative z-10 pb-2 text-text-primary dark:text-text-primary-dark h-full flex flex-col justify-end">

                    <NuxtImg src="/img/logo/banner/highst-logo.png" width="200" class="w-[100px] lg:w-[150px]" alt="">
                    </NuxtImg>

                    <h1
                        class="text-[55px] font-extrabold leading-[48px] md:text-[48px] lg:text-[64px] xl:text-[80px] mb-8 ">
                        Just HIGHST.</h1>

                    <form @submit.prevent="searchProduct">
                        <InputSearch placeholder="Cari" v-model="searchValue" class="w-full md:w-1/3 mb-5">
                        </InputSearch>
                    </form>

                    <div class="overflow-auto -mx-8 pl-8 pr-4 no-scrollbar">
                        <div class="border border-border-primary bg-card-primary dark:border-border-primary-dark dark:bg-card-primary-dark rounded-xl pt-3 md:pt-2 pb-3 px-14 md:px-2 w-fit">
                            <InputCategory :options="productCategories.data" v-model="selectedCategory">
                                <div class="flex-shrink-0">
                                    <input type="radio" name="category" value="all" id="all" class="hidden"
                                        :checked="true" v-model="selectedCategory" required />
                                    <label for="all" class="py-2 px-4 rounded-lg cursor-pointer text-deskripsi-sm md:text-deskripsi"
                                        :class="selectedCategory == 'all' ? 'bg-card-pressed text-text-primary dark:bg-card-pressed-dark dark:text-text-primary-dark' : 'hover:bg-card-hover hover:text-text-primary text-text-secondary bg-card-primary dark:hover:bg-card-hover-dark dark:hover:text-text-primary-dark dark:text-text-secondary-dark dark:bg-card-primary-dark'"> Semua
                                    </label>
                                </div>
                            </InputCategory>
                        </div>
                    </div>



                </AppContainer>
            </div>
        </section>

        <section v-if="products.data.length == 0">
            <AppContainer class="pt-6 pb-8 space-y-6 h-56 flex items-center justify-center">

                <h3 class="text-title-3">Maaf produk yang anda cari tidak tersedia</h3>

            </AppContainer>
        </section>

        <section v-if="products.data.length != 0">
            <AppContainer class="pt-6 pb-20">
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    <CardStore v-for="product in products.data" :item="product"
                        :category="getProductCategory(product.product_category_id)">

                    </CardStore>
                </div>
            </AppContainer>
        </section>
    </div>
</template>

<script setup>
useHead({
    title: 'Store'
})

const { data: products } = await useAPI('/product', {
    query: {
        "sort": "status"
    },
    pick: ["data"]
})

const { data: productCategories } = await useAPI('/product_categories', {
    pick: ['data']
})

const selectedCategory = ref("all")
const searchValue = ref('')

const getProductCategory = (id) => {
    return productCategories.value.data.find((el) => el.id === id).name
}

const searchProduct = async function () {
    const { data: searchedProduct } = await useAPI('/product', {
        query: {
            "search": searchValue.value,
            "sort": "status",
            "filter[product_category_id]": selectedCategory.value == 'all' ? '' : selectedCategory.value
        },
        pick: ['data']
    })

    products.value.data = searchedProduct.value.data
}

watch(selectedCategory, async (newVal, oldVal) => {
    if (newVal == 'all') {
        const { data: newProduct } = await useAPI('/product', {
            query: {
                "search": searchValue.value,
                "sort": "status"
            },
            pick: ['data']
        })

        products.value.data = newProduct.value.data
    } else {
        const { data: newProduct } = await useAPI('/product', {
            query: {
                "search": searchValue.value,
                "sort": "status",
                'filter[product_category_id]': newVal
            },
            pick: ['data']
        })

        products.value.data = newProduct.value.data
    }
})

</script>