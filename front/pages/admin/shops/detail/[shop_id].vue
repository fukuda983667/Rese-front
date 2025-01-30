<template>
    <div class="main__content">
        <div v-if="shop" class="shop__detail__container">
            <div v-if="shop" class="shop__detail">
                <div class="shop__header">
                    <BackButton />
                    <h1 class="shop__name">{{ shop.name }}</h1>
                </div>
                <div class="shop__img">
                    <img :src="shop.image_url" alt="店舗画像">
                </div>
                <div class="shop__details">
                    <p class="shop__region">#{{ shop.region_name }}</p>
                    <p class="shop__genre">#{{ shop.genre_name }}</p>
                </div>
                <p class="shop__description">{{ shop.description }}</p>
            </div>
        </div>

        <div class="review__card__wrapper">
            <ul v-if="reviews" class="review__card__list">
                <li v-for="review in reviews" class="review__card__item">
                    <button class="button__delete__review" @click="deleteReview(review.id)">口コミを削除</button>
                    <ReviewCard :review="review"/>
                </li>
            </ul>
            <p v-else>口コミはありません</p>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth', 'admin'],
    layout: 'admin-default',
});
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

// ルート情報を取得
const route = useRoute();
const shop = ref();
const reviews = ref();
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


// 店舗に寄せられるレビューを取得する関数
const getReviewByShop = async () => {
    try {
        const response = await client(`/api/reviews/shops/${route.params.shop_id}`)
        if (response.reviews.length) {
            reviews.value = response.reviews;
        } else {
            reviews.value = null;
        }
    } catch (error) {
        console.error('店舗レビュー取得エラー:', error)
    }
}

// レビューを削除する
const deleteReview = async (reviewId) => {
    try {
        await client(`/api/admin/reviews/${reviewId}`, {
            method: 'DELETE',
        });
        // 削除後にレビューを再取得
        await getReviewByShop();
    } catch (error) {
        console.error('レビュー削除エラー:', error)
    }
}

onMounted(async () => {
    await getShop();
    await getReviewByShop();
})
</script>


<style scoped>
.main__content {
    display: flex;
    justify-content: space-between;
    margin: 20px 0 100px;
}

/* 店舗情報▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.shop__detail__container {
    width: 46%;
}

.shop__detail {
    position: sticky;
    top: 141px; /* 上部からの距離 */
    height: auto;
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

/* 店舗への口コミ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.review__card__wrapper {
    width: 46%;
}

.review__card__list {
    margin: 0;
    padding: 0;
    list-style-type: none; /* デフォルトのリストスタイルを削除 */
}

.review__card__item {
    margin-bottom: -2px;
    padding: 10px;
    border: 2px solid #ddd;
}

.button__delete__review {
    padding: 0;
    font-size: 16px;
    border: none;
    text-decoration: underline;
    text-decoration-color: #000;
    cursor: pointer;
}

/* 店舗への口コミ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
</style>