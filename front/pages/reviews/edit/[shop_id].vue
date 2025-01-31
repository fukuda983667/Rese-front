<template>
    <div class="review__wrapper">
        <div class="shop__info" v-if="shop">
            <h2 class="info__message">今回のご利用はいかがでしたか？</h2>
            <ShopCard class="shop__card" :shop="shop"/>
        </div>

        <form class="review__form" v-if="shop" @submit.prevent="submitReview">
            <!-- 評価 -->
            <div class="form__group">
                <h3>体験を評価してください</h3>
                <p class="error__message" v-if="ratingError">{{ ratingError }}</p>
                <div class="stars">
                    <svg
                        v-for="star in 5"
                        :key="star"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        @click="setRating(star)"
                        :class="['star', { active: star <= rating }]"
                    >
                        <polygon
                            points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            </div>

            <!-- コメント -->
            <div class="form__group">
                <h3>
                    <label for="text">口コミ投稿</label>
                </h3>
                <p class="error__message" v-if="reviewTextError">{{ reviewTextError }}</p>
                <textarea
                    id="text"
                    v-model="reviewText"
                    placeholder="気に入ったこと/気に入らなかったことは何ですか？"
                    rows="5"
                ></textarea>
                <span class="review__text__length">{{ reviewText?.length || 0 }}/400 (最高文字数)</span>
            </div>

            <!-- 画像添付 -->
            <div class="form__group">
                <h3>画像の追加</h3>
                <p class="error__message" v-if="imageError">{{ imageError }}</p>
                <div class="input__image__wrapper">
                    <div v-if="imagePreview" class="preview__image">
                        <img :src="imagePreview" alt="レビュー画像プレビュー" class="preview__img" />
                    </div>
                    <label for="review-image" class="button__image__label">クリックして画像を追加</label>
                    <input type="file" id="review-image" accept="image/jpeg, image/png" @change="handleFileUpload" class="input__image" />
                </div>
            </div>
        </form>
    </div>

    <!-- 送信ボタン -->
    <div class="button__wrapper">
        <button class="button__review__submit" :disabled="!isValid" @click="submitReviewEdit">口コミを編集して投稿</button>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth','user'],
    layout: 'default',
});
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const shop = ref();
const review = ref();
const { user } = useSanctumAuth()
const client = useSanctumClient()
const route = useRoute();
const router = useRouter()
const loading = ref(false);  // リクエスト中の状態を管理
const imageFile = ref(null)
const imagePreview = ref(null)
const imageError = ref('')


// バリデーションスキーマの設定
const validationSchema = yup.object({
    rating: yup
        .number()
        .required('評価を入力してください')
        .min(1, '評価は1以上である必要があります'),
    reviewText: yup
        .string()
        .required('レビュー内容を入力してください')
        .max(400, 'レビュー内容は400文字以下で入力してください'),
});

// useFormを使ってバリデーションスキーマを設定
const { meta } = useForm({
    validationSchema,
});

// 各フィールドの定義
const { value: rating, errorMessage: ratingError } = useField('rating');
const { value: reviewText, errorMessage: reviewTextError } = useField('reviewText');

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);

// 評価を設定する関数
const setRating = (star) => {
    rating.value = star;
};


// ファイルアップロード処理
const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const allowedExtensions = ['jpeg', 'png']; // 許可する拡張子
        const fileExtension = file.type.split('/')[1]; // MIMEタイプから拡張子を取得

        if (!file.type.startsWith('image/') || !allowedExtensions.includes(fileExtension)) {
            imageError.value = '画像ファイル（jpeg または png）を選択してください';
            imageFile.value = null;
            imagePreview.value = null;
        } else if (file.size > 1024 * 1024) {
            imageError.value = '画像ファイルは1024KB以下にしてください';
            imageFile.value = null;
            imagePreview.value = null;
        } else {
            imageFile.value = file;
            imageError.value = '';
            imagePreview.value = URL.createObjectURL(file);
        }
    }
};




// 店舗情報を取得する関数
const getShop = async () => {
    try {
        const response = await client(`/api/shops/${route.params.shop_id}`)
        shop.value = response.shop
    } catch (error) {
        console.error('店舗情報取得エラー:', error)
    }
}


// ユーザが投稿したレビュー取得する
const getUserReviewForShop = async () => {
    try {
        const response = await client(`/api/reviews/shops/${route.params.shop_id}/user`)
        review.value = response.review
        console.log(review.value)
        if (review.value) {
            rating.value = review.value.rating; // 初期値として反映
            reviewText.value = review.value.review_text;
            imagePreview.value = review.value.image_url;
        }
    } catch (error) {
        console.error('レビュー取得エラー:', error)
    }
}


const submitReviewEdit = async () => {
    if (!isValid.value) return;  // バリデーションが無効な場合は何もしない
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const formData = new FormData()
        formData.append('shop_id', shop.value.id);
        formData.append('rating', rating.value)
        formData.append('review_text', reviewText.value)
        if (imageFile.value) formData.append('image', imageFile.value)

        await client(`/api/reviews/shops/${route.params.shop_id}/user`, {
            method: 'PUT',
            body: formData, // JSONではなくFormDataオブジェクトを送信
        });

        // 初期化
        rating.value = 0
        reviewText.value = ''
        imageFile.value = null
        imagePreview.value = null
        router.push(`/detail/${route.params.shop_id}`)
    } catch (error) {
        console.error('レビュー投稿:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}

onMounted(async () => {
    await getShop();
    await getUserReviewForShop();
})
</script>

<style scoped>
.review__wrapper {
    display: flex;
}

.shop__info {
    padding: 0 60px;
    flex-basis: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 2px solid #ddd;
    box-sizing: border-box;
}

.info__message {
    font-size: 32px;
}

.shop__card {
    width: 220px;
}

.review__form {
    padding: 0 60px;
    width: 60%;
    color: black;
    box-sizing: border-box;
}

.stars {
    display: flex;
    cursor: pointer;
}

.star {
    cursor: pointer;
    color: #d3d3d3; /* 非アクティブな星の色 */
}

.star.active {
  color: #f5a623; /* アクティブな星の色 */
}

.form__group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.form__group input,
.form__group textarea {
    padding: 5px 7px;
    width: 100%;
    resize: none;
    border: 1px solid ;
    border-radius: 4px;
    box-sizing: border-box; /* パディングを含めて要素の幅を100%にする */
}

.form__group textarea {
    margin-bottom: 10px;
}

.review__text__length {
    align-self: flex-end;
}

/* 画像添付▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.input__image__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: white;
}

.button__image__label {
    cursor: pointer;
    font-size: 14px;
}

.input__image {
    display: none;
}

.preview__img {
    display: block;
    width: 150px;
    height: 150px;
    margin: 10px auto 10px 0;
    object-fit: cover; /* 短い辺に合わせて拡大縮小し、中央を表示 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 見栄えのためのシャドウ */
}
/* 画像添付▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

.button__wrapper {
    display: flex;
    margin: 30px 0;
    justify-content: center;
}

.button__review__submit {
    display: inline-block; /* リンクをインラインブロックに設定 */
    height: 50px;
    width: 400px;
    font-size: 14px; /* リンクの文字サイズを設定 */
    color: #000000; /* テキストの色を白に設定 */
    background-color: #ffffff; /* ボタンの背景色を設定 */
    font-size: 18px;
    border: none;
    border-radius: 25px; /* ボタンの角を丸くする */
    text-decoration: none; /* 下線を削除 */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
    cursor: pointer;
}

.button__review__submit:disabled {
    cursor: not-allowed;
}


.error__message {
    margin: 0 0 20px 0;
    color: #ff0000;
    font-weight: bold;
}


/* タブレット＆スマホ向け（～768px） */
@media screen and (max-width: 768px) {
    .review__wrapper {
        flex-direction: column;
        gap: 30px;
    }

    .shop__info {
        border: none;
    }

    .review__form {
        padding: 0 30px;
        width: 100%;
    }

    .button__review__submit {
        width: 200px;
    }

    :deep(.modal) {
        width: 80%;
    }
}
</style>