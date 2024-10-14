<template>
    <div class="main__content">
        <div v-if="shop" class="shop__detail">
            <div class="shop__header">
                <BackButton />
                <h1 class="shop__name">{{ shop.name }}</h1>
            </div>
            <div class="shop__img">
                <img :src="shop.image_url" alt="店舗画像">
            </div>
            <div class="shop__details">
                <p class="shop__region">#{{ shop.region }}</p>
                <p class="shop__genre">#{{ shop.genre }}</p>
            </div>
            <p class="shop__description">{{ shop.description }}</p>
        </div>
        <ReservationForm v-if="shop" :shop="shop" /> <!-- v-ifでshopに値が格納されてからReservationFormを表示&データ渡し -->
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth','user'],
    layout: 'default',
});
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

// ルート情報を取得
const route = useRoute();
const shop = ref();
const client = useSanctumClient()
console.log(shop)

// 店舗情報を取得する関数
const getShop = async () => {
    try {
        const response = await client(`/api/shops/${route.params.shop_id}`)
        shop.value = response.shop
    } catch (error) {
        console.error('店舗情報取得エラー:', error)
    }
}

onMounted(async () => {
    await getShop();
})
</script>


<style scoped>
.main__content {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

/* 店舗情報▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.shop__detail, .reservation__form {
    width: 46%;
}

.shop__header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px; /* ボタンと見出しの間のスペース */
}

.shop__name {
    margin: 0;
}

.shop__img img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 画像のトリミングを行う */
}

.shop__details {
    display: flex; /* 横並びにする */
    margin-top: 15px;
    gap: 5px; /* 要素間のスペースを追加 */
}
/* 店舗情報▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
</style>