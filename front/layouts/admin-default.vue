<template>
        <header class="header">
            <div class="header__container">
                <AdminHamburgerMenu />
                <ShopSearch v-if="isIndexPage" />
            </div>
        </header>
        <main class="main">
            <NuxtPage />
        </main>
        <footer class="footer"></footer>
</template>

<script setup>
const route = useRoute()
const isIndexPage = computed(() => route.path === '/')
</script>

<style>
body {
    display: flex;
    justify-content: center;
    margin: 0;
    background-color: #ededed;
}
</style>

<style scoped>
.header {
    position: sticky;
    top: 0px;
    background-color: #ededed;
    z-index: 100;
}

.header__container {
    display: flex;
    margin: 0 auto 10px;
    padding: 40px 20px;
    max-width: 1130px;
    width: 100%;
    justify-content: space-between;
    text-align: center;
    box-sizing: border-box;
}

.main {
    margin: 0 auto;
    padding: 0 20px;
    max-width: 1130px;
    width: 100%;
    box-sizing: border-box;
}

.footer {
    margin: 0 auto;
    padding: 0 20px;
    max-width: 1130px;
    width: 100%;
    box-sizing: border-box;
}
</style>