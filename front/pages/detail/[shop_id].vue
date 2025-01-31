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
                <p class="shop__region">#{{ shop.region_name }}</p>
                <p class="shop__genre">#{{ shop.genre_name }}</p>
            </div>
            <p class="shop__description">{{ shop.description }}</p>

            <div class="review__list__wrapper">
                <button class="button__show__review__list" @click="toggleReviewList">
                    {{ isReviewListVisible ? '口コミを非表示にする' : '全ての口コミ情報' }}
                </button>
                <ul v-if="isReviewListVisible" class="review__list">
                    <li v-for="review in reviews" class="review__list__item">
                        <ReviewCard :review="review"/>
                    </li>
                </ul>
            </div>

            <div v-if="review" class="user__review__wrapper">
                <div class="user__review__info">
                    <span>あなたの口コミ</span>
                    <div class="user__review__button__wrapper">
                        <NuxtLink :to="{ name: 'reviews-edit-shop_id', params: { shop_id: shop.id } }" class="link__review__edit">
                            口コミを編集
                        </NuxtLink>
                        <button class="button__delete__review" @click="deleteUserReviewForShop()">口コミを削除</button>
                    </div>
                </div>

                <ReviewCard :review="review"/>
            </div>
            <nuxt-link v-if="canReview && !review" :to="{ name: 'reviews-shop_id', params: { shop_id: shop.id } }">
                口コミを投稿する
            </nuxt-link>
        </div>

        <ReservationForm class="reservation__form" v-if="shop" :shop="shop" />
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
const canReview = ref();
const reviews = ref()
const review = ref();
const isReviewListVisible = ref(false);
const client = useSanctumClient()
console.log(shop)

// 口コミリストの表示・非表示を切り替える
const toggleReviewList = async () => {
    if (!isReviewListVisible.value) {
        await getReviewByShop();
    }
    isReviewListVisible.value = !isReviewListVisible.value;
}

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
        reviews.value = response.reviews
    } catch (error) {
        console.error('店舗レビュー取得エラー:', error)
    }
}

// ユーザがレビューできるか否か来店履歴を取得
const getCanUserReview = async () => {
    try {
        const response = await client(`/api/reviews/shops/${route.params.shop_id}/can-review`)
        canReview.value = response.can_review
    } catch (error) {
        console.error('レビュー可否取得エラー:', error)
    }
}

// ユーザが投稿したレビューを取得
const getUserReviewForShop = async () => {
    try {
        const response = await client(`/api/reviews/shops/${route.params.shop_id}/user`)
        review.value = response.review
    } catch (error) {
        console.error('レビュー取得エラー:', error)
    }
}

// ユーザが投稿したレビューを削除する
const deleteUserReviewForShop = async () => {
    try {
        await client(`/api/reviews/shops/${route.params.shop_id}/user`, {
            method: 'DELETE',
        });
        review.value = null;
    } catch (error) {
        console.error('レビュー削除エラー:', error)
    }
}

onMounted(async () => {
    await getShop();
    await getCanUserReview();
    await getUserReviewForShop();
})
</script>


<style scoped>
.main__content {
    display: flex;
    justify-content: space-between;
    margin: 20px 0 100px;
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


/* 口コミ表示▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.button__show__review__list {
    display: inline-block;
    margin: 20px 0;
    padding: 6px;
    width: 100%;
    background: #5480f7;
    color: white;
    font-size:18px;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
}

.review__list {
    list-style-type: none;
}
/* 口コミ表示▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

/* ユーザ自身の口コミ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.user__review__wrapper {
    padding: 15px 0 30px;
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
}

.user__review__info {
    display: flex;
    justify-content: space-between;
}

.user__review__button__wrapper {
    display: flex;
    gap: 15px;
}

.link__review__edit {
    color: #000;
}

.button__delete__review {
    padding: 0;
    font-size: 16px;
    border: none;
    text-decoration: underline;
    text-decoration-color: #000;
    cursor: pointer;
}

/* ユーザ自身の口コミ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

.reservation__form {
    position: sticky;
    top: 170px; /* 上部からの距離 */
    height: 600px;
}


/* タブレット＆スマホ向け（～768px） */
@media screen and (max-width: 768px) {
    .main__content {
        flex-direction: column;
        gap: 20px;
    }

    .shop__detail, .reservation__form {
        width: 100%;
    }

    :deep(.modal) {
        width: 80%;
    }
}
</style>