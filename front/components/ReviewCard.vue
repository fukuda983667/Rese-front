<template>
    <div class="review__card">
        <div class="review__user" v-if="review.user">
            <span>{{ review.user.name }}</span>
        </div>
        <div class="review__rating">
            <span class="stars">
                <svg
                    v-for="star in 5"
                    :key="star"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    :class="['star', { active: star <= review.rating }]"
                >
                    <polygon
                        points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9"
                        fill="currentColor"
                    />
                </svg>
            </span>
        </div>
        <div class="review__date">
            <span>{{ formattedDate }}</span>
        </div>
        <div class="review__text">
            <span>{{ review.review_text }}</span>
        </div>
        <div class="review__image__wrapper" v-if="review.image_url">
            <img :src="review.image_url" alt="参考画像" class="review__image">
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import dayjs from 'dayjs'
// props から shop オブジェクトを取得
const props = defineProps({
    review: {
        type: Object,
        required: true
    },
})

// review.updated_at を 'YYYY-MM-DD' 形式でフォーマット
const formattedDate = computed(() => dayjs(props.review.updated_at).format('YYYY-MM-DD'))
</script>

<style scoped>
.review__card {
    margin-top: 30px;
}

.review__user,
.review__rating,
.review__date,
.review__text {
    display: flex;
    align-items: center;
}

.review__title {
    font-weight: bold;
}

.stars {
    margin-right: 10px
}

.star {
    cursor: pointer;
    color: #d3d3d3; /* 非アクティブな星の色 */
}

.star.active {
  color: #f5a623; /* アクティブな星の色 */
}

.review__image__wrapper {
    margin-left: 10px;
}

.review__image {
    display: block;
    width: 100px;
    height: 100px;
    margin: 10px auto 10px 0;
    object-fit: cover; /* 短い辺に合わせて拡大縮小し、中央を表示 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 見栄えのためのシャドウ */
}
</style>