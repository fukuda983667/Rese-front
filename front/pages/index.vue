<template>
    <div class="hamburger__menu">
        <HamburgerMenu />
    </div>
    <div class="message">
        <p v-if="loggedIn">{{ user.name }}さんがログイン中</p>
        <p v-if="loggedIn">メールアドレス: {{ user.email }}</p>
        <p v-else>ログアウト中</p>
    </div>

    <div class="shop__card__wrapper">
        <ul class="shop__card__list">
            <li v-for="shop in shops" :key="shop.id" class="shop__card__item">
                <ShopCard :shop="shop" />
            </li>
        </ul>
    </div>
</template>

<script setup>
    const { user, loggedIn } = useAuth()

    import { ref, onMounted } from 'vue'
    // 店舗リストの状態を定義
    const shops = ref()
    // 店舗一覧を取得する関数
    const { $apiFetch } = useNuxtApp()
    const getShops = async () => {
        const response = await $apiFetch(`api/shops`, { method: "GET" })
        shops.value = response.shops
    }

    // コンポーネントがマウントされたときにユーザーを取得
    onMounted(() => {
        getShops()
    })
</script>

<style scoped>
.message {
    padding: 30px;
}

.shop__card__wrapper {
    margin: -15px -10px;
}

.shop__card__list {
    list-style-type: none; /* デフォルトのリストスタイルを削除 */
    padding: 0; /* デフォルトのパディングを削除 */
    margin: 0; /* デフォルトのマージンを削除 */
    display: flex;
    flex-wrap: wrap;
}

.shop__card__item {
    margin: 15px 10px; /* Space between items */
    width: calc(25% - 20px); /* 水平マージンを考慮して幅を調整 */
    box-sizing: border-box; /* パディングやボーダーを幅に含める */
}

.shop__card {
    width: 100%;
}
</style>
