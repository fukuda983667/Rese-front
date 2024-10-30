<template>
    <div class="shop__edit__container">
        <div class="form__container">
            <h2>ショップ情報更新</h2>
            <form @submit.prevent="submitShop" class="shop__form">
                <div class="form__group">
                    <label for="shopName">ショップ名</label>
                    <input type="text" v-model="shopName" id="shopName" class="form__input" />
                    <span class="error__message">{{ nameError }}</span>
                </div>

                <div class="form__group">
                    <label for="shopRegion">地域</label>
                    <select v-model="shopRegionId" id="shopRegion" class="form__input">
                        <option value="" disabled>地域を選択してください</option>
                        <option v-for="region in regions" :key="region.id" :value="region.id">{{ region.name }}</option>
                    </select>
                    <span class="error__message">{{ regionError }}</span>
                </div>

                <div class="form__group">
                    <label for="shopGenre">ジャンル</label>
                    <select v-model="shopGenreId" id="shopGenre" class="form__input">
                        <option value="" disabled>ジャンルを選択してください</option>
                        <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
                    </select>
                    <span class="error__message">{{ genreError }}</span>
                </div>

                <div class="form__group">
                    <label for="shopDescription">店舗説明文</label>
                    <textarea v-model="shopDescription" id="shopDescription" class="form__input" rows="5"></textarea>
                    <span class="error__message">{{ descriptionError }}</span>
                </div>

                <div class="form__group">
                    <label for="shopImage">店舗画像</label>
                    <input type="file" @change="handleFileUpload" id="shopImage" class="form__input file__input" />
                    <button type="button" @click="selectFile" class="custom__button">画像を選択</button>
                    <span class="error__message" v-if="imageError">{{ imageError }}</span>
                </div>

                <button type="submit" :disabled="!isValid" class="submit__button">更新</button>
            </form>
        </div>


        <!-- プレビュー画面 -->
        <div class="preview__container">
            <h3>プレビュー</h3>
            <div class="preview__content">
                <p class="preview__shop__name">{{ shopName || "店名" }}</p>
                <div v-if="shopImagePreview" class="preview__image">
                    <img :src="shopImagePreview" alt="店舗画像プレビュー" class="preview__img" />
                </div>
                <div class="preview__shop__details">
                    <p>#{{ selectedRegionName || "地域" }}</p>
                    <p>#{{ selectedGenreName || "ジャンル" }}</p>
                </div>
                <p>{{ shopDescription || "説明文" }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
    middleware: ['sanctum:auth', 'vendor'],
    layout: 'vendor-default',
})

const router = useRouter()
const route = useRoute()
const client = useSanctumClient()
const { user } = useSanctumAuth()
const regions = ref([])
const genres = ref([])

// バリデーションスキーマ
const validationSchema = yup.object({
    shopName: yup.string().required('ショップ名を入力してください').max(15, 'ショップ名は15文字以内で入力してください'),
    shopRegionId: yup.string().required('地域を入力してください'),
    shopGenreId: yup.string().required('ジャンルを入力してください'),
    shopDescription: yup.string().required('説明文を入力してください').max(150, '説明文は150文字以内で入力してください'),
})

// フォームのバリデーション設定
const { meta } = useForm({
    validationSchema,
})

// 各フィールドのバリデーション
const { value: shopName, errorMessage: nameError } = useField('shopName')
const { value: shopRegionId, errorMessage: regionError } = useField('shopRegionId')
const { value: shopGenreId, errorMessage: genreError } = useField('shopGenreId')
const { value: shopDescription, errorMessage: descriptionError } = useField('shopDescription')

// 選択された地域・ジャンルの名前を取得
const selectedRegionName = computed(() => {
    const region = regions.value.find(r => r.id === shopRegionId.value)
    return region ? region.name : ''
})

const selectedGenreName = computed(() => {
    const genre = genres.value.find(g => g.id === shopGenreId.value)
    return genre ? genre.name : ''
})

// 画像のアップロード
const shopImage = ref(null)
const shopImagePreview = ref(null)
const imageError = ref('')

// フォームのバリデーション状態をチェック
const isValid = computed(() => meta.value.valid && (shopImage.value || shopImagePreview.value))

// 初期データ取得
const getShop = async () => {
    try {
        const response = await client(`/api/vendor/shops/${route.params.shop_id}`)
        shopName.value = response.shop.name
        shopRegionId.value = response.shop.region_id
        shopGenreId.value = response.shop.genre_id
        shopDescription.value = response.shop.description
        shopImagePreview.value = response.shop.image_url // 既存の画像URLを設定

        regions.value = response.regions
        genres.value = response.genres
    } catch (error) {
        console.error('店舗情報取得エラー:', error)
    }
}

// ファイル選択ボタンをクリックすると、非表示のファイル入力をトリガー
const selectFile = () => {
    document.getElementById("shopImage").click();
};

// 画像のファイルをアップロード
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        if (!file.type.startsWith('image/')) {
            imageError.value = '画像ファイルを選択してください'
            shopImage.value = null
            shopImagePreview.value = null
        } else if (file.size > 2 * 1024 * 1024) { // 2MB
            imageError.value = '画像ファイルは2MB以下にしてください'
            shopImage.value = null
            shopImagePreview.value = null
        } else {
            shopImage.value = file
            imageError.value = ''
            shopImagePreview.value = URL.createObjectURL(file)
        }
    }
}

// 店舗情報の更新
const submitShop = async () => {
    try {
        // FormDataオブジェクトを作成してデータを追加
        const formData = new FormData();
        formData.append('id', route.params.shop_id);
        formData.append('user_id', user.value.id);
        formData.append('name', shopName.value);
        formData.append('region_id', shopRegionId.value)
        formData.append('genre_id', shopGenreId.value)
        formData.append('description', shopDescription.value);
        formData.append('image', shopImage.value); // 画像ファイルを追加

        await client(`api/vendor/shop/update/${route.params.shop_id}`, {
            method: 'PUT',
            body: formData, // JSONではなくFormDataオブジェクトを送信
        });

        router.push('/vendor') // リダイレクト先
    } catch (error) {
        console.error('ショップ更新エラー:', error);
    }
};

// 初期データ取得
onMounted(async () => {
    await getShop()
})
</script>

<style scoped>
.shop__edit__container {
    display: flex;
    justify-content: space-between;

}

.form__container {
    width: 45%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

h2 {
    text-align: center;
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
}

.shop__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form__group {
    display: flex;
    flex-direction: column;
}

label {
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
}

.form__input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
}

.form__input:focus {
    border-color: #007bff;
    outline: none;
}

.error__message {
    color: #e74c3c;
    margin-top: 5px;
    font-weight: bold;
}

.submit__button {
    padding: 12px;
    font-size: 16px;
    color: #fff;
    background-color: #5fbf50;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit__button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.submit__button:not(:disabled):hover {
    background-color: #4d9343;
}


/* 画像選択ボタン▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.file__input {
    display: none; /* デフォルトのファイル入力を非表示 */
}

.custom__button {
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.custom__button:hover {
    background-color: #0056b3;
}
/* 画像選択ボタン▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
/* プレビュー画面▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.preview__container {
    width: 45%;
}

.preview__shop__name {
    font-size: 22px;
    font-weight: bold;
}

.preview__shop__details {
    display: flex; /* 横並びにする */
    margin-top: 15px;
    gap: 5px; /* 要素間のスペースを追加 */
}

.preview__image {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.preview__img {
    width: 100%;
    height: auto;
    object-fit: cover;
}
/* プレビュー画面▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
</style>
