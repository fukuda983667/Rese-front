<template>
    <div class="card">
        <p class="message">ご予約ありがとうございます</p>
        <NuxtLink class="link" to="/">戻る</NuxtLink>
    </div>
</template>

<style scoped>
.card {
    background-color: #fff; /* 背景色を白に設定 */
    padding: 100px 25px; /* 内側の余白を追加 */
    border-radius: 5px; /* 角を丸くする */
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); /* 軽い影を追加 */
    max-width: 400px; /* カードの最大幅を設定 */
    margin: 20px auto; /* 上下に余白を追加し、中央揃え */
    text-align: center; /* テキストを中央揃え */
}

.message {
    margin: 0 0 30px 0; /* メッセージとリンクの間にスペースを追加 */
    font-size: 24px; /* メッセージの文字サイズを設定 */
}

.link {
    display: inline-block; /* リンクをインラインブロックに設定 */
    padding: 10px 20px; /* ボタンの内側の余白を設定 */
    font-size: 16px; /* リンクの文字サイズを設定 */
    color: #fff; /* テキストの色を白に設定 */
    background-color: #365ff5; /* ボタンの背景色を設定 */
    border-radius: 4px; /* ボタンの角を丸くする */
    text-decoration: none; /* 下線を削除 */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */
}

.link:hover {
    background-color: #0056b3; /* ホバー時の背景色を設定 */
}
</style>