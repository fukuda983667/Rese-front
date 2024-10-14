<template>
    <div>
        <h2>{{ shop?.name }} の予約一覧</h2>
        <input type="date" v-model="selectedDate" @change="getReservations" />

        <table v-if="reservations && reservations.length > 0">
            <thead>
                <tr>
                    <th>ユーザーID</th>
                    <th>予約日時</th>
                    <th>予約人数</th>
                    <th>QRコード</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reservation in paginatedReservations" :key="reservation.id">
                    <td>{{ reservation.user_id }}</td>
                    <td>{{ reservation.reservation_time }}</td>
                    <td>{{ reservation.reservation_number }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <p v-else>予約がありません。</p>

        <!-- ページネーション -->
        <div class="pagination">
            <button @click="prevPage" :disabled="isFirstPage">前のページ</button>
            <span>ページ {{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="isLastPage">次のページ</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    middleware: ['sanctum:auth', 'vendor'],
    layout: 'vendor-default',
})

const client = useSanctumClient()
const route = useRoute()
const shop = ref(null)
const reservations = ref([])
const selectedDate = ref(new Date().toISOString().split('T')[0])

// ページネーション用
const currentPage = ref(1)
const itemsPerPage = 10

// 店舗情報と予約情報を取得
const getShop = async () => {
    try {
        const { shop: shopData } = await client(`/api/vendor/shops/${route.params.shop_id}`)
        shop.value = shopData
    } catch (error) {
        console.error('店舗情報取得エラー:', error)
    }
}

const getReservations = async () => {
    try {
        const { reservations: reservationData } = await client(`api/vendor/shops/${route.params.shop_id}/reservations?date=${selectedDate.value}`)
        reservations.value = reservationData
        currentPage.value = 1 // データ取得後にページをリセット
    } catch (error) {
        console.error('予約情報取得エラー:', error)
    }
}

// ページネーションロジック
const paginatedReservations = computed(() => {
    if (!reservations.value || reservations.value.length === 0) return []; // データがない場合は空配列を返す
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return reservations.value.slice(start, end);
});

const totalPages = computed(() => {
    return reservations.value && reservations.value.length > 0 ? Math.ceil(reservations.value.length / itemsPerPage) : 1;
});
const isFirstPage = computed(() => currentPage.value === 1)
const isLastPage = computed(() => currentPage.value >= totalPages.value || totalPages.value === 1)

// ページ送りボタンの処理
const nextPage = () => {
    if (!isLastPage.value) currentPage.value++
}

const prevPage = () => {
    if (!isFirstPage.value) currentPage.value--
}

// 日付変更時に予約情報を再取得
watch(selectedDate, async () => {
    currentPage.value = 1 // ページをリセット
    await getReservations() // 新しい予約情報を取得
})

// 初期データ取得
onMounted(async () => {
    await getShop()
    await getReservations()
})
</script>


<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 他のスタイルもadmin/indexに準拠 */
.modal__open__button, .button__submit, .modal, .overlay, .form__group, .pagination, table, th, td, .error__message {
    /* 必要に応じてスタイルを追加 */
}

table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
}
.pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
button {
    margin: 0 5px;
    padding: 5px 10px;
}
</style>