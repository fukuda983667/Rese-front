<template>
    <div class="shop__card__wrapper">
        <ul class="shop__card__list">
            <li v-for="shop in filteredShops" :key="shop.id" class="shop__card__item">
                <ShopCard :shop="shop"/>
            </li>
        </ul>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});

import { ref, onMounted } from 'vue'
import { useShopStore } from '~/stores/shopStore' // Piniaのストアをインポート
import { useRoute } from 'vue-router'

const shopStore = useShopStore()
const shops = computed(() => shopStore.shops)
const { user, isAuthenticated, refreshIdentity } = useSanctumAuth()
const route = useRoute()

// クエリパラメータに基づいて店舗をフィルタリング
const filteredShops = computed(() => {
    const region = route.query.region || ''
    const genre = route.query.genre || ''
    const name = route.query.name || ''

    return shops.value.filter(shop => {
        const matchRegion = region ? shop.region.includes(region) : true
        const matchGenre = genre ? shop.genre.includes(genre) : true
        const matchName = name ? shop.name.includes(name) : true
        return matchRegion && matchGenre && matchName
    })
})

// コンポーネントがマウントされたときに店舗一覧を取得
onMounted(async () => {
    await refreshIdentity()
    await shopStore.fetchShops()
})
</script>

<style scoped>
.shop__card__wrapper {
    margin: -15px -10px;
}

.shop__card__list {
    list-style-type: none; /* デフォルトのリストスタイルを削除 */
    padding: 0; /* デフォルトのパディングを削除 */
    margin: 0; /* デフォルトのマージンを削除 */
    display: flex;
    flex-wrap: wrap;
}

.shop__card__item {
    margin: 10px 7px; /* Space between items */
    width: calc(25% - 20px); /* 水平マージンを考慮して幅を調整 */
    box-sizing: border-box; /* パディングやボーダーを幅に含める */
}

.shop__card {
    width: 100%;
}
</style>
