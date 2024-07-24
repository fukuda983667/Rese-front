// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["nuxt-sanctum-auth"],
  ssr: false, // このパッケージは、SSR対応していないので追加
  nuxtSanctumAuth: {
    token: false, // token認証ならここをTrueにするが、今回はクッキー認証なのでfalse
    baseUrl: "http://localhost:8080", // Laravel側のローカルサーバーに合わせて設定
    endpoints: {
      csrf: "/sanctum/csrf-cookie", // csrf-tokenをサーバーからGETするURL。Laravelの設定がデフォルトならこれ
      login: "/api/login", // ログイン用、サーバーにPOSTするURL。
      logout: "/api/logout", // ログアウト用、サーバーにPOSTするURL。今回は使わない
      user: "/api/user", // ユーザー情報をサーバーからGETするURL
      users: "/api/users",
    },
    csrf: {
      headerKey: "X-XSRF-TOKEN",
      cookieKey: "XSRF-TOKEN",
      tokenCookieKey: "nuxt-sanctum-auth-token", // デフォルトならこのままでOK
    },
    redirects: {
      home: "/show", // ログイン後などでリダイレクト
      login: "/login", // ログインページ
      logout: "/", // ログアウト後
    },
  },
});
