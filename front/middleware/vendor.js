export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user } = useSanctumAuth();

    if (!user.value) {
        return navigateTo("/login"); // ログインしていない場合はリダイレクト
    }

    if (user.value.role !== "vendor") {
        return abortNavigation(); // ロールが'vendor'でない場合はアクセス拒否
    }
});
