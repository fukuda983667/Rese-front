<template>
    <div class="reservation__card">
        <div class="reservation__card__header">
            <div class="reservation__card__tittle">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="width:24px;height:24px;opacity:1" viewBox="0 0 512 512"><path d="M437.021 74.961C390.767 28.69 326.639-.018 256 0 185.388-.018 121.233 28.69 74.979 74.961 28.68 121.224-.017 185.388 0 255.991c-.017 70.621 28.68 134.776 74.979 181.021C121.233 483.31 185.388 512.018 256 512c70.638.018 134.767-28.69 181.021-74.988 46.281-46.245 74.997-110.4 74.979-181.021.018-70.603-28.698-134.767-74.979-181.03zm46.627 171.703v21.692l-33.65.009-.009-21.701h33.659zm-54.218-76.741-10.851-18.796 29.142-16.83 10.85 18.778-29.141 16.848zm-.008 175.193 29.15 16.83-10.85 18.778-29.142-16.821 10.842-18.787zm-162.58 106.378v33.667h-21.683v-33.667h21.683zM245.159 63.526V29.868h21.683v33.658h-21.683zM362.38 420.094l16.838 29.142-18.787 10.841-16.83-29.141 18.779-10.842zm-193.963 10.842-16.847 29.141-18.787-10.841 16.847-29.16 18.787 10.86zM132.784 65.785l18.787-10.842L168.4 84.102l-18.787 10.842-16.829-29.159zm27.112 119.753c5.758-7.874 15.962-10.195 22.773-5.19l72.747 50.665 94.227-100.665c5.73-6.431 14.907-7.626 20.496-2.649 5.589 4.969 5.492 14.225-.248 20.664L269.074 267.63c-.177.195-.372.328-.549.522-6.271 6.91-15.696 9.009-22.799 5.05-.177-.08-.336-.186-.514-.284-.381-.23-.788-.389-1.143-.655l-82.251-63.455c-6.82-5.006-7.679-15.431-1.922-23.27zM343.601 84.102l16.83-29.158 18.787 10.842-16.811 29.159-18.806-10.843zM82.588 169.923l-29.159-16.848 10.85-18.778 29.15 16.838-10.841 18.788zM62.02 246.682v21.684l-33.667-.009v-21.692l33.667.017zm20.577 98.434 10.851 18.787-29.169 16.821-10.85-18.778 29.168-16.83z" style="fill:#fff"/></svg>
                <!-- new_idはユーザが登録中の予約に新規で割り振られてる -->
                <span>予約{{ reservation.new_id }}</span>
            </div>
            <ReservationDeleteButton :reservationId="reservation.id" />
        </div>
        <table class="confirm__table" v-if="reservation">
            <tr>
                <th>Shop</th>
                <td>{{ reservation.shop.name }}</td>
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
                <td>{{ reservation.reservation_number }}人</td>
            </tr>
        </table>
        <div class="button__wrapper">
            <ReservationUpdateButton :reservation="reservation" />
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
// props から shop オブジェクトを取得
const props = defineProps({
    reservation: {
        type: Object,
        required: true
    },
})

// reservation.reservation_timeを分割して、日付と時間に分ける
const reservationDate = computed(() => {
    if (props.reservation && props.reservation.reservation_time) {
        return props.reservation.reservation_time.split(' ')[0];
    }
    return '';
});

const reservationTime = computed(() => {
    if (props.reservation && props.reservation.reservation_time) {
        const time = props.reservation.reservation_time.split(' ')[1];
        return time.slice(0, 5); // HH:ii形式で表示
    }
    return '';
});
</script>

<style scoped>
.reservation__card {
    padding: 20px 25px;
    background-color: #365ff5;
    border-radius: 5px;
}

.reservation__card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.reservation__card__tittle {
    display: flex;
    align-items: center;
}

.reservation__card__tittle span {
    display: inline-block;
    margin-left: 30px;
    font-size: 14px;
}

.confirm__table {
    margin-top: 10px;
    width: 100%;
    border-spacing: 0 8px; /* 行間に10pxのスペースを追加 */
}

th, td {
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
}

.button__wrapper {
    display: flex;
    justify-content: space-between;
}
</style>