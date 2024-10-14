<template>
    <div class="menu__container">
        <NuxtLink to="/vendor/menu" class="hamburger">
        <span class="line long"></span>
        <span class="line"></span>
        <span class="line short"></span>
        </NuxtLink>
        <h1 class="title">Rese</h1>
    </div>
</template>

<style scoped>
.menu__container {
    display: flex;
    align-items: center;
}

.hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 36px;
    height: 36px;
    padding: 8px;
    background-color: #f4cb36;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3); /* ボタンの右下に影を追加 */
    margin-right: 10px; /* ボタンと文字の間にスペースを追加 */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
}

.hamburger .line {
    height: 1px;
    background-color: white; /* ラインを白色に設定 */
}

.hamburger .line.short {
    width: 33.33%; /* 最下部のラインの長さを1/3に設定 */
}

.hamburger .line.long {
    width: 66.67%; /* 最上部のラインの長さを2/3に設定 */
}

.hamburger .line:nth-child(2) {
    width: 100%; /* 真ん中のラインの長さを1に設定 */
}

.hamburger:hover {
    background-color: #b69b3a; /* ホバー時の背景色を設定 */
}

.title {
    margin: 0;
    font-size: 27px; /* 必要に応じて文字サイズを調整 */
    color: #f4cb36;
}
</style>