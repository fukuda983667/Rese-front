<template>
    <div>
        <button class="modal__open__button" @click="openModal">
            <svg class="review__icon" width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path class="review__icon--1" d="M92.574,294.24V124.336H43.277C19.449,124.336,0,144.213,0,168.467v206.44c0,24.254,19.449,44.133,43.277,44.133h62v45.469c0,3.041,1.824,5.777,4.559,6.932c2.736,1.154,5.957,0.486,8.023-1.641l49.844-50.76h106.494c23.828,0,43.279-19.879,43.279-44.133v-0.061H172.262C128.314,374.846,92.574,338.676,92.574,294.24z" fill="currentColor"/><path class="review__icon--2" d="M462.717,40H172.26c-27.105,0-49.283,22.59-49.283,50.197v204.037c0,27.61,22.178,50.199,49.283,50.199h164.668l75.348,76.033c2.399,2.442,6.004,3.172,9.135,1.852c3.133-1.322,5.176-4.434,5.176-7.887v-69.998h36.131c27.106,0,49.283-22.59,49.283-50.199V90.197C512,62.59,489.822,40,462.717,40z M369.156,280.115H195.92v-24.316h173.236V280.115z M439.058,204.129H195.92v-24.314h243.138V204.129z M439.058,128.143H195.92v-24.315h243.138V128.143z" fill="currentColor"/></g></svg>
        </button>
        <div class="overlay" @click="closeModal" v-show="isModalOpen"></div>
        <div class="modal" v-show="isModalOpen">
            <h2>「{{ shopName }}」のレビュー</h2>
            <div class="review__card__wrapper">
                <ul class="review__card__list">
                    <li v-for="review in reviews" class="review__card__item">
                        <ReviewCard :review="review"/>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
// props から shopId オブジェクトを取得
const props = defineProps({
    shopId: {
        type: Number,
        required: true
    }
})
const shopId = props.shopId
const shopName = ref()
const reviews = ref()
const client = useSanctumClient()
const isModalOpen = ref(false)

const openModal = async () => {
    await getReviewByShop()
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}


// 店舗情報を取得する関数
const getReviewByShop = async () => {
    try {
        const response = await client(`/api/reviews/shops/${shopId}`)
        reviews.value = response.reviews
        shopName.value = response.shop_name
        console.log(reviews)
    } catch (error) {
        console.error('店舗情報取得エラー:', error)
    }
}
</script>

<style scoped>
.modal__open__button {
    display: inline-block;
    margin-top: 5px;
    margin-left: 10px;
    background: none;
    border: none;
    text-decoration: none;
    cursor: pointer;
}

.review__icon--1 {
    color: #5480f7;
}

.review__icon--2 {
    color: #365ff5;
}

.modal {
    position: fixed;
    width: 700px;
    max-height: 80vh; /* 最大高さを設定 */
    padding: 20px;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    overflow-y: auto;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.review__card__list {
    margin: 0;
    padding: 0;
    list-style-type: none; /* デフォルトのリストスタイルを削除 */
}


</style>