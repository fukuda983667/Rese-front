<template>
    <div>
        <button class="modal__open__button" @click="openModal">QRコード</button>
        <div class="overlay" v-show="isModalOpen" @click="closeModal"></div>
        <div class="modal" v-show="isModalOpen">
            <div v-if="qrCodeDataUrl" class="qr-code-display">
                <img :src="qrCodeDataUrl" alt="Reservation QR Code" />
            </div>
        </div>
    </div>
</template>

<script setup>
import QRCode from 'qrcode';

const props = defineProps({
    reservation: {
        type: Object,
        required: true
    }
});

const isModalOpen = ref(false);
const qrCodeDataUrl = ref(null);

const openModal = () => {
    isModalOpen.value = true;
    generateQRCode();
};

const closeModal = () => {
    isModalOpen.value = false;
};

function generateQRCode() {
    const reservationInfo = `
        店名: ${props.reservation.shop.name}
        日付: ${props.reservation.reservation_time.split(' ')[0]}
        時間: ${props.reservation.reservation_time.split(' ')[1].slice(0, 5)}
        人数: ${props.reservation.reservation_number}人
    `;
    QRCode.toDataURL(reservationInfo, { width: 200, margin: 2 }, (err, url) => {
        if (!err) {
            qrCodeDataUrl.value = url;
        } else {
            console.error("QRコードの生成に失敗しました:", err);
        }
    });
}
</script>

<style scoped>
.modal__open__button {
    display: inline-block;
    padding: 5px 10px;
    font-size: 12px;
    color: #fff;
    background-color: #5480f7;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    text-align: center;
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

.qr-code-display img {
    width: 100%;
    height: auto;
    margin-top: 10px;
}
</style>