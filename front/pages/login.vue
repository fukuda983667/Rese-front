<template>
    <div class="form__container">
        <p class="form__title">Login</p>
        <form class="form">
            <div class="input__container">
                <label for="email" class="icon email__icon"></label>
                <input id="email" type="text" v-model="email" placeholder="Email" />
            </div>
            <div class="input__container">
                <label for="password" class="icon password__icon"></label>
                <input id="password" type="password" v-model="password" placeholder="Password" />
            </div>
            <button type="button" @click="performLogin">ログイン</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
    middleware: ['sanctum:guest'],
});

const email = ref('')
const password = ref('')
const router = useRouter()
const { login } = useSanctumAuth()

const performLogin = async () => {
    try {
        // 資格情報のペイロードを作成
        const userCredentials = {
            email: email.value,
            password: password.value,
        }

        // ユーザーをログインさせる
        await login(userCredentials)

        // ログイン成功後にリダイレクト
        router.push('/') // リダイレクト先を必要に応じて変更してください
    } catch (error) {
        console.error('ログインに失敗しました:', error)
    }
}
</script>

<style scoped>
.form__container {
    background-color: #fff; /* 背景色を白に設定 */
    border-radius: 5px; /* 角を丸くする */
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); /* 軽い影を追加 */
    width: 400px; /* カードの幅を設定 */
    margin: 50px auto; /* 上下に余白を追加し、中央揃え */
}

.form__title {
    margin: 0;
    padding: 15px;
    background-color: #365ff5;
    color: #fff;
    font-size: 20px;
    border-top-left-radius: 5px; /* 左上の角を丸くする */
    border-top-right-radius: 5px; /* 右上の角を丸くする */
}

.form {
    padding: 25px 30px;
    display: flex; /* 子要素を縦に配置 */
    flex-direction: column; /* 子要素を縦に配置 */
}

.input__container {
    display: flex;
    align-items: center;
    justify-content: center; /* 中央揃え */
    margin-bottom: 25px; /* フィールド間の間隔を追加 */
}

.icon {
    display: block;
    width: 32px; /* アイコンの幅を設定 */
    height: 32px; /* アイコンの高さを設定 */
    background-size: 100%; /* アイコンのサイズを親要素の100%に設定 */
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    margin-right: 10px; /* アイコンと入力フィールドの間隔を設定 */
}

.email__icon {
    background-image: url('../public/images/icon/email.svg');
}

.password__icon {
    background-image: url('../public/images/icon/password.svg');
}

input {
    border: none; /* 枠線を消す */
    border-bottom: 2px solid #000000; /* アンダーラインを追加 */
    padding: 5px; /* 内側の余白を設定 */
    font-size: 16px; /* 文字サイズを設定 */
    outline: none; /* フォーカス時の枠線を消す */
    width: 100%; /* 入力フィールドの幅を100%に設定 */
    box-sizing: border-box; /* パディングを含めてボックスサイズを計算 */
}

input:focus {
    border-bottom-color: #365ff5; /* フォーカス時のアンダーラインの色を設定 */
}

button {
    display: inline-block; /* ボタンをインラインブロックに設定 */
    margin-left: auto; /* 左の余白を自動設定して右に配置 */
    padding: 8px 20px; /* ボタンの内側の余白を設定 */
    font-size: 16px; /* ボタンの文字サイズを設定 */
    color: #fff; /* テキストの色を白に設定 */
    background-color: #365ff5; /* ボタンの背景色を設定 */
    border-radius: 4px; /* ボタンの角を丸くする */
    border: none; /* ボタンの枠線を消す */
    cursor: pointer; /* マウスカーソルをポインターにする */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
}

button:hover {
    background-color: #2e51d0; /* ホバー時の背景色を設定 */
}
</style>