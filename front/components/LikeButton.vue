<template>
    <button class="like__toggle__button" @click="toggleLike" :disabled="loading">
        <svg :class="{'heart__icon': true, 'isLiked': isLiked}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M380.63,32.196C302.639,33.698,264.47,88.893,256,139.075c-8.47-50.182-46.638-105.378-124.63-106.879
                C59.462,30.814,0,86.128,0,187.076c0,129.588,146.582,189.45,246.817,286.25c3.489,3.371,2.668,3.284,2.668,3.284
                c1.647,2.031,4.014,3.208,6.504,3.208v0.011c0,0,0.006,0,0.011,0c0,0,0.006,0,0.011,0v-0.011c2.489,0,4.856-1.177,6.503-3.208
                c0,0-0.821,0.086,2.669-3.284C365.418,376.526,512,316.664,512,187.076C512,86.128,452.538,30.814,380.63,32.196z" fill="currentColor"></path>
        </svg>
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// props から shopId と isLiked を取得
const props = defineProps({
    shopId: {
        type: Number,
        required: true
    },
    isLiked: {
        type: Boolean,
        required: true
    }
})

const shopId = props.shopId
const isLiked = ref(props.isLiked)  // isLiked を ref でラップ
const loading = ref(false)  // リクエスト中の状態を管理


// `props.isLiked` の変更を監視し、ローカルの `isLiked` を更新
watch(() => props.isLiked, (newVal) => {
    isLiked.value = newVal
})


const client = useSanctumClient()
const { user } = useSanctumAuth()
const toggleLike = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const response = await client('/api/likes', {
            method: 'POST',
            body: {
                user_id: user.value.id,
                shop_id: shopId
            },
        })
        // 成功時の処理
        isLiked.value = !isLiked.value  // 状態を反転
        console.log(response)
    } catch (error) {
        console.error('お気に入り登録解除トグル:', error)
        // エラーハンドリング: 状態を元に戻すか、ユーザーにエラーメッセージを表示する
    } finally {
        loading.value = false;  // リクエスト終了
    }
}


// コンポーネントがマウントされたとき
onMounted(() => {

})
</script>

<style scoped>
.like__toggle__button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}

.heart__icon {
    width: 30px; /* 必要に応じてサイズを調整 */
    height: 30px; /* 必要に応じてサイズを調整 */
    color: #ededed; /* デフォルトの色 */
}

.heart__icon.isLiked {
    color: #eb3023; /* isLiked が true の場合の色 */
}

.like__toggle__button:active .heart__icon {
    color: #eb302388; /* ホバー時の色 */
}
</style>