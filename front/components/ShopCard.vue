<template>
    <div class="shop__card">
        <div class="card__img">
            <img :src="`/images/shop/${shop.image_url}`" alt="">
        </div>
        <div class="card__content">
            <h2 class="shop__name">{{ shop.name }}</h2>
            <div class="shop__details">
                <p class="shop__region">#{{ shop.region }}</p>
                <p class="shop__genre">#{{ shop.genre }}</p>
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
    width: 300px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.card__img {
    width: 100%;
    height: 150px; /* 必要に応じて高さを調整 */
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
    padding: 18px;
}

.shop__name,
.shop__region,
.shop__genre {
    margin: 0;
}

.shop__details {
    display: flex; /* 横並びにする */
    gap: 5px; /* 要素間のスペースを追加 */
}

.button__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.shop__detail__button {
    display: inline-block; /* リンクをインラインブロックに設定 */
    padding: 7px 14px; /* ボタンの内側の余白を設定 */
    font-size: 14px; /* リンクの文字サイズを設定 */
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