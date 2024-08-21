<template>
    <button class="reservation__delete__button" @click="reservationDelete" :disabled="loading">
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="width:28px;height:28px;opacity:1" viewBox="0 0 512 512"><path d="M339.566 150.861 256 234.436l-83.556-83.575-21.574 21.583L234.426 256l-83.556 83.556 21.574 21.583L256 277.574l83.566 83.565 21.573-21.573L277.574 256l83.565-83.556z" class="st0" style="fill:#fff"/><path d="M256 0C114.616.019.018 114.616 0 256c.018 141.385 114.616 255.982 256 256 141.393-.018 255.991-114.615 256-256C511.991 114.616 397.393.019 256 0zm161.762 417.762c-41.44 41.413-98.547 66.995-161.762 66.995-63.214 0-120.312-25.582-161.762-66.995C52.825 376.313 27.244 319.215 27.244 256S52.825 135.688 94.238 94.238C135.688 52.825 192.786 27.244 256 27.244c63.215 0 120.322 25.582 161.762 66.994 41.422 41.45 67.004 98.547 67.004 161.762s-25.582 120.313-67.004 161.762z" class="st0" style="fill:#fff"/></svg>
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    reservationId: {
        type: Number,
        required: true
    }
})
const reservationId = props.reservationId
const loading = ref(false)  // リクエスト中の状態を管理
const router = useRouter()  // ルーターを取得

// 店舗一覧を取得する関数
const client = useSanctumClient()
const reservationDelete = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const response = await client(`/api/reservations/${reservationId}`,{
            method: 'DELETE',
        })
        // 成功時の処理
        await window.location.reload();
        console.log(response)
    } catch (error) {
        console.error('予約削除:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}
</script>


<style scoped>
.reservation__delete__button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}
</style>