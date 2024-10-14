export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user } = useSanctumAuth();

    if (!user.value) {
        return navigateTo("/login"); // ログインしていない場合はリダイレクト
    }

    if (user.value.role !== "user") {
        return abortNavigation(); // ロールが'user'でない場合はアクセス拒否
    }
});
