<template>
    <div>
        <div>
        <form>
            <dl>
            <dt>メールアドレス：</dt>
            <dd><input id="email" type="string" v-model="email" /></dd>
            </dl>
            <dl>
            <dt><label for="password">パスワード：</label></dt>
            <dd><input id="password" type="password" v-model="password" /></dd>
            </dl>
            <button type="button" @click="login">ログイン</button>
        </form>
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        middleware: "guest",
    })

    const email = ref('')
    const password = ref('')
    const { $sanctumAuth } = useNuxtApp()
    const router = useRouter()
    const login = async () => {
    await $sanctumAuth.login({
        email: email.value, // テストユーザーのメールアドレス
        password: password.value, // テストユーザーのパスワード
    })
}
</script>

<style scoped></style>
