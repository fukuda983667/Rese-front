<template>
    <div class="form__container">
        <p class="form__title">Registration</p>
        <form class="form">
            <div class="input__container">
            <label for="name" class="icon user__icon"></label>
            <input id="name" type="text" v-model="name" placeholder="Username" />
            </div>
            <div class="input__container">
            <label for="email" class="icon email__icon"></label>
            <input id="email" type="text" v-model="email" placeholder="Email" />
            </div>
            <div class="input__container">
            <label for="password" class="icon password__icon"></label>
            <input id="password" type="password" v-model="password" placeholder="Password" />
            </div>
            <button type="button" @click="register">登録</button>
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

.user__icon {
    background-image: url('../public/images/icon/user.svg');
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
    background-color: #0056b3; /* ホバー時の背景色を設定 */
}
</style>