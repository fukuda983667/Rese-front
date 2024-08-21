# Rese-front

飲食店の予約管理アプリです。

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

- 開発環境(ホームページ) : http://localhost:3000
- マイページ : http://localhost:3000/mypage
- メニュー : http://localhost:3000/menu
- 店舗詳細 : http://localhost:3000/detail/id
- ユーザ登録ページ : http://localhost:3000/register
- ログインページ : http://localhost:3000/login

## ローカルリポジトリの削除  
`git clone`したローカルリポジトリを完全に削除します。  
```
sudo rm -rf Rese-front
```
