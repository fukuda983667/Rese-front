import dayjs from "dayjs";
import { defineNuxtPlugin } from "#app";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/ja"; // 日本語ロケールをインポート

dayjs.extend(weekday);
dayjs.locale("ja");

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide("formatDate", (value) => {
        const date = dayjs(value);
        return date.format("YYYY.M.D(ddd.)"); // 日本語の曜日を含むフォーマット
    });
});
