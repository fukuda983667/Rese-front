<template>
    <HamburgerMenu />
    <div class="container">
        <NuxtLink class="link" to="/">Home</NuxtLink>
        <NuxtLink class="link" to="/user/register">Registration</NuxtLink>
        <NuxtLink class="link" to="/user/login">Login</NuxtLink>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    margin-top: 150px;
    flex-direction: column; /* リンクを縦に並べる */
    align-items: center; /* 水平方向の中央揃え */
}

.link {
    margin: 10px 0; /* リンク間の上下の余白を設定 */
    font-size: 28px;
    text-decoration: none;
}
</style>
