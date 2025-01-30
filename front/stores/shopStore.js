import { defineStore } from "pinia";

export const useShopStore = defineStore("shop", {
    state: () => ({
        shops: [],
        genres: [],
        regions: [],
        selectedRegion: "",
        selectedGenre: "",
        searchName: "",
        sortBy: "",
    }),
    actions: {
        async fetchShops() {
            const client = useSanctumClient();
            try {
                const response = await client("/api/shops");
                this.shops = response.shops;
                this.genres = response.genres;
                this.regions = response.regions;
            } catch (error) {
                console.error("店舗一覧の取得エラー:", error);
            }
        },
        setSortBy(sortBy) {
            this.sortBy = sortBy;
        },
    },
});