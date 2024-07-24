<script setup>
    definePageMeta({
    middleware: "auth",
    })

    const { $apiFetch } = useNuxtApp()
    const users = ref()
    const { user, loggedIn } = useAuth() // or useState('auth').value

    const post = async () => {
    const response = await $apiFetch(`api/posts`, { method: "POST" })
    users.value = response.users
    }
</script>

<template>
    <div>
        <div v-for="user in users">{{ user.name }}</div>
        <p v-if="loggedIn">ログインユーザー: {{ user?.name }}</p>
        <p v-else>ログインしていません</p>
        <div>
        <button @click="post">ポスト</button>
        </div>
    </div>
</template>

<style></style>