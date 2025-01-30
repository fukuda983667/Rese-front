<template>
    <div class="search__container">
        <select class="select" v-model="shopStore.selectedRegion" @change="filterShops">
            <option value="">All area</option>
            <option v-for="region in shopStore.regions" :value="region">{{ region }}</option>
        </select>

        <select class="select" v-model="shopStore.selectedGenre" @change="filterShops">
            <option value="">All genre</option>
            <option v-for="genre in shopStore.genres" :value="genre">{{ genre }}</option>
        </select>

        <label class="search__name__label">
            <img src="../public/images/icon/search.svg" alt="検索アイコン" class="search__icon" />
            <input
                type="text"
                v-model="shopStore.searchName"
                @input="filterShops"
                placeholder="Search ..."
                class="search__name__input"
            />
        </label>
    </div>
</template>

<script setup>
import { useShopStore } from '~/stores/shopStore' // Piniaのストアをインポート
import { useRouter } from 'vue-router'

const shopStore = useShopStore()
const router = useRouter()

// デバッグ用: ストアの内容を確認
console.log(shopStore.genres.value);
console.log(shopStore.regions.value);

// フィルター処理
const filterShops = () => {
    console.log('Selected Region:', shopStore.selectedRegion);
    console.log('Selected Genre:', shopStore.selectedGenre);


    const params = {
        region: shopStore.selectedRegion,
        genre: shopStore.selectedGenre,
        name: shopStore.searchName,
    }
    // クエリパラメータでページ遷移し、フィルター結果を表示
    router.push({ path: '/', query: params })
}
</script>

<style scoped>
.search__container {
    display: flex;
    width: 450px;
    padding: 8px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
}

.select {
    width: 85px;
    font-weight: bold;
    border: none;
    border-right: 2px solid #ededed;
    cursor: pointer;
}

.select:focus {
    outline: none;
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