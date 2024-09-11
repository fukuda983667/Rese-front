<template>
    <div>
        <button class="modal__open__button" @click="openModal">予約内容変更</button>
        <div class="overlay" @click="closeModal" v-show="isModalOpen"></div>
        <div class="modal" v-show="isModalOpen">
            <ReservationForm :shop="reservation.shop" :reservation="reservation" @close="closeModal"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    reservation: {
        type: Object,
        required: true
    }
})

const isModalOpen = ref(false)

const openModal = () => {
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}
</script>

<style scoped>
.modal__open__button {
    display: inline-block; /* リンクをインラインブロックに設定 */
    padding: 5px 10px; /* ボタンの内側の余白を設定 */
    font-size: 12px; /* リンクの文字サイズを設定 */
    color: #fff; /* テキストの色を白に設定 */
    background-color: #5480f7; /* ボタンの背景色を設定 */
    border: none;
    border-radius: 4px; /* ボタンの角を丸くする */
    text-decoration: none; /* 下線を削除 */
    cursor: pointer;
}

.modal {
    position: fixed;
    width: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.reservation__form {
    width: 500px;
}
</style>