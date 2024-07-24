<template>
    <div>
        <form @submit.prevent="register">
        <dl>
            <dt>名前：</dt>
            <dd><input id="name" type="text" v-model="name" required /></dd>
        </dl>
        <dl>
            <dt>メールアドレス：</dt>
            <dd><input id="email" type="email" v-model="email" required /></dd>
        </dl>
        <dl>
            <dt><label for="password">パスワード：</label></dt>
            <dd><input id="password" type="password" v-model="password" required /></dd>
        </dl>
        <button type="submit">登録</button>
        </form>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const name = ref('')
    const email = ref('')
    const password = ref('')

    const register = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.value,
                    email: email.value,
                    password: password.value,
                }),
            })
            if (response.ok) {
                console.log('登録成功')
                router.push('/login') // 登録後、ログインページにリダイレクト
            } else {
                const data = await response.json()
                console.error('登録失敗:', data.message)
            }
        } catch (error) {
            console.error('登録エラー:', error)
        }
    }
</script>

<style scoped></style>