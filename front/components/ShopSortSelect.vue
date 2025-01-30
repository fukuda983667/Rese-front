<template>
    <div class="sort__select__container">
        <select class="select" v-model="selectedSort" @change="setSort">
            <option value="">ランダム</option>
            <option value="high-rating">評価が高い順</option>
            <option value="low-rating">評価が低い順</option>
        </select>
    </div>
</template>

<script setup>
import { useShopStore } from '~/stores/shopStore'

const shopStore = useShopStore()

// ソート選択
const selectedSort = computed({
    get: () => shopStore.sortBy,
    set: (value) => shopStore.setSortBy(value),
})

</script>

<style scoped>
.sort__select__container {
    display: flex;
    padding: 8px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.select {
    font-weight: bold;
    border: none;
    cursor: pointer;
}

.select:focus {
    outline: none;
}
</style>
