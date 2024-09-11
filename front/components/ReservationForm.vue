<template>
    <form class="reservation__form" @submit.prevent>
        <div class="reservation__content">
            <h2 class="reservation__title" v-if="reservation">予約変更</h2>
            <h2 class="reservation__title" v-else>予約</h2>
            <div class="reservation__inputs">
                <input class="input input__date" type="date" v-model="reservationDate" :min="today">
                <p class="error__message" v-if="reservationDateError">{{ reservationDateError }}</p>
                <input class="input input__time" type="time" v-model="reservationTime">
                <p class="error__message" v-if="reservationTimeError">{{ reservationTimeError }}</p>
                <div class="select-wrapper">
                    <select class="input input-number" name="guests" v-model="reservationNumber">
                        <option value="1">1人</option>
                        <option value="2">2人</option>
                        <option value="3">3人</option>
                        <option value="4">4人</option>
                    </select>
                    <div class="custom-arrow"></div>
                </div>
                <p class="error__message" v-if="reservationNumberError">{{ reservationNumberError }}</p>
            </div>
            <table class="confirm__table" v-if="shop">
                <tr>
                    <th>Shop</th>
                    <td>{{ shopName }}</td>
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
        <button class="form__button" @click="updateReservation" :disabled="!isValid" v-if="reservation" >予約内容変更</button>
        <button class="form__button" @click="createReservation" :disabled="!isValid" v-else >予約</button>
    </form>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { defineProps } from 'vue'


const props = defineProps({
    shop: {
        type: Object,
        required: true
    },
    reservation: {
        type: Object,
        default: () => null
    }
})

const shopName = ref('')
const shop = props.shop
const reservation = props.reservation
const today = dayjs().format('YYYY-MM-DD')

//バリデーション設定▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// バリデーションスキーマの設定
const validationSchema = yup.object({
    reservationDate: yup
        .date()
        .required('予約日を入力してください')
        .min(dayjs().startOf('day'), '予約日は現在の日付以降で設定してください。'),
    reservationTime: yup
        .string()
        .required('予約時間を入力してください')
        .test(
        'is-future-time',
        '予約時間は現在の時間より1時間以上後でなければなりません。',
        (value) => {
            if (!value) return false;
            const now = dayjs();
            const reservationTime = dayjs(`${reservationDate.value} ${value}`);
            return reservationTime.isAfter(now.add(1, 'hour'));
        }
        ),
    reservationNumber: yup
        .number()
        .required('予約人数を入力してください')
        .integer('予約人数は整数で入力してください')
        .min(1, '予約人数は1人以上で入力してください'),
});

// useFormを使ってバリデーションスキーマを設定
const { meta } = useForm({
    validationSchema,
});

// 各フィールドの定義
const { value: reservationDate, errorMessage: reservationDateError } = useField('reservationDate');
const { value: reservationTime, errorMessage: reservationTimeError } = useField('reservationTime');
const { value: reservationNumber, errorMessage: reservationNumberError } = useField('reservationNumber');

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);
console.log(isValid)
//バリデーション設定▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲


const { user } = useSanctumAuth()
const client = useSanctumClient()
const router = useRouter()
const loading = ref(false)  // リクエスト中の状態を管理


// フォームの初期値を設定
const setInitialValues = () => {
    //親コンポーネント(ReservationUpdate)からreservationを受け取っていたら初期値設定
    if (reservation) {
        shopName.value = props.reservation.shop.name
        reservationDate.value = dayjs(reservation.reservation_time).format('YYYY-MM-DD')
        reservationTime.value = dayjs(reservation.reservation_time).format('HH:mm')
        reservationNumber.value = reservation.reservation_number.toString()
    } else {
        //新規予約の初期値
        const now = dayjs()
        shopName.value = props.shop.name
        reservationDate.value = now.add(1, 'day').format('YYYY-MM-DD')
        reservationTime.value = now.add(1, 'hour').format('HH:mm')
        reservationNumber.value = 1
    }
}


// 新規予約登録
const createReservation = async () => {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const reservationDateTime = `${reservationDate.value} ${reservationTime.value}:00`;
        const response = await client('/api/reservations', {
            method: 'POST',
            body: {
                user_id: user.value.id,
                shop_id: shop.id,
                reservation_time: reservationDateTime,
                reservation_number: reservationNumber.value,
            },
        })
        // 成功時の処理
        console.log(response)
        router.push({ path: '/done', query: { message: 'ご予約ありがとうございます' } });
    } catch (error) {
        console.error('新規予約登録:', error)
        // エラーハンドリング: 状態を元に戻すか、ユーザーにエラーメッセージを表示する
    } finally {
        loading.value = false;  // リクエスト終了
    }
}

// 予約内容変更
const updateReservation = async () => {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const reservationDateTime = `${reservationDate.value} ${reservationTime.value}:00`
        const response = await client(`/api/reservations/${reservation.id}`,{
            method: 'PUT',
            body: {
                user_id: user.value.id,
                shop_id: reservation.shop.id,
                reservation_time: reservationDateTime,
                reservation_number: reservationNumber.value,
            },
        })
        // 成功時の処理
        console.log(response)
        router.push({ path: '/done', query: { message: 'ご予約内容を変更いたしました' } });
    } catch (error) {
        console.error('予約内容変更:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}

onMounted(async () => {
    await setInitialValues()
})
</script>

<style scoped>
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

.reservation__title {
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

.error__message {
    margin: 0;
    color: #ff0000;
    font-weight: bold;
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