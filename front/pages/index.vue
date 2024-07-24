<template>
    <div class="container">
        <h1 :class="titleClass">{{ title }}</h1>
        <p>{{ description }}</p>
        <NuxtLink to="/login">loginへ</NuxtLink>
        <NuxtLink to="/show">showへ</NuxtLink>
        <NuxtLink to="/register">registerへ</NuxtLink>
        <NuxtLink to="/dashboard">dashboardへ</NuxtLink>
        <p v-if="loggedIn">{{ user.name }}さんがログイン中</p>
        <p v-if="loggedIn">メールアドレス: {{ user.email }}</p>
        <p v-else>ログアウト中</p>
    </div>
</template>

<script setup>
    const { user, loggedIn } = useAuth()
    import { computed, } from 'vue'
    const title = 'Nuxt.js'
    const description = "let's learning Nuxt.js"

    const titleClass = computed(() => {
        return loggedIn ? 'logged-in' : 'not-logged-in'
    })
</script>

<style scoped>
    .container {
    padding: 30px;
    }
    .logged-in {
    color: rgb(255, 0, 0);
    }
    .not-logged-in {
    color: black;
    }
</style>
