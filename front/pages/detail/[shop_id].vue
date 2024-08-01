<template>
    <div v-if="shop" class="shop-detail">
        <h1>{{ shop.name }}</h1>
        <img :src="`/images/shop/${shop.image_url}`" alt="">
        <p>{{ shop.region }}</p>
        <p>{{ shop.genre }}</p>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute();
const shop = ref(null);
const { $apiFetch } = useNuxtApp()

// APIからデータを取得する関数
const getShop = async () => {
    try {
        const response = await $apiFetch(`/api/shops/${route.params.shop_id}`, { method: "GET" });
        shop.value = response.shop;
    } catch (error) {
        console.error("Error fetching shop data:", error);
    }
}

onMounted(() => {
    console.log("test");
    console.log(route.params.shop_id);
    getShop();
});
</script>
