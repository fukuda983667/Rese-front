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
                <button class="favorite__toggle__button">
                    <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M380.63,32.196C302.639,33.698,264.47,88.893,256,139.075c-8.47-50.182-46.638-105.378-124.63-106.879
                            C59.462,30.814,0,86.128,0,187.076c0,129.588,146.582,189.45,246.817,286.25c3.489,3.371,2.668,3.284,2.668,3.284
                            c1.647,2.031,4.014,3.208,6.504,3.208v0.011c0,0,0.006,0,0.011,0c0,0,0.006,0,0.011,0v-0.011c2.489,0,4.856-1.177,6.503-3.208
                            c0,0-0.821,0.086,2.669-3.284C365.418,376.526,512,316.664,512,187.076C512,86.128,452.538,30.814,380.63,32.196z" fill="currentColor"></path>
                    </svg>
                </button>
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

.favorite__toggle__button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.heart-icon {
    width: 40px; /* 必要に応じてサイズを調整 */
    height: 40px; /* 必要に応じてサイズを調整 */
    color: #ededed;
}
</style>