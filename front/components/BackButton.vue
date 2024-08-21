<template>
    <button @click="goBack" class="back__button">
        <
    </button>
</template>

<script setup>
const router = useRouter()

const goBack = () => {
    router.back()
}
</script>

<style scoped>
.back__button {
    padding-top: 1px;
    width: 30px;
    height: 30px;
    background-color: #fff;
    font-size: 20px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); /* ボタンの右下に影を追加 */
    cursor: pointer;
}
</style>