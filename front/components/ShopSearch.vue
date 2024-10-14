<template>
    <div class="search__container">
        <select class="select" v-model="selectedRegion" @change="filterShops">
        <option value="">All area</option>
        <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
        </select>

        <select class="select" v-model="selectedGenre" @change="filterShops">
        <option value="">All genre</option>
        <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
        </select>

        <label class="search__name__label">
            <img src="../public/images/icon/search.svg" alt="検索アイコン" class="search__icon" />
            <input
                type="text"
                v-model="searchName"
                @input="filterShops"
                placeholder="Search ..."
                class="search__name__input"
            />
        </label>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '~/stores/shopStore' // Piniaのストアをインポート

const regions = ref([
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
])

const shopStore = useShopStore()
const genres = computed(() => shopStore.genres)
const selectedRegion = ref('')
const selectedGenre = ref('')
const searchName = ref('')
const router = useRouter()

// フィルター処理
const filterShops = () => {
    const params = {
        region: selectedRegion.value,
        genre: selectedGenre.value,
        name: searchName.value
    }
    // クエリパラメータでページ遷移し、フィルター結果を表示
    router.push({ path: '/', query: params })
}
</script>

<style scoped>
.search__container {
    display: flex;
    width: 48%;
    padding: 8px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.select {
    width: 18%;
    font-weight: bold;
    border: none;
    border-right: 2px solid #ededed;
}

.search__name__label {
    display: flex;
    width: 64%;
    align-items: center;
}

.search__icon {
    margin: 0 8px;
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.search__name__input {
    padding: 5px;
    width: 100%;
    border: none;
}
</style>