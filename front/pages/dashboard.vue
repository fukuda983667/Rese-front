<template>
    <div>
        <h1>ユーザー一覧</h1>
        <ul>
        <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.email }}</li>
        </ul>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'

    // ユーザーリストの状態を定義
    const users = ref()

    // ユーザーを取得する関数
    const { $apiFetch } = useNuxtApp()
    const getUsers = async () => {
        const response = await $apiFetch(`api/users`, { method: "GET" })
        users.value = response.users
    }

    // コンポーネントがマウントされたときにユーザーを取得
    onMounted(() => {
        getUsers()
    })

    // ページメタ情報を設定
</script>

<style scoped></style>