<template>
    <div class="shop__card">
        <div class="card__img">
            <img :src="shop.image_url" alt="店舗画像">
        </div>
        <div class="card__content">
            <div class="card__header">
                <h2 class="shop__name">{{ shop.name }}</h2>
                <div class="shop__review-summary" v-if="shop.rating">
                    <span>{{ shop.rating }}</span>
                    <span class="star__icon"></span>
                    <ReviewList :shopId="shop.id"/>
                </div>
            </div>
            <div class="shop__details">
                <p class="shop__region">#{{ shop.region_name }}</p>
                <p class="shop__genre">#{{ shop.genre_name }}</p>
            </div>
            <div class="button__wrapper">
                <nuxt-link :to="{ name: 'detail-shop_id', params: { shop_id: shop.id } }" class="shop__detail__button">
                    詳しくみる
                </nuxt-link>
                <LikeButton :shopId="shop.id" :isLiked="shop.isLiked"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

// props から shop オブジェクトを取得
const props = defineProps({
    shop: {
        type: Object,
        required: true
    }
})
</script>

<style scoped>
.shop__card {
    width: 180px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.card__img {
    width: 100%;
    height: 120px; /* 必要に応じて高さを調整 */
    overflow: hidden; /* 余分な部分を隠す */
    border-top-left-radius: 5px; /* 左上の角を丸くする */
    border-top-right-radius: 5px; /* 右上の角を丸くする */
}

.card__img img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 画像のトリミングを行う */
}

.card__content {
    padding: 12px;
}

.card__header {
    height: 30px;
    display: flex;
    justify-content: space-between;
    text-align: center;
}

.shop__review-summary {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
}

.shop__name {
    margin: 0;
    font-size: 18px;
}

.shop__region,
.shop__genre {
    margin: 0;
}

.shop__details {
    display: flex; /* 横並びにする */
    margin: 0;
    gap: 5px; /* 要素間のスペースを追加 */
    font-size: 10px;
    font-weight: bold;
}

.star__icon {
    display: inline-block;
    margin-bottom: 5px;
    margin-left: 5px;
    width: 15px; /* アイコンの幅を設定 */
    height: 15px; /* アイコンの高さを設定 */
    background-size: 100%; /* アイコンのサイズを親要素の100%に設定 */
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('../public/images/icon/star.svg');
}

.button__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.shop__detail__button {
    display: inline-block; /* リンクをインラインブロックに設定 */
    padding: 5px 10px; /* ボタンの内側の余白を設定 */
    font-size: 12px; /* リンクの文字サイズを設定 */
    color: #fff; /* テキストの色を白に設定 */
    background-color: #365ff5; /* ボタンの背景色を設定 */
    border: none;
    border-radius: 4px; /* ボタンの角を丸くする */
    text-decoration: none; /* 下線を削除 */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
    cursor: pointer;
}

.shop__detail__button:hover {
    background-color: #2e51d0; /* ホバー時の背景色を設定 */
}
</style>