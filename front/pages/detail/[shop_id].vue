<template>
    <div class="main__content">
        <div v-if="shop" class="shop__detail">
            <div class="shop__header">
                <BackButton />
                <h1 class="shop__name">{{ shop.name }}</h1>
            </div>
            <div class="shop__img">
                <img :src="`/images/shop/${shop.image_url}`" alt="">
            </div>
            <div class="shop__details">
                <p class="shop__region">#{{ shop.region }}</p>
                <p class="shop__genre">#{{ shop.genre }}</p>
            </div>
            <p class="shop__description">{{ shop.description }}</p>
        </div>

        <form class="reservation__form">
            <div class="reservation__content">
                <h2 class="reservation__tittle">予約</h2>
                <div class="reservation__inputs">
                    <input class="input input__date" type="date" v-model="reservationDate">
                    <input class="input input__time" type="time" v-model="reservationTime">
                    <div class="select-wrapper">
                        <select class="input input-number" name="guests" v-model="reservationNumber">
                            <option value="1">1人</option>
                            <option value="2">2人</option>
                            <option value="3">3人</option>
                            <option value="4">4人</option>
                        </select>
                        <div class="custom-arrow"></div>
                    </div>
                </div>
                <table class="confirm__table" v-if="shop">
                    <tr>
                        <th>Shop</th>
                        <td>{{ shop.name }}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td>{{ reservationDate }}</td>
                    </tr>
                    <tr>
                        <th>Time</th>
                        <td>{{ reservationTime }}</td>
                    </tr>
                    <tr>
                        <th>Number</th>
                        <td>{{ reservationNumber }}人</td>
                    </tr>
                </table>
            </div>
            <button class="form__button" @click="formSubmit">予約する</button>
        </form>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
    layout: 'default',
});
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

// ルート情報を取得
const route = useRoute();
const router = useRouter();
const shop = ref(null);
const reservationDate = ref('');
const reservationTime = ref('');
const reservationNumber = ref('1');
const client = useSanctumClient()
const { user } = useSanctumAuth()
const loading = ref(false)  // リクエスト中の状態を管理

// 店舗情報を取得する関数
const getShop = async () => {
    try {
        const response = await client(`/api/shops/${route.params.shop_id}`)
        shop.value = response.shop
    } catch (error) {
        console.error('店舗情報取得エラー:', error)
    }
}

// 予約フォーム送信
const formSubmit = async () => {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const reservationDateTime = `${reservationDate.value} ${reservationTime.value}:00`;
        const response = await client('/api/reservations', {
            method: 'POST',
            body: {
                user_id: user.value.id,
                shop_id: shop.value.id,
                reservation_time: reservationDateTime,
                reservation_number: reservationNumber.value,
            },
        })
        // 成功時の処理
        console.log(response)
        router.push('/done'); // 成功時に /done に遷移
    } catch (error) {
        console.error('予約フォーム送信エラー:', error)
        // エラーハンドリング: 状態を元に戻すか、ユーザーにエラーメッセージを表示する
    } finally {
        loading.value = false;  // リクエスト終了
    }
}


onMounted(() => {
    getShop();

    const now = dayjs(); // 現在の日付と時刻を dayjs で取得
    reservationDate.value = now.format('YYYY-MM-DD'); // 現在の日付
    reservationTime.value = now.add(1, 'hour').format('HH:mm'); // 現在時刻の1時間後
});
</script>


<style scoped>
.main__content {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

/* 店舗情報▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.shop__detail, .reservation__form {
    width: 46%;
}

.shop__header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px; /* ボタンと見出しの間のスペース */
}

.shop__name {
    margin: 0;
}

.shop__img img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 画像のトリミングを行う */
}

.shop__details {
    display: flex; /* 横並びにする */
    margin-top: 15px;
    gap: 5px; /* 要素間のスペースを追加 */
}
/* 店舗情報▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

/* 予約フォーム▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.reservation__form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #365ff5;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.reservation__content {
    padding: 30px 25px;
    box-sizing: border-box; /* パディングやボーダーを幅に含める */
    border-top-left-radius: 5px; /* 左上の角を丸くする */
    border-top-right-radius: 5px; /* 右上の角を丸くする */
}

.reservation__tittle {
    margin: 0;
    color: #fff;
}


/* 入力欄▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽ */
.reservation__inputs {
    display: flex;
    margin-top: 20px;
    flex-direction: column;
    gap: 15px; /* 入力フィールド間のスペース */
}

.input {
    padding: 5px;
    height: 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
}

.input__date,
.input__time {
    font-weight: bold;
}

.input__date {
    width: 30%;
}

/* セレクトボックスのラッパー */
.select-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

/* セレクトボックスのスタイル */
.input-number {
    width: 100%;
    height: 30px;
    appearance: none
}

/* カスタム矢印のスタイル */
.custom-arrow {
    position: absolute;
    top: 50%;
    right: 0.5rem;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-top: 0.5rem solid #333; /* 矢印の色 */
    transform: translateY(-50%);
    pointer-events: none; /* 矢印のクリックを無効化 */
}
/* 入力欄△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△ */

/* 予約内容確認欄▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽▽ */
.confirm__table {
    margin-top: 20px;
    padding: 20px 15px;
    width: 100%;
    background-color: #5480f7;
    border-radius: 5px;
}

th, td {
    color: #fff;
    font-weight: 400;
    text-align: left;
}
/* 予約内容確認欄△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△△ */

.form__button {
    padding: 15px;
    width: 100%;
    background-color: #003df2;
    color: #fff; /* テキストの色を白に設定 */
    font-size: 16px;
    border: none;
    cursor: pointer;
    border-bottom-left-radius: 5px; /* 左上の角を丸くする */
    border-bottom-right-radius: 5px; /* 右上の角を丸くする */
}
/* 予約フォーム▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
</style>