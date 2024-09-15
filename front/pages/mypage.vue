<template>
    <h2 class="mypage__title--main">{{ user.name }}さん</h2>
    <div class="mypage__content">
        <div class="reservation__shop__content" v-if="isShowingReservations">
            <h3 class="mypage__title--sub reservation">予約状況</h3>
            <a href="" @click.prevent="toggleContent">来店履歴に切り替える</a>
            <div class="reservation__card__wrapper">
                <ul class="reservation__card__list">
                    <li v-for="reservation in reservations" class="reservation__card__item">
                        <ReservationCard :reservation="reservation"/>
                    </li>
                </ul>
            </div>
        </div>
        <div class="visit-history__shop__content" v-else>
            <h3 class="mypage__title--sub visit-history">来店履歴</h3>
            <a href="" @click.prevent="toggleContent">予約状況に切り替える</a>
            <div class="reservation__card__wrapper">
                <ul class="reservation__card__list">
                    <li v-for="visitHistory in visitHistory" class="reservation__card__item">
                        <VisitHistoryCard :visitHistory="visitHistory"/>
                    </li>
                </ul>
            </div>
        </div>
        <div class="like__shop__content">
            <h3 class="mypage__title--sub shop">お気に入り店舗</h3>
            <div class="shop__card__wrapper">
                <ul class="shop__card__list">
                    <li v-for="shop in shops" :key="shop.id" class="shop__card__item">
                        <ShopCard :shop="shop"/>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});

const { user, refreshIdentity } = useSanctumAuth()
const client = useSanctumClient()
const shops = ref()
const reservations = ref()
const visitHistory = ref()
const isShowingReservations = ref(true) // 初期表示は予約情報

// コンテンツを切り替える関数
const toggleContent = () => {
    isShowingReservations.value = !isShowingReservations.value
}

// 店舗一覧を取得する関数
const getMyPage = async () => {
    try {
        const response = await client('api/user/my-page')
        // レスポンスを直接確認する
        shops.value = response.likes
        reservations.value = response.reservations
        visitHistory.value = response.visitHistory
        console.log(response.likes)
    } catch (error) {
        console.error('店舗一覧の取得エラー:', error)
    }
}

// コンポーネントがマウントされたときに店舗一覧を取得
onMounted(() => {
    refreshIdentity()
    getMyPage()
})
</script>

<style scoped>
.mypage__content {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.mypage__title--main {
    font-size: 30px;
}

.mypage__title--sub {
    font-size: 24px;
}

/* reservation__card__list visit-history__card__list▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.reservation__shop__content,
.visit-history__shop__content {
    width: 35%;
}

.reservation__card__wrapper,
.visit-history__card__wrapper {
    width: 100%;
}

.reservation__card__list,
.visit-history__card__list {
    margin: 0;
    padding: 0;
    list-style-type: none; /* デフォルトのリストスタイルを削除 */
}

.reservation__card__item,
.visit-history__card__item {
    margin-bottom: 30px;
}
/* reservation__card__list visit-history__card__list▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */


/* shop__card__list▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */
.like__shop__content {
    width: 55%;
}

.shop__card__wrapper {
    margin-right: -20px;
}

.shop__card__list {
    list-style-type: none; /* デフォルトのリストスタイルを削除 */
    padding: 0; /* デフォルトのパディングを削除 */
    margin: 0; /* デフォルトのマージンを削除 */
    display: flex;
    flex-wrap: wrap;
}

.shop__card__item {
    margin: 0 20px 30px 0;
    width: calc(50% - 20px); /* 水平マージンを考慮して幅を調整 */
    box-sizing: border-box; /* パディングやボーダーを幅に含める */
}

.shop__card {
    width: 100%;
}
/* shop__card__list▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */

</style>