<template>
    <h1>メール送信</h1>
    <div class="container">
        <form @submit.prevent="sendEmail" class="email-form">
        <div class="form-group">
            <label for="recipient">送信対象</label>
            <select
            id="recipient"
            v-model="email.recipient"
            required
            class="form-control"
            >
            <option value="all-users">全ユーザー</option>
            <option value="all-vendors">全ベンダー</option>
            </select>
        </div>
        <div class="form-group">
            <label for="subject">件名</label>
            <input
            type="text"
            id="subject"
            v-model="email.subject"
            required
            class="form-control"
            />
        </div>
        <div class="form-group">
            <label for="body">本文</label>
            <textarea
            id="body"
            v-model="email.body"
            required
            class="form-control"
            rows="10"
            ></textarea>
        </div>
        <button type="submit" class="btn">メール送信</button>
        </form>
        <p v-if="message" class="message">{{ message }}</p>
    </div>
</template>

<script setup>
const email = ref({
    recipient: 'all-users',
    subject: '',
    body: '',
});
const message = ref('');
const client = useSanctumClient()
const loading = ref(false)  // リクエスト中の状態を管理

const sendEmail = async (event) => {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    if (loading.value) return;  // すでにリクエスト中の場合は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const response = await client('/api/admin/send-email', {
            method: 'POST',
            body: {
                email_recipient: email.value.recipient,  // フォームデータを使用
                email_body: email.value.body,
                email_subject: email.value.subject,
            },
        });

        console.log(response)
        message.value = 'メール送信に成功しました';
        email.value.subject = '';
        email.value.body = '';

    } catch (error) {
        console.error('メール送信エラー:', error);
        message.value = 'メール送信中にエラーが発生しました。';
    } finally {
        loading.value = false;  // リクエストが終了したら loading 状態を解除
    }
};

definePageMeta({
    middleware: ['sanctum:auth', 'admin'],
    layout: 'admin-default',
});
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 50px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}

.email-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    margin-bottom: 25px;
}

label {
    flex: 0 0 20%; /* 20%の幅を固定 */
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: bold;
}

.form-control {
    flex: 1; /* 残りのスペースを占有 */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

textarea, input, select {
    flex: 1; /* 残りのスペースを占有 */
    padding: 10px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

textarea {
    resize: none; /* テキストエリアのサイズ変更を無効化 */
}

.btn {
    margin: 0 auto;
    padding: 10px 15px;
    width: 200px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #0056b3;
}

.message {
    margin-top: 15px;
    color: #28a745; /* 成功メッセージの色 */
}
</style>