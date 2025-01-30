<template>
    <div class="visit-history__card">
        <div class="visit-history__card__header">
            <div class="visit-history__card__tittle">
                <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="width:24px;height:24px;opacity:1" viewBox="0 0 512 512"><path d="M290.609 330.891c1.828-15.5 1.375-26.453-20.672-48.313 0 0-25.25-25.25-39.531-39.547-11.938-11.922-29.766 5.063-17.547 17.281l41.406 41.406a6.78 6.78 0 0 1 0 9.578l-1.281 1.281a6.753 6.753 0 0 1-9.578 0l-41.594-41.594c-6.828-6.828-13.469-4.266-17.859.141-4.406 4.391-6.953 11.016-.141 17.844l41.609 41.594c2.641 2.656 2.641 6.938 0 9.578l-1.281 1.281a6.753 6.753 0 0 1-9.578 0l-41.406-41.406c-12.219-12.219-29.219 5.609-17.281 17.547 14.281 14.297 39.531 39.547 39.531 39.547 21.875 22.031 32.828 22.484 48.344 20.656 12.484-1.453 21.609-4.266 35.281 9.422l120.422 120.406 20.984-20.984-120.421-120.406c-13.672-13.687-10.86-22.812-9.407-35.312zM391.813 274.875a338351.678 338351.678 0 0 1-92.625-92.641c-15.25-15.234-40 1.906-26.672 26.672 8.891 16.516 26.672 57.141 49.516 85.703 22.859 28.563 44.75 23.813 67.625 29.516l16.625 7.172 84.734 84.734 20.875-20.875.109-.094c-3.516-3.531-77.5-77.515-120.187-120.187zM222.141 120.156c19.484 0 37.625 5.297 53.359 14.438l8.688-14.906c-18.219-10.594-39.406-16.797-62.047-16.797-68.297.015-123.641 55.359-123.657 123.656 0 22.625 6.203 43.828 16.797 62.047l14.922-8.688c-9.141-15.719-14.453-33.891-14.453-53.359 0-29.406 11.891-55.953 31.156-75.234 19.282-19.266 45.828-31.157 75.235-31.157z" class="st0" style="fill:#fff"/><path d="M222.141 418.5c-53.047-.016-100.938-21.453-135.719-56.219-34.766-34.781-56.219-82.687-56.234-135.734.015-53.047 21.468-100.953 56.234-135.734 34.781-34.766 82.672-56.203 135.719-56.219 53.047.016 100.953 21.453 135.734 56.219 34.75 34.781 56.219 82.688 56.219 135.734 0 14.313-1.609 28.234-4.578 41.641l24.688 24.703c6.547-20.953 10.078-43.234 10.078-66.344 0-122.688-99.438-222.141-222.141-222.141C99.453 4.406 0 103.859 0 226.547s99.453 222.141 222.141 222.141c27.969 0 54.703-5.219 79.359-14.641l-23.75-23.75a192.055 192.055 0 0 1-55.609 8.203z" class="st0" style="fill:#fff"/><path d="m404.25 353.688-7.828-7.844-12.234-5.281c-2.188-.516-4.438-.906-6.719-1.281-5.938 8.156-12.469 15.875-19.594 23a192.556 192.556 0 0 1-20 17.375l21.5 21.5c17.188-13.532 32.328-29.516 44.875-47.469z" class="st0" style="fill:#fff"/></svg>
                <!-- new_idはユーザが登録中の予約に新規で割り振られてる -->
                <span>来店履歴{{ visitHistory.new_id }}</span>
            </div>
        </div>
        <table class="visit-history__description__table" v-if="visitHistory">
            <tr>
                <th>Shop</th>
                <td>{{ visitHistory.shop.name }}</td>
            </tr>
            <tr>
                <th>Date</th>
                <td>{{ visitHistoryDate }}</td>
            </tr>
            <tr>
                <th>Time</th>
                <td>{{ visitHistoryTime }}</td>
            </tr>
            <tr>
                <th>Number</th>
                <td>{{ visitHistory.reservation_number }}人</td>
            </tr>
        </table>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
// props から shop オブジェクトを取得
const props = defineProps({
    visitHistory: {
        type: Object,
        required: true
    },
})

// visitHistory.reservation_timeを分割して、日付と時間に分ける
const visitHistoryDate = computed(() => {
    if (props.visitHistory && props.visitHistory.reservation_time) {
        return props.visitHistory.reservation_time.split(' ')[0];
    }
    return '';
});

const visitHistoryTime = computed(() => {
    if (props.visitHistory && props.visitHistory.reservation_time) {
        const time = props.visitHistory.reservation_time.split(' ')[1];
        return time.slice(0, 5); // HH:ii形式で表示
    }
    return '';
});
</script>

<style scoped>
.visit-history__card {
    padding: 20px 25px;
    background-color: #365ff5;
    border-radius: 5px;
}

.visit-history__card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
}

.visit-history__card__tittle {
    display: flex;
    align-items: center;
}

.visit-history__card__tittle span {
    display: inline-block;
    margin-left: 30px;
    font-size: 14px;
}

.visit-history__description__table {
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
</style>