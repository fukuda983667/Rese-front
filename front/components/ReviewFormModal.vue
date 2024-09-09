<template>
    <div>
        <button class="modal__open__button" @click="openModal">レビューを投稿</button>
        <div class="overlay" @click="closeModal" v-show="isModalOpen"></div>
        <div class="modal" v-show="isModalOpen">
            <form class="review__form" @submit.prevent="submitReview">
                <h2>「{{ shop.name }}」をレビュー</h2>

                <!-- 評価 -->
                <div class="form__group">
                    <h3>評価</h3>
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

                <!-- タイトル -->
                <div class="form__group">
                    <h3>
                        <label for="title">レビュータイトル</label>
                    </h3>
                    <p class="error__message" v-if="reviewTitleError">{{ reviewTitleError }}</p>
                    <input
                        type="text"
                        id="title"
                        v-model="reviewTitle"
                        placeholder="最も伝えたいポイントは何ですか？"
                    />
                </div>

                <!-- コメント -->
                <div class="form__group">
                    <h3>
                        <label for="text">レビュー内容</label>
                    </h3>
                    <p class="error__message" v-if="reviewTextError">{{ reviewTextError }}</p>
                    <textarea
                        id="text"
                        v-model="reviewText"
                        placeholder="気に入ったこと/気に入らなかったことは何ですか？"
                        rows="5"
                    ></textarea>
                </div>

                <!-- 送信ボタン -->
                <button class="button__review__submit" type="submit" :disabled="!isValid">投稿</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps({
    shop: {
        type: Object,
        required: true
    }
})

const shop = props.shop
const isModalOpen = ref(false)
const loading = ref(false);  // リクエスト中の状態を管理

const openModal = () => {
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}


// バリデーションスキーマの設定
const validationSchema = yup.object({
    rating: yup
        .number()
        .required('評価を入力してください')
        .min(1, '評価は1以上である必要があります'),
    reviewTitle: yup
        .string()
        .required('レビュータイトルを入力してください')
        .max(20, 'レビュータイトルは20文字以下で入力してください'),
    reviewText: yup
        .string()
        .required('レビュー内容を入力してください')
        .max(200, 'レビュー内容は200文字以下で入力してください'),
});

// useFormを使ってバリデーションスキーマを設定
const { meta } = useForm({
    validationSchema,
});

// 各フィールドの定義
const { value: rating, errorMessage: ratingError } = useField('rating');
const { value: reviewTitle, errorMessage: reviewTitleError } = useField('reviewTitle');
const { value: reviewText, errorMessage: reviewTextError } = useField('reviewText');

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);

// 評価を設定する関数
const setRating = (star) => {
    rating.value = star;
};


const { user } = useSanctumAuth()
const client = useSanctumClient()
const router = useRouter()

const submitReview = async () => {
    if (!isValid.value) return;  // バリデーションが無効な場合は何もしない

    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const response = await client('/api/reviews', {
            method: 'POST',
            body: {
                user_id: user.value.id,
                shop_id: shop.id,
                review_title: reviewTitle.value,
                review_text: reviewText.value,
                rating: rating.value,
            },
        })
        // 成功時の処理
        await window.location.reload();
        console.log(response);
    } catch (error) {
        console.error('レビュー投稿:', error)
        // エラーハンドリング: 状態を元に戻すか、ユーザーにエラーメッセージを表示する
    } finally {
        loading.value = false;  // リクエスト終了
    }
}
</script>

<style scoped>
.modal__open__button {
    display: inline-block;
    padding: 5px 10px;
    font-size: 12px;
    color: #fff;
    background-color: #5480f7;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
}

.modal {
    position: fixed;
    width: 700px;
    padding: 20px;
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

.review__form {
    color: black;
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
    border-top: 1px solid #ddd; /* 上のボーダー */
}

.form__group:last-of-type {
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd; /* 下のボーダー */
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

.button__review__submit {
    display: inline-block; /* リンクをインラインブロックに設定 */
    padding: 7px 14px; /* ボタンの内側の余白を設定 */
    font-size: 14px; /* リンクの文字サイズを設定 */
    color: #fff; /* テキストの色を白に設定 */
    background-color: #365ff5; /* ボタンの背景色を設定 */
    border: none;
    border-radius: 4px; /* ボタンの角を丸くする */
    text-decoration: none; /* 下線を削除 */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
    cursor: pointer;
}


.error__message {
    margin: 0 0 20px 0;
    color: #ff0000;
    font-weight: bold;
}
</style>