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
    middleware: ['sanctum:auth','user'],
});

import { useShopStore } from '~/stores/shopStore' // Piniaのストアをインポート
import { useRoute } from 'vue-router'

const shopStore = useShopStore()
const shops = computed(() => shopStore.shops)
const { user, isAuthenticated, refreshIdentity } = useSanctumAuth()
const route = useRoute()
const router = useRouter()

// クエリパラメータに基づいて店舗をフィルタリング
const filteredShops = computed(() => {
    const region = route.query.region || ''
    const genre = route.query.genre || ''
    const name = route.query.name || ''

    let filtered = shops.value.filter(shop => {
        const matchRegion = region ? shop.region_name.includes(region) : true
        const matchGenre = genre ? shop.genre_name.includes(genre) : true
        const matchName = name ? shop.name.includes(name) : true
        return matchRegion && matchGenre && matchName
    })

    // ランダム並べ替え
    if (shopStore.sortBy === '') {
        // ランダムに並べ替え
        filtered = filtered.sort(() => Math.random() - 0.5)
    }
    // ソート処理（評価順）
    else if (shopStore.sortBy === 'high-rating') {
        filtered.sort((a, b) => {
            const ratingA = a.rating || 0;  // 評価がない場合は0とする
            const ratingB = b.rating || 0;  // 評価がない場合は0とする
            return ratingB - ratingA;  // 評価が高い順
        });
    } else if (shopStore.sortBy === 'low-rating') {
        filtered.sort((a, b) => {
            const ratingA = a.rating || 0;  // 評価がない場合は0とする
            const ratingB = b.rating || 0;  // 評価がない場合は0とする
            return ratingA - ratingB;  // 評価が低い順
        });
    }

    // 評価がない店舗は最後に配置する（評価順の場合のみ）
    if (shopStore.sortBy === 'high-rating' || shopStore.sortBy === 'low-rating') {
        filtered.sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            if (ratingA === 0 && ratingB !== 0) return 1;  // 評価がない店舗を下に
            if (ratingB === 0 && ratingA !== 0) return -1; // 評価がない店舗を下に
            return 0;
        });
    }

    return filtered
})

// コンポーネントがマウントされたときに店舗一覧を取得
onMounted(async () => {
    await refreshIdentity()
    await shopStore.fetchShops()
    // クエリパラメータを初期化する
    await router.push({ query: { region: '', genre: '', name: '' } })
})
</script>

<style scoped>
.shop__card__wrapper {
    margin: -15px -10px;
}

.shop__card__list {
    list-style-type: none; /* デフォルトのリストスタイルを削除 */
    padding: 0; /* デフォルトのパディングを削除 */
    margin: 0 -20px 0 0; /* デフォルトのマージンを削除 */
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



/* タブレット＆スマホ向け（～768px） */
@media screen and (max-width: 768px) {
    .shop__card__item {
        margin: 10px 7px; /* Space between items */
        width: calc(50% - 20px); /* 水平マージンを考慮して幅を調整 */
    }

    :deep(.modal) {
        width: 80%;
    }
}
</style>
