<template>
    <div class="container">
        <h2>ショップ一覧</h2>
        <div class="button__wrapper">
            <NuxtLink class="shop__create__button" to="/vendor/shops/create">新規作成</NuxtLink>
        </div>
    </div>

    <!-- ショップ一覧のテーブル表示 -->
    <table>
        <thead>
        <tr>
            <th>ショップ名</th>
            <th>地域</th>
            <th>ジャンル</th>
            <th>予約情報</th>
            <th>編集</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(shop, index) in paginatedShops" :key="index">
            <td>{{ shop.name }}</td>
            <td>{{ shop.region }}</td>
            <td>{{ shop.genre }}</td>
            <td>
                <NuxtLink :to="{ name: 'vendor-shops-shop_id-reservations', params: { shop_id: shop.id } }" class="reservations__button">
                    予約一覧
                </NuxtLink>
            </td>
            <td>
                <NuxtLink :to="{ name: 'vendor-shops-shop_id-edit', params: { shop_id: shop.id } }" class="edit__button">
                    編集
                </NuxtLink>
            </td>
        </tr>
        </tbody>
    </table>

    <!-- ページネーション -->
    <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">前のページ</button>
        <span>ページ {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">次のページ</button>
    </div>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
    middleware: ['sanctum:auth', 'vendor'],
    layout: 'vendor-default',
})

const client = useSanctumClient()
const shops = ref([])
const currentPage = ref(1)
const itemsPerPage = 10


// ショップ一覧を取得する関数
const getShops = async () => {
    try {
        const response = await client('api/vendor/shops')
        shops.value = response.shops
    } catch (error) {
        console.error('ショップ一覧の取得エラー:', error)
    }
}



// ショップの一部をページごとに表示するための計算プロパティ
const paginatedShops = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return shops.value.slice(start, end)
})

// 全ページ数を計算するプロパティ
const totalPages = computed(() => {
    return Math.ceil(shops.value.length / itemsPerPage)
})

// 次のページへ
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

// 前のページへ
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

// コンポーネントがマウントされたらショップ一覧を取得
onMounted(() => {
    getShops()
})
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.shop__create__button {
    display: inline-block; /* リンクをインラインブロックに設定 */
    padding: 5px 10px; /* ボタンの内側の余白を設定 */
    font-size: 14px; /* リンクの文字サイズを設定 */
    color: #fff; /* テキストの色を白に設定 */
    background-color: #5fbf50; /* ボタンの背景色を設定 */
    border: none;
    border-radius: 4px; /* ボタンの角を丸くする */
    text-decoration: none; /* 下線を削除 */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
    cursor: pointer;
}

.shop__create__button:hover {
    background-color: #4d9343; /* ホバー時の背景色を設定 */
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