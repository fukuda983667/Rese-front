<template>
    <button @click="goBack" class="back__button">
        <span class="line x"></span>
        <span class="line y"></span>
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
    width: 36px;
    height: 36px;
    background-color: #f53636; /* 背景色を青色に設定 */
    border: none;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3); /* ボタンの右下に影を追加 */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
}

.back__button:hover {
    background-color: #d02e2e; /* ホバー時の背景色を設定 */
}

.line {
    position: absolute;
    background-color: white;
}

.x {
    width: 22px;
    height: 1px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
}

.y {
    width: 1px;
    height: 22px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
}
</style>