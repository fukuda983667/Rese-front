import { defineStore } from "pinia";

export const useShopStore = defineStore("shop", {
    state: () => ({
        shops: [],
        genres: [],
        selectedRegion: "",
        selectedGenre: "",
        searchName: "",
    }),
    actions: {
        async fetchShops() {
        const client = useSanctumClient();
        try {
            const response = await client("/api/shops");
            this.shops = response.shops;
            this.genres = response.genres; //検索機能用ジャンル配列(被りなし)
        } catch (error) {
            console.error("店舗一覧の取得エラー:", error);
        }
        },
    },
});
