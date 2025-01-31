# Rese-front

飲食店の予約管理SPAアプリです。
※フロントとバック両方の環境構築が必要です。

![サンプル画像](/front/public/images/ホーム画面.png)

## 前提条件
- Dockerがインストールされていること
- Docker Composeがインストールされていること

## 環境構築

1. リポジトリをクローンしたい任意のディレクトリで以下のコマンドを実行してください。

    ```bash
    git clone https://github.com/fukuda983667/Rese-front
    ```

2. クローンしたRese-frontディレクトリに移動

    ```bash
    cd Rese-front
    ```

3. Docker Composeを使用してコンテナを作成・起動します。※Docker Descktop起動時に実行してください。

    ```bash
    docker-compose up -d --build
    ```

4. Rese-backの環境構築に移ってください。https://github.com/fukuda983667/Rese-back

5. アプリケーションがhttp://localhost:3000 で利用可能になります。
   ※Rese-backの環境構築が必要です。

## 仕様技術(実行環境)

- Nuxt3 : 3.12.4
- docker-compose.yml : 3.9

## URL

- phpMyAdmin : http://localhost:8081
- 開発環境(ホームページ) : http://localhost:3000
- 一般ユーザ登録画面 : http://localhost:3000/register
- 一般ユーザログイン画面 : http://localhost:3000/login
- 管理者ユーザ登録画面 : http://localhost:3000/admin/register
- 管理者ユーザログイン画面 : http://localhost:3000/admin/login
- 店舗運営者ユーザ登録画面 : http://localhost:3000/vendor/login

## 追加機能について

1. 口コミ機能 : http://localhost:3000/reviews/{shop_id}

    口コミを投稿できる条件はその店舗の予約時間が過ぎていること。

    予約後にphpMyAdminでreservationsテーブルのreservation_timeカラムの値を過去の日付にして確認してください。

   管理者による口コミ削除ができるページは店舗一覧画面から店舗名のリンクを踏んでください。

3. csvインポート機能 : http://localhost:3000/vendor/shops/create

    [sample.csv](https://github.com/fukuda983667/Rese-front/blob/main/sample.csv)を参考に、2行目に[,]区切りでヘッダーに対応するよう記述してください。

## ローカルリポジトリの削除  
`git clone`したローカルリポジトリを完全に削除します。  
```
sudo rm -rf Rese-front
```
