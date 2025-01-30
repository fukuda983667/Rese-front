<template>
    <div class="shop__create__container">
        <div class="form__container">
            <h2>新規店舗作成</h2>
            <form @submit.prevent="submitShop" class="shop__form">
                <div class="form__group">
                    <label for="shopName">ショップ名</label>
                    <input type="text" v-model="shopName" id="shopName" class="form__input" />
                    <span class="error__message">{{ nameError }}</span>
                </div>

                <div class="form__group">
                    <label for="shopRegion">地域</label>
                    <select v-model="shopRegion" id="shopRegion" class="form__input">
                        <option value="" disabled>地域を選択してください</option>
                        <option v-for="region in regions" :key="region.id" :value="region.id">{{ region.name }}</option>
                    </select>
                    <span class="error__message">{{ regionError }}</span>
                </div>

                <div class="form__group">
                    <label for="shopGenre">ジャンル</label>
                    <select v-model="shopGenre" id="shopGenre" class="form__input">
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

                <div class="form__group">
                    <label for="shopCsv">CSV アップロード</label>
                    <input type="file" @change="handleCsvUpload" id="shopCsv" class="form__input file__input" />
                    <button type="button" @click="selectCsvFile" class="custom__button">CSVを選択</button>
                    <span class="error__message" v-if="csvError">{{ csvError }}</span>
                </div>

                <button type="submit" :disabled="!isValid" class="submit__button">登録</button>
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
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

definePageMeta({
    middleware: ['sanctum:auth', 'admin'],
    layout: 'admin-default',
})

const router = useRouter()
const { user } = useSanctumAuth()
const client = useSanctumClient()
const regions = ref([])
const genres = ref([])

// バリデーションスキーマ
const validationSchema = yup.object({
    shopName: yup.string().required('ショップ名を入力してください').max(15, 'ショップ名は15文字以内で入力してください'),
    shopRegion: yup.number().required('地域を選択してください'),
    shopGenre: yup.number().required('ジャンルを選択してください'),
    shopDescription: yup.string().required('説明文を入力してください').max(150, '説明文は150文字以内で入力してください'),
})

// フォームのバリデーション設定
const { meta } = useForm({
    validationSchema,
})

// 各フィールドのバリデーション
const { value: shopName, errorMessage: nameError } = useField('shopName')
const { value: shopRegion, errorMessage: regionError } = useField('shopRegion')
const { value: shopGenre, errorMessage: genreError } = useField('shopGenre')
const { value: shopDescription, errorMessage: descriptionError } = useField('shopDescription')

// 画像のアップロード
const shopImage = ref(null)
const shopImagePreview = ref(null)
const imageError = ref('')

// 選択された地域とジャンルの名前
const selectedRegionName = computed(() => regions.value.find(region => region.id === shopRegion.value)?.name || '')
const selectedGenreName = computed(() => genres.value.find(genre => genre.id === shopGenre.value)?.name || '')

// フォームのバリデーション状態をチェック
const isValid = computed(() => meta.value.valid && shopImage.value)


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
        } else if (file.size > 1024 * 1024) { // 1MB
            imageError.value = '画像ファイルは1MB以下にしてください'
            shopImage.value = null
            shopImagePreview.value = null
        } else {
            shopImage.value = file
            imageError.value = ''
            shopImagePreview.value = URL.createObjectURL(file)
        }
    }
}

// csvインポート▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
const csvError = ref('')

// CSV アップロードボタンをクリック
const selectCsvFile = () => {
    document.getElementById("shopCsv").click();
};

// CSV ファイルを解析
const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes('csv')) {
        csvError.value = 'CSV ファイルを選択してください';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const csvContent = e.target.result;
        parseCsv(csvContent);
    };
    reader.readAsText(file);
};

// CSV データを解析してフォームに設定
const parseCsv = (csvContent) => {
    const rows = csvContent.split('\n');
    const [header, ...data] = rows.map(row => row.split(','));

    if (header.includes('name') && header.includes('region_id') && header.includes('genre_id')) {
        const shopData = data[0]; // 1行目のデータを使用
        shopName.value = shopData[header.indexOf('name')];
        shopRegion.value = Number(shopData[header.indexOf('region_id')]);
        shopGenre.value = Number(shopData[header.indexOf('genre_id')]);
        shopDescription.value = shopData[header.indexOf('description')] || '';
        csvError.value = '';
    } else {
        csvError.value = 'CSV のフォーマットが正しくありません';
    }
};
// csvインポート▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲


// 新規ショップ登録
const submitShop = async () => {
    try {
        // FormDataオブジェクトを作成してデータを追加
        const formData = new FormData();
        formData.append('user_id', user.value.id);
        formData.append('name', shopName.value);
        formData.append('region_id', shopRegion.value)
        formData.append('genre_id', shopGenre.value)
        formData.append('description', shopDescription.value);
        formData.append('image', shopImage.value); // 画像ファイルを追加

        await client('api/vendor/shop/create', {
            method: 'POST',
            body: formData, // JSONではなくFormDataオブジェクトを送信
        });

        router.push('/vendor') // リダイレクト先
    } catch (error) {
        console.error('ショップ登録エラー:', error);
    }
};


// ジャンル取得
const getGenres = async () => {
    try {
        const response = await client('/api/genres')

        genres.value = response.genres

    } catch (error) {
        console.error('genres取得エラー:', error)
    }
}

// 地域取得
const getRegions = async () => {
    try {
        const response = await client('/api/regions')

        regions.value = response.regions

    } catch (error) {
        console.error('regions取得エラー:', error)
    }
}

// 初期データ取得
onMounted(async () => {
    await getGenres()
    await getRegions()
})
</script>


<style scoped>
.shop__create__container {
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