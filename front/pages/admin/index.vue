<template>
    <div class="container">
        <h1>出店者一覧</h1>
        <div class="button__wrapper">
            <button class="modal__open__button" @click="openModal">新規作成</button>
        </div>
    </div>


    <!-- vendors一覧のテーブル表示 -->
    <table>
        <thead>
        <tr>
            <th>名前</th>
            <th>メールアドレス</th>
            <th>運営店舗</th>
            <th>登録日</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(vendor, index) in paginatedVendors" :key="index">
            <td>{{ vendor.name }}</td>
            <td>{{ vendor.email }}</td>
            <td>
                <span v-for="(shop, index) in vendor.shops" :key="shop.id">
                    <nuxt-link :to="{ name: 'admin-detail-shop_id', params: { shop_id: shop.id } }">
                        {{ shop.name }}
                    </nuxt-link>
                    <span v-if="index < vendor.shops.length - 1">, </span>
                </span>
            </td>
            <td>{{ $formatDate(vendor.created_at) }}</td>
        </tr>
        </tbody>
    </table>

    <!-- ページネーション -->
    <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">前のページ</button>
        <span>ページ {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">次のページ</button>
    </div>


    <!-- 新規作成モーダル -->
    <div class="overlay" @click="closeModal" v-show="isModalOpen"></div>
    <div class="modal" v-show="isModalOpen">
        <form @submit.prevent="submitVendor">
            <h2 class="form__title">新規出店者作成</h2>
            <div class="form__group">
                <label for="name">名前</label>
                <input type="text" id="name" v-model="vendorName" placeholder="名前" autocomplete="username"/>
                <p class="error__message" v-if="nameError">{{ nameError }}</p>
            </div>
            <div class="form__group">
                <label for="email">メールアドレス</label>
                <input type="email" id="email" v-model="vendorEmail" placeholder="メールアドレス" autocomplete="email"/>
                <p class="error__message" v-if="emailError">{{ emailError }}</p>
            </div>
            <div class="form__group">
                <label for="password">パスワード</label>
                <input type="password" id="password" v-model="vendorPassword" placeholder="パスワード" autocomplete="new-password"/>
                <p class="error__message" v-if="passwordError">{{ passwordError }}</p>
            </div>
            <button type="submit" class="button__submit" :disabled="!isValid">作成</button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
    middleware: ['sanctum:auth', 'admin'],
    layout: 'admin-default',
});

const client = useSanctumClient()
const vendors = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const isModalOpen = ref(false)


// バリデーションスキーマ
const validationSchema = yup.object({
    vendorName: yup.string().required('名前を入力してください').max(30, '名前は30文字以内で入力してください'),
    vendorEmail: yup.string().required('メールアドレスを入力してください').email('有効なメールアドレスを入力してください'),
    vendorPassword: yup.string().required('パスワードを入力してください').min(8, 'パスワードは8文字以上で入力してください').max(20, 'パスワードは20文字以内で入力してください'),
})

// フォームのバリデーション設定
const { meta } = useForm({
    validationSchema,
})

// 各フィールドのバリデーション
const { value: vendorName, errorMessage: nameError } = useField('vendorName')
const { value: vendorEmail, errorMessage: emailError } = useField('vendorEmail')
const { value: vendorPassword, errorMessage: passwordError } = useField('vendorPassword')

// フォームのバリデーション状態をチェック
const isValid = computed(() => meta.value.valid)


// モーダルの開閉関数
const openModal = () => {
    isModalOpen.value = true
}
const closeModal = () => {
    isModalOpen.value = false
}


// vendors一覧を取得する関数
const getVendors = async () => {
    try {
        const response = await client('api/admin/vendors')
        // vendors一覧取得
        vendors.value = response.vendors
    } catch (error) {
        console.error('vendors一覧の取得エラー:', error)
    }
}


// 新規出店者登録
const submitVendor = async () => {
    try {
        const response = await client('api/vendor/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: vendorName.value,
                email: vendorEmail.value,
                password: vendorPassword.value,
            }),
        })

        closeModal()
        getVendors()

    } catch (error) {
        console.error('出店者登録エラー:', error)
    }
}


// vendorsの一部をページごとに表示するための計算プロパティ
const paginatedVendors = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return vendors.value.slice(start, end)
})

// 全ページ数を計算するプロパティ
const totalPages = computed(() => {
    return Math.ceil(vendors.value.length / itemsPerPage)
})

// 次のページへ
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

// 前のページへ
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

// コンポーネントがマウントされたらvendors一覧を取得
onMounted(() => {
    getVendors()
})
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal__open__button {
    display: inline-block;
    padding: 5px 10px;
    font-size: 15px;
    color: #fff;
    background-color: #5fbf50;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
}

.modal {
    position: fixed;
    width: 500px;
    padding: 20px 20px 40px 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.form__title {
    text-align: center;
}

.form__group {
    display: flex;
    flex-direction: column;
    margin: 0 auto 20px;
    width: 400px;
}

label {
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: bold;
}

input {
    padding: 10px;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none; /* テキストエリアのサイズ変更を無効化 */
}

.button__submit {
    display: block;
    margin: 0 auto; /* 水平方向の余白を自動で中央配置 */
    padding: 8px 20px; /* ボタンの内側の余白を設定 */
    font-size: 16px; /* ボタンの文字サイズを設定 */
    color: #fff; /* テキストの色を白に設定 */
    background-color: #5fbf50; /* ボタンの背景色を設定 */
    border-radius: 4px; /* ボタンの角を丸くする */
    border: none; /* ボタンの枠線を消す */
    cursor: pointer; /* マウスカーソルをポインターにする */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
}

.button__submit:hover,
.modal__open__button:hover {
    background-color: #4d9343; /* ホバー時の背景色を設定 */
}

.error__message {
    margin: 0 0 20px 0;
    color: #ff0000;
    font-weight: bold;
}


table {
    width: 100%;
    border-collapse: collapse;
}
th, td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
}
.pagination {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
button {
    margin: 0 5px;
    padding: 5px 10px;
}
</style>