<template>
    <div class="user__menu" v-if="isAuthenticated">
        <NuxtLink class="link" to="/admin">Home</NuxtLink>
        <!-- aタグとbuttonタグで文字フォントが変わるからあえてLogoutをaタグで統一 -->
        <NuxtLink class="link" @click="performLogout">Logout</NuxtLink>
        <NuxtLink class="link" to="/admin/mail">Mail</NuxtLink>
    </div>
    <div class="guest__menu" v-else>
        <NuxtLink class="link" to="/admin">Home</NuxtLink>
        <NuxtLink class="link" to="/admin/register">Registration</NuxtLink>
        <NuxtLink class="link" to="/admin/login">Login</NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin-menu',
});

const { isAuthenticated, logout } = useSanctumAuth()

    const performLogout = async () => {
        try {
            // ユーザーをログアウトさせる
            await logout()

            // ログアウト成功後にリダイレクト
            router.push('/admin/login') // リダイレクト先を必要に応じて変更してください
        } catch (error) {
            console.error('ログアウトに失敗しました:', error)
        }
    }
</script>

<style scoped>
.user__menu,
.guest__menu {
    display: flex;
    margin-top: 150px;
    flex-direction: column; /* リンクを縦に並べる */
    align-items: center; /* 水平方向の中央揃え */
}

.link {
    margin: 10px 0; /* リンク間の上下の余白を設定 */
    padding: 0;
    font-size: 28px;
    font-weight: bold;
    color: #365ff5;
    text-decoration: none;
    border: none;
    cursor: pointer;
}

.link:hover {
    color: rgb(51, 30, 158);
}
</style>